# CISEM Canon — C · Data & Persistence

**Address:** `C` · **Depends on:** A, B · **Serves:** D, E, F, G
**Addressing scheme:** `A.0`
**Status:** Draft for GOVERNOR ratification

---

## C.0 — Charter

### C.0.1 — Purpose
`RATIFIED-PENDING` · The database: schema, Row-Level Security, migrations, the data-access boundary, and the classification that separates platform core from vertical.

**Plain:** This spine is the wall between customers. It decides which rows a request can see and change, and it enforces that in the database itself — so it holds no matter what any application code does or forgets.

### C.0.2 — Database authority is GOVERNOR-only
`RATIFIED 2026-08-12` · ANTIGRAVITY cannot reach Postgres — no credentials, and the Supabase client cannot execute DDL. It confirmed this itself. **A proposal to work around it is rejected on sight.**

---

## C.1 — State

### C.1.01 — Two products in one database
`CONFIRMED` · The schema is a corporate-gifts B2B operation: `catalog_items`, `branding_subcontractors`, `branding_rate_cards`, `supplier_mappings`, `product_variations`, `deals`, workspace domain `corporate_gifts`, seeded "Israel Gifting Workspace". The frontend is generic project management. **Nothing joins them.**

This is not a topology decision to declare (`A.3.07`). It is a schema fact.

### C.1.02 — Table classification
`PARTIALLY CONFIRMED` · Confidence marked per row.

**Class P — Platform core**

| Table | Confidence |
|---|---|
| `users`, `user_account_roles`, `customer_accounts`, `workspaces` | confirmed |
| `template_registry` | confirmed |
| `packages`, `feature_registry`, `package_feature_grants` | confirmed to exist; contents unverified |
| `role_definitions` | confirmed — 2 test rows |
| `navigation_menu_items`, `status_library`, `tag_library`, `lookup_registry`, `custom_libraries` | **inferred from name** |
| `state_transitions`, `backlog_registry`, `document_chunks`, `pdf_queue` | **inferred from name** |

**Class V — Vertical (gifting)**

| Table | Confidence |
|---|---|
| `catalog_items`, `catalog_item_sandbox_variants` | confirmed |
| `product_groups`, `product_variations` | confirmed |
| `branding_subcontractors`, `branding_rate_cards`, `supplier_mappings` | confirmed |
| `briefs`, `proposals`, `proposal_items`, `proposal_client_drafts` | **inferred from name** |

**Class C — CRM**

| Table | Confidence |
|---|---|
| `contacts`, `deals` | confirmed — policied; classification open (`C.5.10`) |

### C.1.03 — RLS coverage
`CONFIRMED 2026-08-12` · 31 tables, all `rowsecurity = true`. 14 policies across 6 tables. **25 tables have RLS enabled and zero policies** — deny-all once the secret key is dropped.

### C.1.04 — Repo SQL diverges from the live schema
`CONFIRMED` · `schema.sql` and `migrations.sql` document a fraction of the live 31 tables. **Treat repo SQL as history, not state.** Any claim about the database derived from repo files is structurally unreliable.

### C.1.05 — Backend connects with the secret key
`CONFIRMED` · `SUPABASE_KEY` is a `service_role`-class secret. **It bypasses RLS entirely.** Every policy in this spine is currently inert.

---

## C.2 — Decision

### C.2.01 — Logical partitioning by `customer_account_id`, enforced by RLS
`RATIFIED 2026-08-12` · Already existed; formalised rather than chosen. `closes: A.3.03`

### C.2.02 — `user_account_roles` is deny-all to clients
`RATIFIED 2026-08-12` · RLS enabled, zero policies. All reads and writes go through server-side endpoints.

**Plain:** The table that decides who is allowed to do what must not be editable by the people it is deciding about. The simplest way to guarantee that is to make it invisible to them entirely.

**Structured:** `closes: C.3.02` · `supersedes: prior FOR ALL tenant-equality policy`

### C.2.03 — Split read and write policies
`RATIFIED 2026-08-12` · Every table gets separate SELECT / INSERT / UPDATE / DELETE policies. Never `FOR ALL`. Every write policy carries an explicit `WITH CHECK`.

**Plain:** Postgres quietly reuses the "what can you see" rule as the "what can you change" rule unless you write both. That single default caused both security holes found in this system.

**Structured:** `closes: C.3.01, C.3.02` · `enforced_by: A.4.04` · `regression_count: 2` (`A.3.11`, `A.3.12`)

### C.2.04 — Canonical templates readable by authenticated users only
`RATIFIED 2026-08-12` · `tmpl_select` carries `customer_account_id IS NULL` — but `TO authenticated`, not public. **Explicit choice**, not a side effect. Revisit if the public template gallery is pursued (`D.5.10`).

### C.2.05 — Grant `TO authenticated`, never `{public}`
`RATIFIED 2026-08-12` · All 12 new policies target `authenticated`. `enforced_by: A.4.04`

### C.2.06 — Subselect-wrap the auth call
`RATIFIED 2026-08-12` · `(SELECT auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid` evaluates once per query; unwrapped, it evaluates per row. Matters at `catalog_items` scale.

### C.2.07 — No explicit `BEGIN`/`COMMIT` in the Supabase SQL editor
`RATIFIED 2026-08-12` · The editor wraps statements itself; an explicit block raises `42601: syntax error at end of input`. Atomicity comes from the editor's own wrapper.

---

## C.3 — Finding

