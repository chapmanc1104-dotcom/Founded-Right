import { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase";
import type { Session } from "@supabase/supabase-js";

const API = import.meta.env.BASE_URL + "api";

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
      { id: "bizemail", label: "Set up a professional business email address", note: "yourname@yourbusiness.com via Google Workspace or Microsoft 365 ($6/mo).", tags: ["required"] },
      { id: "bizphone", label: "Obtain a dedicated business phone number", note: "OpenPhone ($15/mo), Grasshopper, or Google Voice.", tags: ["required"] },
      { id: "website", label: "Launch a professional business website", note: "Minimum: homepage, about, services, and contact page.", tags: ["required"] },
      { id: "capstatement", label: "Create a capability statement (1 page)", note: "The business card of government contracting.", tags: ["gov"] },
      { id: "linkedin", label: "Set up a LinkedIn company page", note: "Grant reviewers and contracting officers verify legitimacy here.", tags: [] },
      { id: "googlebiz", label: "Create a Google Business Profile", note: "Establishes your business in search and maps.", tags: [] },
      { id: "logo", label: "Design a professional logo and brand identity", note: "Used on website, email signature, capability statement.", tags: [] },
      { id: "emailsig", label: "Set up a professional email signature", note: "Include name, title, business name, phone, website, and address.", tags: [] },
      { id: "socialmedia", label: "Establish social media profiles on key platforms", note: "At minimum: LinkedIn. Consistent handle across all platforms.", tags: [] },
      { id: "presskit", label: "Prepare a media/press kit", note: "Bio, logo files, photos, key facts, and contact info.", tags: [] },
      { id: "pitchdeck", label: "Build a pitch deck (10–12 slides)", note: "Needed for investors and some competitive grant programs.", tags: [] },
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
      { id: "cdfi", label: "Identify local CDFI lenders in your state", note: "CDFIs often lend to businesses that don't yet qualify for banks.", tags: [] },
    ]
  },
];

const STATIC_FUNDING = [
  { id: "mbda", title: "MBDA Business Center Grant", type: "Grant", agency: "Minority Business Development Agency", deadline: "Apr 15, 2026", amount: "Up to $50,000", match: 91, needs: ["sam", "execsummary", "budget"], applyUrl: "https://www.mbda.gov" },
  { id: "sba-ca", title: "SBA Community Advantage Loan", type: "Loan", agency: "SBA · Rolling deadline", deadline: "Rolling", amount: "$50,000–$350,000", match: 85, needs: ["bizplan", "taxreturns", "balsheet"], applyUrl: "https://www.sba.gov" },
  { id: "tedco", title: "MD TEDCO Rural Business Fund", type: "Grant", agency: "Maryland Technology Development", deadline: "May 1, 2026", amount: "Up to $100,000", match: 78, needs: ["sam", "execsummary", "budget", "bizplan"], applyUrl: "https://www.tedcomd.com" },
  { id: "sbir", title: "SBIR Phase I Grant", type: "Grant", agency: "NSF / DOD · R&D focus required", deadline: "Rolling", amount: "Up to $275,000", match: 62, needs: ["sam", "uei", "execsummary", "budget"], applyUrl: "https://www.sbir.gov" },
  { id: "sba7a", title: "SBA 7(a) Business Loan", type: "Loan", agency: "SBA · Bank partners", deadline: "Rolling", amount: "Up to $5,000,000", match: 74, needs: ["ein", "bizplan", "taxreturns", "balsheet", "personalcredit"], applyUrl: "https://www.sba.gov" },
  { id: "microloan", title: "SBA Microloan", type: "Loan", agency: "SBA · Nonprofit intermediaries", deadline: "Rolling", amount: "Up to $50,000", match: 88, needs: ["ein", "bizplan"], applyUrl: "https://www.sba.gov" },
  { id: "marylandsmall", title: "Maryland Small Business Relief Grant", type: "Grant", agency: "Maryland DHCD · State program", deadline: "Jun 30, 2026", amount: "Up to $25,000", match: 80, needs: ["ein", "execsummary", "budget"], applyUrl: "https://dhcd.maryland.gov" },
  { id: "govcon", title: "Federal Small Business Set-Aside Contracts", type: "Gov Contract", agency: "Federal · Various agencies", deadline: "Ongoing", amount: "Varies", match: 55, needs: ["sam", "uei", "naics", "sbasize"], applyUrl: "https://sam.gov" },
];

const EVENTS = [
  { date: "Mar 31, 2026", label: "Q1 estimated tax payment", urgent: true },
  { date: "Apr 15, 2026", label: "MBDA Grant deadline", urgent: false },
  { date: "Apr 15, 2026", label: "Personal tax return due", urgent: true },
  { date: "May 1, 2026", label: "TEDCO Fund closes", urgent: false },
  { date: "Jun 30, 2026", label: "MD Small Business Relief Grant", urgent: false },
  { date: "Annual", label: "SAM.gov renewal", urgent: false },
  { date: "Annual", label: "Maryland Annual Report filing", urgent: false },
];

const ONBOARD_STEPS = [
  { title: "Welcome", sub: "Let's get your business set up for funding" },
  { title: "Your business", sub: "Basic information about your company" },
  { title: "Owner profile", sub: "Tell us about yourself — unlocks certifications" },
  { title: "Funding goals", sub: "What types of funding are you pursuing?" },
  { title: "You're ready", sub: "Your personalized plan is ready" },
];

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

type NaicsCode = { code: string; title: string; relevance: string };

type Profile = {
  businessName: string;
  onboarded: boolean;
  entityType: string;
  state: string;
  industry: string;
  ownerName: string;
  contactEmail: string;
  contactPhone: string;
  zipCode: string;
  yearsInBusiness: string;
  employees: string;
  annualRevenue: string;
  fundingGoals: string[];
  missionStatement: string;
  certifications: string[];
  fundingAmount: string;
  naicsCodes: NaicsCode[];
};

type ChatMessage = { role: "user" | "assistant"; content: string };

