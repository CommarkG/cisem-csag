# P1 · Pipeline · Intent to Sustained

> ⚠️ **AUTHORED BY REVIEWER · AWAITING GOVERNOR RATIFICATION.** Every judgment call in this document was made by the reviewer, not the governor. Items carrying `RATIFIED` inherit a decision explicitly taken in session; all structure, sequencing, classification, and status assignment is proposed. See `R00` for the itemised list.


**Tier:** P — Pipeline. Universal method. **Names no solution.**
**Status:** Draft for GOVERNOR ratification

---

## P1.0 — Charter

```
purpose:     Carry any solution from a stated intent to a working, verified,
             recorded result — the same way every time.
boundary:    P1 owns the method. U1–U7 own the laws each stage enforces.
             S-tier documents own what happened when a solution ran through it.
depends_on:  U0A, U0B, U0C, U1–U7
governs:     every solution
invariant:   A stage is complete when its artifact exists and its exit
             condition is met. Neither alone.
```

**Thirteen stages.** Each has an entry condition, an artifact, an exit condition, and the laws that govern it. A stage without its artifact has not run, regardless of what was discussed.

---

## P1.0.1 — THE CANONICAL ORDER

**This order is not a convention. It is the law of the method, and no stage moves.**

> ### **1 · INTENT — take it, and understand it deeply**
> ### **2 · ALIGN — verify the actor's understanding matches the human's, before anything is designed**
> ### **3 · GOAL — the outcome, its measurable results, and how they will be measured**
> ### **4 · BUILD — placement, existing, contract, simulation, enforcement, construction**
> ### **5 · PROVE — it works, and it produced the outcome**
> ### **6 · SUSTAIN — it still works, checked recurrently, forever**

**Why this order and no other:**

| | |
|---|---|
| **Intent before goal** | A goal set before the intent is understood is a goal for a different problem. |
| **Align before goal** | An actor that misunderstood the intent will define a goal that is internally perfect and wrong. Every later stage will faithfully serve it. |
| **Measurement inside the goal, not after** | Measurement designed after delivery is measurement chosen to be obtainable, and it reliably reports success. **The baseline cannot be taken later.** |
| **Prove before sustain** | A thing never proven cannot be observed to decay — there is no state to decay from. |
| **Sustain forever** | A thing that worked is not a thing that works. Additions elsewhere damage it silently, which is the failure this stage exists for. |

**The twelve stages below are this order, in detail.**

---

## P1.1 — Intent

```
entry:     someone states a want
artifact:  one paragraph — what changes for whom, and how you would know
exit:      the want is stated without naming a mechanism
governed:  U5.2.02
owner:     the human
```

**The discipline:** intent describes an outcome, never a solution. A mechanism named at this stage forecloses every alternative before any is considered.

**Rejection:** if the intent cannot be stated without naming a technology, it is not understood yet.

## P1.2 — Align

```
entry:     P1.1 artifact exists
artifact:  the actor's restatement, and its stated exclusions
exit:      the human confirms explicitly, or corrects and the stage repeats
governed:  U1.2.36
owner:     the actor states; the human confirms
```

**The most-skipped stage, and the most expensive to skip.** An actor working from an unreconciled understanding produces a goal that is internally consistent, well-argued, and aimed elsewhere — and every subsequent stage serves it faithfully.

**Divergence here is expected, not a fault** (`U1.2.38.1b`). Both parties arrive with priors: the actor with its defaults, the human with context they had no reason to state. **This stage exists to put both on the table cheaply. It is not a test either party can fail.**

**The restatement carries three parts, and the second is the one that catches misalignment:**

| Part | |
|---|---|
| **Understood** | The intent, in the actor's own words — not paraphrased, re-derived |
| **Excluded** | What the actor decided this intent does **not** cover. **Misalignment hides here, not in the inclusions.** |
| **Assumed** | What the actor filled in that was not stated |

**Exit is an explicit human confirmation, recorded.** Silence is not confirmation. "Sounds right" is not confirmation of the exclusions, which is why they are listed separately.

**A stage that repeats several times is working**, not failing. Repetition means divergence was found while it was still cheap.

