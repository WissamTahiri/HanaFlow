-- Migration 004 : Colonne plan d'abonnement sur les utilisateurs
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS plan VARCHAR(20) NOT NULL DEFAULT 'free';

-- Index pour requêtes admin (filtrer par plan)
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);
