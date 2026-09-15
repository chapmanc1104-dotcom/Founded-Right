import { Router, type IRouter, type Request, type Response } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { NAICS_2022 } from "../data/naics2022";
import { buildChatSystemPrompt, loadProfile, type ProfileRow } from "../lib/aiContext";
import {
  LIMITS,
  clampText,
  clampStringArray,
  safeApplyUrl,
  grantsSearchUrl,
} from "../lib/sanitize";
import { chatLimiter, generationLimiter, dailyAiLimiter } from "../lib/rateLimit";

const router: IRouter = Router();

const MODEL = "claude-haiku-4-5";

/** Output budgets sized to each response shape rather than one blanket 8192. */
const MAX_TOKENS = {
  chat: 1024,
  naics: 2048,
  grants: 4096,
  capabilityStatement: 2048,
} as const;

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const firstBracket = text.indexOf("[");
  const firstBrace = text.indexOf("{");
  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    const last = text.lastIndexOf("]");
    if (last !== -1) return text.slice(firstBracket, last + 1);
  }
  if (firstBrace !== -1) {
    const last = text.lastIndexOf("}");
    if (last !== -1) return text.slice(firstBrace, last + 1);
  }
  return text.trim();
}

/** Reads the first text block, tolerating an empty or tool-only content array. */
function firstText(
  content: Array<{ type: string; text?: string }>,
  fallback: string,
): string {
  const block = content.find((c) => c.type === "text");
  return block?.text ?? fallback;
}

router.post("/ai/chat", dailyAiLimiter, chatLimiter, async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const message = clampText(req.body?.message, LIMITS.chatMessage);
  if (!message) {
    res.status(400).json({ error: "Missing message" });
    return;
  }

  // Only the last few turns are replayed, and each is clamped, so a crafted
  // history array cannot be used to smuggle in an unbounded prompt.
  const rawHistory = Array.isArray(req.body?.history) ? req.body.history : [];
  const history = rawHistory
    .slice(-LIMITS.chatHistoryTurns)
    .map((m: { role?: unknown; content?: unknown }) => ({
      role: m?.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: clampText(m?.content, LIMITS.chatHistoryMessage),
    }))
    .filter((m: { content: string }) => m.content.length > 0);

  try {
    // The system prompt is built server-side from the caller's own stored
    // profile. It is never accepted from the request body.
    const system = await buildChatSystemPrompt(req.user.id);

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS.chat,
      system,
      messages: [...history, { role: "user" as const, content: message }],
    });

    res.json({ reply: firstText(response.content, "") });
  } catch (err: unknown) {
    req.log.error({ err }, "AI chat error");
    res.status(500).json({ error: "AI service unavailable" });
  }
});

router.post("/ai/naics", dailyAiLimiter, generationLimiter, async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const query = clampText(req.body?.query, LIMITS.naicsQuery);
  if (!query) {
    res.status(400).json({ error: "Missing query" });
    return;
  }

  // Industry comes from the caller's stored profile, not the request body.
  const profile = await loadProfile(req.user.id);
  const industry = clampText(profile?.industry, LIMITS.profileField);

  try {
    const buildPrompt = (extra: string) => `A small business owner describes their business as: "${query}". Industry: ${industry || "not specified"}.

Return exactly 5 NAICS code suggestions as a raw JSON array (no markdown, no code fences). Each object must have exactly these fields:
- "code": 6-digit NAICS code as a string (e.g. "541512")
- "title": official NAICS title string
- "description": 1-2 sentence description of what this code covers
- "relevance": exactly one of "primary", "secondary", or "related"
- "govContractTip": one specific tip about using this code to win government contracts

CRITICAL: use only codes that exist in the official 2022 NAICS classification. Do NOT use codes retired in earlier revisions (for example 541712 was retired). ${extra}

Output ONLY the JSON array, starting with [ and ending with ]. No explanation, no markdown.`;

    type NaicsSuggestion = { code?: unknown; title?: unknown; [k: string]: unknown };

    // Validate AI output against the official 2022 NAICS table:
    // drop invalid/retired codes and always use the official title.
    const validate = (raw: unknown): Record<string, unknown>[] => {
      if (!Array.isArray(raw)) return [];
      const seen = new Set<string>();
      const valid: Record<string, unknown>[] = [];
      for (const item of raw as NaicsSuggestion[]) {
        const code = typeof item?.code === "string" ? item.code.trim() : "";
        const officialTitle = NAICS_2022[code];
        if (!officialTitle || seen.has(code)) continue;
        seen.add(code);
        valid.push({
          code,
          title: officialTitle,
          description: clampText(item?.description, 600),
          relevance: ["primary", "secondary", "related"].includes(
            String(item?.relevance),
          )
            ? String(item?.relevance)
            : "related",
          govContractTip: clampText(item?.govContractTip, 600),
        });
      }
      return valid;
    };

    const ask = async (extra: string) => {
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS.naics,
        messages: [{ role: "user", content: buildPrompt(extra) }],
      });
      try {
        return JSON.parse(extractJson(firstText(response.content, "[]")));
      } catch {
        return [];
      }
    };

    let codes = validate(await ask(""));
    // If validation rejected too many suggestions, retry once telling the model what was invalid.
    if (codes.length < 3) {
      const kept = codes.map((c) => c.code).join(", ") || "none";
      const retry = validate(
        await ask(
          `A previous attempt returned codes that do not exist in the 2022 NAICS classification (only these were valid: ${kept}). Double-check every code is a real 2022 NAICS 6-digit code.`,
        ),
      );
      const seen = new Set(codes.map((c) => c.code as string));
      for (const c of retry) {
        if (!seen.has(c.code as string)) {
          codes.push(c);
          seen.add(c.code as string);
        }
      }
      codes = codes.slice(0, 5);
    }

    res.json({ codes });
  } catch (err: unknown) {
    req.log.error({ err }, "NAICS AI error");
    res.status(500).json({ error: "AI service unavailable" });
  }
});

