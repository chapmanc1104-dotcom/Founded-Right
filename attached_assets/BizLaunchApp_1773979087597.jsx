import { useState, useRef } from "react";
import { callClaude, callClaudeJSON } from "./lib/ai.js";

const SECTIONS = [
  {
    id: "legal", title: "Legal foundation", icon: "⚖️",
    items: [
      { id: "articles", label: "Articles of Organization filed & accepted", note: "Keep a certified copy — lenders and grant apps will request it.", tags: ["required"] },
      { id: "ein", label: "Obtain EIN from the IRS", note: "Free at irs.gov. Required for all banking, taxes, and funding applications.", tags: ["required"] },
      { id: "opagree", label: "Draft and sign an Operating Agreement", note: "Proves governance structure to lenders and investors.", tags: ["required"] },
      { id: "boi", label: "File BOI report with FinCEN", note: "Required under the Corporate Transparency Act for most new LLCs.", tags: ["required"] },
      { id: "licenses", label: "Obtain required business licenses & permits", note: "Check federal, state, county, and city requirements for your industry.", tags: ["required"] },
      { id: "regagent", label: "Update registered agent address", note: "Remove personal home address from all public filings.", tags: ["required"] },
    ]
  },
  {
    id: "banking", title: "Banking & financials", icon: "🏦",
    items: [
      { id: "checking", label: "Open a dedicated business checking account", note: "Never commingle personal and business funds.", tags: ["required"] },
      { id: "savings", label: "Open a business savings account", note: "Demonstrates financial discipline to lenders.", tags: [] },
      { id: "accounting", label: "Set up accounting software", note: "QuickBooks, Wave, or FreshBooks — clean books are mandatory.", tags: ["required"] },
      { id: "bizcard", label: "Establish a business credit card", note: "Builds credit history; keep utilization under 30%.", tags: [] },
      { id: "coa", label: "Create a chart of accounts", note: "Auditors and grant reviewers want organized financials.", tags: ["required"] },
      { id: "balsheet", label: "Prepare an opening balance sheet", note: "Required for SBA loans and many grant applications.", tags: ["required"] },
    ]
  },
  {
    id: "credit", title: "Business credit profile", icon: "📊",
    items: [
      { id: "dnb", label: "Register with Dun & Bradstreet (DUNS number)", note: "Required by many federal grant programs. Free at dnb.com.", tags: ["required", "gov"] },
      { id: "experian", label: "Register with Experian Business & Equifax Business", note: "Establishes your file with all three major business bureaus.", tags: [] },
      { id: "net30", label: "Apply for a Net-30 vendor account", note: "Uline, Quill, or Grainger — fastest way to build a Paydex score.", tags: [] },
      { id: "paydex", label: "Monitor your Paydex score monthly", note: "A score of 80+ is needed for most favorable loan terms.", tags: [] },
    ]
  },
  {
    id: "federal", title: "Federal & state registrations", icon: "🏛️",
    items: [
      { id: "sam", label: "Register in SAM.gov", note: "Absolutely required for any federal grant or government contract.", tags: ["required", "gov"] },
      { id: "uei", label: "Obtain a UEI (Unique Entity Identifier)", note: "Issued automatically upon SAM registration.", tags: ["required", "gov"] },
      { id: "naics", label: "Identify and apply for NAICS codes", note: "Determines which contracts and grants you're eligible for.", tags: ["required", "gov"] },
      { id: "sbasize", label: "Determine your SBA business size standard", note: "Sets whether you qualify as a small business for set-asides.", tags: ["gov"] },
      { id: "stateprocure", label: "Register in your state procurement portal", note: "Maryland eMMA portal for state contracts and grants.", tags: ["gov"] },
      { id: "grantsgov", label: "Register in Grants.gov", note: "Central portal for all federal grant opportunities.", tags: ["required"] },
    ]
  },
  {
    id: "certs", title: "Small business certifications", icon: "🏅",
    items: [
      { id: "sba8a", label: "Apply for SBA 8(a) Business Development (if eligible)", note: "For socially/economically disadvantaged owners. 9 years of access.", tags: ["gov"] },
      { id: "wosb", label: "Women-Owned Small Business (WOSB) certification", note: "Unlocks 5% set-aside of federal contracts.", tags: ["gov"] },
      { id: "vosb", label: "Veteran-Owned / SDVOSB certification (if eligible)", note: "Verify through VA's Vendor Information Pages portal.", tags: ["gov"] },
      { id: "hubzone", label: "HUBZone certification (if in qualifying area)", note: "Check the HUBZone map at sba.gov.", tags: ["gov"] },
      { id: "mbe", label: "Minority Business Enterprise (MBE) certification", note: "Issued by NMSDC — opens corporate supplier diversity programs.", tags: [] },
    ]
  },
  {
    id: "grants", title: "Grant readiness", icon: "💰",
    items: [
      { id: "execsummary", label: "Write a one-page executive summary", note: "Describe your business, mission, and community impact.", tags: ["required"] },
      { id: "impact", label: "Define your business impact metrics", note: "Jobs created, community served, revenue projected.", tags: ["required"] },
      { id: "budget", label: "Prepare a 12-month budget & cash flow projection", note: "Standard requirement for federal, state, and foundation grants.", tags: ["required"] },
      { id: "grantlist", label: "Identify 5–10 target grant programs", note: "Search Grants.gov, your state econ dev office, and foundations.", tags: [] },
      { id: "grantcal", label: "Create a grants deadline calendar", note: "Missed deadlines mean waiting a full year.", tags: [] },
      { id: "sbir", label: "Research SBIR/STTR programs (if R&D focus)", note: "Offers $150K–$1M+ for qualifying tech businesses.", tags: [] },
    ]
  },
  {
    id: "presence", title: "Professional presence", icon: "🌐",
    items: [
      { id: "domain", label: "Register a business domain name (.com)", note: "Use your LLC name or close variation. Register at Namecheap or GoDaddy (~$10–15/yr).", tags: ["required"] },
      { id: "bizemail", label: "Set up a professional business email address", note: "yourname@yourbusiness.com via Google Workspace or Microsoft 365 ($6/mo). Never use Gmail/Yahoo on applications.", tags: ["required"] },
      { id: "bizphone", label: "Obtain a dedicated business phone number", note: "OpenPhone ($15/mo), Grasshopper, or Google Voice. Toll-free (800/888) adds credibility on applications.", tags: ["required"] },
      { id: "website", label: "Launch a professional business website", note: "Minimum: homepage, about, services, and contact page. Reviewers will look you up.", tags: ["required"] },
      { id: "capstatement", label: "Create a capability statement (1 page)", note: "The business card of government contracting. Lists core competencies, differentiators, past performance, and NAICS codes.", tags: ["gov"] },
      { id: "linkedin", label: "Set up a LinkedIn company page", note: "Grant reviewers and contracting officers verify legitimacy here. Keep it current.", tags: [] },
      { id: "googlebiz", label: "Create a Google Business Profile", note: "Establishes your business in search and maps. Adds credibility with local funders and partners.", tags: [] },
      { id: "logo", label: "Design a professional logo and brand identity", note: "Used on website, email signature, capability statement, and grant applications. Canva or 99designs if budget is tight.", tags: [] },
      { id: "emailsig", label: "Set up a professional email signature", note: "Include name, title, business name, phone, website, and address. Should match across all communications.", tags: [] },
      { id: "socialmedia", label: "Establish social media profiles on key platforms", note: "At minimum: LinkedIn. Add Facebook/Instagram/X depending on your industry. Consistent handle across all platforms.", tags: [] },
      { id: "presskit", label: "Prepare a media/press kit", note: "Bio, logo files, photos, key facts, and contact info. Required by some grant programs and larger partnerships.", tags: [] },
      { id: "pitchdeck", label: "Build a pitch deck (10–12 slides)", note: "Needed for investors and some competitive grant programs. Problem, solution, market, team, financials, ask.", tags: [] },
    ]
  },
  {
    id: "loans", title: "Loan & financing readiness", icon: "📋",
    items: [
      { id: "bizplan", label: "Prepare a full business plan (10–20 pages)", note: "Required for SBA loans and most institutional lenders.", tags: ["required"] },
      { id: "taxreturns", label: "Compile 2 years of personal tax returns", note: "SBA lenders require this for underwriting.", tags: ["required"] },
      { id: "personalcredit", label: "Pull & address personal credit report issues", note: "Most SBA loans require a personal guarantee.", tags: ["required"] },
      { id: "sba7a", label: "Research SBA 7(a) loan program", note: "Up to $5M for working capital, equipment, real estate.", tags: [] },
      { id: "microloan", label: "Research SBA Microloan program ($50K and under)", note: "Less stringent than 7(a) — ideal for early stage.", tags: [] },
      { id: "cdfi", label: "Identify local CDFI lenders in Maryland", note: "CDFIs often lend to businesses that don't yet qualify for banks.", tags: [] },
    ]
  },
];

