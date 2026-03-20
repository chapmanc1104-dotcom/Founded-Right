-- ============================================================
-- BizLaunch Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── Enable UUID extension ────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name   TEXT,
  onboarded       BOOLEAN DEFAULT FALSE,
  entity_type     TEXT DEFAULT 'LLC',
  state           TEXT DEFAULT 'MD',
  industry        TEXT,
  stage           TEXT DEFAULT 'pre-revenue',
  owner_name      TEXT,
  contact_email   TEXT,
  contact_phone   TEXT,
  zip_code        TEXT,
  years_in_business TEXT DEFAULT '0',
  employees       TEXT DEFAULT '1',
  annual_revenue  TEXT DEFAULT '0',
  funding_goals   TEXT[] DEFAULT '{}',
  mission_statement TEXT,
  certifications  TEXT[] DEFAULT '{}',
  funding_amount  TEXT,
  demographics    TEXT[] DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ── Checklists ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS checklists (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id      TEXT NOT NULL,
  completed    BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, item_id)
);

ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own checklist"
  ON checklists FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_checklists_user ON checklists(user_id);

-- ── NAICS codes ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS naics_codes (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code             TEXT NOT NULL,
  title            TEXT,
  description      TEXT,
  relevance        TEXT DEFAULT 'primary',
  gov_contract_tip TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, code)
);

ALTER TABLE naics_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own NAICS codes"
  ON naics_codes FOR ALL USING (auth.uid() = user_id);

-- ── Grant cache ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS grant_cache (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  grant_id       TEXT NOT NULL,
  title          TEXT,
  agency         TEXT,
  type           TEXT,
  amount         TEXT,
  deadline       TEXT,
  repayable      BOOLEAN DEFAULT FALSE,
  match_score    INTEGER DEFAULT 0,
  eligibility    TEXT,
  apply_url      TEXT,
  match_reason   TEXT,
  required_steps TEXT[] DEFAULT '{}',
  cached_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, grant_id)
);

ALTER TABLE grant_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own grant cache"
  ON grant_cache FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_grant_cache_user ON grant_cache(user_id);
CREATE INDEX idx_grant_cache_score ON grant_cache(user_id, match_score DESC);

-- ── Chat messages ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own chat"
  ON chat_messages FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_chat_user ON chat_messages(user_id, created_at);

-- ── Applications tracker ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_name   TEXT NOT NULL,
  type           TEXT DEFAULT 'Grant',
  agency         TEXT,
  amount_requested TEXT,
  amount_awarded   TEXT,
  status         TEXT DEFAULT 'researching'
                 CHECK (status IN ('researching','drafting','submitted','under_review','awarded','declined','withdrawn')),
  deadline       TEXT,
  submitted_at   TIMESTAMPTZ,
  decision_at    TIMESTAMPTZ,
  notes          TEXT,
  apply_url      TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own applications"
  ON applications FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_applications_user ON applications(user_id, created_at DESC);

-- ── Auto-create profile on signup ────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, contact_email, owner_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Updated_at trigger ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Done! All tables created with Row Level Security enabled.
-- Each user can only read/write their own data.
-- ============================================================
