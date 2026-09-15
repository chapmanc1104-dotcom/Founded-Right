import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  profilesTable,
  checklistsTable,
  applicationsTable,
  usersTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { supabaseAdmin } from "../lib/supabaseAdmin";
import { LIMITS, clampText, clampStringArray } from "../lib/sanitize";
import { CHECKLIST_LABELS } from "../data/checklist";

const router: IRouter = Router();

router.get("/profile", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;

  let profile = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, userId))
    .then((rows) => rows[0]);

  if (!profile) {
    const [newProfile] = await db
      .insert(profilesTable)
      .values({ id: userId })
      .returning();
    profile = newProfile;
  }

  res.json({
    id: profile.id,
    businessName: profile.businessName,
    onboarded: profile.onboarded,
    entityType: profile.entityType,
    state: profile.state,
    industry: profile.industry,
    ownerName: profile.ownerName,
    contactEmail: profile.contactEmail,
    contactPhone: profile.contactPhone,
    zipCode: profile.zipCode,
    yearsInBusiness: profile.yearsInBusiness,
    employees: profile.employees,
    annualRevenue: profile.annualRevenue,
    fundingGoals: profile.fundingGoals ?? [],
    missionStatement: profile.missionStatement,
    certifications: profile.certifications ?? [],
    fundingAmount: profile.fundingAmount,
    naicsCodes: (() => {
      try { return JSON.parse(profile.naicsCodesJson ?? "[]"); } catch { return []; }
    })(),
  });
});

router.put("/profile", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;
  const body = req.body ?? {};

  // Every field is length-capped before it is stored, since these values are
  // later interpolated into model prompts and rendered back to the user.
  const text = (v: unknown, max: number = LIMITS.profileField) => clampText(v, max);

  const updateData: Record<string, unknown> = {};
  if (body.businessName !== undefined) updateData.businessName = text(body.businessName);
  if (body.onboarded !== undefined) updateData.onboarded = Boolean(body.onboarded);
  if (body.entityType !== undefined) updateData.entityType = text(body.entityType, 60);
  if (body.state !== undefined) updateData.state = text(body.state, 40);
  if (body.industry !== undefined) updateData.industry = text(body.industry);
  if (body.ownerName !== undefined) updateData.ownerName = text(body.ownerName);
  if (body.contactEmail !== undefined) updateData.contactEmail = text(body.contactEmail, 320);
  if (body.contactPhone !== undefined) updateData.contactPhone = text(body.contactPhone, 60);
  if (body.zipCode !== undefined) updateData.zipCode = text(body.zipCode, 20);
  if (body.yearsInBusiness !== undefined) updateData.yearsInBusiness = text(body.yearsInBusiness, 20);
  if (body.employees !== undefined) updateData.employees = text(body.employees, 20);
  if (body.annualRevenue !== undefined) updateData.annualRevenue = text(body.annualRevenue, 20);
  if (body.fundingGoals !== undefined) updateData.fundingGoals = clampStringArray(body.fundingGoals);
  if (body.missionStatement !== undefined)
    updateData.missionStatement = text(body.missionStatement, LIMITS.missionStatement);
  if (body.certifications !== undefined)
    updateData.certifications = clampStringArray(body.certifications);
  if (body.fundingAmount !== undefined) updateData.fundingAmount = text(body.fundingAmount, 60);
  if (body.naicsCodes !== undefined) {
    const codes = Array.isArray(body.naicsCodes) ? body.naicsCodes.slice(0, 10) : [];
    updateData.naicsCodesJson = JSON.stringify(
      codes.map((n: { code?: unknown; title?: unknown }) => ({
        code: clampText(n?.code, 10),
        title: clampText(n?.title, 300),
      })),
    );
  }
  updateData.updatedAt = new Date();

  const [updated] = await db
    .insert(profilesTable)
    .values({ id: userId, ...updateData })
    .onConflictDoUpdate({ target: profilesTable.id, set: updateData })
    .returning();

  res.json({
    id: updated.id,
    businessName: updated.businessName,
    onboarded: updated.onboarded,
    entityType: updated.entityType,
    state: updated.state,
    industry: updated.industry,
    ownerName: updated.ownerName,
    contactEmail: updated.contactEmail,
    contactPhone: updated.contactPhone,
    zipCode: updated.zipCode,
    yearsInBusiness: updated.yearsInBusiness,
    employees: updated.employees,
    annualRevenue: updated.annualRevenue,
    fundingGoals: updated.fundingGoals ?? [],
    missionStatement: updated.missionStatement,
    certifications: updated.certifications ?? [],
    fundingAmount: updated.fundingAmount,
    naicsCodes: (() => {
      try { return JSON.parse(updated.naicsCodesJson ?? "[]"); } catch { return []; }
    })(),
  });
});

