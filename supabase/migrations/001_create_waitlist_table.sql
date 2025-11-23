-- BOT (Baked On Time) - Waitlist Signups Table
-- Migration: 001_create_waitlist_table
-- Description: Creates the waitlist_signups table to store early access signups

-- Create waitlist_signups table
CREATE TABLE IF NOT EXISTS public.waitlist_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    role TEXT CHECK (role IN ('baker', 'customer', 'curious')) DEFAULT 'curious',
    source TEXT DEFAULT 'landing-page',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist_signups(email);

-- Create index on created_at for analytics queries
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist_signups(created_at DESC);

-- Create index on role for role-based analytics
CREATE INDEX IF NOT EXISTS idx_waitlist_role ON public.waitlist_signups(role);

-- Add comment to table
COMMENT ON TABLE public.waitlist_signups IS 'Stores early access waitlist signups from the landing page';

-- Add comments to columns
COMMENT ON COLUMN public.waitlist_signups.id IS 'Unique identifier for each signup';
COMMENT ON COLUMN public.waitlist_signups.email IS 'User email address (unique)';
COMMENT ON COLUMN public.waitlist_signups.role IS 'User role: baker, customer, or curious';
COMMENT ON COLUMN public.waitlist_signups.source IS 'Signup source (e.g., landing-page, referral, etc.)';
COMMENT ON COLUMN public.waitlist_signups.created_at IS 'Timestamp when the signup was created';
COMMENT ON COLUMN public.waitlist_signups.updated_at IS 'Timestamp when the signup was last updated';

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_waitlist_signups_updated_at
    BEFORE UPDATE ON public.waitlist_signups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from Edge Functions (using service role)
-- This allows Edge Functions to insert without authentication
CREATE POLICY "Allow service role to insert signups"
    ON public.waitlist_signups
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Create policy to allow service role to read all signups (for analytics)
CREATE POLICY "Allow service role to read signups"
    ON public.waitlist_signups
    FOR SELECT
    TO service_role
    USING (true);

-- Grant necessary permissions
GRANT INSERT, SELECT ON public.waitlist_signups TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;
