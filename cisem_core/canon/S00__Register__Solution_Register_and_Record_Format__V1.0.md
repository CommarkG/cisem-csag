# S00 · Register · Solution Register & Record Format

> ⚠️ **AUTHORED BY REVIEWER · AWAITING GOVERNOR RATIFICATION.** Every judgment call in this document was made by the reviewer, not the governor. Items carrying `RATIFIED` inherit a decision explicitly taken in session; all structure, sequencing, classification, and status assignment is proposed. See `R00` for the itemised list.


**Tier:** S — Solution (register). **Status:** Draft for GOVERNOR ratification

> **Honest constraint.** No solution has been processed. A record cannot be written before its solution runs through `P1` — that would be fabrication. This document holds the **register** and the **record format**. Solutions enter after `P1` is ratified.

---

## S00.1 — The register

Solutions are numbered in the order they **enter** the pipeline, not by priority.

| ID | Solution | Status | Entered | Blocked by |
|---|---|---|---|---|
| `S01` | *unassigned* | not entered | — | `I3.5.05`, `I2.5.03` |

**Nothing may enter yet.** Every candidate depends on an enforced tenant boundary. Building a solution on an unenforced boundary produces work that must be rebuilt — which is the failure this whole structure exists to stop.

### S00.1.1 — Candidates, not a roadmap

| Candidate | Blocked by |
|---|---|
| Catalog visual search surface | `I3.5.05`, `I6.5.10` |
| Proposal workflow with notification | `I2.5.03`, `I6.5.10` |
| Entitlement and tier enforcement | `I4.5.01` |
| Observability | **nothing** — could enter as soon as `P1` is ratified |

**Observability is the only unblocked candidate**, and by `U7.2.07` it must exist before the first external party. It is the natural `S01`.

---

## S00.2 — Record format

One document per solution, `S{nn}__{Solution}__Pipeline_Record__V{n.n}.md`.

```
# S01 · {Solution} · Pipeline Record

## S01.P1 — Intent
   status · artifact · exit met? · date

## S01.P2 — Fit
   ... one section per pipeline stage, P1 through P9 ...

## S01.P9 — Record
   invariants emitted:  INV-...
   items deferred:      PARK-...
   expectations updated: ...

## S01.C — Consolidation
   frictions:            where P1 did not fit
   promotion candidates: what might be general
   promoted:             what appeared twice and moved to U or P
   demotion candidates:  U items never needed
   contradictions:       resolved, with addresses
```

**Rules:**
- Every stage section exists, even if its artifact is one line. A missing section means the stage did not run.
- Each section records **status**, **artifact**, and **whether the exit condition was met** — three separate facts.
- The consolidation section is written *after* the solution completes, never during.
- A record is never edited after consolidation. Corrections supersede.

---

## S00.3 — Entry conditions

A solution enters the register when **all** hold:

- [ ] `P1` is ratified
- [ ] Its dependencies are `CLOSED` — not "mostly"
- [ ] It is not in the deferral register
- [ ] Among unblocked candidates, it has the highest blast radius (`U1.2.07`)
- [ ] The cumulative invariant suite passes (`U1.2.03`)

**The last one is the inheritance obligation at solution scale.** A solution cannot begin while something previously established has stopped holding.

---

## S00.4 — Open for ratification

| # | Question |
|---|---|
| `S00.4.1` | Record format, one section per pipeline stage plus consolidation? |
| `S00.4.2` | Solutions numbered by entry order, not priority? |
| `S00.4.3` | Observability as `S01` — the only unblocked candidate and required before any external party? |
| `S00.4.4` | Entry requires the cumulative suite to pass? |
