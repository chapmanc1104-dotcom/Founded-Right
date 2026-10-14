// Curated list of FEDERAL funding and contracting programs.
//
// Rules for editing this file:
//  - Only add a program after reading its official page. Copy facts (amounts,
//    eligibility) from that page; leave a field out rather than guessing.
//  - Put the page you read in `sourceUrl` and today's date in `lastVerified`.
//  - Run `pnpm --filter @workspace/api-server run check:funding` to verify links.
//  - Entries not re-verified within 90 days are flagged "needs re-check" in the
//    app and hidden after 180 days (see routes/funding.ts).

export type ProgramType = "Loan" | "Grant" | "Certification" | "Registration" | "Counseling";

export interface FederalProgram {
  id: string;
  title: string;
  type: ProgramType;
  agency: string;
  summary: string;
  /** Only set when the agency publishes a figure. */
  amount?: string;
  /** How/when to apply, as described by the agency. */
  timing: string;
  /** Eligibility/requirements as stated on the official page. */
  requirements: string[];
  applyUrl: string;
  sourceUrl: string;
  lastVerified: string; // YYYY-MM-DD
  /** Profile certification ids (see CERT_OPTIONS) that qualify an owner. */
  certs?: string[];
  /** Funding-goal ids (see GOAL_OPTIONS) this program serves. */
  goals?: string[];
  /** Industries (profile.industry values) where this program is most relevant. */
  industries?: string[];
  /** Checklist item ids that should be done before applying. */
  needs: string[];
}

export const FEDERAL_NOTICES: string[] = [
  "SBA does not provide grants for starting or expanding a business. SBA grants go to nonprofits, resource partners and educational organizations (source: sba.gov/loans/additional-funding-opportunities/grants, checked 2026-10-14). Be cautious of anyone offering a \"government grant\" for your business: SBA only emails from addresses ending in @sba.gov.",
];

