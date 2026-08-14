# U0B · Core · Naming & Numbering Grid

**Tier:** U — Universal (canon law). **Supersedes:** `A.0` V1.1 addressing sections.
**Status:** Draft for GOVERNOR ratification. **Nothing is renamed until ratified**, or every artifact moves twice.

---

## U0B.0 — Charter

```
purpose:     One grid covering every artifact the system produces, so that a
             name states what a thing is, which tier it belongs to, and where
             it sits, before it is opened.
boundary:    U0B owns names, addresses, and reserved ranges. U0A owns the tier
             separation those names carry. U0C owns the cycle law.
depends_on:  U0A
governs:     every document, record, and artifact
invariant:   A name that does not declare its tier is not a name.
```

---

## U0B.2.01 — The canon-law series

`RATIFIED` · resolves collision #3.

Documents *about the canon itself* are a different kind of thing from documents about the system. They form the `U0` series and use a **letter suffix**, so a document identifier can never be confused with a stage number.

| Document | Owns |
|---|---|
| `U0A__Core__Tier_Separation__V1.0.md` | The four tiers, the one-tier rule, batch sequence, promotion |
| `U0B__Core__Naming_and_Numbering_Grid__V1.0.md` | This — every name, address, and range |
| `U0C__Core__Core_Cycle_Law__V1.0.md` | Inheritance, invariants, entry and exit gates |

Internal addresses: `U0A.2.01`, `U0B.2.01`, `U0C.2.03`. No ambiguity with stage numbering.

---

## U0B.2.02 — The complete artifact grid

`RATIFIED`

| Class | Filename pattern | Address pattern | Example |
|---|---|---|---|
| **Canon law** | `U0{A-Z}__Core__{Topic}__V{n.n}.md` | `U0A.{stage}.{item}` | `U0A.2.01` |
| **Universal core** | `U{1-7}__Core__{Topic}__V{n.n}.md` | `U{n}.{stage}.{item}` | `U3.2.04` |
| **Instance** | `I{1-7}__CsAg__{Topic}__V{n.n}.md` | `I{n}.{stage}.{item}` | `I3.3.07` |
| **Pipeline** | `P{n}__Pipeline__{Stage}__V{n.n}.md` | `P{n}.{item}` | `P2.04` |
| **Solution** | `S{nn}__{Solution}__{Artifact}__V{n.n}.md` | `S{nn}.P{n}.{item}` | `S01.P4.02` |
| **Invariant** | `INV-{source-address}-{nnn}.yaml` | same | `INV-U3-003` |
| **Pocket** | `POCKET__{scope-address}__V{n}.md` | same | `POCKET__I3.5.03__V1.md` |
| **Deferral register** | `PARKED.md` (fixed name, one file) | `PARK-{nnn}` | `PARK-007` |
| **Zone manifest** | `zones.json` (fixed name) | — | — |
| **Cycle view** | `cycle_grid.md` (generated, fixed name) | `Co{n}.{element}` | `Co1.5` |
| **Expectation snapshot** | `{subject}_snapshot.json` | — | `policy_snapshot.json` |
| **Mechanism script** | `{mechanism-id}_{purpose}.{ext}` | `I{n}.4.{nn}` | `e4_policy_lint.py` |
| **Migration** | `{Date}__{Scope}__{Subject}__V{n.n}.sql` | `I{n}.5.{nn}` | dated, one-shot |
| **Dated artifact** | `{Date}__{From}__{To}__{Description}__V{n.n}.{ext}` | — | plans, reviews, walkthroughs |
| **Code module** | standard language convention | corespine header | `medusaClient.ts` |
| **Superseded snapshot** | original name, unchanged forever | `SUPERSEDED by {address}` | — |

### U0B.2.02a — Scratch versus artifact
`PROPOSED`

> **If a file must exist after the turn ends for work to continue, it is not scratch.**

| | Is | Named | Deleted |
|---|---|---|---|
| **Scratch** | A single-turn proof, complete when the turn ends | free | at the end of the turn |
| **Artifact** | Anything another party must run, read, or carry into another context | per this grid | by a supersession decision |

**The failure this prevents:** a file created in a temporary location, deleted as cleanup, and then referenced by an instruction to someone else. The instruction points at nothing, and the reader discovers it only on attempting the work.

