# G6 Connection Identity Audit Report
**Generated**: 2026-08-14
**Auditor role**: READ-ONLY -- no files modified except this report.
**Question answered**: Does the backend reach the database as a CONSTRAINED identity (RLS applies) or a PRIVILEGED identity (RLS bypassed)?

---

## Part A -- Credential Selection

### A1. Service-role / admin credential references

| Symbol | File | Line | Enclosing scope |
|---|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | `backend/src/backend/main.py` | 66 | Module scope |
| `SUPABASE_SERVICE_ROLE_KEY` | `backend/src/backend/main.py` | 87 | Module scope (guard block) |
| `SUPABASE_SERVICE_ROLE_KEY` | `backend/src/backend/main.py` | 90 | Module scope (admin singleton construction) |
| `SUPABASE_SERVICE_ROLE_KEY` | `backend/src/backend/main.py` | 92-93 | Module scope (else / warning) |
| `SUPABASE_SERVICE_ROLE_KEY` | `backend/src/backend/main.py` | 299,313,326,331 | `mint_tenant_claim` and `mint_claim_endpoint` |
| `service_key` | `backend/src/backend/2026-08-14__CisemCsAg__Backend__UserTenantClaimBackfill__V1.0.py` | 26 | `build_admin_client()` |

### A2. Anon / public credential references

| Symbol | File | Line | Enclosing scope |
|---|---|---|---|
| `SUPABASE_KEY` | `backend/src/backend/main.py` | 64 | Module scope |
| `SUPABASE_KEY` | `backend/src/backend/main.py` | 76-79 | Module scope (anon client construction) |
| `SUPABASE_KEY` | `backend/src/backend/main.py` | 178 | `tenant_context_middleware` -- dev bypass branch |
| `SUPABASE_KEY` | `backend/src/backend/main.py` | 181 | `tenant_context_middleware` -- dev bypass branch |
| `SUPABASE_KEY` | `backend/src/backend/main.py` | 274 | `tenant_context_middleware` -- production branch |
| `SUPABASE_KEY` | `backend/src/backend/seed_db.py` | 15 | Module scope. Comment: "Use Service Role Key for bypass of RLS during seeding" |
| `SUPABASE_KEY` | `backend/src/backend/seed_db.py` | 25 | Module scope (client construction) |
| `SUPABASE_KEY` | `cisem_core/ingest_wisdom.py` | 26 | Module scope |
| `SUPABASE_KEY` | `cisem_core/ingest_wisdom.py` | 35 | Module scope (client construction) |
| `SUPABASE_KEY` | `cisem_core/security/cisem_db.py` | 36 | `call_rpc()` function |
| `anon_key` | NOT FOUND | -- | -- |
| `SUPABASE_ANON` | NOT FOUND | -- | -- |
| `publishable` | NOT FOUND | -- | -- |

### A3. Supabase client construction calls

| Call | File | Line | Key symbol | Scope |
|---|---|---|---|---|
| `create_client(SUPABASE_URL, SUPABASE_KEY, options=options)` | `backend/src/backend/main.py` | 79 | `SUPABASE_KEY` | Module scope -- global anon singleton `_global_supabase` |
| `create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, options=_admin_options)` | `backend/src/backend/main.py` | 90 | `SUPABASE_SERVICE_ROLE_KEY` | Module scope -- admin singleton `supabase_admin` |
| `create_client(SUPABASE_URL, SUPABASE_KEY, options=opt)` | `backend/src/backend/main.py` | 181 | `SUPABASE_KEY` | Inside `tenant_context_middleware` -- dev bypass branch |
| `create_client(SUPABASE_URL, SUPABASE_KEY, options=opt)` | `backend/src/backend/main.py` | 274 | `SUPABASE_KEY` | Inside `tenant_context_middleware` -- production path |
| `create_client(SUPABASE_URL, SUPABASE_KEY, options=options)` | `backend/src/backend/seed_db.py` | 25 | `SUPABASE_KEY` | Module scope (offline script) |
| `create_client(SUPABASE_URL, SUPABASE_KEY, options=options)` | `cisem_core/ingest_wisdom.py` | 35 | `SUPABASE_KEY` | Module scope (offline script) |
| `create_client(url, service_key, options=opts)` | `backend/src/backend/2026-08-14__CisemCsAg__Backend__UserTenantClaimBackfill__V1.0.py` | 32 | `service_key` (= `SUPABASE_SERVICE_ROLE_KEY`) | `build_admin_client()` (offline script) |
| `createClient` (JS/TS) | NOT FOUND | -- | -- | -- |

