-- Cache JSONB pour les rapports d'analyse IA
ALTER TABLE reports ADD COLUMN IF NOT EXISTS data JSONB;

-- Permettre les insertions jsonb-only (colonnes legacy optionnelles)
ALTER TABLE reports ALTER COLUMN opportunity_score DROP NOT NULL;
ALTER TABLE reports ALTER COLUMN market_size DROP NOT NULL;
ALTER TABLE reports ALTER COLUMN competition DROP NOT NULL;
ALTER TABLE reports ALTER COLUMN build_difficulty DROP NOT NULL;
ALTER TABLE reports ALTER COLUMN verdict DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reports_data ON reports USING gin (data);
CREATE INDEX IF NOT EXISTS idx_reports_domain_created ON reports (domain, created_at DESC);
