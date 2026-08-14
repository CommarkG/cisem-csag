# CISEM Canon — Addressing System

**Address:** `A.0` · **Version:** 1.1 · **Supersedes:** `A.0` V1.0
**Status:** Draft for GOVERNOR ratification

**Change log V1.0 → V1.1** — all changes ratified 2026-08-12, alignment pass:

| § | Change |
|---|---|
| `A.0.30` | **NEW** — cycle is a stamp on the item, not part of the address |
| `A.0.4` | Status vocabulary is now **per-stage**, replacing one flat list |
| `A.0.5` | Typed links become mandatory, not optional prose |
| `A.0.13` | **NEW** — `A.4.nn` reserved for the mechanism registry; doctrines moved to `A.2.30`+ |
| `A.0.14` | **NEW** — invariants get an addressing home |
| `A.0.15` | **NEW** — correction register; corrections get addresses |
| `A.0.31` | **NEW** — the Co1 manifest |
| `A.0.6` | Uniform charter shape defined |

---

## A.0.1 — What this is

A single addressing system in which **the address is the architecture**.

```
        B  .  3  .  07
        │     │     │
        │     │     └── ITEM      sequential, permanent, never reused
        │     └──────── STAGE     which turn of the core cycle
        └────────────── SPINE     which domain, in dependency order
```

The address is permanent. An item never changes address, even when superseded.

---

## A.0.2 — Tier 1: SPINE

| Spine | Domain | Depends on | Governs |
|---|---|---|---|
| **A** | Canon & Governance | — | all |
| **B** | Identity & Tenancy | A | C–G |
| **C** | Data & Persistence | A, B | D–G |
| **D** | Entitlement & Templates | A–C | E, F |
| **E** | Vertical & Product | A–D | F |
| **F** | Surface & UX | A–E | — |
| **G** | Operations & Cadence | A | all |

**`depends_on` and `governs` are different relations.** G depends only on A but governs every spine — that is authority, not dependency. Only `depends_on` constrains imports (`A.2.01`).

**The rule the letters encode:** an item in B may never depend on an item in E. If it does, the platform cannot be reused for a second vertical.

---

## A.0.3 — Tier 2: STAGE

Seven stages. Every spine passes through all seven. That repetition is the core spiral.

| Stage | Name | Answers |
|---|---|---|
| **0** | Charter | What is this spine, where does it start and stop, what does it rely on and serve |
| **1** | State | What exists now, confirmed against source |
| **2** | Decision | What was chosen, **what was rejected and why**, what superseded what |
| **3** | Finding | Gaps, defects, contradictions, duplications, partial implementations |
| **4** | Mechanism | What enforces this spine, at which durability tier, and the invariants it checks |
| **5** | Sequence | The ordered work to close stage 3 |
| **6** | Verification | What counts as proof, and current standing |

---

## A.0.4 — Status vocabulary — per stage

One flat list was wrong; different stages assert different kinds of thing.

| Stage | Valid statuses |
|---|---|
| **`.1` State** | `CONFIRMED` (checked against source, with the source named) · `INFERRED` (reasoned, not verified) · `STALE` (was confirmed, may have changed) |
| **`.2` Decision** | `PROPOSED` · `RATIFIED` · `REJECTED` · `SUPERSEDED by X.n.nn` |
| **`.3` Finding** | `OPEN` · `CLOSED` · `KNOWN` (accepted, tracked, not blocking) · `PARKED` (deferred, in `PARKED.md`) |
| **`.4` Mechanism** | `PROPOSED` · `BUILT` · `VERIFIED` (has failed on a known-bad input) · `RETIRED` |
| **`.5` Sequence** | `BLOCKED by X.n.nn` · `READY` · `IN PROGRESS` · `DONE` |
| **`.6` Verification** | `VERIFIED` · `NOT VERIFIED` · `PARTIAL` (scope stated) |

**No status outside its stage's list.** `CONFIRMED` on a decision is meaningless; `RATIFIED` on a state observation is a category error.

**`REJECTED` is permanent.** A rejected item keeps its address and its reason forever. This is the half that ordinarily disappears — it is why the same rejected idea cannot return without meeting the recorded argument against it.

---

## A.0.5 — Typed links — mandatory

