# S02 · Governance Plane · Definition

**Tier:** S — Solution candidate. **Pipeline position:** `P1.1`–`P1.5` (partial)
**Status:** Draft for GOVERNOR ratification. Not entered into the pipeline.

> ⚠️ **AUTHORED BY REVIEWER · AWAITING GOVERNOR RATIFICATION.** Field-level definition follows ratification of §4–§7, not before. Defining fields first makes the fields the goal.

---

## 1 — The problem

**Governing knowledge exists and is unreachable at the moment it is needed.**

Three parties, three failures, one cause:

| Party | Failure |
|---|---|
| **The operator** | Must remember where each definition lives. A definition that must be chased eventually stops being chased. |
| **An actor** | Cannot read the canon at all. It is outside the working boundary, so every constraint arrives by conversation — the delivery method that failed in two-thirds of audited defects. |
| **A depending party** | Cannot read any rule that governs them. A limit is discovered by hitting it. |

**The cause is not that the knowledge is missing.** It is that knowledge is stored where it must be *retrieved by memory* rather than *presented at the point of use*. This is the load doctrine (`U1.2.31`) applied to the humans and machines that operate the system, rather than to the ones building inside it.

**Consequence today:** the canon governs one person, when that person remembers it. That is not governance.

---

## 2 — What exists

`CONFIRMED` unless marked.

| | State |
|---|---|
| Canon documents | 25, written · **not in the repository** · unreadable by any actor |
| Registers | 4 files — ratification, deferral, zones, cycle grid |
| Mechanisms | 16 defined · **2 running** (drift, rule linter) · results visible only in a terminal |
| Operator surfaces | 1 of 16 partially exists, and it reads status **files** rather than live state |
| Party-facing surfaces | **0 of 5** |
| Journeys defined | **0** |
| Pockets assembled | **0** |
| Measurement baselines | **0** |
| Solutions through the pipeline | **0** |
| Invariant files | **0** |

**Nothing here is wasted.** The content is the hard part and it exists. What is absent is the runtime that makes it reachable.

---

## 3 — Goal

> **Every rule that governs this platform is reachable, at the moment it is needed, by whoever needs it — human or machine — without anyone having to remember where it lives.**

Stated as an outcome, not a mechanism (`P1.1`). "Build an admin interface" is a mechanism and would have foreclosed the pocket half of the answer.

---

## 4 — Required outcomes

Five. Each independently measurable; none subsumes another.

### O1 — No definition is retrieved from memory
Any governing definition is reachable from inside the running system, at its address, showing its current value and its enforcement state.

### O2 — No actor works without its constraints present
Every task issued to an actor carries a pocket: the constraints governing **that task**, assembled from the live canon — not delivered at session start, not by reference.

### O3 — Mechanism state is visible without invoking it
What each mechanism checks, when it last ran, what it found, and **whether it has ever failed**. A mechanism that has never fired is displayed as untested, not as clean.

### O4 — Every decision carries its reasoning and its rejected alternatives
"Why is it this way" is answerable without asking a person, and **"why not the other way" is answerable too.** The rejected register is as reachable as the ratified one.

### O5 — The system reports its own gaps
Which rules are unenforced, which definitions have no surface, which measurements have no baseline, which mechanisms have never fired.

**O5 is the non-obvious one and the most valuable.** A system that displays only its strengths hides exactly what the operator needs. Per the prevention axiom, a hidden weakness is *silent by construction* — the condition where prevention is absolute.

---

## 5 — What improves, and what does not

### Improves

| Today | After |
|---|---|
| Definition chased across files and conversation | Read at its address, in the system |
| Actor receives constraints once, at session start | Constraints delivered per task, from live canon |
| Mechanism result seen only when manually run | Last run, result, and firing history visible |
| A decision's reasoning lives in a transcript | Decision, reason, and rejected alternatives co-located |
| Gaps known only to whoever remembers them | Gaps displayed as first-class content |
| Governance load carried by one person's memory | Carried by the system |

### Does not improve — stated so it is not assumed

| Not fixed | Owner |
|---|---|
| The isolation boundary — still inert, still bypassed | `I3` |
| No claim-minting code exists | `I2` |
| Nothing built toward the product direction | `I5` |
| Observability of the running system | `I7` |

**This makes governance operable. It does not make the platform secure or the product real.** Those proceed in parallel and are not gated by it.

