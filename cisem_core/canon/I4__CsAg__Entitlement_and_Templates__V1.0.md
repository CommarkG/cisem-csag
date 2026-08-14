# I4 · CsAg · Entitlement & Templates

> ⚠️ **AUTHORED BY REVIEWER · AWAITING GOVERNOR RATIFICATION.** Every judgment call in this document was made by the reviewer, not the governor. Items carrying `RATIFIED` inherit a decision explicitly taken in session; all structure, sequencing, classification, and status assignment is proposed. See `R00` for the itemised list.


**Tier:** I — Instance. **Mirrors:** `U4`. **Cycle:** Co1 · pass 1.

---

## I4.0 — Charter

```
purpose:     What a CISEM CsAg tenant has purchased, and the template system
             that seeds their workspace.
boundary:    I4 holds entitlement facts. I2 holds identity and role.
depends_on:  U4, I1, I2, I3
governs:     I5, I6
invariant:   governed_by U4.0 — entitlement is data, evaluated at the server.
```

---

## I4.1 — State

### I4.1.01 — The entitlement tables exist and are empty
`CONFIRMED 2026-08-12` · `packages`, `feature_registry`, `package_feature_grants`, `role_definitions` all exist with isolation enabled and no rules. `role_definitions` holds 2 test rows; the others returned nothing. · `governed_by: U4.2.01`

**Correction of record:** an earlier claim that this constituted a built tiering system was overstated. It is **scaffolding** — the shapes are a real head start, the content is absent. · `governed_by: U1.2.11`

### I4.1.02 — Templates live in two stores
`CONFIRMED` · A registry file on the server's local disk with no access control, and a `template_registry` database entity with isolation rules. **No declared authority between them.** · `governed_by: U4.2.05`

### I4.1.03 — Template data contract
`CONFIRMED` · Source: the template hub view.
`Template`: id, canonical name, project scope, page type, version, priority score, status (verified/draft/deprecated), review gate status, layout contract.
`InstantiatedPage`: id, name, template id, **version locked**, client id, client name, status, custom-coding flag, governor lock, created at, created by, sync receipt. · `governed_by: U4.2.04`

### I4.1.04 — One entitlement gate exists, and it reads a forgeable source
`CONFIRMED` · The proxy returns 403 for a white-label path unless the tier is enterprise. It is the only enforced entitlement check in the system, and the tier value comes from the HMAC context (`I2.3.01`). · `governed_by: U4.2.03`

---

## I4.2 — Decisions

### I4.2.01 — Version-locked dead snapshots
`RATIFIED 2026-08-12` · A duplicated template carries the source version. Parent changes do not propagate; the tenant is alerted and chooses. · `governed_by: U4.2.04` · field already present at `I4.1.03`

### I4.2.02 — Canonical templates readable, never writable, by tenants
`RATIFIED 2026-08-12` · The permissive clause exists only in the read rule. · `governed_by: U4.2.05` · `closes: I3.3.01`

### I4.2.03 — Entitlement read from the database, not from code
`PROPOSED` · Feature gating reads `packages` / `feature_registry` / `package_feature_grants`, never scattered tier comparisons. · `governed_by: U4.2.01`

---

## I4.3 — Findings

| Address | Finding | Status | Governed by |
|---|---|---|---|
| `I4.3.01` | Entitlement tables empty; no tier definitions exist | `OPEN` → `I4.5.01` | `U4.2.01` |
| `I4.3.02` | **Templates in two stores with no declared authority** | `OPEN` → `I4.5.03` | `U4.2.05` |
| `I4.3.03` | Role taxonomy is two test rows | `OPEN` → `I2.5.10` | — |
| `I4.3.04` | The only tier gate reads a forgeable source | `OPEN` → closes with `I2.5.04` | `U4.2.03` |
| `I4.3.05` | A client-side tier selector toggles enterprise features in local state | `OPEN` → `I6.3.10` | `U1.2.14` |
| `I4.3.06` | The database template entity has isolation rules; the file store has no access control at all | `OPEN` → `I4.5.03` | `U4.2.05` |
| `I4.3.07` | No entitlement versioning — a plan change would silently re-grade existing tenants | `OPEN` → `I4.5.01` | `U4.2.06` |

**`I4.3.02` is the significant one.** Two stores for one concept means every template decision must be made twice, and the two answers diverge without anyone deciding they should.

---

## I4.4 — Mechanisms

| Address | Mechanism | Tier | Status |
|---|---|---|---|
| `I4.4.01` | Template isolation rules: read-only canonicals, tenant-scoped writes | **T5** | ✅ |
| `I4.4.02` | Backend 403 on enterprise features | T3 | ⚠️ reads a forgeable source |
| `I4.4.03` | Entitlement read from database tables | T3 | ⬜ `I4.5.02` |
| `I4.4.04` | E9 bans scattered tier comparisons in code | T3 | ⬜ |

---

## I4.5 — Sequence

| Address | Task | Status |
|---|---|---|
| `I4.5.01` | Define the tier model and populate the entitlement tables, **with a version field** | `BLOCKED by I5.2.01` — the differentiator determines what is worth gating |
| `I4.5.02` | Build the entitlement read path — one accessor | `BLOCKED by I4.5.01, I3.5.03` |
| `I4.5.03` | **Resolve the two-store problem** — declare one authoritative, migrate or delete the other | `READY` — ratifier |
| `I4.5.04` | Move tier reads to the claim | `BLOCKED by I2.5.03` |
| `I4.5.10` | Decide: public pre-login template gallery, or authenticated only? | `PARKED` — `PARK-003` |

---

## I4.6 — Verification

`I4.6.01` — Evidence standard

| Change | Proof |
|---|---|
| Tier definition | Rows in the entitlement tables, not a document |
| Feature gate | A lower-tier token receives 403 and a higher-tier token receives 200 — both |
| Template duplication | The copy carries the locked version; editing the parent leaves it unchanged |
| Store authority | Only one store accepts writes; the other is read-only or gone |

`I4.6.02` — Current standing: `NOT VERIFIED`. No tier definitions. The single live gate reads a forgeable source. Template authority undeclared.
