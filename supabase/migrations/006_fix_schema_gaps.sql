-- BOT (Baked On Time) - Schema Fixes
-- Migration: 006_fix_schema_gaps
-- Description: Adds missing columns, fixes RLS policies, resolves referrals schema conflict,
--              adds missing indexes and updated_at triggers.

-- ============================================================
-- 1. ADD MISSING COLUMNS TO ORDERS
-- ============================================================

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE;

-- ============================================================
-- 2. ADD MISSING COLUMN TO CAKE_DESIGNS
-- ============================================================

ALTER TABLE public.cake_designs ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT FALSE;

-- ============================================================
-- 3. FIX RLS POLICIES — ADD MISSING INSERT/DELETE ON ORDERS
-- ============================================================

-- Allow bakers to create their own orders
CREATE POLICY "Bakers can insert their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = baker_id);

-- Allow bakers to delete their own orders
CREATE POLICY "Bakers can delete their own orders"
  ON public.orders FOR DELETE
  USING (auth.uid() = baker_id);

-- ============================================================
-- 4. FIX RLS POLICIES — ADD MISSING INSERT/DELETE ON BAKERS
-- ============================================================

-- Allow users to create their own baker profile
CREATE POLICY "Users can create their own baker profile"
  ON public.bakers FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to delete their own baker profile
CREATE POLICY "Users can delete their own baker profile"
  ON public.bakers FOR DELETE
  USING (auth.uid() = id);

-- ============================================================
-- 5. FIX REFERRALS TABLE SCHEMA CONFLICT (004 vs 005)
--    Migration 004 created referrals with referrer_id -> auth.users
--    Migration 005 expected referrer_id -> bakers + extra columns
--    We add the missing columns from 005 that were silently skipped.
-- ============================================================

ALTER TABLE public.referrals ADD COLUMN IF NOT EXISTS referred_email TEXT;
ALTER TABLE public.referrals ADD COLUMN IF NOT EXISTS reward_months INTEGER DEFAULT 1;
ALTER TABLE public.referrals ADD COLUMN IF NOT EXISTS activated_at TIMESTAMPTZ;

-- ============================================================
-- 6. ADD SELECT POLICIES FOR ANALYTICS & SURVEYS
-- ============================================================

CREATE POLICY "Users can read their own events"
  ON public.analytics_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own survey responses"
  ON public.survey_responses FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- 7. ADD MISSING INDEXES FOR QUERY PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_orders_baker_id ON public.orders(baker_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON public.orders(delivery_date);
CREATE INDEX IF NOT EXISTS idx_cake_designs_baker_id ON public.cake_designs(baker_id);
CREATE INDEX IF NOT EXISTS idx_prep_tasks_baker_id ON public.prep_tasks(baker_id);
CREATE INDEX IF NOT EXISTS idx_prep_tasks_order_id ON public.prep_tasks(order_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);

-- ============================================================
-- 8. ADD updated_at TRIGGERS (missing from migration 002)
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bakers_updated_at
  BEFORE UPDATE ON public.bakers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prep_tasks_updated_at
  BEFORE UPDATE ON public.prep_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
