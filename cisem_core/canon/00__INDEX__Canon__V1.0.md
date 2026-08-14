# 00 · INDEX · Canon

**Version:** 1.0 · **Reading order is the order below.**
**Target home:** `cisem_core/canon/` — read-only to actors, hash-sealed.

> ⚠️ **DRAFT — AWAITING GOVERNOR RATIFICATION.** Every judgment call made by the reviewer is itemised in `R00`. Nothing here is canon until decided.

---

## How to enter

| You are | Read |
|---|---|
| **New to this** | `U0A` → `U0B` → this index → the topic you need |
| **An actor given a task** | You should have a **pocket** (`U0C.2.02`), not this index. If you did not, stop and request one. |
| **Deciding what to do next** | `R00` for pending decisions · the relevant `I{n}.5` for ready work |
| **Reviewing a change** | The relevant `U{n}` for the law · `I{n}` for the local facts |

---

## 1 · Canon law — how the documents work

| # | File | Owns |
|---|---|---|
| `U0A` | `U0A__Core__Tier_Separation__V1.0.md` | Four tiers, the one-tier rule, batch sequence, promotion |
| `U0B` | `U0B__Core__Naming_and_Numbering_Grid__V1.0.md` | Every artifact class, address, range, status, link type |
| `U0C` | `U0C__Core__Invariant_and_Pocket_Formats__V1.0.md` | Invariant and pocket formats |

**Read `U0A` first.** Nothing else parses without the tier distinction.

## 2 · Universal core — what is true for any platform of this kind

Dependency order. Each depends only on those before it.

| # | File | Decisions |
|---|---|---|
| `U1` | `U1__Core__Governance_and_Method__V1.0.md` | Method, evidence, durability, cycles, loads, loops, measurement |
| `U2` | `U2__Core__Identity_and_Tenancy__V1.0.md` | Who a caller is and for whom they act |
| `U3` | `U3__Core__Data_and_Persistence__V1.0.md` | The isolation boundary and schema discipline |
| `U4` | `U4__Core__Entitlement_and_Templates__V1.0.md` | Capability, derived artifacts, lifecycle |
| `U5` | `U5__Core__Vertical_and_Product__V1.0.md` | Core–vertical separation, product conditions |
| `U6` | `U6__Core__Surface_and_Experience__V1.0.md` | Client, state, journeys, governance-as-surface |
| `U7` | `U7__Core__Operations_and_Cadence__V1.0.md` | Roles, lanes, work cycle, deployment, observability |

**No vendor, product, or date appears in any of these.** Verified mechanically.

## 3 · Instance — what is true of this system now

Mirrors the topic numbers. Every item cites the universal law it applies.

| # | File | Standing |
|---|---|---|
| `I1` | `I1__CsAg__Governance_and_Method__V1.0.md` | E1, E2 verified · E3–E16 open |
| `I1a` | `I1a__CsAg__Actor_Failure_Audit__V1.0.md` | 28 incidents, 3 root causes, prevention analysis |
| `I2` | `I2__CsAg__Identity_and_Tenancy__V1.0.md` | **first-cycle · unbuilt** |
| `I3` | `I3__CsAg__Data_and_Persistence__V1.0.md` | **first-cycle · 4 of 31 entities protected** |
| `I4` | `I4__CsAg__Entitlement_and_Templates__V1.0.md` | scaffolding only |
| `I5` | `I5__CsAg__Vertical_and_Product__V1.0.md` | direction set, nothing built |
| `I6` | `I6__CsAg__Surface_and_Experience__V1.0.md` | no persistence, no journeys defined |
| `I7` | `I7__CsAg__Operations_and_Cadence__V1.0.md` | doctrine written, partly enforced |

## 4 · Pipeline — intent to validated

| # | File | Owns |
|---|---|---|
| `P1` | `P1__Pipeline__Intent_to_Validated__V1.0.md` | Ten stages, entry and exit conditions, consolidation |

## 5 · Solutions

| # | File | Owns |
|---|---|---|
| `S00r` | `S00__Register__Solution_Register_and_Record_Format__V1.0.md` | The register and entry conditions |
| `S00t` | `S00__Template__Solution_Record__V1.0.md` | The empty record shape |

**No solution has entered.** Every candidate depends on an enforced isolation boundary.

## 6 · Live registers — change constantly

| File | Holds |
|---|---|
| `R00__Register__Awaiting_Ratification__V1.0.md` | **Every reviewer judgment call. Start here.** |
| `PARKED.md` | Deferred items with reasons and unblocking conditions |
| `zones.json` | Zone manifest — incomplete |
| `cycle_grid.md` | Cycle coverage view — hand-assembled pending its generator |

## 7 · Mechanisms — running code

| File | Is |
|---|---|
| `e3_drift_check.py` | E3 — drift detector · **verified** |
| `e4_policy_lint.py` | E4 — rule linter · **verified** |
| `cisem_db.py` | Shared read-only accessor |
| `run-security-checks.ps1` | Launcher — credentials, held outside the repository |

## 8 · Superseded — `_superseded/`

Fourteen files. Historically accurate, **never edited, never cited as authority.**

---

## Current standing

### Closed
Isolation escalations on shared templates and on the authorization record · forgeable identity source on four entities · credentials readable by the actor · actor reach beyond the boundary.

### Blocking, in order
| | |
|---|---|
| `I1.5.01` | Canon into the repository — **blocks every pocket, every seal** |
| `I3.5.03` | 25 entities with isolation enabled and no rule |
| `I2.5.01` → `I2.5.02` → `I2.5.03` | Claim minting → backfill → middleware |
| `I3.5.06` | Credential swap — **blocked by `I3.5.05`** |

### Largest open decisions
| | |
|---|---|
| `R00` | ~90 reviewer judgment calls, unratified |
| `I6.5.10` | The orphan surface — build persistence or retire? Cited by four topics. |
| `I6.5.40` | Five operator journeys — none defined |
| `I6.5.45` | **Baselines. Cannot be taken retroactively.** |

### Known gap
`I1.3.42` — **the canon is not in the repository.** No actor can read it. Until then it governs the human and not the machines, which is half a canon.