**Two conventions, never mixed:**
- **Living and addressed** → canon pattern. A date would imply a snapshot; canon is not one.
- **Dated snapshot** → date-first pattern. It records a moment and is never edited after.

---

## U0B.2.03 — Topic numbers

`RATIFIED` · `U{n}` and `I{n}` are the same topic, one as law and one as fact.

| # | Topic |
|---|---|
| 1 | Governance & Method |
| 2 | Identity & Tenancy |
| 3 | Data & Persistence |
| 4 | Entitlement & Templates |
| 5 | Vertical & Product |
| 6 | Surface & Experience |
| 7 | Operations & Cadence |

**The mirror is the check.** An `I{n}` item citing no `U{n}` item has leaked a principle downward. A `U{n}` item with no `I{n}` counterpart is either an unapplied law or speculation. Both are findings, both detectable mechanically.

---

## U0B.2.04 — Stages

`RATIFIED` · migrated from `A.0.3`, unchanged. Applies within `U` and `I`.

| Stage | Name | Answers |
|---|---|---|
| 0 | Charter | What this is, its boundary, what it relies on and serves |
| 1 | State | What exists now, checked against source |
| 2 | Decision | What was chosen, **what was rejected and why**, what superseded what |
| 3 | Finding | Gaps, defects, contradictions, duplications, partial implementations |
| 4 | Mechanism | What enforces this, at which tier, and which invariants it checks |
| 5 | Sequence | The ordered work to close stage 3 |
| 6 | Verification | What counts as proof, and current standing |

**Tier expectation:** `U` documents are mostly stage `.2`. `I` documents are mostly `.1` and `.3`. A `U` document heavy in findings has bled instance; an `I` document heavy in decisions has bled principle.

---

## U0B.2.05 — Status vocabulary, per stage

`RATIFIED` · migrated from `A.0.4`. **No status outside its stage's list.**

| Stage | Valid |
|---|---|
| `.1` State | `CONFIRMED` (source named) · `INFERRED` · `STALE` |
| `.2` Decision | `PROPOSED` · `RATIFIED` · `REJECTED` · `SUPERSEDED by {addr}` |
| `.3` Finding | `OPEN` · `CLOSED` · `KNOWN` · `PARKED` |
| `.4` Mechanism | `PROPOSED` · `BUILT` · `VERIFIED` (has failed on a known-bad input) · `RETIRED` |
| `.5` Sequence | `BLOCKED by {addr}` · `READY` · `IN PROGRESS` · `DONE` |
| `.6` Verification | `VERIFIED` · `NOT VERIFIED` · `PARTIAL` (scope stated) |

`REJECTED` is permanent. The item keeps its address and its reason forever.

---

## U0B.2.06 — Link types

`RATIFIED` · migrated from `A.0.5`. Four types only; prose arrows are not links.

| Link | Meaning |
|---|---|
| `closes: {addr}` | Resolves that finding |
| `supersedes: {addr}` | Replaces it; original text preserved |
| `depends_on: {addr}` | Cannot proceed until that is closed |
| `conflicts_with: {addr}` | Contradicts it; must be resolved before either is ratified |
| `governed_by: {addr}` | **NEW** — this is the local application of a law stated once elsewhere |

`governed_by` was added at the X0 gate, pass 1, when the same law was found stated in two documents. It is the mechanism that keeps one law in one place while letting several documents apply it.

---

## U0B.2.07 — Mechanism identity

`RATIFIED` · resolves collision #2.

A mechanism has **one canonical address and one short name**. They are not competing identifiers.

```
canonical:   I{n}.4.{nn}      where it lives, which spine it serves
short name:  E{nn}            what to call it in conversation and filenames
```

| Short | Canonical | Purpose |
|---|---|---|
| E1 | `I1.4.01` | Agent filesystem boundary |
| E2 | `I1.4.02` | Secrets off disk |
| E3 | `I3.4.03` | Schema drift detector |
| E4 | `I3.4.04` | Policy linter |
| E5 | `I3.4.05` | Two-party isolation test |
| E6 | `I1.4.06` | Command receipts |
| E7 | `I1.4.07` | Tool-output mimicry ban |
| E8 | `I1.4.08` | Generated file-report tables |
| E9 | `I1.4.09` | Banned-token scan |
| E10 | `I7.4.10` | Gate mandatory on the deployment path |
| E11 | `I3.4.11` | Applied-change ledger |
| E12 | `I7.4.12` | Deferral-register scan |
| E13 | `I2.4.13` | Route table generation |
| E14 | `I1.4.14` | Import direction linter |
| E15 | `I1.4.15` | Canon seal |
| E16 | `I1.4.16` | Cycle grid generator |