/**
 * Normalizes one model-proposed funding opportunity.
 *
 * These are generated, not retrieved from any authoritative feed, so every
 * field is clamped, the match score is bounded, and the apply link is dropped
 * unless it points at an official (.gov/.mil) host. The client renders these
 * behind an explicit "verify before you apply" notice.
 */
function normalizeGrant(raw: unknown, index: number): Record<string, unknown> | null {
  if (!raw || typeof raw !== "object") return null;
  const g = raw as Record<string, unknown>;

  const title = clampText(g.title, 200);
  if (!title) return null;

  const type = ["Grant", "Loan", "contract"].includes(String(g.type))
    ? String(g.type)
    : "Grant";

  const rawMatch = Number(g.match ?? g.matchScore);
  const match = Number.isFinite(rawMatch)
    ? Math.min(100, Math.max(0, Math.round(rawMatch)))
    : 0;

  const verifiedUrl = safeApplyUrl(g.applyUrl);

  return {
    id: clampText(g.id, 64) || `opp-${index + 1}`,
    title,
    type,
    amount: clampText(g.amount, 100),
    deadline: clampText(g.deadline, 100),
    match,
    description: clampText(g.description, 800),
    requirements: clampStringArray(g.requirements ?? g.requiredSteps, 8, 300),
    agency: clampText(g.agency, 200),
    tags: clampStringArray(g.tags, 8, 60),
    applyUrl: verifiedUrl ?? grantsSearchUrl(title),
    // Tells the UI whether the link is the program's own official page or a
    // fallback search, so it can label the difference honestly.
    applyUrlVerified: verifiedUrl !== null,
    unverified: true,
  };
}

router.post("/ai/grants", dailyAiLimiter, generationLimiter, async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // Profile is read from the database rather than the request body so the
  // prompt cannot be steered by a crafted payload.
  const profile = await loadProfile(req.user.id);
  if (!profile) {
    res.status(400).json({ error: "Complete your business profile first" });
    return;
  }

  try {
    const prompt = `A small business owner has the following profile:
- Business: ${clampText(profile.businessName, LIMITS.profileField) || "unnamed"}
- Industry: ${clampText(profile.industry, LIMITS.profileField) || "not specified"}
- State: ${clampText(profile.state, 40) || "not specified"}
- Entity: ${clampText(profile.entityType, 60) || "LLC"}
- Years in business: ${clampText(profile.yearsInBusiness, 20) || "0"}
- Employees: ${clampText(profile.employees, 20) || "1"}
- Annual revenue: $${clampText(profile.annualRevenue, 20) || "0"}K
- Certifications: ${clampStringArray(profile.certifications).join(", ") || "none"}
- Funding goals: ${clampStringArray(profile.fundingGoals).join(", ") || "not specified"}
- Target funding amount: ${clampText(profile.fundingAmount, 60) || "not specified"}

Return exactly 8 funding opportunities as a raw JSON array (no markdown, no code fences). Each object must have exactly these fields:
- "id": unique string id (e.g. "opp-1")
- "title": program name
- "type": exactly one of "Grant", "Loan", or "contract"
- "amount": dollar range string (e.g. "Up to $250,000")
- "deadline": deadline string or "Rolling" or "Quarterly"
- "match": integer 0-100 representing match score based on their profile
- "description": 1-2 sentences about the program
- "requirements": array of 3-4 key eligibility strings
- "applyUrl": the program's official URL on a .gov domain
- "agency": administering agency name string
- "tags": array of tag strings like ["woman-owned", "federal", "sbir"]

Only include long-running, well-established programs you are confident exist (for example SBA 7(a), SBA Microloan, SBIR/STTR, federal small-business set-asides, state economic development programs). Do not invent program names, and do not invent deadlines — if you are not confident of a current deadline, use "Rolling" or "Varies". For applyUrl, give the official .gov landing page for the program; if you are not confident of the exact URL, give the agency's main .gov page instead. Never give a non-.gov URL.

Output ONLY the JSON array, starting with [ and ending with ]. No explanation, no markdown.`;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS.grants,
      messages: [{ role: "user", content: prompt }],
    });

    let parsed: unknown;
    try {
      parsed = JSON.parse(extractJson(firstText(response.content, "[]")));
    } catch {
      parsed = [];
    }

    const grants = (Array.isArray(parsed) ? parsed : [])
      .map(normalizeGrant)
      .filter((g): g is Record<string, unknown> => g !== null)
      .slice(0, 8);

    res.json({
      grants,
      // Consumed by the client to render the accuracy notice.
      disclaimer:
        "AI-generated matches. Programs, amounts, and deadlines change often — verify every opportunity on grants.gov, sam.gov, or the agency's own site before applying.",
    });
  } catch (err: unknown) {
    req.log.error({ err }, "Grants AI error");
    res.status(500).json({ error: "AI service unavailable" });
  }
});

