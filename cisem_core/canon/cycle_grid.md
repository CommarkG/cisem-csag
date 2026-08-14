# Core Cycle Grid

**Generated view** — computed from item cycle stamps (`A.0.30`). **Do not edit by hand.**
**Generated:** 2026-08-12 · pass 1 · manually assembled pending the generator

---

## How to read it

Rows are Co1 elements (`A.0.31`). Columns are passes. Each cell is computed from the items belonging to that element:

| Value | Computed when |
|---|---|
| `ADVANCED` | Any item has `Last advanced = this pass` |
| `NOT-READY: <dep>` | All items are `BLOCKED by` something still `OPEN` |
| `DEFERRED: <reason>` | Items are `PARKED` |
| `SEALED` | Element passed X0–X6 |

**No cell is ever empty.** An element with no items is `NOT-READY: not yet charted`.

**Escalation:** three consecutive `NOT-READY` passes escalates — the blocker is not being worked.

---

## Co1 — Root fundamentals

| Element | Pass 1 (2026-08-12) | Pass 2 | Pass 3 |
|---|---|---|---|
| **Co1.1** Tenant identity authority | `NOT-READY: B.5.01` | | |
| **Co1.2** Tenant boundary (RLS) | `ADVANCED` — 4/31 tables | | |
| **Co1.3** Durability ladder | `ADVANCED` — defined `A.0.10` | | |
| **Co1.4** Canon & addressing | `ADVANCED` — defined, **not in repo** `A.3.50` | | |
| **Co1.5** Zone dependency direction | `NOT-READY: A.2.01 unratified` | | |
| **Co1.6** Core Cycle Law | `ADVANCED` — defined, no invariant suite | | |
| **Co1.7** Secrets off disk | `ADVANCED` — T4, verified `A.6.02` | | |
| **Co1.8** Agent boundary | `ADVANCED` — T2, verified `A.6.01` | | |

**Co1 standing: 6 advanced, 2 not-ready, 0 sealed.** Seal blocked by Co1.1 and Co1.5.

---

## Co2+ — flexible, dependency-entered

Cycle content is never predefined (`A.0.22`). Entry requires every declared dependency `CLOSED`. Among unblocked topics, selection is by **highest blast radius first** (`A.0.24.1`).

| Candidate | Entry gate | Pass 1 |
|---|---|---|
| **Co2** Data coverage — remaining 25 tables | `C.5.02` done | `NOT-READY: C.5.01` |
| **Co3** Entitlement model | `D.5.01` + `E.2.01` | `NOT-READY: D.3.01` |
| **Co4** Product surface (catalog, visual search) | `C.5.06` + `F.5.10` | `NOT-READY: F.5.10 unanswered` |
| **Co5** Frontend persistence & data layer | `B.5.03` + `F.5.10` | `NOT-READY: B.5.03` |
| **Co6** Observability & deployment | `G.0.3`, `G.0.4` chartered | `NOT-READY: not yet charted` |

**These are candidates, not a roadmap.** A cycle's contents are decided at entry, from what is unblocked, ordered by blast radius. Anything written here as "Co4 will contain X" would be fabrication.

---

## Pass 1 summary

| | |
|---|---|
| Elements advanced | 6 |
| Elements not-ready | 2 |
| Elements escalated | 0 (needs 3 consecutive) |
| Cycles entered | Co1 only |
| Cycles sealed | none |

**Pass 1 was a foundation pass.** Two Co1 elements did not advance, both in the identity chain — which is also the chain that blocks four of five Co2+ candidates. That is the single highest-leverage row in this grid.

---

## Generator — not yet built

This file is currently assembled by hand, which makes it a document rather than a view — the exact failure mode it exists to prevent.

**Required:** a script that reads every canon item's `Cycle`, `First seen`, `Last advanced`, and `Status`, groups by Co element, computes each cell, and regenerates this file.

`address: A.4.16` · `tier: T3` · `depends_on: A.3.50` (canon must be in the repo before anything can read it)

Until then this grid is `INFERRED`, not `CONFIRMED`.
