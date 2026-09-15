/**
 * Privacy Policy, Terms of Service and Contact pages.
 *
 * These are served at real paths (/privacy, /terms, /contact) because Google
 * OAuth verification requires a reachable privacy policy URL, and because the
 * footer previously linked to nothing.
 *
 * NOTE FOR THE OPERATOR: this is a good-faith draft describing what the
 * application actually does with user data. It has not been reviewed by a
 * lawyer. Have counsel review it before launch, and update LEGAL_CONTACT and
 * BUSINESS_ENTITY below to your real details.
 */

import { useEffect } from "react";

/** The mailbox shown to users. This must be a real, monitored address. */
export const LEGAL_CONTACT = "support@foundedright.co";

/** Legal name of the operating entity. Update before launch. */
export const BUSINESS_ENTITY = "FoundedRight";

/** Date the current terms took effect. Update whenever the text changes. */
export const LEGAL_EFFECTIVE_DATE = "September 15, 2026";

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "#fff",
  color: "#334155",
  fontFamily: "Inter, sans-serif",
};
const wrap: React.CSSProperties = {
  maxWidth: 760,
  margin: "0 auto",
  padding: "48px 20px 80px",
};
const h1: React.CSSProperties = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
  fontWeight: 800,
  color: "#1B3A6B",
  marginBottom: 8,
};
const h2: React.CSSProperties = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: 19,
  fontWeight: 700,
  color: "#1B3A6B",
  marginTop: 32,
  marginBottom: 10,
};
const p: React.CSSProperties = { fontSize: 15, lineHeight: 1.7, marginBottom: 14 };
const li: React.CSSProperties = { fontSize: 15, lineHeight: 1.7, marginBottom: 8 };
const ul: React.CSSProperties = { paddingLeft: 22, marginBottom: 14, listStyle: "disc" };
const meta: React.CSSProperties = { fontSize: 13, color: "#64748B", marginBottom: 32 };

