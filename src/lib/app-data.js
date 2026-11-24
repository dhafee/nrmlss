import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  biomarker,
  dailySnapshot,
  device,
  domain,
  domainBiomarker,
  domainStatus,
  insight,
  labPanel,
  timelineEvent,
} from "@/db/schema";

function titleCaseStatus(status) {
  if (!status) return "Steady";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function availabilityLabel(value) {
  if (value === "available") return "Available";
  if (value === "waitlist") return "Waitlist";
  return "Coming soon";
}

function formatTimelineTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatTopbarDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatSyncedLabel(lastSyncedAt) {
  if (!lastSyncedAt) return "Band not synced";
  const minutes = Math.max(
    0,
    Math.round((Date.now() - new Date(lastSyncedAt).getTime()) / 60000),
  );
  if (minutes <= 1) return "Band synced just now";
  if (minutes < 60) return `Band synced ${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return `Band synced ${hours}h ago`;
}

function strainRoom(strain) {
  if (strain == null) return "—";
  if (strain < 8) return "Low";
  if (strain < 14) return "Moderate";
  return "High";
}

function recoveryLabel(percent) {
  if (percent == null) return "—";
  if (percent >= 85) return "High";
  if (percent >= 65) return "Steady";
  return "Low";
}

export async function getAppDashboardData(userId) {
  const today = new Date().toISOString().slice(0, 10);

  const [
    devices,
    snapshots,
    domainRows,
    domainStatusRows,
    domainMarkerRows,
    insights,
    timeline,
    panels,
  ] = await Promise.all([
    db.select().from(device).where(eq(device.userId, userId)).limit(1),
    db
      .select()
      .from(dailySnapshot)
      .where(eq(dailySnapshot.userId, userId))
      .orderBy(desc(dailySnapshot.date))
      .limit(1),
    db.select().from(domain).where(eq(domain.isActive, true)).orderBy(asc(domain.sortOrder)),
    db
      .select()
      .from(domainStatus)
      .where(and(eq(domainStatus.userId, userId), eq(domainStatus.date, today))),
    db
      .select({
        domainId: domainBiomarker.domainId,
        biomarkerId: domainBiomarker.biomarkerId,
        sortOrder: domainBiomarker.sortOrder,
        name: biomarker.name,
        shortName: biomarker.shortName,
      })
      .from(domainBiomarker)
      .innerJoin(biomarker, eq(domainBiomarker.biomarkerId, biomarker.id))
      .orderBy(asc(domainBiomarker.sortOrder)),
    db
      .select()
      .from(insight)
      .where(
        and(
          eq(insight.userId, userId),
          eq(insight.activeOn, today),
          eq(insight.isDismissed, false),
        ),
      )
      .orderBy(asc(insight.createdAt)),
    db
      .select()
      .from(timelineEvent)
      .where(eq(timelineEvent.userId, userId))
      .orderBy(asc(timelineEvent.occurredAt))
      .limit(12),
    db
      .select()
      .from(labPanel)
      .where(eq(labPanel.isActive, true))
      .orderBy(asc(labPanel.sortOrder)),
  ]);

  const snapshot = snapshots[0] || null;
  const pairedDevice = devices[0] || null;
  const statusByDomain = Object.fromEntries(
    domainStatusRows.map((row) => [row.domainId, row]),
  );
  const markersByDomain = domainMarkerRows.reduce((acc, row) => {
    if (!acc[row.domainId]) acc[row.domainId] = [];
    acc[row.domainId].push(row.shortName || row.name);
    return acc;
  }, {});

  const domains = domainRows.map((row) => {
    const statusRow = statusByDomain[row.id];
    return {
      id: row.id,
      title: row.title,
      summary: statusRow?.summary || row.description || "",
      status: titleCaseStatus(statusRow?.status || "steady"),
      markers: markersByDomain[row.id] || [],
    };
  });

  return {
    dateLabel: formatTopbarDate(),
    syncedLabel: formatSyncedLabel(pairedDevice?.lastSyncedAt),
    deviceName: pairedDevice?.name || "No band paired",
    today: snapshot
      ? {
          readiness: snapshot.readiness,
          sleepScore: snapshot.sleepScore,
          restingHr: snapshot.restingHr,
          hrvMs: snapshot.hrvMs,
          strain: snapshot.strain,
          recoveryPercent: snapshot.recoveryPercent,
          sleepDebtMinutes: snapshot.sleepDebtMinutes,
          stressLevel: snapshot.stressLevel || "—",
          summary: snapshot.summary || "",
          primaryActionTitle: snapshot.primaryActionTitle || "Review today’s plan",
          primaryActionBody:
            snapshot.primaryActionBody ||
            "Your coach priorities are ready when you are.",
          strainRoom: strainRoom(snapshot.strain),
          recoveryLabel: recoveryLabel(snapshot.recoveryPercent),
        }
      : null,
    domains,
    timeline: timeline.map((event) => ({
      id: event.id,
      time: formatTimelineTime(event.occurredAt),
      title: event.title,
      body: event.body || "",
    })),
    insights: [...insights]
      .sort((a, b) => {
        const rank = { high: 0, medium: 1, low: 2 };
        return (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
      })
      .map((item) => ({
        id: item.id,
        title: item.title,
        body: item.body,
        tag: item.tag || titleCaseStatus(item.kind),
        kind: item.kind,
        priority: item.priority || "medium",
        domainId: item.domainId || null,
      })),
    labPanels: panels.map((panel) => ({
      id: panel.id,
      title: panel.title,
      count: String(panel.biomarkerCount),
      status: availabilityLabel(panel.availability),
      description: panel.description,
    })),
  };
}
