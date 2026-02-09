-- BOT (Baked On Time) - Analytics, Surveys & Referrals
-- Migration: 004_analytics_and_surveys

-- 1. Analytics Events (for Daily Reports)
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL, -- 'click', 'page_view', 'design_create', etc.
    page_path TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Daily Survey Responses
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    question_1 TEXT, -- How easy was it to use BOT today? (1-5)
    question_2 TEXT, -- What is the most valuable feature you used?
    question_3 TEXT, -- What one thing would you change?
    value_rating INTEGER, -- Price they would pay (0-1000)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Referrals & Affiliate System
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    referral_code TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'active', 'rewarded')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reward_granted BOOLEAN DEFAULT FALSE
);

-- Add referral_code to bakers table
ALTER TABLE public.bakers ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can insert their own events" ON public.analytics_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can insert their own survey responses" ON public.survey_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Bakers can see their own referral data" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id);
