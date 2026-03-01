-- BakeBot - Final Schema Polish & Missing Features
-- Migration: 009_schema_final_polish

-- 1. Add onboarding tracking to bakers
ALTER TABLE public.bakers 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- 2. Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_baker_id ON public.orders(baker_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON public.orders(delivery_date);
CREATE INDEX IF NOT EXISTS idx_cake_designs_baker_id ON public.cake_designs(baker_id);
CREATE INDEX IF NOT EXISTS idx_prep_tasks_baker_id ON public.prep_tasks(baker_id);
CREATE INDEX IF NOT EXISTS idx_prep_tasks_order_id ON public.prep_tasks(order_id);
CREATE INDEX IF NOT EXISTS idx_prep_tasks_status ON public.prep_tasks(status);
CREATE INDEX IF NOT EXISTS idx_prep_tasks_scheduled_for ON public.prep_tasks(scheduled_for);

-- 3. Ensure updated_at triggers exist for all tables
-- First, define the trigger function if it doesn't exist (it usually should but let's be safe)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DO $$
BEGIN
    -- Bakers
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_bakers') THEN
        CREATE TRIGGER set_updated_at_bakers
        BEFORE UPDATE ON public.bakers
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Orders
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_orders') THEN
        CREATE TRIGGER set_updated_at_orders
        BEFORE UPDATE ON public.orders
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Prep Tasks
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_prep_tasks') THEN
        CREATE TRIGGER set_updated_at_prep_tasks
        BEFORE UPDATE ON public.prep_tasks
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
