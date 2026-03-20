import { Router, type IRouter, type Request, type Response } from "express";
import Anthropic from "@anthropic-ai/sdk";

const router: IRouter = Router();

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
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
    const client = getClient();
    const messages: Anthropic.MessageParam[] = [
      ...(history || []).map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const response = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      system: systemPrompt || "You are BizLaunch Assistant, an expert business setup advisor helping small business owners structure their companies for grants, loans, and government contracts. Be concise, specific, and actionable. Keep answers under 200 words unless the question requires more.",
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
    const client = getClient();
    const prompt = `A small business owner describes their business as: "${query}". Industry: ${industry || "not specified"}.

Return exactly 5 NAICS code suggestions as a JSON array. Each object must have:
- code: 6-digit NAICS code (string)
- title: official NAICS title
- description: 1-2 sentence description of what this code covers
- relevance: "primary", "secondary", or "related"
- govContractTip: one specific tip about using this code to win government contracts

Return only valid JSON array, no markdown, no explanation.`;

    const response = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "[]";
    let codes;
    try {
      codes = JSON.parse(text.trim());
    } catch {
      codes = [];
    }
    res.json({ codes });
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
    const client = getClient();
    const prompt = `A small business owner has the following profile:
- Business: ${profile.businessName || "unnamed"}
- Industry: ${profile.industry || "not specified"}
- State: ${profile.state || "MD"}
- Entity: ${profile.entityType || "LLC"}
- Years: ${profile.yearsInBusiness || "0"}
- Employees: ${profile.employees || "1"}
- Revenue: $${profile.annualRevenue || "0"}K
- Certifications: ${(profile.certifications || []).join(", ") || "none"}
- Goals: ${(profile.fundingGoals || []).join(", ") || "not specified"}
- Target amount: ${profile.fundingAmount || "not specified"}

Return 8 real funding opportunities as a JSON array. Each object must have:
- id: unique string id
- title: program name
- type: "grant", "loan", or "contract"
- amount: dollar range (e.g. "Up to $250,000")
- deadline: deadline or "Rolling" or "Quarterly"
- match: 0-100 match score based on their profile
- description: 1-2 sentences about the program
- requirements: array of 3-4 key eligibility strings
- applyUrl: the real application URL
- agency: administering agency name
- tags: array of relevant tags like ["woman-owned", "federal", "sbir"]

Focus on real federal and state programs. Include SBIR/STTR if tech-related, SBA loans, state grants, and set-aside contracts. Return only valid JSON array.`;

    const response = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "[]";
    let grants;
    try {
      grants = JSON.parse(text.trim());
    } catch {
      grants = [];
    }
    res.json({ grants });
  } catch (err: unknown) {
    req.log.error({ err }, "Grants AI error");
    res.status(500).json({ error: "AI service unavailable" });
  }
});

export default router;