### A4. Direct Postgres connections

| Pattern | Status |
|---|---|
| `psycopg` / `psycopg2` | NOT FOUND |
| `asyncpg` | NOT FOUND |
| `sqlalchemy` / `create_engine` / `create_async_engine` | NOT FOUND |
| `DATABASE_URL` / `POSTGRES_URL` / `DSN` | NOT FOUND |

All database access routes through the Supabase PostgREST client (supabase-py). No direct Postgres connections found.

### A5. RLS-bypass markers

| Pattern | File | Line | Notes |
|---|---|---|---|
| `SECURITY DEFINER` | `cisem_core/security/cisem_db.py` | 4 | Comment only. References two expected SQL functions: `cisem_policy_snapshot()` and `cisem_rls_status()`. No SQL DDL found in this file. |
| `BYPASSRLS` | NOT FOUND | -- | -- |
| `SET ROLE` | NOT FOUND | -- | -- |
| `set_config('role'` | NOT FOUND | -- | -- |
| `GRANT` (as SQL privilege statement) | NOT FOUND | -- | Three occurrences of the word: one is a table name (`package_feature_grants`), one is a regex pattern in a sanitizer, one is a comment in a lint tool. None are SQL privilege grants. |

---

## Part B -- Request Path

### B1. Client creation: singleton vs per-request

| Variable | File | Lines | Creation scope | Key symbol |
|---|---|---|---|---|
| `_global_supabase` | `backend/src/backend/main.py` | 79 | Module scope (SINGLETON) | `SUPABASE_KEY` |
| `supabase` (SupabaseProxy) | `backend/src/backend/main.py` | 80 | Module scope -- delegates to `get_db_client()` which reads `_db_client_context` ContextVar | Resolves dynamically |
| `supabase_admin` | `backend/src/backend/main.py` | 90 | Module scope (SINGLETON) | `SUPABASE_SERVICE_ROLE_KEY` |
| `scoped_client` (dev bypass) | `backend/src/backend/main.py` | 181 | PER-REQUEST -- inside middleware, dev bypass branch | `SUPABASE_KEY` |
| `scoped_client` (production) | `backend/src/backend/main.py` | 274 | PER-REQUEST -- inside middleware, production branch | `SUPABASE_KEY` |

Mechanism: `SupabaseProxy.__getattr__` (line 57-58) calls `get_db_client()` (line 50-54), which returns `_db_client_context.get()` if set, else falls back to `_global_supabase`. The middleware sets the context var at lines 182/275 before `call_next`, resets it in `finally` at lines 186/279.

### B2. Caller JWT propagated to database

| Pattern | File | Line | Description |
|---|---|---|---|
| `request.headers.get("Authorization")` | `backend/src/backend/main.py` | 166 | Middleware reads incoming Bearer token |
| `"Authorization": f"Bearer {token}"` | `backend/src/backend/main.py` | 271 | Caller's original JWT forwarded on scoped client -- PRODUCTION PATH |
| `"Authorization": f"Bearer {SUPABASE_KEY}"` | `backend/src/backend/main.py` | 178 | SUPABASE_KEY (not caller JWT) forwarded -- DEV BYPASS ONLY |
| `postgrest.auth(` | NOT FOUND | -- | -- |
| `set_session` | NOT FOUND | -- | -- |
| `set_config('request.jwt` | NOT FOUND | -- | -- |
| `current_setting('request.jwt` | NOT FOUND | -- | -- |

