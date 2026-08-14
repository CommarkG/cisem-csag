# CISEM Canon — Core Cycle Law

**Address:** `A.0.20`–`A.0.29` — extends the Canon Addressing System (`A.0`)
**Status:** Draft for GOVERNOR ratification
**Supersedes:** nothing. Extends `A.0.3` (stages) with the cycle law that governs them.

---

## A.0.20 — The Inheritance Obligation

> **Core cycle N is accountable for cycles 1 through N−1. Every cycle must prove that everything previously established still holds, before it may add anything new.**

This is the strongest principle in the corespine model, and the one that separates a system that accumulates from a system that merely accretes.

**Plain:** Every time you build something new, you must first prove that everything you built before still works. Not remember it. Not assume it. Prove it, with a test that runs.

### A.0.20.1 — Why this is the strongest principle

Three failures this session, all the same failure:

| What happened | What it actually was |
|---|---|
| `user_metadata` proposed 3× after correction | An earlier cycle's established rule, not re-proven, silently reversed |
| `FOR ALL` + `IS NULL` reissued 2× after being closed | A closed finding, reopened by the next cycle's work |
| "No backend exists" built upon for three documents | An unverified inheritance, propagated forward |

None was a new mistake. Each was an **old decision that stopped holding**, because nothing forced the new work to re-prove the old ground. Building forward without proving backward is how a system rots while appearing to progress — and it is the mechanical description of the restart loop.

### A.0.20.2 — Inheritance is not documentation

A prior decision written in a document is **not inherited**. It is remembered, and memory is T0/T1 on the durability ladder. Inheritance requires that the prior decision exist as an **executable assertion** that the current cycle must pass.

> The test: *if cycle 4 contradicted cycle 2, what would stop it?*
> If the answer is "someone would notice," cycle 2 is not inherited.
> If the answer is "the build fails," it is.

---

## A.0.21 — The invariant, and the cumulative suite

### A.0.21.1 — What a cycle emits

**A cycle that exits without emitting invariants has established nothing.** It has produced work, not ground to stand on.

On exit, every cycle emits one or more **invariants**: machine-checkable assertions of what it established.

```
INV-C-003
  cycle:     Co1
  spine:     C
  states:    Every INSERT/UPDATE/ALL policy carries an explicit WITH CHECK
  checked_by: cisem_core/security/e4_policy_lint.py::rule_3
  origin:    C.3.01, C.3.02
  tier:      T3
  sealed:    2026-08-12
```

### A.0.21.2 — The suite is cumulative and append-only

| Property | Rule |
|---|---|
| **Append-only** | An invariant is never edited. It is superseded by a new one, and the old one is marked `SUPERSEDED by INV-x-nnn` with its text preserved. |
| **Cumulative** | The suite grows monotonically. Cycle 5 runs cycles 1–4's invariants plus its own. |
| **Removable only by desealing** | Removing an invariant is a deliberate, recorded act naming the downstream impact — never a silent deletion. |
| **Every invariant names its checker** | An invariant without a `checked_by` is a wish. It sits at T1 and is recorded as a known weakness (see `A.0.22`, X2). |

### A.0.21.3 — This pattern already exists in your system

`E3` (drift detector) is the inheritance mechanism for spine C, already built. It snapshots what was established and re-checks it on every pass. `E4` is the same for policy invariants. `build.js`'s out-of-band gate integrity check is the same for the gate itself.

**The Core Cycle Law generalizes what you already proved works.** It is not a new idea imported from outside — it is E3, applied to every spine.

---

## A.0.22 — The gates

Cycle *content* is never predefined (except Co1). Cycle *entry and exit* are fixed forever. Content-specific rules rot within months; condition-based rules hold for decades because they reference nothing time-bound.

### A.0.22.1 — Entry gate

> **Every declared dependency of the topic is `CLOSED`.**

Not "mostly." Not "in progress." An `OPEN` prerequisite means the topic does not enter. This single rule is what makes flexible cycle content safe rather than arbitrary.

### A.0.22.2 — Exit gate — six tests, identical for every cycle, forever

| # | Test | Fails when |
|---|---|---|
| **X0 · Inheritance** | The full cumulative invariant suite for cycles 1..N−1 **passes** | Anything previously established has stopped holding |
| **X1 · Placement** | Everything introduced has a corespine position — what it relies on above, what it serves below | Something floats |
| **X2 · Enforcement** | Every rule stated sits at a named durability tier. Anything at T0/T1 is **recorded as a known weakness**, never counted as done | A rule is "agreed" and nothing enforces it |
| **X3 · Evidence** | Every completion claim is verified by output the builder did not author | "Success. No rows returned" |
| **X4 · Closure** | Every item is `CLOSED`, or explicitly `KNOWN`/`PARKED` **with a reason**. Nothing ambiguous. | Partial implementations left unlabelled |
| **X5 · Reversibility** | The undo path is known and recorded | No rollback |

**X0 is the inheritance obligation made into a gate.** It runs first. A cycle that breaks a prior cycle does not exit, regardless of how good its own work is.

