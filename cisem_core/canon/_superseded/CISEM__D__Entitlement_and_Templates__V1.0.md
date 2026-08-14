# CISEM Canon — D · Entitlement & Templates

**Address:** `D` · **Depends on:** A, B, C · **Serves:** E, F
**Addressing scheme:** `A.0`
**Status:** Draft for GOVERNOR ratification

---

## D.0 — Charter

### D.0.1 — Purpose
`RATIFIED-PENDING` · What a tenant is entitled to, and the template system that seeds their workspace. Owns packages, feature grants, tier gating, and the canonical template library.

**Plain:** This spine decides what each customer has paid for and can therefore use, and it owns the master templates that customers copy to get started.

**Boundary:** D owns *entitlement*. B owns *identity*. A customer's role is B; what their plan unlocks is D.

---

## D.1 — State

### D.1.01 — The entitlement tables exist and are empty
`CONFIRMED 2026-08-12` · `packages`, `feature_registry`, `package_feature_grants`, `role_definitions` all exist in the live schema with RLS enabled and no policies. `role_definitions` holds 2 rows, both "Test role definition". The others returned nothing when queried.

**Correction of record:** an earlier reading of this session claimed the tiering system was already built. It is **scaffolding, not a system** — the table shape is a real head start, the content is not there. `supersedes: an overstated prior claim`

### D.1.02 — Template registry is live and dual-sourced
`CONFIRMED` · `TemplateHubView.tsx` holds a hardcoded `MOCK_REGISTRY` as initial UI state, and `POST /api/templates/duplicate` writes to `cisem_core/templates_registry.json` on the server's local disk. There is also a `template_registry` **database table** with RLS policies.

**Unresolved:** the JSON file and the database table are two stores for one concept. See `D.3.02`.

### D.1.03 — Template data contract
`CONFIRMED` · From `TemplateHubView.tsx`:

```
Template: template_id, canonical_name, project_scope, page_type, version,
          pe_priority_score, status (VERIFIED|DRAFT|DEPRECATED),
          review_gate_status, layout_contract{...}

InstantiatedPage: id, name, template_id, template_version_locked,
                  client_id, client_name, status, custom_coding_allowed,
                  governor_lock, created_at, created_by, sync_receipt
```

### D.1.04 — Tier gating exists in exactly one place
`CONFIRMED` · `src/app/api/v1/[...path]/route.ts` returns 403 `ENTERPRISE_TIER_REQUIRED` for `tenant/whitelabel` when tier ≠ enterprise. This is the only enforced entitlement check in the system, and it reads the tier from the forgeable HMAC context (`B.3.01`).

---

## D.2 — Decision

### D.2.01 — Version-locked dead snapshots
`RATIFIED 2026-08-12` · A duplicated template is a frozen copy carrying `template_version_locked`. Parent changes do not propagate. When a new parent version is verified, the tenant sees an update-available alert and chooses.

**Plain:** When a customer copies a template, they get a photograph, not a live mirror. If you improve the original, their copy does not change underneath them — they get told a newer version exists and decide for themselves.

**Structured:** `field_exists: InstantiatedPage.template_version_locked` · `rejected: live clone` — reason: parent edits would break tenant layouts without warning

### D.2.02 — Canonical templates are readable, never writable, by tenants
`RATIFIED 2026-08-12` · `customer_account_id IS NULL` appears only in the SELECT policy. All write paths use strict tenant equality. See `C.2.03`, `C.3.01`.

### D.2.03 — Entitlement config must be machine-readable
`PROPOSED` · Feature gating reads from `packages` / `feature_registry` / `package_feature_grants`, not from prose and not from `if (tier === 'pro')` scattered through components.

**Reason retained from the original review:** hardcoded tier checks scattered across a codebase become unmanageable and unauditable. That part of the early analysis was correct even though its surrounding claims were not.

### D.2.10 — Metered image pricing
`REJECTED` · See `A.2.11` and `E.1.02`.

---

## D.3 — Finding

| ID | Finding | Status |
|---|---|---|
| `D.3.01` | Entitlement tables empty; no tier definitions exist | `OPEN` → `D.5.01` |
| `D.3.02` | Templates live in **two stores** — `cisem_core/templates_registry.json` (file) and `template_registry` (table). Duplication with no declared authority. | `OPEN` → `D.5.03` |
| `D.3.03` | Role taxonomy is 2 test rows (`B.1.04`) | `OPEN` → `B.5.10` |
| `D.3.04` | The only tier gate reads from the forgeable HMAC context | `OPEN` → closes with `B.5.04` |
| `D.3.05` | `WhitelabelView.tsx` has a client-side tier selector that toggles enterprise features in local state | `OPEN` → `F.3.10` |
| `D.3.06` | `template_registry` table has RLS policies; the JSON file has no access control at all | `OPEN` → `D.5.03` |

**`D.3.02` is the significant one.** Two stores for one concept violates the corespine rule directly — a thing exists in two places with no declared relationship. Until one is authoritative, every template decision has to be made twice.

---

## D.4 — Mechanism

| ID | Mechanism | Tier | Status |
|---|---|---|---|
| `D.4.01` | `template_registry` RLS: read-only canonicals, tenant-scoped writes | **T5** | ✅ |
| `D.4.02` | Backend 403 on enterprise features | T3 | ⚠️ reads a forgeable source |
| `D.4.03` | Entitlement read from DB tables, not code | T3 | ⬜ `D.5.02` |
| `D.4.04` | `A.4.09` (E9) — ban scattered `tier ===` literals | T3 | ⬜ |

---

## D.5 — Sequence

| ID | Task | Depends on |
|---|---|---|
| `D.5.01` | Define the tier model — what Free / Pro / Enterprise actually unlock. Populate `packages`, `feature_registry`, `package_feature_grants`. | GOVERNOR, `E.2.01` (UVP determines what is worth gating) |
| `D.5.02` | Build the entitlement read path — one accessor, no scattered checks | `D.5.01`, `C.5.03` |
| `D.5.03` | **Resolve `D.3.02`** — declare which template store is authoritative, migrate the other or delete it | GOVERNOR |
| `D.5.04` | Move tier reads to the claim once `B.5.03` lands | `B.5.03` |
| `D.5.10` | Decide: public pre-login template gallery, or authenticated-only? (`C.2.04` currently authenticated-only) | GOVERNOR |

---

## D.6 — Verification

### D.6.01 — Evidence standard
| Change | Proof |
|---|---|
| Tier definition | Rows in `packages` and `package_feature_grants`, not a document |
| Feature gate | A Free-tier token receives 403 on a Pro feature; a Pro token receives 200. Both. |
| Template duplication | The copy carries `template_version_locked`; editing the parent leaves the copy unchanged |
| Store authority | Only one store accepts writes; the other is read-only or gone |

### D.6.02 — Current standing
`NOT VERIFIED` · No tier definitions exist. The single live gate reads a forgeable source. Template storage authority undeclared.