Prose arrows (`→ B.5.04`) are not links. Only these four types, written explicitly:

| Link | Meaning |
|---|---|
| `closes: X.n.nn` | This mechanism or decision resolves that finding |
| `supersedes: X.n.nn` | Replaces an earlier item; the old text is preserved |
| `depends_on: X.n.nn` | Cannot proceed until that item is `CLOSED` / `DONE` |
| `conflicts_with: X.n.nn` | Directly contradicts — must be resolved before either is ratified |

**Untyped links are invisible to the machine.** The `conflicts_with` debate check (`A.0.25.2` section 4) reads typed links only.

**Example chain:**
```
C.3.01  closed_by: C.2.03
C.2.03  enforced_by: A.4.04
A.4.04  verified_by: C.6.01
```

---

## A.0.6 — Uniform charter shape

Every spine's `.0` stage carries exactly these five fields. No more, no fewer.

```
purpose:      one sentence, plain language
boundary:     what this spine owns and what it explicitly does not
depends_on:   spines only
governs:      spines only (usually empty except A and G)
invariant:    the single rule that must never break in this spine
```

---

## A.0.7 — Tier 3: ITEM

Two digits, sequential within the stage, assigned in creation order, **never reused, never renumbered**.

---

## A.0.13 — Reserved ranges

`A.4.10` was used twice in V1.0 — as mechanism E10 and as the Secrets Doctrine. Resolved:

| Range | Reserved for |
|---|---|
| `A.4.01`–`A.4.15` | **The mechanism registry only.** `A.4.nn` = E`nn`, one to one. |
| `A.2.30`+ | Doctrines. Secrets Doctrine → `A.2.30`. Agent Engagement → `A.2.31`. |

Doctrines are decisions, not mechanisms. They belong in stage `.2`.

---

## A.0.14 — Invariants

Invariants (`A.0.21`) live in `cisem_core/canon/invariants/`, one file per invariant, named `INV-{SPINE}-{nnn}.yaml`.

They are **referenced from** stage `.4`, not addressed within it. Stage `.4` reads: *mechanisms owned by this spine, and the invariants they check.*

```
A.4.04  E4 policy linter   T3   checks: INV-C-001, INV-C-002, INV-C-003, INV-C-004
```

An invariant with no `checked_by` is a wish. It sits at T1 and is recorded as a known weakness under exit test X2.

---

## A.0.15 — Correction register

**A canon that quietly deletes its own errors is not a record.** Corrections get addresses.

When an item is found wrong, it is `SUPERSEDED by` a new item whose text states what was wrong, what is correct, and what evidence changed the conclusion. The original text is preserved.

**Backlog of corrections not yet addressed:**

| What was claimed | Correction | Where it belongs |
|---|---|---|
| "The catalog/supplier layer has no tenant protection" (CLAUDE, 2026-08-12) | Wrong on the `rowsecurity` axis — RLS was enabled on all 31 tables. Only *policies* were missing. Corrected on receipt of the `pg_tables` CSV. | `C.1.06` |
| "Packages/feature_registry may already be a built tiering system" (CLAUDE, 2026-08-12) | Overstated. Scaffolding — tables exist, contents empty, `role_definitions` holds 2 test rows. | ✅ recorded at `D.1.01` |
| "The platform has no backend" (prior review) | Falsified — FastAPI + Supabase + pgvector exist | ✅ recorded at `A.3.01` |

---

## A.0.30 — Cycle as a stamp

**The address says where a thing lives. The cycle says when it was worked.** They are different questions and must not be conflated into one identifier.

Every item carries a cycle stamp:

```
### C.3.04 — 25 tables with RLS enabled and no policies
Status: OPEN · Cycle: Co1 · First seen: pass 1 · Last advanced: pass 1
Scope: catalog_items, workspaces, customer_accounts, +22
closes: —  ·  depends_on: C.5.02
```

### A.0.30.1 — The grid is generated, not maintained

`cycle_grid.md` is a **view over item stamps**, not a document anyone edits. Rows are corespine elements; columns are passes; each cell is computed:

| Computed value | When |
|---|---|
| `ADVANCED` | Any item in this element has `Last advanced = this pass` |
| `NOT-READY: <dep>` | All items are `BLOCKED by` something still `OPEN` |
| `DEFERRED: <reason>` | Items are `PARKED` with a reason |

