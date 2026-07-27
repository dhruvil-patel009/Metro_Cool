-- ============================================================
-- Metro Cool — Referral System Migration
-- Run this entire script in Supabase SQL Editor once.
-- ============================================================

-- STEP 1: Drop old CHECK constraints that block new values
ALTER TABLE referral_rewards
  DROP CONSTRAINT IF EXISTS referral_rewards_reward_type_check;

ALTER TABLE referral_rewards
  DROP CONSTRAINT IF EXISTS referral_rewards_reward_status_check;

ALTER TABLE referral_rewards
  DROP CONSTRAINT IF EXISTS chk_reward_type;

ALTER TABLE referral_rewards
  DROP CONSTRAINT IF EXISTS chk_reward_status;


-- STEP 2: Add new CHECK constraints that allow both old AND new values
ALTER TABLE referral_rewards
  ADD CONSTRAINT referral_rewards_reward_type_check
  CHECK (reward_type IN ('commission_discount', 'cash_credit'));

ALTER TABLE referral_rewards
  ADD CONSTRAINT referral_rewards_reward_status_check
  CHECK (reward_status IN ('active', 'pending', 'used', 'credited'));


-- STEP 3: Normalise existing rows (old values → new values)
UPDATE referral_rewards
SET reward_status = 'pending',
    reward_type   = 'cash_credit',
    reward_value  = 400
WHERE reward_status = 'active';

UPDATE referral_rewards
SET reward_status = 'credited',
    reward_type   = 'cash_credit',
    reward_value  = 400
WHERE reward_status = 'used';


-- STEP 4: Insert the MISSING row for ABC DSD
-- (registered 25 Jul 2026, phone 1547854236, used code BRE87CD1)
INSERT INTO referral_rewards (
  referrer_id,
  referred_id,
  referral_code_id,
  reward_type,
  reward_value,
  reward_status,
  jobs_remaining
)
SELECT
  '072fff61-0c92-4ad9-bf91-526e15fd234c',   -- referrer (BRE87CD1 owner)
  p.id,                                      -- referred (ABC DSD)
  '942781b5-e925-4fe0-bf04-16244dd29ac3',   -- referral_codes row id
  'cash_credit',
  400,
  'pending',
  3
FROM profiles p
WHERE p.phone = '1547854236'
  AND NOT EXISTS (
    SELECT 1 FROM referral_rewards rr
    WHERE rr.referred_id = p.id
  );


-- STEP 5: Backfill past completed jobs for ABC DSD
-- ABC DSD already completed 1 job before the reward row existed.
-- Count how many jobs they completed BEFORE the reward was created,
-- and subtract that from jobs_remaining so the counter is accurate.
UPDATE referral_rewards rr
SET jobs_remaining = GREATEST(
  0,
  3 - (
    SELECT COUNT(*)::int
    FROM bookings b
    WHERE b.technician_id = rr.referred_id
      AND b.job_status = 'completed'
  )
)
WHERE rr.referred_id = (
  SELECT id FROM profiles WHERE phone = '1547854236'
);


-- STEP 6: Verify — should show 2 rows with correct jobs_remaining
SELECT
  rr.id,
  p.first_name || ' ' || p.last_name AS referred_name,
  rr.reward_status,
  rr.reward_value,
  rr.jobs_remaining,
  (
    SELECT COUNT(*)
    FROM bookings b
    WHERE b.technician_id = rr.referred_id
      AND b.job_status = 'completed'
  ) AS actual_completed_jobs,
  rr.created_at
FROM referral_rewards rr
LEFT JOIN profiles p ON p.id = rr.referred_id
WHERE rr.referrer_id = '072fff61-0c92-4ad9-bf91-526e15fd234c'
ORDER BY rr.created_at;

-- ============================================================
-- Expected result:
--   Dhruviltechnician Patel  |  pending  |  400  |  3  |  0 completed
--   ABC DSD                  |  pending  |  400  |  2  |  1 completed
-- ============================================================
