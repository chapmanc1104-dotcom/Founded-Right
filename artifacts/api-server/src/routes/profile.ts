import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { profilesTable, checklistsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

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
  const body = req.body;

  const updateData: Record<string, unknown> = {};
  if (body.businessName !== undefined) updateData.businessName = body.businessName;
  if (body.onboarded !== undefined) updateData.onboarded = body.onboarded;
  if (body.entityType !== undefined) updateData.entityType = body.entityType;
  if (body.state !== undefined) updateData.state = body.state;
  if (body.industry !== undefined) updateData.industry = body.industry;
  if (body.ownerName !== undefined) updateData.ownerName = body.ownerName;
  if (body.contactEmail !== undefined) updateData.contactEmail = body.contactEmail;
  if (body.contactPhone !== undefined) updateData.contactPhone = body.contactPhone;
  if (body.zipCode !== undefined) updateData.zipCode = body.zipCode;
  if (body.yearsInBusiness !== undefined) updateData.yearsInBusiness = body.yearsInBusiness;
  if (body.employees !== undefined) updateData.employees = body.employees;
  if (body.annualRevenue !== undefined) updateData.annualRevenue = body.annualRevenue;
  if (body.fundingGoals !== undefined) updateData.fundingGoals = body.fundingGoals;
  if (body.missionStatement !== undefined) updateData.missionStatement = body.missionStatement;
  if (body.certifications !== undefined) updateData.certifications = body.certifications;
  if (body.fundingAmount !== undefined) updateData.fundingAmount = body.fundingAmount;
  if (body.naicsCodes !== undefined) updateData.naicsCodesJson = JSON.stringify(body.naicsCodes);
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
  const { itemId, completed } = req.body;

  if (!itemId || typeof completed !== "boolean") {
    res.status(400).json({ error: "Missing itemId or completed" });
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

router.delete("/account", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;
  await db.delete(checklistsTable).where(eq(checklistsTable.userId, userId));
  await db.delete(profilesTable).where(eq(profilesTable.id, userId));
  res.json({ ok: true });
});

export default router;
