# I2 · CsAg · Identity & Tenancy

> ⚠️ **AUTHORED BY REVIEWER · AWAITING GOVERNOR RATIFICATION.** Every judgment call in this document was made by the reviewer, not the governor. Items carrying `RATIFIED` inherit a decision explicitly taken in session; all structure, sequencing, classification, and status assignment is proposed. See `R00` for the itemised list.


**Tier:** I — Instance. **Mirrors:** `U2`. **Cycle:** Co1 · pass 1.
**Rule:** every item cites the `U` item it instantiates. No general principles here.

---

## I2.0 — Charter

```
purpose:     How CISEM CsAg establishes who a caller is and which tenant
             they act for, as it stands today.
boundary:    I2 holds this system's identity facts and work. I3 holds
             enforcement at the database.
depends_on:  U2, I1
governs:     I3–I6
invariant:   governed_by U2.0 — exactly one authority, cryptographically bound.
```

**This is a first-cycle topic.** Everything above it is provisional until it seals.

---

## I2.1 — State

### I2.1.01 — Three competing authorities are live
`CONFIRMED` · `governed_by: U2.2.01`

| Layer | Mechanism | Trustworthiness |
|---|---|---|
| Next.js | HMAC-signed `x-tenant-context` header | Secret is a guessable placeholder; a dev fallback issues a default context |
| FastAPI | Supabase JWT → `auth.get_user()` → `user_account_roles` lookup | Sound but circular (`I2.3.04`) and a network round-trip per request |
| Postgres RLS | `request.headers ->> 'x-current-tenant-id'` | **Client-supplied, forgeable.** Closed on 4 tables |

### I2.1.02 — Signing algorithm is ES256
`CONFIRMED 2026-08-12` · source: live JWKS endpoint returned 200 with `kty: EC`, `crv: P-256`, `alg: ES256`, `kid` present. `SUPABASE_JWT_SECRET` does not exist in the environment. · `governed_by: U2.2.02`

### I2.1.03 — No client-side auth exists
`CONFIRMED` · No login page, no signup, no session refresh. `useUIStore` supplies `activeUserId` (default `user-operator`) and `simulatedRole` (default `operator_admin`) from browser storage as dev impersonation. · `governed_by: U2.2.02`

### I2.1.04 — Role taxonomy is two test rows
`CONFIRMED` · `role_definitions` holds `operator_admin` and `account_owner`, both labelled "Test role definition", created 2026-08-10.

### I2.1.05 — Auth does not route through the backend
`CONFIRMED` · Login and signup go client → GoTrue directly. FastAPI never sees them. · `governed_by: U2.2.07`

---

## I2.2 — Decisions

### I2.2.01 — Supabase Auth, not Firebase
`RATIFIED 2026-08-12` · The middleware already validated Supabase JWTs. Switching would have removed working infrastructure. · `governed_by: U2.2.01` · `closes: I1.3.02`

### I2.2.02 — `app_metadata`, never `user_metadata`
`RATIFIED 2026-08-12` · RLS reads `auth.jwt() -> 'app_metadata' ->> 'tenant_id'`, nested one level. · `governed_by: U2.2.03` · regression count **3**

### I2.2.03 — One-way flow: `user_account_roles` → claim
`RATIFIED 2026-08-12` · `governed_by: U2.2.04`

### I2.2.04 — Single `active_tenant_id` in the claim
`RATIFIED 2026-08-12` · Membership stays in `user_account_roles`; switching re-mints server-side. · `governed_by: U2.2.05`

### I2.2.05 — Staleness split
`RATIFIED 2026-08-12` · Reads use the claim; high-blast-radius writes re-check `user_account_roles` live. · `governed_by: U2.2.06` · **Open:** token lifetime and the operation list are undefined (`I2.3.07`)

### I2.2.06 — FastAPI broker, not a `pg_net` trigger
`RATIFIED 2026-08-12` · `governed_by: U2.2.07`

