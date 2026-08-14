# I6 · CsAg · Surface & Experience

> ⚠️ **AUTHORED BY REVIEWER · AWAITING GOVERNOR RATIFICATION.** Every judgment call in this document was made by the reviewer, not the governor. Items carrying `RATIFIED` inherit a decision explicitly taken in session; all structure, sequencing, classification, and status assignment is proposed. See `R00` for the itemised list.


**Tier:** I — Instance. **Mirrors:** `U6`. **Cycle:** Co1 · pass 1.

> **SSOT notice:** `governance/ux-ui-dna.md` remains the single source of truth for the CISEM wording of D1–D8, L1–L3, the standards list, and the plan gate. This document **references** it and records its durability tier. `U6.2.06` is the universal law it instantiates.

---

## I6.0 — Charter

```
purpose:     What a CISEM CsAg user sees, where its state lives, and which
             surface rules are currently broken.
boundary:    I6 holds this system's surface facts. Enforcement of anything it
             displays belongs to I2, I3, I4.
depends_on:  U6, I1, I2, I3, I4, I5
governs:     —
invariant:   governed_by U6.0 — the client renders and requests. It never
             decides and never invents.
```

---

## I6.1 — State

### I6.1.01 — Views are flat and unzoned
`CONFIRMED` · One directory mixes platform surfaces, operator surfaces, a vertical surface, and four generic project-management views. Lane classification requires opening each file. · `governed_by: U5.2.01`

### I6.1.02 — Stores are flat and unscoped
`CONFIRMED` · A platform shell store, a generic task store, a vertical CRM store, a collaboration store, and a notification store, side by side, with nothing distinguishing blast radius.

### I6.1.03 — No server persistence for the product surfaces
`CONFIRMED` · Every store persists to browser storage under a fixed prefix. **No tenant field on any record.** Clearing a browser deletes the workspace. · `governed_by: U6.2.01`

### I6.1.04 — Wired versus mock inventory
`CONFIRMED`

| Surface | State |
|---|---|
| Template hub | wired — writes to the server-side registry file |
| Notifications | wired — real messages via the gateway |
| Task board, timeline, calendar, list | client-only, browser storage |
| B2B hub | static mock |
| White-label | UI-only mock with a **client-side tier toggle** |
| Home dashboard | wired — reads operator status files |

### I6.1.05 — UX DNA status
`CONFIRMED` · Status on-trial. The mechanical page audit is marked as an honest, unshipped gap. Sealing requires two real redesigns passing plus ratification. · `governed_by: U6.2.08`

---

## I6.2 — Decisions

| Address | Decision | Governed by |
|---|---|---|
| `I6.2.01` | Server is truth; browser storage holds only per-device preference | `U6.2.01` |
| `I6.2.02` | Session from the provider SDK; the client never constructs or modifies a claim | `U6.2.02` |
| `I6.2.03` | One data-access layer under the platform zone; components do not fetch directly | `U6.2.04` |
| `I6.2.04` | Loading, empty, and error designed for every surface | `U6.2.05` |
| `I6.2.05` | Zone layout for the source tree; manifest first, files moved opportunistically | `U5.2.01` |

---

## I6.3 — Findings

### Structural

| Address | Finding | Status |
|---|---|---|
| `I6.3.01` | Task board, timeline, calendar, list, tasks, collaboration, clients — **zero server persistence, no tenant field** | `OPEN` → `I6.5.10` |
| `I6.3.02` | Views and stores flat and unzoned | `OPEN` → `I6.2.05` |
| `I6.3.03` | The generic PM surface maps to **no database entities** — an orphan, not a migration candidate | `OPEN` → `I6.5.10` |

### Live rule violations

