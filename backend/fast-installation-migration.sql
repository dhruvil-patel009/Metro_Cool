-- ============================================================
-- Metro Cool — Fast Installation Column Migration
-- Run this script in the Supabase SQL Editor once.
-- ============================================================

-- Add fast_installation boolean column to products table.
-- Defaults to FALSE so all existing products are unaffected.
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS fast_installation BOOLEAN NOT NULL DEFAULT FALSE;

-- Verify the column was added
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'products' AND column_name = 'fast_installation';

-- ============================================================
-- After running:
--   • Existing products → fast_installation = false
--     (InstallationCharges section + Fast Install badge hidden)
--   • Enable per-product via admin → Edit Product → Fast Installation toggle
-- ============================================================
