import { Router, type IRouter, type Request, type Response } from "express";
import { FEDERAL_PROGRAMS, FEDERAL_NOTICES, type FederalProgram } from "../data/federalPrograms";

const router: IRouter = Router();

const DAY_MS = 24 * 60 * 60 * 1000;
const STALE_AFTER_DAYS = 90;
const HIDE_AFTER_DAYS = 180;

const CERT_LABELS: Record<string, string> = {
  woman: "women-owned",
  minority: "minority-owned",
  veteran: "veteran-owned",
  disabled_vet: "service-disabled veteran",
  hubzone: "HUBZone location",
  disadvantaged: "socially/economically disadvantaged",
};

const asList = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

// Transparent, rule-based fit score. It reflects how well a program lines up with
// the profile selections, NOT a prediction of approval.
function scoreProgram(p: FederalProgram, profile: Record<string, unknown>) {
  const certs = asList(profile.certifications);
  const goals = asList(profile.fundingGoals);
  const industry = typeof profile.industry === "string" ? profile.industry : "";
  const reasons: string[] = [];
  let score = 40;

  const goalHit = (p.goals ?? []).some((g) => goals.includes(g));
  if (goalHit) { score += 25; reasons.push("Matches a funding goal you selected"); }

  if (p.certs?.length) {
    const hit = p.certs.filter((c) => certs.includes(c));
    if (hit.length) { score += 25; reasons.push(`You selected: ${hit.map((c) => CERT_LABELS[c] ?? c).join(", ")}`); }
    else {
      score = Math.min(score, 35);
      reasons.push(`Requires ${p.certs.map((c) => CERT_LABELS[c] ?? c).join(" or ")}. Add it in your profile if it applies`);
    }
  }
  if (p.industries?.length && p.industries.includes(industry)) { score += 10; reasons.push(`Relevant to your industry (${industry})`); }
  if (p.type === "Counseling") reasons.push("Local counseling and training is available. Confirm services and any cost with your local center");

  return { match: Math.max(0, Math.min(100, score)), reasons };
}

router.post("/funding/matches", (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  const profile = (req.body?.profile && typeof req.body.profile === "object" ? req.body.profile : {}) as Record<string, unknown>;
  const now = Date.now();

  const programs = FEDERAL_PROGRAMS
    .map((p) => {
      const ageDays = Math.floor((now - new Date(p.lastVerified).getTime()) / DAY_MS);
      return { p, ageDays };
    })
    .filter(({ ageDays }) => Number.isFinite(ageDays) && ageDays <= HIDE_AFTER_DAYS)
    .map(({ p, ageDays }) => ({
      ...p,
      ...scoreProgram(p, profile),
      needsRecheck: ageDays > STALE_AFTER_DAYS,
    }))
    .sort((a, b) => b.match - a.match);

  res.json({ programs, notices: FEDERAL_NOTICES });
});

export default router;
