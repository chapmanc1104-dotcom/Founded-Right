import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { applicationsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/applications", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  try {
    const rows = await db.select().from(applicationsTable).where(eq(applicationsTable.userId, userId));
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Error fetching applications");
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

router.post("/applications", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  const { programName, type, agency, amountRequested, status, deadline, notes } = req.body;
  if (!programName) { res.status(400).json({ error: "programName is required" }); return; }
  try {
    const [row] = await db.insert(applicationsTable).values({
      userId,
      programName,
      type: type ?? "Grant",
      agency: agency ?? "",
      amountRequested: amountRequested ?? "",
      status: status ?? "Researching",
      deadline: deadline ?? "",
      notes: notes ?? "",
    }).returning();
    res.status(201).json(row);
  } catch (err) {
    req.log.error({ err }, "Error creating application");
    res.status(500).json({ error: "Failed to create application" });
  }
});

router.put("/applications/:id", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  const { id } = req.params;
  const { programName, type, agency, amountRequested, status, deadline, notes } = req.body;
  try {
    const [row] = await db.update(applicationsTable)
      .set({ programName, type, agency, amountRequested, status, deadline, notes, updatedAt: new Date() })
      .where(and(eq(applicationsTable.id, id), eq(applicationsTable.userId, userId)))
      .returning();
    if (!row) { res.status(404).json({ error: "Not found" }); return; }
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "Error updating application");
    res.status(500).json({ error: "Failed to update application" });
  }
});

router.delete("/applications/:id", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  const { id } = req.params;
  try {
    await db.delete(applicationsTable)
      .where(and(eq(applicationsTable.id, id), eq(applicationsTable.userId, userId)));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Error deleting application");
    res.status(500).json({ error: "Failed to delete application" });
  }
});

export default router;
