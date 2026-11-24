import "dotenv/config";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";

import { db } from "./index.js";
import {
  biomarker,
  careShare,
  dailySnapshot,
  device,
  domain,
  domainBiomarker,
  domainStatus,
  insight,
  labOrder,
  labPanel,
  labPanelBiomarker,
  labResult,
  labResultValue,
  metricReading,
  profile,
  timelineEvent,
  user,
} from "./schema.js";

function id(prefix = "") {
  return `${prefix}${randomBytes(12).toString("hex")}`;
}

const domains = [
  {
    id: "hormones",
    title: "Hormones",
    description: "Uncover how hormones impact how you feel",
    sortOrder: 1,
  },
  {
    id: "heart",
    title: "Heart health",
    description: "Connect the dots to long-term heart health",
    sortOrder: 2,
  },
  {
    id: "sleep",
    title: "Sleep",
    description: "See how recovery nights shape next-day performance",
    sortOrder: 3,
  },
  {
    id: "inflammation",
    title: "Inflammation",
    description: "Track inflammation signals before they become noise",
    sortOrder: 4,
  },
  {
    id: "fitness",
    title: "Fitness",
    description: "Measure training impact across every session and rest day",
    sortOrder: 5,
  },
  {
    id: "metabolic",
    title: "Metabolic health",
    description: "Understand energy, glucose patterns, and metabolic resilience",
    sortOrder: 6,
  },
  {
    id: "nutrients",
    title: "Nutrient status",
    description: "Spot nutrient gaps that quietly drain recovery",
    sortOrder: 7,
  },
  {
    id: "cognitive",
    title: "Cognitive performance",
    description: "Link focus, stress, and sleep into clearer mental readiness",
    sortOrder: 8,
  },
];