### I2.2.07 — Local ES256 verification via JWKS
`PROPOSED` · `get_user()` is a round-trip to GoTrue on every request. Verify the signature locally with cached keys. · `governed_by: U2.2.02` · `depends_on: I2.1.02`

---

## I2.3 — Findings

| Address | Finding | Status | Governed by |
|---|---|---|---|
| `I2.3.01` | Three competing authorities | `OPEN` → `I2.5.04` | `U2.2.01` |
| `I2.3.02` | `verifyTenantContext` dev fallback issues a valid default context when the secret is absent | `OPEN` → `I2.5.04` | `U2.2.09` |
| `I2.3.03` | `TENANT_SIGNING_SECRET` is a guessable placeholder protecting the whole Next.js path including the enterprise gate | `OPEN` → resolved by deletion, not re-keying | `U2.2.02` |
| `I2.3.04` | `request.state.tenant_id` derived *from* `user_account_roles`, so a role check against that table using it is circular | `OPEN` → `I2.5.03` | `U2.2.04` |
| `I2.3.05` | **No claim-minting code exists.** No user has `app_metadata.tenant_id`. | `OPEN` → `I2.5.01` | `U2.2.04` |
| `I2.3.06` | Role taxonomy is two test rows | `OPEN` → `I2.5.10` | — |
| `I2.3.07` | Token lifetime and live-recheck operation list undefined | `OPEN` | `U2.2.06` |

---

## I2.4 — Mechanisms

| Address | Mechanism | Tier | Status |
|---|---|---|---|
| `I2.4.01` | `app_metadata` writable only via Admin API | **T5** | ✅ inherent to the provider |
| `I2.4.02` | ES256 signature verification | **T5** | ⬜ `BLOCKED by I2.5.03` |
| `I2.4.03` | E9 banned-token scan catches `user_metadata` near auth | T3 | ⬜ |
| `I2.4.04` | **Deleting** the HMAC path makes the second authority absent | **T4** | ⬜ `I2.5.04` |
| `I2.4.13` | E13 exempt paths generated from the route table | T3 | ⬜ |

**`I2.4.04` is the highest-value item in this topic.** A deleted alternative cannot be chosen. `I2.3.01`, `I2.3.02`, and `I2.3.03` all close with it.

---

## I2.5 — Sequence

| Address | Task | Status | Blocks |
|---|---|---|---|
| `I2.5.01` | Claim-minting endpoint — Admin API writes `app_metadata` at signup and invite acceptance | `READY` | `I2.5.03` |
| `I2.5.02` | Backfill runner — write the claim for every existing user | `BLOCKED by I2.5.01` | `I2.5.03` |
| `I2.5.03` | Rewrite the middleware — local ES256, cached keys, no default role, generated exempt list, key-client exception handled | `BLOCKED by I2.5.01, I2.5.02` | `I3.5.06` |
| `I2.5.04` | Delete the HMAC path, `verifyTenantContext`, and its fallback | `BLOCKED by I2.5.03` | — |
| `I2.5.10` | Define the real role taxonomy | `READY` — ratifier | `I4.5.02` |
| `I2.5.11` | Decide token lifetime and the live-recheck list | `READY` — ratifier | — |

**Ordering warning:** `I2.5.03` before `I2.5.01`+`I2.5.02` is a total outage, including the operator. · `governed_by: U2.2.09`

---

## I2.6 — Verification

`I2.6.01` — Evidence standard · `governed_by: U2.2.10`

| Change | Proof |
|---|---|
| Claim minting | A freshly signed token carries the claim, read from the decoded payload |
| Backfill | Count of users with the claim equals count of membership rows |
| Middleware | A real token accepted **and** a forged token rejected — both |
| Authority collapse | Search for the header name and the header-reading predicate returns nothing |

`I2.6.02` — Current standing: `NOT VERIFIED`. No claim exists. `I3`'s rules read a value nothing sets.
