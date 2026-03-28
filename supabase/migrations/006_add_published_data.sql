-- Migration to add published_data JSONB snapshot column to companies

ALTER TABLE "public"."companies" 
ADD COLUMN IF NOT EXISTS "published_data" JSONB;

-- Optionally, backfill existing published companies to have their current state as 'published_data'
-- We skip complex backfilling in pure SQL here to keep it simple, as it can be backfilled via the app once re-published.
