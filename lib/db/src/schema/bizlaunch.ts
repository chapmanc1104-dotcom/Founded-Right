import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

export const profilesTable = pgTable("profiles", {
  id: text("id").primaryKey().references(() => usersTable.id, { onDelete: "cascade" }),
  businessName: text("business_name"),
  onboarded: boolean("onboarded").default(false),
  entityType: text("entity_type").default("LLC"),
  state: text("state").default("MD"),
  industry: text("industry"),
  ownerName: text("owner_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  zipCode: text("zip_code"),
  yearsInBusiness: text("years_in_business").default("0"),
  employees: text("employees").default("1"),
  annualRevenue: text("annual_revenue").default("0"),
  fundingGoals: text("funding_goals").array().default([]),
  missionStatement: text("mission_statement"),
  certifications: text("certifications").array().default([]),
  fundingAmount: text("funding_amount"),
  naicsCodesJson: text("naics_codes_json").default("[]"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const checklistsTable = pgTable("checklists", {
  userId: text("user_id").primaryKey().references(() => usersTable.id, { onDelete: "cascade" }),
  checklistJson: text("checklist_json").default("{}"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Profile = typeof profilesTable.$inferSelect;
export type InsertProfile = typeof profilesTable.$inferInsert;