**If the human reconciles, the stage repeats in full** — not a patch to the restatement. A reconciled understanding usually shifts the exclusions too.

**A confirmation later found insufficient is a finding about the restatement method** — it did not reach far enough. Never a failure of either party. Record it and improve the method (`U1.2.11`).

## P1.3 — Fit

```
entry:     P1.2 confirmed
artifact:  a fit statement — does this serve the stated differentiator?
exit:      serves it, or is explicitly recorded as necessary-but-not-differentiating
governed:  U5.2.02, U5.2.03
```

**The discipline:** a solution that serves nothing in particular is built anyway, well, and helps nobody. Commodity capability may pass this stage only as explicitly supporting work.

## P1.4 — Placement

```
entry:     P1.6 passed
artifact:  the corespine position — which topic owns it, what it relies on
           above, what it serves below, which zone, which lane
exit:      nothing floats; the dependency direction is legal
governed:  U5.2.01, U7.2.02, U0B.2.11
```

**Rejection:** if placement would require the core to depend on a vertical, the design is wrong, not the rule.

## P1.5 — Existing

```
entry:     P1.6 passed
artifact:  an inventory of what already exists that serves this, checked
           against source — never against a summary or memory
exit:      every overlap named; the four acts run in order; enhance /
           consolidate / create decided per item, with owners declared
governed:  U1.2.08, U4.2.05
```

**The discipline:** creation requires justification, not a good idea. **This stage is the leading axiom made operational** (`U1.2.32.3`).

**The four acts, in order, none skipped:**

| # | Act | Question |
|---|---|---|
| 1 | **LEARN** | What did prior cycles already establish about this? |
| 2 | **CHECK WHAT EXISTS** | What already serves it — **read from source**, not from memory or a document |
| 3 | **CONSOLIDATE** | Can what exists be extended, merged, or corrected instead? |
| 4 | **CREATE** | Only if 1–3 do not resolve it |

**Act 3 is the expected outcome, not the exception.** A high create-rate is a signal that act 2 is not being run.

**Creation requires all five conditions of `U1.2.32.4`, stated in writing before the thing exists:** the inventory was run against source · nothing existing can serve it · **it has exactly one owner** · it has a place · it has a retirement condition.

**Condition 3 catches the most.** Most duplication is not a second copy — it is a **second writer of the same concern**, arriving by a different path, individually reasonable, invisible until someone enumerates writers.

**Evidence rule:** the inventory is read from the running system and the source tree. A claim about what exists, taken from a document, does not pass.

## P1.6 — Contract

```
entry:     P1.6 passed
artifact:  the data shape, the interface shape, the failure modes, the
           states, the scope boundary
exit:      every failure mode has a defined behaviour; every state is designed
governed:  U1.2.13, U6.2.05, U2.2.09
```

**Mandatory in every contract:** what happens when the dependency is unreachable · what happens when authorisation is absent · what the loading, empty, and error states are.

**And the measurement, per `U1.2.35`:** metric · **baseline taken now, before the change** · target · owner · cadence · evidence source. A baseline not taken before the work cannot be taken afterwards.

**If the evidence source does not yet exist**, creating it is part of this solution, not a later one.

## P1.7 — Simulate

```
entry:     P1.6 contract exists
artifact:  a walk record — the contract run against failure scenarios,
           with the behaviour each produces
exit:      every scenario has a defined behaviour, and every failure mode
           discovered has been added back into the contract
governed:  U1.2.32, U1.2.13, U2.2.09
```

**Writing a contract and testing a contract are different acts.** A specification read back by its author confirms what the author already believes. Walking it against scenarios is where the belief breaks.

**This is the resolve-before-coding stage**, and it is the cheapest point in the entire method to find a defect: a failure mode discovered here costs a paragraph, the same one discovered after building costs a rebuild, and after shipping costs a customer.

### P1.7.1 — The minimum walk
Every contract is walked against these, and each produces a **defined behaviour** or the contract is incomplete.

