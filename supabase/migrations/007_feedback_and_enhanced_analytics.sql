-- BOT (Baked On Time) - Feedback & Enhanced Analytics
-- Migration: 007_feedback_and_enhanced_analytics

-- 1. Feedback Table
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    category TEXT CHECK (category IN ('bug', 'feature_request', 'ui_ux', 'other')) DEFAULT 'other',
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    page_url TEXT,
    browser_info JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enhance Analytics Events for Heatmaps and Dead Clicks
-- Note: We already have analytics_events, but we need to ensure it has the right columns.
-- The existing table has: id, user_id, event_type, page_path, metadata, created_at.
-- We'll use 'metadata' for x, y coordinates and element info, but we can add explicit columns for better performance.

ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS x_pos INTEGER;
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS y_pos INTEGER;
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS element_tag TEXT;
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS element_text TEXT;
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS is_dead_click BOOLEAN DEFAULT FALSE;

-- 3. Enable RLS and Policies
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own feedback" ON public.feedback FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Admins can read all feedback" ON public.feedback FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role' OR EXISTS (
    SELECT 1 FROM public.bakers WHERE id = auth.uid() AND is_premium = true -- Temporary admin check
));

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_is_dead_click ON public.analytics_events(is_dead_click) WHERE is_dead_click = true;