const FUNDING = [
  { id: "mbda", title: "MBDA Business Center Grant", type: "Grant", agency: "Federal · Minority Business Development Agency", deadline: "Apr 15, 2026", amount: "Up to $50,000", repay: false, match: 91, color: "#E1F5EE", tcolor: "#085041", needs: ["sam", "execsummary", "budget"] },
  { id: "sba-ca", title: "SBA Community Advantage Loan", type: "Loan", agency: "SBA · Rolling deadline", deadline: "Rolling", amount: "$50,000 – $350,000", repay: true, match: 85, color: "#E6F1FB", tcolor: "#0C447C", needs: ["bizplan", "taxreturns", "balsheet"] },
  { id: "tedco", title: "MD TEDCO Rural Business Fund", type: "Grant", agency: "Maryland State · Technology Development", deadline: "May 1, 2026", amount: "Up to $100,000", repay: false, match: 78, color: "#EEEDFE", tcolor: "#3C3489", needs: ["sam", "execsummary", "budget", "bizplan"] },
  { id: "sbir", title: "SBIR Phase I Grant", type: "Grant", agency: "Federal · NSF/DOD · R&D focus required", deadline: "Rolling", amount: "Up to $275,000", repay: false, match: 62, color: "#FAEEDA", tcolor: "#633806", needs: ["sam", "uei", "execsummary", "budget"] },
  { id: "sba7a", title: "SBA 7(a) Business Loan", type: "Loan", agency: "SBA · Bank partners", deadline: "Rolling", amount: "Up to $5,000,000", repay: true, match: 74, color: "#EAF3DE", tcolor: "#27500A", needs: ["ein", "bizplan", "taxreturns", "balsheet", "personalcredit"] },
  { id: "microloan", title: "SBA Microloan", type: "Loan", agency: "SBA · Nonprofit intermediaries", deadline: "Rolling", amount: "Up to $50,000", repay: true, match: 88, color: "#FBEAF0", tcolor: "#72243E", needs: ["ein", "bizplan"] },
  { id: "marylandsmall", title: "Maryland Small Business Relief Grant", type: "Grant", agency: "Maryland DHCD · State program", deadline: "Jun 30, 2026", amount: "Up to $25,000", repay: false, match: 80, color: "#E1F5EE", tcolor: "#085041", needs: ["ein", "execsummary", "budget"] },
  { id: "govcon", title: "Federal Small Business Set-Aside Contracts", type: "Gov Contract", agency: "Federal · Various agencies", deadline: "Ongoing", amount: "Varies", repay: false, match: 55, color: "#F1EFE8", tcolor: "#2C2C2A", needs: ["sam", "uei", "naics", "sbasize"] },
];

const EVENTS = [
  { date: "Mar 15, 2026", label: "BOI Report — FinCEN", urgent: true },
  { date: "Mar 22, 2026", label: "SAM.gov registration", urgent: true },
  { date: "Mar 31, 2026", label: "Q1 estimated tax payment", urgent: false },
  { date: "Apr 15, 2026", label: "MBDA Grant deadline", urgent: false },
  { date: "Apr 15, 2026", label: "Personal tax return due", urgent: false },
  { date: "May 1, 2026", label: "TEDCO Fund closes", urgent: false },
  { date: "Jun 30, 2026", label: "MD Small Business Relief Grant", urgent: false },
  { date: "Annual", label: "SAM.gov renewal", urgent: false },
  { date: "Annual", label: "Maryland Annual Report filing", urgent: false },
];

}

function getScore(checklist) {
  let total = 0, done = 0;
  SECTIONS.forEach(s => s.items.forEach(i => { total++; if (checklist[i.id]) done++; }));
  return total ? Math.round((done / total) * 100) : 0;
}

function getDone(checklist) {
  let done = 0;
  SECTIONS.forEach(s => s.items.forEach(i => { if (checklist[i.id]) done++; }));
  return done;
}

function getTotal() {
  let t = 0; SECTIONS.forEach(s => t += s.items.length); return t;
}

const Tag = ({ type }) => {
  const styles = {
    required: { bg: "#FCEBEB", color: "#A32D2D", label: "required" },
    gov: { bg: "#FAEEDA", color: "#633806", label: "gov contracts" },
  };
  const s = styles[type];
  if (!s) return null;
  return <span style={{ background: s.bg, color: s.color, fontSize: 10, padding: "2px 8px", borderRadius: 99, fontWeight: 600, marginLeft: 6, display: "inline-block" }}>{s.label}</span>;
};

const ScoreRing = ({ pct }) => {
  const r = 36, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 70 ? "#1D9E75" : pct >= 40 ? "#BA7517" : "#E24B4A";
  return (
    <svg width={88} height={88} viewBox="0 0 88 88">
      <circle cx={44} cy={44} r={r} fill="none" stroke="#f0f0f0" strokeWidth={8} />
      <circle cx={44} cy={44} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 44 44)" style={{ transition: "stroke-dasharray 0.6s ease" }} />
      <text x={44} y={44} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: 16, fontWeight: 700, fill: color, fontFamily: "inherit" }}>{pct}%</text>
    </svg>
  );
};


function NAICSFinder({ state, update, addNaics, removeNaics }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(state.naicsResults || []);
  const [error, setError] = useState("");

  const search = async () => {
    if (!query.trim() || loading) return;
    setLoading(true); setError("");
    try {
      const parsed = await callClaudeJSON({
        messages: [{
          role: "user",
          content: `A business owner described their business as: "${query}"
Their industry is: "${state.profile.industry || "not specified"}"

Return the 5 most relevant NAICS codes for this business as a JSON array. Each item must have:
- code: the 6-digit NAICS code (string)
- title: the official NAICS title
- description: 1-2 sentence plain English explanation of what this code covers
- relevance: "primary" | "secondary" | "related"
- govContractTip: one sentence on how this code helps with government contracts

Return ONLY valid JSON array, no markdown, no preamble.`
        }]
      });
      setResults(parsed);
      update({ naicsResults: parsed });
    } catch(e) {
      setError("Could not fetch NAICS codes. Please try again.");
    }
    setLoading(false);
  };

  const addCode = (item) => addNaics(item);
  const removeCode = (code) => removeNaics(code);

  const selectedCodes = state.naicsCodes || [];

  return (
    <>
      <div className="page-title">NAICS code finder</div>
      <div className="page-sub">Find the right industry codes to unlock government contracts and grants — powered by AI</div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">What does your business do?</div>
        <div style={{ display: "flex", gap: 10 }}>
          <textarea
            className="chat-input"
            rows={2}
            style={{ flex: 1, resize: "none", lineHeight: 1.5, padding: "10px 14px" }}
            placeholder={`e.g. "We provide cybersecurity consulting and IT staffing to federal agencies and private healthcare companies in the DC area"`}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="chat-send" style={{ alignSelf: "stretch", minWidth: 90 }} onClick={search} disabled={loading || !query.trim()}>
            {loading ? "..." : "Find codes →"}
          </button>
        </div>
        {state.profile.industry && (
          <div style={{ fontSize: 11, color: "#555", marginTop: 8 }}>
            ✦ Pre-filled with your industry: <span style={{ color: "#9b8ff0" }}>{state.profile.industry}</span>. Be specific about services, customers, and methods for better results.
          </div>
        )}
        {error && <div style={{ fontSize: 12, color: "#E24B4A", marginTop: 8 }}>{error}</div>}
      </div>

      {selectedCodes.length > 0 && (
        <div className="card" style={{ marginBottom: 16, borderLeft: "3px solid #1D9E75", borderRadius: "0 12px 12px 0" }}>
          <div className="card-title">Your selected NAICS codes</div>
          {selectedCodes.map(n => (
            <div key={n.code} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #1a1a1e" }}>
              <div style={{ background: "#1D9E7520", color: "#1D9E75", fontSize: 13, fontWeight: 700, padding: "4px 10px", borderRadius: 6, flexShrink: 0 }}>{n.code}</div>
              <div style={{ flex: 1, fontSize: 13, color: "#d0cdc8" }}>{n.title}</div>
              <button onClick={() => removeCode(n.code)} style={{ fontSize: 11, color: "#555", background: "none", padding: "4px 8px", border: "1px solid #2a2a30", borderRadius: 6, cursor: "pointer" }}>Remove</button>
            </div>
          ))}
          <div style={{ fontSize: 11, color: "#555", marginTop: 10 }}>
            These codes are saved to your profile and used to match funding opportunities and government contracts.
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="card">
          <div className="card-title">AI-recommended NAICS codes</div>
          {results.map((item, i) => {
            const already = selectedCodes.find(n => n.code === item.code);
            const relColor = item.relevance === "primary" ? { bg: "#1D9E7518", color: "#1D9E75" } : item.relevance === "secondary" ? { bg: "#7f77dd18", color: "#9b8ff0" } : { bg: "#33333a", color: "#777" };
            return (
              <div key={item.code} style={{ padding: "14px 0", borderBottom: i < results.length-1 ? "1px solid #1a1a1e" : "none" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ background: "#1e1e30", color: "#9b8ff0", fontSize: 14, fontWeight: 700, padding: "5px 12px", borderRadius: 8, flexShrink: 0, letterSpacing: "0.05em" }}>{item.code}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "#e0ddd8" }}>{item.title}</span>
                      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, fontWeight: 600, background: relColor.bg, color: relColor.color }}>{item.relevance}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5, marginBottom: 6 }}>{item.description}</div>
                    <div style={{ fontSize: 11, color: "#555", background: "#1a1a1e", padding: "6px 10px", borderRadius: 6 }}>
                      <span style={{ color: "#7f77dd" }}>Gov contract tip:</span> {item.govContractTip}
                    </div>
                  </div>
                  <button onClick={() => already ? removeCode(item.code) : addCode(item)}
                    className={already ? "reset-btn" : "chat-send"}
                    style={{ fontSize: 12, padding: "7px 14px", flexShrink: 0, alignSelf: "flex-start" }}>
                    {already ? "✓ Added" : "+ Add"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {results.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#555", fontSize: 13 }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>⌖</div>
          Describe your business above and the AI will suggest the best NAICS codes for you.
          <div style={{ marginTop: 8, fontSize: 11 }}>Getting the right codes is critical — wrong codes can disqualify you from contracts and grants.</div>
        </div>
      )}
    </>
  );
}