### The risk that would make it worse

A governance interface can itself become a chase. Twenty-one registers, each complete, none answering a question, is the failure mode — and it is the one I already produced once (`I6.3.23`).

**Mitigation is `U6.2.10`:** journeys are defined first, registers serve them, ordering follows question frequency. If that is skipped, this solution creates the problem it exists to solve.

---

## 6 — Measurement

Per `U1.2.35`. **Every baseline below must be taken before anything ships.** None can be reconstructed afterwards.

### 6.1 — Baselines to capture now

| # | Metric | How the baseline is taken | Est. effort |
|---|---|---|---|
| `M1` | **Time to answer a definition question** | Time yourself finding 5 known definitions using only today's means. Record each. | 20 min |
| `M2` | **Definition surface coverage** | Count canon items with any surface ÷ total canon items | 10 min |
| `M3` | **Repeat-defect rate** | From the failure audit: recurrences per 100 actor turns | already recorded — `I1a` |
| `M4` | **Tasks issued with a pocket** | Count over the last 20 tasks | 10 min |
| `M5` | **Mechanism observability** | Mechanisms whose last result is visible without manual invocation ÷ total | 5 min |
| `M6` | **Time from mechanism failure to operator awareness** | Currently unbounded — record as "manual only" | — |
| `M7` | **Known-weakness visibility** | Rules displaying "enforced by: nothing" ÷ rules that have no enforcement | 5 min |
| `M8` | **Unanswerable "why" questions** | Ask 5 "why is this so / why not otherwise" questions; count those needing a person | 20 min |

**Roughly 70 minutes of baseline work, and it expires the moment anything ships.**

### 6.2 — Targets and cadence

| # | Baseline (expected) | Early target · 2–4 wks | Late target · 3–6 mo | Owner | Evidence source |
|---|---|---|---|---|---|
| `M1` | minutes, variable | under 30 seconds | under 15 seconds | governor | timed lookup, 5 samples |
| `M2` | ~4% | 60% | 100% — no exceptions | governor | coverage-mirror audit |
| `M3` | recorded in `I1a` | halved | approaching zero | reviewer | defect audit per cycle |
| `M4` | 0% | 100% of core-lane tasks | 100% of all tasks | governor | task log |
| `M5` | 0% | 100% | 100% | governor | mechanism register |
| `M6` | unbounded | under 1 day | under 1 hour | governor | run log |
| `M7` | 0% | 100% | 100% | reviewer | canon audit |
| `M8` | expected 4–5 of 5 | 1 of 5 | 0 of 5 | governor | repeat the same 5 questions |

### 6.3 — Two windows

| Window | When | Asks | Reports |
|---|---|---|---|
| **Early** | 2–4 weeks after each slice ships | Is it reached? Used? What friction? Did anything break? | Adoption and friction |
| **Late** | 3–6 months after the first slice | Did the load actually move off the operator? Did defect recurrence fall? | Value, and whether it held |

**The late window is scheduled at build time with a named owner, or it does not happen** (`U1.2.35.2`).

### 6.4 — What would count as failure

Stated in advance, so it cannot be renegotiated later:

- `M1` unchanged → the interface is not where people look
- `M3` unchanged → pockets are not being used, or are the wrong content
- `M4` at 100% but `M3` unchanged → **the pocket mechanism works and its content is wrong** — the most informative failure available
- Everything green and `M8` unchanged → surfaces display data without answering questions

---

## 7 — Entity model and update roots

Dependency level only. Fields follow ratification.

### 7.1 — Entities

| Entity | Is | References |
|---|---|---|
| **Item** | The atom — one addressed canon record | — |
| **Link** | A typed relationship between items | Item × 2 |
| **Invariant** | A machine-checkable assertion derived from an item | Item |
| **Mechanism** | Something that checks invariants | Invariant × n |
| **Run** | One mechanism execution and its result | Mechanism |
| **Finding** | An observation, captured at the moment | Item, Run |
| **Deferral** | A held item with a reason and an unblocking condition | Item |
| **Cycle** | One pass, with per-element state | Item × n |
| **Solution** | One pipeline traversal | Item, Measurement |
| **Measurement** | Metric, baseline, target, owner, cadence, source | Solution or Item |
| **Result** | One measurement reading at a point in time | Measurement |
| **Journey** | A defined flow with its seven fields | Surface × n, Measurement |
| **Surface** | Renders items for a role | Item × n, Journey |
| **Pocket** | An assembled scope for one task | Item, Invariant × n, Deferral |

