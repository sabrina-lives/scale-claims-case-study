import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const claims = pgTable("claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  claimNumber: text("claim_number").notNull().unique(),
  policyholderName: text("policyholder_name").notNull(),
  vehicleInfo: text("vehicle_info").notNull(),
  vin: text("vin").notNull(),
  incidentDate: timestamp("incident_date").notNull(),
  incidentDescription: text("incident_description").notNull(),
  status: text("status").notNull().default("pending"),
  priority: text("priority").notNull().default("medium"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  totalEstimate: decimal("total_estimate", { precision: 10, scale: 2 }),
  agentNotes: text("agent_notes"),
  assignedAgent: text("assigned_agent"),
});

export const damageItems = pgTable("damage_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  claimId: varchar("claim_id").references(() => claims.id).notNull(),
  type: text("type").notNull(),
  severity: text("severity").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  area: text("area"),
  depth: text("depth"),
  repairType: text("repair_type"),
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(),
  coordinates: jsonb("coordinates"), // For damage highlighting
});

export const photos = pgTable("photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  claimId: varchar("claim_id").references(() => claims.id).notNull(),
  category: text("category").notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  isPrimary: boolean("is_primary").default(false),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const costBreakdown = pgTable("cost_breakdown", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  claimId: varchar("claim_id").references(() => claims.id).notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  hours: decimal("hours", { precision: 5, scale: 2 }),
  rate: decimal("rate", { precision: 10, scale: 2 }),
});

export const auditLog = pgTable("audit_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  claimId: varchar("claim_id").references(() => claims.id).notNull(),
  action: text("action").notNull(),
  description: text("description").notNull(),
  performedBy: text("performed_by"),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata"),
});

export const insertClaimSchema = createInsertSchema(claims).omit({
  id: true,
  submittedAt: true,
});

export const insertDamageItemSchema = createInsertSchema(damageItems).omit({
  id: true,
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  uploadedAt: true,
});

export const insertCostBreakdownSchema = createInsertSchema(costBreakdown).omit({
  id: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLog).omit({
  id: true,
  timestamp: true,
});

export type Claim = typeof claims.$inferSelect;
export type InsertClaim = z.infer<typeof insertClaimSchema>;
export type DamageItem = typeof damageItems.$inferSelect;
export type InsertDamageItem = z.infer<typeof insertDamageItemSchema>;
export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type CostBreakdown = typeof costBreakdown.$inferSelect;
export type InsertCostBreakdown = z.infer<typeof insertCostBreakdownSchema>;
export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

// User schema (existing)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
