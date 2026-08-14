# CISEM Canon — B · Identity & Tenancy

**Address:** `B` · **Depends on:** A · **Serves:** C, D, E, F, G
**Addressing scheme:** `A.0`
**Status:** Draft for GOVERNOR ratification

---

## B.0 — Charter

### B.0.1 — Purpose
`RATIFIED-PENDING` · Who a caller is, which tenant they act for, and what role they hold. Owns the claim, its minting, its verification, and its lifecycle.

**Plain:** This spine answers one question — when a request arrives, who sent it and which customer do they belong to? Everything about data access depends on getting that answer right and making it impossible to fake.

**Boundary:** B owns identity *establishment*. C owns identity *enforcement* at the database. B produces the claim; C's policies read it.

### B.0.2 — The single authority
`RATIFIED 2026-08-12` · Tenant identity is `auth.jwt() -> 'app_metadata' ->> 'tenant_id'`, a cryptographically signed claim. **No other source is an authority.** Not a header, not a database lookup at request time, not client state.

---

## B.1 — State

### B.1.01 — Three competing authorities exist today
`CONFIRMED` · Three independent mechanisms answer "who is this":

| Layer | Mechanism | Trustworthiness |
|---|---|---|
| Next.js | HMAC-SHA256 signed `x-tenant-context` header, `src/lib/tenant_context.ts` | Secret is `dev-secret-key-9999`; has a dev fallback issuing a default context |
| FastAPI | Supabase JWT → `auth.get_user()` → `user_account_roles` lookup | Sound but circular (`B.3.04`) and a network round-trip per request |
| Postgres RLS | `current_setting('request.headers') ->> 'x-current-tenant-id'` | **Client-supplied. Forgeable.** Closed on 4 tables; see `C.3.03` |

### B.1.02 — JWT signing algorithm
`CONFIRMED 2026-08-12` · Project `kzuqwiplufvtrzmmcacw` signs with **ES256** (asymmetric, EC P-256), JWKS at `/auth/v1/.well-known/jwks.json`, `kid` present. Verified by live HTTP request returning 200. **Not HS256.** `SUPABASE_JWT_SECRET` does not exist in the environment.

### B.1.03 — No client-side auth exists
`CONFIRMED` · No login page, no signup flow, no session refresh in `src/`. `useUIStore` supplies `activeUserId` (default `'user-operator'`) and `simulatedRole` (default `'operator_admin'`) from `localStorage` as dev-mode impersonation.

### B.1.04 — Role taxonomy is unbuilt
`CONFIRMED` · `role_definitions` contains 2 rows, both labelled "Test role definition", created 2026-08-10: `operator_admin`, `account_owner`. No real taxonomy exists.

### B.1.05 — Auth routing does not pass through FastAPI
`CONFIRMED` · Supabase auth is client → GoTrue directly (`<project>.supabase.co/auth/v1/token`, `/signup`). The FastAPI backend never sees login or signup. See `A.3.21`.

---

## B.2 — Decision

### B.2.01 — Supabase Auth, not Firebase
`RATIFIED 2026-08-12` · **Rejected:** Firebase Auth.

**Plain:** The system already used Supabase to check who users are, and it worked. Switching to Firebase would have meant tearing out working code to replace it with equivalent code.

**Structured:** `evidence: tenant_context_middleware calls _global_supabase.auth.get_user()` · `supersedes: prior review decision D3` · `closes: A.3.02`

### B.2.02 — `app_metadata`, never `user_metadata`
`RATIFIED 2026-08-12`

**Plain:** There are two places to store information about a user. One of them the user can edit themselves from their own browser. Tenant identity goes in the other one.

**Structured:** `app_metadata` is writable only via the Admin API with the secret key. `user_metadata` is writable by the user via `supabase.auth.updateUser()`. RLS predicate reads `auth.jwt() -> 'app_metadata' ->> 'tenant_id'` (nested, one level down). `enforced_by: A.4.09` · `regression_count: 3` (`A.3.10`)

### B.2.03 — One-way flow: table → claim
`RATIFIED 2026-08-12` · `user_account_roles` is the source of truth. Claims are minted *from* it by server-side code. **Never mirrored back** — that would make the derived artifact authoritative over the durable one.

### B.2.04 — Single `active_tenant_id`, not a list
`RATIFIED 2026-08-12` · One tenant in the claim. Membership lives in `user_account_roles`. Switching tenants is a server-side call that validates membership and re-mints the token. **Reason:** keeps RLS predicates simple and fast. Multi-tenant membership is supported by the model without complicating every policy.

### B.2.05 — Staleness split
`RATIFIED 2026-08-12`

**Plain:** A signed claim is a snapshot. If you remove someone's admin role, their existing login keeps it until it expires. So ordinary reads trust the claim, and dangerous actions re-check the database live.

