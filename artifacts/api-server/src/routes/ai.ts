import { Router, type IRouter, type Request, type Response } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";

const router: IRouter = Router();

const MODEL = "claude-haiku-4-5";

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

router.post("/ai/chat", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { message, history = [], systemPrompt } = req.body;
  if (!message) {
    res.status(400).json({ error: "Missing message" });
    return;
  }

  try {
    const messages = [
      ...(history || []).map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 8192,
      system: systemPrompt || "You are Founded Right Assistant, an expert business setup advisor helping small business owners structure their companies for grants, loans, and government contracts. Be concise, specific, and actionable. Keep answers under 200 words unless the question requires more.",
      messages,
    });

    const reply = response.content[0].type === "text" ? response.content[0].text : "";
    res.json({ reply });
  } catch (err: unknown) {
    req.log.error({ err }, "AI chat error");
    res.status(500).json({ error: "AI service unavailable" });
  }
});

router.post("/ai/naics", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { query, industry } = req.body;
  if (!query) {
    res.status(400).json({ error: "Missing query" });
    return;
  }

  try {
    const prompt = `A small business owner describes their business as: "${query}". Industry: ${industry || "not specified"}.

Return exactly 5 NAICS code suggestions as a raw JSON array (no markdown, no code fences). Each object must have exactly these fields:
- "code": 6-digit NAICS code as a string (e.g. "541512")
- "title": official NAICS title string
- "description": 1-2 sentence description of what this code covers
- "relevance": exactly one of "primary", "secondary", or "related"
- "govContractTip": one specific tip about using this code to win government contracts

Output ONLY the JSON array, starting with [ and ending with ]. No explanation, no markdown.`;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "[]";
    let codes;
    try {
      codes = JSON.parse(extractJson(text));
    } catch {
      codes = [];
    }
    res.json({ codes: Array.isArray(codes) ? codes : [] });
  } catch (err: unknown) {
    req.log.error({ err }, "NAICS AI error");
    res.status(500).json({ error: "AI service unavailable" });
  }
});

router.post("/ai/grants", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { profile } = req.body;
  if (!profile) {
    res.status(400).json({ error: "Missing profile" });
    return;
  }

  try {
    const prompt = `A small business owner has the following profile:
- Business: ${profile.businessName || "unnamed"}
- Industry: ${profile.industry || "not specified"}
- State: ${profile.state || "MD"}
- Entity: ${profile.entityType || "LLC"}
- Years in business: ${profile.yearsInBusiness || "0"}
- Employees: ${profile.employees || "1"}
- Annual revenue: $${profile.annualRevenue || "0"}K
- Certifications: ${(profile.certifications || []).join(", ") || "none"}
- Funding goals: ${(profile.fundingGoals || []).join(", ") || "not specified"}
- Target funding amount: ${profile.fundingAmount || "not specified"}

Return exactly 8 real funding opportunities as a raw JSON array (no markdown, no code fences). Each object must have exactly these fields:
- "id": unique string id (e.g. "opp-1")
- "title": program name
- "type": exactly one of "Grant", "Loan", or "contract"
- "amount": dollar range string (e.g. "Up to $250,000")
- "deadline": deadline string or "Rolling" or "Quarterly"
- "match": integer 0-100 representing match score based on their profile
- "description": 1-2 sentences about the program
- "requirements": array of 3-4 key eligibility strings
- "applyUrl": real application URL string
- "agency": administering agency name string
- "tags": array of tag strings like ["woman-owned", "federal", "sbir"]

Focus on real, currently active federal and state programs. Include SBA loans, SBIR/STTR if tech-related, state-level grants, and federal set-aside contracts. Higher match scores for programs that fit their certifications and industry.

Output ONLY the JSON array, starting with [ and ending with ]. No explanation, no markdown.`;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "[]";
    let grants;
    try {
      grants = JSON.parse(extractJson(text));
    } catch {
      grants = [];
    }
    res.json({ grants: Array.isArray(grants) ? grants : [] });
  } catch (err: unknown) {
    req.log.error({ err }, "Grants AI error");
    res.status(500).json({ error: "AI service unavailable" });
  }
});

router.post("/ai/capabilitystatement", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { profile } = req.body;
  if (!profile) { res.status(400).json({ error: "Missing profile" }); return; }

  try {
    const naicsLines = (profile.naicsCodes || []).map((n: { code: string; title: string }) => `${n.code} – ${n.title}`).join(", ") || "Not specified";
    const certLines = (profile.certifications || []).join(", ") || "None";

    const prompt = `Generate a professional government contracting capability statement for the following business. Return ONLY a valid JSON object (no markdown, no code fences).

Business Profile:
- Company: ${profile.businessName || "Company Name"}
- Owner: ${profile.ownerName || ""}
- Industry: ${profile.industry || "Not specified"}
- Entity type: ${profile.entityType || "LLC"}
- State: ${profile.state || ""}
- Years in business: ${profile.yearsInBusiness || "0"}
- Employees: ${profile.employees || "1"}
- Annual revenue: $${profile.annualRevenue || "0"}K
- Mission: ${profile.missionStatement || ""}
- NAICS Codes: ${naicsLines}
- Certifications: ${certLines}
- Email: ${profile.contactEmail || ""}
- Phone: ${profile.contactPhone || ""}

Return a JSON object with exactly these fields:
{
  "companyOverview": "2-3 sentence professional overview positioning the company for government contracting",
  "coreCompetencies": ["competency 1", "competency 2", "competency 3", "competency 4", "competency 5"],
  "differentiators": ["differentiator 1", "differentiator 2", "differentiator 3"],
  "pastPerformance": "1-2 sentences about past performance, or a placeholder if unknown",
  "naicsCodes": "${naicsLines}",
  "certifications": "${certLines}",
  "contactName": "${profile.ownerName || profile.businessName || ""}",
  "contactEmail": "${profile.contactEmail || ""}",
  "contactPhone": "${profile.contactPhone || ""}",
  "contactLocation": "${profile.state || ""}"
}

Make the language professional, concise, and optimized for government procurement officers. Output ONLY the JSON object.`;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";
    let statement;
    try {
      statement = JSON.parse(extractJson(text));
    } catch {
      statement = {};
    }
    res.json({ statement });
  } catch (err: unknown) {
    req.log.error({ err }, "Capability statement AI error");
    res.status(500).json({ error: "AI service unavailable" });
  }
});

export default router;
