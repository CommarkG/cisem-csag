# I5 · CsAg · Vertical & Product

> ⚠️ **AUTHORED BY REVIEWER · AWAITING GOVERNOR RATIFICATION.** Every judgment call in this document was made by the reviewer, not the governor. Items carrying `RATIFIED` inherit a decision explicitly taken in session; all structure, sequencing, classification, and status assignment is proposed. See `R00` for the itemised list.


**Tier:** I — Instance. **Mirrors:** `U5`. **Cycle:** Co1 · pass 1.

---

## I5.0 — Charter

```
purpose:     What CISEM CsAg sells, to whom, and why they would choose it.
boundary:    I5 holds this product's facts and direction. The universal rules
             about core-vertical separation are U5's.
depends_on:  U5, I1, I2, I3, I4
governs:     I6
invariant:   governed_by U5.0 — the vertical may depend on the core; the core
             never depends on the vertical.
```

---

## I5.1 — State

### I5.1.01 — Zero customers
`CONFIRMED 2026-08-12` · Every named client is seed or mock data, in the seeding script, the template registry, and the admin store. **No one has paid or committed.** · `governed_by: U5.2.07`

### I5.1.02 — "Image processing" is catalog search indexing
`CONFIRMED` · The upload endpoint sends an image to a vision model for a textual description, then embeds that description into a 768-dimension vector. It is **search infrastructure**, not a user-facing tool. Unit cost well under a ten-thousandth of a currency unit. · `governed_by: U5.2.05` · `closes: I1.3.05`

### I5.1.03 — The vertical schema is complete and unserved
`CONFIRMED` · Catalog, product taxonomy, subcontractors, rate cards, supplier mappings, briefs, proposals, sandbox variants, plus vector similarity search. **The frontend surfaces almost none of it.** · `governed_by: U5.2.04`

### I5.1.04 — The frontend serves a different product
`CONFIRMED` · Task boards, timelines, calendars, task trees — generic project management, entirely client-side, mapping to **zero** database entities. · `governed_by: U5.2.04`

### I5.1.05 — WhatsApp notification is live
`CONFIRMED` · Real messages send through a third-party gateway from the settings surface. One of the few fully wired features.

### I5.1.06 — Cost drivers unanalysed
`INFERRED` · Per-call price is negligible. The real constraints are vision-model rate limits and accumulating vector and blob storage. Neither measured. · `governed_by: U5.2.05`

---

## I5.2 — Decisions

### I5.2.01 — Unique value proposition
`RATIFIED 2026-08-12`

**Plain:** CISEM sells AI-powered visual catalog search plus automatic WhatsApp updates to clients, for businesses that source and brand physical products. It does not sell project management.

**Evidence for:** the embedding pipeline exists · WhatsApp is live · the schema is complete · Hebrew-first catalog capability

**Reason for the exclusion:** task boards are free and mature in a dozen products. Competing there is competing on nothing. · `governed_by: U5.2.02`, `U5.2.03`

### I5.2.02 — Vertical may depend on core; never the reverse
`RATIFIED` · `governed_by: U5.2.01` · enforced by E14

### I5.2.03 — Build generic project management as the product
`REJECTED` · Commodity market, no differentiator, and the existing backend serves none of it. · `governed_by: U5.2.03`

---

## I5.3 — Findings

| Address | Finding | Status | Governed by |
|---|---|---|---|
| `I5.3.01` | Backend serves the vertical; frontend shows generic PM. Nothing joins them. | `OPEN` → `I6.5.10` | `U5.2.04` |
| `I5.3.02` | **The UVP is ratified and nothing has been built toward it** — no catalog surface, no visual search, no WhatsApp in workflow | `OPEN` → `I5.5.01` | `U5.2.02` |
| `I5.3.03` | Rate limits and storage growth unanalysed | `OPEN` → `I5.5.04` | `U5.2.05` |
| `I5.3.04` | The B2B hub renders static mocks with no wiring to the vertical schema | `OPEN` | `U1.2.13` |
| `I5.3.05` | Vertical entities have isolation on and no rules — the UVP core goes dark at the credential swap | `OPEN` → `I3.5.03` | `U3.2.07` |
| `I5.3.06` | Time-to-value chain undesigned | `PARKED` — `PARK-001` | — |

**`I5.3.02` is the strategic finding.** Every hour so far has gone into foundation. The product the foundation exists to serve has not been started. Correct sequencing — but it should be visible, not implicit.

---

## I5.4 — Mechanisms

| Address | Mechanism | Tier | Status |
|---|---|---|---|
| `I5.4.01` | E14 prevents core importing from vertical | T3 | ⬜ |
| `I5.4.02` | Vertical entities tenant-scoped by isolation rules | **T5** | ⬜ `I3.5.03` |
| `I5.4.03` | Usage monitoring against provider rate limits | T3 | ⬜ |

---

## I5.5 — Sequence

| Address | Task | Status |
|---|---|---|
| `I5.5.01` | Design the catalog surface — the first thing built toward the UVP | `BLOCKED by I6.5.10, I3.5.03` |
| `I5.5.02` | Design the time-to-value chain | `PARKED` — `PARK-001` |
| `I5.5.03` | Wire the B2B hub to the real schema, or retire it | `BLOCKED by I5.5.01` |
| `I5.5.04` | Measure rate limits and storage growth at projected volume | `READY` |
| `I5.5.05` | Bring WhatsApp into the proposal workflow, not only settings | `BLOCKED by I5.5.01` |

**All product work is blocked until `I3.5.05` and `I2.5.03`.** Building on an unenforced boundary produces features that must be rebuilt.

---

## I5.6 — Verification

| Claim | Proof |
|---|---|
| The UVP is real | A user uploads an image and finds the right catalog item |
| The vertical works end to end | Brief → catalog match → proposal → notification, one path |
| Cost is sustainable | Measured calls and storage at projected volume, not estimated |
| A customer wants it | **One named prospect who has seen it.** Not seed data. |

`I5.6.02` — Current standing: `NOT VERIFIED`. Zero customers, zero surface built toward the ratified UVP.
