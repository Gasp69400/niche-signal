CREATE TABLE IF NOT EXISTS monthly_opportunity_editions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  data JSONB NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (year, month)
);

CREATE INDEX IF NOT EXISTS idx_monthly_opportunity_editions_period
  ON monthly_opportunity_editions (year DESC, month DESC);

ALTER TABLE monthly_opportunity_editions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'monthly_opportunity_editions'
      AND policyname = 'Lecture publique des éditions mensuelles'
  ) THEN
    CREATE POLICY "Lecture publique des éditions mensuelles"
      ON monthly_opportunity_editions FOR SELECT USING (true);
  END IF;
END $$;