| # | Scenario | The question |
|---|---|---|
| 1 | The dependency is unreachable | Does it fail visibly, or plausibly? (`U1.2.13`) |
| 2 | Authorisation is absent or expired | Does it deny, or default? (`U2.2.09`) |
| 3 | The input is empty | Is there a designed empty state? |
| 4 | The input is malformed | Is the error actionable, or a status code? |
| 5 | The input is at ten times expected scale | Does the design change shape, or just get slow? |
| 6 | It runs twice | Is the second run safe? |
| 7 | Two run at once | Is there a race? |
| 8 | It is abandoned halfway | What state is left behind? |
| 9 | A party does the wrong thing | Is it prevented, caught, or absorbed? |
| 10 | It is undone | Is there a path back? (`X5`) |
| 11 | **The set is empty** | Does the check pass vacuously? A pass across zero members proves nothing (`U1.2.08`) |
| 12 | **It is the first time** | Can the very first instance be created, or does entry require something only entry produces? (`U1.2.39.3`) |
| 13 | **It can never succeed** | Does every path fail at the same point? An operation failing *always* rather than *sometimes* is an incompatibility, not a failure mode (`U3.2.06a`) |

**A scenario with no defined behaviour is not an edge case. It is an undefined behaviour that will occur.**

**Scenarios 11 and 12 are the ones most often absent.** An empty set makes every check pass. A first instance is the only case where the system has no prior state to build on — and it is the case every party experiences exactly once, on arrival.

### P1.7.2 — The walk feeds enforcement
What this stage discovers is the input to `P1.8`. **You cannot decide what needs preventing until you know what can go wrong**, which is why simulation precedes enforcement rather than following it.

### P1.7.3 — Simulation is not verification
| | Asks | When |
|---|---|---|
| **Simulate** | Would this hold, if these things happened? | before building |
| **Verify** | Does the built thing meet its contract? | after building |
| **Validate** | Was the contract worth meeting? | after use |

Three different questions, at three different moments. **Skipping simulation moves its questions to verification, where the answers are expensive.**

### P1.7.4 — A walk that finds nothing was not a walk
A contract that survives ten scenarios untouched is either exceptionally well written or was not genuinely tested. **The second is far more common.** Record which scenarios were walked and what each produced — "no change" is a result, and one that appears ten times is a finding about the walk, not about the contract.

---

## P1.8 — Enforcement

```
entry:     P1.7 passed
artifact:  for each rule in the contract, its durability tier and mechanism
exit:      every rule sits at a named tier; T0 and T1 rules are recorded as
           known weaknesses, never counted as satisfied
governed:  U1.2.01, U1.2.02, U1.2.09
```

**This stage is where most methods stop short.** A contract with agreed rules and no mechanisms is an intention. The tier is decided here, before building, because it changes what gets built.

**Output feeds two things:** invariants to emit at `P1.9`, and the pocket assembled at `P1.7`.

## P1.9 — Build

```
entry:     P1.8 passed; a pocket is assembled
artifact:  the change itself
exit:      the change exists and the pocket's prohibitions were not violated
governed:  U0C.2.02, U7.2.01, U7.2.03
```

**The pocket is assembled before the build starts**, from the scope, the cumulative invariant suite, the deferral register, and the rejected register. Building without one means the actor is relying on memory, which is T0.

**Authority:** whoever holds it. A build stage that appears to require crossing an authority boundary is scoped wrong.

## P1.10 — Verify

```
entry:     P1.9 complete
artifact:  the evidence named at P1.5, produced
exit:      the system reports the intended state, in output the builder did
           not author
governed:  U1.2.08, U2.2.10, U3.2.08
```

**Verification method was fixed at `P1.6`.** It may not be renegotiated here — that is how a weaker check gets substituted for a failing one.

**Never accepted:** a success message · a zero exit code alone · a summary · the builder's own account.

## P1.11 — Record

```
entry:     P1.10 passed
artifact:  the solution record, addressed; invariants emitted; deferred
           items filed; expectations re-baselined
exit:      the cumulative suite includes this solution's invariants and passes
governed:  U1.2.03, U1.2.04, U7.2.09
```

