-- BOT (Baked On Time) - Settings & Cleanup
-- Migration: 007_settings_and_cleanup
-- Description: Adds missing settings columns to bakers table.

-- 1. ADD MISSING NOTIFICATION COLUMNS TO BAKERS
ALTER TABLE public.bakers ADD COLUMN IF NOT EXISTS email_leads BOOLEAN DEFAULT TRUE;
ALTER TABLE public.bakers ADD COLUMN IF NOT EXISTS order_updates BOOLEAN DEFAULT TRUE;

-- 2. ADD INDEX FOR REFERRAL CODE (IF NOT ALREADY THERE)
CREATE INDEX IF NOT EXISTS idx_bakers_referral_code ON public.bakers(referral_code);