const biomarkers = [
  // continuous / derived
  {
    id: "readiness",
    slug: "readiness",
    name: "Readiness",
    type: "derived",
    unit: "%",
    whyItMatters: "Overall capacity for strain today.",
  },
  {
    id: "sleep-score",
    slug: "sleep-score",
    name: "Sleep Score",
    type: "derived",
    unit: "/100",
  },
  {
    id: "resting-hr",
    slug: "resting-hr",
    name: "Resting Heart Rate",
    shortName: "Resting HR",
    type: "continuous",
    unit: "bpm",
  },
  {
    id: "hrv",
    slug: "hrv",
    name: "HRV",
    shortName: "HRV",
    type: "continuous",
    unit: "ms",
  },
  {
    id: "hrv-overnight",
    slug: "hrv-overnight",
    name: "HRV Overnight",
    type: "derived",
    unit: "ms",
  },
  {
    id: "strain",
    slug: "strain",
    name: "Strain Score",
    shortName: "Strain",
    type: "derived",
  },
  {
    id: "recovery-load",
    slug: "recovery-load",
    name: "Recovery Load",
    type: "derived",
  },
  {
    id: "sleep-debt",
    slug: "sleep-debt",
    name: "Sleep Debt",
    type: "derived",
    unit: "min",
  },
  {
    id: "rem-balance",
    slug: "rem-balance",
    name: "REM Balance",
    type: "derived",
  },
  {
    id: "stress-load",
    slug: "stress-load",
    name: "Stress Load",
    type: "derived",
  },
  {
    id: "focus-score",
    slug: "focus-score",
    name: "Focus Score",
    type: "derived",
  },
  {
    id: "mental-fatigue",
    slug: "mental-fatigue",
    name: "Mental Fatigue",
    type: "derived",
  },
  {
    id: "vo2-proxy",
    slug: "vo2-proxy",
    name: "VO2 Proxy",
    type: "derived",
  },
  {
    id: "muscle-load",
    slug: "muscle-load",
    name: "Muscle Load",
    type: "derived",
  },
  {
    id: "glucose-variability",
    slug: "glucose-variability",
    name: "Glucose Variability",
    type: "derived",
  },
  {
    id: "fasting-window",
    slug: "fasting-window",
    name: "Fasting Window",
    type: "derived",
    unit: "h",
  },
  {
    id: "energy-score",
    slug: "energy-score",
    name: "Energy Score",
    type: "derived",
  },
  {
    id: "hydration",
    slug: "hydration",
    name: "Hydration",
    type: "derived",
  },
  {
    id: "crp-trend",
    slug: "crp-trend",
    name: "CRP Trend",
    type: "derived",
  },
  {
    id: "strain-residue",
    slug: "strain-residue",
    name: "Strain Residue",
    type: "derived",
  },
  // lab
  {
    id: "cortisol",
    slug: "cortisol",
    name: "Cortisol",
    type: "lab",
    unit: "ug/dL",
    loincCode: "2143-6",
  },
  {
    id: "estradiol",
    slug: "estradiol",
    name: "Estradiol",
    type: "lab",
    unit: "pg/mL",
  },
  {
    id: "testosterone",
    slug: "testosterone",
    name: "Testosterone, Total",
    shortName: "Testosterone",
    type: "lab",
    unit: "ng/dL",
  },
  {
    id: "tsh",
    slug: "tsh",
    name: "Thyroid Stimulating Hormone (TSH)",
    shortName: "TSH",
    type: "lab",
    unit: "mIU/L",
    loincCode: "3016-3",
  },
  {
    id: "free-t4",
    slug: "free-t4",
    name: "Thyroxine (T4) Free",
    type: "lab",
  },
  {
    id: "dhea-s",
    slug: "dhea-s",
    name: "DHEA-Sulfate",
    type: "lab",
  },
  {
    id: "shbg",
    slug: "shbg",
    name: "Sex Hormone Binding Globulin (SHBG)",
    shortName: "SHBG",
    type: "lab",
  },
  {
    id: "free-testosterone",
    slug: "free-testosterone",
    name: "Free Testosterone",
    type: "lab",
  },
  {
    id: "apob",
    slug: "apob",
    name: "Apolipoprotein B (ApoB)",
    shortName: "ApoB",
    type: "lab",
    unit: "mg/dL",
  },
  {
    id: "triglycerides",
    slug: "triglycerides",
    name: "Triglycerides",
    type: "lab",
    unit: "mg/dL",
  },
  {
    id: "cholesterol",
    slug: "cholesterol",
    name: "Cholesterol",
    type: "lab",
    unit: "mg/dL",
  },
  {
    id: "hdl",
    slug: "hdl",
    name: "HDL Cholesterol",
    type: "lab",
    unit: "mg/dL",
  },
  {
    id: "ldl-small",
    slug: "ldl-small",
    name: "LDL Small",
    type: "lab",
  },
  {
    id: "hba1c",
    slug: "hba1c",
    name: "HbA1c",
    type: "lab",
    unit: "%",
  },
  {
    id: "insulin",
    slug: "insulin",
    name: "Insulin",
    type: "lab",
  },
  {
    id: "omega3-total",
    slug: "omega3-total",
    name: "Omega-3 Total",
    shortName: "Omega",
    type: "lab",
  },
  {
    id: "hs-crp",
    slug: "hs-crp",
    name: "hs-CRP",
    type: "lab",
    unit: "mg/L",
  },
  {
    id: "vitamin-d",
    slug: "vitamin-d",
    name: "Vitamin D Trend",
    shortName: "Vitamin D",
    type: "lab",
    unit: "ng/mL",
  },
  {
    id: "iron-status",
    slug: "iron-status",
    name: "Iron Status",
    shortName: "Iron",
    type: "lab",
  },
  {
    id: "magnesium",
    slug: "magnesium",
    name: "Magnesium Status",
    type: "lab",
  },
];

const domainMap = {
  hormones: ["cortisol", "estradiol", "testosterone", "tsh"],
  heart: ["triglycerides", "apob", "cholesterol", "resting-hr"],
  sleep: ["sleep-score", "rem-balance", "hrv-overnight", "sleep-debt"],
  inflammation: ["crp-trend", "recovery-load", "strain-residue", "hs-crp"],
  fitness: ["vo2-proxy", "strain", "readiness", "muscle-load"],
  metabolic: ["glucose-variability", "fasting-window", "energy-score", "hba1c"],
  nutrients: ["iron-status", "vitamin-d", "omega3-total", "hydration"],
  cognitive: ["focus-score", "stress-load", "mental-fatigue"],
};

