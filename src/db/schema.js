import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  boolean,
  integer,
  real,
  date,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* ----------------------------- Better Auth ----------------------------- */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

/* ----------------------------- Enums ----------------------------- */

export const biomarkerTypeEnum = pgEnum("biomarker_type", [
  "continuous",
  "lab",
  "derived",
]);

export const biomarkerStatusEnum = pgEnum("biomarker_status", [
  "good",
  "steady",
  "watch",
  "caution",
  "ready",
]);

export const deviceStatusEnum = pgEnum("device_status", [
  "paired",
  "syncing",
  "offline",
  "unpaired",
]);

export const labOrderStatusEnum = pgEnum("lab_order_status", [
  "draft",
  "scheduled",
  "collected",
  "processing",
  "completed",
  "cancelled",
]);

export const labPanelAvailabilityEnum = pgEnum("lab_panel_availability", [
  "available",
  "waitlist",
  "coming_soon",
]);

export const insightKindEnum = pgEnum("insight_kind", [
  "coach",
  "recovery",
  "labs",
  "domain",
  "alert",
]);

export const insightPriorityEnum = pgEnum("insight_priority", [
  "low",
  "medium",
  "high",
]);

export const careShareStatusEnum = pgEnum("care_share_status", [
  "active",
  "revoked",
  "expired",
]);

/* ----------------------------- Profiles & devices ----------------------------- */

