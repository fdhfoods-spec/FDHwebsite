-- Add available_slots JSON array column to products table for restricted delivery slots
ALTER TABLE IF EXISTS public.products
ADD COLUMN IF NOT EXISTS available_slots JSONB DEFAULT '[]'::jsonb;