In the production path, the caller's original JWT is set as the Authorization header on the scoped PostgREST client at main.py:271. Supabase PostgREST uses this JWT to evaluate RLS policies under the `authenticated` role.

### B3. Route-to-client mapping

| Route | File | Lines | DB client | Classification |
|---|---|---|---|---|
| `POST /api/v1/auth/claim` | `main.py` | 321-342 | `supabase_admin` (via `mint_tenant_claim`) | **SERVICE-ROLE ROUTE** |
| `GET /` | `main.py` | 408-414 | No table query | N/A |
| `POST /api/v1/prospects/scrape` | `main.py` | 421-427 | No DB call | N/A |
| `GET /api/v1/cael/status` | `main.py` | 454-470 | Filesystem read only | N/A |
| `POST /api/v1/cael/ratify` | `main.py` | 473-490 | Filesystem write only | N/A |
| `GET /api/v1/tenant/whitelabel` | `main.py` | 557-560 | No DB -- in-memory dict | N/A |
| `POST /api/v1/tenant/whitelabel` | `main.py` | 562-580 | No DB -- in-memory dict | N/A |
| All remaining ~38 routes | `main.py` | various | `supabase` SupabaseProxy -> `scoped_client` (per-request, caller JWT) | Standard (RLS-constrained) |

Note on `POST /api/v1/search` (line 434): Uses `VectorSearchService(supabase)` but reads tenant identity from the raw `x-tenant-id` HTTP header, not from `request.state.tenant_id` set by the middleware's JWT extraction path.

`parking_vault_router` (included at line 101): No `supabase.table` or `supabase_admin` calls found in `parking_vault_router.py`.

### B4. Tenant middleware

| Item | Detail | File | Line(s) |
|---|---|---|---|
| Middleware function | `tenant_context_middleware` | `backend/src/backend/main.py` | 138-289 |
| Tenant identity read FROM | `payload["app_metadata"]["tenant_id"]` -- from locally decoded ES256 JWT | `main.py` | 252-253 |
| Reads `app_metadata` | YES: `payload.get("app_metadata") or {}` then `.get("tenant_id")` | `main.py` | 252-253 |
| Reads `user_metadata` | NO -- not present in middleware code | `main.py` | 251 (comment) |
| Role read FROM | `app_metadata.get("role", "member")` -- default "member" | `main.py` | 266 |
| Dev bypass tenant identity | `x-tenant-id` header value, fallback `"dev-tenant-1"` | `main.py` | 171 |
| Dev bypass trigger conditions | `is_dev` AND (no auth_header OR auth_header == "Bearer dev-token" OR `x-tenant-context` header present) | `main.py` | 170 |

---

## Part C -- Live Database State (Executed 2026-08-14)

### C1. Session identity

NOT RUN -- no direct agent connection. Data provided by Governor.

### C2. pg_roles

NOT PROVIDED in this session. Gap G-05 remains open.

### C3. pg_class -- RLS status per table

All 31 tables in the public schema have rls_enabled = true, rls_forced = false.

| table_name | rls_enabled | rls_forced |
|---|---|---|
| backlog_registry | true | false |
| branding_rate_cards | true | false |
| branding_subcontractors | true | false |
| briefs | true | false |
| catalog_item_sandbox_variants | true | false |
| catalog_items | true | false |
| contacts | true | false |
| custom_libraries | true | false |
| customer_accounts | true | false |
| deals | true | false |
| document_chunks | true | false |
| feature_registry | true | false |
| lookup_registry | true | false |
| navigation_menu_items | true | false |
| package_feature_grants | true | false |
| packages | true | false |
| pdf_queue | true | false |
| product_groups | true | false |
| product_variations | true | false |
| proposal_client_drafts | true | false |
| proposal_items | true | false |
| proposals | true | false |
| role_definitions | true | false |
| state_transitions | true | false |
| status_library | true | false |
| supplier_mappings | true | false |
| tag_library | true | false |
| template_registry | true | false |
| user_account_roles | true | false |
| users | true | false |
| workspaces | true | false |

