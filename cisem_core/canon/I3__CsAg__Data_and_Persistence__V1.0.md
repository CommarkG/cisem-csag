# I3 · CsAg · Data & Persistence

> ⚠️ **AUTHORED BY REVIEWER · AWAITING GOVERNOR RATIFICATION.** Every judgment call in this document was made by the reviewer, not the governor. Items carrying `RATIFIED` inherit a decision explicitly taken in session; all structure, sequencing, classification, and status assignment is proposed. See `R00` for the itemised list.


**Tier:** I — Instance. **Mirrors:** `U3`. **Cycle:** Co1 · pass 1.

---

## I3.0 — Charter

```
purpose:     The isolation boundary in this system's database, its current
             coverage, and the work to complete it.
boundary:    I3 holds enforcement facts. I2 holds how the identity it reads
             is produced.
depends_on:  U3, I1, I2
governs:     I4–I6
invariant:   governed_by U3.0 — isolation enforced by the database, not only
             by the code in front of it.
```

**First-cycle topic.**

---

## I3.1 — State

### I3.1.01 — Two products in one database
`CONFIRMED` · The schema models a corporate-gifts B2B operation. The frontend presents generic project management. **Nothing joins them.** · `governed_by: U5.2.04`

### I3.1.02 — Entity classification
`PARTIALLY CONFIRMED` · `governed_by: U3.2.06`

**Core** — `users`, `user_account_roles`, `customer_accounts`, `workspaces`, `template_registry` (confirmed) · `packages`, `feature_registry`, `package_feature_grants`, `role_definitions` (exist; contents unverified) · `navigation_menu_items`, `status_library`, `tag_library`, `lookup_registry`, `custom_libraries`, `state_transitions`, `backlog_registry`, `document_chunks`, `pdf_queue` (**inferred from name**)

**Vertical** — `catalog_items`, `catalog_item_sandbox_variants`, `product_groups`, `product_variations`, `branding_subcontractors`, `branding_rate_cards`, `supplier_mappings` (confirmed) · `briefs`, `proposals`, `proposal_items`, `proposal_client_drafts` (**inferred from name**)

**CRM** — `contacts`, `deals` (confirmed; classification open at `I3.5.10`)

### I3.1.03 — Isolation coverage
`CONFIRMED 2026-08-12` · 31 entities, all with isolation enabled. 14 rules across 6 entities. **25 entities have isolation on and no rule.** · `governed_by: U3.2.07`

### I3.1.04 — Source schema diverges from the running database
`CONFIRMED` · The schema files document a fraction of the 31 live entities. · `governed_by: U3.2.09`

### I3.1.05 — The application bypasses isolation
`CONFIRMED` · The backend connects with a secret-class credential that ignores all rules. **Every rule in this topic is currently inert.** · `governed_by: U3.2.02`

### I3.1.06 — Correction of record
`CONFIRMED` · An earlier claim that the catalog and supplier layer had no tenant protection was **wrong on the enablement axis** — isolation was on for all 31 entities; only rules were missing. Corrected on receipt of the enablement listing. · `governed_by: U1.2.11`

---

## I3.2 — Decisions

| Address | Decision | Governed by |
|---|---|---|
| `I3.2.01` | Logical partitioning by `customer_account_id` | `U3.2.01` |
| `I3.2.02` | `user_account_roles` deny-all to clients — isolation on, zero rules | `U2.2.08` |
| `I3.2.03` | Split read and write rules; explicit `WITH CHECK` on every write | `U3.2.03` |
| `I3.2.04` | Canonical templates readable by authenticated callers only | `U3.2.04` |
| `I3.2.05` | Grant `TO authenticated`, never `{public}` | `U3.2.05` |
| `I3.2.06` | Subselect-wrap the claim read so it evaluates once per query | `U3.2.01` |
| `I3.2.07` | No explicit transaction block in the SQL editor — it wraps statements itself | `U3.2.10` |

---

## I3.3 — Findings

