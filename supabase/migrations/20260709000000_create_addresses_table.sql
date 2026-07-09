-- ========================================================
-- Fresh Delivery Hub (FDH) SQL Migration Script
-- Migration: Create Addresses Table with Row Level Security
-- ========================================================

-- 1. Create Addresses Table
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Home',
  details TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
CREATE POLICY "Users can insert their own addresses" 
  ON public.addresses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select their own addresses" 
  ON public.addresses FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" 
  ON public.addresses FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" 
  ON public.addresses FOR DELETE 
  USING (auth.uid() = user_id);

-- 4. Enable Trigger to update `updated_at` column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE
  ON public.addresses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
