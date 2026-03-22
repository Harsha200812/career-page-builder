-- Add hero title and subtitle fields to company_themes
-- Run this in your Supabase SQL Editor

alter table company_themes
add column if not exists hero_title text,
add column if not exists hero_subtitle text;