export const FEDERAL_PROGRAMS: FederalProgram[] = [
  {
    id: "sba-7a",
    title: "SBA 7(a) Loan",
    type: "Loan",
    agency: "U.S. Small Business Administration",
    summary: "SBA's primary business loan program. SBA guarantees loans made by participating lenders for working capital, equipment, real estate, refinancing and changes of ownership.",
    amount: "Up to $5 million",
    timing: "Apply through an SBA-approved lender",
    requirements: ["Operating business", "Operates for profit", "Located in the U.S.", "Small under SBA size standards", "Not an ineligible type of business"],
    applyUrl: "https://www.sba.gov/loans/7a-loans/",
    sourceUrl: "https://www.sba.gov/loans/7a-loans/",
    lastVerified: "2026-10-14",
    goals: ["sba_loans", "bank_loans"],
    needs: ["ein", "bizplan", "taxreturns", "balsheet", "personalcredit"],
  },
  {
    id: "sba-504",
    title: "SBA 504 Loan",
    type: "Loan",
    agency: "U.S. Small Business Administration",
    summary: "Long-term, fixed-rate financing for major fixed assets that promote business growth and job creation, originated by Certified Development Companies (CDCs) together with a senior lender.",
    amount: "Up to $5.5 million",
    timing: "Apply through a Certified Development Company (CDC)",
    requirements: ["Operating business", "Operates for profit", "Located in the U.S.", "Small under SBA size standards", "Feasible business plan and ability to repay", "Not for nonprofit, passive or speculative activities"],
    applyUrl: "https://www.sba.gov/loans/504-loans/",
    sourceUrl: "https://www.sba.gov/loans/504-loans/",
    lastVerified: "2026-10-14",
    goals: ["sba_loans"],
    needs: ["ein", "bizplan", "taxreturns", "balsheet"],
  },
  {
    id: "sba-microloan",
    title: "SBA Microloan",
    type: "Loan",
    agency: "U.S. Small Business Administration",
    summary: "Small loans made through nonprofit, community-based intermediary lenders funded by SBA, for start-up and expansion costs such as working capital, inventory, supplies and equipment.",
    amount: "Up to $50,000 (average about $13,000)",
    timing: "Apply through an SBA microlender (intermediary)",
    requirements: ["Operating business", "Operates for profit", "Located in the U.S.", "Small under SBA size standards", "Cannot be used to pay existing debts or buy real estate"],
    applyUrl: "https://www.sba.gov/loans/microloans/",
    sourceUrl: "https://www.sba.gov/loans/microloans/",
    lastVerified: "2026-10-14",
    goals: ["sba_loans"],
    needs: ["ein", "bizplan"],
  },
  {
    id: "sba-8a",
    title: "SBA 8(a) Business Development Program",
    type: "Certification",
    agency: "U.S. Small Business Administration",
    summary: "Certification that lets eligible firms receive set-aside and sole-source federal contracts, plus business development assistance and mentorship, for a nine-year term.",
    timing: "Apply through SBA Certifications",
    requirements: ["Small business under SBA size standards", "Owned and controlled by socially and economically disadvantaged individuals", "Demonstrate good character and potential for success", "Individuals may participate only once in their lifetime"],
    applyUrl: "https://www.sba.gov/certifications/",
    sourceUrl: "https://www.sba.gov/certifications/",
    lastVerified: "2026-10-14",
    certs: ["disadvantaged", "minority"],
    goals: ["gov_contracts"],
    needs: ["sbasize", "naics", "sba8a"],
  },
  {
    id: "sba-wosb",
    title: "Women-Owned Small Business (WOSB) Federal Contract Program",
    type: "Certification",
    agency: "U.S. Small Business Administration",
    summary: "Certification that makes a business eligible for federal contracts set aside for women-owned small businesses in industries (NAICS codes) where WOSBs are underrepresented. Some are limited to economically disadvantaged WOSBs (EDWOSB). Benefits apply to federal contracting only.",
    timing: "Apply through SBA Certifications",
    requirements: ["Small business under SBA size standards", "At least 51% owned and controlled by women who are U.S. citizens", "Women manage day-to-day operations and make long-term decisions", "Contracts only available in SBA's eligible NAICS codes"],
    applyUrl: "https://www.sba.gov/certifications/",
    sourceUrl: "https://www.sba.gov/certifications/",
    lastVerified: "2026-10-14",
    certs: ["woman"],
    goals: ["gov_contracts"],
    needs: ["sam", "uei", "naics", "sbasize", "wosb"],
  },
  {
    id: "sba-hubzone",
    title: "HUBZone Program",
    type: "Certification",
    agency: "U.S. Small Business Administration",
    summary: "Certification for small businesses in historically underutilized business zones: eligible for HUBZone set-aside contracts and a 10% price evaluation preference in full and open competitions. Recertify every three years.",
    timing: "Apply through SBA Certifications",
    requirements: ["Small business under SBA size standards", "At least 51% owned and controlled by U.S. citizens (or a CDC, agricultural cooperative, Alaska Native corporation, Native Hawaiian organization or tribe)", "Principal office located in a HUBZone", "At least 35% of employees live in a HUBZone", "Check the HUBZone map (designations are updating in 2026)"],
    applyUrl: "https://www.sba.gov/certifications/",
    sourceUrl: "https://www.sba.gov/certifications/",
    lastVerified: "2026-10-14",
    certs: ["hubzone"],
    goals: ["gov_contracts"],
    needs: ["sam", "uei", "sbasize", "hubzone"],
  },
  {
    id: "sba-vetcert",
    title: "Veteran Small Business Certification (VetCert) / SDVOSB",
    type: "Certification",
    agency: "U.S. Small Business Administration",
    summary: "Veteran-owned small businesses can be certified by SBA to compete for federal contracts; certified service-disabled veteran-owned small businesses (SDVOSBs) can compete for federal sole-source and set-aside contracts.",
    timing: "Apply through SBA (VetCert)",
    requirements: ["Veteran-owned small business (VOSB) or service-disabled veteran-owned small business (SDVOSB)", "Small under SBA size standards", "See the SBA veterans page for the current VetCert requirements"],
    applyUrl: "https://www.sba.gov/veterans/",
    sourceUrl: "https://www.sba.gov/veterans/",
    lastVerified: "2026-10-14",
    certs: ["veteran", "disabled_vet"],
    goals: ["gov_contracts"],
    needs: ["sam", "uei", "sbasize", "vosb"],
  },
  {
    id: "sbir-sttr",
    title: "SBIR / STTR (America's Seed Fund)",
    type: "Grant",
    agency: "Participating federal agencies, sponsored by SBA",
    summary: "Technology-focused funding for startups and small businesses to develop ideas toward commercialization. Each participating agency runs its own SBIR/STTR program and solicitations.",
    amount: "Varies by agency. As of April 2026, agencies may award up to $323,090 (Phase I) and $2,153,927 (Phase II) without an SBA waiver",
    timing: "Varies by agency solicitation. Check each agency's schedule on sbir.gov",
    requirements: ["Small business", "Research and development / technology focus", "Requirements and topics are set by each participating agency"],
    applyUrl: "https://www.sbir.gov/",
    sourceUrl: "https://www.sbir.gov/about",
    lastVerified: "2026-10-14",
    goals: ["grants"],
    industries: ["Technology / Software", "Healthcare / Medical", "Manufacturing", "Education / Training"],
    needs: ["sam", "uei", "execsummary", "budget", "sbir"],
  },
  {
    id: "sam-registration",
    title: "SAM.gov Entity Registration",
    type: "Registration",
    agency: "U.S. General Services Administration",
    summary: "Registration is required to apply for federal awards as a prime awardee: it allows you to bid on government contracts and apply for federal assistance, and assigns your Unique Entity ID. Not needed if you will not apply directly for awards.",
    timing: "Register at SAM.gov",
    requirements: ["Required to bid on federal contracts or apply for federal assistance as a prime", "Provides your Unique Entity ID (UEI)"],
    applyUrl: "https://sam.gov/entity-registration",
    sourceUrl: "https://sam.gov/entity-registration",
    lastVerified: "2026-10-14",
    goals: ["gov_contracts", "grants"],
    needs: ["ein"],
  },
  {
    id: "grants-gov",
    title: "Grants.gov",
    type: "Registration",
    agency: "U.S. Department of Health and Human Services (Grants.gov program)",
    summary: "The central federal site to find and apply for federal grant opportunities. Most grants are for organizations such as nonprofits, schools and research institutions rather than for-profit startups, so check each notice's eligibility.",
    timing: "Search open opportunities and register to apply",
    requirements: ["Check each funding notice's eligibility section", "A SAM.gov registration is needed to apply for federal assistance as a prime applicant"],
    applyUrl: "https://www.grants.gov/",
    sourceUrl: "https://www.grants.gov/learn-grants/grants-101",
    lastVerified: "2026-10-14",
    goals: ["grants"],
    needs: ["sam", "uei", "grantsgov"],
  },
  {
    id: "sba-sbdc",
    title: "Small Business Development Centers (SBDCs)",
    type: "Counseling",
    agency: "U.S. Small Business Administration",
    summary: "Local counseling and training for starting, running or growing a business, including help preparing for loan and contracting applications. SBA also lists SCORE mentors, Women's Business Centers and Veterans Business Outreach Centers on the same page.",
    timing: "Find a center near you",
    requirements: ["Contact your local center for services, cost and eligibility"],
    applyUrl: "https://www.sba.gov/counseling/local-assistance/resource-partners/",
    sourceUrl: "https://www.sba.gov/counseling/local-assistance/resource-partners/",
    lastVerified: "2026-10-14",
    goals: ["sba_loans", "grants", "gov_contracts", "bank_loans", "investors", "state_grants"],
    needs: [],
  },
];