| ID | Finding | Status | Evidence |
|---|---|---|---|
| `C.3.01` | `template_registry`: `FOR ALL` + `IS NULL` in `USING` + no `WITH CHECK` → any tenant could insert, update, **and delete** operator canonical templates | ✅ `CLOSED` | policy count 4; split policies verified |
| `C.3.02` | `user_account_roles`: `FOR ALL` with tenant-equality only → any tenant member could grant themselves any role | ✅ `CLOSED` | absent from `pg_policies` |
| `C.3.03` | Tenant identity read from `request.headers` — **client-supplied and forgeable** by anyone with the publishable key | ✅ `CLOSED` on 4 tables | `qual` now reads `app_metadata` |
| `C.3.04` | **25 tables with RLS enabled and zero policies** | ⬜ `OPEN` | E4 exit 1, 25 named |
| `C.3.05` | `branding_subcontractors` / `supplier_mappings`: role gates not tenant-scoped; SELECT-only so writes deny-all; subquery reads `users`, which itself has RLS and no policy → self-defeating | ⬜ `KNOWN` | E4 tracked |
| `C.3.06` | Repo SQL diverges from live schema | ⬜ `OPEN` | `C.1.04` |
| `C.3.07` | `/api/v1/[...path]` proxy **fails open** into `getMockData()` on backend failure — a tenant is silently served fabricated data instead of a 503 | ⬜ `OPEN` | route source |
| `C.3.08` | `service_role` in use → **all RLS is bypassed today** | ⬜ `OPEN` | `C.1.05` |
| `C.3.10` | Migration reported "Success. No rows returned" while applying 2 of 12 statements | ✅ `CLOSED` | detected by policy count; `A.4.03` prevents recurrence |
| `C.3.11` | No record of which migrations have been applied | ⬜ `OPEN` | → `A.4.11` |

**`C.3.07` note:** this is the backend twin of `F.3.13`. Same principle both layers — **fail visibly, never plausibly.** Also the same failure class as `A.3.30`: a convincing artifact standing in for a real one.

---

## C.4 — Mechanism

| ID | Mechanism | Tier | Status |
|---|---|---|---|
| `C.4.01` | RLS policy with explicit `WITH CHECK` — Postgres refuses regardless of application code | **T5** | ✅ on 4 tables |
| `C.4.02` | `A.4.03` (E3) drift detector — live state vs committed snapshot | T3 | ✅ |
| `C.4.03` | `A.4.04` (E4) policy linter — 6 invariants | T3 | ✅ |
| `C.4.04` | `A.4.05` (E5) two-tenant isolation test | T3 | ⬜ |
| `C.4.05` | `A.4.11` (E11) applied-migration ledger | T3 | ⬜ |
| `C.4.06` | `cisem_policy_snapshot()` / `cisem_rls_status()` — SECURITY DEFINER, metadata only, EXECUTE granted to `service_role` only | T5 | ✅ |

### C.4.10 — Database protocol
`RATIFIED 2026-08-12`

1. **GOVERNOR only.** ANTIGRAVITY cannot reach Postgres.
2. **One transaction per migration.** No explicit `BEGIN`/`COMMIT` in the Supabase editor (`C.2.07`).
3. **Verify by count, not message.** `SELECT tablename, count(*) FROM pg_policies GROUP BY tablename`.
4. **Run E3 + E4 after every change.**
5. **Re-baseline deliberately.** `--update` only for intended change; commit the snapshot with the migration.
6. **Read predicates are never write predicates** (`C.2.03`).
7. **One tenant authority** (`B.0.2`).
8. **Never delete a credential before its replacement is proven working.**

---

## C.5 — Sequence

| ID | Task | Depends on | Blocks |
|---|---|---|---|
| `C.5.01` | Confirm the `C.1.02` classification against actual columns; identify the tenant column per Class V table | GOVERNOR + read-only agent | `C.5.02` |
| `C.5.02` | Decide the policy pattern per class: tenant-scoped / read-all-authenticated / server-only | `C.5.01` | `C.5.03` |
| `C.5.03` | Write policies for the 25 uncovered tables, in batches by class. E3+E4 after each batch. | `C.5.02` | `C.5.04` |
| `C.5.04` | Replace the two legacy `{public}` role gates (`C.3.05`) | `C.5.03` | — |
| `C.5.05` | **E4 reaches zero errors** — the gate for the key swap | `C.5.03`, `C.5.04` | `C.5.06` |
| `C.5.06` | Swap `service_role` → scoped key | `C.5.05`, `B.5.03` | `C.6.02` |
| `C.5.07` | Proxy fail-open → 503 (`C.3.07`) | — | — |
| `C.5.10` | Decide: are `contacts`/`deals` platform CRM or gifting vertical? | GOVERNOR | extraction boundary |

**Ordering warning:** `C.5.06` before `C.5.05` takes `catalog_items` dark — the UVP core returns zero rows. E4 tells you when you are ready.

---

## C.6 — Verification

### C.6.01 — Policy migration
`VERIFIED 2026-08-12` · 12 policies applied: `template_registry` 4, `contacts` 4, `deals` 4. `user_account_roles` deny-all. All `TO authenticated`, all writes with explicit `WITH CHECK`, all reading `app_metadata`. E3 exit 0.

**Method note:** the SQL editor reported success twice while having applied 2 of 12 statements. Only a per-table count caught it. **A success message is not evidence.**

### C.6.02 — Tenant isolation
`NOT VERIFIED` · The wall is **built and inert**. `service_role` bypasses it. Proof requires `A.4.05` (E5) green, which requires `C.5.06`.

### C.6.03 — Evidence standard
| Change | Proof |
|---|---|
| Any policy change | E3 exit 0 + E4 exit 0 + per-table policy count |
| Isolation | E5 two-tenant test green — **the only real proof** |
| Migration applied | Ledger entry + E3 clean, never the editor's banner |