const defaultProfile: Profile = {
  businessName: "",
  onboarded: false,
  entityType: "LLC",
  state: "MD",
  industry: "",
  ownerName: "",
  contactEmail: "",
  contactPhone: "",
  zipCode: "",
  yearsInBusiness: "0",
  employees: "1",
  annualRevenue: "0",
  fundingGoals: [],
  missionStatement: "",
  certifications: [],
  fundingAmount: "",
  naicsCodes: [],
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@500;600;700&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; }
body { font-family: 'DM Sans', sans-serif; background: #0f0f11; color: #f0ede8; }
::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
button { font-family: inherit; cursor: pointer; border: none; outline: none; }
input, textarea, select { font-family: inherit; outline: none; border: none; background: none; color: inherit; }
.app { display: flex; height: 100vh; overflow: hidden; }
.sidebar { width: 220px; flex-shrink: 0; background: #0a0a0c; border-right: 1px solid #1e1e22; display: flex; flex-direction: column; }
.brand { padding: 20px 18px 16px; border-bottom: 1px solid #1e1e22; }
.brand-name { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #f0ede8; letter-spacing: -0.3px; }
.brand-sub { font-size: 11px; color: #555; margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
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
.section-header.open { border-radius: 12px 12px 0 0; }
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
.fund-card { background: #141416; border: 1px solid #1e1e22; border-radius: 12px; padding: 16px 20px; margin-bottom: 10px; }
.fund-card:hover { border-color: #2e2e38; }
.fund-title { font-size: 14px; font-weight: 500; color: #e0ddd8; }
.fund-meta { font-size: 11px; color: #555; margin-top: 3px; }
.fund-amt { font-size: 12px; font-weight: 600; color: #1D9E75; margin-top: 5px; }
.fund-btn { font-size: 12px; padding: 7px 16px; border-radius: 8px; background: #1e1e30; color: #9b8ff0; border: 1px solid #7f77dd44; white-space: nowrap; transition: all 0.15s; }
.fund-btn:hover { background: #26263a; }
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
.chat-input:focus { border-color: #7f77dd66; outline: none; }
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
.doc-status { display: inline-block; font-size: 10px; padding: 2px 7px; border-radius: 99px; margin-top: 6px; }
.onboard { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0c; padding: 20px; }
.onboard-card { background: #141416; border: 1px solid #1e1e22; border-radius: 16px; padding: 40px; max-width: 520px; width: 100%; }
.onboard-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #f0ede8; margin-bottom: 4px; }
.onboard-sub { font-size: 14px; color: #666; margin-bottom: 28px; line-height: 1.6; }
.field-label { font-size: 12px; color: #777; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
.field-input { width: 100%; background: #0f0f11; border: 1px solid #2a2a30; border-radius: 8px; padding: 10px 14px; font-size: 14px; color: #f0ede8; margin-bottom: 16px; }
.field-input:focus { border-color: #7f77dd66; outline: none; }
.start-btn { width: 100%; background: #7f77dd; color: white; font-size: 15px; font-weight: 600; padding: 13px; border-radius: 10px; font-family: 'Syne', sans-serif; letter-spacing: -0.2px; transition: background 0.15s; }
.start-btn:hover { background: #9b93e8; }
.start-btn:disabled { background: #333; color: #666; cursor: not-allowed; }
.reset-btn { font-size: 11px; color: #444; background: none; padding: 8px 12px; border-radius: 6px; border: 1px solid #222; }
.reset-btn:hover { color: #777; border-color: #333; }
.landing { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0a0a0c; padding: 40px 20px; }
@media print {
  body * { visibility: hidden !important; }
  #cap-statement-print, #cap-statement-print * { visibility: visible !important; }
  #cap-statement-print {
    position: fixed !important;
    top: 0 !important; left: 0 !important;
    width: 100vw !important;
    margin: 0 !important;
    padding: 40px 48px !important;
    background: #fff !important;
    color: #111 !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
    z-index: 99999 !important;
  }
  #cap-statement-print div, #cap-statement-print li, #cap-statement-print ul, #cap-statement-print span { color: #111 !important; background: transparent !important; }
  #cap-statement-print [style*="color: #7f77dd"], #cap-statement-print [style*="color:#7f77dd"] { color: #4b46b0 !important; }
  #cap-statement-print [style*="borderBottom"] { border-bottom: 1px solid #ccc !important; }
}
`;

const Tag = ({ type }: { type: string }) => {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    required: { bg: "#E24B4A18", color: "#E24B4A", label: "required" },
    gov: { bg: "#BA751720", color: "#BA7517", label: "gov contracts" },
  };
  const s = map[type];
  if (!s) return null;
  return <span style={{ background: s.bg, color: s.color, fontSize: 10, padding: "2px 8px", borderRadius: 99, fontWeight: 600, marginLeft: 6, display: "inline-block" }}>{s.label}</span>;
};

const ScoreRing = ({ pct }: { pct: number }) => {
  const r = 36, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 70 ? "#1D9E75" : pct >= 40 ? "#BA7517" : "#E24B4A";
  return (
    <svg width={88} height={88} viewBox="0 0 88 88">
      <circle cx={44} cy={44} r={r} fill="none" stroke="#1e1e22" strokeWidth={8} />
      <circle cx={44} cy={44} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 44 44)" style={{ transition: "stroke-dasharray 0.6s ease" }} />
      <text x={44} y={44} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: 16, fontWeight: 700, fill: color, fontFamily: "Syne, sans-serif" }}>{pct}%</text>
    </svg>
  );
};

function getTotal() { let t = 0; SECTIONS.forEach(s => t += s.items.length); return t; }
function getScore(cl: Record<string, boolean>) {
  const total = getTotal(); let done = 0;
  SECTIONS.forEach(s => s.items.forEach(i => { if (cl[i.id]) done++; }));
  return total ? Math.round((done / total) * 100) : 0;
}
function getDone(cl: Record<string, boolean>) {
  let done = 0; SECTIONS.forEach(s => s.items.forEach(i => { if (cl[i.id]) done++; })); return done;
}
function getFundingReadiness(f: typeof STATIC_FUNDING[0], cl: Record<string, boolean>) {
  const missing = f.needs.filter(n => !cl[n]).length;
  return { ready: missing === 0, missing };
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authScreen, setAuthScreen] = useState<"signin" | "signup" | "forgot" | "reset">("signin");
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setAuthLoading(false);
      if (event === "PASSWORD_RECOVERY") setIsPasswordRecovery(true);
      if (event === "SIGNED_OUT") setIsPasswordRecovery(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
    setAuthScreen("signin");
  }

  if (authLoading) {
    return (
      <>
        <style>{css}</style>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0a0c" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, color: "#7f77dd", marginBottom: 12 }}>Founded Right</div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
              <div className="dot" /><div className="dot" style={{ animationDelay: "0.15s" }} /><div className="dot" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!session) {
    if (isPasswordRecovery) {
      return <ResetPasswordScreen onDone={() => { setIsPasswordRecovery(false); setAuthScreen("signin"); }} />;
    }
    return <AuthScreens mode={authScreen} setMode={setAuthScreen} />;
  }

  return <Dashboard session={session} onLogout={handleLogout} />;
}

function AuthScreens({ mode, setMode }: { mode: "signin" | "signup" | "forgot"; setMode: (m: "signin" | "signup" | "forgot") => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputStyle: React.CSSProperties = { width: "100%", background: "#1a1a1e", border: "1px solid #2a2a2e", borderRadius: 10, padding: "11px 14px", color: "#e0ddd8", fontSize: 14, boxSizing: "border-box", outline: "none" };
  const labelStyle: React.CSSProperties = { fontSize: 12, color: "#666", fontWeight: 500, display: "block", marginBottom: 5 };

  async function handleGoogleSignIn() {
    setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) { setError(error.message); setLoading(false); }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
    if (error) setError(error.message);
    else setSuccess("Check your email to confirm your account, then sign in.");
    setLoading(false);
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if (error) setError(error.message);
    else setSuccess("Password reset link sent — check your email.");
    setLoading(false);
  }

  const brand = (
    <div style={{ textAlign: "center", marginBottom: 28 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#7f77dd" }} />
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: "#e0ddd8" }}>Founded Right</span>
      </div>
    </div>
  );

  const googleBtn = (
    <button type="button" onClick={handleGoogleSignIn} disabled={loading} style={{ width: "100%", background: "#1a1a1e", border: "1px solid #2a2a2e", borderRadius: 10, padding: "11px 14px", color: "#c0bdb8", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
      <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
      Continue with Google
    </button>
  );

  const divider = (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
      <div style={{ flex: 1, height: 1, background: "#2a2a2e" }} />
      <span style={{ fontSize: 12, color: "#444" }}>or</span>
      <div style={{ flex: 1, height: 1, background: "#2a2a2e" }} />
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: "#0a0a0c", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          {brand}
          <div style={{ background: "#0f0f11", border: "1px solid #1e1e22", borderRadius: 16, padding: "32px 28px" }}>

            {mode === "signin" && (
              <form onSubmit={handleSignIn}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#e0ddd8", fontFamily: "'Syne',sans-serif", marginBottom: 6 }}>Welcome back</div>
                <div style={{ fontSize: 13, color: "#555", marginBottom: 24 }}>Sign in to your account</div>
                {error && <div style={{ background: "#E24B4A18", border: "1px solid #E24B4A44", borderRadius: 8, padding: "10px 14px", color: "#E24B4A", fontSize: 13, marginBottom: 16 }}>{error}</div>}
                {googleBtn}
                {divider}
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus style={inputStyle} placeholder="you@company.com" />
                </div>
                <div style={{ marginBottom: 6 }}>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required style={{ ...inputStyle, paddingRight: 42 }} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 13 }}>{showPw ? "Hide" : "Show"}</button>
                  </div>
                </div>
                <div style={{ textAlign: "right", marginBottom: 20 }}>
                  <button type="button" onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: "#7f77dd", fontSize: 12, cursor: "pointer" }}>Forgot password?</button>
                </div>
                <button type="submit" disabled={loading} style={{ width: "100%", background: "#7f77dd", border: "none", color: "#fff", borderRadius: 10, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif", opacity: loading ? 0.7 : 1 }}>{loading ? "Signing in…" : "Sign in"}</button>
                <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#555" }}>Don't have an account? <button type="button" onClick={() => { setMode("signup"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: "#7f77dd", cursor: "pointer", fontSize: 13 }}>Create account</button></div>
              </form>
            )}

            {mode === "signup" && (
              <form onSubmit={handleSignUp}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#e0ddd8", fontFamily: "'Syne',sans-serif", marginBottom: 6 }}>Create your account</div>
                <div style={{ fontSize: 13, color: "#555", marginBottom: 24 }}>Get started with Founded Right</div>
                {error && <div style={{ background: "#E24B4A18", border: "1px solid #E24B4A44", borderRadius: 8, padding: "10px 14px", color: "#E24B4A", fontSize: 13, marginBottom: 16 }}>{error}</div>}
                {success && <div style={{ background: "#1D9E7518", border: "1px solid #1D9E7544", borderRadius: 8, padding: "10px 14px", color: "#1D9E75", fontSize: 13, marginBottom: 16 }}>{success}</div>}
                {!success && <>{googleBtn}{divider}</>}
                {!success && <>
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus style={inputStyle} placeholder="you@company.com" />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Password</label>
                    <div style={{ position: "relative" }}>
                      <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required style={{ ...inputStyle, paddingRight: 42 }} placeholder="At least 8 characters" />
                      <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 13 }}>{showPw ? "Hide" : "Show"}</button>
                    </div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Confirm password</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={inputStyle} placeholder="••••••••" />
                  </div>
                  <button type="submit" disabled={loading} style={{ width: "100%", background: "#7f77dd", border: "none", color: "#fff", borderRadius: 10, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif", opacity: loading ? 0.7 : 1 }}>{loading ? "Creating account…" : "Create account"}</button>
                </>}
                <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#555" }}>Already have an account? <button type="button" onClick={() => { setMode("signin"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: "#7f77dd", cursor: "pointer", fontSize: 13 }}>Sign in</button></div>
              </form>
            )}

            {mode === "forgot" && (
              <form onSubmit={handleForgotPassword}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#e0ddd8", fontFamily: "'Syne',sans-serif", marginBottom: 6 }}>Reset your password</div>
                <div style={{ fontSize: 13, color: "#555", marginBottom: 24 }}>We'll send a reset link to your email</div>
                {error && <div style={{ background: "#E24B4A18", border: "1px solid #E24B4A44", borderRadius: 8, padding: "10px 14px", color: "#E24B4A", fontSize: 13, marginBottom: 16 }}>{error}</div>}
                {success && <div style={{ background: "#1D9E7518", border: "1px solid #1D9E7544", borderRadius: 8, padding: "10px 14px", color: "#1D9E75", fontSize: 13, marginBottom: 16 }}>{success}</div>}
                {!success && <>
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus style={inputStyle} placeholder="you@company.com" />
                  </div>
                  <button type="submit" disabled={loading} style={{ width: "100%", background: "#7f77dd", border: "none", color: "#fff", borderRadius: 10, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif", opacity: loading ? 0.7 : 1 }}>{loading ? "Sending…" : "Send reset link"}</button>
                </>}
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <button type="button" onClick={() => { setMode("signin"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: "#7f77dd", fontSize: 13, cursor: "pointer" }}>← Back to sign in</button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

function ResetPasswordScreen({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputStyle: React.CSSProperties = { width: "100%", background: "#1a1a1e", border: "1px solid #2a2a2e", borderRadius: 10, padding: "11px 14px", color: "#e0ddd8", fontSize: 14, boxSizing: "border-box", outline: "none" };
  const labelStyle: React.CSSProperties = { fontSize: 12, color: "#666", fontWeight: 500, display: "block", marginBottom: 5 };

  async function handleReset(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); }
    else { setSuccess(true); setTimeout(onDone, 2000); }
  }

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: "#0a0a0c", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#7f77dd" }} />
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: "#e0ddd8" }}>Founded Right</span>
            </div>
          </div>
          <div style={{ background: "#0f0f11", border: "1px solid #1e1e22", borderRadius: 16, padding: "32px 28px" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#e0ddd8", fontFamily: "'Syne',sans-serif", marginBottom: 6 }}>Set new password</div>
            <div style={{ fontSize: 13, color: "#555", marginBottom: 24 }}>Choose a strong password for your account</div>
            {success ? (
              <div style={{ background: "#1D9E7518", border: "1px solid #1D9E7544", borderRadius: 8, padding: "14px", color: "#1D9E75", fontSize: 13, textAlign: "center" }}>Password updated! Signing you in…</div>
            ) : (
              <form onSubmit={handleReset}>
                {error && <div style={{ background: "#E24B4A18", border: "1px solid #E24B4A44", borderRadius: 8, padding: "10px 14px", color: "#E24B4A", fontSize: 13, marginBottom: 16 }}>{error}</div>}
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>New password</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required autoFocus style={{ ...inputStyle, paddingRight: 42 }} placeholder="At least 8 characters" />
                    <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 13 }}>{showPw ? "Hide" : "Show"}</button>
                  </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Confirm password</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={inputStyle} placeholder="••••••••" />
                </div>
                <button type="submit" disabled={loading} style={{ width: "100%", background: "#7f77dd", border: "none", color: "#fff", borderRadius: 10, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',sans-serif", opacity: loading ? 0.7 : 1 }}>{loading ? "Updating…" : "Update password"}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Dashboard({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const [screen, setScreen] = useState("dashboard");
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [onboardStep, setOnboardStep] = useState(0);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState("all");
  const [fundFilter, setFundFilter] = useState("all");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! I'm your Founded Right AI assistant. I can help with your checklist, funding opportunities, certifications, and more. What would you like to know?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [naicsQuery, setNaicsQuery] = useState("");
  const [naicsResults, setNaicsResults] = useState<{ code: string; title: string; description: string; relevance: string; govContractTip: string }[]>([]);
  const [naicsLoading, setNaicsLoading] = useState(false);
  const [naicsSearched, setNaicsSearched] = useState(false);
  const [naicsError, setNaicsError] = useState("");
  const [liveGrants, setLiveGrants] = useState<Record<string, unknown>[]>([]);
  const [grantsLoading, setGrantsLoading] = useState(false);
  const [grantsFetched, setGrantsFetched] = useState(false);
  const [liveGrantFilter, setLiveGrantFilter] = useState("all");
  const chatEndRef = useRef<HTMLDivElement>(null);

  type AppEntry = { id: string; programName: string; type: string; agency: string; amountRequested: string; status: string; deadline: string; notes: string; };
  const emptyAppForm = { programName: "", type: "Grant", agency: "", amountRequested: "", status: "Researching", deadline: "", notes: "" };
  const [applications, setApplications] = useState<AppEntry[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appModal, setAppModal] = useState<{ open: boolean; editing: AppEntry | null }>({ open: false, editing: null });
  const [appForm, setAppForm] = useState<typeof emptyAppForm>(emptyAppForm);

  type CapStatement = { companyOverview: string; coreCompetencies: string[]; differentiators: string[]; pastPerformance: string; naicsCodes: string; certifications: string; contactName: string; contactEmail: string; contactPhone: string; contactLocation: string; };
  const [capStatement, setCapStatement] = useState<CapStatement | null>(null);
  const [capLoading, setCapLoading] = useState(false);
  const [capEditing, setCapEditing] = useState(false);
  const [capDraft, setCapDraft] = useState<CapStatement | null>(null);
  const [capCopied, setCapCopied] = useState(false);

  const authHeaders = () => ({ Authorization: `Bearer ${session.access_token}` });

  useEffect(() => { fetchProfile(); fetchChecklist(); fetchApplications(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, aiLoading]);

  async function fetchProfile() {
    try {
      const r = await fetch(`${API}/profile`, { headers: authHeaders() });
      if (r.ok) {
        const d = await r.json();
        setProfile({
          ...defaultProfile,
          ...d,
          businessName: d.businessName ?? "",
          entityType: d.entityType ?? "LLC",
          state: d.state ?? "MD",
          industry: d.industry ?? "",
          ownerName: d.ownerName ?? "",
          contactEmail: d.contactEmail ?? "",
          contactPhone: d.contactPhone ?? "",
          zipCode: d.zipCode ?? "",
          yearsInBusiness: d.yearsInBusiness ?? "0",
          employees: d.employees ?? "1",
          annualRevenue: d.annualRevenue ?? "0",
          missionStatement: d.missionStatement ?? "",
          fundingAmount: d.fundingAmount ?? "",
          fundingGoals: d.fundingGoals ?? [],
          certifications: d.certifications ?? [],
          naicsCodes: d.naicsCodes ?? [],
        });
      }
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function fetchChecklist() {
    try {
      const r = await fetch(`${API}/checklist-state`, { headers: authHeaders() });
      if (r.ok) setChecklist(await r.json());
    } catch { /* ignore */ }
  }

  async function saveProfile(update: Partial<Profile>) {
    const next = { ...profile, ...update };
    setProfile(next);
    try {
      await fetch(`${API}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(next),
      });
    } catch { /* ignore */ }
  }

  async function toggleItem(id: string) {
    const next = { ...checklist, [id]: !checklist[id] };
    setChecklist(next);
    try {
      await fetch(`${API}/checklist-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ itemId: id, completed: !checklist[id] }),
      });
    } catch { /* ignore */ }
  }

  async function completeOnboarding() {
    await saveProfile({ onboarded: true });
  }

  async function sendChat(msg: string) {
    if (!msg.trim() || aiLoading) return;
    setChatMessages(prev => [...prev, { role: "user", content: msg }]);
    setChatInput("");
    setAiLoading(true);

    const done = getDone(checklist), score = getScore(checklist), total = getTotal();
    const completedItems = SECTIONS.flatMap(s => s.items.filter(i => checklist[i.id]).map(i => i.label)).slice(0, 10);
    const pendingItems = SECTIONS.flatMap(s => s.items.filter(i => !checklist[i.id]).map(i => i.label)).slice(0, 10);

    const systemPrompt = `You are Founded Right Assistant, an expert business setup advisor helping a small business owner structure their LLC for grants, loans, and government contracts.

Business profile:
- Business name: ${profile.businessName || "not yet set"}
- Entity type: ${profile.entityType || "LLC"}
- Industry: ${profile.industry || "not specified"}
- State: ${profile.state || "MD"}
- ZIP: ${profile.zipCode || "not provided"}
- Years in business: ${profile.yearsInBusiness || "0"}
- Employees: ${profile.employees || "1"}
- Annual revenue: $${profile.annualRevenue || "0"}K
- Mission: ${profile.missionStatement || "not provided"}
- Funding goals: ${(profile.fundingGoals || []).join(", ") || "not specified"}
- Target funding amount: ${profile.fundingAmount || "not specified"}
- Owner certifications: ${(profile.certifications || []).join(", ") || "none selected"}
- NAICS codes: ${(profile.naicsCodes || []).map(n => n.code + " " + n.title).join(", ") || "not yet identified"}
- Setup score: ${score}% complete (${done}/${total} steps done)

Completed steps: ${completedItems.join(", ") || "none yet"}
Still pending: ${pendingItems.join(", ")}

Be concise, specific, and actionable. Keep answers under 200 words unless more is needed.`;

    try {
      const history = chatMessages.slice(-8).map(m => ({ role: m.role, content: m.content }));
      const r = await fetch(`${API}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ message: msg, history, systemPrompt }),
      });
      if (r.ok) {
        const { reply } = await r.json();
        setChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
      } else {
        setChatMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't connect. Please try again." }]);
      }
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    }
    setAiLoading(false);
  }

  async function searchNaics() {
    if (!naicsQuery.trim() || naicsLoading) return;
    setNaicsLoading(true); setNaicsError(""); setNaicsSearched(false);
    try {
      const r = await fetch(`${API}/ai/naics`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ query: naicsQuery, industry: profile.industry }),
      });
      if (r.ok) {
        const { codes } = await r.json();
        setNaicsResults(Array.isArray(codes) ? codes : []);
        setNaicsSearched(true);
      } else {
        setNaicsError("Could not fetch NAICS codes. Please try again.");
      }
    } catch { setNaicsError("Could not fetch NAICS codes. Please try again."); }
    setNaicsLoading(false);
  }

  async function fetchLiveGrants() {
    setGrantsLoading(true);
    try {
      const r = await fetch(`${API}/ai/grants`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ profile }),
      });
      if (r.ok) {
        const { grants } = await r.json();
        const normalized = (Array.isArray(grants) ? grants : []).map((g: Record<string, unknown>) => ({
          ...g,
          type: g.type === "contract" ? "Gov Contract" : g.type,
          match: g.match ?? g.matchScore ?? 0,
          requirements: (g.requirements ?? g.requiredSteps ?? []) as string[],
        }));
        setLiveGrants(normalized);
        setGrantsFetched(true);
      }
    } catch { /* ignore */ }
    setGrantsLoading(false);
  }

  async function fetchApplications() {
    setAppsLoading(true);
    try {
      const r = await fetch(`${API}/applications`, { headers: authHeaders() });
      if (r.ok) setApplications(await r.json());
    } catch { /* ignore */ }
    setAppsLoading(false);
  }

  function openAddApp() { setAppForm(emptyAppForm); setAppModal({ open: true, editing: null }); }
  function openEditApp(a: AppEntry) { setAppForm({ programName: a.programName, type: a.type, agency: a.agency, amountRequested: a.amountRequested, status: a.status, deadline: a.deadline, notes: a.notes }); setAppModal({ open: true, editing: a }); }
  function closeAppModal() { setAppModal({ open: false, editing: null }); }

  async function saveApp() {
    if (!appForm.programName.trim()) return;
    try {
      if (appModal.editing) {
        const r = await fetch(`${API}/applications/${appModal.editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(appForm) });
        if (r.ok) { const updated = await r.json(); setApplications(prev => prev.map(a => a.id === updated.id ? updated : a)); }
      } else {
        const r = await fetch(`${API}/applications`, { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(appForm) });
        if (r.ok) { const created = await r.json(); setApplications(prev => [...prev, created]); }
      }
    } catch { /* ignore */ }
    closeAppModal();
  }

  async function deleteApp(id: string) {
    if (!confirm("Delete this application?")) return;
    try {
      await fetch(`${API}/applications/${id}`, { method: "DELETE", headers: authHeaders() });
      setApplications(prev => prev.filter(a => a.id !== id));
    } catch { /* ignore */ }
  }

  async function quickUpdateStatus(id: string, status: string) {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    try {
      await fetch(`${API}/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ ...app, status }),
      });
    } catch { /* ignore */ }
  }

  async function generateCapStatement() {
    setCapLoading(true); setCapEditing(false);
    try {
      const r = await fetch(`${API}/ai/capabilitystatement`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ profile }),
      });
      if (r.ok) {
        const { statement } = await r.json();
        if (statement && statement.companyOverview) {
          setCapStatement(statement); setCapDraft(statement);
        }
      }
    } catch { /* ignore */ }
    setCapLoading(false);
  }

  function capToText(s: CapStatement): string {
    return [
      `CAPABILITY STATEMENT`,
      `${profile.businessName || "Company"}`,
      ``,
      `COMPANY OVERVIEW`,
      s.companyOverview,
      ``,
      `CORE COMPETENCIES`,
      ...(s.coreCompetencies || []).map(c => `• ${c}`),
      ``,
      `DIFFERENTIATORS`,
      ...(s.differentiators || []).map(d => `• ${d}`),
      ``,
      `PAST PERFORMANCE`,
      s.pastPerformance,
      ``,
      `NAICS CODES`,
      s.naicsCodes,
      ``,
      `CERTIFICATIONS & DESIGNATIONS`,
      s.certifications,
      ``,
      `CONTACT INFORMATION`,
      s.contactName,
      s.contactEmail,
      s.contactPhone,
      s.contactLocation,
    ].join("\n");
  }

  function copyCapToClipboard() {
    if (!capStatement) return;
    navigator.clipboard.writeText(capToText(capStatement)).then(() => {
      setCapCopied(true);
      setTimeout(() => setCapCopied(false), 2000);
    });
  }

  function downloadCapPdf() {
    window.print();
  }

  const score = getScore(checklist), done = getDone(checklist), total = getTotal();
  const urgent = SECTIONS.flatMap(s => s.items.filter(i => i.tags.includes("required") && !checklist[i.id]));

  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0a0c", color: "#555", fontSize: 14 }}>Loading your dashboard…</div>
      </>
    );
  }

  if (!profile.onboarded) {
    return (
      <>
        <style>{css}</style>
        <Onboarding profile={profile} onboardStep={onboardStep} setOnboardStep={setOnboardStep} saveProfile={saveProfile} completeOnboarding={completeOnboarding} />
      </>
    );
  }

  const toggleSection = (id: string) => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

  const filteredItems = (items: typeof SECTIONS[0]["items"]) => {
    if (filter === "all") return items;
    if (filter === "incomplete") return items.filter(i => !checklist[i.id]);
    return items.filter(i => i.tags.includes(filter));
  };

  const filteredFunding = STATIC_FUNDING.filter(f =>
    fundFilter === "all" || (fundFilter === "grants" && f.type === "Grant") ||
    (fundFilter === "loans" && f.type === "Loan") || (fundFilter === "gov" && f.type === "Gov Contract")
  );

  const navItems = [
    { id: "dashboard", icon: "◼", label: "Dashboard", section: "Overview" },
    { id: "checklist", icon: "✓", label: "Checklist", section: "Setup", badge: urgent.length || null },
    { id: "docs", icon: "◈", label: "Documents", section: "Setup" },
    { id: "presence", icon: "🌐", label: "Presence", section: "Setup" },
    { id: "capstatement", icon: "◧", label: "Capability stmt.", section: "Setup" },
    { id: "funding", icon: "$", label: "Opportunities", section: "Funding" },
    { id: "calendar", icon: "◷", label: "Calendar", section: "Funding" },
    { id: "naics", icon: "⌖", label: "NAICS finder", section: "Funding" },
    { id: "livegrants", icon: "◎", label: "Live grants", section: "Funding" },
    { id: "tracker", icon: "▦", label: "App tracker", section: "Funding" },
    { id: "ai", icon: "✦", label: "AI assistant", section: "Support" },
  ];

  let lastSection = "";

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="sidebar">
          <div className="brand">
            <div className="brand-name">Founded Right</div>
            <div className="brand-sub">{profile.businessName || "Business setup platform"}</div>
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
                  {n.badge ? <span className="badge-nav">{n.badge}</span> : null}
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: "auto", padding: "12px 18px", borderTop: "1px solid #1a1a1e" }}>
            <button className="reset-btn" onClick={onLogout} style={{ width: "100%" }}>Sign out</button>
          </div>
        </div>

        <div className="main">
          <div className="page">

            {screen === "dashboard" && (
              <>
                <div className="page-title">Dashboard</div>
                <div className="page-sub">Setup score and activity for {profile.businessName || "your business"}</div>
                <div className="stat-grid">
                  <div className="stat" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <ScoreRing pct={score} />
                    <div className="stat-lbl" style={{ textAlign: "center", marginTop: 6 }}>Setup score</div>
                  </div>
                  <div className="stat"><div className="stat-val">{done}</div><div className="stat-lbl">Steps completed</div></div>
                  <div className="stat"><div className="stat-val">{total - done}</div><div className="stat-lbl">Remaining steps</div></div>
                  <div className="stat"><div className="stat-val">{STATIC_FUNDING.filter(f => getFundingReadiness(f, checklist).missing <= 2).length}</div><div className="stat-lbl">Funding matches</div></div>
                </div>
                <div className="two-col">
                  <div className="card">
                    <div className="card-title">Progress by category</div>
                    {SECTIONS.map(s => {
                      const sdone = s.items.filter(i => checklist[i.id]).length;
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
                    <div className="card-title">Required action items</div>
                    {urgent.slice(0, 6).map(i => (
                      <div className="checklist-row" key={i.id}>
                        <div className="cb" onClick={() => toggleItem(i.id)}><span className="cb-check">✓</span></div>
                        <div><div className="item-label">{i.label}</div></div>
                      </div>
                    ))}
                    {urgent.length === 0 && <div style={{ fontSize: 13, color: "#555", padding: "10px 0" }}>All required items complete!</div>}
                  </div>
                </div>
                <div className="card">
                  <div className="card-title">Top funding matches</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10 }}>
                    {STATIC_FUNDING.slice(0, 3).map(f => {
                      const { missing } = getFundingReadiness(f, checklist);
                      return (
                        <div key={f.id} style={{ background: "#0f0f11", border: "1px solid #1e1e22", borderRadius: 10, padding: 12 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#d0cdc8" }}>{f.title}</div>
                          <div style={{ fontSize: 10, color: "#555", marginTop: 3 }}>{f.type} · {f.deadline}</div>
                          <div style={{ fontSize: 12, color: "#1D9E75", fontWeight: 600, marginTop: 5 }}>{f.amount}</div>
                          {missing > 0
                            ? <div style={{ fontSize: 10, color: "#BA7517", marginTop: 5 }}>{missing} step{missing > 1 ? "s" : ""} needed</div>
                            : <div style={{ fontSize: 10, color: "#1D9E75", marginTop: 5 }}>✓ Ready to apply</div>}
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
                  {["all", "incomplete", "required", "gov"].map(f => (
                    <button key={f} className={`filter-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
                      {f === "all" ? "All steps" : f === "incomplete" ? "Incomplete" : f === "required" ? "Required" : "Gov contracts"}
                    </button>
                  ))}
                </div>
                {SECTIONS.map(s => {
                  const visible = filteredItems(s.items);
                  if (visible.length === 0) return null;
                  const sdone = s.items.filter(i => checklist[i.id]).length;
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
                              <div className={`cb${checklist[item.id] ? " checked" : ""}`} onClick={() => toggleItem(item.id)}>
                                <span className="cb-check">✓</span>
                              </div>
                              <div style={{ flex: 1 }}>
                                <div className={`item-label${checklist[item.id] ? " done" : ""}`}>
                                  {item.label}{item.tags.map(t => <Tag key={t} type={t} />)}
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

            {screen === "docs" && (
              <>
                <div className="page-title">Document vault</div>
                <div className="page-sub">Track documents needed for funding applications — linked to your checklist</div>
                <div className="doc-grid">
                  {[
                    { name: "Articles of Organization", icon: "📄", key: "articles" },
                    { name: "EIN confirmation letter", icon: "📄", key: "ein" },
                    { name: "Operating Agreement", icon: "📄", key: "opagree" },
                    { name: "BOI report (FinCEN)", icon: "📄", key: "boi" },
                    { name: "Business plan", icon: "📋", key: "bizplan" },
                    { name: "Opening balance sheet", icon: "📊", key: "balsheet" },
                    { name: "Cash flow projection", icon: "📈", key: "budget" },
                    { name: "Personal tax returns (2yr)", icon: "📄", key: "taxreturns" },
                    { name: "Executive summary", icon: "📝", key: "execsummary" },
                    { name: "Capability statement", icon: "📋", key: "capstatement" },
                    { name: "Pitch deck", icon: "📊", key: "pitchdeck" },
                    { name: "Press / media kit", icon: "🗂️", key: "presskit" },
                  ].map(d => {
                    const isDone = checklist[d.key];
                    return (
                      <div key={d.name} className={`doc-card${!isDone ? " missing" : ""}`} onClick={() => toggleItem(d.key)}>
                        <div style={{ fontSize: 22 }}>{d.icon}</div>
                        <div className="doc-name">{d.name}</div>
                        <div className="doc-status" style={isDone ? { background: "#1D9E7520", color: "#1D9E75" } : { background: "#E24B4A18", color: "#E24B4A" }}>
                          {isDone ? "✓ done" : "✗ missing"}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="card">
                  <div className="card-title">What to do next</div>
                  <div style={{ fontSize: 13, color: "#888", lineHeight: 1.7 }}>
                    Click any document card to mark it complete. Documents are linked to your checklist — checking off items there will update this vault automatically.
                    <div style={{ marginTop: 10 }}>
                      <button className="chip" onClick={() => setScreen("checklist")}>Go to checklist →</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {screen === "presence" && (
              <>
                <div className="page-title">Professional presence</div>
                <div className="page-sub">How the world sees your business — grant reviewers, lenders, and contracting officers will look you up</div>
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
                    const isDone = checklist[item.id];
                    return (
                      <div key={item.id} onClick={() => toggleItem(item.id)}
                        style={{ background: isDone ? "#1D9E7512" : "#141416", border: `1px solid ${isDone ? "#1D9E7530" : "#1e1e22"}`, borderRadius: 10, padding: "12px 10px", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                        <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                        <div style={{ fontSize: 11, fontWeight: 500, color: isDone ? "#1D9E75" : "#888" }}>{item.label}</div>
                        <div style={{ fontSize: 10, marginTop: 3, color: isDone ? "#1D9E75" : "#555" }}>{isDone ? "✓ done" : "tap to mark"}</div>
                      </div>
                    );
                  })}
                </div>
                {[
                  { category: "Digital identity", items: ["domain", "bizemail", "bizphone", "website", "googlebiz"] },
                  { category: "Brand & marketing", items: ["logo", "emailsig", "socialmedia", "presskit", "pitchdeck"] },
                  { category: "Government contracting", items: ["capstatement", "linkedin"] },
                ].map(g => {
                  const presenceSection = SECTIONS.find(s => s.id === "presence");
                  const gItems = presenceSection?.items.filter(i => g.items.includes(i.id)) || [];
                  const gDone = gItems.filter(i => checklist[i.id]).length;
                  return (
                    <div className="card" key={g.category}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em" }}>{g.category}</div>
                        <div style={{ fontSize: 11, color: "#555" }}>{gDone}/{gItems.length}</div>
                      </div>
                      {gItems.map(item => (
                        <div className="checklist-row" key={item.id}>
                          <div className={`cb${checklist[item.id] ? " checked" : ""}`} onClick={() => toggleItem(item.id)}>
                            <span className="cb-check">✓</span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div className={`item-label${checklist[item.id] ? " done" : ""}`}>{item.label}{item.tags.map(t => <Tag key={t} type={t} />)}</div>
                            <div className="item-note">{item.note}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
                <div className="card" style={{ borderLeft: "3px solid #7f77dd" }}>
                  <div className="card-title">Why this matters for funding</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
                    {[
                      { label: "Grant reviewers", note: "Will Google your business before scoring your application. A professional website and LinkedIn page can be the difference between funded and declined." },
                      { label: "SBA lenders", note: "Verify your business is real and operational. A domain email, website, and phone number signal you're serious and reduce perceived risk." },
                      { label: "Contracting officers", note: "Your capability statement is your resume. It must be polished, one page, and include NAICS codes, core competencies, and past performance." },
                    ].map(c => (
                      <div key={c.label} style={{ background: "#1a1a20", borderRadius: 8, padding: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#d0cdc8", marginBottom: 6 }}>{c.label}</div>
                        <div style={{ fontSize: 11, color: "#666", lineHeight: 1.5 }}>{c.note}</div>
                      </div>
                    ))}
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
                  const { ready, missing } = getFundingReadiness(f, checklist);
                  return (
                    <div key={f.id} className="fund-card" style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <div className="fund-title">{f.title}</div>
                          {ready
                            ? <span style={{ fontSize: 10, background: "#1D9E7518", color: "#1D9E75", padding: "2px 8px", borderRadius: 99, fontWeight: 600 }}>Ready</span>
                            : <span style={{ fontSize: 10, background: "#E24B4A18", color: "#E24B4A", padding: "2px 8px", borderRadius: 99 }}>{missing} step{missing > 1 ? "s" : ""} needed</span>}
                          <span style={{ fontSize: 10, background: "#7f77dd18", color: "#9b8ff0", padding: "2px 8px", borderRadius: 99, marginLeft: "auto" }}>{f.match}% match</span>
                        </div>
                        <div className="fund-meta">{f.agency} · {f.deadline}</div>
                        <div className="fund-amt">{f.amount}</div>
                        {!ready && (
                          <div style={{ marginTop: 8 }}>
                            <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>Still needed:</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                              {f.needs.filter(n => !checklist[n]).map(n => (
                                <span key={n} style={{ fontSize: 10, background: "#1e1e22", color: "#666", padding: "2px 8px", borderRadius: 99 }}>{n}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <a href={f.applyUrl} target="_blank" rel="noreferrer"><button className="fund-btn">Apply →</button></a>
                    </div>
                  );
                })}
              </>
            )}

            {screen === "calendar" && (
              <>
                <div className="page-title">Calendar</div>
                <div className="page-sub">Upcoming deadlines and renewal dates for your business</div>
                <div className="two-col">
                  <div className="card">
                    <div className="card-title">March 2026</div>
                    <div className="cal-wrap">
                      {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} className="cal-hdr">{d}</div>)}
                      {[...Array(6)].map((_, i) => <div key={`e${i}`} />)}
                      {[...Array(31)].map((_, i) => {
                        const day = i + 1;
                        return <div key={day} className={`cal-day${day === 20 ? " today" : [15,22,31].includes(day) ? " has" : ""}`}>{day}</div>;
                      })}
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-title">April 2026</div>
                    <div className="cal-wrap">
                      {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} className="cal-hdr">{d}</div>)}
                      {[...Array(3)].map((_, i) => <div key={`e${i}`} />)}
                      {[...Array(30)].map((_, i) => {
                        const day = i + 1;
                        return <div key={day} className={`cal-day${[15].includes(day) ? " has" : ""}`}>{day}</div>;
                      })}
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-title">Upcoming deadlines</div>
                  {EVENTS.map(e => (
                    <div className="event-row" key={e.label + e.date}>
                      <div className="event-dot" style={{ background: e.urgent ? "#E24B4A" : "#7f77dd" }} />
                      <div className="event-date">{e.date}</div>
                      <div className="event-label">{e.label}</div>
                      {e.urgent && <span style={{ fontSize: 10, background: "#E24B4A18", color: "#E24B4A", padding: "2px 8px", borderRadius: 99, marginLeft: "auto" }}>Urgent</span>}
                    </div>
                  ))}
                </div>
              </>
            )}

            {screen === "naics" && (
              <>
                <div className="page-title">NAICS code finder</div>
                <div className="page-sub">Find the right industry codes to unlock government contracts and grants — powered by AI</div>
                <div className="card" style={{ marginBottom: 16 }}>
                  <div className="card-title">What does your business do?</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <textarea className="chat-input" rows={2} style={{ flex: 1, resize: "none", lineHeight: 1.5, padding: "10px 14px" }}
                      placeholder={`e.g. "We provide cybersecurity consulting and IT staffing to federal agencies"`}
                      value={naicsQuery} onChange={e => setNaicsQuery(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); searchNaics(); } }}
                    />
                    <button className="chat-send" style={{ alignSelf: "stretch", minWidth: 90 }} onClick={searchNaics} disabled={naicsLoading || !naicsQuery.trim()}>
                      {naicsLoading ? "..." : "Find codes →"}
                    </button>
                  </div>
                  {profile.industry && <div style={{ fontSize: 11, color: "#555", marginTop: 8 }}>✦ Industry from your profile: <span style={{ color: "#9b8ff0" }}>{profile.industry}</span></div>}
                  {naicsError && <div style={{ fontSize: 12, color: "#E24B4A", marginTop: 8 }}>{naicsError}</div>}
                </div>
                {profile.naicsCodes.length > 0 && (
                  <div className="card" style={{ marginBottom: 16, borderLeft: "3px solid #1D9E75" }}>
                    <div className="card-title">Your saved NAICS codes</div>
                    {profile.naicsCodes.map(n => (
                      <div key={n.code} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #1a1a1e" }}>
                        <div style={{ background: "#1D9E7520", color: "#1D9E75", fontSize: 13, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>{n.code}</div>
                        <div style={{ flex: 1, fontSize: 13, color: "#d0cdc8" }}>{n.title}</div>
                        <button onClick={() => saveProfile({ naicsCodes: profile.naicsCodes.filter(x => x.code !== n.code) })}
                          style={{ fontSize: 11, color: "#555", background: "none", padding: "4px 8px", border: "1px solid #2a2a30", borderRadius: 6, cursor: "pointer" }}>Remove</button>
                      </div>
                    ))}
                  </div>
                )}
                {naicsResults.length > 0 && (
                  <div className="card">
                    <div className="card-title">AI-recommended NAICS codes</div>
                    {naicsResults.map((item, i) => {
                      const already = profile.naicsCodes.find(n => n.code === item.code);
                      const relColor = item.relevance === "primary" ? { bg: "#1D9E7518", color: "#1D9E75" } : item.relevance === "secondary" ? { bg: "#7f77dd18", color: "#9b8ff0" } : { bg: "#33333a", color: "#777" };
                      return (
                        <div key={item.code} style={{ padding: "14px 0", borderBottom: i < naicsResults.length - 1 ? "1px solid #1a1a1e" : "none" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                            <div style={{ background: "#1e1e30", color: "#9b8ff0", fontSize: 14, fontWeight: 700, padding: "5px 12px", borderRadius: 8, flexShrink: 0 }}>{item.code}</div>
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
                            <button onClick={() => {
                              if (already) saveProfile({ naicsCodes: profile.naicsCodes.filter(n => n.code !== item.code) });
                              else saveProfile({ naicsCodes: [...profile.naicsCodes, { code: item.code, title: item.title, relevance: item.relevance }] });
                            }} className={already ? "reset-btn" : "chat-send"} style={{ fontSize: 12, padding: "7px 14px", flexShrink: 0, alignSelf: "flex-start" }}>
                              {already ? "✓ Added" : "+ Add"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {naicsResults.length === 0 && !naicsLoading && (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#555", fontSize: 13 }}>
                    <div style={{ fontSize: 28, marginBottom: 12 }}>⌖</div>
                    {naicsSearched
                      ? "No NAICS codes found for that description. Try rephrasing with more detail about your products or services."
                      : "Describe your business above and the AI will suggest the best NAICS codes for you."
                    }
                    {!naicsSearched && <div style={{ marginTop: 8, fontSize: 11 }}>Getting the right codes is critical — wrong codes can disqualify you from contracts and grants.</div>}
                  </div>
                )}
              </>
            )}

            {screen === "livegrants" && (
              <>
                <div className="page-title">Live funding database</div>
                <div className="page-sub">AI-matched opportunities for {profile.businessName || "your business"} — personalized to your profile</div>
                {!grantsFetched ? (
                  <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>◎</div>
                    <div style={{ fontSize: 16, fontWeight: 500, color: "#d0cdc8", marginBottom: 8 }}>Find funding matched to your profile</div>
                    <div style={{ fontSize: 13, color: "#666", marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" }}>
                      The AI will search federal, state, and private programs and score each one against your business profile, industry, certifications, and NAICS codes.
                    </div>
                    {profile.industry && (
                      <div style={{ fontSize: 12, color: "#9b8ff0", background: "#1e1e30", border: "1px solid #7f77dd22", borderRadius: 8, padding: "8px 16px", marginBottom: 20, display: "inline-block" }}>
                        ✦ Profile: {profile.industry} · {profile.state} · {profile.entityType}
                      </div>
                    )}
                    <br />
                    <button className="start-btn" style={{ maxWidth: 240 }} onClick={fetchLiveGrants} disabled={grantsLoading}>
                      {grantsLoading ? "Finding opportunities…" : "Find my funding →"}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="filter-row">
                      {["all", "Grant", "Loan", "Gov Contract"].map(f => (
                        <button key={f} className={`filter-btn${liveGrantFilter === f ? " active" : ""}`} onClick={() => setLiveGrantFilter(f)}>
                          {f === "all" ? "All types" : f}
                        </button>
                      ))}
                      <button className="filter-btn" onClick={fetchLiveGrants} disabled={grantsLoading} style={{ marginLeft: "auto" }}>
                        {grantsLoading ? "Refreshing…" : "↻ Refresh"}
                      </button>
                    </div>
                    {liveGrants.filter((g) => liveGrantFilter === "all" || g.type === liveGrantFilter).length === 0 && (
                      <div style={{ textAlign: "center", padding: "40px 20px", color: "#555", fontSize: 13 }}>
                        <div style={{ fontSize: 28, marginBottom: 12 }}>◎</div>
                        {liveGrants.length === 0
                          ? "No funding matches found for your current profile. Try updating your certifications or industry in your profile."
                          : `No ${liveGrantFilter} opportunities match your current filters.`}
                      </div>
                    )}
                    {liveGrants
                      .filter((g) => liveGrantFilter === "all" || g.type === liveGrantFilter)
                      .sort((a, b) => Number(b.match ?? 0) - Number(a.match ?? 0))
                      .map((g, idx) => {
                        const matchScore = Number(g.match ?? 0);
                        const typeColors: Record<string, { bg: string; color: string }> = {
                          "Grant": { bg: "#1D9E7520", color: "#1D9E75" },
                          "Loan": { bg: "#185FA520", color: "#378ADD" },
                          "Gov Contract": { bg: "#7f77dd20", color: "#9b8ff0" },
                          "Tax Credit": { bg: "#BA751720", color: "#EF9F27" },
                        };
                        const tc = typeColors[g.type as string] ?? { bg: "#33333a", color: "#777" };
                        const reqs = Array.isArray(g.requirements) ? g.requirements as string[] : [];
                        return (
                          <div key={idx} className="fund-card">
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                                  <div className="fund-title">{String(g.title)}</div>
                                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, fontWeight: 600, background: tc.bg, color: tc.color }}>{String(g.type)}</span>
                                  <span style={{ fontSize: 10, background: "#7f77dd18", color: "#9b8ff0", padding: "2px 8px", borderRadius: 99 }}>{matchScore}% match</span>
                                </div>
                                <div className="fund-meta">{String(g.agency)} · {String(g.deadline)}</div>
                                <div className="fund-amt">{String(g.amount)}</div>
                                {g.description && <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>{String(g.description)}</div>}
                                {reqs.length > 0 && (
                                  <div style={{ marginTop: 8 }}>
                                    <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>Key requirements:</div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                      {reqs.map((step, si) => (
                                        <span key={si} style={{ fontSize: 10, background: "#1e1e22", color: "#666", padding: "2px 8px", borderRadius: 99 }}>{step}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              {g.applyUrl && <a href={String(g.applyUrl)} target="_blank" rel="noreferrer"><button className="fund-btn">Apply →</button></a>}
                            </div>
                          </div>
                        );
                      })}
                  </>
                )}
              </>
            )}

            {screen === "ai" && (
              <>
                <div className="page-title">AI assistant</div>
                <div className="page-sub">Ask anything about your business setup, funding, certifications, and strategy</div>
                <div className="chips">
                  {["What steps should I prioritize this week?", "What grants am I eligible for right now?", "How do I file my BOI report with FinCEN?", "Explain SAM.gov registration step by step", "What certifications should I apply for?", "How do I build business credit fast?"].map(p => (
                    <button key={p} className="chip" onClick={() => sendChat(p)}>{p}</button>
                  ))}
                </div>
                <div className="chat-outer">
                  <div className="chat-messages">
                    {chatMessages.map((m, i) => (
                      <div key={i} className={`msg ${m.role === "user" ? "user" : "ai"}`} style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
                    ))}
                    {aiLoading && (
                      <div className="typing"><div className="dot" /><div className="dot" /><div className="dot" /></div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="chat-input-area">
                    <input className="chat-input" placeholder="Ask me anything about your business setup…"
                      value={chatInput} onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(chatInput); } }}
                    />
                    <button className="chat-send" onClick={() => sendChat(chatInput)} disabled={aiLoading || !chatInput.trim()}>Send →</button>
                  </div>
                </div>
                <div className="card" style={{ marginTop: 14 }}>
                  <div className="card-title">About your AI assistant</div>
                  <div style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>
                    Your assistant is personalized with your business profile, NAICS codes, certifications, and setup progress. It gives advice specific to your situation rather than generic tips. The more you fill out your profile and checklist, the better the recommendations get.
                  </div>
                </div>
              </>
            )}

            {screen === "tracker" && (() => {
              const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
                Researching:  { bg: "#185FA520", color: "#378ADD" },
                Drafting:     { bg: "#185FA520", color: "#378ADD" },
                Submitted:    { bg: "#7f77dd20", color: "#9b8ff0" },
                "Under Review": { bg: "#BA751720", color: "#EF9F27" },
                Awarded:      { bg: "#1D9E7520", color: "#1D9E75" },
                Declined:     { bg: "#E24B4A20", color: "#E24B4A" },
                Withdrawn:    { bg: "#33333a",   color: "#666" },
              };
              const STATUSES = Object.keys(STATUS_COLORS);
              const TYPES = ["Grant", "Loan", "Gov Contract"];
              const totalApplied = applications.length;
              const totalAwarded = applications.filter(a => a.status === "Awarded").length;
              const totalPending = applications.filter(a => ["Submitted", "Under Review", "Drafting", "Researching"].includes(a.status)).length;
              const totalAmountAwarded = applications.filter(a => a.status === "Awarded").reduce((sum, a) => {
                const n = parseFloat((a.amountRequested || "").replace(/[^0-9.]/g, ""));
                return sum + (isNaN(n) ? 0 : n);
              }, 0);
              return (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <div>
                      <div className="page-title" style={{ marginBottom: 2 }}>Application tracker</div>
                      <div className="page-sub">Track every grant, loan, and contract application in one place</div>
                    </div>
                    <button className="start-btn" style={{ maxWidth: 180, padding: "10px 20px", fontSize: 13 }} onClick={openAddApp}>+ Add application</button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 18 }}>
                    {[
                      { label: "Total applied", value: totalApplied, color: "#9b8ff0" },
                      { label: "Awarded", value: totalAwarded, color: "#1D9E75" },
                      { label: "Amount awarded", value: totalAmountAwarded > 0 ? `$${totalAmountAwarded.toLocaleString()}` : "—", color: "#1D9E75" },
                      { label: "Pending", value: totalPending, color: "#EF9F27" },
                    ].map(s => (
                      <div key={s.label} className="card" style={{ padding: "14px 16px", margin: 0 }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "'Syne', sans-serif" }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {appsLoading && <div style={{ color: "#555", fontSize: 13, textAlign: "center", padding: 40 }}>Loading applications…</div>}

                  {!appsLoading && applications.length === 0 && (
                    <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>▦</div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: "#d0cdc8", marginBottom: 8 }}>No applications yet</div>
                      <div style={{ fontSize: 13, color: "#555", marginBottom: 20 }}>Start tracking your grant, loan, and contract applications to stay organized and never miss a deadline.</div>
                      <button className="start-btn" style={{ maxWidth: 200 }} onClick={openAddApp}>+ Add your first application</button>
                    </div>
                  )}

                  {!appsLoading && applications.length > 0 && (
                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                      {applications.map((a, i) => {
                        const sc = STATUS_COLORS[a.status] ?? { bg: "#33333a", color: "#666" };
                        const typeColors: Record<string, { bg: string; color: string }> = {
                          "Grant": { bg: "#1D9E7520", color: "#1D9E75" },
                          "Loan": { bg: "#185FA520", color: "#378ADD" },
                          "Gov Contract": { bg: "#7f77dd20", color: "#9b8ff0" },
                        };
                        const tc = typeColors[a.type] ?? { bg: "#33333a", color: "#777" };
                        return (
                          <div key={a.id} style={{ padding: "16px 18px", borderBottom: i < applications.length - 1 ? "1px solid #1a1a1e" : "none", display: "flex", alignItems: "flex-start", gap: 14 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                                <span style={{ fontSize: 14, fontWeight: 600, color: "#e0ddd8" }}>{a.programName}</span>
                                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, fontWeight: 600, background: tc.bg, color: tc.color }}>{a.type}</span>
                                <select
                                  value={a.status}
                                  onChange={e => quickUpdateStatus(a.id, e.target.value)}
                                  style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 99, background: sc.bg, color: sc.color, border: `1px solid ${sc.color}44`, cursor: "pointer", outline: "none", appearance: "none", WebkitAppearance: "none" }}
                                >
                                  {STATUSES.map(s => <option key={s} value={s} style={{ background: "#13131a", color: "#e0ddd8" }}>{s}</option>)}
                                </select>
                              </div>
                              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: "#666", marginBottom: a.notes ? 6 : 0 }}>
                                {a.agency && <span>{a.agency}</span>}
                                {a.amountRequested && <span style={{ color: "#9b8ff0" }}>{a.amountRequested}</span>}
                                {a.deadline && <span>Due: {a.deadline}</span>}
                              </div>
                              {a.notes && <div style={{ fontSize: 12, color: "#555", marginTop: 4, fontStyle: "italic" }}>{a.notes}</div>}
                            </div>
                            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                              <button onClick={() => openEditApp(a)} style={{ background: "none", border: "1px solid #2a2a2e", color: "#777", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>Edit</button>
                              <button onClick={() => deleteApp(a.id)} style={{ background: "none", border: "1px solid #2a2a2e", color: "#E24B4A", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>Delete</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {appModal.open && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={e => { if (e.target === e.currentTarget) closeAppModal(); }}>
                      <div style={{ background: "#13131a", border: "1px solid #2a2a2e", borderRadius: 16, padding: 28, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
                        <div style={{ fontSize: 17, fontWeight: 700, color: "#e0ddd8", marginBottom: 20, fontFamily: "'Syne', sans-serif" }}>
                          {appModal.editing ? "Edit application" : "Add application"}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                          <div>
                            <label style={{ fontSize: 11, color: "#666", display: "block", marginBottom: 5 }}>Program name *</label>
                            <input value={appForm.programName} onChange={e => setAppForm(f => ({ ...f, programName: e.target.value }))} placeholder="e.g. SBA Economic Injury Disaster Loan" style={{ width: "100%", background: "#1a1a1e", border: "1px solid #2a2a2e", borderRadius: 8, padding: "10px 12px", color: "#e0ddd8", fontSize: 13, boxSizing: "border-box" }} />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div>
                              <label style={{ fontSize: 11, color: "#666", display: "block", marginBottom: 5 }}>Type</label>
                              <select value={appForm.type} onChange={e => setAppForm(f => ({ ...f, type: e.target.value }))} style={{ width: "100%", background: "#1a1a1e", border: "1px solid #2a2a2e", borderRadius: 8, padding: "10px 12px", color: "#e0ddd8", fontSize: 13 }}>
                                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </div>
                            <div>
                              <label style={{ fontSize: 11, color: "#666", display: "block", marginBottom: 5 }}>Status</label>
                              <select value={appForm.status} onChange={e => setAppForm(f => ({ ...f, status: e.target.value }))} style={{ width: "100%", background: "#1a1a1e", border: "1px solid #2a2a2e", borderRadius: 8, padding: "10px 12px", color: "#e0ddd8", fontSize: 13 }}>
                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div>
                              <label style={{ fontSize: 11, color: "#666", display: "block", marginBottom: 5 }}>Agency / Program</label>
                              <input value={appForm.agency} onChange={e => setAppForm(f => ({ ...f, agency: e.target.value }))} placeholder="e.g. SBA, MDOT, NSF" style={{ width: "100%", background: "#1a1a1e", border: "1px solid #2a2a2e", borderRadius: 8, padding: "10px 12px", color: "#e0ddd8", fontSize: 13, boxSizing: "border-box" }} />
                            </div>
                            <div>
                              <label style={{ fontSize: 11, color: "#666", display: "block", marginBottom: 5 }}>Amount requested</label>
                              <input value={appForm.amountRequested} onChange={e => setAppForm(f => ({ ...f, amountRequested: e.target.value }))} placeholder="e.g. $50,000" style={{ width: "100%", background: "#1a1a1e", border: "1px solid #2a2a2e", borderRadius: 8, padding: "10px 12px", color: "#e0ddd8", fontSize: 13, boxSizing: "border-box" }} />
                            </div>
                          </div>
                          <div>
                            <label style={{ fontSize: 11, color: "#666", display: "block", marginBottom: 5 }}>Deadline</label>
                            <input value={appForm.deadline} onChange={e => setAppForm(f => ({ ...f, deadline: e.target.value }))} placeholder="e.g. June 30, 2026 or Rolling" style={{ width: "100%", background: "#1a1a1e", border: "1px solid #2a2a2e", borderRadius: 8, padding: "10px 12px", color: "#e0ddd8", fontSize: 13, boxSizing: "border-box" }} />
                          </div>
                          <div>
                            <label style={{ fontSize: 11, color: "#666", display: "block", marginBottom: 5 }}>Notes</label>
                            <textarea value={appForm.notes} onChange={e => setAppForm(f => ({ ...f, notes: e.target.value }))} placeholder="Requirements, contact info, next steps…" rows={3} style={{ width: "100%", background: "#1a1a1e", border: "1px solid #2a2a2e", borderRadius: 8, padding: "10px 12px", color: "#e0ddd8", fontSize: 13, resize: "vertical", boxSizing: "border-box" }} />
                          </div>
                          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                            <button onClick={closeAppModal} style={{ background: "none", border: "1px solid #2a2a2e", color: "#777", borderRadius: 8, padding: "10px 20px", fontSize: 13, cursor: "pointer" }}>Cancel</button>
                            <button onClick={saveApp} disabled={!appForm.programName.trim()} style={{ background: "#7f77dd", border: "none", color: "#fff", borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: appForm.programName.trim() ? 1 : 0.5 }}>{appModal.editing ? "Save changes" : "Add application"}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            {screen === "capstatement" && (() => {
              const cap = capEditing ? capDraft : capStatement;
              const field = (label: string, key: keyof CapStatement, multiline = false) => (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#7f77dd", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>{label}</div>
                  {capEditing ? (
                    multiline
                      ? <textarea value={String(cap?.[key] ?? "")} onChange={e => setCapDraft(d => d ? { ...d, [key]: e.target.value } : d)} rows={3} style={{ width: "100%", background: "#1a1a1e", border: "1px solid #2a2a2e", borderRadius: 8, padding: "10px 12px", color: "#e0ddd8", fontSize: 13, resize: "vertical", boxSizing: "border-box" }} />
                      : <input value={String(cap?.[key] ?? "")} onChange={e => setCapDraft(d => d ? { ...d, [key]: e.target.value } : d)} style={{ width: "100%", background: "#1a1a1e", border: "1px solid #2a2a2e", borderRadius: 8, padding: "10px 12px", color: "#e0ddd8", fontSize: 13, boxSizing: "border-box" }} />
                  ) : (
                    <div style={{ fontSize: 13, color: "#c0bdb8", lineHeight: 1.7 }}>{String(cap?.[key] ?? "—")}</div>
                  )}
                </div>
              );
              const bulletField = (label: string, key: "coreCompetencies" | "differentiators") => (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#7f77dd", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>{label}</div>
                  {capEditing ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {(cap?.[key] ?? []).map((item, i) => (
                        <input key={i} value={item} onChange={e => setCapDraft(d => { if (!d) return d; const arr = [...d[key]]; arr[i] = e.target.value; return { ...d, [key]: arr }; })} style={{ width: "100%", background: "#1a1a1e", border: "1px solid #2a2a2e", borderRadius: 8, padding: "8px 12px", color: "#e0ddd8", fontSize: 13, boxSizing: "border-box" }} />
                      ))}
                    </div>
                  ) : (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {(cap?.[key] ?? []).map((item, i) => <li key={i} style={{ fontSize: 13, color: "#c0bdb8", lineHeight: 1.8 }}>{item}</li>)}
                    </ul>
                  )}
                </div>
              );

              return (
                <>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4, gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <div className="page-title" style={{ marginBottom: 2 }}>Capability statement</div>
                      <div className="page-sub">AI-generated government contracting one-pager from your profile</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flexShrink: 0 }}>
                      {capStatement && !capEditing && <>
                        <button onClick={() => { setCapEditing(true); setCapDraft(capStatement); }} style={{ background: "none", border: "1px solid #2a2a2e", color: "#aaa", borderRadius: 8, padding: "8px 16px", fontSize: 12, cursor: "pointer" }}>Edit</button>
                        <button onClick={copyCapToClipboard} style={{ background: "none", border: "1px solid #2a2a2e", color: capCopied ? "#1D9E75" : "#aaa", borderRadius: 8, padding: "8px 16px", fontSize: 12, cursor: "pointer" }}>{capCopied ? "Copied!" : "Copy text"}</button>
                        <button onClick={downloadCapPdf} style={{ background: "#7f77dd", border: "none", color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Download PDF</button>
                      </>}
                      {capEditing && <>
                        <button onClick={() => setCapEditing(false)} style={{ background: "none", border: "1px solid #2a2a2e", color: "#777", borderRadius: 8, padding: "8px 16px", fontSize: 12, cursor: "pointer" }}>Cancel</button>
                        <button onClick={() => { setCapStatement(capDraft); setCapEditing(false); }} style={{ background: "#7f77dd", border: "none", color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Save edits</button>
                      </>}
                      <button onClick={generateCapStatement} disabled={capLoading} style={{ background: capStatement ? "none" : "#7f77dd", border: capStatement ? "1px solid #2a2a2e" : "none", color: capStatement ? "#aaa" : "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", opacity: capLoading ? 0.6 : 1 }}>
                        {capLoading ? "Generating…" : capStatement ? "↻ Regenerate" : "Generate →"}
                      </button>
                    </div>
                  </div>

                  {!capStatement && !capLoading && (
                    <div className="card" style={{ textAlign: "center", padding: "52px 24px" }}>
                      <div style={{ fontSize: 36, marginBottom: 14 }}>◧</div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: "#d0cdc8", marginBottom: 8 }}>Generate your capability statement</div>
                      <div style={{ fontSize: 13, color: "#555", maxWidth: 440, margin: "0 auto 24px", lineHeight: 1.7 }}>
                        A capability statement is the business card of government contracting. The AI will use your saved profile — business name, NAICS codes, certifications, and industry — to write a professional one-pager.
                      </div>
                      {!profile.businessName && <div style={{ fontSize: 12, color: "#EF9F27", marginBottom: 16 }}>Tip: Complete your profile first for a better statement.</div>}
                      <button className="start-btn" style={{ maxWidth: 220 }} onClick={generateCapStatement} disabled={capLoading}>
                        {capLoading ? "Generating…" : "Generate capability statement →"}
                      </button>
                    </div>
                  )}

                  {capLoading && (
                    <div className="card" style={{ textAlign: "center", padding: "52px 24px" }}>
                      <div style={{ fontSize: 13, color: "#555" }}>AI is writing your capability statement…</div>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 16 }}>
                        <div className="dot" /><div className="dot" /><div className="dot" />
                      </div>
                    </div>
                  )}

                  {cap && !capLoading && (
                    <div id="cap-statement-print" className="card" style={{ padding: "28px 32px" }}>
                      <div style={{ textAlign: "center", marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #1e1e22" }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: "#e0ddd8", fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>{profile.businessName || "Company Name"}</div>
                        <div style={{ fontSize: 12, color: "#7f77dd", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>Capability Statement</div>
                        {profile.industry && <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{profile.industry} · {profile.entityType} · {profile.state}</div>}
                      </div>

                      {field("Company Overview", "companyOverview", true)}
                      {bulletField("Core Competencies", "coreCompetencies")}
                      {bulletField("Differentiators", "differentiators")}
                      {field("Past Performance", "pastPerformance", true)}

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 8 }}>
                        <div>
                          {field("NAICS Codes", "naicsCodes")}
                          {field("Certifications & Designations", "certifications")}
                        </div>
                        <div>
                          <div style={{ marginBottom: 18 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#7f77dd", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Contact Information</div>
                            {capEditing ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {(["contactName", "contactEmail", "contactPhone", "contactLocation"] as const).map(k => (
                                  <input key={k} value={cap[k]} onChange={e => setCapDraft(d => d ? { ...d, [k]: e.target.value } : d)} placeholder={k.replace("contact", "")} style={{ width: "100%", background: "#1a1a1e", border: "1px solid #2a2a2e", borderRadius: 8, padding: "7px 10px", color: "#e0ddd8", fontSize: 12, boxSizing: "border-box" }} />
                                ))}
                              </div>
                            ) : (
                              <div style={{ fontSize: 13, color: "#c0bdb8", lineHeight: 2 }}>
                                {cap.contactName && <div>{cap.contactName}</div>}
                                {cap.contactEmail && <div>{cap.contactEmail}</div>}
                                {cap.contactPhone && <div>{cap.contactPhone}</div>}
                                {cap.contactLocation && <div>{cap.contactLocation}</div>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div id="cap-print-area" style={{ display: "none" }} aria-hidden="true" />
                </>
              );
            })()}

          </div>
        </div>
      </div>
    </>
  );
}

function Onboarding({ profile, onboardStep, setOnboardStep, saveProfile, completeOnboarding }: {
  profile: Profile;
  onboardStep: number;
  setOnboardStep: (n: number) => void;
  saveProfile: (p: Partial<Profile>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}) {
  const toggleArr = (arr: string[], val: string) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
  const certMap: Record<string, { name: string; benefit: string }> = {
    woman: { name: "WOSB — Women-Owned Small Business", benefit: "5% of federal contract set-asides" },
    minority: { name: "MBE — Minority Business Enterprise", benefit: "Corporate & gov supplier diversity" },
    veteran: { name: "VOSB — Veteran-Owned Small Business", benefit: "VA contract set-asides" },
    disabled_vet: { name: "SDVOSB — Service-Disabled Veteran", benefit: "3% of federal contract set-asides" },
    hubzone: { name: "HUBZone Certification", benefit: "3% of federal contract set-asides" },
    disadvantaged: { name: "SBA 8(a) Business Development", benefit: "9 years of exclusive contract access" },
  };
  const canAdvance = () => {
    if (onboardStep === 0) return true;
    if (onboardStep === 1) return (profile.businessName ?? "").trim().length > 0 && !!profile.industry;
    if (onboardStep === 2) return (profile.ownerName ?? "").trim().length > 0;
    if (onboardStep === 3) return (profile.fundingGoals ?? []).length > 0;
    return true;
  };

  return (
    <div className="onboard">
      <div className="onboard-card">
        <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
          {ONBOARD_STEPS.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= onboardStep ? "#7f77dd" : "#2a2a30", transition: "background 0.3s" }} />
          ))}
        </div>
        <div style={{ marginBottom: 6, fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>Step {onboardStep + 1} of {ONBOARD_STEPS.length}</div>
        <div className="onboard-title">{ONBOARD_STEPS[onboardStep].title}</div>
        <div className="onboard-sub">{ONBOARD_STEPS[onboardStep].sub}</div>

        {onboardStep === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {["Personalized 46-step setup checklist based on your goals", "Funding opportunities matched to your profile and certifications", "NAICS code finder to unlock government contracts", "AI assistant that knows your business context", "Document vault and deadline calendar"].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#1a1a20", borderRadius: 8, padding: "10px 14px" }}>
                <span style={{ color: "#1D9E75", fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 13, color: "#c0bdb8" }}>{f}</span>
              </div>
            ))}
            <div style={{ fontSize: 11, color: "#555", marginTop: 4, textAlign: "center" }}>Takes about 2 minutes · All data saved to your account</div>
          </div>
        )}

        {onboardStep === 1 && (
          <div>
            <div className="field-label">Business name</div>
            <input className="field-input" placeholder="e.g. Apex Solutions LLC" value={profile.businessName} onChange={e => saveProfile({ businessName: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div className="field-label">Entity type</div>
                <select className="field-input" value={profile.entityType} onChange={e => saveProfile({ entityType: e.target.value })}>
                  {["LLC","S-Corp","C-Corp","Sole Proprietor","Nonprofit","Partnership"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <div className="field-label">State</div>
                <select className="field-input" value={profile.state} onChange={e => saveProfile({ state: e.target.value })}>
                  {US_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="field-label">Industry</div>
            <select className="field-input" value={profile.industry} onChange={e => saveProfile({ industry: e.target.value })}>
              <option value="">Select an industry</option>
              {["Technology / Software","Consulting / Professional Services","Construction / Contracting","Healthcare / Medical","Retail / E-commerce","Food & Beverage","Manufacturing","Education / Training","Nonprofit / Social Impact","Other"].map(o => <option key={o}>{o}</option>)}
            </select>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div className="field-label">Years in business</div>
                <select className="field-input" value={profile.yearsInBusiness} onChange={e => saveProfile({ yearsInBusiness: e.target.value })}>
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
                <select className="field-input" value={profile.employees} onChange={e => saveProfile({ employees: e.target.value })}>
                  <option value="1">Just me</option>
                  <option value="2">2–5</option>
                  <option value="6">6–10</option>
                  <option value="11">11–50</option>
                  <option value="51">51–500</option>
                </select>
              </div>
            </div>
            <div className="field-label">Annual revenue</div>
            <select className="field-input" value={profile.annualRevenue} onChange={e => saveProfile({ annualRevenue: e.target.value })}>
              <option value="0">Pre-revenue</option>
              <option value="1">Under $50K</option>
              <option value="50">$50K – $250K</option>
              <option value="250">$250K – $1M</option>
              <option value="1000">$1M+</option>
            </select>
            <div className="field-label">Mission statement <span style={{ color: "#555", fontWeight: 400 }}>(optional)</span></div>
            <textarea className="field-input" rows={2} style={{ resize: "none", lineHeight: 1.5 }} placeholder="e.g. We provide IT consulting to nonprofits in the DC metro area…" value={profile.missionStatement} onChange={e => saveProfile({ missionStatement: e.target.value })} />
          </div>
        )}

        {onboardStep === 2 && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div className="field-label">Your name</div>
                <input className="field-input" placeholder="Full name" value={profile.ownerName} onChange={e => saveProfile({ ownerName: e.target.value })} />
              </div>
              <div>
                <div className="field-label">ZIP code</div>
                <input className="field-input" placeholder="e.g. 20781" value={profile.zipCode} onChange={e => saveProfile({ zipCode: e.target.value })} />
              </div>
            </div>
            <div className="field-label">Business email</div>
            <input className="field-input" type="email" placeholder="you@yourbusiness.com" value={profile.contactEmail} onChange={e => saveProfile({ contactEmail: e.target.value })} />
            <div className="field-label">Business phone</div>
            <input className="field-input" placeholder="(301) 555-0100" value={profile.contactPhone} onChange={e => saveProfile({ contactPhone: e.target.value })} />
            <div className="field-label" style={{ marginBottom: 10 }}>Ownership characteristics <span style={{ color: "#555", fontWeight: 400 }}>(unlocks certifications)</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {CERT_OPTIONS.map(c => {
                const sel = (profile.certifications || []).includes(c.id);
                return (
                  <div key={c.id} onClick={() => saveProfile({ certifications: toggleArr(profile.certifications || [], c.id) })}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: sel ? "#1e1e30" : "#1a1a1e", border: `1px solid ${sel ? "#7f77dd66" : "#2a2a30"}`, borderRadius: 8, cursor: "pointer", fontSize: 13, color: sel ? "#c8c4f0" : "#888", transition: "all 0.15s" }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${sel ? "#7f77dd" : "#333"}`, background: sel ? "#7f77dd" : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, color: "white" }}>{sel ? "✓" : ""}</div>
                    {c.label}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {onboardStep === 3 && (
          <div>
            <div className="field-label" style={{ marginBottom: 10 }}>Funding goals <span style={{ color: "#555", fontWeight: 400 }}>(select all that apply)</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {GOAL_OPTIONS.map(g => {
                const sel = (profile.fundingGoals || []).includes(g.id);
                return (
                  <div key={g.id} onClick={() => saveProfile({ fundingGoals: toggleArr(profile.fundingGoals || [], g.id) })}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: sel ? "#1e1e30" : "#1a1a1e", border: `1px solid ${sel ? "#7f77dd66" : "#2a2a30"}`, borderRadius: 8, cursor: "pointer", fontSize: 13, color: sel ? "#c8c4f0" : "#888", transition: "all 0.15s" }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${sel ? "#7f77dd" : "#333"}`, background: sel ? "#7f77dd" : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, color: "white" }}>{sel ? "✓" : ""}</div>
                    {g.label}
                  </div>
                );
              })}
            </div>
            <div className="field-label">Target funding amount</div>
            <select className="field-input" value={profile.fundingAmount} onChange={e => saveProfile({ fundingAmount: e.target.value })}>
              <option value="">Not sure yet</option>
              <option value="under25">Under $25,000</option>
              <option value="25to100">$25,000 – $100,000</option>
              <option value="100to500">$100,000 – $500,000</option>
              <option value="500to1m">$500,000 – $1M</option>
              <option value="over1m">Over $1M</option>
            </select>
          </div>
        )}

        {onboardStep === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: "#1a1a20", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Your business profile</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12 }}>
                <div style={{ color: "#777" }}>Business</div><div style={{ color: "#d0cdc8" }}>{profile.businessName || "—"}</div>
                <div style={{ color: "#777" }}>Industry</div><div style={{ color: "#d0cdc8" }}>{profile.industry || "—"}</div>
                <div style={{ color: "#777" }}>State</div><div style={{ color: "#d0cdc8" }}>{profile.state}</div>
                <div style={{ color: "#777" }}>Funding goals</div><div style={{ color: "#d0cdc8" }}>{(profile.fundingGoals || []).length > 0 ? (profile.fundingGoals || []).join(", ") : "—"}</div>
              </div>
            </div>
            {(profile.certifications || []).length > 0 && (
              <div style={{ background: "#1D9E7512", border: "1px solid #1D9E7530", borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ fontSize: 11, color: "#1D9E75", fontWeight: 600, marginBottom: 6 }}>CERTIFICATIONS YOU MAY QUALIFY FOR</div>
                {(profile.certifications || []).map(c => {
                  const cert = certMap[c];
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

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          {onboardStep > 0 && (
            <button style={{ flex: 1, padding: 11, background: "#1a1a1e", border: "1px solid #2a2a30", borderRadius: 10, color: "#888", fontSize: 14, cursor: "pointer" }}
              onClick={() => setOnboardStep(onboardStep - 1)}>← Back</button>
          )}
          {onboardStep < ONBOARD_STEPS.length - 1 ? (
            <button className="start-btn" style={{ flex: 2 }} disabled={!canAdvance()} onClick={() => setOnboardStep(onboardStep + 1)}>Continue →</button>
          ) : (
            <button className="start-btn" style={{ flex: 2 }} onClick={completeOnboarding}>Launch my dashboard →</button>
          )}
        </div>
      </div>
    </div>
  );
}