**Structured:** Reads → claim via RLS (fast path). High-blast-radius writes (billing, tenant config, template deletion, role changes) → live `user_account_roles` query. **Open:** `B.5.10` — the specific operation list and the token lifetime are undefined.

### B.2.06 — FastAPI broker for claim minting, not a `pg_net` trigger
`RATIFIED 2026-08-12` · **Rejected:** Postgres trigger calling the Admin API via `pg_net`.

**Reason:** HTTP loopback inside a database transaction couples the transaction to network latency, fails silently, and is hard to retry or monitor. **Accepted cost:** direct writes to `user_account_roles` bypass sync — but that table is now deny-all to clients (`C.2.02`), so the only writers are your own code and the dashboard.

### B.2.07 — Local JWT verification, not `get_user()`
`PROPOSED` · Verify the ES256 signature locally against JWKS. `get_user()` is an HTTP round-trip to GoTrue on every request and belongs only where live user state is genuinely needed. `depends_on: B.1.02`

---

## B.3 — Finding

| ID | Finding | Status |
|---|---|---|
| `B.3.01` | Three competing tenant authorities (`B.1.01`) | `OPEN` → `B.5.04` |
| `B.3.02` | `verifyTenantContext` dev fallback **issues a valid default tenant context** when the secret is absent | `OPEN` → `B.5.04` |
| `B.3.03` | `TENANT_SIGNING_SECRET=dev-secret-key-9999` — guessable; protects the entire Next.js tenant path including the enterprise tier gate | `OPEN` → resolved by deleting the path, not re-keying it |
| `B.3.04` | `request.state.tenant_id` derived *from* `user_account_roles`, so any role check against that table using it is circular | `OPEN` → `B.5.03` |
| `B.3.05` | No claim-minting code exists; no user has `app_metadata.tenant_id` | `OPEN` → `B.5.01` **blocks `B.5.03`** |
| `B.3.06` | Role taxonomy is two test rows (`B.1.04`) | `OPEN` → `B.5.10` |
| `B.3.07` | Token lifetime and the live-recheck operation list undefined (`B.2.05`) | `OPEN` |

---

## B.4 — Mechanism

| ID | Mechanism | Tier | Status |
|---|---|---|---|
| `B.4.01` | `app_metadata` writable only via Admin API + secret key | **T5** (Supabase-enforced) | ✅ inherent |
| `B.4.02` | ES256 signature verification — claim cannot be forged | **T5** (cryptographic) | ⬜ pending `B.5.03` |
| `B.4.03` | `A.4.09` (E9) banned-token scan catches `user_metadata` near auth | T3 | ⬜ |
| `B.4.04` | **Deleting** the HMAC path makes the second authority *absent* rather than forbidden | **T4** | ⬜ `B.5.04` |

**Note:** `B.4.04` is the highest-value item in this spine. A deleted alternative cannot be chosen. `B.3.01`, `B.3.02`, and `B.3.03` all close together when it lands.

---

## B.5 — Sequence

| ID | Task | Depends on | Blocks |
|---|---|---|---|
| `B.5.01` | Claim-minting endpoint — FastAPI broker writing `app_metadata` via Admin API, at signup and invite acceptance | `B.2.02`, `B.2.06` | `B.5.03` |
| `B.5.02` | Backfill runner — read `user_account_roles`, write `app_metadata.tenant_id` for every existing user | `B.5.01` | `B.5.03` |
| `B.5.03` | Rewrite `tenant_context_middleware`: local ES256 JWKS verification (`cache_keys=True`), no default role, exempt list generated from `app.routes`, `PyJWKClientError` handled, `call_next` outside the try | `B.5.01`, `B.5.02` | `C.5.04` |
| `B.5.04` | Delete the Next.js HMAC path, `verifyTenantContext`, and its dev fallback | `B.5.03` | — |
| `B.5.10` | Define the real role taxonomy; populate `role_definitions` | GOVERNOR | `D.5.02` |
| `B.5.11` | Decide token lifetime and the live-recheck operation list | GOVERNOR | — |

**Ordering warning:** `B.5.03` before `B.5.01`+`B.5.02` produces a **total outage** — every authenticated request 403s, including GOVERNOR's. See `A.3.22`.

---

## B.6 — Verification

### B.6.01 — Evidence standard
| Change | Proof |
|---|---|
| Claim minting | A freshly signed token contains `app_metadata.tenant_id`, read from the decoded payload |
| Backfill | Count of users with the claim equals count of rows in `user_account_roles` |
| Middleware | A real token passes **and** a forged token is rejected. Both, not either. |
| Authority collapse | `grep` for `x-tenant-context` and `request.headers` returns nothing |

### B.6.02 — Current standing
`NOT VERIFIED` · No claim exists yet. `C`'s policies read a claim nothing currently sets — correct build order, but the wall is not live.
