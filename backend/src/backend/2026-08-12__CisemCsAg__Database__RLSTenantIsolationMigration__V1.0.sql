-- 2026-08-12__CisemCsAg__Database__RLSTenantIsolationMigration__V1.0.sql
-- Description: Implement app_metadata-based Row-Level Security (RLS) tenant isolation.
-- Instructions: Run this script inside the Supabase SQL Editor.

BEGIN;

  -- 1. Drop existing policies to prevent naming collisions
  DROP POLICY IF EXISTS tenant_isolation_policy ON template_registry;
  DROP POLICY IF EXISTS tmpl_read ON template_registry;
  DROP POLICY IF EXISTS tmpl_write ON template_registry;
  DROP POLICY IF EXISTS tmpl_update ON template_registry;
  DROP POLICY IF EXISTS tmpl_delete ON template_registry;
  DROP POLICY IF EXISTS tmpl_select ON template_registry;
  DROP POLICY IF EXISTS tmpl_insert ON template_registry;

  DROP POLICY IF EXISTS tenant_isolation_policy ON user_account_roles;

  DROP POLICY IF EXISTS tenant_isolation_policy ON contacts;
  DROP POLICY IF EXISTS contact_select ON contacts;
  DROP POLICY IF EXISTS contact_insert ON contacts;
  DROP POLICY IF EXISTS contact_update ON contacts;
  DROP POLICY IF EXISTS contact_delete ON contacts;

  DROP POLICY IF EXISTS tenant_isolation_policy ON deals;
  DROP POLICY IF EXISTS deal_select ON deals;
  DROP POLICY IF EXISTS deal_insert ON deals;
  DROP POLICY IF EXISTS deal_update ON deals;
  DROP POLICY IF EXISTS deal_delete ON deals;

  -- 2. Configure TEMPLATE_REGISTRY policies
  ALTER TABLE template_registry ENABLE ROW LEVEL SECURITY;

  CREATE POLICY tmpl_select ON template_registry FOR SELECT
      TO authenticated
      USING (
          customer_account_id IS NULL
          OR customer_account_id = ((SELECT auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid)
      );

  CREATE POLICY tmpl_insert ON template_registry FOR INSERT
      TO authenticated
      WITH CHECK (
          customer_account_id = ((SELECT auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid)
      );

  CREATE POLICY tmpl_update ON template_registry FOR UPDATE
      TO authenticated
      USING (
          customer_account_id = ((SELECT auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid)
      )
      WITH CHECK (
          customer_account_id = ((SELECT auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid)
      );

  CREATE POLICY tmpl_delete ON template_registry FOR DELETE
      TO authenticated
      USING (
          customer_account_id = ((SELECT auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid)
      );

  -- 3. Configure USER_ACCOUNT_ROLES lock (SELECT-only to server key, deny-all to client REST API)
  ALTER TABLE user_account_roles ENABLE ROW LEVEL SECURITY;

  -- 4. Configure CONTACTS policies
  ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

  CREATE POLICY contact_select ON contacts FOR SELECT
      TO authenticated
      USING (
          customer_account_id = ((SELECT auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid)
      );

  CREATE POLICY contact_insert ON contacts FOR INSERT
      TO authenticated
      WITH CHECK (
          customer_account_id = ((SELECT auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid)
      );

  CREATE POLICY contact_update ON contacts FOR UPDATE
      TO authenticated
      USING (
          customer_account_id = ((SELECT auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid)
      )
      WITH CHECK (
          customer_account_id = ((SELECT auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid)
      );

  CREATE POLICY contact_delete ON contacts FOR DELETE
      TO authenticated
      USING (
          customer_account_id = ((SELECT auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid)
      );

  -- 5. Configure DEALS policies (Join-based mapping to contacts)
  ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

  CREATE POLICY deal_select ON deals FOR SELECT
      TO authenticated
      USING (
          contact_id IN (
              SELECT contacts.id FROM contacts 
              WHERE contacts.customer_account_id = ((SELECT auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid)
          )
      );

  CREATE POLICY deal_insert ON deals FOR INSERT
      TO authenticated
      WITH CHECK (
          contact_id IN (
              SELECT contacts.id FROM contacts 
              WHERE contacts.customer_account_id = ((SELECT auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid)
          )
      );

  CREATE POLICY deal_update ON deals FOR UPDATE
      TO authenticated
      USING (
          contact_id IN (
              SELECT contacts.id FROM contacts 
              WHERE contacts.customer_account_id = ((SELECT auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid)
          )
      )
      WITH CHECK (
          contact_id IN (
              SELECT contacts.id FROM contacts 
              WHERE contacts.customer_account_id = ((SELECT auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid)
          )
      );

  CREATE POLICY deal_delete ON deals FOR DELETE
      TO authenticated
      USING (
          contact_id IN (
              SELECT contacts.id FROM contacts 
              WHERE contacts.customer_account_id = ((SELECT auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid)
          )
      );

COMMIT;