export const profile = pgTable("profile", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  timezone: text("timezone").default("America/Los_Angeles").notNull(),
  dateOfBirth: date("date_of_birth"),
  sexAtBirth: text("sex_at_birth"),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const device = pgTable(
  "device",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    productSku: text("product_sku").notNull(), // nrmlss-band-4 | nrmlss-band-ceramic
    name: text("name").notNull(),
    serialNumber: text("serial_number"),
    status: deviceStatusEnum("status").default("paired").notNull(),
    lastSyncedAt: timestamp("last_synced_at"),
    firmwareVersion: text("firmware_version"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("device_userId_idx").on(table.userId),
    uniqueIndex("device_serial_uidx").on(table.serialNumber),
  ],
);

/* ----------------------------- Catalog ----------------------------- */

export const domain = pgTable("domain", {
  id: text("id").primaryKey(), // hormones, heart, sleep, ...
  title: text("title").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const biomarker = pgTable(
  "biomarker",
  {
    id: text("id").primaryKey(), // cortisol, resting-hr, sleep-score
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    shortName: text("short_name"),
    type: biomarkerTypeEnum("type").notNull(),
    unit: text("unit"),
    description: text("description"),
    whyItMatters: text("why_it_matters"),
    loincCode: text("loinc_code"),
    referenceLow: real("reference_low"),
    referenceHigh: real("reference_high"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("biomarker_type_idx").on(table.type)],
);

export const domainBiomarker = pgTable(
  "domain_biomarker",
  {
    id: text("id").primaryKey(),
    domainId: text("domain_id")
      .notNull()
      .references(() => domain.id, { onDelete: "cascade" }),
    biomarkerId: text("biomarker_id")
      .notNull()
      .references(() => biomarker.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").default(0).notNull(),
    isKey: boolean("is_key").default(true).notNull(),
  },
  (table) => [
    uniqueIndex("domain_biomarker_uidx").on(table.domainId, table.biomarkerId),
    index("domain_biomarker_domain_idx").on(table.domainId),
  ],
);

export const labPanel = pgTable("lab_panel", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  biomarkerCount: integer("biomarker_count").default(0).notNull(),
  availability: labPanelAvailabilityEnum("availability")
    .default("available")
    .notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const labPanelBiomarker = pgTable(
  "lab_panel_biomarker",
  {
    id: text("id").primaryKey(),
    labPanelId: text("lab_panel_id")
      .notNull()
      .references(() => labPanel.id, { onDelete: "cascade" }),
    biomarkerId: text("biomarker_id")
      .notNull()
      .references(() => biomarker.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").default(0).notNull(),
  },
  (table) => [
    uniqueIndex("lab_panel_biomarker_uidx").on(
      table.labPanelId,
      table.biomarkerId,
    ),
  ],
);

/* ----------------------------- Continuous health ----------------------------- */

export const dailySnapshot = pgTable(
  "daily_snapshot",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    deviceId: text("device_id").references(() => device.id, {
      onDelete: "set null",
    }),
    date: date("date").notNull(),
    readiness: real("readiness"),
    sleepScore: real("sleep_score"),
    restingHr: real("resting_hr"),
    hrvMs: real("hrv_ms"),
    strain: real("strain"),
    recoveryPercent: real("recovery_percent"),
    sleepDebtMinutes: integer("sleep_debt_minutes"),
    stressLevel: text("stress_level"),
    primaryActionTitle: text("primary_action_title"),
    primaryActionBody: text("primary_action_body"),
    summary: text("summary"),
    meta: jsonb("meta"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("daily_snapshot_user_date_uidx").on(table.userId, table.date),
    index("daily_snapshot_user_idx").on(table.userId),
  ],
);

export const metricReading = pgTable(
  "metric_reading",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    deviceId: text("device_id").references(() => device.id, {
      onDelete: "set null",
    }),
    biomarkerId: text("biomarker_id")
      .notNull()
      .references(() => biomarker.id, { onDelete: "cascade" }),
    recordedAt: timestamp("recorded_at").notNull(),
    valueNumeric: real("value_numeric"),
    valueText: text("value_text"),
    unit: text("unit"),
    status: biomarkerStatusEnum("status"),
    source: text("source").default("band").notNull(), // band | derived | manual
    meta: jsonb("meta"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("metric_reading_user_time_idx").on(table.userId, table.recordedAt),
    index("metric_reading_biomarker_idx").on(
      table.userId,
      table.biomarkerId,
      table.recordedAt,
    ),
  ],
);

export const domainStatus = pgTable(
  "domain_status",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    domainId: text("domain_id")
      .notNull()
      .references(() => domain.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    status: biomarkerStatusEnum("status").notNull(),
    summary: text("summary"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("domain_status_user_domain_date_uidx").on(
      table.userId,
      table.domainId,
      table.date,
    ),
  ],
);

export const timelineEvent = pgTable(
  "timeline_event",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    occurredAt: timestamp("occurred_at").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    kind: text("kind").default("recovery").notNull(),
    meta: jsonb("meta"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("timeline_event_user_time_idx").on(table.userId, table.occurredAt),
  ],
);

/* ----------------------------- Labs ----------------------------- */

export const labOrder = pgTable(
  "lab_order",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    labPanelId: text("lab_panel_id")
      .notNull()
      .references(() => labPanel.id),
    status: labOrderStatusEnum("status").default("draft").notNull(),
    scheduledFor: timestamp("scheduled_for"),
    collectedAt: timestamp("collected_at"),
    completedAt: timestamp("completed_at"),
    collectionMethod: text("collection_method"), // in_center | at_home
    partnerRef: text("partner_ref"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("lab_order_user_idx").on(table.userId),
    index("lab_order_status_idx").on(table.status),
  ],
);

export const labResult = pgTable(
  "lab_result",
  {
    id: text("id").primaryKey(),
    labOrderId: text("lab_order_id")
      .notNull()
      .references(() => labOrder.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    reportedAt: timestamp("reported_at").notNull(),
    summary: text("summary"),
    rawPayload: jsonb("raw_payload"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("lab_result_user_idx").on(table.userId)],
);

export const labResultValue = pgTable(
  "lab_result_value",
  {
    id: text("id").primaryKey(),
    labResultId: text("lab_result_id")
      .notNull()
      .references(() => labResult.id, { onDelete: "cascade" }),
    biomarkerId: text("biomarker_id")
      .notNull()
      .references(() => biomarker.id),
    valueNumeric: real("value_numeric"),
    valueText: text("value_text"),
    unit: text("unit"),
    status: biomarkerStatusEnum("status"),
    referenceLow: real("reference_low"),
    referenceHigh: real("reference_high"),
    flag: text("flag"), // low | high | normal
  },
  (table) => [
    index("lab_result_value_result_idx").on(table.labResultId),
    uniqueIndex("lab_result_value_uidx").on(
      table.labResultId,
      table.biomarkerId,
    ),
  ],
);

/* ----------------------------- Coach / care ----------------------------- */

export const insight = pgTable(
  "insight",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    kind: insightKindEnum("kind").default("coach").notNull(),
    priority: insightPriorityEnum("priority").default("medium").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    tag: text("tag"),
    domainId: text("domain_id").references(() => domain.id, {
      onDelete: "set null",
    }),
    activeOn: date("active_on").notNull(),
    isDismissed: boolean("is_dismissed").default(false).notNull(),
    isCompleted: boolean("is_completed").default(false).notNull(),
    meta: jsonb("meta"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("insight_user_date_idx").on(table.userId, table.activeOn),
    index("insight_kind_idx").on(table.kind),
  ],
);

export const careShare = pgTable(
  "care_share",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    recipientName: text("recipient_name"),
    recipientEmail: text("recipient_email"),
    status: careShareStatusEnum("status").default("active").notNull(),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at"),
    lastAccessedAt: timestamp("last_accessed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("care_share_user_idx").on(table.userId)],
);

/* ----------------------------- Relations ----------------------------- */

export const userRelations = relations(user, ({ one, many }) => ({
  sessions: many(session),
  accounts: many(account),
  profile: one(profile),
  devices: many(device),
  dailySnapshots: many(dailySnapshot),
  metricReadings: many(metricReading),
  domainStatuses: many(domainStatus),
  timelineEvents: many(timelineEvent),
  labOrders: many(labOrder),
  labResults: many(labResult),
  insights: many(insight),
  careShares: many(careShare),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(user, {
    fields: [profile.userId],
    references: [user.id],
  }),
}));

export const deviceRelations = relations(device, ({ one, many }) => ({
  user: one(user, {
    fields: [device.userId],
    references: [user.id],
  }),
  dailySnapshots: many(dailySnapshot),
  metricReadings: many(metricReading),
}));

export const domainRelations = relations(domain, ({ many }) => ({
  biomarkers: many(domainBiomarker),
  statuses: many(domainStatus),
  insights: many(insight),
}));

export const biomarkerRelations = relations(biomarker, ({ many }) => ({
  domains: many(domainBiomarker),
  labPanels: many(labPanelBiomarker),
  metricReadings: many(metricReading),
  labResultValues: many(labResultValue),
}));

export const domainBiomarkerRelations = relations(
  domainBiomarker,
  ({ one }) => ({
    domain: one(domain, {
      fields: [domainBiomarker.domainId],
      references: [domain.id],
    }),
    biomarker: one(biomarker, {
      fields: [domainBiomarker.biomarkerId],
      references: [biomarker.id],
    }),
  }),
);

export const labPanelRelations = relations(labPanel, ({ many }) => ({
  biomarkers: many(labPanelBiomarker),
  orders: many(labOrder),
}));

export const labPanelBiomarkerRelations = relations(
  labPanelBiomarker,
  ({ one }) => ({
    labPanel: one(labPanel, {
      fields: [labPanelBiomarker.labPanelId],
      references: [labPanel.id],
    }),
    biomarker: one(biomarker, {
      fields: [labPanelBiomarker.biomarkerId],
      references: [biomarker.id],
    }),
  }),
);

export const dailySnapshotRelations = relations(dailySnapshot, ({ one }) => ({
  user: one(user, {
    fields: [dailySnapshot.userId],
    references: [user.id],
  }),
  device: one(device, {
    fields: [dailySnapshot.deviceId],
    references: [device.id],
  }),
}));

export const metricReadingRelations = relations(metricReading, ({ one }) => ({
  user: one(user, {
    fields: [metricReading.userId],
    references: [user.id],
  }),
  device: one(device, {
    fields: [metricReading.deviceId],
    references: [device.id],
  }),
  biomarker: one(biomarker, {
    fields: [metricReading.biomarkerId],
    references: [biomarker.id],
  }),
}));

export const domainStatusRelations = relations(domainStatus, ({ one }) => ({
  user: one(user, {
    fields: [domainStatus.userId],
    references: [user.id],
  }),
  domain: one(domain, {
    fields: [domainStatus.domainId],
    references: [domain.id],
  }),
}));

export const timelineEventRelations = relations(timelineEvent, ({ one }) => ({
  user: one(user, {
    fields: [timelineEvent.userId],
    references: [user.id],
  }),
}));

export const labOrderRelations = relations(labOrder, ({ one, many }) => ({
  user: one(user, {
    fields: [labOrder.userId],
    references: [user.id],
  }),
  labPanel: one(labPanel, {
    fields: [labOrder.labPanelId],
    references: [labPanel.id],
  }),
  results: many(labResult),
}));

export const labResultRelations = relations(labResult, ({ one, many }) => ({
  order: one(labOrder, {
    fields: [labResult.labOrderId],
    references: [labOrder.id],
  }),
  user: one(user, {
    fields: [labResult.userId],
    references: [user.id],
  }),
  values: many(labResultValue),
}));

export const labResultValueRelations = relations(labResultValue, ({ one }) => ({
  result: one(labResult, {
    fields: [labResultValue.labResultId],
    references: [labResult.id],
  }),
  biomarker: one(biomarker, {
    fields: [labResultValue.biomarkerId],
    references: [biomarker.id],
  }),
}));

export const insightRelations = relations(insight, ({ one }) => ({
  user: one(user, {
    fields: [insight.userId],
    references: [user.id],
  }),
  domain: one(domain, {
    fields: [insight.domainId],
    references: [domain.id],
  }),
}));

export const careShareRelations = relations(careShare, ({ one }) => ({
  user: one(user, {
    fields: [careShare.userId],
    references: [user.id],
  }),
}));
