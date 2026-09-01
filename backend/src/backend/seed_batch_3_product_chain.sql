-- -----------------------------------------------------------------------------
-- BATCH 3 SEED DATASET (PRODUCT CHAIN)
-- Ratified: GOV-2026-08-31-BATCH3-PRODUCT-CHAIN-V1
-- Target Tables: product_groups, catalog_items, product_variations, catalog_item_tags, price_lists, price_list_lines
-- Rules Enforced: Selected Not Typed (Subqueries only), customer_account_id IS NOT NULL, Tag With What Exists, No Option Groups.
-- -----------------------------------------------------------------------------

-- 1. PRODUCT GROUPS (Level 1 Root Category & Level 2 Subcategory for AGN Ltd)
INSERT INTO public.product_groups (customer_account_id, name, parent_id, level)
SELECT 
  ca.id,
  'Recognition Awards',
  NULL,
  1
FROM public.customer_accounts ca
WHERE ca.company_name = 'AGN Ltd'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.product_groups (customer_account_id, name, parent_id, level)
SELECT 
  ca.id,
  'Optic Crystal',
  pg.id,
  2
FROM public.customer_accounts ca
JOIN public.product_groups pg ON pg.customer_account_id = ca.id AND pg.name = 'Recognition Awards'
WHERE ca.company_name = 'AGN Ltd'
LIMIT 1
ON CONFLICT DO NOTHING;

-- 2. CATALOG ITEMS (TRI Vertical - Optic Crystal Standing Recognition Award)
INSERT INTO public.catalog_items (
  customer_account_id,
  product_group_id,
  internal_sku,
  title_he,
  title_en,
  category,
  description,
  image_urls,
  currency_code,
  supplier_lead_time_days,
  top_picks,
  is_active,
  attributes
)
SELECT 
  ca.id,
  pg.id,
  'Cat# TriV_OpticCrystal',
  'מגן הוקרה קריסטל אופטי עומד - TRI Vertical',
  'TRI Vertical - Optic Crystal Standing Recognition Award',
  'Recognition Awards',
  'Solid Optic Crystal (K9 Glass) standing recognition award with hand-beveled edges. Supports full-color UV printing and 2D/3D subsurface laser engraving.',
  ARRAY['file:///C:/Users/finky/.gemini/antigravity/brain/f9d83031-b7e1-42a3-adc3-5130cf5cb069/.user_uploaded/media_1788050647396.jpg'],
  'ILS',
  5,
  true,
  true,
  jsonb_build_object(
    'material', 'Solid Optic Crystal (K9 Glass)',
    'subcategory_en', 'Optic Crystal',
    'subcategory_he', 'קריסטל אופטי',
    'default_packaging', 'PKG-BOX-BLUE-SATIN',
    'orientation_supported', ARRAY['vertical', 'horizontal']
  )
FROM public.customer_accounts ca
JOIN public.product_groups pg ON pg.customer_account_id = ca.id AND pg.name = 'Optic Crystal'
WHERE ca.company_name = 'AGN Ltd'
LIMIT 1
ON CONFLICT DO NOTHING;

-- 3. PRODUCT VARIATIONS (Sizes, Branding Technologies, Base Options, Packaging)
-- 3.1 Sizes & Dimensions
INSERT INTO public.product_variations (customer_account_id, catalog_item_id, variation_type, value, cost_modifier)
SELECT ca.id, ci.id, 'size', 'S (100x80x20mm, 0.4kg)', 220.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, 'size', 'M (120x90x22mm, 0.6kg)', 280.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, 'size', 'L (150x100x30mm, 1.0kg)', 380.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, 'size', 'XL (180x130x30mm, 1.5kg)', 490.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, 'size', 'XXL (200x150x30mm, 2.0kg)', 650.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, 'size', '3XL (265x170x30mm, 2.5kg)', 890.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal';

-- 3.2 Branding Technologies
INSERT INTO public.product_variations (customer_account_id, catalog_item_id, variation_type, value, cost_modifier)
SELECT ca.id, ci.id, 'branding_tech', 'UV-BACK (Full-Color Back UV)', 0.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, 'branding_tech', 'UV-FRONT (Full-Color Front UV)', 35.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, 'branding_tech', 'UV-DOUBLE (Double-Sided UV)', 65.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, 'branding_tech', 'UV-WHITE-BASE (Opaque White Layer)', 20.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, 'branding_tech', 'LASER-2D (Subsurface Laser 2D)', 0.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, 'branding_tech', 'LASER-2.5D (Subsurface Laser 2.5D)', 45.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, 'branding_tech', 'LASER-3D (Subsurface Laser 3D)', 90.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, 'branding_tech', 'MIXED-UV-LASER (Hybrid Laser 3D + UV)', 120.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal';

-- 3.3 Base Options & Base Branding
INSERT INTO public.product_variations (customer_account_id, catalog_item_id, variation_type, value, cost_modifier)
SELECT ca.id, ci.id, 'base_option', 'BASE-CRYSTAL (Optic Crystal Pedestal)', 85.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, 'base_option', 'BASE-WOOD (Solid Hardwood Pedestal)', 95.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, 'base_branding', 'BASE-LASER-ENGRAVE (Laser Inscription on Base)', 30.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, 'base_branding', 'BASE-UV-PRINT (Full Color UV Print on Base)', 35.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal';

-- 3.4 Packaging Options
INSERT INTO public.product_variations (customer_account_id, catalog_item_id, variation_type, value, cost_modifier)
SELECT ca.id, ci.id, 'packaging', 'PKG-BOX-BLUE-SATIN (Deluxe Satin Gift Box - Default)', 0.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, 'packaging', 'PKG-WOODEN-CASE-LUX (Executive Mahogany Wood Case)', 110.00 FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal';