router.get("/checklist-state", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;

  const row = await db
    .select()
    .from(checklistsTable)
    .where(eq(checklistsTable.userId, userId))
    .then((rows) => rows[0]);

  if (!row) {
    res.json({});
    return;
  }

  try {
    res.json(JSON.parse(row.checklistJson ?? "{}"));
  } catch {
    res.json({});
  }
});

router.put("/checklist-state", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;
  const { itemId, completed } = req.body ?? {};

  if (typeof itemId !== "string" || typeof completed !== "boolean") {
    res.status(400).json({ error: "Missing itemId or completed" });
    return;
  }

  // Only known checklist ids are stored, so the persisted JSON blob cannot be
  // grown without bound by a client sending arbitrary keys.
  if (!(itemId in CHECKLIST_LABELS)) {
    res.status(400).json({ error: "Unknown checklist item" });
    return;
  }

  const existing = await db
    .select()
    .from(checklistsTable)
    .where(eq(checklistsTable.userId, userId))
    .then((rows) => rows[0]);

  let current: Record<string, boolean> = {};
  if (existing) {
    try { current = JSON.parse(existing.checklistJson ?? "{}"); } catch { current = {}; }
  }

  current[itemId] = completed;
  const newJson = JSON.stringify(current);

  await db
    .insert(checklistsTable)
    .values({ userId, checklistJson: newJson })
    .onConflictDoUpdate({
      target: checklistsTable.userId,
      set: { checklistJson: newJson, updatedAt: new Date() },
    });

  res.json(current);
});

/**
 * Closes the caller's account.
 *
 * Deletes every row we hold for them and then removes their Supabase auth
 * record so the login itself is gone. If the auth record cannot be removed
 * (no service-role key configured, or Supabase rejects the call) the data is
 * still erased, but we report `authDeleted: false` so the UI can tell the user
 * what actually happened instead of claiming a complete deletion.
 */
router.delete("/account", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;

  try {
    // Ordered child-first; the users row would cascade, but being explicit
    // keeps this correct if a future table forgets its cascade.
    await db.delete(applicationsTable).where(eq(applicationsTable.userId, userId));
    await db.delete(checklistsTable).where(eq(checklistsTable.userId, userId));
    await db.delete(profilesTable).where(eq(profilesTable.id, userId));
    await db.delete(usersTable).where(eq(usersTable.id, userId));
  } catch (err) {
    req.log.error({ err }, "Account data deletion failed");
    res.status(500).json({ error: "Could not delete your account. Please contact support." });
    return;
  }

  if (!supabaseAdmin) {
    req.log.error(
      { userId },
      "SUPABASE_SERVICE_ROLE_KEY is not configured; auth user was not deleted",
    );
    res.json({ ok: true, authDeleted: false });
    return;
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    req.log.error({ err: error, userId }, "Supabase auth user deletion failed");
    res.json({ ok: true, authDeleted: false });
    return;
  }

  res.json({ ok: true, authDeleted: true });
});

export default router;