**X2 is the test most systems omit**, and the most expensive omission. A cycle that "agreed" a rule with no mechanism has recorded an intention, not built a foundation. Counting intentions as done is what feeds the restart loop.

### A.0.22.3 — Co1's additional condition

| # | Test | Applies to |
|---|---|---|
| **X6 · Seal** | GOVERNOR ratifies a seal over Co1's invariants. Subsequent change requires explicit desealing, recorded, with downstream impact named. | Co1 only |

Without X6, Co1 is never finished — only in progress — and every cycle above it is permanently provisional.

---

## A.0.23 — What Co1 contains

"Fundamental pillars" is unfalsifiable as an adjective. It needs a test.

> **Co1 contains everything that, if wrong, cannot be corrected later without rebuilding what sits on top of it.**

**Applying it:** *If this turns out wrong in six months, what has to be torn down?* Nothing → not Co1. Everything above → Co1.

| Candidate | Co1? | If wrong |
|---|---|---|
| Tenant identity authority | **Yes** | Every policy, every middleware path, every data access rewrites |
| The tenant boundary (RLS model) | **Yes** | Every table's access model rewrites; a breach is unrecoverable |
| Durability model (T0–T5) | **Yes** | Every rule is at the wrong tier; every mechanism is misplaced |
| The canon and its addressing | **Yes** | Every record moves; every cross-reference breaks |
| Zone dependency direction | **Yes** | The platform cannot be separated from the vertical later without a rewrite |
| Tier/package model | No | Repriceable; data model absorbs it |
| Catalog UI | No | Redesignable in isolation |
| Kanban column colour | No | Change it Tuesday |

### A.0.23.1 — The uncomfortable current standing

**By this criterion, CISEM's Co1 is incomplete, and work is proceeding above it.**

Identity and tenancy (spine B) is Co1-class: `B.5.01`–`B.5.04` unbuilt, no claim-minting code, no backfill, three competing authorities live, the wall built but inert (`C.6.02`). Meanwhile the canon carries sequenced work in D, E, and F — all Co2+.

This is the restart loop, stated structurally. **It should be recorded, not worked around.** All current Co2+ work is provisional until X6 passes on Co1.

---

## A.0.24 — Cycle selection

Two failure modes of flexible cycle content, and the rule that closes each.

### A.0.24.1 — Ease drift
If cycle content is "whatever is now unblocked," the system drifts toward *easy* unblocked work over *important* unblocked work. Reliably, every time.

> **Rule:** among unblocked topics, content is selected by **highest blast radius first**. `G.2.01`'s lane classification supplies the ordering: L0 before L1 before L2.

### A.0.24.2 — The empty cell
An empty cell in the cycle grid is ambiguous — not ready, or forgotten? The forgotten ones are exactly the gaps that resurface as surprises.

> **Rule:** no cell is ever empty. Every corespine element receives one of three values on every pass:
>
> | Value | Meaning |
> |---|---|
> | `ADVANCED` | Work happened; invariants emitted |
> | `NOT-READY: <blocking dependency>` | Entry gate not met; the blocker is named |
> | `DEFERRED: <reason>` | Could have entered; deliberately did not |
>
> **Escalation:** an element `NOT-READY` for three consecutive passes is escalated. Three passes means the blocker is not being worked — that is a hidden dependency, not patience.

This converts the grid from a record of what happened into a **check on what did not**.

---

## A.0.25 — Build method: hardcoding vs. AI pockets

Two enforcement targets require two substrates. Conflating them is why "just put it in the rules file" keeps failing.

| | Governs | Substrate | Failure it prevents |
|---|---|---|---|
| **Hardcoding** | **Machines** — what the code and database will accept | Executable, in-repo, fails builds | Bad code shipping |
| **AI Pocket** | **Agents** — what an AI is permitted to reason toward | Sealed, read-only, injected as context | Bad reasoning starting |

**Hardcoding stops a defect at the door. A pocket stops it being proposed.** You need both: hardcoding alone means agents keep proposing rejected ideas and burning your review attention (`user_metadata`, three times). Pockets alone means an agent that ignores its pocket faces no consequence.

### A.0.25.1 — Hardcoding — precise definition

> **Hardcoding is converting a rule into a form that executes, at tier T3 or below on the durability ladder.**

Not "writing a value in code." A rule is hardcoded when a machine enforces it without human recall.

| Form | Tier | Example in CISEM |
|---|---|---|
| Structural absence — the bad state cannot exist | **T4** | No `.env` on the mounted disk (`A.4.02`) |
| Database constraint — Postgres refuses | **T5** | RLS policy with `WITH CHECK` (`C.4.01`) |
| Executable check — the build fails | **T3** | E3, E4, E9, E14 |

**Selection order, always:** can the bad state be made *absent* (T4)? Can the *database* refuse it (T5)? Can a *script* fail the build (T3)? Only if all three fail does it become written text.