**No cell is ever empty.** An element with no items at all is `NOT-READY: not yet charted`.

**Escalation:** `NOT-READY` for three consecutive passes escalates. Three passes means the blocker is not being worked — a hidden dependency, not patience.

One source, two views. The grid stops being a discipline and becomes a query.

---

## A.0.31 — The Co1 manifest

`A.0.23` gave the criterion. This is the list.

> **Co1 contains everything that, if wrong, cannot be corrected later without rebuilding what sits on top of it.**

| # | Co1 element | If wrong, what is torn down | Standing |
|---|---|---|---|
| **Co1.1** | Tenant identity authority — the `app_metadata` claim | Every policy, every middleware path, every data access | ⬜ `B.5.01`–`B.5.04` unbuilt |
| **Co1.2** | The tenant boundary — RLS model and predicate shape | Every table's access model. A breach is unrecoverable. | 🟡 4 of 31 tables |
| **Co1.3** | The durability ladder T0–T5 | Every rule sits at the wrong tier; every mechanism is misplaced | ✅ defined, `A.0.10` |
| **Co1.4** | The canon and its addressing | Every record moves; every cross-reference breaks | 🟡 defined, **not in the repo** (`A.3.50`) |
| **Co1.5** | Zone dependency direction | Platform cannot be separated from vertical without a rewrite | ⬜ `A.2.01` unratified, `zones.json` skeleton only |
| **Co1.6** | The Core Cycle Law — inheritance and exit gates | Cycles stop being accountable to each other; the restart loop returns | 🟡 defined, no invariant suite |
| **Co1.7** | Secrets never on disk in the mount | Every rotation is a leak; every agent is a vector | ✅ `A.4.02`, T4, verified |
| **Co1.8** | Agent filesystem boundary | Nothing constrains what an agent can reach | ✅ `A.4.01`, T2, verified |

**Explicitly not Co1:** tier/package model (repriceable) · catalog UI (redesignable) · onboarding flow · anything in D, E, or F.

### A.0.31.1 — Standing

**Co1 is not sealed. Three of eight elements are unbuilt or unratified.**

Consequence, stated plainly: **all work in D, E, and F is provisional.** Not wrong, not wasted — provisional. It sits on a foundation that can still move, and if it moves, that work moves with it.

This is the restart loop described structurally rather than as a discipline failure. It ends at `X6`.

### A.0.31.2 — Sealing Co1

- [ ] Every Co1 element built and `VERIFIED`
- [ ] Invariants emitted for each, with a named `checked_by`
- [ ] Exit tests X0–X5 pass (`A.0.22.2`)
- [ ] **X6** — GOVERNOR ratifies the seal
- [ ] Post-seal, Co1 changes require explicit desealing with downstream impact named

---

## A.0.6b — File naming

```
CISEM__[SPINE]__[Spine_Name]__V[n.n].md      canon, living, addressed
[Date]__[From]__[To]__[Description]__V[n.n]  artifacts, dated snapshots
standard language convention                  code modules
```

Canon files deviate from the dated convention deliberately: a date implies a snapshot, and canon is not a snapshot.

---

## A.0.8 — Sealing

| Property | Mechanism | Tier |
|---|---|---|
| Agents read, never write | Canon directory excluded from agent write scope | **T4** |
| Tampering detectable | Per-file checksum in a ratified registry, verified in the gate | T3 |
| Change requires a deliberate act | GOVERNOR ratification | T2 |
| Supersession is cheap | New item; old marked `SUPERSEDED by`; text preserved | process |

Mirrors the out-of-band gate integrity check already in `build.js`. **Code changes silently; a sealed change fails loudly.**

---

## A.0.32 — Open for ratification

| # | Question |
|---|---|
| `A.0.32.1` | The Co1 manifest — eight elements, this list? |
| `A.0.32.2` | The consequence: **D, E, F work is provisional until Co1 seals**? |
| `A.0.32.3` | Per-stage status vocabulary? |
| `A.0.32.4` | Typed links mandatory; prose arrows disallowed? |
| `A.0.32.5` | Cycle as a stamp; grid generated from stamps? |
| `A.0.32.6` | `cisem_core/canon/` as the canon's home in-repo (`A.3.50`)? |
