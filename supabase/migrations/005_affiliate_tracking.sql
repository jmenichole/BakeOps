-- BOT (Baked On Time) - Affiliate Tracking
-- Migration: 005_affiliate_tracking
-- Description: Adds affiliate/referral tracking tables and columns

-- Add referral_code column to bakers table if it doesn't exist
ALTER TABLE public.bakers ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- Create referrals table for tracking signups and rewards
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES public.bakers(id) ON DELETE CASCADE,
    referred_email TEXT NOT NULL,
    referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    referral_code TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'active', 'rewarded')) DEFAULT 'pending',
    reward_months INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    activated_at TIMESTAMPTZ,
    UNIQUE(referrer_id, referred_email)
);

-- Create referral_clicks table for tracking link clicks
CREATE TABLE IF NOT EXISTS public.referral_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referral_code TEXT NOT NULL,
    referrer_id UUID REFERENCES public.bakers(id) ON DELETE SET NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_clicks ENABLE ROW LEVEL SECURITY;

-- Referrals policies
CREATE POLICY "Bakers can view their own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "System can insert referrals" ON public.referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Bakers can update their referrals status" ON public.referrals FOR UPDATE USING (auth.uid() = referrer_id);

-- Referral clicks policies (mostly for analytics, less restrictive)
CREATE POLICY "Anyone can insert clicks" ON public.referral_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Bakers can view clicks for their code" ON public.referral_clicks FOR SELECT USING (auth.uid() = referrer_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_referral_code ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_clicks_code ON public.referral_clicks(referral_code);