rls_forced = false on ALL tables: service_role bypasses RLS (expected Supabase behaviour).

### C4. pg_policies -- active policies

| tablename | policyname | permissive | roles | cmd |
|---|---|---|---|---|
| branding_subcontractors | Admins and Sales Agents Only on Subcontractors | PERMISSIVE | {public} | SELECT |
| contacts | contact_delete | PERMISSIVE | {authenticated} | DELETE |
| contacts | contact_insert | PERMISSIVE | {authenticated} | INSERT |
| contacts | contact_select | PERMISSIVE | {authenticated} | SELECT |
| contacts | contact_update | PERMISSIVE | {authenticated} | UPDATE |
| deals | deal_delete | PERMISSIVE | {authenticated} | DELETE |
| deals | deal_insert | PERMISSIVE | {authenticated} | INSERT |
| deals | deal_select | PERMISSIVE | {authenticated} | SELECT |
| deals | deal_update | PERMISSIVE | {authenticated} | UPDATE |
| supplier_mappings | Admins and Sales Agents Only on Supplier Mappings | PERMISSIVE | {public} | SELECT |
| template_registry | tmpl_delete | PERMISSIVE | {authenticated} | DELETE |
| template_registry | tmpl_insert | PERMISSIVE | {authenticated} | INSERT |
| template_registry | tmpl_select | PERMISSIVE | {authenticated} | SELECT |
| template_registry | tmpl_update | PERMISSIVE | {authenticated} | UPDATE |

Tables with rls_enabled = true and ZERO policies (26 tables -- implicit DENY ALL for authenticated role):
backlog_registry, branding_rate_cards, briefs, catalog_item_sandbox_variants, catalog_items,
custom_libraries, customer_accounts, document_chunks, feature_registry, lookup_registry,
navigation_menu_items, package_feature_grants, packages, pdf_queue, product_groups,
product_variations, proposal_client_drafts, proposal_items, proposals, role_definitions,
state_transitions, status_library, tag_library, user_account_roles, users, workspaces

---

## GAPS (Updated after Part C)

| ID | Item | Status |
|---|---|---|
| G-01 | Key type in SUPABASE_KEY at runtime (anon vs service-role) | CANNOT ANSWER WITHOUT DISCLOSURE -- CRITICAL: determines whether 26 zero-policy tables are accessible in production |
| G-02 | seed_db.py comment accuracy re: SUPABASE_KEY key type | CANNOT ANSWER WITHOUT DISCLOSURE |
| G-03 | SQL functions cisem_policy_snapshot() and cisem_rls_status() in live DB | NOT FOUND in local files; not verified in live DB |
| G-04 | POST /api/v1/search x-tenant-id header spoofing risk | UNVERIFIED -- no validation code found in route handler |
| G-05 | pg_roles rolbypassrls for the identity used by SUPABASE_KEY | NOT PROVIDED BY GOVERNOR |
| G-06 (CLOSED) | pg_policies existence post-migration | CONFIRMED -- 14 policies across contacts, deals, template_registry |
| G-07 | .env files credential values | NOT READ per audit rules |
| G-08 | ingest_wisdom.py SUPABASE_KEY key type at runtime | CANNOT ANSWER WITHOUT DISCLOSURE |
| G-09 (NEW) | branding_subcontractors and supplier_mappings policies bound to {public} -- QUAL expression unknown | UNVERIFIED -- qual column not provided; {public} may allow unauthenticated reads |
| G-10 (NEW) | 26 tables with rls_enabled=true and zero policies -- application impact | UNVERIFIED -- depends on G-01 key type; if SUPABASE_KEY is anon key, all 26 tables are inaccessible to authenticated users in production |