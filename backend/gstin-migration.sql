-- ============================================================
-- Metro Cool — Customer GSTIN Migration
-- Run this script once in the Supabase SQL Editor.
-- Adds customer_gstin (optional) to orders and payments tables.
-- ============================================================

-- orders table: store GST number provided at checkout
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS customer_gstin TEXT;

-- payments table: store GST number at time of payment for invoice audit
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS customer_gstin TEXT;

-- Verify columns were added
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('orders', 'payments')
  AND column_name = 'customer_gstin'
ORDER BY table_name;

-- ============================================================
-- After running:
--   • Both columns default to NULL — no existing rows affected
--   • customer_gstin is passed in from checkout when the user
--     voluntarily provides their GST number (for B2B invoicing)
--   • The value flows into the PDF invoice "BILLED TO" section
-- ============================================================