| Address | Finding | Status | Governed by |
|---|---|---|---|
| `I3.3.01` | `template_registry` `FOR ALL` + `IS NULL` + no `WITH CHECK` → any tenant could insert, update, **and delete** canonical templates | ✅ `CLOSED` | `U3.2.04` |
| `I3.3.02` | `user_account_roles` `FOR ALL` with tenant equality only → self-promotion | ✅ `CLOSED` | `U2.2.08` |
| `I3.3.03` | Tenant identity read from a client-supplied header | ✅ `CLOSED` on 4 entities | `U2.2.02` |
| `I3.3.04` | **25 entities with isolation on and no rule** | ⬜ `OPEN` → `I3.5.03` | `U3.2.07` |
| `I3.3.05` | Two legacy rules: role gates, not tenant-scoped, read-only so writes deny-all, subquery reads an entity that itself denies all | ⬜ `KNOWN` | `U3.2.06` |
| `I3.3.06` | Source schema diverges from the running database | ⬜ `OPEN` | `U3.2.09` |
| `I3.3.07` | The proxy **fails open** into sample data when the backend is unreachable | ⬜ `OPEN` → `I3.5.07` | `U1.2.13` |
| `I3.3.08` | Application uses a bypassing credential — all rules inert | ⬜ `OPEN` → `I3.5.06` | `U3.2.02` |
| `I3.3.10` | A change reported success twice while applying 2 of 12 statements | ✅ `CLOSED` | `U3.2.08` |
| `I3.3.11` | No record of which changes have been applied | ⬜ `OPEN` → `I3.4.11` | `U3.2.10` |

---

## I3.4 — Mechanisms

| Address | Short | Mechanism | Tier | Status |
|---|---|---|---|---|
| `I3.4.01` | — | Isolation rule with explicit `WITH CHECK` | **T5** | ✅ on 4 entities |
| `I3.4.03` | E3 | Drift detector — live state vs committed expectation | T3 | ✅ `VERIFIED` |
| `I3.4.04` | E4 | Rule linter — 6 invariants | T3 | ✅ `VERIFIED` |
| `I3.4.05` | E5 | Two-tenant isolation test | T3 | ⬜ **the only real proof** |
| `I3.4.11` | E11 | Applied-change ledger | T3 | ⬜ |
| `I3.4.20` | — | Metadata-only read functions, execute granted to the server role alone | T5 | ✅ |

---

## I3.5 — Sequence

| Address | Task | Status |
|---|---|---|
| `I3.5.01` | Confirm the `I3.1.02` classification against real columns; identify each vertical entity's tenant column | `READY` |
| `I3.5.02` | Decide the rule pattern per class | `BLOCKED by I3.5.01` |
| `I3.5.03` | Write rules for the 25 uncovered entities, in batches by class. E3+E4 after each. | `BLOCKED by I3.5.02` |
| `I3.5.04` | Replace the two legacy `{public}` role gates | `BLOCKED by I3.5.03` |
| `I3.5.05` | **Linter reaches zero errors** — the gate for the credential swap | `BLOCKED by I3.5.03, I3.5.04` |
| `I3.5.06` | Swap the bypassing credential for a scoped one | `BLOCKED by I3.5.05, I2.5.03` |
| `I3.5.07` | Proxy fail-open → error response | `READY` |
| `I3.5.10` | Decide whether CRM entities are core or vertical | `READY` — ratifier |

**Ordering warning:** `I3.5.06` before `I3.5.05` takes the catalog dark. The linter reports readiness.

---

## I3.6 — Verification

`I3.6.01` — Rule migration `VERIFIED 2026-08-12` · 12 rules applied: 4 each on `template_registry`, `contacts`, `deals`; authorization table deny-all. Drift check exit 0.

**Method note:** the editor reported success twice while having applied 2 of 12 statements. Only a per-entity count caught it. · `governed_by: U3.2.08`

`I3.6.02` — Tenant isolation `NOT VERIFIED` · The wall is **built and inert**. Proof requires E5 green, which requires `I3.5.06`.

`I3.6.03` — Evidence standard: drift exit 0 + linter exit 0 + per-entity rule count. For isolation, E5 only.
