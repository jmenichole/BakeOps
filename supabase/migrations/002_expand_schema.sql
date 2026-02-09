-- BOT (Baked On Time) - Expanded Schema
-- Migration: 002_expand_schema
-- Description: Creates tables for bakers, orders, designs, and production planning

-- 1. Bakers table (Extension of users)
CREATE TABLE IF NOT EXISTS public.bakers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT,
    bio TEXT,
    location TEXT,
    logo_url TEXT,
    signature_style TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    trial_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Cake Configurations (AI Generated & User Modified)
CREATE TABLE IF NOT EXISTS public.cake_designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    baker_id UUID REFERENCES public.bakers(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    configuration_data JSONB, -- Stores size, layers, colors, flavors, etc.
    estimated_price DECIMAL(10, 2),
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    baker_id UUID REFERENCES public.bakers(id) ON DELETE CASCADE,
    design_id UUID REFERENCES public.cake_designs(id),
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'paid', 'preparing', 'ready', 'delivered', 'cancelled')) DEFAULT 'pending',
    total_price DECIMAL(10, 2),
    deposit_paid DECIMAL(10, 2) DEFAULT 0,
    delivery_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Prep Tasks (Production Planning)
CREATE TABLE IF NOT EXISTS public.prep_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    baker_id UUID REFERENCES public.bakers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('baking', 'filling', 'coating', 'fondant', 'decorating', 'packing', 'delivery')),
    status TEXT CHECK (status IN ('todo', 'in_progress', 'completed')) DEFAULT 'todo',
    scheduled_for TIMESTAMPTZ,
    estimated_minutes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Portfolio Photos (For AI Training)
CREATE TABLE IF NOT EXISTS public.portfolio_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    baker_id UUID REFERENCES public.bakers(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.bakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cake_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prep_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_photos ENABLE ROW LEVEL SECURITY;

-- Bakers policies
CREATE POLICY "Public bakers are viewable by everyone" ON public.bakers FOR SELECT USING (true);
CREATE POLICY "Users can update their own baker profile" ON public.bakers FOR UPDATE USING (auth.uid() = id);

-- Designs policies
CREATE POLICY "Designs are viewable by owner or if public" ON public.cake_designs FOR SELECT USING (auth.uid() = baker_id OR is_public = true);
CREATE POLICY "Bakers can insert their own designs" ON public.cake_designs FOR INSERT WITH CHECK (auth.uid() = baker_id);
CREATE POLICY "Bakers can update their own designs" ON public.cake_designs FOR UPDATE USING (auth.uid() = baker_id);

-- Orders policies
CREATE POLICY "Bakers can see their own orders" ON public.orders FOR SELECT USING (auth.uid() = baker_id);
CREATE POLICY "Bakers can update their own orders" ON public.orders FOR UPDATE USING (auth.uid() = baker_id);

-- Prep tasks policies
CREATE POLICY "Bakers can see and manage their own tasks" ON public.prep_tasks FOR ALL USING (auth.uid() = baker_id);

-- Portfolio policies
CREATE POLICY "Portfolio photos are viewable by everyone" ON public.portfolio_photos FOR SELECT USING (true);
CREATE POLICY "Bakers can manage their own portfolio" ON public.portfolio_photos FOR ALL USING (auth.uid() = baker_id);
