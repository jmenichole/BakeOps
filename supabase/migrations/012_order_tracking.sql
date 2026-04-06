-- BakeOps - Order Tracking
-- Migration: 012_order_tracking
-- Description: Adds a unique tracking token per order for magic-link customer portal access

-- 1. Add tracking token to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_token UUID DEFAULT gen_random_uuid();

-- Backfill any existing rows that have a NULL token (shouldn't happen with DEFAULT, but be safe)
UPDATE public.orders SET tracking_token = gen_random_uuid() WHERE tracking_token IS NULL;

-- Enforce NOT NULL and uniqueness going forward
ALTER TABLE public.orders ALTER COLUMN tracking_token SET NOT NULL;

-- Unique index covers both uniqueness and fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_tracking_token ON public.orders(tracking_token);

-- 2. RLS: reads via the tracking token are handled in the API layer using the service role key.
--    No direct anon RLS policy is needed. Bakers retain full access via existing policies.