**Hardcoding is not permanent by itself** — code can be edited. It becomes durable when paired with sealing: a checksum in a ratified registry, verified out-of-band, exactly as `build.js` already does for `cisem_gate.py`. **Code changes silently; a sealed change fails loudly.**

### A.0.25.2 — AI Pocket — proposed definition

> **An AI Pocket is a sealed, scoped, read-only bundle of canon injected into an agent's context for a bounded task — containing the invariants it inherits, the boundary it may act within, and the conflicts that would disqualify its output.**

*This term was yours; the definition below is my proposal for it. Adjust or reject.*

**Pocket contents — five parts, all mandatory:**

```
POCKET: C.5.03 — policies for the 25 uncovered tables

1. SCOPE
   spines:   C
   tables:   the 25 named by E4
   files:    cisem_core/security/, migration artifacts
   lane:     L1

2. INHERITED INVARIANTS          ← the inheritance obligation, made portable
   INV-C-001  one tenant authority: app_metadata claim only
   INV-C-002  no FOR ALL policy with a NULL-permitting USING
   INV-C-003  every write policy carries an explicit WITH CHECK
   INV-C-004  no policy granted to {public}
   INV-A-002  no secret value in output
   INV-A-009  user_metadata prohibited for authorization data

3. PROHIBITIONS
   no database execution — GOVERNOR only (C.0.2)
   no path outside the workspace
   no next-step proposal from PARKED.md

4. CONFLICT SET                  ← what disqualifies the output
   REJECTED A.3.11  FOR ALL + IS NULL   — must not be re-proposed
   REJECTED A.3.12  FOR ALL on user_account_roles
   REJECTED A.3.10  user_metadata

5. EXIT EVIDENCE                 ← stated before work begins
   E3 exit 0 · E4 exit 0 · per-table policy count
```

**Four properties that make a pocket different from a prompt:**

| Property | Mechanism | Tier |
|---|---|---|
| **Sealed** | Checksum in the ratified registry; the agent cannot alter it | T3 |
| **Scoped** | Contains only the canon governing this task — a small pocket is a strong pocket | design |
| **Read-only** | Canon directory excluded from agent write scope | **T4** |
| **Inherited** | Section 2 is auto-assembled from the cumulative suite, not written by hand | T3 |

**Why "pocket" is the right word:** it is a container the agent carries and cannot reach outside of. Not a file it may consult. Not advice.

### A.0.25.3 — The division of labour

| Rule | Hardcoded as | Pocketed as |
|---|---|---|
| `user_metadata` prohibited | E9 grep — build fails | `INV-B-002` in every B/C pocket |
| Every write policy has `WITH CHECK` | E4 rule 3 — exit 1 | `INV-C-003` |
| No secret in output | Nothing on disk (T4) | `INV-A-002` + conflict set |
| Downward-only imports | E14 — build fails | `INV-A-001` |
| No parked-roadmap drift | E12 gate scan | prohibitions section |

**Every rule appears in both columns.** The hardcoded form is the wall; the pocketed form is the sign the agent reads before walking toward it. A rule with only one form is half a rule.

---

## A.0.26 — Build order for the cycle law itself

| # | Task | Why this position |
|---|---|---|
| 1 | Invariant record format + `invariants/` directory | Nothing else can reference invariants until they have a shape |
| 2 | Back-emit invariants from what is already proven — E3, E4's six rules, E1, E2 | The suite starts non-empty and immediately useful |
| 3 | Suite runner: execute all invariants, report per-cycle | Makes X0 executable |
| 4 | Wire X0 into the gate | Inheritance becomes mechanical |
| 5 | Pocket assembler: scope in → pocket out, sections 2 and 4 auto-built | Pockets stop being hand-written |
| 6 | Canon seal (`A.4.15`) over invariants and pockets | Makes both tamper-evident |
| 7 | Apply the Co1 criterion (`A.0.23`); declare Co1's true contents | Requires 1–6 to be sealable |
| 8 | Complete Co1; pass X0–X6; **seal** | Everything above becomes non-provisional |

**Steps 1–3 are roughly two days** and give you X0 immediately. Step 8 is the one that ends the restart loop.

---

## A.0.27 — Open for ratification

| # | Question |
|---|---|
| `A.0.27.1` | Inheritance obligation as stated — cycle N accountable for 1..N−1, enforced by a cumulative suite? |
| `A.0.27.2` | Six exit tests X0–X5, identical for every cycle, never extended per cycle? |
| `A.0.27.3` | X6 sealing for Co1, and the consequence that **Co1 is not sealed today** so all current Co2+ work is provisional? |
| `A.0.27.4` | The Co1 criterion — "cannot be corrected later without rebuilding above it"? |
| `A.0.27.5` | No empty cells: `ADVANCED` / `NOT-READY: <dep>` / `DEFERRED: <reason>`, escalating at three consecutive `NOT-READY`? |
| `A.0.27.6` | Blast-radius ordering for cycle content selection? |
| `A.0.27.7` | The AI Pocket definition and its five mandatory sections? |
| `A.0.27.8` | Every rule must exist in **both** forms — hardcoded and pocketed? |