**This stage is the inheritance obligation being paid forward.** Every future cycle will re-prove what this one established. A solution that skips it has left nothing for the next one to stand on.

---

## P1.12 — Validate

```
entry:     P1.11 complete, and the solution has been used
artifact:  a validation record — did it achieve the intent stated at P1.1?
exit:      achieved · partially achieved with the gap named · did not achieve,
           with the reason
governed:  U1.2.30, U5.2.02
```

**The discipline:** stages 1–9 build the thing right. This stage asks whether it was the right thing. **A solution can pass every prior stage, be correctly built and fully verified, and achieve nothing.** No amount of verification detects that.

**It closes the loop back to `P1.1`.** The intent stated there is the standard measured here — which is why stage 1 rejects intent expressed as a mechanism. A mechanism cannot be validated, only confirmed present.

**Two windows, per `U1.2.35.2`:**

| Window | When | Answers |
|---|---|---|
| Early | 2–4 weeks after implementation | Is it reached? Is it used? What friction appeared? |
| Late | 3–6 months after implementation | Did the intended value materialise, and did it hold? |

The early window closes the stage. **The late window is scheduled here and runs after the solution has left the pipeline** — its owner and date are recorded at this stage or it does not happen.

**"Did not achieve" is a successful validation.** It is the only stage whose failure produces more value than its success, and a validation that never returns it is not being run honestly.

---

## P1.13 — Sustain

```
entry:     P1.12 passed — the solution achieved its intent at least once
artifact:  a sustain schedule: what is re-checked, how often, on what trigger,
           by whom, and what result ends the schedule
exit:      the schedule exists, is owned, and has run at least once
governed:  U1.2.35, U7.2.10
runs:      forever, or until the solution is retired
```

**A thing that worked is not a thing that works.** The most common cause of a working capability failing is **a change made somewhere else** — which arrives without warning and produces no signal at the point of damage.

### P1.12.1 — Two triggers, both required
| Trigger | Catches |
|---|---|
| **Calendar** | Slow decay — a dependency drifting, data changing shape, an assumption expiring |
| **Change event** | Regression — an addition elsewhere breaking this, which does not arrive on a schedule |

**Calendar alone misses the case this stage exists for.** An addition that breaks something on a Tuesday is not found by a monthly check until three weeks of work has been built on the broken state.

### P1.12.2 — Cadence is assigned, not inherited
The default ladder below is a starting point. **Each check is assigned its own cadence from what could plausibly change it.**

| Cadence | Assign when | Default scope |
|---|---|---|
| **Initial** — at exit of `P1.9` | always | does it work at all |
| **Day one** — within 24h of real use | always | does it work under real conditions, not test ones |
| **Daily** — first month | the thing depends on something that changes daily | live behaviour, error rate, is it reached |
| **Weekly** — first quarter | the thing depends on something that changes weekly | is it still used, is the mechanism still firing |
| **Monthly** — first year | slow-changing dependencies | value holding, assumptions still true |
| **Quarterly** — forever | everything | is it still needed, is the check still valid |

**A daily check on something that changes quarterly is noise, and noise trains the operator to ignore the channel.** A quarterly check on something that changes daily is negligence. Both are failures of assignment, not of cadence.

### P1.12.3 — Check the check
The strongest sustain question is not *does it still pass*. It is:

> **Is this check still capable of failing?**

A check that silently broke reports clean forever, and is indistinguishable from a healthy system. Four ways it happens:

| | The check |
|---|---|
| **Broke** | Errors, and the error is swallowed as a pass |
| **Went blind** | The thing it examines changed shape; it now examines nothing |
| **Lost its source** | The evidence source stopped producing; it reads a stale value |
| **Was neutered** | An exception was added to silence a real failure, and never removed |

**Every sustain run includes at least one deliberately failing input**, or the check's own health is unverified (`U1.2.34.4`).

### P1.12.4 — Escalation, and an end condition
**Escalate** when a sustain check fails, when it has not run within its cadence, or when it has never failed across a period long enough that a failure was statistically likely.

**End the schedule** when the solution is retired, or when a check has run without variance for long enough that its cadence should be relaxed — recorded as a decision, never by quietly ceasing to run it.