-- 4. CATALOG ITEM TAGS (Tag With What Exists: TAG_SYS_CORE, TAG_CATALOG_REF, TAG_WORKFLOW_ACTIVE, TAG_CONST_CIVIL)
INSERT INTO public.catalog_item_tags (customer_account_id, catalog_item_id, tag_id)
SELECT ca.id, ci.id, t.id FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id JOIN public.tag_library t ON t.code = 'TAG_SYS_CORE' WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, t.id FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id JOIN public.tag_library t ON t.code = 'TAG_CATALOG_REF' WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, t.id FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id JOIN public.tag_library t ON t.code = 'TAG_WORKFLOW_ACTIVE' WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
UNION ALL
SELECT ca.id, ci.id, t.id FROM public.customer_accounts ca JOIN public.catalog_items ci ON ci.customer_account_id = ca.id JOIN public.tag_library t ON t.code = 'TAG_CONST_CIVIL' WHERE ca.company_name = 'AGN Ltd' AND ci.internal_sku = 'Cat# TriV_OpticCrystal'
ON CONFLICT (catalog_item_id, tag_id, customer_account_id) DO NOTHING;

-- 5. PRICE LISTS (Standard Commercial Wholesale Price List 2026)
INSERT INTO public.price_lists (customer_account_id, code, name, currency, valid_from, valid_to, is_active)
SELECT 
  ca.id,
  'PL_AGN_STANDARD_2026',
  'AGN Standard Commercial Wholesale Price List 2026',
  'ILS',
  CURRENT_DATE,
  (CURRENT_DATE + INTERVAL '1 year')::date,
  true
FROM public.customer_accounts ca
WHERE ca.company_name = 'AGN Ltd'
LIMIT 1
ON CONFLICT DO NOTHING;

-- 6. PRICE LIST LINES (7 Quantity Discount Tiers for Size L Base 380 ILS)
-- T1: 1-3 pcs (0% OFF -> 380.00 ILS)
INSERT INTO public.price_list_lines (customer_account_id, price_list_id, unit_id, min_quantity, max_quantity, unit_price)
SELECT ca.id, pl.id, ci.id, 1, 3, 380.00 FROM public.customer_accounts ca JOIN public.price_lists pl ON pl.customer_account_id = ca.id AND pl.code = 'PL_AGN_STANDARD_2026' JOIN public.catalog_items ci ON ci.customer_account_id = ca.id AND ci.internal_sku = 'Cat# TriV_OpticCrystal' WHERE ca.company_name = 'AGN Ltd'
UNION ALL
-- T2: 4-10 pcs (10% OFF -> 342.00 ILS)
SELECT ca.id, pl.id, ci.id, 4, 10, 342.00 FROM public.customer_accounts ca JOIN public.price_lists pl ON pl.customer_account_id = ca.id AND pl.code = 'PL_AGN_STANDARD_2026' JOIN public.catalog_items ci ON ci.customer_account_id = ca.id AND ci.internal_sku = 'Cat# TriV_OpticCrystal' WHERE ca.company_name = 'AGN Ltd'
UNION ALL
-- T3: 11-25 pcs (18% OFF -> 311.60 ILS)
SELECT ca.id, pl.id, ci.id, 11, 25, 311.60 FROM public.customer_accounts ca JOIN public.price_lists pl ON pl.customer_account_id = ca.id AND pl.code = 'PL_AGN_STANDARD_2026' JOIN public.catalog_items ci ON ci.customer_account_id = ca.id AND ci.internal_sku = 'Cat# TriV_OpticCrystal' WHERE ca.company_name = 'AGN Ltd'
UNION ALL
-- T4: 26-50 pcs (26% OFF -> 281.20 ILS)
SELECT ca.id, pl.id, ci.id, 26, 50, 281.20 FROM public.customer_accounts ca JOIN public.price_lists pl ON pl.customer_account_id = ca.id AND pl.code = 'PL_AGN_STANDARD_2026' JOIN public.catalog_items ci ON ci.customer_account_id = ca.id AND ci.internal_sku = 'Cat# TriV_OpticCrystal' WHERE ca.company_name = 'AGN Ltd'
UNION ALL
-- T5: 51-100 pcs (35% OFF -> 247.00 ILS)
SELECT ca.id, pl.id, ci.id, 51, 100, 247.00 FROM public.customer_accounts ca JOIN public.price_lists pl ON pl.customer_account_id = ca.id AND pl.code = 'PL_AGN_STANDARD_2026' JOIN public.catalog_items ci ON ci.customer_account_id = ca.id AND ci.internal_sku = 'Cat# TriV_OpticCrystal' WHERE ca.company_name = 'AGN Ltd'
UNION ALL
-- T6: 101-200 pcs (45% OFF -> 209.00 ILS)
SELECT ca.id, pl.id, ci.id, 101, 200, 209.00 FROM public.customer_accounts ca JOIN public.price_lists pl ON pl.customer_account_id = ca.id AND pl.code = 'PL_AGN_STANDARD_2026' JOIN public.catalog_items ci ON ci.customer_account_id = ca.id AND ci.internal_sku = 'Cat# TriV_OpticCrystal' WHERE ca.company_name = 'AGN Ltd'
UNION ALL
-- T7: 201+ pcs (55% OFF -> 171.00 ILS)
SELECT ca.id, pl.id, ci.id, 201, NULL, 171.00 FROM public.customer_accounts ca JOIN public.price_lists pl ON pl.customer_account_id = ca.id AND pl.code = 'PL_AGN_STANDARD_2026' JOIN public.catalog_items ci ON ci.customer_account_id = ca.id AND ci.internal_sku = 'Cat# TriV_OpticCrystal' WHERE ca.company_name = 'AGN Ltd';