function LiveGrants({ state, update, saveGrants, profile, checklist }) {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchGrants = async () => {
    setLoading(true);
    try {
      const parsed = await callClaudeJSON({
        maxTokens: 2000,
        messages: [{
          role: "user",
          content: `Generate a realistic list of 12 current funding opportunities for this business profile:

Business: ${state.businessName || "Small business"}
Industry: ${profile.industry || "General"}
State: ${profile.state || "MD"}
Revenue stage: ${profile.annualRevenue || "0"}
Employees: ${profile.employees || "1"}
Certifications: ${(profile.certifications||[]).join(", ") || "none"}
NAICS codes: ${(state.naicsCodes||[]).map(n=>n.code).join(", ") || "TBD"}
Funding goals: ${(profile.fundingGoals||[]).join(", ") || "general"}
Mission: ${profile.missionStatement || "not provided"}

Return a JSON array of 12 opportunities. Each must have:
- id: unique string
- title: program name
- agency: administering organization
- type: "Grant" | "Loan" | "Gov Contract" | "Tax Credit"
- amount: funding range as string e.g. "Up to $50,000" or "$25K–$350K"
- deadline: e.g. "Rolling" or "Jun 30, 2026" or "Quarterly"
- repayable: boolean
- matchScore: 50-97 integer based on how well it fits the profile
- eligibility: 1 sentence on key eligibility criteria
- applyUrl: realistic URL (use real program URLs where known)
- matchReason: 1 sentence why this matches the profile
- requiredSteps: array of 2-4 strings listing what the business needs to have done first

Include a mix of federal, state (${profile.state || "MD"}), local, and private foundation opportunities.
Return ONLY valid JSON array, no markdown, no preamble.`
        }]
      });
      saveGrants(parsed);
    } catch(e) {
      saveGrants([]);
    }
    setLoading(false);
  };

  const grants = state.liveGrants || [];

  const getReadiness = (g) => {
    const done = (g.requiredSteps||[]).filter(step => {
      const s = step.toLowerCase();
      if (s.includes("sam.gov") || s.includes("sam")) return checklist.sam;
      if (s.includes("ein")) return checklist.ein;
      if (s.includes("bank")) return checklist.checking;
      if (s.includes("business plan") || s.includes("bizplan")) return checklist.bizplan;
      if (s.includes("exec") || s.includes("summary")) return checklist.execsummary;
      if (s.includes("budget") || s.includes("cash flow")) return checklist.budget;
      if (s.includes("balance")) return checklist.balsheet;
      if (s.includes("tax")) return checklist.taxreturns;
      return false;
    }).length;
    return { done, total: (g.requiredSteps||[]).length };
  };

  const filtered = grants
    .filter(g => filter === "all" || g.type === filter || (filter === "ready" && getReadiness(g).done === getReadiness(g).total))
    .filter(g => !searchQuery || g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.agency.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.matchScore - a.matchScore);

  const typeColors = {
    "Grant": { bg: "#1D9E7520", color: "#1D9E75" },
    "Loan": { bg: "#185FA520", color: "#378ADD" },
    "Gov Contract": { bg: "#7f77dd20", color: "#9b8ff0" },
    "Tax Credit": { bg: "#BA751720", color: "#EF9F27" },
  };

  return (
    <>
      <div className="page-title">Live funding database</div>
      <div className="page-sub">AI-matched opportunities for {state.businessName || "your business"} — personalized to your profile</div>

      {!state.grantsFetched ? (
        <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>◎</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "#d0cdc8", marginBottom: 8 }}>Find funding matched to your profile</div>
          <div style={{ fontSize: 13, color: "#666", marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" }}>
            The AI will search federal, state, and private programs and score each one against your business profile, industry, certifications, and NAICS codes.
          </div>
          {profile.industry ? (
            <button className="chat-send" style={{ padding: "12px 28px", fontSize: 14 }} onClick={fetchGrants} disabled={loading}>
              {loading ? "Searching funding sources..." : `Find grants for ${profile.industry} →`}
            </button>
          ) : (
            <div style={{ fontSize: 12, color: "#555" }}>Complete your profile to get personalized matches. <br/>Go to Settings to add your industry and goals.</div>
          )}
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Total found", val: grants.length },
              { label: "Grants", val: grants.filter(g=>g.type==="Grant").length },
              { label: "Loans", val: grants.filter(g=>g.type==="Loan").length },
              { label: "Ready to apply", val: grants.filter(g=>{ const r=getReadiness(g); return r.done===r.total; }).length },
            ].map(s => (
              <div key={s.label} className="stat"><div className="stat-val">{s.val}</div><div className="stat-lbl">{s.label}</div></div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
            <input className="chat-input" style={{ flex: 1, padding: "8px 14px", fontSize: 13 }}
              placeholder="Search by name or agency..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <button className="fund-btn" onClick={fetchGrants} disabled={loading} style={{ whiteSpace: "nowrap" }}>
              {loading ? "..." : "Refresh ↻"}
            </button>
          </div>

          <div className="filter-row" style={{ marginBottom: 16 }}>
            {["all","Grant","Loan","Gov Contract","ready"].map(f => (
              <button key={f} className={`filter-btn${filter===f?" active":""}`} onClick={() => setFilter(f)}>
                {f==="all"?"All types":f==="ready"?"Ready to apply":f}
              </button>
            ))}
          </div>

          {filtered.map(g => {
            const tc = typeColors[g.type] || { bg:"#33333a", color:"#777" };
            const { done: rDone, total: rTotal } = getReadiness(g);
            const ready = rDone === rTotal;
            return (
              <div className="fund-card" key={g.id} style={{ flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                      <span className="fund-title">{g.title}</span>
                      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, fontWeight: 600, background: tc.bg, color: tc.color }}>{g.type}</span>
                      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, fontWeight: 600, background: g.matchScore>=85?"#1D9E7518":g.matchScore>=70?"#7f77dd18":"#33333a", color: g.matchScore>=85?"#1D9E75":g.matchScore>=70?"#9b8ff0":"#777" }}>{g.matchScore}% match</span>
                      {ready && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "#1D9E7520", color: "#1D9E75", fontWeight: 600 }}>✓ ready</span>}
                    </div>
                    <div className="fund-meta">{g.agency} · {g.deadline}</div>
                    <div className="fund-amt">{g.amount}{g.repayable?" · repayable":""}</div>
                  </div>
                  <a href={g.applyUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <button className="fund-btn">Apply ↗</button>
                  </a>
                </div>
                <div style={{ background: "#111114", borderRadius: 8, padding: "10px 12px", fontSize: 11, display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ color: "#555", marginBottom: 3 }}>Why it matches</div>
                    <div style={{ color: "#888", lineHeight: 1.4 }}>{g.matchReason}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ color: "#555", marginBottom: 3 }}>Prerequisites ({rDone}/{rTotal} done)</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {(g.requiredSteps||[]).map((step, i) => {
                        const r = getReadiness(g);
                        const stepDone = (() => {
                          const s = step.toLowerCase();
                          if (s.includes("sam")) return checklist.sam;
                          if (s.includes("ein")) return checklist.ein;
                          if (s.includes("bank")) return checklist.checking;
                          if (s.includes("business plan")) return checklist.bizplan;
                          if (s.includes("exec")) return checklist.execsummary;
                          if (s.includes("budget")) return checklist.budget;
                          if (s.includes("balance")) return checklist.balsheet;
                          if (s.includes("tax")) return checklist.taxreturns;
                          return false;
                        })();
                        return (
                          <span key={i} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: stepDone?"#1D9E7512":"#E24B4A10", color: stepDone?"#1D9E75":"#888" }}>
                            {stepDone?"✓ ":""}{step}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "30px", color: "#555", fontSize: 13 }}>No opportunities match this filter.</div>
          )}
        </>
      )}
    </>
  );
}