**A schedule that stops without a decision is a check that was abandoned**, and it will be discovered only when the thing it guarded fails.

---

## P1.14 — Gate summary

| Stage | Complete when |
|---|---|
| 1 Intent | Stated as outcome, no mechanism named |
| 2 Align | Restatement confirmed explicitly, exclusions listed |
| 3 Fit | Serves the differentiator, or explicitly does not and is recorded as such |
| 4 Placement | Positioned; dependency direction legal |
| 5 Existing | Inventory checked against source; overlaps decided |
| 6 Contract | Failure modes and states defined; verification method fixed |
| 7 Simulate | Every scenario has a defined behaviour |
| 8 Enforcement | Every rule at a named tier |
| 9 Build | Pocket assembled; change exists; prohibitions held |

| 10 Verify | Evidence produced, not authored |
| 11 Record | Invariants emitted; suite passes |
| 12 Validate | Intent achieved, or the gap named |
| 13 Sustain | Schedule exists, is owned, has run once |

**No stage is skipped.** A stage may be trivially short — a small solution's inventory may be one line — but its artifact exists.

---

## P1.15 — Consolidation

`governed_by: U1.2.33`

**Consolidation is the closing half of the cycle, not a defect review.** A solution that required no consolidation should be examined for whether it explored anything.

Run after every solution, before the next enters.

### P1.15.1 — Sort what the solution produced

| Outcome | Question | Response |
|---|---|---|
| **Convergence** | Did this arrive at something another effort also arrived at? | Merge into one. The repetition is evidence the need is real. |
| **Divergence** | Did this contradict another effort? | Resolve. The resolution is knowledge neither held alone. |
| **Violation** | Did anything contradict a ratified rule? | Correct — then find the missing prevention (`U1.2.32.3`) |
| **Friction** | Where did the method not fit reality? | A stage amendment candidate |
| **Surplus** | What was produced that is not needed? | Optimisation candidate — remove it here or it stays forever |

**Only Violation is a defect.** The other four are what expansion produces, and discarding them as noise discards the cycle's yield.

### P1.16.2 — Then run the loops

| Loop | Here |
|---|---|
| **L3 Synthesise** | Compare this solution's records against previous ones. What appears in both? |
| **L4 Promote** | Anything appearing in **two** solutions is promoted to `P` or `U`. Anything in one is held as a candidate. |
| **L4 reverse** | Any universal law no solution has needed becomes a demotion candidate |
| **L5 Implement** | Promoted items become a stage change, a mechanism, or a protocol step — never a note |
| **L6 Prove** | Anything implemented is tested against a case that should fail |

### P1.16.3 — Optimisation happens here or never
Making the solution smaller, faster, or simpler is the closing act of this stage.

**Premature during the build. Never performed if deferred past here.**

### P1.16.4 — A solution never edits `U` or `P` directly
Everything routes through this stage. One case may not rewrite the law.

---

## P1.16 — Open for ratification

| # | Question |
|---|---|
| `P1.16.1` | **Thirteen stages, and the canonical order in `P1.0.1`**, this decomposition? |
| `P1.16.2` | Verification method fixed at stage 5 and unchangeable at stage 8? |
| `P1.16.3` | Enforcement tier decided at stage 6, before building? |
| `P1.16.4` | No stage skipped, however small? |
| `P1.16.5` | Consolidation between every solution, not batched? |
| `P1.16.6` | Consolidation sorts into five outcomes, of which only one is a defect? |
| `P1.16.7` | Optimisation belongs to consolidation, not to a separate initiative? |
| `P1.16.8` | **Align as its own stage**, with exclusions stated and explicit human confirmation? |
| `P1.16.9` | **Sustain as its own stage**, running forever, with calendar **and** change triggers? |
| `P1.16.10` | Cadence **assigned per check**, not inherited from a blanket ladder? |
| `P1.16.12` | **Simulate as its own stage**, with the ten-scenario minimum walk, before enforcement? |
| `P1.16.11` | **"Is this check still capable of failing?"** — every sustain run includes a deliberately failing input? |
