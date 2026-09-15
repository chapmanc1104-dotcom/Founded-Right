/**
 * Canonical id -> label map for the setup checklist.
 *
 * The full catalog (notes, tags, icons, ordering) lives in the web app because
 * it drives the UI. The server only needs labels so it can describe a user's
 * progress to the AI assistant without trusting the client to send it. Ids here
 * must stay in sync with `SECTIONS` in artifacts/bizlaunch/src/App.tsx; unknown
 * ids are simply skipped.
 */
export const CHECKLIST_LABELS: Record<string, string> = {
  // Legal foundation
  articles: "Articles of Organization filed & accepted",
  ein: "Obtain EIN from the IRS",
  opagree: "Draft and sign an Operating Agreement",
  boi: "Check BOI reporting status (FinCEN)",
  licenses: "Obtain required business licenses & permits",
  regagent: "Update registered agent address",
  // Banking & financials
  checking: "Open a dedicated business checking account",
  savings: "Open a business savings account",
  accounting: "Set up accounting software",
  bizcard: "Establish a business credit card",
  coa: "Create a chart of accounts",
  balsheet: "Prepare an opening balance sheet",
  // Business credit profile
  dnb: "Register with Dun & Bradstreet (D-U-N-S number)",
  experian: "Register with Experian Business & Equifax Business",
  net30: "Apply for a Net-30 vendor account",
  paydex: "Monitor your Paydex score monthly",
  // Federal & state registrations
  sam: "Register in SAM.gov",
  uei: "Obtain a UEI (Unique Entity Identifier)",
  naics: "Identify and apply for NAICS codes",
  sbasize: "Determine your SBA business size standard",
  stateprocure: "Register in your state procurement portal",
  grantsgov: "Register in Grants.gov",
  // Small business certifications
  sba8a: "Apply for SBA 8(a) Business Development (if eligible)",
  wosb: "Women-Owned Small Business (WOSB) certification",
  vosb: "Veteran-Owned / SDVOSB certification (if eligible)",
  hubzone: "HUBZone certification (if in qualifying area)",
  mbe: "Minority Business Enterprise (MBE) certification",
  // Grant readiness
  execsummary: "Write a one-page executive summary",
  impact: "Define your business impact metrics",
  budget: "Prepare a 12-month budget & cash flow projection",
  grantlist: "Identify 5-10 target grant programs",
  grantcal: "Create a grants deadline calendar",
  sbir: "Research SBIR/STTR programs (if R&D focus)",
  // Professional presence
  domain: "Register a business domain name (.com)",
  bizemail: "Set up a professional business email address",
  bizphone: "Obtain a dedicated business phone number",
  website: "Launch a professional business website",
  capstatement: "Create a capability statement (1 page)",
  linkedin: "Set up a LinkedIn company page",
  googlebiz: "Create a Google Business Profile",
  logo: "Design a professional logo and brand identity",
  emailsig: "Set up a professional email signature",
  socialmedia: "Establish social media profiles on key platforms",
  presskit: "Prepare a media/press kit",
  pitchdeck: "Build a pitch deck (10-12 slides)",
  // Loan & financing readiness
  bizplan: "Prepare a full business plan (10-20 pages)",
  taxreturns: "Compile 2 years of personal tax returns",
  personalcredit: "Pull & address personal credit report issues",
  sba7a: "Research SBA 7(a) loan program",
  microloan: "Research SBA Microloan program ($50K and under)",
  cdfi: "Identify local CDFI lenders in your state",
};

export const CHECKLIST_TOTAL = Object.keys(CHECKLIST_LABELS).length;
