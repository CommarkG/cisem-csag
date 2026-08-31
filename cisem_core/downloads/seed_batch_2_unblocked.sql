-- -----------------------------------------------------------------------------
-- BATCH 2 SEED DATASET (UNBLOCKED SUBSETS)
-- Ratified: GOV-2026-08-31-BATCH2-SEED-V1
-- Target Tables: package_feature_grants, navigation_menu_items
-- Note: suppliers & contacts are held awaiting counterparties on Governor.
-- -----------------------------------------------------------------------------

-- 1. PACKAGE FEATURE GRANTS (Starter Package Grants All 7 Feature Capabilities)
INSERT INTO public.package_feature_grants (package_id, feature_code)
SELECT 
  p.id,
  fr.code
FROM public.packages p
CROSS JOIN public.feature_registry fr
WHERE p.id = '5f2bfda8-3770-4384-8509-5c02bfda8000'::uuid
ON CONFLICT (id) DO NOTHING;

-- 2. NAVIGATION MENU ITEMS (Domain Pipeline Navigation Screen Roster)
INSERT INTO public.navigation_menu_items (title_en, title_he, route, icon, allowed_roles, display_order)
VALUES
  ('Inquiries', 'פניות והזמנות', '#/inquiry-intake', 'inbox', '{"admin","operator","client"}'::public.user_role_enum[], 1),
  ('Quote Builder', 'מחולל הצעות מחיר', '#/quote-builder', 'file-text', '{"admin","operator","client"}'::public.user_role_enum[], 2),
  ('Order Acceptance', 'אישור והזמנות עבודה', '#/work-order-acceptance', 'check-circle', '{"admin","operator","client"}'::public.user_role_enum[], 3),
  ('Catalog', 'קטלוג מוצרים', '#/catalogue', 'book-open', '{"admin","operator","client"}'::public.user_role_enum[], 4),
  ('Clients & Counterparties', 'לקוחות וצדדים שכנגד', '#/clients', 'users', '{"admin","operator","client"}'::public.user_role_enum[], 5),
  ('Suppliers', 'ספקים וספקים מורשים', '#/suppliers', 'truck', '{"admin","operator","client"}'::public.user_role_enum[], 6),
  ('Team & Access', 'צוות והרשאות', '#/admin', 'shield', '{"admin","operator"}'::public.user_role_enum[], 7);