const panels = [
  {
    id: "hormones-thyroid",
    slug: "hormones-thyroid",
    title: "Hormones & thyroid",
    biomarkerCount: 16,
    availability: "available",
    sortOrder: 1,
    markers: [
      "free-t4",
      "testosterone",
      "cortisol",
      "estradiol",
      "tsh",
      "dhea-s",
      "shbg",
      "free-testosterone",
    ],
  },
  {
    id: "heart-metabolic",
    slug: "heart-metabolic",
    title: "Heart & metabolic",
    biomarkerCount: 18,
    availability: "available",
    sortOrder: 2,
    markers: [
      "ldl-small",
      "omega3-total",
      "insulin",
      "apob",
      "triglycerides",
      "hba1c",
      "hdl",
      "resting-hr",
    ],
  },
  {
    id: "aging",
    slug: "aging",
    title: "Aging",
    biomarkerCount: 34,
    availability: "waitlist",
    sortOrder: 3,
    markers: ["shbg", "dhea-s", "vitamin-d"],
  },
  {
    id: "mental-focus",
    slug: "mental-focus",
    title: "Mental health & focus",
    biomarkerCount: 20,
    availability: "available",
    sortOrder: 4,
    markers: [
      "cortisol",
      "hrv",
      "sleep-debt",
      "stress-load",
      "vitamin-d",
      "magnesium",
      "focus-score",
      "mental-fatigue",
    ],
  },
];

async function seedCatalog() {
  await db.insert(domain).values(domains).onConflictDoNothing();
  await db.insert(biomarker).values(biomarkers).onConflictDoNothing();

  const domainLinks = Object.entries(domainMap).flatMap(
    ([domainId, markerIds]) =>
      markerIds.map((biomarkerId, index) => ({
        id: `db_${domainId}_${biomarkerId}`,
        domainId,
        biomarkerId,
        sortOrder: index + 1,
        isKey: true,
      })),
  );
  await db.insert(domainBiomarker).values(domainLinks).onConflictDoNothing();

  await db
    .insert(labPanel)
    .values(panels.map(({ markers: _m, ...panel }) => panel))
    .onConflictDoNothing();

  const panelLinks = panels.flatMap((panel) =>
    panel.markers.map((biomarkerId, index) => ({
      id: `lpb_${panel.id}_${biomarkerId}`,
      labPanelId: panel.id,
      biomarkerId,
      sortOrder: index + 1,
    })),
  );
  await db.insert(labPanelBiomarker).values(panelLinks).onConflictDoNothing();
}