function LegalShell({ title, children }: { title: string; children: React.ReactNode }) {
  // index.html carries one static title; set a specific one per page so search
  // results and browser tabs identify them correctly.
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} — Founded Right`;
    return () => {
      document.title = previous;
    };
  }, [title]);

  return (
    <div style={page}>
      <div style={wrap}>
        <a
          href="/"
          style={{
            fontSize: 14,
            color: "#2D5BE3",
            textDecoration: "none",
            fontWeight: 600,
            display: "inline-block",
            marginBottom: 28,
          }}
        >
          ← Back to FoundedRight
        </a>
        <h1 style={h1}>{title}</h1>
        <div style={meta}>Effective {LEGAL_EFFECTIVE_DATE}</div>
        {children}
        <div
          style={{
            marginTop: 48,
            paddingTop: 20,
            borderTop: "1px solid #E2E8F0",
            fontSize: 13,
            color: "#64748B",
          }}
        >
          Questions? Email{" "}
          <a href={`mailto:${LEGAL_CONTACT}`} style={{ color: "#2D5BE3" }}>
            {LEGAL_CONTACT}
          </a>
          .
        </div>
      </div>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <LegalShell title="Privacy Policy">
      <p style={p}>
        This policy explains what {BUSINESS_ENTITY} collects when you use
        foundedright.co, why we collect it, and what control you have over it.
      </p>

      <h2 style={h2}>What we collect</h2>
      <ul style={ul}>
        <li style={li}>
          <strong>Account information.</strong> Your email address, and — if you
          sign in with Google — the name and profile image on your Google
          account. Passwords are handled by our authentication provider and are
          never stored by us in readable form.
        </li>
        <li style={li}>
          <strong>Business profile.</strong> Whatever you enter during
          onboarding and in settings: business name, entity type, state, ZIP
          code, industry, owner name, contact email and phone, years in
          business, employee count, annual revenue range, mission statement,
          certifications, funding goals, and NAICS codes.
        </li>
        <li style={li}>
          <strong>Your activity in the product.</strong> Which checklist items
          you have completed and the grant, loan, and contract applications you
          track.
        </li>
        <li style={li}>
          <strong>Messages to the AI assistant.</strong> The questions you ask
          and the replies you receive.
        </li>
        <li style={li}>
          <strong>Server logs.</strong> Standard request logs including IP
          address, timestamp, and the endpoint accessed, kept for security and
          debugging.
        </li>
      </ul>
      <p style={p}>
        We do not ask for your Social Security number, EIN, bank account
        details, or tax documents, and you should not enter them. The checklist
        tracks whether you have completed a step — it does not store the
        underlying documents.
      </p>

      <h2 style={h2}>How we use it</h2>
      <ul style={ul}>
        <li style={li}>To create and secure your account.</li>
        <li style={li}>
          To personalize your checklist, funding matches, NAICS suggestions, and
          capability statement.
        </li>
        <li style={li}>
          To give the AI assistant context about your business so its answers
          are specific to you.
        </li>
        <li style={li}>To operate, debug, and protect the service from abuse.</li>
      </ul>
      <p style={p}>
        We do not sell your personal information, and we do not share it with
        advertisers.
      </p>

      <h2 style={h2}>Who we share it with</h2>
      <p style={p}>We use a small number of service providers to run the product:</p>
      <ul style={ul}>
        <li style={li}>
          <strong>Supabase</strong> — authentication (your email and login
          credentials).
        </li>
        <li style={li}>
          <strong>Anthropic</strong> — powers the AI assistant, NAICS finder,
          funding matches, and capability statement generator. When you use one
          of these features, the relevant parts of your business profile and
          your message are sent to Anthropic's API to produce a response.
          Anthropic does not use data submitted through its API to train its
          models.
        </li>
        <li style={li}>
          <strong>Replit</strong> — application hosting and the PostgreSQL
          database where your profile, checklist, and applications are stored.
        </li>
        <li style={li}>
          <strong>Google</strong> — only if you choose to sign in with Google.
        </li>
      </ul>
      <p style={p}>
        We may also disclose information if we are legally required to, or to
        investigate abuse of the service.
      </p>

      <h2 style={h2}>Your choices</h2>
      <ul style={ul}>
        <li style={li}>
          <strong>See and correct your data.</strong> Your profile is editable
          in Settings at any time.
        </li>
        <li style={li}>
          <strong>Delete your account.</strong> Settings → Delete account
          permanently removes your profile, checklist progress, tracked
          applications, and your login. This cannot be undone.
        </li>
        <li style={li}>
          <strong>Ask us anything about your data.</strong> Email{" "}
          <a href={`mailto:${LEGAL_CONTACT}`} style={{ color: "#2D5BE3" }}>
            {LEGAL_CONTACT}
          </a>{" "}
          and we will respond within 30 days.
        </li>
      </ul>
      <p style={p}>
        Depending on where you live, you may have additional rights — for
        example, California residents have rights under the CCPA to know what
        personal information we collect and to request its deletion. We honor
        these requests from anyone who asks, regardless of location.
      </p>

      <h2 style={h2}>Retention</h2>
      <p style={p}>
        We keep your information for as long as your account is open. When you
        delete your account, your profile, checklist, and applications are
        removed immediately. Server logs are retained for a short period and
        then discarded.
      </p>

      <h2 style={h2}>Security</h2>
      <p style={p}>
        Traffic is encrypted in transit. Access to your data requires your
        authenticated session. No system is perfectly secure, so please use a
        strong, unique password.
      </p>

      <h2 style={h2}>Children</h2>
      <p style={p}>
        The service is for business owners and is not directed at anyone under
        18. We do not knowingly collect information from children.
      </p>

      <h2 style={h2}>Changes</h2>
      <p style={p}>
        If we make a material change to this policy we will update the effective
        date above and notify account holders by email.
      </p>
    </LegalShell>
  );
}

export function TermsOfService() {
  return (
    <LegalShell title="Terms of Service">
      <p style={p}>
        By creating an account or using foundedright.co, you agree to these
        terms. If you do not agree, please do not use the service.
      </p>

      <h2 style={h2}>What FoundedRight is</h2>
      <p style={p}>
        {BUSINESS_ENTITY} is an organizational tool. It gives you a structured
        checklist for setting up a business, helps you track applications and
        deadlines, and uses AI to suggest NAICS codes, surface funding programs,
        and draft a capability statement.
      </p>

      <h2 style={h2}>What FoundedRight is not</h2>
      <p style={p}>
        <strong>
          We are not a law firm, an accounting firm, a lender, a grant writer,
          or a government agency, and nothing in the product is legal, tax,
          financial, or professional advice.
        </strong>{" "}
        We are not affiliated with the SBA, the IRS, FinCEN, SAM.gov,
        Grants.gov, or any other government body.
      </p>
      <p style={p}>
        Checklist guidance, deadlines, eligibility rules, and funding
        opportunities are provided for general information only. Rules change
        frequently and vary by state and industry. Verify anything you intend to
        act on with the official source or a qualified professional before you
        rely on it.
      </p>

      <h2 style={h2}>AI-generated content</h2>
      <p style={p}>
        Several features generate content using AI. AI output can be incomplete,
        out of date, or simply wrong — including program names, award amounts,
        deadlines, eligibility requirements, and links. Treat every AI-generated
        result as a starting point for your own research, never as a verified
        fact. You are responsible for checking anything you submit to a lender,
        an agency, or a grantor.
      </p>
      <p style={p}>
        We make no guarantee that you will receive funding, win a contract, or
        obtain any certification as a result of using this service.
      </p>

      <h2 style={h2}>Your account</h2>
      <ul style={ul}>
        <li style={li}>
          You must be at least 18 and provide accurate information.
        </li>
        <li style={li}>
          You are responsible for keeping your password confidential and for
          activity under your account.
        </li>
        <li style={li}>One person or business per account.</li>
      </ul>

      <h2 style={h2}>Acceptable use</h2>
      <p style={p}>You agree not to:</p>
      <ul style={ul}>
        <li style={li}>
          Use the AI features for anything unrelated to operating your business,
          or attempt to repurpose them as a general-purpose AI service.
        </li>
        <li style={li}>
          Attempt to bypass rate limits, scrape the service, or access another
          user's data.
        </li>
        <li style={li}>
          Upload unlawful content or use the service to break the law.
        </li>
        <li style={li}>Resell or redistribute the service without permission.</li>
      </ul>
      <p style={p}>
        AI features are subject to usage limits. We may suspend or close an
        account that abuses the service.
      </p>

      <h2 style={h2}>Cost</h2>
      <p style={p}>
        The service is currently free to use. If we introduce paid plans in the
        future, we will give existing account holders notice before any charge
        applies, and you will never be billed without agreeing first.
      </p>

      <h2 style={h2}>Your content</h2>
      <p style={p}>
        You keep ownership of everything you enter. You grant us permission to
        store and process it solely to operate the service for you, as described
        in the Privacy Policy.
      </p>

      <h2 style={h2}>Availability</h2>
      <p style={p}>
        The service is provided "as is," without warranties of any kind. We do
        not promise it will be uninterrupted or error-free, and we may change or
        discontinue features.
      </p>

      <h2 style={h2}>Limitation of liability</h2>
      <p style={p}>
        To the fullest extent permitted by law, {BUSINESS_ENTITY} is not liable
        for indirect, incidental, or consequential damages, including lost
        profits, missed deadlines, rejected applications, or funding not
        received, arising from your use of the service.
      </p>

      <h2 style={h2}>Ending your account</h2>
      <p style={p}>
        You can delete your account at any time in Settings. We may suspend or
        terminate an account that violates these terms.
      </p>

      <h2 style={h2}>Changes</h2>
      <p style={p}>
        We may update these terms. Material changes will be announced by email
        and reflected in the effective date above. Continuing to use the service
        after a change means you accept the updated terms.
      </p>
    </LegalShell>
  );
}

export function ContactPage() {
  return (
    <LegalShell title="Contact">
      <p style={p}>
        The fastest way to reach us is email. We read everything and aim to
        reply within two business days.
      </p>

      <div
        style={{
          background: "#EFF6FF",
          border: "1px solid #BFDBFE",
          borderRadius: 12,
          padding: "20px 22px",
          marginTop: 24,
          marginBottom: 28,
        }}
      >
        <div style={{ fontSize: 13, color: "#1B3A6B", fontWeight: 700, marginBottom: 6 }}>
          Email
        </div>
        <a
          href={`mailto:${LEGAL_CONTACT}`}
          style={{ fontSize: 18, color: "#2D5BE3", fontWeight: 600, textDecoration: "none" }}
        >
          {LEGAL_CONTACT}
        </a>
      </div>

      <h2 style={h2}>What we can help with</h2>
      <ul style={ul}>
        <li style={li}>Trouble signing in or resetting your password.</li>
        <li style={li}>Questions about your data, or a deletion request.</li>
        <li style={li}>
          A checklist step or funding result that looks wrong — please tell us,
          it helps everyone.
        </li>
        <li style={li}>Feedback and feature requests.</li>
      </ul>

      <h2 style={h2}>What we cannot help with</h2>
      <p style={p}>
        We cannot give legal, tax, or financial advice, review your grant
        application, or tell you whether you qualify for a specific program. For
        those, talk to a qualified professional or contact the administering
        agency directly. Free help is also available from your local{" "}
        <a
          href="https://www.sba.gov/local-assistance"
          target="_blank"
          rel="noreferrer noopener"
          style={{ color: "#2D5BE3" }}
        >
          SBA resource partner
        </a>{" "}
        — SBDCs, SCORE, and Women's Business Centers offer free counseling to
        small business owners.
      </p>
    </LegalShell>
  );
}
