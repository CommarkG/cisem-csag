-- migrations_20260825_tenant_settings.sql
-- RATIFIED MIGRATION: GOV-2026-08-25-UNIVERSAL-SETTINGS
-- Run this statement in Supabase SQL Editor:

ALTER TABLE customer_accounts 
ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{}'::jsonb;