### 7.2 — Dependency root

**Item is the root. Everything references it; it references nothing.**

```
Item ──┬── Link ── Item
       ├── Invariant ── Mechanism ── Run
       ├── Finding
       ├── Deferral
       ├── Cycle
       ├── Solution ── Measurement ── Result
       ├── Journey ── Surface
       └── Pocket
```

**No cycles.** A Pocket references Items and Invariants but is referenced by nothing — it is disposable output, regenerated per task, never stored as truth.

### 7.3 — Update roots — where each entity is written, and by whom

**This is the most important table in the document.** A surface that can write becomes a second source of truth, which is the defect `U4.2.05` forbids.

| Entity | Written by | Never written by |
|---|---|---|
| **Item** | Ratification only | any surface, any actor |
| **Link** | Ratification, with its item | any surface |
| **Invariant** | Emitted at a cycle's record stage | hand-editing |
| **Mechanism** | A build, following a decision | a surface |
| **Run** | Mechanism execution only | anything else — a Run is evidence |
| **Finding** | Capture, at the moment observed, by any party | — |
| **Deferral** | A deferral decision | — |
| **Cycle** | Computed from item stamps | hand-editing — it is a view |
| **Solution** | Pipeline stage exits | out of band |
| **Measurement** | Defined before work; never after | retroactively |
| **Result** | The evidence source, on cadence | manual entry |
| **Journey** | Definition, before its surfaces | inferred from what was built |
| **Surface** | Renders; **writes nothing** | — |
| **Pocket** | Assembled per task from live canon | hand-writing |

**Three rules that follow:**

1. **Surfaces are read-only over the canon.** Where editing is warranted, it is a ratification act with its own path, not an inline edit.
2. **Runs and Results are append-only.** Evidence is never revised; a wrong reading is superseded by a new one.
3. **Cycle and Pocket are computed, never stored as truth.** A hand-written pocket is a prompt wearing a pocket's name.

---

## 8 — Recommendation on sequencing

**This should not be the first solution through the pipeline.**

| | Recommendation |
|---|---|
| **`S01`** | **Observability** — small, unblocked, required before any external party, and it exercises all ten pipeline stages cheaply |
| **`S02`** | **This.** Larger, and it benefits from a pipeline that has already been tested and consolidated once. |

**Reason:** `P1` has never been executed. Testing an untested method on the largest available solution risks two failures at once, and makes it impossible to tell which failed.

**But define this now**, while attention is on it — and take the baselines in §6.1 immediately. They expire the moment anything ships, and this document is worthless without them.

**Build in slices**, each a pipeline pass with its own measurement:

| Slice | Serves | Depends on |
|---|---|---|
| 1 · Canon into the repository, read-only, sealed | O1, O2 | nothing — **ready today** |
| 2 · Item + Link + Finding, with the three registers | O1, O4 | slice 1 |
| 3 · Journeys defined, then the surfaces serving them | O1, O5 | slice 2, `I6.5.40` |
| 4 · Invariant + Mechanism + Run, live | O3, O5 | slice 2 |
| 5 · Pocket assembly | O2 | slices 2 and 4 |
| 6 · Measurement + Result | all | slice 2 |

**Slice 1 is ready now and blocks everything.** Until the canon is inside the working boundary, no actor can read it and no pocket can be assembled.

---

## 9 — Open for ratification

| # | Question |
|---|---|
| `S02.9.1` | The goal statement as written — outcome-shaped, not mechanism-shaped? |
| `S02.9.2` | Five required outcomes, O1–O5? |
| `S02.9.3` | **O5 — the system reports its own gaps** — accepted as a first-class outcome? |
| `S02.9.4` | The eight metrics, and their targets? |
| `S02.9.5` | **Baselines taken now**, before anything ships? (~70 minutes) |
| `S02.9.6` | The failure conditions in §6.4, fixed in advance? |
| `S02.9.7` | Fourteen entities, Item as root, no cycles? |
| `S02.9.8` | **The update-root table** — surfaces write nothing; runs and results append-only; cycle and pocket computed? |
| `S02.9.9` | Observability as `S01`, this as `S02`? |
| `S02.9.10` | Six slices, each its own pipeline pass with its own measurement? |
