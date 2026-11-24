"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import BrandIcon from "@/components/BrandIcon/BrandIcon";
import CoachChat from "@/components/CoachChat/CoachChat";
import MetricSpark from "@/components/MetricSpark/MetricSpark";
import { signOut } from "@/lib/auth-client";

const navItems = [
  { id: "today", label: "Today" },
  { id: "recovery", label: "Recovery" },
  { id: "domains", label: "Domains" },
  { id: "labs", label: "Labs" },
  { id: "coach", label: "Coach" },
];

function statusTone(status) {
  const map = {
    Ready: "good",
    Good: "good",
    Steady: "steady",
    Watch: "watch",
    Caution: "caution",
    Available: "good",
    Waitlist: "watch",
    "Coming soon": "watch",
  };
  return map[status] || "steady";
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "NR";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatNumber(value, fallback = "—") {
  if (value == null || Number.isNaN(Number(value))) return fallback;
  const num = Number(value);
  return Number.isInteger(num) ? String(num) : num.toFixed(1);
}

function priorityLabel(priority) {
  if (priority === "high") return "High";
  if (priority === "low") return "Low";
  return "Medium";
}

const TODAY_RANGES = ["24h", "Week"];

function domainInitial(title = "") {
  return title.trim().slice(0, 1).toUpperCase() || "·";
}

function MetricIcon({ kind }) {
  if (kind === "bars") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <rect x="2" y="8" width="2.5" height="6" rx="0.6" fill="currentColor" />
        <rect x="6.75" y="4" width="2.5" height="10" rx="0.6" fill="currentColor" />
        <rect x="11.5" y="6" width="2.5" height="8" rx="0.6" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "pulse") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M1 8h3l1.5-3.5L8 13l2-5h5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2 11c2-4 3-6 4.2-6 1.4 0 1.6 5 3.2 5S12 5 14 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TodayMetricCard({ metric }) {
  const tip =
    metric.value === "—"
      ? ""
      : metric.unit && !String(metric.value).includes(metric.unit)
        ? `${metric.value}${metric.unit === "bpm" || metric.unit === "ms" ? ` ${metric.unit}` : metric.unit.startsWith("/") ? metric.unit : ""}`
        : String(metric.value);

  return (
    <article className="app-metric-card">
      <div className="app-metric-card-head">
        <span className={`app-metric-icon app-metric-icon--${metric.tone}`}>
          <MetricIcon kind={metric.icon} />
        </span>
        <div className="app-metric-card-copy">
          <p className="app-metric-card-label">{metric.label}</p>
          <div className="app-metric-card-value">
            <strong>{metric.value}</strong>
            {metric.value !== "—" && metric.unit ? (
              <small>{metric.unit}</small>
            ) : null}
          </div>
        </div>
      </div>
      <MetricSpark
        id={metric.id}
        seed={metric.seed}
        tone={metric.tone}
        tip={tip}
      />
    </article>
  );
}

export default function AppShell({ user, data }) {
  const router = useRouter();
  const domains = data?.domains || [];
  const today = data?.today;
  const insights = data?.insights || [];
  const timeline = data?.timeline || [];
  const labPanels = data?.labPanels || [];

  const [tab, setTab] = useState("today");
  const [activeDomain, setActiveDomain] = useState(domains[0]?.id || "");
  const [activeInsightId, setActiveInsightId] = useState(
    insights[0]?.id || "",
  );
  const [todayRange, setTodayRange] = useState("24h");
  const domain =
    domains.find((item) => item.id === activeDomain) || domains[0] || null;
  const activeInsight =
    insights.find((item) => item.id === activeInsightId) ||
    insights[0] ||
    null;
  const displayName = user?.name || "Member";
  const initials = getInitials(displayName);
  const todayMetrics = [
    {
      id: "rhr",
      label: "Resting HR",
      value: formatNumber(today?.restingHr),
      unit: "bpm",
      tone: "steady",
      icon: "pulse",
      seed: Number(today?.restingHr) || 52,
    },
    {
      id: "hrv",
      label: "HRV",
      value: formatNumber(today?.hrvMs),
      unit: "ms",
      tone: "good",
      icon: "wave",
      seed: Number(today?.hrvMs) || 62,
    },
    {
      id: "sleep",
      label: "Sleep score",
      value: formatNumber(today?.sleepScore),
      unit: "/100",
      tone: "good",
      icon: "bars",
      seed: Number(today?.sleepScore) || 84,
    },
    {
      id: "strain",
      label: "Strain room",
      value: today?.strainRoom || "—",
      unit: "",
      tone: "watch",
      icon: "bars",
      seed: Number(today?.strain) || 8,
    },
    {
      id: "stress",
      label: "Stress",
      value: today?.stressLevel || "—",
      unit: "",
      tone: statusTone(today?.stressLevel === "Elevated" ? "Watch" : "Steady"),
      icon: "wave",
      seed: 33,
    },
    {
      id: "recovery",
      label: "Recovery",
      value:
        today?.recoveryPercent != null
          ? `${formatNumber(today.recoveryPercent)}%`
          : today?.recoveryLabel || "—",
      unit: "",
      tone: "good",
      icon: "pulse",
      seed: Number(today?.recoveryPercent) || 78,
    },
  ];
  const coachFocus = insights.slice(0, 3);
  const featuredLabs = labPanels.slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="nrmlss-app">
      <aside className="app-sidebar">
        <div className="app-sidebar-top">
          <Link href="/" className="app-brand" aria-label="NRMLSS home">
            <span className="app-brand-mark">
              <BrandIcon fill="#ffffff" width={22} height={21} />
            </span>
            <span className="app-brand-name">NRMLSS</span>
          </Link>
          <p className="app-sidebar-eyebrow">Lab / Continuous monitoring</p>
        </div>

        <nav className="app-sidebar-nav" aria-label="App">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={tab === item.id ? "is-active" : ""}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="app-sidebar-foot">
          <div className="app-user-chip">
            <span className="app-user-avatar">{initials}</span>
            <div>
              <strong>{displayName}</strong>
              <span>{data?.deviceName || user?.email}</span>
            </div>
          </div>
          <button
            type="button"
            className="app-sidebar-link"
            onClick={handleSignOut}
          >
            Sign out
          </button>
          <Link href="/nrmlss-lab" className="app-sidebar-link">
            About Lab
          </Link>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div>
            <p className="app-topbar-kicker">{data?.dateLabel || "Today"}</p>
            <h1>
              {tab === "today" && "Today"}
              {tab === "recovery" && "Recovery"}
              {tab === "domains" && "Domains"}
              {tab === "labs" && "Advanced Labs"}
              {tab === "coach" && "Coach"}
            </h1>
          </div>
          <div className="app-topbar-meta">
            <span className="app-pill">
              {data?.syncedLabel || "Band sync pending"}
            </span>
            <button type="button" className="app-share-btn">
              Share care summary
            </button>
          </div>
        </header>

        <div className="app-content">
          {tab === "today" && (
            <section className="app-view app-today">
              <div className="app-today-toolbar">
                <div className="app-today-toolbar-actions">
                  <div className="app-range-group" role="group" aria-label="Range">
                    {TODAY_RANGES.map((range) => (
                      <button
                        key={range}
                        type="button"
                        className={
                          todayRange === range
                            ? "app-range-btn is-active"
                            : "app-range-btn"
                        }
                        onClick={() => setTodayRange(range)}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="app-btn app-btn--compact"
                    onClick={() => setTab("coach")}
                  >
                    Ask Coach
                  </button>
                </div>
              </div>

              <div className="app-today-board">
                <div className="app-today-metrics app-today-metrics--left">
                  {todayMetrics.slice(0, 3).map((metric) => (
                    <TodayMetricCard key={metric.id} metric={metric} />
                  ))}
                </div>

                <article className="app-today-center">
                  <div className="app-today-center-top">
                    <p className="app-label">Readiness</p>
                    <span className="app-chip app-chip--steady">
                      {todayRange}
                    </span>
                  </div>

                  <div className="app-today-readiness">
                    <div
                      className="app-today-ring"
                      style={{
                        "--readiness": Number(today?.readiness) || 0,
                      }}
                      aria-hidden="true"
                    >
                      <div className="app-today-ring-core">
                        <strong>
                          {today?.readiness != null
                            ? formatNumber(today.readiness)
                            : "—"}
                        </strong>
                        <span>%</span>
                      </div>
                    </div>
                    <div className="app-today-center-copy">
                      <h3>
                        {today?.primaryActionTitle || "Review today’s plan"}
                      </h3>
                      <p>
                        {today?.summary ||
                          "Pair your band and sync to see today’s readiness."}
                      </p>
                    </div>
                  </div>

                  <div
                    className="app-domain-switcher"
                    role="tablist"
                    aria-label="Domain focus"
                  >
                    {domains.slice(0, 6).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={activeDomain === item.id}
                        className={
                          activeDomain === item.id
                            ? "app-domain-switch is-active"
                            : "app-domain-switch"
                        }
                        onClick={() => setActiveDomain(item.id)}
                        title={item.title}
                      >
                        <span
                          className={`app-domain-switch-mark app-dot--${statusTone(item.status)}`}
                        >
                          {domainInitial(item.title)}
                        </span>
                        <span className="app-domain-switch-label">
                          {item.title.split(" ")[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </article>

                <div className="app-today-metrics app-today-metrics--right">
                  {todayMetrics.slice(3).map((metric) => (
                    <TodayMetricCard key={metric.id} metric={metric} />
                  ))}
                </div>
              </div>

              <div className="app-today-bottom">
                <article className="app-today-rail-card">
                  <div className="app-panel-head">
                    <h2>Coach focus</h2>
                    <button
                      type="button"
                      className="app-text-link"
                      onClick={() => setTab("coach")}
                    >
                      View all
                    </button>
                  </div>
                  {coachFocus.length ? (
                    <ul className="app-today-coach-list">
                      {coachFocus.map((item, index) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            className="app-today-coach-item"
                            onClick={() => {
                              setActiveInsightId(item.id);
                              setTab("coach");
                            }}
                          >
                            <span className="app-coach-index">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span>
                              <strong>{item.title}</strong>
                              <small>
                                {item.tag} · {priorityLabel(item.priority)}
                              </small>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="app-today-empty">
                      Coach priorities appear after your first sync.
                    </p>
                  )}
                </article>

                <article className="app-today-rail-card">
                  <div className="app-panel-head">
                    <h2>Labs</h2>
                    <button
                      type="button"
                      className="app-text-link"
                      onClick={() => setTab("labs")}
                    >
                      View all
                    </button>
                  </div>
                  {featuredLabs.length ? (
                    <ul className="app-today-lab-list">
                      {featuredLabs.map((panel) => (
                        <li key={panel.id}>
                          <button
                            type="button"
                            className="app-today-lab-item"
                            onClick={() => setTab("labs")}
                          >
                            <span className="app-today-lab-mark">
                              {panel.count}
                            </span>
                            <span>
                              <strong>{panel.title}</strong>
                              <small>{panel.status}</small>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="app-today-empty">
                      Advanced Labs panels will show here once available.
                    </p>
                  )}
                </article>
              </div>
            </section>
          )}

          {tab === "recovery" && (
            <section className="app-view app-recovery">
              <div className="app-grid-3">
                <article className="app-stat-card">
                  <p className="app-label">Overnight recovery</p>
                  <strong>
                    {today?.recoveryPercent != null
                      ? `${formatNumber(today.recoveryPercent)}%`
                      : "—"}
                  </strong>
                  <span>From last night’s recovery load</span>
                </article>
                <article className="app-stat-card">
                  <p className="app-label">Sleep debt</p>
                  <strong>
                    {today?.sleepDebtMinutes != null
                      ? `${today.sleepDebtMinutes}m`
                      : "—"}
                  </strong>
                  <span>Rolling recovery balance</span>
                </article>
                <article className="app-stat-card">
                  <p className="app-label">Stress residue</p>
                  <strong>{today?.stressLevel || "—"}</strong>
                  <span>Latest stress stream reading</span>
                </article>
              </div>

              <article className="app-panel app-timeline-panel">
                <div className="app-panel-head">
                  <h2>Last 24 hours</h2>
                  <span className="app-chip">Unified view</span>
                </div>
                <div className="app-timeline">
                  {timeline.length ? (
                    timeline.map((event) => (
                      <div className="app-timeline-row" key={event.id}>
                        <span>{event.time}</span>
                        <div>
                          <strong>{event.title}</strong>
                          <p>{event.body}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="app-timeline-row">
                      <span>—</span>
                      <div>
                        <strong>No timeline yet</strong>
                        <p>Events appear after your band starts syncing.</p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </section>
          )}

          {tab === "domains" && (
            <section className="app-view app-domains">
              <div className="app-domains-layout">
                <aside className="app-domains-rail" aria-label="Health domains">
                  <p className="app-label">All domains</p>
                  <div className="app-domains-rail-list">
                    {domains.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={
                          activeDomain === item.id
                            ? "app-domain-rail-item is-active"
                            : "app-domain-rail-item"
                        }
                        onClick={() => setActiveDomain(item.id)}
                      >
                        <span
                          className={`app-dot app-dot--${statusTone(item.status)}`}
                        />
                        <span className="app-domain-rail-copy">
                          <strong>{item.title}</strong>
                          <span>{item.status}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </aside>

                {domain ? (
                  <article className="app-domain-stage">
                    <div className="app-domain-stage-top">
                      <div>
                        <p className="app-label">Selected domain</p>
                        <h2>{domain.title}</h2>
                      </div>
                      <span
                        className={`app-chip app-chip--${statusTone(domain.status)}`}
                      >
                        {domain.status}
                      </span>
                    </div>

                    <p className="app-domain-summary">{domain.summary}</p>

                    <div className="app-domain-markers">
                      <div className="app-domain-markers-head">
                        <p className="app-label">Key biomarkers</p>
                        <span>{domain.markers.length} tracked</span>
                      </div>
                      <ul className="app-domain-marker-list">
                        {domain.markers.map((marker, index) => (
                          <li key={marker}>
                            <span className="app-domain-marker-index">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <strong>{marker}</strong>
                            <span className="app-domain-marker-meta">
                              In domain
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="app-domain-actions">
                      <button
                        type="button"
                        className="app-btn"
                        onClick={() => setTab("labs")}
                      >
                        View related labs
                      </button>
                      <button
                        type="button"
                        className="app-btn-ghost"
                        onClick={() => setTab("coach")}
                      >
                        Ask coach
                      </button>
                    </div>
                  </article>
                ) : (
                  <article className="app-domain-stage">
                    <p className="app-domain-summary">
                      No domains available yet.
                    </p>
                  </article>
                )}
              </div>
            </section>
          )}

          {tab === "labs" && (
            <section className="app-view app-labs">
              <article className="app-panel app-labs-hero">
                <div className="app-panel-head">
                  <h2>Advanced Labs</h2>
                  <span className="app-chip">100+ biomarkers</span>
                </div>
                <p>
                  Pair continuous Band signals with clinical panels so trends
                  get a ground truth — not a one-off PDF, and not raw sensor
                  noise.
                </p>
                <div className="app-domain-actions">
                  <Link
                    href="/waitlist/nrmlss-band-4?mode=preorder"
                    className="app-btn"
                  >
                    Schedule next draw
                  </Link>
                  <button type="button" className="app-btn-ghost">
                    Share care summary
                  </button>
                </div>
              </article>

              <div className="app-labs-grid">
                {labPanels.map((panel) => (
                  <article className="app-panel" key={panel.id}>
                    <div className="app-panel-head">
                      <h3>{panel.title}</h3>
                      <span
                        className={`app-chip app-chip--${statusTone(panel.status)}`}
                      >
                        {panel.status}
                      </span>
                    </div>
                    <p className="app-labs-count">
                      <span aria-hidden="true">✦</span>
                      {panel.count} biomarkers
                    </p>
                    <p>
                      {panel.description ||
                        "Results sync into Domains once collected. Typical return: a few business days."}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {tab === "coach" && (
            <section className="app-view app-coach">
              <div className="app-coach-context">
                <div>
                  <p className="app-label">Readiness</p>
                  <strong>
                    {today?.readiness != null
                      ? `${formatNumber(today.readiness)}%`
                      : "—"}
                  </strong>
                </div>
                <div>
                  <p className="app-label">Recovery</p>
                  <strong>{today?.recoveryLabel || "—"}</strong>
                </div>
                <div>
                  <p className="app-label">Sleep debt</p>
                  <strong>
                    {today?.sleepDebtMinutes != null
                      ? `${formatNumber(today.sleepDebtMinutes)}m`
                      : "—"}
                  </strong>
                </div>
                <div>
                  <p className="app-label">Strain room</p>
                  <strong>{today?.strainRoom || "—"}</strong>
                </div>
              </div>

              <div className="app-coach-layout">
                <aside className="app-coach-rail" aria-label="Coach priorities">
                  <div className="app-coach-rail-head">
                    <p className="app-label">Today’s plan</p>
                    <span>
                      {insights.length
                        ? `${insights.length} priorit${insights.length === 1 ? "y" : "ies"}`
                        : "Waiting"}
                    </span>
                  </div>

                  {insights.length ? (
                    <div className="app-coach-rail-list">
                      {insights.map((action, index) => {
                        const isActive = activeInsight?.id === action.id;
                        return (
                          <button
                            key={action.id}
                            type="button"
                            className={`app-coach-rail-item${isActive ? " is-active" : ""}`}
                            onClick={() => setActiveInsightId(action.id)}
                          >
                            <span className="app-coach-index">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="app-coach-rail-copy">
                              <strong>{action.title}</strong>
                              <span>
                                {action.tag}
                                {" · "}
                                {priorityLabel(action.priority)}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="app-coach-empty">
                      <strong>Waiting on signal</strong>
                      <p>
                        Priorities appear once readiness and domain status are
                        available.
                      </p>
                    </div>
                  )}
                </aside>

                <article className="app-coach-stage app-coach-stage--chat">
                  <CoachChat
                    today={today}
                    insights={insights}
                    domains={domains}
                    displayName={displayName}
                    activeInsight={activeInsight}
                  />
                </article>
              </div>
            </section>
          )}
        </div>
      </div>

      <nav className="app-bottom-nav" aria-label="Mobile">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? "is-active" : ""}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