| Address | Rule | Violation | Governed by |
|---|---|---|---|
| `I6.3.10` | Never gate on a client-side check alone | The white-label view has a tier selector toggling enterprise features in local state | `U1.2.14` |
| `I6.3.11` | Never ship a secret credential to the browser | ✅ no violation found | `U6.2.02` |
| `I6.3.12` | Never treat simulated role or user as authorization | The shell store defaults both from browser storage | `U2.2.09` |
| `I6.3.13` | **Never substitute mock data for real data** | The template hub falls back to a hardcoded registry | `U1.2.13` |
| `I6.3.14` | Never fetch tenant data outside the data layer | Scattered fetch calls across views | `U6.2.04` |

**`I6.3.13` is the surface twin of `I3.3.07`.** Same law, both layers: fail visibly, never plausibly.

### I6.3.20 — Sixteen operator surfaces required, one partially exists
`OPEN` · `governed_by: U6.2.09`

The home dashboard reads operator status files — the only surface exposing any governing state. **Fifteen of sixteen mandatory operator surfaces do not exist.**

Every definition produced in this system's governance work is currently readable only in documents and conversation. The governor must remember where each lives.

### I6.3.21 — Zero scope-facing definition surfaces exist
`OPEN` · `governed_by: U6.2.09.4`

No scope can read its own entitlement, template version, role permissions, limits, or lifecycle notices. **A scope would discover a limit by hitting it.**

### I6.3.22 — The one existing surface reads files, not live state
`OPEN` · `governed_by: U6.2.09.6`

Status is rendered from status files rather than from the mechanisms themselves. A file can be stale while the surface looks authoritative.


### I6.3.23 — Twenty-one surfaces are named; zero journeys are defined
`OPEN` · `governed_by: U6.2.10`

Sixteen operator and five scope-facing surfaces exist as names. **No trigger, intent, entry point, steps, exit, goal, or measurable result has been defined for any of them.** An actor building from this list invents twenty-one interaction models that cannot be consistent with each other.

### I6.3.24 — The surface list is ordered by canon structure, not by need
`OPEN` · `governed_by: U6.2.07`

Violates the ordering law directly. The list reflects the order the registers were authored, which is the author's convenience presented as navigation.

### I6.3.25 — Five operator journeys, none specified
`OPEN` · `governed_by: U6.2.10.1`

| Journey | Question | Frequency |
|---|---|---|
| **J1 Orient** | What should I do next? | daily |
| **J2 Health** | Is anything broken? | daily |
| **J3 Trace** | Why is this the way it is? | on demand |
| **J4 Prove** | Did what we built actually work? | per cycle |
| **J5 Govern** | What am I being asked to decide? | per cycle |

Each spans several registers. **The registers are data; these are the interface.**

### I6.3.26 — No relationship navigation
`OPEN` · `governed_by: U6.2.10.3`

Finding → mechanism → invariant → verification is a chain. Nothing specifies it as traversable. A displayed address that cannot be followed reproduces the chase in a new location.

### I6.3.27 — Density unplanned
`OPEN` · `governed_by: U6.2.10.4`

The canon will reach hundreds of items. Twenty-one flat lists at that scale are exports, not surfaces.

### I6.3.28 — No measurement defined for any surface
`OPEN` · `governed_by: U1.2.35`

No metric, baseline, target, owner, cadence, or evidence source exists for any planned surface. **No baseline can be taken retroactively** — anything measured after building is unanchored.


---

## I6.4 — Mechanisms — the UX DNA on the ladder

| Address | Mechanism | Tier | Note |
|---|---|---|---|
| `I6.4.01` | The written DNA standard | **T1** | Will degrade, like every T1 rule tested this session |
| `I6.4.02` | The plan gate — per-surface declaration in every UI plan | **T1** | A promise in a plan; nothing verifies the shipped surface |
| `I6.4.03` | Standards read live by the gate agent | **T2 or T3** | **Depends on whether the gate blocks or advises.** Unresolved — `I6.5.20` |
| `I6.4.04` | The mechanical page audit | not shipped | **This is the T3 mechanism** |

### I6.4.05 — What the audit can and cannot assert
`RATIFIED` · `governed_by: U6.2.08`

