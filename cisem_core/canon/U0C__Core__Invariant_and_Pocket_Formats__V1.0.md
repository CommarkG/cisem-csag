# U0C · Core · Invariant & Pocket Formats

> ⚠️ **AUTHORED BY REVIEWER · AWAITING GOVERNOR RATIFICATION.** Every judgment call in this document was made by the reviewer, not the governor. Items carrying `RATIFIED` inherit a decision explicitly taken in session; all structure, sequencing, classification, and status assignment is proposed. See `R00` for the itemised list.


**Tier:** U — Universal (canon law). **Supersedes:** the prior cycle-law draft (see `I1.2.10`)
**Status:** Draft for GOVERNOR ratification

> **Reissue note.** Most of the prior draft's content was absorbed into `U1` as principles — inheritance `U1.2.03`, invariants `U1.2.04`, gates `U1.2.05`, first-cycle criterion `U1.2.06`, selection `U1.2.07`, hardcoding and pockets `U1.2.09`. What remained unhomed were two **artifact formats**. Restating the principles here would have violated `U4.2.05`. This document holds only what `U1` requires but does not shape.

---

## U0C.0 — Charter

```
purpose:     The concrete shape of the two artifacts that make inheritance
             and scoped reasoning mechanical rather than aspirational.
boundary:    U0C owns format. U1 owns why these exist. U0B owns where they
             sit in the naming grid.
depends_on:  U0A, U0B, U1
governs:     every invariant and every pocket
invariant:   An invariant without an executable checker is a wish. A pocket
             without a conflict set is a suggestion.
```

---

## U0C.2.01 — Invariant format
`RATIFIED` · required by `U1.2.04`

One file per invariant. Never edited — superseded, with the original preserved.

```yaml
id:          INV-U3-003
source:      U3.2.03
cycle:       Co1
states:      Every rule permitting modification carries an explicit
             modification predicate, separate from the visibility predicate.
checked_by:  security/e4_policy_lint.py::rule_3
tier:        T3
sealed:      pending
supersedes:  —
```

| Field | Rule |
|---|---|
| `id` | `INV-{source-address}-{nnn}`, numbered within its source |
| `source` | The `U` or `I` address this enforces. **Mandatory** — an invariant with no source is an opinion. |
| `states` | The assertion, in one sentence, in the tier language of its source |
| `checked_by` | An executable path. **If empty, `tier` must be T1 and the invariant is recorded as a known weakness under X2.** |
| `tier` | Its position on the durability ladder |
| `sealed` | Date, or `pending`. Sealed invariants require desealing to change. |

**The cumulative suite is the directory.** Running it is running every file. Cycle N passes when the whole directory passes.

---

## U0C.2.02 — Pocket format
`RATIFIED` · required by `U1.2.09`

Five sections, all mandatory. A pocket missing any section is not a pocket.

```
POCKET: I3.5.03 — rules for the uncovered entities

1. SCOPE
   topic:    I3
   entities: the 25 reported by the coverage check
   files:    security/, change artifacts
   lane:     Core

2. INHERITED INVARIANTS            ← assembled, never hand-written
   INV-U2-002  identity is bound, never asserted
   INV-U3-003  read predicates are never write predicates
   INV-U3-004  permissive visibility never reaches a write path
   INV-U3-005  grant to the narrowest role
   INV-U1-010  no credential value in output

3. PROHIBITIONS
   no execution against the persistence layer — ratifier only
   no path outside the declared boundary
   no proposal matching the deferral register

4. CONFLICT SET                    ← what disqualifies the output
   REJECTED  a modification rule inheriting a permissive visibility clause
   REJECTED  a modification rule with no explicit modification predicate
   REJECTED  authorization data stored where its subject can write it

5. EXIT EVIDENCE                   ← stated before work begins
   drift check exit 0 · policy check exit 0 · per-entity rule count
```

| Property | Mechanism | Tier |
|---|---|---|
| **Sealed** | Checksum in the ratified registry; the actor cannot alter it | T3 |
| **Scoped** | Only the canon governing this task. **A small pocket is a strong pocket.** | design |
| **Read-only** | Canon excluded from actor write scope | **T4** |
| **Assembled** | Sections 2 and 4 generated from the suite and the rejected register, never typed | T3 |

**Why "pocket":** a container the actor carries and cannot reach outside of. Not a file it may consult. Not advice.

---

## U0C.2.03 — Assembly is mechanical
`RATIFIED`

Sections 2 and 4 are **generated**. A hand-written pocket is a prompt wearing a pocket's name, and inherits every weakness of T1.

```
scope declaration
   └── suite filtered by topic        → section 2
   └── rejected register filtered      → section 4
   └── deferral register               → section 3
   └── verification standard by change type → section 5
```

The only human-written parts are the scope and the lane.

---

## U0C.3.01 — Neither format is built
`OPEN` · No invariant file exists. No pocket has been assembled. Both are specifications awaiting `I1.5`.

Until then, inheritance is checked by attention — which is T0, and T0 fails.

---

## U0C.4 — Open for ratification

| # | Question |
|---|---|
| `U0C.4.1` | Invariant format, with `checked_by` mandatory or the tier forced to T1? |
| `U0C.4.2` | Pocket format, five mandatory sections? |
| `U0C.4.3` | Sections 2 and 4 generated, never hand-written? |
| `U0C.4.4` | The prior cycle-law draft superseded, its principles residing in `U1`? |
