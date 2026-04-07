-- Migration 005 : Gamification persistée (XP, badges, streaks)
CREATE TABLE IF NOT EXISTS user_gamification (
  user_id      INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  xp           INTEGER      NOT NULL DEFAULT 0,
  badges       TEXT[]       NOT NULL DEFAULT '{}',
  streak       INTEGER      NOT NULL DEFAULT 0,
  last_login   DATE,
  quiz_pass_count INTEGER   NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
