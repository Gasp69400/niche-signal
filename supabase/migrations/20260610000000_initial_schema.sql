-- Rapports d'analyse de marché
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL,
  opportunity_score INTEGER NOT NULL CHECK (opportunity_score >= 0 AND opportunity_score <= 100),
  market_size TEXT NOT NULL,
  competition TEXT NOT NULL,
  build_difficulty TEXT NOT NULL,
  verdict TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pain points liés à un rapport
CREATE TABLE pain_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  intensity INTEGER NOT NULL CHECK (intensity >= 0 AND intensity <= 100),
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Concurrents liés à un rapport
CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  arr_mrr_estimate TEXT NOT NULL,
  founded_year INTEGER NOT NULL,
  rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  price TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_reports_domain ON reports(domain);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_pain_points_report_id ON pain_points(report_id);
CREATE INDEX idx_competitors_report_id ON competitors(report_id);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des rapports"
  ON reports FOR SELECT
  USING (true);

CREATE POLICY "Lecture publique des pain points"
  ON pain_points FOR SELECT
  USING (true);

CREATE POLICY "Lecture publique des concurrents"
  ON competitors FOR SELECT
  USING (true);

CREATE POLICY "Insertion des rapports via service"
  ON reports FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Insertion des pain points via service"
  ON pain_points FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Insertion des concurrents via service"
  ON competitors FOR INSERT
  WITH CHECK (true);
