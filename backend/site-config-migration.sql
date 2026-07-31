-- ============================================================
-- Metro Cool — Site Config Table Migration
-- Run this script once in the Supabase SQL Editor.
-- ============================================================

-- Generic key-value config table for site-wide settings
CREATE TABLE IF NOT EXISTS site_config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed the installation_within default value
INSERT INTO site_config (key, value)
VALUES ('installation_within', '24 hours')
ON CONFLICT (key) DO NOTHING;

-- Verify
SELECT key, value, updated_at FROM site_config;

-- ============================================================
-- After running:
--   • GET  /api/products/config  → returns { installation_within: "..." }
--   • PUT  /api/products/config  → admin updates the value
--   • All fast_installation products read from this table,
--     not from localStorage (which is tab/browser-local)
-- ============================================================
