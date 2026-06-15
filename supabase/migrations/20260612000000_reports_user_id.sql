-- Lier les rapports aux utilisateurs pour le dashboard
ALTER TABLE reports ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id, created_at DESC);
