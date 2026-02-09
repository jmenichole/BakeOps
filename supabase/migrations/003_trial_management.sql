-- BOT (Baked On Time) - Trial Management
-- Migration: 003_trial_management

ALTER TABLE public.bakers 
ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ DEFAULT NOW();

-- Update existing trial_ends_at to be 14 days after started_at if null
UPDATE public.bakers 
SET trial_ends_at = trial_started_at + INTERVAL '14 days'
WHERE trial_ends_at IS NULL;