router.post(
  "/ai/capabilitystatement",
  dailyAiLimiter,
  generationLimiter,
  async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const profile: ProfileRow | null = await loadProfile(req.user.id);
    if (!profile) {
      res.status(400).json({ error: "Complete your business profile first" });
      return;
    }

    try {
      let naicsLines = "Not specified";
      try {
        const codes = JSON.parse(profile.naicsCodesJson ?? "[]");
        if (Array.isArray(codes) && codes.length > 0) {
          naicsLines = codes
            .map((n: { code?: unknown; title?: unknown }) =>
              `${String(n?.code ?? "")} - ${String(n?.title ?? "")}`.trim(),
            )
            .join(", ");
        }
      } catch {
        // keep the default
      }
      const certLines = clampStringArray(profile.certifications).join(", ") || "None";

      const businessName = clampText(profile.businessName, LIMITS.profileField) || "Company Name";
      const ownerName = clampText(profile.ownerName, LIMITS.profileField);
      const contactEmail = clampText(profile.contactEmail, LIMITS.profileField);
      const contactPhone = clampText(profile.contactPhone, 60);
      const state = clampText(profile.state, 40);

      const prompt = `Generate a professional government contracting capability statement for the following business. Return ONLY a valid JSON object (no markdown, no code fences).

Business Profile:
- Company: ${businessName}
- Owner: ${ownerName}
- Industry: ${clampText(profile.industry, LIMITS.profileField) || "Not specified"}
- Entity type: ${clampText(profile.entityType, 60) || "LLC"}
- State: ${state}
- Years in business: ${clampText(profile.yearsInBusiness, 20) || "0"}
- Employees: ${clampText(profile.employees, 20) || "1"}
- Annual revenue: $${clampText(profile.annualRevenue, 20) || "0"}K
- Mission: ${clampText(profile.missionStatement, LIMITS.missionStatement)}
- NAICS Codes: ${naicsLines}
- Certifications: ${certLines}

Return a JSON object with exactly these fields:
{
  "companyOverview": "2-3 sentence professional overview positioning the company for government contracting",
  "coreCompetencies": ["competency 1", "competency 2", "competency 3", "competency 4", "competency 5"],
  "differentiators": ["differentiator 1", "differentiator 2", "differentiator 3"],
  "pastPerformance": "1-2 sentences about past performance, or a placeholder if unknown"
}

Only claim certifications and experience supported by the profile above — do not invent contract history, clients, or credentials. Make the language professional, concise, and optimized for government procurement officers. Output ONLY the JSON object.`;

      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS.capabilityStatement,
        messages: [{ role: "user", content: prompt }],
      });

      let generated: Record<string, unknown> = {};
      try {
        const parsed = JSON.parse(extractJson(firstText(response.content, "{}")));
        if (parsed && typeof parsed === "object") generated = parsed;
      } catch {
        generated = {};
      }

      // Contact details are echoed from the stored profile, never from the
      // model, so a hallucinated email or phone number cannot reach a
      // procurement officer.
      res.json({
        statement: {
          companyOverview: clampText(generated.companyOverview, 1200),
          coreCompetencies: clampStringArray(generated.coreCompetencies, 8, 200),
          differentiators: clampStringArray(generated.differentiators, 6, 200),
          pastPerformance: clampText(generated.pastPerformance, 800),
          naicsCodes: naicsLines,
          certifications: certLines,
          contactName: ownerName || businessName,
          contactEmail,
          contactPhone,
          contactLocation: state,
        },
      });
    } catch (err: unknown) {
      req.log.error({ err }, "Capability statement AI error");
      res.status(500).json({ error: "AI service unavailable" });
    }
  },
);

export default router;