export default function BizLaunchApp({ auth, appState }) {
  const {
    state, update, updateProfile, completeOnboarding,
    updateBusinessName, toggleItem,
    addNaics, removeNaics, saveGrants,
    addChatMessage, resetChat,
    saveApplication, removeApplication,
  } = appState;

  const [screen, setScreen] = useState("dashboard");
  const [filter, setFilter] = useState("all");
  const [fundFilter, setFundFilter] = useState("all");
  const [openSections, setOpenSections] = useState({ legal: true });
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatRef = useRef(null);

  // Scroll chat to bottom on new messages
  const prevChatLen = useRef(0);
  if (state.chatHistory.length !== prevChatLen.current) {
    prevChatLen.current = state.chatHistory.length;
    setTimeout(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 50);
  }

  const update = (patch) => setState(s => ({ ...s, ...patch }));
  // toggleItem is provided by useAppState hook
  const toggleSection = (id) => setOpenSections(s => ({ ...s, [id]: !s[id] }));

  const score = getScore(state.checklist);
  const done = getDone(state.checklist);
  const total = getTotal();
  const urgent = SECTIONS.flatMap(s => s.items).filter(i => !state.checklist[i.id] && i.tags.includes("required")).slice(0, 5);

  const filteredItems = (items) => {
    if (filter === "incomplete") return items.filter(i => !state.checklist[i.id]);
    if (filter === "required") return items.filter(i => i.tags.includes("required"));
    if (filter === "gov") return items.filter(i => i.tags.includes("gov"));
    if (filter === "grants") return items.filter(i => ["execsummary", "impact", "budget", "grantlist", "grantcal", "sbir"].includes(i.id));
    if (filter === "presence") return items.filter(i => ["domain","bizemail","bizphone","website","capstatement","linkedin","googlebiz","logo","emailsig","socialmedia","presskit","pitchdeck"].includes(i.id));
    return items;
  };

  const filteredFunding = FUNDING.filter(f => {
    if (fundFilter === "grants") return f.type === "Grant";
    if (fundFilter === "loans") return f.type === "Loan";
    if (fundFilter === "gov") return f.type === "Gov Contract";
    return true;
  });

  const getFundingReadiness = (f) => {
    const needed = f.needs.filter(n => !state.checklist[n]);
    return { ready: needed.length === 0, missing: needed.length };
  };

  const sendAI = async (msg) => {
    if (!msg.trim() || aiLoading) return;
    await addChatMessage("user", msg);
    setAiInput("");
    setAiLoading(true);
    const newHistory = [...state.chatHistory, { role: "user", content: msg }];

    const completedItems = SECTIONS.flatMap(s => s.items.filter(i => state.checklist[i.id]).map(i => i.label));
    const pendingItems = SECTIONS.flatMap(s => s.items.filter(i => !state.checklist[i.id]).map(i => i.label));
    const pr = state.profile;

    const systemPrompt = `You are BizLaunch Assistant, an expert business setup advisor helping a small business owner structure their LLC for grants, loans, and government contracts.

Business profile:
- Business name: ${state.businessName || "not yet set"}
- Entity type: ${pr.entityType || "LLC"}
- Industry: ${pr.industry || "not specified"}
- State: ${pr.state || "MD"}
- ZIP: ${pr.zipCode || "not provided"}
- Years in business: ${pr.yearsInBusiness || "0"}
- Employees: ${pr.employees || "1"}
- Annual revenue: $${pr.annualRevenue || "0"}K
- Mission: ${pr.missionStatement || "not provided"}
- Funding goals: ${(pr.fundingGoals||[]).join(", ") || "not specified"}
- Target funding amount: ${pr.fundingAmount || "not specified"}
- Owner certifications: ${(pr.certifications||[]).join(", ") || "none selected"}
- NAICS codes: ${(pr.naicsCodes||[]).map(n=>n.code+' '+n.title).join(", ") || "not yet identified"}
- Setup score: ${score}% complete (${done}/${total} steps done)

Completed steps: ${completedItems.slice(0,10).join(", ") || "none yet"}
Still pending: ${pendingItems.slice(0,10).join(", ")}

Be concise, specific, and actionable. Reference their actual profile data when relevant. Prioritize advice that unlocks funding fastest. Keep answers under 200 words unless the question requires more detail. When mentioning grants or loans, cite real program names.`;

    try {
      const reply = await callClaude({
        system: systemPrompt,
        messages: newHistory.map(m => ({ role: m.role, content: m.content })),
      });
      await addChatMessage("assistant", reply);
    } catch {
      await addChatMessage("assistant", "Connection error. Please try again.");
    }
    setAiLoading(false);
  };

  const suggestedPrompts = [
    "What steps should I prioritize this week?",
    "What grants am I eligible for right now?",
    "How do I file my BOI report with FinCEN?",
    "Explain SAM.gov registration step by step",
    "What certifications should I apply for?",
    "How do I build business credit fast?",
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    body { font-family: 'DM Sans', sans-serif; background: #0f0f11; color: #f0ede8; }
    ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
    button { font-family: inherit; cursor: pointer; border: none; outline: none; }
    input, textarea { font-family: inherit; outline: none; border: none; background: none; }
    .app { display: flex; height: 100vh; overflow: hidden; }
    .sidebar { width: 220px; flex-shrink: 0; background: #0a0a0c; border-right: 1px solid #1e1e22; display: flex; flex-direction: column; padding: 0; }
    .brand { padding: 20px 18px 16px; border-bottom: 1px solid #1e1e22; }
    .brand-name { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #f0ede8; letter-spacing: -0.3px; }
    .brand-sub { font-size: 11px; color: #555; margin-top: 3px; }
    .nav-section { font-size: 9px; font-weight: 600; color: #444; letter-spacing: 0.12em; text-transform: uppercase; padding: 16px 18px 6px; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 18px; cursor: pointer; font-size: 13px; color: #777; border-left: 2px solid transparent; transition: all 0.15s; }
    .nav-item:hover { color: #ccc; background: #111; }
    .nav-item.active { color: #f0ede8; background: #111; border-left-color: #7f77dd; font-weight: 500; }
    .nav-icon { font-size: 14px; width: 20px; flex-shrink: 0; }
    .badge-nav { font-size: 10px; background: #E24B4A22; color: #E24B4A; padding: 1px 6px; border-radius: 99px; margin-left: auto; }
    .main { flex: 1; overflow-y: auto; background: #0f0f11; }
    .page { padding: 28px 32px; max-width: 960px; }
    .page-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #f0ede8; margin-bottom: 4px; }
    .page-sub { font-size: 13px; color: #666; margin-bottom: 24px; }
    .stat-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; margin-bottom: 24px; }
    .stat { background: #141416; border: 1px solid #1e1e22; border-radius: 12px; padding: 16px; }
    .stat-val { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 700; color: #f0ede8; }
    .stat-lbl { font-size: 11px; color: #555; margin-top: 4px; }
    .two-col { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 16px; margin-bottom: 16px; }
    .card { background: #141416; border: 1px solid #1e1e22; border-radius: 12px; padding: 18px 20px; margin-bottom: 14px; }
    .card-title { font-size: 13px; font-weight: 600; color: #aaa; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 14px; }
    .progress-row { display: flex; justify-content: space-between; font-size: 12px; color: #666; margin-bottom: 5px; margin-top: 10px; }
    .progress-row:first-of-type { margin-top: 0; }
    .prog-bg { background: #1e1e22; border-radius: 99px; height: 5px; }
    .prog-fill { height: 5px; border-radius: 99px; background: #7f77dd; transition: width 0.5s ease; }
    .checklist-row { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid #1a1a1e; }
    .checklist-row:last-child { border-bottom: none; }
    .cb { width: 18px; height: 18px; border-radius: 4px; flex-shrink: 0; border: 1.5px solid #333; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; margin-top: 1px; }
    .cb.checked { background: #1D9E75; border-color: #1D9E75; }
    .cb-check { font-size: 10px; color: white; display: none; }
    .cb.checked .cb-check { display: block; }
    .item-label { font-size: 13px; color: #d0cdc8; line-height: 1.4; }
    .item-label.done { color: #444; text-decoration: line-through; }
    .item-note { font-size: 11px; color: #555; margin-top: 3px; line-height: 1.4; }
    .section-header { display: flex; align-items: center; gap: 12px; padding: 14px 20px; cursor: pointer; background: #141416; border: 1px solid #1e1e22; border-radius: 12px; margin-bottom: 2px; transition: background 0.15s; }
    .section-header:hover { background: #181820; }
    .section-header.open { border-radius: 12px 12px 0 0; border-bottom: 1px solid #1e1e22; }
    .section-body { background: #141416; border: 1px solid #1e1e22; border-top: none; border-radius: 0 0 12px 12px; padding: 0 20px; margin-bottom: 10px; }
    .section-icon { font-size: 16px; }
    .section-title { font-size: 14px; font-weight: 500; color: #d0cdc8; flex: 1; }
    .section-count { font-size: 12px; color: #555; }
    .chevron { font-size: 10px; color: #555; transition: transform 0.2s; }
    .chevron.open { transform: rotate(180deg); }
    .filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
    .filter-btn { font-size: 12px; padding: 6px 14px; border-radius: 99px; border: 1px solid #2a2a30; background: transparent; color: #666; cursor: pointer; transition: all 0.15s; }
    .filter-btn:hover { color: #aaa; border-color: #444; }
    .filter-btn.active { background: #1e1e30; color: #9b8ff0; border-color: #7f77dd44; }
    .fund-card { background: #141416; border: 1px solid #1e1e22; border-radius: 12px; padding: 16px 20px; margin-bottom: 10px; display: flex; align-items: flex-start; gap: 14px; }
    .fund-card:hover { border-color: #2e2e38; }
    .fund-icon { width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 18px; }
    .fund-title { font-size: 14px; font-weight: 500; color: #e0ddd8; }
    .fund-meta { font-size: 11px; color: #555; margin-top: 3px; }
    .fund-amt { font-size: 12px; font-weight: 600; color: #1D9E75; margin-top: 5px; }
    .fund-match { font-size: 10px; padding: 2px 8px; border-radius: 99px; font-weight: 600; margin-left: 8px; }
    .fund-btn { font-size: 12px; padding: 7px 16px; border-radius: 8px; background: #1e1e30; color: #9b8ff0; border: 1px solid #7f77dd44; white-space: nowrap; transition: all 0.15s; flex-shrink: 0; }
    .fund-btn:hover { background: #26263a; }
    .missing-tag { font-size: 10px; background: #E24B4A18; color: #E24B4A; padding: 2px 8px; border-radius: 99px; margin-left: 8px; }
    .ready-tag { font-size: 10px; background: #1D9E7518; color: #1D9E75; padding: 2px 8px; border-radius: 99px; margin-left: 8px; }
    .cal-wrap { display: grid; grid-template-columns: repeat(7, minmax(0,1fr)); gap: 3px; }
    .cal-hdr { font-size: 10px; color: #555; text-align: center; padding: 6px 0; }
    .cal-day { font-size: 12px; text-align: center; padding: 7px 4px; border-radius: 8px; cursor: default; color: #666; }
    .cal-day.has { background: #1e1e30; color: #9b8ff0; font-weight: 500; }
    .cal-day.today { background: #7f77dd; color: white; font-weight: 600; }
    .event-row { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid #1a1a1e; font-size: 13px; }
    .event-row:last-child { border-bottom: none; }
    .event-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .event-date { font-size: 11px; color: #555; min-width: 80px; }
    .event-label { color: #c0bdb8; }
    .chat-outer { background: #0a0a0c; border: 1px solid #1e1e22; border-radius: 12px; overflow: hidden; }
    .chat-messages { padding: 16px; min-height: 320px; max-height: 420px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
    .msg { max-width: 82%; padding: 12px 15px; border-radius: 12px; font-size: 13px; line-height: 1.6; }
    .msg.ai { background: #141416; border: 1px solid #1e1e22; align-self: flex-start; color: #d0cdc8; border-radius: 4px 12px 12px 12px; }
    .msg.user { background: #2a2040; border: 1px solid #7f77dd44; color: #c8c4f0; align-self: flex-end; border-radius: 12px 4px 12px 12px; }
    .chat-input-area { border-top: 1px solid #1e1e22; padding: 12px 16px; display: flex; gap: 10px; align-items: center; }
    .chat-input { flex: 1; background: #141416; border: 1px solid #2a2a30; border-radius: 8px; padding: 9px 14px; font-size: 13px; color: #f0ede8; }
    .chat-input:focus { border-color: #7f77dd66; }
    .chat-send { background: #7f77dd; color: white; font-size: 13px; font-weight: 500; padding: 9px 18px; border-radius: 8px; transition: background 0.15s; }
    .chat-send:hover { background: #9b93e8; }
    .chat-send:disabled { background: #333; color: #666; cursor: not-allowed; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
    .chip { font-size: 12px; padding: 6px 14px; border: 1px solid #2a2a30; border-radius: 99px; background: transparent; color: #777; cursor: pointer; transition: all 0.15s; }
    .chip:hover { color: #c0bdb8; border-color: #555; background: #141416; }
    .typing { display: flex; gap: 4px; align-items: center; padding: 12px 15px; background: #141416; border: 1px solid #1e1e22; border-radius: 4px 12px 12px 12px; align-self: flex-start; }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: #7f77dd; animation: bounce 1s infinite; }
    .dot:nth-child(2) { animation-delay: 0.15s; } .dot:nth-child(3) { animation-delay: 0.3s; }
    @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
    .doc-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; margin-bottom: 16px; }
    .doc-card { background: #141416; border: 1px solid #1e1e22; border-radius: 10px; padding: 14px; cursor: pointer; transition: border-color 0.15s; }
    .doc-card:hover { border-color: #333; }
    .doc-card.missing { border: 1px dashed #333; background: #0e0e10; }
    .doc-name { font-size: 12px; font-weight: 500; color: #c0bdb8; margin-top: 8px; }
    .doc-meta { font-size: 10px; color: #555; margin-top: 3px; }
    .doc-status { display: inline-block; font-size: 10px; padding: 2px 7px; border-radius: 99px; margin-top: 6px; }
    .onboard { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0c; }
    .onboard-card { background: #141416; border: 1px solid #1e1e22; border-radius: 16px; padding: 40px; max-width: 440px; width: 100%; }
    .onboard-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 700; color: #f0ede8; margin-bottom: 8px; }
    .onboard-sub { font-size: 14px; color: #666; margin-bottom: 28px; line-height: 1.6; }
    .field-label { font-size: 12px; color: #777; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
    .field-input { width: 100%; background: #0f0f11; border: 1px solid #2a2a30; border-radius: 8px; padding: 10px 14px; font-size: 14px; color: #f0ede8; margin-bottom: 16px; }
    .field-input:focus { border-color: #7f77dd66; }
    .start-btn { width: 100%; background: #7f77dd; color: white; font-size: 15px; font-weight: 600; padding: 13px; border-radius: 10px; font-family: 'Syne', sans-serif; letter-spacing: -0.2px; transition: background 0.15s; }
    .start-btn:hover { background: #9b93e8; }
    .reset-btn { font-size: 11px; color: #444; background: none; padding: 8px 12px; border-radius: 6px; border: 1px solid #222; margin-top: 8px; }
    .reset-btn:hover { color: #777; border-color: #333; }
  `;

  const ONBOARD_STEPS = [
    { title: "Welcome", sub: "Let's get your business set up for funding" },
    { title: "Your business", sub: "Basic information about your company" },
    { title: "Owner profile", sub: "Tell us about yourself — unlocks certifications" },
    { title: "Funding goals", sub: "What types of funding are you pursuing?" },
    { title: "You're ready", sub: "Your personalized plan is ready" },
  ];

  const oStep = state.onboardStep || 0;
  const p = state.profile;
  const upP = (patch) => updateProfile(patch);

  const CERT_OPTIONS = [
    { id: "woman", label: "Woman-owned" },
    { id: "minority", label: "Minority-owned" },
    { id: "veteran", label: "Veteran-owned" },
    { id: "disabled_vet", label: "Service-disabled veteran" },
    { id: "hubzone", label: "Located in HUBZone area" },
    { id: "disadvantaged", label: "Socially/economically disadvantaged" },
  ];
  const GOAL_OPTIONS = [
    { id: "grants", label: "Federal grants" },
    { id: "state_grants", label: "State & local grants" },
    { id: "sba_loans", label: "SBA loans" },
    { id: "bank_loans", label: "Bank / CDFI loans" },
    { id: "gov_contracts", label: "Government contracts" },
    { id: "investors", label: "Investors / equity" },
  ];
  const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

  const toggleArr = (arr, val) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  const canAdvance = () => {
    if (oStep === 0) return true;
    if (oStep === 1) return state.businessName.trim().length > 0 && p.industry && p.state;
    if (oStep === 2) return p.ownerName.trim().length > 0;
    if (oStep === 3) return p.fundingGoals.length > 0;
    return true;
  };

  if (!state.onboarded) {
    return (
      <>
        <style>{css}</style>
        <div className="onboard">
          <div className="onboard-card" style={{ maxWidth: 520 }}>
            {/* Step indicator */}
            <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
              {ONBOARD_STEPS.map((s, i) => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 99,
                  background: i <= oStep ? "#7f77dd" : "#2a2a30",
                  transition: "background 0.3s"
                }} />
              ))}
            </div>

            <div style={{ marginBottom: 6, fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Step {oStep + 1} of {ONBOARD_STEPS.length}
            </div>
            <div className="onboard-title" style={{ fontSize: 22, marginBottom: 4 }}>{ONBOARD_STEPS[oStep].title}</div>
            <div className="onboard-sub">{ONBOARD_STEPS[oStep].sub}</div>

            {/* Step 0: Welcome */}
            {oStep === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: "✓", text: "Personalized setup checklist based on your goals" },
                  { icon: "✓", text: "Funding opportunities matched to your profile" },
                  { icon: "✓", text: "Certification eligibility flagged automatically" },
                  { icon: "✓", text: "NAICS code finder to unlock government contracts" },
                  { icon: "✓", text: "AI assistant that knows your business context" },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#1a1a20", borderRadius: 8, padding: "10px 14px" }}>
                    <span style={{ color: "#1D9E75", fontWeight: 700, flexShrink: 0 }}>{f.icon}</span>
                    <span style={{ fontSize: 13, color: "#c0bdb8" }}>{f.text}</span>
                  </div>
                ))}
                <div style={{ fontSize: 11, color: "#555", marginTop: 4, textAlign: "center" }}>Takes about 2 minutes · All data stays on your device</div>
              </div>
            )}

            {/* Step 1: Business info */}
            {oStep === 1 && (
              <div>
                <div className="field-label">Business name</div>
                <input className="field-input" placeholder="e.g. Apex Solutions LLC"
                  value={state.businessName}
                  onChange={e => updateBusinessName(e.target.value)} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <div className="field-label">Entity type</div>
                    <select className="field-input" value={p.entityType} onChange={e => upP({ entityType: e.target.value })}>
                      <option>LLC</option>
                      <option>S-Corp</option>
                      <option>C-Corp</option>
                      <option>Sole Proprietor</option>
                      <option>Nonprofit</option>
                      <option>Partnership</option>
                    </select>
                  </div>
                  <div>
                    <div className="field-label">State</div>
                    <select className="field-input" value={p.state} onChange={e => upP({ state: e.target.value })}>
                      {US_STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="field-label">Industry</div>
                <select className="field-input" value={p.industry} onChange={e => upP({ industry: e.target.value })}>
                  <option value="">Select an industry</option>
                  <option>Technology / Software</option>
                  <option>Consulting / Professional Services</option>
                  <option>Construction / Contracting</option>
                  <option>Healthcare / Medical</option>
                  <option>Retail / E-commerce</option>
                  <option>Food & Beverage</option>
                  <option>Manufacturing</option>
                  <option>Education / Training</option>
                  <option>Nonprofit / Social Impact</option>
                  <option>Other</option>
                </select>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <div className="field-label">Years in business</div>
                    <select className="field-input" value={p.yearsInBusiness} onChange={e => upP({ yearsInBusiness: e.target.value })}>
                      <option value="0">Less than 1 year</option>
                      <option value="1">1 year</option>
                      <option value="2">2 years</option>
                      <option value="3">3–5 years</option>
                      <option value="6">6–10 years</option>
                      <option value="11">10+ years</option>
                    </select>
                  </div>
                  <div>
                    <div className="field-label">Employees</div>
                    <select className="field-input" value={p.employees} onChange={e => upP({ employees: e.target.value })}>
                      <option value="1">Just me</option>
                      <option value="2">2–5</option>
                      <option value="6">6–10</option>
                      <option value="11">11–50</option>
                      <option value="51">51–500</option>
                    </select>
                  </div>
                </div>

                <div className="field-label">Annual revenue</div>
                <select className="field-input" value={p.annualRevenue} onChange={e => upP({ annualRevenue: e.target.value })}>
                  <option value="0">Pre-revenue</option>
                  <option value="1">Under $50K</option>
                  <option value="50">$50K – $250K</option>
                  <option value="250">$250K – $1M</option>
                  <option value="1000">$1M+</option>
                </select>

                <div className="field-label">Mission / what your business does <span style={{ color: "#555", fontWeight: 400 }}>(optional)</span></div>
                <textarea className="field-input" rows={2} placeholder="e.g. We provide IT consulting to nonprofits in the DC metro area..."
                  style={{ resize: "none", lineHeight: 1.5 }}
                  value={p.missionStatement}
                  onChange={e => upP({ missionStatement: e.target.value })} />
              </div>
            )}

            {/* Step 2: Owner profile */}
            {oStep === 2 && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <div className="field-label">Your name</div>
                    <input className="field-input" placeholder="Full name" value={p.ownerName} onChange={e => upP({ ownerName: e.target.value })} />
                  </div>
                  <div>
                    <div className="field-label">ZIP code</div>
                    <input className="field-input" placeholder="e.g. 20781" value={p.zipCode} onChange={e => upP({ zipCode: e.target.value })} />
                  </div>
                </div>
                <div className="field-label">Email address</div>
                <input className="field-input" placeholder="you@yourbusiness.com" type="email" value={p.email} onChange={e => upP({ email: e.target.value })} />
                <div className="field-label">Business phone</div>
                <input className="field-input" placeholder="(301) 555-0100" value={p.phone} onChange={e => upP({ phone: e.target.value })} />

                <div className="field-label" style={{ marginBottom: 10 }}>
                  Ownership characteristics <span style={{ color: "#555", fontWeight: 400 }}>(select all that apply — unlocks certifications)</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {CERT_OPTIONS.map(c => {
                    const sel = (p.certifications || []).includes(c.id);
                    return (
                      <div key={c.id} onClick={() => upP({ certifications: toggleArr(p.certifications || [], c.id) })}
                        style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                          background: sel ? "#1e1e30" : "#1a1a1e", border: `1px solid ${sel ? "#7f77dd66" : "#2a2a30"}`,
                          borderRadius: 8, cursor: "pointer", fontSize: 13, color: sel ? "#c8c4f0" : "#888",
                          transition: "all 0.15s"
                        }}>
                        <div style={{ width: 16, height: 16, border: `1.5px solid ${sel ? "#7f77dd" : "#444"}`, borderRadius: 4, background: sel ? "#7f77dd" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, color: "white" }}>
                          {sel ? "✓" : ""}
                        </div>
                        {c.label}
                      </div>
                    );
                  })}
                </div>
                {(p.certifications || []).length > 0 && (
                  <div style={{ marginTop: 12, padding: "10px 14px", background: "#1D9E7512", border: "1px solid #1D9E7530", borderRadius: 8, fontSize: 12, color: "#1D9E75" }}>
                    ✓ You may qualify for {(p.certifications || []).length} small business certification{(p.certifications || []).length > 1 ? "s" : ""} — we'll highlight them in your checklist.
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Funding goals */}
            {oStep === 3 && (
              <div>
                <div className="field-label" style={{ marginBottom: 10 }}>What types of funding are you pursuing? (select all)</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {GOAL_OPTIONS.map(g => {
                    const sel = (p.fundingGoals || []).includes(g.id);
                    return (
                      <div key={g.id} onClick={() => upP({ fundingGoals: toggleArr(p.fundingGoals || [], g.id) })}
                        style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
                          background: sel ? "#1e1e30" : "#1a1a1e", border: `1px solid ${sel ? "#7f77dd66" : "#2a2a30"}`,
                          borderRadius: 8, cursor: "pointer", fontSize: 13, color: sel ? "#c8c4f0" : "#888",
                          transition: "all 0.15s"
                        }}>
                        <div style={{ width: 16, height: 16, border: `1.5px solid ${sel ? "#7f77dd" : "#444"}`, borderRadius: 4, background: sel ? "#7f77dd" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, color: "white" }}>
                          {sel ? "✓" : ""}
                        </div>
                        {g.label}
                      </div>
                    );
                  })}
                </div>
                <div className="field-label">Target funding amount</div>
                <select className="field-input" value={p.fundingAmount} onChange={e => upP({ fundingAmount: e.target.value })}>
                  <option value="">Not sure yet</option>
                  <option value="under25">Under $25,000</option>
                  <option value="25to100">$25,000 – $100,000</option>
                  <option value="100to500">$100,000 – $500,000</option>
                  <option value="500to1m">$500,000 – $1M</option>
                  <option value="over1m">Over $1M</option>
                </select>
                <div className="field-label">ZIP / city for local programs</div>
                <input className="field-input" placeholder="e.g. 20781 or Hyattsville MD" value={p.zipCode} onChange={e => upP({ zipCode: e.target.value })} />
              </div>
            )}

            {/* Step 4: Summary */}
            {oStep === 4 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ background: "#1a1a20", borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Your business profile</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12 }}>
                    <div style={{ color: "#777" }}>Business</div><div style={{ color: "#d0cdc8" }}>{state.businessName || "—"}</div>
                    <div style={{ color: "#777" }}>Industry</div><div style={{ color: "#d0cdc8" }}>{p.industry || "—"}</div>
                    <div style={{ color: "#777" }}>State</div><div style={{ color: "#d0cdc8" }}>{p.state}</div>
                    <div style={{ color: "#777" }}>Revenue</div><div style={{ color: "#d0cdc8" }}>
                      {{"0":"Pre-revenue","1":"Under $50K","50":"$50K–$250K","250":"$250K–$1M","1000":"$1M+"}[p.annualRevenue] || "—"}
                    </div>
                    <div style={{ color: "#777" }}>Funding goals</div><div style={{ color: "#d0cdc8" }}>{(p.fundingGoals||[]).length > 0 ? (p.fundingGoals||[]).join(", ") : "—"}</div>
                  </div>
                </div>
                {(p.certifications||[]).length > 0 && (
                  <div style={{ background: "#1D9E7512", border: "1px solid #1D9E7530", borderRadius: 10, padding: "12px 16px" }}>
                    <div style={{ fontSize: 11, color: "#1D9E75", fontWeight: 600, marginBottom: 6 }}>CERTIFICATIONS YOU MAY QUALIFY FOR</div>
                    {(p.certifications||[]).map(c => {
                      const cert = {
                        woman: { name: "WOSB — Women-Owned Small Business", benefit: "5% of federal contract set-asides" },
                        minority: { name: "MBE — Minority Business Enterprise", benefit: "Corporate & gov supplier diversity" },
                        veteran: { name: "VOSB — Veteran-Owned Small Business", benefit: "VA contract set-asides" },
                        disabled_vet: { name: "SDVOSB — Service-Disabled Veteran", benefit: "3% of federal contract set-asides" },
                        hubzone: { name: "HUBZone Certification", benefit: "3% of federal contract set-asides" },
                        disadvantaged: { name: "SBA 8(a) Business Development", benefit: "9 years of exclusive contract access" },
                      }[c];
                      return cert ? (
                        <div key={c} style={{ fontSize: 12, color: "#c0bdb8", marginBottom: 4 }}>
                          <strong style={{ color: "#d0cdc8" }}>{cert.name}</strong> — {cert.benefit}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
                <div style={{ background: "#1e1e30", border: "1px solid #7f77dd22", borderRadius: 10, padding: "12px 16px", fontSize: 12, color: "#9b8ff0" }}>
                  ✦ Your AI assistant is now personalized with your business context and will give you specific advice based on your goals and profile.
                </div>
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              {oStep > 0 && (
                <button style={{ flex: 1, padding: "11px", background: "#1a1a1e", border: "1px solid #2a2a30", borderRadius: 10, color: "#888", fontSize: 14, cursor: "pointer" }}
                  onClick={() => update({ onboardStep: oStep - 1 })}>
                  ← Back
                </button>
              )}
              {oStep < ONBOARD_STEPS.length - 1 ? (
                <button className="start-btn" style={{ flex: 2 }} disabled={!canAdvance()}
                  onClick={() => update({ onboardStep: oStep + 1 })}>
                  Continue →
                </button>
              ) : (
                <button className="start-btn" style={{ flex: 2 }}
                  onClick={() => completeOnboarding(state.businessName)}>
                  Launch my dashboard →
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  const navItems = [
    { id: "dashboard", icon: "◼", label: "Dashboard", section: "Overview" },
    { id: "checklist", icon: "✓", label: "Checklist", section: "Setup", badge: urgent.length > 0 ? urgent.length : null },
    { id: "docs", icon: "◈", label: "Documents", section: "Setup" },
    { id: "presence", icon: "🌐", label: "Presence", section: "Setup" },
    { id: "funding", icon: "$", label: "Opportunities", section: "Funding" },
    { id: "calendar", icon: "◷", label: "Calendar", section: "Funding" },
    { id: "naics", icon: "⌖", label: "NAICS finder", section: "Funding" },
    { id: "livegrants", icon: "◎", label: "Live grants", section: "Funding" },
    { id: "ai", icon: "✦", label: "AI assistant", section: "Support" },
  ];

  let lastSection = "";

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="sidebar">
          <div className="brand">
            <div className="brand-name">BizLaunch</div>
            <div className="brand-sub">{state.businessName || "Business setup platform"}</div>
          </div>
          {navItems.map(n => {
            const showSection = n.section !== lastSection;
            lastSection = n.section;
            return (
              <div key={n.id}>
                {showSection && <div className="nav-section">{n.section}</div>}
                <div className={`nav-item${screen === n.id ? " active" : ""}`} onClick={() => setScreen(n.id)}>
                  <span className="nav-icon">{n.icon}</span>
                  {n.label}
                  {n.badge && <span className="badge-nav">{n.badge}</span>}
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: "auto", padding: "12px 18px", borderTop: "1px solid #1a1a1e" }}>
            <button className="reset-btn" onClick={() => auth.signOut()} style={{ width: "100%" }}>
              Sign out
            </button>
          </div>
        </div>

        <div className="main">
          <div className="page">

            {screen === "dashboard" && (
              <>
                <div className="page-title">Dashboard</div>
                <div className="page-sub">Setup score and activity for {state.businessName || "your business"}</div>
                <div className="stat-grid">
                  <div className="stat" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <ScoreRing pct={score} />
                    <div className="stat-lbl" style={{ textAlign: "center", marginTop: 6 }}>Setup score</div>
                  </div>
                  <div className="stat"><div className="stat-val">{done}</div><div className="stat-lbl">Steps completed</div></div>
                  <div className="stat"><div className="stat-val">{total - done}</div><div className="stat-lbl">Remaining</div></div>
                  <div className="stat"><div className="stat-val">{FUNDING.filter(f => getFundingReadiness(f).ready || getFundingReadiness(f).missing <= 2).length}</div><div className="stat-lbl">Funding matches</div></div>
                </div>
                <div className="two-col">
                  <div className="card">
                    <div className="card-title">Progress by category</div>
                    {SECTIONS.map(s => {
                      const sdone = s.items.filter(i => state.checklist[i.id]).length;
                      const pct = Math.round((sdone / s.items.length) * 100);
                      return (
                        <div key={s.id}>
                          <div className="progress-row"><span style={{ color: "#888" }}>{s.icon} {s.title}</span><span>{sdone}/{s.items.length}</span></div>
                          <div className="prog-bg"><div className="prog-fill" style={{ width: pct + "%" }} /></div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="card">
                    <div className="card-title">Action items</div>
                    {urgent.map(i => (
                      <div className="checklist-row" key={i.id}>
                        <div className="cb" onClick={() => toggleItem(i.id)}><span className="cb-check">✓</span></div>
                        <div>
                          <div className="item-label">{i.label}</div>
                        </div>
                      </div>
                    ))}
                    {urgent.length === 0 && <div style={{ fontSize: 13, color: "#555", padding: "10px 0" }}>All required items complete!</div>}
                  </div>
                </div>
                <div className="card">
                  <div className="card-title">Top funding matches</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }}>
                    {FUNDING.slice(0, 3).map(f => {
                      const { missing } = getFundingReadiness(f);
                      return (
                        <div key={f.id} style={{ background: "#0f0f11", border: "1px solid #1e1e22", borderRadius: 10, padding: 12 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#d0cdc8" }}>{f.title}</div>
                          <div style={{ fontSize: 10, color: "#555", marginTop: 3 }}>{f.type} · {f.deadline}</div>
                          <div style={{ fontSize: 12, color: "#1D9E75", fontWeight: 600, marginTop: 5 }}>{f.amount}</div>
                          {missing > 0
                            ? <div style={{ fontSize: 10, color: "#BA7517", marginTop: 5 }}>{missing} step{missing > 1 ? "s" : ""} needed</div>
                            : <div style={{ fontSize: 10, color: "#1D9E75", marginTop: 5 }}>Ready to apply</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {screen === "checklist" && (
              <>
                <div className="page-title">Setup checklist</div>
                <div className="page-sub">{done} of {total} steps complete · {score}% setup score</div>
                <div className="filter-row">
                  {["all", "incomplete", "required", "gov", "grants", "presence"].map(f => (
                    <button key={f} className={`filter-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
                      {f === "all" ? "All steps" : f === "incomplete" ? "Incomplete" : f === "required" ? "Required" : f === "gov" ? "Gov contracts" : f === "grants" ? "Grants" : "Presence"}
                    </button>
                  ))}
                </div>
                {SECTIONS.map(s => {
                  const visible = filteredItems(s.items);
                  if (visible.length === 0) return null;
                  const sdone = s.items.filter(i => state.checklist[i.id]).length;
                  const isOpen = openSections[s.id];
                  return (
                    <div key={s.id} style={{ marginBottom: 8 }}>
                      <div className={`section-header${isOpen ? " open" : ""}`} onClick={() => toggleSection(s.id)}>
                        <span className="section-icon">{s.icon}</span>
                        <span className="section-title">{s.title}</span>
                        <span className="section-count">{sdone}/{s.items.length}</span>
                        <span className={`chevron${isOpen ? " open" : ""}`}>▼</span>
                      </div>
                      {isOpen && (
                        <div className="section-body">
                          {visible.map(item => (
                            <div className="checklist-row" key={item.id}>
                              <div className={`cb${state.checklist[item.id] ? " checked" : ""}`} onClick={() => toggleItem(item.id)}>
                                <span className="cb-check">✓</span>
                              </div>
                              <div style={{ flex: 1 }}>
                                <div className={`item-label${state.checklist[item.id] ? " done" : ""}`}>
                                  {item.label}
                                  {item.tags.map(t => <Tag key={t} type={t} />)}
                                </div>
                                <div className="item-note">{item.note}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {screen === "presence" && (
              <>
                <div className="page-title">Professional presence</div>
                <div className="page-sub">How the world sees your business — reviewers, lenders, and contracting officers will look you up</div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10, marginBottom: 20 }}>
                  {[
                    { id: "domain", label: "Domain", icon: "🌐" },
                    { id: "bizemail", label: "Email", icon: "✉️" },
                    { id: "bizphone", label: "Phone", icon: "📞" },
                    { id: "website", label: "Website", icon: "💻" },
                    { id: "linkedin", label: "LinkedIn", icon: "🔗" },
                    { id: "googlebiz", label: "Google Biz", icon: "📍" },
                    { id: "logo", label: "Logo", icon: "🎨" },
                    { id: "capstatement", label: "Cap. statement", icon: "📋" },
                  ].map(item => {
                    const done = state.checklist[item.id];
                    return (
                      <div key={item.id}
                        onClick={() => toggleItem(item.id)}
                        style={{
                          background: done ? "var(--color-background-success)" : "var(--color-background-secondary)",
                          border: `0.5px solid ${done ? "var(--color-border-success)" : "var(--color-border-tertiary)"}`,
                          borderRadius: "var(--border-radius-md)",
                          padding: "12px 10px",
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.15s",
                        }}>
                        <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                        <div style={{ fontSize: 11, fontWeight: 500, color: done ? "var(--color-text-success)" : "var(--color-text-secondary)" }}>{item.label}</div>
                        <div style={{ fontSize: 10, marginTop: 3, color: done ? "var(--color-text-success)" : "var(--color-text-tertiary)" }}>{done ? "✓ done" : "tap to mark"}</div>
                      </div>
                    );
                  })}
                </div>

                {[
                  {
                    category: "Digital identity", color: "#E6F1FB", tcolor: "#0C447C",
                    items: ["domain","bizemail","bizphone","website","googlebiz"]
                  },
                  {
                    category: "Brand & marketing materials", color: "#EEEDFE", tcolor: "#3C3489",
                    items: ["logo","emailsig","socialmedia","presskit","pitchdeck"]
                  },
                  {
                    category: "Government contracting presence", color: "#FAEEDA", tcolor: "#633806",
                    items: ["capstatement","linkedin"]
                  },
                ].map(group => {
                  const groupItems = SECTIONS.find(s => s.id === "presence")?.items.filter(i => group.items.includes(i.id)) || [];
                  const groupDone = groupItems.filter(i => state.checklist[i.id]).length;
                  return (
                    <div className="card" key={group.category}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: tcolor, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-secondary)" }}>{group.category}</div>
                        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{groupDone}/{groupItems.length}</div>
                      </div>
                      {groupItems.map(item => (
                        <div className="checklist-row" key={item.id}>
                          <div className={`cb${state.checklist[item.id] ? " checked" : ""}`} onClick={() => toggleItem(item.id)}>
                            <span className="cb-check">✓</span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div className={`item-label${state.checklist[item.id] ? " done" : ""}`}>
                              {item.label}
                              {item.tags.map(t => <Tag key={t} type={t} />)}
                            </div>
                            <div className="item-note">{item.note}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}

                <div className="card" style={{ borderLeft: "3px solid #7f77dd", borderRadius: "0 var(--border-radius-lg) var(--border-radius-lg) 0" }}>
                  <div className="card-title">Why this matters for funding</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
                    {[
                      { label: "Grant reviewers", note: "Will Google your business before scoring your application. A professional website and LinkedIn page can be the difference between funded and declined." },
                      { label: "SBA lenders", note: "Verify your business is real and operational. A domain email, website, and phone number signal you're serious and reduce perceived risk." },
                      { label: "Gov contracting officers", note: "Your capability statement is your resume. It must be polished, one page, and include NAICS codes, core competencies, and past performance." },
                    ].map(c => (
                      <div key={c.label} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 6 }}>{c.label}</div>
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{c.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {screen === "docs" && (
              <>
                <div className="page-title">Document vault</div>
                <div className="page-sub">Store and organize documents needed for funding applications</div>
                <div className="doc-grid">
                  {[
                    { name: "Articles of Organization", icon: "📄", status: state.checklist.articles ? "verified" : "missing" },
                    { name: "EIN confirmation letter", icon: "📄", status: state.checklist.ein ? "verified" : "missing" },
                    { name: "Operating Agreement", icon: "📄", status: state.checklist.opagree ? "verified" : "missing" },
                    { name: "BOI report (FinCEN)", icon: "📄", status: state.checklist.boi ? "verified" : "missing" },
                    { name: "Business plan", icon: "📋", status: state.checklist.bizplan ? "verified" : "needed" },
                    { name: "Opening balance sheet", icon: "📊", status: state.checklist.balsheet ? "verified" : "needed" },
                    { name: "Cash flow projection", icon: "📈", status: state.checklist.budget ? "verified" : "needed" },
                    { name: "Personal tax returns (2yr)", icon: "📄", status: state.checklist.taxreturns ? "verified" : "needed" },
                    { name: "Executive summary", icon: "📝", status: state.checklist.execsummary ? "verified" : "needed" },
                    { name: "Capability statement", icon: "📋", status: state.checklist.capstatement ? "verified" : "needed" },
                    { name: "Pitch deck", icon: "📊", status: state.checklist.pitchdeck ? "verified" : "needed" },
                    { name: "Press / media kit", icon: "🗂️", status: state.checklist.presskit ? "verified" : "needed" },
                  ].map(d => (
                    <div key={d.name} className={`doc-card${d.status !== "verified" ? " missing" : ""}`}>
                      <div style={{ fontSize: 22 }}>{d.icon}</div>
                      <div className="doc-name">{d.name}</div>
                      <div className="doc-status" style={
                        d.status === "verified" ? { background: "#1D9E7520", color: "#1D9E75" } :
                        d.status === "missing" ? { background: "#E24B4A18", color: "#E24B4A" } :
                        { background: "#BA751720", color: "#BA7517" }
                      }>
                        {d.status === "verified" ? "✓ uploaded" : d.status === "missing" ? "✗ missing" : "⚠ needed"}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <div className="card-title">What to do next</div>
                  <div style={{ fontSize: 13, color: "#888", lineHeight: 1.7 }}>
                    Upload documents by completing the corresponding checklist steps. As you check off items, your document vault will automatically update to show what's in place.
                    For uploading actual files, integrate cloud storage (Google Drive, Dropbox, or AWS S3) in the production version.
                    <div style={{ marginTop: 10 }}>
                      <button className="chip" onClick={() => setScreen("checklist")}>Go to checklist →</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {screen === "funding" && (
              <>
                <div className="page-title">Funding opportunities</div>
                <div className="page-sub">Matched to your setup progress — complete more steps to unlock higher matches</div>
                <div className="filter-row">
                  {["all", "grants", "loans", "gov"].map(f => (
                    <button key={f} className={`filter-btn${fundFilter === f ? " active" : ""}`} onClick={() => setFundFilter(f)}>
                      {f === "all" ? "All types" : f === "grants" ? "Grants" : f === "loans" ? "Loans" : "Gov contracts"}
                    </button>
                  ))}
                </div>
                {filteredFunding.sort((a, b) => b.match - a.match).map(f => {
                  const { ready, missing } = getFundingReadiness(f);
                  return (
                    <div className="fund-card" key={f.id}>
                      <div className="fund-icon" style={{ background: f.color }}>{f.type === "Grant" ? "🏛️" : f.type === "Loan" ? "🏦" : "📋"}</div>
                      <div style={{ flex: 1 }}>
                        <div className="fund-title">
                          {f.title}
                          <span className="fund-match" style={{
                            background: f.match >= 80 ? "#1D9E7520" : f.match >= 60 ? "#BA751720" : "#33333a",
                            color: f.match >= 80 ? "#1D9E75" : f.match >= 60 ? "#BA7517" : "#777"
                          }}>{f.match}% match</span>
                          {ready ? <span className="ready-tag">Ready to apply</span> : <span className="missing-tag">{missing} step{missing > 1 ? "s" : ""} needed</span>}
                        </div>
                        <div className="fund-meta">{f.agency} · {f.deadline}</div>
                        <div className="fund-amt">{f.amount}{f.repay ? " · repayable" : " · non-repayable"}</div>
                      </div>
                      <button className="fund-btn" onClick={() => sendAI(`Tell me more about the ${f.title} and what I need to do to apply`) || setScreen("ai")}>
                        Details ↗
                      </button>
                    </div>
                  );
                })}
              </>
            )}

            {screen === "calendar" && (
              <>
                <div className="page-title">Deadline calendar</div>
                <div className="page-sub">Filing renewals, grant deadlines, and compliance dates</div>
                <div className="two-col">
                  <div className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#c0bdb8" }}>March 2026</span>
                    </div>
                    <div className="cal-wrap">
                      {["S","M","T","W","T","F","S"].map((d,i) => <div key={i} className="cal-hdr">{d}</div>)}
                      {Array(6).fill(null).map((_, i) => <div key={"e"+i} className="cal-day" style={{ opacity: 0 }}></div>)}
                      {Array(31).fill(null).map((_, i) => {
                        const day = i + 1;
                        const isToday = day === 15;
                        const hasEvent = [18, 22, 28, 31].includes(day);
                        return <div key={day} className={`cal-day${isToday ? " today" : hasEvent ? " has" : ""}`}>{day}</div>;
                      })}
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-title">Upcoming deadlines</div>
                    {EVENTS.map((e, i) => (
                      <div className="event-row" key={i}>
                        <div className="event-dot" style={{ background: e.urgent ? "#E24B4A" : i < 3 ? "#BA7517" : i < 5 ? "#7f77dd" : "#1D9E75" }} />
                        <div className="event-date">{e.date}</div>
                        <div className="event-label">{e.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}


            {screen === "naics" && (
              <NAICSFinder state={state} update={update} addNaics={addNaics} removeNaics={removeNaics} />
            )}

            {screen === "livegrants" && (
              <LiveGrants state={state} update={update} saveGrants={saveGrants} profile={state.profile} checklist={state.checklist} />
            )}

            {screen === "ai" && (
              <>
                <div className="page-title">AI assistant</div>
                <div className="page-sub">Ask anything about setup, funding, compliance, or your next steps</div>
                <div className="chips">
                  {suggestedPrompts.map(p => (
                    <button key={p} className="chip" onClick={() => sendAI(p)}>{p}</button>
                  ))}
                </div>
                <div className="chat-outer">
                  <div className="chat-messages" ref={chatRef}>
                    {state.chatHistory.length === 0 && (
                      <div className="msg ai">
                        Hi! I'm your BizLaunch assistant. I know your setup progress and can give you specific, actionable advice about grants, loans, government contracts, and compliance. What do you need help with?
                      </div>
                    )}
                    {state.chatHistory.map((m, i) => (
                      <div key={i} className={`msg ${m.role === "user" ? "user" : "ai"}`}>{m.content}</div>
                    ))}
                    {aiLoading && (
                      <div className="typing">
                        <div className="dot" /><div className="dot" /><div className="dot" />
                      </div>
                    )}
                  </div>
                  <div className="chat-input-area">
                    <input className="chat-input" placeholder="Ask about grants, compliance, next steps..."
                      value={aiInput}
                      onChange={e => setAiInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && sendAI(aiInput)}
                    />
                    <button className="chat-send" onClick={() => sendAI(aiInput)} disabled={aiLoading || !aiInput.trim()}>
                      Send →
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
