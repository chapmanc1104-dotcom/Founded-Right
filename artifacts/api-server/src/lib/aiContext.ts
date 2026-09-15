import { db, profilesTable, checklistsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CHECKLIST_LABELS, CHECKLIST_TOTAL } from "../data/checklist";

export type ProfileRow = typeof profilesTable.$inferSelect;

/** Loads the caller's own profile row, or null when they have not created one. */
export async function loadProfile(userId: string): Promise<ProfileRow | null> {
  const rows = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, userId));
  return rows[0] ?? null;
}

async function loadChecklist(userId: string): Promise<Record<string, boolean>> {
  const rows = await db
    .select()
    .from(checklistsTable)
    .where(eq(checklistsTable.userId, userId));
  try {
    const parsed = JSON.parse(rows[0]?.checklistJson ?? "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function naicsSummary(profile: ProfileRow | null): string {
  try {
    const codes = JSON.parse(profile?.naicsCodesJson ?? "[]");
    if (!Array.isArray(codes) || codes.length === 0) return "not yet identified";
    return codes
      .map((n: { code?: unknown; title?: unknown }) =>
        `${String(n?.code ?? "")} ${String(n?.title ?? "")}`.trim(),
      )
      .filter(Boolean)
      .join(", ");
  } catch {
    return "not yet identified";
  }
}

/**
 * Builds the assistant's system prompt on the server from the caller's own
 * stored data. This is deliberately NOT accepted from the request body: a
 * client-supplied system prompt would let any signed-up account use our
 * Anthropic key as a general-purpose model.
 */
export async function buildChatSystemPrompt(userId: string): Promise<string> {
  const [profile, checklist] = await Promise.all([
    loadProfile(userId),
    loadChecklist(userId),
  ]);

  const doneIds = Object.keys(CHECKLIST_LABELS).filter((id) => checklist[id]);
  const pendingIds = Object.keys(CHECKLIST_LABELS).filter((id) => !checklist[id]);
  const score = Math.round((doneIds.length / CHECKLIST_TOTAL) * 100);

  const completed = doneIds.slice(0, 10).map((id) => CHECKLIST_LABELS[id]);
  const pending = pendingIds.slice(0, 10).map((id) => CHECKLIST_LABELS[id]);

  return `You are Founded Right Assistant, an expert business setup advisor helping a small business owner structure their LLC for grants, loans, and government contracts.

Business profile:
- Business name: ${profile?.businessName || "not yet set"}
- Entity type: ${profile?.entityType || "LLC"}
- Industry: ${profile?.industry || "not specified"}
- State: ${profile?.state || "not specified"}
- ZIP: ${profile?.zipCode || "not provided"}
- Years in business: ${profile?.yearsInBusiness || "0"}
- Employees: ${profile?.employees || "1"}
- Annual revenue: $${profile?.annualRevenue || "0"}K
- Mission: ${profile?.missionStatement || "not provided"}
- Funding goals: ${(profile?.fundingGoals || []).join(", ") || "not specified"}
- Target funding amount: ${profile?.fundingAmount || "not specified"}
- Owner certifications: ${(profile?.certifications || []).join(", ") || "none selected"}
- NAICS codes: ${naicsSummary(profile)}
- Setup score: ${score}% complete (${doneIds.length}/${CHECKLIST_TOTAL} steps done)

Completed steps: ${completed.join(", ") || "none yet"}
Still pending: ${pending.join(", ") || "none"}

Stay on the topic of starting, structuring, funding, and running this business. If asked about something unrelated, briefly redirect to how you can help with their business setup.

Never state a filing deadline, award amount, or eligibility rule as certain. Point the owner to the official source (irs.gov, sba.gov, grants.gov, sam.gov, fincen.gov, or their Secretary of State) to confirm before they act.

Be concise, specific, and actionable. Keep answers under 200 words unless more is needed.`;
}
