-- =============================================================================
-- CISEM Mandatory Code Header
-- File           : 2026-08-23__AntigravityLocal__YarivGovernor__Stage5_Tenant_Resolution_Rewrite__V1.1.sql
-- Ratified Plan  : CISEM-IP-20260822-PEOPLE-PLACES-FILES V19 (Stage 5)
-- Architectural  : Resolves active tenant from JWT claim validated against live membership in user_account_roles.
--                  MUST BE DECLARED SECURITY DEFINER to avoid infinite recursion when querying RLS tables.
--                  NO FALLBACK TO DEFAULT TENANT: if no active_tenant_id or invalid membership, returns NULL.
-- Axioms         : AX-SECURITY-01, AX-STATELESS-01, U1.2.40
-- =============================================================================

-- 1. Create or Replace Active Tenant Resolution Function
CREATE OR REPLACE FUNCTION public.get_active_tenant_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_claims JSONB;
    v_requested_tenant UUID;
    v_verified_tenant UUID;
BEGIN
    -- Read JWT claims from current request context
    v_claims := NULLIF(current_setting('request.jwt.claims', true), '')::jsonb;
    IF v_claims IS NULL THEN
        RETURN NULL;
    END IF;

    -- Extract active_tenant_id from app_metadata in JWT payload
    -- FAULT FIX 1: NO FALLBACK to static tenant_id. Unset means NULL.
    v_requested_tenant := NULLIF(v_claims -> 'app_metadata' ->> 'active_tenant_id', '')::uuid;

    IF v_requested_tenant IS NULL THEN
        RETURN NULL;
    END IF;

    -- Validate that current authenticated user (auth.uid()) is an active member of the requested tenant
    SELECT customer_account_id INTO v_verified_tenant
    FROM public.user_account_roles
    WHERE user_id = auth.uid()
      AND customer_account_id = v_requested_tenant
    LIMIT 1;

    RETURN v_verified_tenant;
END;
$$;

-- Grant execution permission to authenticated role
GRANT EXECUTE ON FUNCTION public.get_active_tenant_id() TO authenticated;
