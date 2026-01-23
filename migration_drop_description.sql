-- Migration: Drop description column from opportunities table
-- Run this in Supabase SQL Editor

ALTER TABLE public.opportunities
DROP COLUMN IF EXISTS description;
