-- -----------------------------------------------------------------------------
-- MIGRATION: TENANT CONVENTIONS & SCHEMA EXTENSIONS
-- Ratified: GOV-2026-08-31-TENANT-CONVENTIONS-SCHEMA-V1
-- Objects Created: 
--   1. vocabulary_terms rows (kind='pricing_basis')
--   2. catalog_items.pricing_basis_code (Column Addition)
--   3. entity_aliases (New Polymorphic Cross-Reference Alias Table)
--   4. shipping_methods (New Multi-Tenant Shipping & Lead Time Table)
-- Enforcements: In-transaction Precondition Guard, customer_account_id NOT NULL on tenant tables.
-- -----------------------------------------------------------------------------

-- 1. PRECONDITION GUARD BLOCK
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'catalog_items') THEN
    RAISE EXCEPTION 'PRECONDITION_FAILED: Target table public.catalog_items does not exist.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vocabulary_terms') THEN
    RAISE EXCEPTION 'PRECONDITION_FAILED: Target table public.vocabulary_terms does not exist.';
  END IF;
END $$;

-- 2. SEED PLATFORM PRICING BASIS VOCABULARY TERMS (kind='pricing_basis')
INSERT INTO public.vocabulary_terms (customer_account_id, kind, code, label, scope, sort_order, is_active, is_protected, attributes)
VALUES
  (NULL, 'pricing_basis', 'per_unit', 'Per Unit (Piece/Each)', 'platform', 1, true, true, '{"description_he": "לפי יחידה"}'),
  (NULL, 'pricing_basis', 'per_volume', 'Per Volume (m³)', 'platform', 2, true, true, '{"description_he": "לפי נפח (מ"ק)"}'),
  (NULL, 'pricing_basis', 'per_weight', 'Per Weight (kg/ton)', 'platform', 3, true, true, '{"description_he": "לפי משקל (ק"ג/טון)"}'),
  (NULL, 'pricing_basis', 'per_area', 'Per Area (m²)', 'platform', 4, true, true, '{"description_he": "לפי שטח (מ"ר)"}'),
  (NULL, 'pricing_basis', 'per_length', 'Per Linear Length (m)', 'platform', 5, true, true, '{"description_he": "לפי אורך מטר רץ"}'),
  (NULL, 'pricing_basis', 'per_hour', 'Per Service Hour', 'platform', 6, true, true, '{"description_he": "לפי שעת עבודה"}'),
  (NULL, 'pricing_basis', 'per_pack', 'Per Pack/Box/Case', 'platform', 7, true, true, '{"description_he": "לפי מארז/קופסה"}')
ON CONFLICT (kind, code) DO NOTHING;

-- 3. ADD PRICING BASIS COLUMN TO CATALOG ITEMS
ALTER TABLE public.catalog_items 
ADD COLUMN IF NOT EXISTS pricing_basis_code VARCHAR(64) DEFAULT 'per_unit' NOT NULL;

-- 4. CREATE POLYMORPHIC CROSS-REFERENCE ALIAS TABLE (entity_aliases)
CREATE TABLE IF NOT EXISTS public.entity_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_account_id UUID NOT NULL REFERENCES public.customer_accounts(id) ON DELETE CASCADE,
  entity_type VARCHAR(64) NOT NULL, -- 'catalog_item', 'counterparty', 'supplier', 'location'
  entity_id UUID NOT NULL, -- Polymorphic ID pointing to target table primary key
  alias_kind VARCHAR(64) NOT NULL, -- 'tenant_sku', 'buyer_sku', 'supplier_sku', 'gtin_barcode', 'legacy_code'
  alias_value VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uk_entity_aliases_unique UNIQUE (customer_account_id, entity_type, entity_id, alias_kind, alias_value)
);

CREATE INDEX IF NOT EXISTS idx_entity_aliases_lookup 
ON public.entity_aliases (customer_account_id, alias_kind, alias_value);

CREATE INDEX IF NOT EXISTS idx_entity_aliases_entity 
ON public.entity_aliases (customer_account_id, entity_type, entity_id);

-- 5. CREATE MULTI-TENANT SHIPPING METHODS TABLE (shipping_methods)
CREATE TABLE IF NOT EXISTS public.shipping_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_account_id UUID NOT NULL REFERENCES public.customer_accounts(id) ON DELETE CASCADE,
  code VARCHAR(64) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  name_he VARCHAR(255) NOT NULL,
  carrier_name VARCHAR(255) NOT NULL,
  transit_days_min INTEGER NOT NULL DEFAULT 1,
  transit_days_max INTEGER NOT NULL DEFAULT 3,
  cutoff_time_utc VARCHAR(10) DEFAULT '14:00',
  cost_basis VARCHAR(64) NOT NULL DEFAULT 'flat', -- 'flat', 'per_weight', 'per_volume', 'tiered_order_value'
  base_rate NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  per_unit_rate NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uk_shipping_methods_code UNIQUE (customer_account_id, code)
);

CREATE INDEX IF NOT EXISTS idx_shipping_methods_tenant 
ON public.shipping_methods (customer_account_id, is_active);
