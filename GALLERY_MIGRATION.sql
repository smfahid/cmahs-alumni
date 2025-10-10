-- Migration to add event_name and event_date columns to gallery table
-- Run this SQL in your Supabase SQL Editor

-- Add event_name column
ALTER TABLE gallery 
ADD COLUMN IF NOT EXISTS event_name TEXT;

-- Add event_date column
ALTER TABLE gallery 
ADD COLUMN IF NOT EXISTS event_date DATE;

-- Update existing records with default values (optional - you can skip this if you want to manually set them)
-- UPDATE gallery SET event_name = title WHERE event_name IS NULL;
-- UPDATE gallery SET event_date = created_at::date WHERE event_date IS NULL;

-- Create an index on event_date for better query performance
CREATE INDEX IF NOT EXISTS idx_gallery_event_date ON gallery(event_date DESC);

-- Create an index on event_name for better query performance
CREATE INDEX IF NOT EXISTS idx_gallery_event_name ON gallery(event_name);

-- Optional: Remove the title column if you no longer need it (uncomment if you want to remove it)
-- ALTER TABLE gallery DROP COLUMN IF EXISTS title;
