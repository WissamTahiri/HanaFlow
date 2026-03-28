-- Migration 003 : Table de progression par module SAP
CREATE TABLE IF NOT EXISTS user_progress (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module     VARCHAR(20)  NOT NULL,
  visited_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, module)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
