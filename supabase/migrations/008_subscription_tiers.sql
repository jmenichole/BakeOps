-- BakeBot - Subscription Tiers
-- Migration: 008_subscription_tiers

ALTER TABLE public.bakers 
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'trial' CHECK (plan_type IN ('trial', 'monthly', 'lifetime')),
ADD COLUMN IF NOT EXISTS subscription_id TEXT;

-- Index for faster profile lookups by plan
CREATE INDEX IF NOT EXISTS idx_bakers_plan ON public.bakers(plan_type);
