-- BakeBot - Comprehensive updated_at Triggers
-- Migration: 010_ensure_updated_at_everywhere
-- Description: Ensures ALL tables have updated_at column and triggers for automated timestamping

-- 1. Create or Replace the trigger function (idempotent)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Ensure updated_at columns exist on target tables
ALTER TABLE public.cake_designs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.referrals ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.portfolio_photos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
-- Bakers, Orders, Prep Tasks, and Waitlist already have the column

-- 3. Define a helper procedure to safely create triggers
DO $$
BEGIN
    -- cake_designs
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_cake_designs') THEN
        CREATE TRIGGER set_updated_at_cake_designs
        BEFORE UPDATE ON public.cake_designs
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;

    -- referrals
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_referrals') THEN
        CREATE TRIGGER set_updated_at_referrals
        BEFORE UPDATE ON public.referrals
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;

    -- portfolio_photos
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_portfolio_photos') THEN
        CREATE TRIGGER set_updated_at_portfolio_photos
        BEFORE UPDATE ON public.portfolio_photos
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;

    -- Ensure bakers is using the consistent function
    DROP TRIGGER IF EXISTS set_updated_at_bakers ON public.bakers;
    CREATE TRIGGER set_updated_at_bakers
    BEFORE UPDATE ON public.bakers
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

    -- Ensure orders is using the consistent function
    DROP TRIGGER IF EXISTS set_updated_at_orders ON public.orders;
    CREATE TRIGGER set_updated_at_orders
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

    -- Ensure prep_tasks is using the consistent function
    DROP TRIGGER IF EXISTS set_updated_at_prep_tasks ON public.prep_tasks;
    CREATE TRIGGER set_updated_at_prep_tasks
    BEFORE UPDATE ON public.prep_tasks
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

END $$;
