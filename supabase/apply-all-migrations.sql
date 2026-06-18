-- ============================================================
-- NicheSignal — Toutes les migrations (idempotent)
-- Coller dans Supabase → SQL Editor → Run
-- ============================================================

-- 1) Schéma initial (ignore si tables déjà créées)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL,
  opportunity_score INTEGER CHECK (opportunity_score >= 0 AND opportunity_score <= 100),
  market_size TEXT,
  competition TEXT,
  build_difficulty TEXT,
  verdict TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Cache JSONB (20260611000000_reports_jsonb_cache.sql)
ALTER TABLE reports ADD COLUMN IF NOT EXISTS data JSONB;

ALTER TABLE reports ALTER COLUMN opportunity_score DROP NOT NULL;
ALTER TABLE reports ALTER COLUMN market_size DROP NOT NULL;
ALTER TABLE reports ALTER COLUMN competition DROP NOT NULL;
ALTER TABLE reports ALTER COLUMN build_difficulty DROP NOT NULL;
ALTER TABLE reports ALTER COLUMN verdict DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reports_data ON reports USING gin (data);
CREATE INDEX IF NOT EXISTS idx_reports_domain_created ON reports (domain, created_at DESC);

-- 3) Lien utilisateur (20260612000000_reports_user_id.sql)
ALTER TABLE reports ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id, created_at DESC);

-- 4) Favoris (20260613000000_reports_favorite.sql)
ALTER TABLE reports ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_reports_user_favorites
  ON reports(user_id, is_favorite, created_at DESC)
  WHERE is_favorite = true;

-- 5) Profiles (20260610100000_profiles.sql)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can read own profile'
  ) THEN
    CREATE POLICY "Users can read own profile"
      ON profiles FOR SELECT USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS reports (si pas déjà fait)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reports' AND policyname = 'Lecture publique des rapports'
  ) THEN
    CREATE POLICY "Lecture publique des rapports"
      ON reports FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reports' AND policyname = 'Insertion des rapports via service'
  ) THEN
    CREATE POLICY "Insertion des rapports via service"
      ON reports FOR INSERT WITH CHECK (true);
  END IF;
END $$;
