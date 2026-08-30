-- =============================================================================
-- Migration: Retarget Product Model & Clean Duplications
-- Ratified: GOV-2026-08-30-PRODUCT-REDUNDANCY-V1.1
-- Reason: Retires Model B tables under RESTRICT constraint guards, retargets 
--         six foreign keys of price_list_lines, unit_composition, supply_offers,
--         quote_lines, and inquiry_units to catalog_items(id), and creates the
--         catalog_item_tags join table.
-- =============================================================================

-- VERIFICATION OF EMPTY STATE (Row Count: 0 for all target tables):
-- SELECT count(*) FROM unit_options;              -- 0 rows verified
-- SELECT count(*) FROM offering_classifications; -- 0 rows verified
-- SELECT count(*) FROM units;                     -- 0 rows verified
-- SELECT count(*) FROM option_values;             -- 0 rows verified
-- SELECT count(*) FROM option_types;              -- 0 rows verified
-- SELECT count(*) FROM offerings;                 -- 0 rows verified
-- SELECT count(*) FROM price_list_lines;          -- 0 rows verified
-- SELECT count(*) FROM unit_composition;          -- 0 rows verified
-- SELECT count(*) FROM supply_offers;             -- 0 rows verified
-- SELECT count(*) FROM quote_lines;               -- 0 rows verified
-- SELECT count(*) FROM inquiry_units;             -- 0 rows verified

-- 1. DROP AND RECREATE SIX FOREIGN KEY CONSTRAINTS AGAINST catalog_items(id)
-- 1.1 price_list_lines.unit_id
ALTER TABLE price_list_lines DROP CONSTRAINT IF EXISTS price_list_lines_unit_id_fkey;
ALTER TABLE price_list_lines 
  ADD CONSTRAINT price_list_lines_catalog_item_id_fkey 
  FOREIGN KEY (unit_id) REFERENCES catalog_items(id) ON DELETE CASCADE;

-- 1.2 unit_composition.parent_unit_id and child_unit_id
ALTER TABLE unit_composition DROP CONSTRAINT IF EXISTS unit_composition_parent_unit_id_fkey;
ALTER TABLE unit_composition DROP CONSTRAINT IF EXISTS unit_composition_child_unit_id_fkey;

ALTER TABLE unit_composition 
  ADD CONSTRAINT unit_composition_parent_catalog_item_id_fkey 
  FOREIGN KEY (parent_unit_id) REFERENCES catalog_items(id) ON DELETE CASCADE;

ALTER TABLE unit_composition 
  ADD CONSTRAINT unit_composition_child_catalog_item_id_fkey 
  FOREIGN KEY (child_unit_id) REFERENCES catalog_items(id) ON DELETE CASCADE;

-- 1.3 supply_offers.unit_id
ALTER TABLE supply_offers DROP CONSTRAINT IF EXISTS supply_offers_unit_id_fkey;
ALTER TABLE supply_offers 
  ADD CONSTRAINT supply_offers_catalog_item_id_fkey 
  FOREIGN KEY (unit_id) REFERENCES catalog_items(id) ON DELETE CASCADE;

-- 1.4 quote_lines.unit_id
ALTER TABLE quote_lines DROP CONSTRAINT IF EXISTS quote_lines_unit_id_fkey;
ALTER TABLE quote_lines 
  ADD CONSTRAINT quote_lines_catalog_item_id_fkey 
  FOREIGN KEY (unit_id) REFERENCES catalog_items(id) ON DELETE CASCADE;

-- 1.5 inquiry_units.unit_id
ALTER TABLE inquiry_units DROP CONSTRAINT IF EXISTS inquiry_units_unit_id_fkey;
ALTER TABLE inquiry_units 
  ADD CONSTRAINT inquiry_units_catalog_item_id_fkey 
  FOREIGN KEY (unit_id) REFERENCES catalog_items(id) ON DELETE CASCADE;

-- 2. DROP RETIRED MODEL B TABLES WITH RESTRICT GUARD
-- (Runs only after all referencing foreign keys are safely repointed)
DROP TABLE IF EXISTS unit_options RESTRICT;
DROP TABLE IF EXISTS offering_classifications RESTRICT;
DROP TABLE IF EXISTS units RESTRICT;
DROP TABLE IF EXISTS option_values RESTRICT;
DROP TABLE IF EXISTS option_types RESTRICT;
DROP TABLE IF EXISTS offerings RESTRICT;

-- 3. CREATE catalog_item_tags JOIN TABLE
CREATE TABLE IF NOT EXISTS catalog_item_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_account_id UUID NOT NULL REFERENCES customer_accounts(id) ON DELETE CASCADE,
  catalog_item_id UUID NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tag_library(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT uq_catalog_item_tags UNIQUE (catalog_item_id, tag_id, customer_account_id)
);

-- 4. ENABLE AND FORCE ROW-LEVEL SECURITY
ALTER TABLE catalog_item_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_item_tags FORCE ROW LEVEL SECURITY;

-- 5. CREATE TENANT ISOLATION POLICY
CREATE POLICY tenant_isolation_policy ON catalog_item_tags
  FOR ALL
  USING (customer_account_id = current_tenant_id())
  WITH CHECK (customer_account_id = current_tenant_id());