**Short names are not reused.** E-numbers are permanent; a retired mechanism keeps its number.

---

## U0B.2.08 — Reserved ranges

`RATIFIED`

| Range | Reserved for |
|---|---|
| `U0A`–`U0Z` | Canon law documents |
| `U1`–`U7` / `I1`–`I7` | The seven topics. **Not extended.** A new domain joins an existing topic or the topic map is re-ratified. |
| `{n}.4.01`–`{n}.4.99` | Mechanisms, matching E-numbers |
| `{n}.2.01`–`{n}.2.29` | Ordinary decisions |
| `{n}.2.30`+ | Doctrines — multi-item decision sets |
| `S01`–`S99` | Solutions, in the order they enter the pipeline |
| `PARK-001`+ | Deferrals |
| `INV-{addr}-001`+ | Invariants, numbered within their source address |

---

## U0B.2.09 — Supersession is recorded at the instance tier
`PROPOSED`

**Which specific documents a given project supersedes is an instance fact, not a universal law.** Naming them here would be tier bleed — this document would carry a project's file names and dates.

The universal rule, and all this document owns:

> A superseded artifact keeps its original name unchanged, is never edited again, and is never cited as authority. Its replacement records the supersession with an address.

**The project's supersession table lives at `I1.2.10`.**

*This item is itself a correction: the first draft of `U0B` contained the project's file list, and the tier check caught it.*

## U0B.2.10 — Headings carry the address

`RATIFIED`

Every section heading leads with its address, so a reader landing mid-document knows the tier, topic, stage, and item without scrolling up.

```
### I3.3.04 — Twenty-five entities with isolation enabled and no rule
Status: OPEN · Cycle: Co1 · First seen: pass 1 · Last advanced: pass 1
governed_by: U3.2.07  ·  depends_on: I3.5.02
```

**This is the context carrier.** Not decoration — the tier assertion, re-read at every heading, at every citation, and in every filename.

---

## U0B.2.11 — Where a new artifact goes

`RATIFIED` · four questions, in order.

1. **Is it about the canon itself?** → `U0{letter}`
2. **Would it be true for a different company in 2035?** → `U{topic}`
3. **Is it a fact about, or work on, this system?** → `I{topic}`
4. **Is it a method for turning intent into a verified solution?** → `P`; **an instance of running that method?** → `S{nn}`

**If none fits, the artifact is not yet understood well enough to be filed.** That is a finding, not a filing problem.

---

## U0B.3 — Findings from building this grid

### U0B.3.01 — Two addressing schemes ran in parallel
`CLOSED by U0B.2.09` · A–G and U/I both live, with A–G content mapped into U/I but never declared dead. Caught by building the grid; would not have been caught by reading either document alone.

### U0B.3.02 — Mechanisms carried two competing identities
`CLOSED by U0B.2.07` · `E{nn}` and `A.4.{nn}`, with the second orphaned when spine A was superseded.

### U0B.3.03 — Document identifier collided with stage number
`CLOSED by U0B.2.01` · `U0.1` readable as either. Resolved by letter suffixes on canon-law documents.

### U0B.3.04 — Eight artifact classes had no naming rule
`CLOSED by U0B.2.02` · Deferral register, zone manifest, cycle view, snapshots, mechanism scripts, invariants, pockets, migrations — all created and cited without a stated convention.

**Pattern across all four:** each was invisible while reading any single document and obvious the moment every artifact class was listed in one table. **The grid is the mechanism, not the documentation of one.**

---

## U0B.4 — Open for ratification

| # | Question |
|---|---|
| `U0B.4.1` | The artifact grid `U0B.2.02` — all sixteen classes? |
| `U0B.4.2` | Canon-law letter suffixes; `U0` becomes `U0A`? |
| `U0B.4.3` | Mechanism dual identity — canonical address plus permanent short name? |
| `U0B.4.4` | `governed_by` as a fifth link type? |
| `U0B.4.5` | **Spines A–G declared superseded**, files preserved as snapshots? |
| `U0B.4.6` | Topic map fixed at seven, not extended without re-ratification? |
