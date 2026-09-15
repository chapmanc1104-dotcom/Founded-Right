import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { applicationsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { clampText } from "../lib/sanitize";

const router: IRouter = Router();

/** Length-caps every user-supplied application field before it is stored. */
function applicationFields(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>;
  return {
    programName: clampText(b.programName, 200),
    type: clampText(b.type, 40),
    agency: clampText(b.agency, 200),
    amountRequested: clampText(b.amountRequested, 60),
    status: clampText(b.status, 40),
    deadline: clampText(b.deadline, 60),
    notes: clampText(b.notes, 5000),
  };
}

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
  const fields = applicationFields(req.body);
  if (!fields.programName) { res.status(400).json({ error: "programName is required" }); return; }
  try {
    const [row] = await db.insert(applicationsTable).values({
      userId,
      ...fields,
      type: fields.type || "Grant",
      status: fields.status || "Researching",
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
  const id = String(req.params.id ?? "");
  const fields = applicationFields(req.body);
  if (!fields.programName) { res.status(400).json({ error: "programName is required" }); return; }
  try {
    const [row] = await db.update(applicationsTable)
      .set({ ...fields, updatedAt: new Date() })
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
  const id = String(req.params.id ?? "");
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
