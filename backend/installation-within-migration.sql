-- ============================================================
-- Metro Cool — Installation Within Timeline Migration
-- Run this script once in the Supabase SQL Editor.
-- ============================================================

-- Add installation_within column to products table.
-- Stores the per-product installation timeline label.
-- NULL means "use the global setting from admin config".
-- Allowed values: '24 hours', '1 day', '2 days', '3 days',
--                 '4 days', '5 days', '6 days', '7 days'
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS installation_within TEXT;

-- Verify
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products' AND column_name = 'installation_within';

-- ============================================================
-- After running:
--   • NULL → product inherits the global installation_within
--     setting set on the admin Products page.
--   • Non-null → product shows its own specific timeline.
--   • Only products with fast_installation = true display
--     the "Installation within X" badge.
-- ============================================================
