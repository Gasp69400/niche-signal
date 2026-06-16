-- Colonnes requises pour NicheSignal (rapports IA + dashboard)
ALTER TABLE reports ADD COLUMN IF NOT EXISTS data JSONB;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE reports ALTER COLUMN opportunity_score DROP NOT NULL;
ALTER TABLE reports ALTER COLUMN market_size DROP NOT NULL;
ALTER TABLE reports ALTER COLUMN competition DROP NOT NULL;
ALTER TABLE reports ALTER COLUMN build_difficulty DROP NOT NULL;
ALTER TABLE reports ALTER COLUMN verdict DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reports_data ON reports USING gin (data);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_user_favorites ON reports(user_id, is_favorite, created_at DESC) WHERE is_favorite = true;
