ALTER TABLE reports ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_reports_user_favorites
  ON reports(user_id, is_favorite, created_at DESC)
  WHERE is_favorite = true;