async function seedDemoUserData() {
  const [demoUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, "ekay@nrmlss.test"))
    .limit(1);

  if (!demoUser) {
    console.log("No demo user ekay@nrmlss.test — catalog seeded only.");
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const deviceId = `dev_${demoUser.id}`;

  await db
    .insert(profile)
    .values({
      userId: demoUser.id,
      displayName: demoUser.name,
      timezone: "America/Los_Angeles",
      onboardingCompleted: true,
    })
    .onConflictDoNothing();

  await db
    .insert(device)
    .values({
      id: deviceId,
      userId: demoUser.id,
      productSku: "nrmlss-band-4",
      name: "NRMLSS Band 4",
      serialNumber: `NR-BAND4-${demoUser.id.slice(0, 8)}`,
      status: "paired",
      lastSyncedAt: new Date(),
      firmwareVersion: "1.0.0",
    })
    .onConflictDoNothing();

  const activeDeviceId = deviceId;

  await db
    .insert(dailySnapshot)
    .values({
      id: `snap_${demoUser.id}_${today}`,
      userId: demoUser.id,
      deviceId: activeDeviceId,
      date: today,
      readiness: 92,
      sleepScore: 87,
      restingHr: 61,
      hrvMs: 74,
      strain: 4.2,
      recoveryPercent: 91,
      sleepDebtMinutes: -38,
      stressLevel: "Moderate",
      primaryActionTitle: "Zone 2 only — skip intensity",
      primaryActionBody:
        "Readiness supports movement, but cortisol and sleep debt say protect recovery.",
      summary:
        "Strong overnight recovery. Keep strain light while sleep debt finishes clearing.",
    })
    .onConflictDoNothing();

  const statuses = [
    {
      domainId: "hormones",
      status: "watch",
      summary:
        "Cortisol rising through the afternoon — protect evening wind-down.",
    },
    {
      domainId: "heart",
      status: "steady",
      summary: "Resting HR stable. ApoB trend still elevated vs last lab.",
    },
    {
      domainId: "sleep",
      status: "good",
      summary: "87 sleep score. REM solid; sleep debt still carrying from Tue.",
    },
    {
      domainId: "inflammation",
      status: "good",
      summary: "Recovery load easing. CRP trend proxy within target band.",
    },
    {
      domainId: "fitness",
      status: "ready",
      summary: "Readiness supports Zone 2. Skip high-strain blocks today.",
    },
    {
      domainId: "metabolic",
      status: "steady",
      summary: "Glucose variability calm. Fasting window held overnight.",
    },
    {
      domainId: "nutrients",
      status: "watch",
      summary: "Vitamin D trending low — flag for next Advanced Labs draw.",
    },
    {
      domainId: "cognitive",
      status: "caution",
      summary: "Focus score soft after late stress peak. Keep caffeine early.",
    },
  ];

  await db
    .insert(domainStatus)
    .values(
      statuses.map((row) => ({
        id: `ds_${demoUser.id}_${row.domainId}_${today}`,
        userId: demoUser.id,
        date: today,
        ...row,
      })),
    )
    .onConflictDoNothing();

  // Clear regenerable demo rows so re-seed stays clean
  const existingResults = await db
    .select({ id: labResult.id })
    .from(labResult)
    .where(eq(labResult.userId, demoUser.id));

  if (existingResults.length) {
    const resultIds = existingResults.map((row) => row.id);
    for (const resultId of resultIds) {
      await db
        .delete(labResultValue)
        .where(eq(labResultValue.labResultId, resultId));
    }
  }

  await db.delete(metricReading).where(eq(metricReading.userId, demoUser.id));
  await db.delete(timelineEvent).where(eq(timelineEvent.userId, demoUser.id));
  await db.delete(insight).where(eq(insight.userId, demoUser.id));
  await db.delete(careShare).where(eq(careShare.userId, demoUser.id));
  await db.delete(labResult).where(eq(labResult.userId, demoUser.id));
  await db.delete(labOrder).where(eq(labOrder.userId, demoUser.id));

  const now = new Date();
  const readings = [
    { biomarkerId: "readiness", valueNumeric: 92, unit: "%", status: "ready" },
    {
      biomarkerId: "sleep-score",
      valueNumeric: 87,
      unit: "/100",
      status: "good",
    },
    {
      biomarkerId: "resting-hr",
      valueNumeric: 61,
      unit: "bpm",
      status: "steady",
    },
    { biomarkerId: "hrv", valueNumeric: 74, unit: "ms", status: "good" },
    { biomarkerId: "strain", valueNumeric: 4.2, status: "steady" },
    {
      biomarkerId: "stress-load",
      valueText: "Moderate",
      status: "steady",
    },
  ];

  await db.insert(metricReading).values(
    readings.map((row) => ({
      id: id("mr_"),
      userId: demoUser.id,
      deviceId: activeDeviceId,
      recordedAt: now,
      source: "band",
      ...row,
    })),
  );

  await db.insert(timelineEvent).values([
    {
      id: id("te_"),
      userId: demoUser.id,
      occurredAt: new Date(now.getTime() - 11 * 60 * 60 * 1000),
      title: "Sleep onset",
      body: "HRV climbed through the first cycle. Solid REM block.",
      kind: "recovery",
    },
    {
      id: id("te_"),
      userId: demoUser.id,
      occurredAt: new Date(now.getTime() - 7 * 60 * 60 * 1000),
      title: "Deep recovery peak",
      body: "Resting HR dipped to 58. Recovery load improved.",
      kind: "recovery",
    },
    {
      id: id("te_"),
      userId: demoUser.id,
      occurredAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      title: "Wake",
      body: "Readiness 92%. Cognitive focus still catching up.",
      kind: "recovery",
    },
    {
      id: id("te_"),
      userId: demoUser.id,
      occurredAt: now,
      title: "Intervention window",
      body: "Keep strain low. Wind-down protocol starts 9:30p.",
      kind: "coach",
    },
  ]);

  await db.insert(insight).values([
    {
      id: id("ins_"),
      userId: demoUser.id,
      kind: "coach",
      priority: "high",
      title: "Keep strain light",
      body: "Readiness is strong, but sleep debt is still resolving. Cap intensity.",
      tag: "Today",
      activeOn: today,
    },
    {
      id: id("ins_"),
      userId: demoUser.id,
      kind: "recovery",
      priority: "medium",
      title: "Protect a 90-minute wind-down",
      body: "Cortisol stayed elevated late yesterday. Dim screens after 9:30.",
      tag: "Recovery",
      domainId: "hormones",
      activeOn: today,
    },
    {
      id: id("ins_"),
      userId: demoUser.id,
      kind: "labs",
      priority: "medium",
      title: "Schedule Advanced Labs",
      body: "Vitamin D + ApoB need a clinical ground truth this quarter.",
      tag: "Labs",
      domainId: "nutrients",
      activeOn: today,
    },
  ]);

  const orderId = `lo_${demoUser.id}_heart`;
  await db.insert(labOrder).values({
    id: orderId,
    userId: demoUser.id,
    labPanelId: "heart-metabolic",
    status: "completed",
    scheduledFor: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
    collectedAt: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000),
    completedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    collectionMethod: "in_center",
    notes: "Baseline Advanced Labs draw",
  });

  const resultId = `lr_${orderId}`;
  await db.insert(labResult).values({
    id: resultId,
    labOrderId: orderId,
    userId: demoUser.id,
    reportedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    summary: "ApoB elevated; lipids otherwise steady.",
  });

  await db.insert(labResultValue).values([
    {
      id: `lrv_${resultId}_apob`,
      labResultId: resultId,
      biomarkerId: "apob",
      valueNumeric: 110,
      unit: "mg/dL",
      status: "watch",
      referenceLow: 40,
      referenceHigh: 90,
      flag: "high",
    },
    {
      id: `lrv_${resultId}_triglycerides`,
      labResultId: resultId,
      biomarkerId: "triglycerides",
      valueNumeric: 98,
      unit: "mg/dL",
      status: "good",
      referenceLow: 0,
      referenceHigh: 150,
      flag: "normal",
    },
    {
      id: `lrv_${resultId}_hdl`,
      labResultId: resultId,
      biomarkerId: "hdl",
      valueNumeric: 58,
      unit: "mg/dL",
      status: "good",
      flag: "normal",
    },
    {
      id: `lrv_${resultId}_hba1c`,
      labResultId: resultId,
      biomarkerId: "hba1c",
      valueNumeric: 5.2,
      unit: "%",
      status: "good",
      flag: "normal",
    },
  ]);

  await db.insert(careShare).values({
    id: `cs_${demoUser.id}`,
    userId: demoUser.id,
    recipientName: "Dr. Amira Cole",
    recipientEmail: "amira@northlight.health",
    status: "active",
    token: randomBytes(24).toString("hex"),
    expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
  });

  console.log(`Demo data seeded for ${demoUser.email}`);
}

async function main() {
  console.log("Seeding catalog…");
  await seedCatalog();
  console.log("Seeding demo user data…");
  await seedDemoUserData();
  console.log("Done.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
