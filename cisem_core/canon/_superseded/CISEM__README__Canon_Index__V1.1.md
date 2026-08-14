# CISEM Canon — Index

**Address:** `README` · **Version:** 1.1 · **Updated:** 2026-08-12
**Location (target):** `cisem_core/canon/` — read-only to agents, hash-sealed

---

## Start here

**If you have never read this canon:** `A.0` (addressing) → `A.0.2` (cycle law) → this index → the spine you need.

**If you are an agent receiving a task:** you should have received a **pocket** (`A.0.25.2`), not this index. If you did not, stop and request one.

**If you are looking for what to do next:** `§ Current standing` below, then the relevant spine's `.5` stage.

---

## The address

```
        B  .  3  .  07
        │     │     │
        │     │     └── ITEM     permanent, never reused
        │     └──────── STAGE    0 Charter · 1 State · 2 Decision · 3 Finding
        │                        4 Mechanism · 5 Sequence · 6 Verification
        └────────────── SPINE    A–G, in dependency order
```

**Cycle is a stamp on the item, not part of the address** (`A.0.30`). Where a thing lives is fixed; when it was worked accumulates.

---

## Spine map

| Spine | Owns | Depends on | Governs | Standing |
|---|---|---|---|---|
| **A** Canon & Governance | The canon, the gate, all mechanisms, agent rules, durability model | — | all | E1–E4 shipped; E5–E15 open |
| **B** Identity & Tenancy | Who a caller is, which tenant, what role. The claim and its lifecycle. | A | C–G | **Co1 · unbuilt** |
| **C** Data & Persistence | Schema, RLS, migrations, data access, platform/vertical classification | A, B | D–G | **Co1 · 4 of 31 tables policied** |
| **D** Entitlement & Templates | Packages, feature grants, tier gating, template registry | A–C | E, F | scaffolding only |
| **E** Vertical & Product | The gifting catalog vertical. UVP. What is sold. | A–D | F | UVP ratified, nothing built |
| **F** Surface & UX | Frontend, state, data layer, UX/UI DNA | A–E | — | no persistence; 3 live violations |
| **G** Operations & Cadence | Roles, lanes, work cycle, verification, deployment, observability | A | all | doctrine written, partly enforced |

---

## Current standing

### Closed
| | |
|---|---|
| `C.3.01` | Tenant could delete operator canonical templates |
| `C.3.02` | Tenant member could self-promote to any role |
| `C.3.03` | Tenant identity read from a forgeable header (4 tables) |
| `A.3.32` | Secrets readable by the agent → E2, structural |
| `A.3.33` | Agent scanning outside the workspace → E1 |

### Blocking, in order
| | |
|---|---|
| `C.5.03` | 25 tables with RLS enabled and no policies |
| `B.5.01` | Claim-minting code — nothing writes `app_metadata.tenant_id` |
| `B.5.02` | Backfill — no existing user has the claim |
| `B.5.03` | Middleware rewrite — **blocked by both above; deploying first = total outage** |
| `C.5.06` | Key swap — **blocked by `C.5.05` (E4 clean) or `catalog_items` goes dark** |

### Largest open decisions
| | |
|---|---|
| `F.5.10` | Generic PM surface — build persistence or retire? Referenced as a blocker by four spines. |
| `A.0.31` | Co1 manifest ratification — everything above Co1 is provisional until sealed |
| `F.5.20` | Is the ux-gate blocking or advisory? Moves the entire UX DNA between T1 and T3. |
| `C.5.10` | Are `contacts`/`deals` platform CRM or gifting vertical? |

---

## Files

| File | Contains |
|---|---|
| `CISEM__README__Canon_Index__V1.1.md` | this |
| `CISEM__A0__Canon_Addressing_System__V1.1.md` | addressing, status vocabulary, links, sealing, **Co1 manifest** |
| `CISEM__A0.2__Core_Cycle_Law__V1.0.md` | inheritance, invariants, gates, hardcoding vs pockets |
| `CISEM__A__Canon_and_Governance__V1.0.md` | spine A |
| `CISEM__B__Identity_and_Tenancy__V1.0.md` | spine B |
| `CISEM__C__Data_and_Persistence__V1.0.md` | spine C |
| `CISEM__D__Entitlement_and_Templates__V1.0.md` | spine D |
| `CISEM__E__Vertical_and_Product__V1.0.md` | spine E |
| `CISEM__F__Surface_and_UX__V1.0.md` | spine F |
| `CISEM__G__Operations_and_Cadence__V1.0.md` | spine G |
| `PARKED.md` | the park list — scanned by E12 |
| `zones.json` | zone manifest — read by E14 |
| `cycle_grid.md` | generated view of cycle × corespine coverage |

### Superseded — snapshots, never edited again
| File | Superseded by |
|---|---|
| `CISEM_Session_Review_and_Gap_Closure_Plan.md` | canon A–G |
| `CISEM_Operating_Playbook.md` | canon A–G |
| `CISEM_Structure_and_Frontend_Doctrine.md` | canon A–G |

**These are dated snapshots of the 2026-08-12 audit.** They are historically accurate and were the source of the canon. They are no longer authoritative and must not be edited — that would recreate the two-store defect (`D.3.02`) the canon exists to prevent.

### External SSOT — referenced, never restated
| File | Owns |
|---|---|
| `governance/ux-ui-dna.md` | D1–D8, L1–L3, ux-standards #27–31, PLAN GATE 0.8 |

---

## Known gap in this canon

**`A.3.50` — The canon is not yet in the repository.** It exists as files on the GOVERNOR's machine. Agents cannot read it, so pockets cannot be assembled from it, conflict checks have nothing to read, and no invariant can cite it.

Until `cisem_core/canon/` exists and is sealed, **the canon governs the human and not the machines.** That is half a canon. See `A.5.20`.