**Automatable (7):** location indicator present · stage indicator on multi-step surfaces · exactly one recommended option marked with a rationale · every primary action declares its next state · every interactive element has a pending state · images at native aspect ratio · no two components rendering the same source.

**Judgment-dependent (4):** user value · containing pipeline (partially checkable from corespine headers) · quality of a recommendation · ordering by current need.

**Ship the seven only**, with output stating it verifies structure, not judgment. An audit claiming otherwise is a fabricated verification.

---

## I6.5 — Sequence

| Address | Task | Status |
|---|---|---|
| `I6.5.01` | Zone manifest for the source tree | `BLOCKED by` enumeration |
| `I6.5.02` | Build the single data-access layer | `BLOCKED by I2.5.03` |
| `I6.5.03` | Remove the client-side tier toggle; read entitlement from the accessor | `BLOCKED by I4.5.02` |
| `I6.5.04` | Mock fallback becomes a visible degraded state | `READY` |
| `I6.5.05` | Confine simulated role to dev display, unreachable by permission logic | `BLOCKED by I2.5.03` |
| `I6.5.06` | Ship the audit with the seven mechanical assertions | `READY` |
| `I6.5.10` | **Decide: build persistence for the generic PM surface, or retire it** | `PARKED` — `PARK-010` |
| `I6.5.20` | Confirm whether the gate agent blocks or advises | `READY` — ratifier |
| `I6.5.30` | Surface the mechanism results and invariant suite — live, not from files | `BLOCKED by I1.5.01` |
| `I6.5.31` | Surface the canon: addressed, searchable, with status and tier | `BLOCKED by I1.5.01` |
| `I6.5.32` | Surface the registers — findings, deferrals, rejections, corrections | `READY` |
| `I6.5.33` | Surface sequence and blocking relationships | `READY` |
| `I6.5.34` | Surface cycle state and loop backlogs | `BLOCKED by I1.4.16` |
| `I6.5.35` | Surface zones and dependency violations | `BLOCKED by` zone manifest |
| `I6.5.36` | Surface entitlement model and template lifecycle | `BLOCKED by I4.5.01` |
| `I6.5.37` | Build the five scope-facing surfaces | `BLOCKED by I2.5.03, I4.5.02` |
| `I6.5.38` | Coverage-mirror audit: every canon item has a surface, every surface a canon item | `BLOCKED by I6.5.31` |
| `I6.5.40` | **Define the five operator journeys** — seven fields each, before any surface is built | `READY` |
| `I6.5.41` | Define the depending-party journeys separately, from that role's work | `BLOCKED by I4.5.01` |
| `I6.5.42` | Order the interface by question frequency, not register structure | `BLOCKED by I6.5.40` |
| `I6.5.43` | Specify relationship traversal — which addresses are followable from where | `BLOCKED by I6.5.40` |
| `I6.5.44` | Density plan at projected scale, not current scale | `BLOCKED by I6.5.40` |
| `I6.5.45` | **Take baselines for every journey metric before any surface ships** | `READY` — cannot be done later |
| `I6.5.46` | Schedule the late-window review at 3–6 months, with a named owner, at build time | `BLOCKED by I6.5.45` |

**`I6.5.10` is referenced as a blocker by four topics.** It is parked, not open — it is second-cycle work and cannot enter until the first cycle seals.

---

## I6.6 — Verification

| Change | Proof |
|---|---|
| Any surface | Rendered behaviour, **not** a passing build |
| Persistence | Data survives a different browser on a different device |
| Tenant scoping | One tenant's session cannot render another's data — the client half of E5 |
| DNA compliance | The seven mechanical assertions pass; judgment items reviewed and recorded separately |
| Degraded states | Loading, empty, and error each demonstrated — a mock fallback is not one of them |

`I6.6.02` — Current standing: `NOT VERIFIED`. No server persistence, no data layer, audit unshipped, three live violations.
