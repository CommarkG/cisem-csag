# U1 · Core · Governance & Method

**Tier:** U — Universal. **Cycle:** Co1 · pass 1 · Charter and Decision stages only.
**Test applied to every line:** would this be true for a different company, building a different product, in 2035?

---

## U1.0 — Charter

```
purpose:     How the system knows what is true, how rules are made durable,
             and how each cycle of work stays accountable to every cycle before it.
boundary:    U1 owns method and evidence. It does not own who runs a check
             or when (U7), nor what is being checked (U2–U6).
depends_on:  —
governs:     U2, U3, U4, U5, U6, U7
invariant:   A rule that nothing enforces is not a rule. It is an intention,
             and must be recorded as a known weakness rather than counted as done.
```

---

## U1.2 — Decisions

### U1.2.01 — The durability ladder
`RATIFIED`

Every rule sits at a tier describing how it can fail.

| Tier | Form | Can it be violated? |
|---|---|---|
| T0 | Spoken or conversational instruction | Yes — evaporates |
| T1 | Written rule in a guidance document | Yes — degrades under load |
| T2 | Configured setting | Only by a deliberate change |
| T3 | Executable check that fails the build | Only by editing the check |
| T4 | Structural absence — the bad state cannot exist | **No** |
| T5 | Enforced by the persistence layer itself | **No** |

*origin: rules stated, acknowledged in writing, and violated within the same working session — repeatedly, and by different actors.*

### U1.2.02 — The rule for adding rules
`RATIFIED`

Before a rule is written as text, three tests in order:

1. Can the bad state be made **absent**? (T4)
2. Can the **persistence layer** refuse it? (T5)
3. Can an **executable check** fail the build? (T3)

Only if all three fail does it become written guidance. **The guidance document is the residue**, not the primary instrument. A long guidance document is a long list of things that will eventually be ignored.

### U1.2.03 — The inheritance obligation
`RATIFIED`

> Cycle N is accountable for cycles 1 through N−1. Every cycle must prove that everything previously established still holds, before it may add anything new.

A prior decision recorded in a document is **not inherited** — it is remembered, and memory sits at T0/T1. Inheritance requires the prior decision to exist as an executable assertion the current cycle must pass.

**The test:** *if a later cycle contradicted an earlier one, what would stop it?* If the answer is "someone would notice," it is not inherited. If the answer is "the build fails," it is.

*origin: three separate reversals of previously settled decisions, none of them a new mistake — each an old decision that stopped holding because nothing forced the new work to re-prove the old ground.*

### U1.2.04 — Invariants and the cumulative suite
`RATIFIED`

A cycle that exits without emitting invariants has established nothing. It has produced work, not ground to stand on.

| Property | Rule |
|---|---|
| Append-only | An invariant is never edited; it is superseded, and the original text preserved |
| Cumulative | Each cycle runs every prior cycle's invariants plus its own |
| Named checker | An invariant without an executable checker is a wish, and sits at T1 |
| Removable only by desealing | A deliberate, recorded act naming the downstream impact |

### U1.2.05 — Exit gates
`RATIFIED`

Cycle *content* is never predefined. Cycle *entry and exit* are fixed permanently. Content-specific rules rot; condition-based rules do not.

**Entry:** every declared dependency is closed. Not "mostly." Not "in progress."

**Exit — six tests, identical for every cycle, never extended per cycle:**

| # | Test |
|---|---|
| X0 | **Inheritance** — the full cumulative suite for prior cycles passes |
| X1 | **Placement** — everything introduced has a position: what it relies on, what it serves |
| X2 | **Enforcement** — every rule sits at a named tier; T0/T1 recorded as known weakness |
| X3 | **Evidence** — every completion claim verified by output the builder did not author |
| X4 | **Closure** — every item resolved or explicitly deferred with a reason |
| X5 | **Reversibility** — the undo path is known |

**X6 — Seal** applies to the first cycle only. See `U1.2.06`.

### U1.2.06 — What the first cycle contains
`RATIFIED`

> The first cycle contains everything that, if wrong, cannot be corrected later without rebuilding what sits on top of it.

Applied as a question: *if this turns out wrong in six months, what has to be torn down?* Nothing → not first-cycle. Everything above it → first-cycle.

The first cycle exits only when its gate passes **and** the ratifying authority seals it. After sealing, change requires explicit desealing with downstream impact named. **Without a seal, the first cycle is never finished — only in progress — and everything above it is permanently provisional.**

### U1.2.07 — Cycle content selection
`RATIFIED`

Two failure modes, two rules.

**Ease drift** — content chosen as "whatever is unblocked" drifts toward *cognitively appealing* work over *high-consequence* work, reliably.
> Among unblocked topics, select by **highest blast radius first**.

**The empty cell** — an unrecorded element is ambiguous: not ready, or forgotten? The forgotten ones resurface as surprises.
> No element is ever unrecorded. Each receives, every pass: `ADVANCED` · `NOT-READY: <blocker>` · `DEFERRED: <reason>`. Three consecutive `NOT-READY` escalates — that is a hidden dependency, not patience.

### U1.2.08 — Verification doctrine
`RATIFIED`

What counts as evidence. Each rule below was written after a specific failure.

| Rule | Prevents |
|---|---|
| **A success message is not evidence** | An operation reporting success while having partially applied |
| **Written is not applied** | A change existing in source and never reaching the running system |
| **A zero exit code is not correctness** | A process completing while bypassing the thing being tested |
| **A summary is not a source** | A conclusion drawn from a paraphrase rather than the underlying artifact |
| **An actor's account of itself is not evidence** | A capability asserted that does not exist |
| **Count, do not read** | A discrepancy invisible in prose but obvious in a tally |
| **Verify from the system, in a form the actor did not author** | An artifact formatted to resemble a tool's output, produced by hand |
| **A pass on an empty set proves nothing** | A check reporting "all members satisfy the condition" across zero members. Vacuously true, and indistinguishable from a real pass. |
| **Verify between the parts, not after them** | A multi-part operation reported complete while an early part failed. The intermediate state is never observed. |
| **A status is not evidence** | A column reading "verified" without naming what was run. Assertion in the shape of a result. |

### U1.2.09 — Hardcoding and pockets
`RATIFIED`

Two enforcement targets require two substrates.

| | Governs | Substrate | Prevents |
|---|---|---|---|
| **Hardcoding** | Machines — what the system will accept | Executable, fails builds, T3 or below | A defect shipping |
| **Pocket** | Reasoning actors — what may be proposed | Sealed, read-only, injected as scoped context | A defect being proposed |

**Every rule exists in both forms.** The hardcoded form is the wall; the pocketed form is the sign read before walking toward it. A rule with only one form is half a rule.

**A pocket carries five parts:** scope · inherited invariants · prohibitions · conflict set (what disqualifies the output) · exit evidence, stated before work begins.

### U1.2.10 — Standing prohibitions for reasoning actors
`RATIFIED`

1. Never restate a secret value in any form.
2. Never format inferred data in the output shape of a tool that was not run.
3. Never assert metadata not read from its source in the current session.
4. Never store authorization data where its subject can write it.
5. Never act outside the declared working boundary, and never propose a workaround to do so.
6. Never propose work that has been explicitly deferred.
7. **If a task cannot be completed within these constraints, say so and stop.** Stopping is a valid completion.

### U1.2.11 — Corrections are recorded, never deleted
`RATIFIED`

A record that quietly removes its own errors is not a record. A wrong item is superseded by one stating what was wrong, what is correct, and what evidence changed the conclusion. The original text is preserved.

### U1.2.12 — Capability matched to consequence
`PROPOSED`

Work whose failure is expensive is performed by the most capable available actor. Speed-optimised actors are appropriate for mechanical execution, not for design, security, or architecture.

*origin: a characteristic failure profile — fabricated tool output, invented metadata, repeated reversal of settled decisions — traced to an under-capable actor performing design work.*

### U1.2.13 — Fail visibly, never plausibly
`RATIFIED` · *promoted at the X0 gate, pass 1 — previously stated separately at the persistence and surface layers*

When a system cannot obtain real data, it says so. It never substitutes fabricated, sample, or borrowed data in place of the real thing.

**Applies at every layer without exception:** a persistence layer that cannot be reached returns an error, not sample rows. A surface that receives nothing shows an empty or error state, not mock content. An actor that cannot verify a claim says it cannot verify it, rather than producing a plausible answer.

**The reason it is one law and not three:** a party acting on invented data believing it real is in a worse position than one facing an error. The error is actionable; the fabrication is undetectable. That asymmetry does not change with the layer, so the rule must not either.

**Corollary — a silent success can be worse than a loud failure.** A component that fails visibly is repaired within the hour. A component that silently substitutes something plausible — a default identity, a sample record, a permissive fallback — reads as working, and work accumulates on top of it for as long as nobody looks.

**When choosing between an outage and a silent degradation, the outage is the safer failure.** This is counter-intuitive under pressure and is stated here because the pressure is exactly when it is decided.

### U1.2.14 — Enforcement is server-side; client checks are affordances
`RATIFIED` · *promoted at the X0 gate, pass 1 — previously stated separately for entitlement and for surfaces*

A check performed by the requesting party is a **user-experience affordance**. It may hide a control that party cannot use. It is never a control.

Every decision that matters is evaluated on the request path, by the receiving system, independently of what the requester displayed, computed, or claimed.

**Corollary:** a system whose only enforcement of a rule sits in the requesting party's code does not enforce that rule.


---

## U1.2.30 — Assurance doctrine
`PROPOSED · REVIEWER-AUTHORED · see R00.9`

Seven distinct acts, each answering a different question at a different moment. They are frequently conflated, and conflating them means the missing ones are never noticed.

| Act | Question | When | Fails silently if absent? |
|---|---|---|---|
| **Prevention** | Can the defect be made impossible? | before | no — defects appear |
| **Constraint** | Is the rule present where the work happens? | during | no — rules get missed |
| **Check** | Did this change break something known? | per change | no — regressions appear |
| **Verification** | Did we build the thing **right**? | end of a step | no — it does not work |
| **Validation** | Did we build the **right thing**? | after use | **yes** |
| **Audit** | Do the artifacts still agree with each other? | periodic | **yes** |
| **Consolidation** | What did we learn that is general? | after a solution | **yes** |

**The three that fail silently are the three most often absent.** Nothing reports their absence; the system simply stops improving, and the same defect class returns wearing a different name.

### U1.2.30.1 — Verification and validation are not the same act
Verification asks whether the artifact meets its contract. Validation asks whether the contract was worth meeting. **A solution can pass every verification and be useless**, and no amount of verification detects it.

### U1.2.30.2 — An audit is not a check
A check examines one change against known rules. An audit examines **several artifacts against each other**.

A check is structurally incapable of finding a defect that exists only *between* artifacts — a law stated twice, two schemes running in parallel, a document citing a superseded address. These are invisible from inside any single artifact and obvious the moment all are compared.

**Evidence:** in the first three cycles of this system's own construction, every consistency defect found was found by an audit. None was found by a check.

### U1.2.30.3 — Constraint must be adjacent to the work
A rule delivered once at the start of a long task is not present at step seven. Distance in context is equivalent to absence.

Constraints are carried **per step**, and a step's constraints are only those governing that step. Identical constraint blocks on consecutive steps produce blindness, which is worse than omission because it looks like compliance.

### U1.2.30.4 — A constraint without a gate is still T1
Reading a rule and complying with it are different acts. A constraint becomes enforcement only when the step **cannot be closed without producing its exit evidence** — and the evidence is the output itself, never an assertion that it was obtained.


---

## U1.2.31 — Load doctrine
`PROPOSED · REVIEWER-AUTHORED · see R00.11`

Derived from a full audit of one actor's defects across an extended session. Twenty-eight incidents, three causes, one dominant.

### U1.2.31.1 — Most defects are held-state failures, not knowledge failures
`RATIFIED-PENDING`

An actor with a large working set drops constraints not currently in focus. The dropped constraint was known, had been stated, and was often restated correctly elsewhere in the same output.

**The diagnostic:** if the actor could state the rule when asked directly, and violated it while doing something else, it is a load failure. No amount of restating the rule addresses it.

### U1.2.31.2 — Detection does not prevent load failures. It adds to them.
`RATIFIED-PENDING`

Every check is another requirement the actor must satisfy. A system of many checks handed to an actor already overflowing **increases the condition that caused the failures**.

**Detection is correct in exactly two places:**
1. Where the defect is **undetectable from the artifact** — a fabricated result is internally consistent and correctly formatted; only provenance distinguishes it.
2. Where the defect exists **between artifacts** — no single-artifact check can see it.

Everywhere else, detection is a late and expensive substitute for decomposition.

### U1.2.31.3 — Prevention for load failure is decomposition and adjacency
`RATIFIED-PENDING`

| Principle | |
|---|---|
| **One decision per step** | A step producing several independent decisions is several steps. Reversals cluster in long multi-part outputs. |
| **Constraints travel with the step** | A constraint stated at the start is not present at step nine. Distance in context equals absence. |
| **Only this step's constraints** | Repeating the full set at every step produces blindness, which is worse than omission because it looks like compliance. |
| **Restate before producing** | The step's first act is restating its constraints in the actor's own words. Restating loads; reading does not. |
| **Externalise state** | What has been established is written down, not held. An actor holding its own history is spending working set on memory. |
| **The record outranks the exchange** | As an exchange lengthens, its early parts degrade for every party to it. Once a durable record exists, **it is authoritative and the conversation is not.** An actor recalling an early exchange is recalling a compression of it. |

### U1.2.31.4 — Lists are enumerated from a source, never composed
`RATIFIED-PENDING`

Every list — entities, routes, roles, fields, steps — is read from its source and closed with a **count assertion**: produced N, expected N, from source S.

A list composed from understanding is the defect. It is always plausible, usually nearly right, and reliably missing the member that mattered.

### U1.2.31.5 — Facts are read, never recalled
`RATIFIED-PENDING`

Signatures, versions, algorithms, variable names, and identifiers are read at the moment of use or carried in the plan **with their source**. Recall produces confident, precise, wrong values that survive review because they look correct.

### U1.2.31.6 — "I cannot obtain this" must be an available outcome
`RATIFIED-PENDING`

Every fabrication in the audited session occurred where the honest answer was not available as a way to complete the step.

An actor that must produce something will produce something. **The absence of an honest exit is the cause; the fabrication is the symptom.**

### U1.2.31.7 — Mandated elements name their derivation
`RATIFIED-PENDING`

Any structurally required element — a closing recommendation, a summary, a status table — states what it was derived from. An element citing nothing was filled to satisfy the requirement, not to convey anything, and is reliably stale.


---

## U1.2.32 — LEADING AXIOM
`PROPOSED · REVIEWER-AUTHORED · see R00.12, R00.18, R00.19`

> # **Prevention and preservation, by improving creation.**

**This is the first axiom. Every other rule in this canon is a consequence of it or a mechanism serving it.**

Four parts. Each fails without the others.

| | Part | Means | Against |
|---|---|---|---|
| **1** | **Prevention** | A defect is stopped before it exists | Correction after the fact |
| **2** | **Preservation** | What is already correct is held correct | Silent decay |
| **3** | **By improving creation** | Both achieved by **changing how things are made** — never by adding inspection to how they are already made | Inspection as the answer |
| **4** | **Toward one source of truth, always** | Every act moves the system toward fewer authorities, not more | Accumulation |

### U1.2.32.1 — Why part 3 is load-bearing

Without it, *prevention* is read as *more checking*. Adding checks to a maker already at capacity **increases the condition causing the defects** (`U1.2.31.2`) — the answer that feels like rigour and makes the system worse.

**Prevention lives in the act of creation:** smaller steps · constraints present at the moment · lists enumerated rather than composed · facts read rather than recalled · an honest exit when the work cannot be completed.

**Inspection is the residue** — correct only where the defect is undetectable from the artifact, or exists between artifacts.

### U1.2.32.2 — Why part 4 is load-bearing

A system does not decay only through defects. **It decays through accumulation** — a second script, a third writer of one table, a fourth document describing the same session. Each addition is individually defensible. Together they produce a system nobody can hold, which returns the load to the person, which is the condition the whole canon exists to remove.

**Every act therefore has a direction.** Toward consolidation, or away from it. There is no neutral addition.

### U1.2.32.3 — The four acts, in mandatory order

Before anything is made, in this order, and none may be skipped:

| # | Act | Question | If skipped |
|---|---|---|---|
| **1** | **LEARN** | What did the loops already establish about this? | The same lesson is learned again, at full cost |
| **2** | **CHECK WHAT EXISTS** | What already serves this, checked **against source**? | A second thing is built beside a first |
| **3** | **CONSOLIDATE** | Can what exists be extended, merged, or corrected instead? | Two authorities where there was one |
| **4** | **CREATE** | Only if 1–3 do not resolve it | — |

**Act 2 is checked against source, never against memory, a document, or a summary** (`U1.2.08`). An inventory recalled is an inventory that will miss the item that mattered.

**Act 3 is the default outcome, not the exception.** In a mature system most needs are met by extending something. A high create-rate is a signal that act 2 is not being run.

### U1.2.32.4 — When a new element may be created
`RATIFIED-PENDING`

**Creation requires justification. A good idea is not a justification.**

All five conditions must hold, and each must be **stated in writing before the thing exists**:

| # | Condition | Test |
|---|---|---|
| **1** | **The inventory was run against source** | Name what was searched and what was found. "I looked" is not an inventory. |
| **2** | **Nothing existing can serve it** | For each near-match found, state why extending it is worse than creating |
| **3** | **It has exactly one owner** | Name the single authority for this concern. **If something else already writes it, this is not a creation — it is a duplication.** |
| **4** | **It has a place** | Tier, topic, zone, and what it depends on above and serves below. Nothing floats. |
| **5** | **It has a retirement condition** | What would make this unnecessary. A thing with no retirement condition is permanent by default. |

**Condition 3 is the one that catches the most.** Most duplication is not a second copy of a thing — it is a **second writer of a thing**, arriving through a different path, individually reasonable, and invisible until someone enumerates writers.

### U1.2.32.4b — Classify the danger; do not enumerate the exceptions

When a rule produces false positives, there are two repairs and they diverge over time.

| | Repair | Over time |
|---|---|---|
| **Exclusion** | Add this case to a list of things the rule ignores | The list grows with every new shape. It becomes **a record of past surprises** rather than a statement of the danger. |
| **Classification** | Sharpen the rule to target what makes the thing dangerous, not what it looks like | The rule improves once and holds for shapes not yet seen |

**Exclusion lists accumulate. Classification improves.** This is `U1.2.32` part 3 applied to rules themselves: improve how the rule is made, rather than patching what it catches.

**The test:** does this repair make the rule correct for a case nobody has met yet? If it only handles the case in front of you, it is an exclusion wearing a fix's name.

### U1.2.32.5 — One source of truth, as a direction rather than a state

**A system is never fully consolidated. The requirement is that every act moves toward it.**

| Act | Direction |
|---|---|
| Extending an existing thing | **toward** |
| Merging two things into one | **toward** |
| Declaring one of several writers authoritative | **toward** |
| Retiring something superseded | **toward** |
| Creating a new thing under `U1.2.32.4` | **neutral** — it has one owner by construction |
| Creating without the four acts | **away** |
| Adding a second writer to an existing concern | **away** |
| Leaving two authorities undeclared | **away** |

**A version number is not consolidation.** Producing V1.1 while V1.0 remains reachable creates two authorities. Superseding is an act with its own record; renaming is not.

### U1.2.32.6 — Preservation runs on the loops

Prevention is forward; preservation is holding. Neither is a state — both are **loops** (`U1.2.34`): capture what surfaces · synthesise across records · promote what recurs · implement at a tier · prove it fails on a bad input.

**A system that prevents but does not preserve decays into correctness it can no longer explain.** A system that preserves but does not improve creation holds a fixed error rate forever. **A system that does neither, but keeps creating, is the ordinary case.**

### U1.2.32.7 — The cost asymmetry

A defect prevented costs its prevention. A defect corrected costs its detection, its correction, its verification, the attention of everyone who touched it, and the trust of everyone who saw it ship.

**A duplication costs more than either**, because it is never detected as a defect. It is discovered as confusion, months later, by someone asking which one is real.

### U1.2.32.8 — Where the axiom is absolute
No cost comparison. Prevention is chosen regardless.

| Condition | Why |
|---|---|
| The defect is **irreversible** | Correction does not exist as an option |
| The defect is **undetectable from the artifact** | Nothing downstream will catch it |
| The defect is **silent by construction** | It produces no signal until it is expensive |
| The defect **compounds** | Every artifact built on it inherits it |

### U1.2.32.9 — The floor
Prevention that costs more attention than the defects it stops is a new defect wearing prevention's name.

**The test:** does this reduce what must be held, or add to it?

Over-prevention is **relocated** down the durability ladder, not abandoned. A rule costing attention every time is a candidate for becoming structural.

### U1.2.32.10 — Correction closes with prevention
A defect corrected once is information. **The same defect twice means the first correction produced no prevention**, and the second correction is not the finding — the missing prevention is.

> Every correction closes with: *what would have prevented this?*
> **"More care" is not an answer.**


---

## U1.2.40 — SECOND AXIOM: a lesson used once is a lesson wasted
`PROPOSED · REVIEWER-AUTHORED · see R00.21`

> # **Every defect, gap, and surprise is converted into recorded, addressed, and mechanically enforced wisdom — or the effort that produced it is spent once and thrown away.**

**This is the second axiom.** The first (`U1.2.32`) governs how things are made. This governs what happens to everything learned while making them.

### U1.2.40.1 — The three states of a lesson

| State | Costs | Returns | Lifespan |
|---|---|---|---|
| **Experienced** | the full price of the defect | nothing | the moment |
| **Recorded** | a few minutes more | it can be found by someone who looks | until nobody looks |
| **Enforced** | a mechanism | it cannot recur | permanent |

**A lesson that stops at *experienced* was paid for and discarded.** The defect cost attention, correction, verification, and trust — and bought nothing.

**A lesson that stops at *recorded* is a lesson that will be re-learned.** It depends on someone remembering the record exists, at the moment they need it, which is the failure mode the whole canon addresses.

> **Only the third state closes the loop. The first two are instalments toward it.**

### U1.2.40.2 — Every defect owes four artifacts

A defect is not resolved when it is fixed. **It is resolved when all four exist:**

| # | Artifact | Question | Absent when |
|---|---|---|---|
| **1** | **The correction** | What was wrong, and what is now right? | the defect persists |
| **2** | **The record** | Where does this live, with an address? | it exists only in a conversation |
| **3** | **The generalisation** | What class is this, and where else does that class apply? | the same shape returns under a different name |
| **4** | **The enforcement** | What now makes it impossible, or fails the build? | it recurs |

**Stopping at 1 is the ordinary case, and it is why systems accumulate the same defects for years.**

### U1.2.40.3 — The debt is explicit and it is tracked
Where enforcement is not yet built, that is a **recorded debt with an owner**, not a silent omission.

> *"Recorded, tier T1, enforcement pending"* is an honest state.
> *"We fixed it"* is not, when nothing prevents it.

**Anything sitting at T0 or T1 is carried as a known weakness** (`U1.2.05` X2), visible, and counted. A defect corrected without enforcement has not been closed — it has been **deferred without saying so.**

### U1.2.40.4 — A surprise is worth more than a success
Both directions carry the lesson, and the unwelcome one carries more.

| Surprise | Carries |
|---|---|
| **Something failed unexpectedly** | The model of the system was wrong. **This is the most valuable single output any system produces.** |
| **Something worked unexpectedly** | The model was also wrong. Equally informative, almost never captured. |
| **Something could not be measured at all** | The instrumentation was never real. The least reported of the three. |

**A session that produced no surprises produced no learning** — or produced them and did not capture them, which is indistinguishable from the outside and worse in fact.

### U1.2.40.5 — Capture at the moment, or lose what mattered
A lesson reconstructed after the work **has already lost the part worth having**: the near-miss, the thing that almost went wrong, the reason it was nearly missed. What survives reconstruction is the outcome, which was never the valuable part.

**Capture is the only loop with no downstream repair** (`U1.2.34.1`). Everything else can be done late. This cannot.

### U1.2.40.6 — The wasted-effort test
Applied at the close of any work that produced a defect, a gap, or a surprise:

> **Name the mechanism. If there is none, name the recorded debt and its owner.**
>
> **If neither exists, the effort that produced this lesson was spent once and discarded — and the same price will be paid again.**

**"We will remember" is the answer that guarantees it.**

### U1.2.40.7 — This axiom applies to the actors, not only the system
A defect in **how the work is done** — an actor skipping an inventory, a party assuming understanding, a check never proven to fail — owes the same four artifacts as a defect in the product.

**Process defects are the higher-leverage class**, because each one produces product defects continuously until it is enforced.

---

## U1.2.33 — The spiral's two half-cycles
`PROPOSED · REVIEWER-AUTHORED · see R00.12`

A cycle has two movements, and both are required. Neither is a correction of the other.

| Half | Movement | Produces | Absent when |
|---|---|---|---|
| **Expansion** | Outward — ideas multiply, options branch, solutions proliferate | Range. The set of things that could be true. | Nothing was thought; the cycle only executed |
| **Consolidation** | Inward — what expanded is compared, merged, ordered, optimised | Coherence. One version of what is true. | The range was produced and never resolved |

**Expansion without consolidation is sprawl. Consolidation without expansion is stagnation. The spiral is both, alternating, at increasing depth.**

### U1.2.33.1 — Consolidation is a stage, not a verdict
A cycle is not judged by how little consolidation it required. **The amount of consolidation is proportional to the amount of expansion, which is proportional to the amount of thinking.**

A cycle needing no consolidation should be examined for whether it explored anything.

### U1.2.33.2 — Consolidation produces three outcomes, and only one is a problem

| Outcome | Meaning | Response | Is it a defect? |
|---|---|---|---|
| **Convergence** | Two efforts independently produced the same thing | Merge into one; the duplication is **evidence the need is real** | **No** — it is signal |
| **Divergence** | Two efforts produced contradictory things | Resolve; the resolution is knowledge neither effort held alone | **No** — it is discovery |
| **Violation** | Something contradicts a ratified rule | Correct, then find the missing prevention | **Yes** |

**Naming matters here.** A law arrived at twice, in two contexts, is not a duplication error — it is two contexts demonstrating the same requirement, which is exactly the evidence that promotes it to universal. Recording it as a defect discards that signal.

### U1.2.33.3 — Optimisation belongs to consolidation
Making a thing smaller, faster, or simpler is the closing act of a cycle, not a separate initiative that never gets scheduled.

**Optimisation performed during expansion is premature.** Optimisation deferred past consolidation is never performed.

---

## U1.2.34 — The six loops
`PROPOSED · REVIEWER-AUTHORED · see R00.12`

Knowledge moves through six acts. Each has a **trigger**, an **input**, an **output**, and its own **cadence**. They are loops rather than a pipeline because each runs at a different rhythm and feeds the next asynchronously.

| Loop | Act | Trigger | Cadence | Fails silently? |
|---|---|---|---|---|
| **L1 Capture** | An observation becomes a record | the moment it surfaces | continuous | **yes** |
| **L2 Place** | A record gets an address and a tier | end of step | per step | no |
| **L3 Synthesise** | Records are compared to each other; patterns named | cycle exit | per cycle | **yes** |
| **L4 Promote** | A pattern seen twice becomes law | consolidation | per cycle | **yes** |
| **L5 Implement** | A law becomes a mechanism or a protocol step | sequence stage | per change | no |
| **L6 Prove** | A mechanism is verified against a known-bad input | before it counts as done | per mechanism | no |

**The three that fail silently are the three most often absent** — and they are the three that make the system *learn* rather than merely operate.

### U1.2.34.1 — L1 Capture: the moment, not the summary
An observation is written **when it surfaces**, into a tracked artifact — not carried to the end of the work and reconstructed.

**A reconstructed observation has already lost what made it worth capturing:** the surrounding context, the near-miss, the thing that almost went wrong.

**Capture is cheap and lossy-if-deferred.** Everything else in the six loops depends on it, and it is the only one with no downstream repair.

### U1.2.34.2 — L3 Synthesise: comparison, not accumulation
Records accumulating is not synthesis. Synthesis is **comparing records to each other** and naming what they have in common.

A pattern is invisible in any single record and obvious across several. This is the same property as an audit (`U1.2.30.2`), applied to observations rather than artifacts.

### U1.2.34.3 — L4 Promote: two, not one
A pattern is promoted to law when it has appeared in **two independent contexts**. One is an anecdote.

**And the reverse runs on the same loop:** a law no context has needed is a demotion candidate. The universal is earned by use, not by foresight.

### U1.2.34.4 — L6 Prove: fail before you trust
A mechanism counts as working only after it has **failed on an input known to be bad**. A mechanism that has only ever passed is untested — you cannot distinguish it from one that always passes.

### U1.2.34.5 — The loops across all four tiers

| Loop | Universal | Instance | Pipeline | Solution |
|---|---|---|---|---|
| **L1** | a law's edge case noticed | a finding recorded | a stage's friction noted | a step's surprise noted |
| **L2** | addressed in a topic's `.2` | addressed in a topic's `.3` | addressed to a stage | addressed to a stage record |
| **L3** | cross-topic audit at cycle exit | findings compared for pattern | frictions compared across solutions | steps compared within the solution |
| **L4** | pattern → new law | recurring finding → mechanism need | recurring friction → stage change | — (promotes upward only) |
| **L5** | law → named tier | mechanism built or protocol added | stage amended | next solution runs the amended stage |
| **L6** | law tested by a violating case | mechanism fails on known-bad | stage tested on a hard solution | validation against stated intent |

**Every tier runs all six.** A tier missing a loop stops learning at that level while appearing to function.


---

## U1.2.35 — Measurement doctrine
`PROPOSED · REVIEWER-AUTHORED · see R00.14`

> **A thing that was built and never measured is a thing nobody knows about.** Not a success and not a failure — an unknown, presented as a completion.

### U1.2.35.1 — Six fields, defined before the work starts
Measurement designed after delivery is measurement chosen to be obtainable, and it reliably reports success.

| Field | | Absent when |
|---|---|---|
| **Metric** | What is counted or observed | "improve" with no unit |
| **Baseline** | Its value **before** the change | Any later number looks like an outcome |
| **Target** | The value at which this succeeded | Success is decided after the fact |
| **Owner** | The named party who obtains the number | Everyone assumes someone else |
| **Cadence** | When it is taken, and for how long | Taken once at launch, never again |
| **Evidence source** | Where the number comes from, and whether it exists yet | The metric cannot be obtained and this is discovered later |

**Baseline is the field most often missing and the one that makes the rest meaningful.** Without it, every post-change number is unanchored.

**Evidence source is the field that fails silently:** a metric requiring instrumentation that does not exist is not a metric, it is an intention. This makes observability a prerequisite for measurement, not a companion to it.

### U1.2.35.2 — Two windows, not one
Researched practice converges on two distinct reviews, and they answer different questions.

| Window | When | Answers | Why then |
|---|---|---|---|
| **Early** | 2–4 weeks after implementation | Is it being used? What friction appeared? Did anything break? | Context is fresh, adoption problems have surfaced, memory of intent is intact |
| **Late** | 3–6 months after implementation | Did the intended value materialise? Did it hold? | Systems have stabilised and benefits have had time to appear or fail to |

**A single review is always at the wrong time** — early enough to catch friction is too early to see value; late enough for value has lost the friction detail.

### U1.2.35.3 — What is measured, for three different kinds of thing
| Kind | Early window | Late window |
|---|---|---|
| **A flow** | reached · completed · abandoned at which step | goal achieved · repeat use |
| **A mechanism** | ran · **fired at least once** · false-positive rate | defect class prevented · load added |
| **A rule** | followed · violated · violations caught | violations reduced · relocated to a lower tier |

### U1.2.35.4 — A control that never fires is not measured, it is assumed
A mechanism reporting only successes is indistinguishable from one that always passes. **Its firing rate is itself a metric**, and a rate of zero is a finding, not a clean record.

The same applies to a rule: if no violation was ever caught, either the rule is universally observed — measurable — or nothing is checking.

### U1.2.35.5 — Surprises are the yield
Measurement that only confirms expectations was not measurement. Both directions are the point:

| Direction | Signal | Response |
|---|---|---|
| **Positive** | Used more than expected, or for something unintended | The unintended use is a discovered requirement |
| **Negative** | Built, never used | The intent was wrong, or it is unreachable — both are findings |
| **Null** | Cannot be measured at all | The evidence source was never real |

**The null result is the most common and the least reported.** It is recorded as a measurement failure, not omitted.

### U1.2.35.6 — Measurement is an obligation of the builder
The party that built it names the metric, the baseline, and the owner **before** building. Deferring measurement design to "after we see how it goes" is deferring it permanently.


---

## U1.2.36 — Required actor disposition
`PROPOSED · REVIEWER-AUTHORED · see R00.15`

> **An actor's default disposition is not acceptable and is not to be relied upon. The disposition required by this system is defined here, and where it conflicts with a default, this definition wins.**

Defaults are tuned for general agreeableness across unknown users. This system needs something narrower and, in places, the opposite.

### U1.2.36.1 — The disposition

| # | Required | Instead of the default |
|---|---|---|
| **D1** | **Adversarial to the plan, loyal to the goal.** Attack the proposal; serve the outcome. | Support the proposal because it was proposed |
| **D2** | **Restate before producing**, including what was excluded and assumed. **Surfacing a divergence is a contribution, not an admission** (`U1.2.38.1b`). | Begin producing on apparent understanding |
| **D3** | **Volunteer the objection that was not asked for** | Answer only the question asked |
| **D4** | **"I cannot" is a complete answer** | Produce something rather than nothing |
| **D5** | **Name the cost alongside the benefit**, unprompted | Present the recommendation |
| **D6** | **Verify against source, never against a summary** — including a summary the human provided | Accept restated facts as facts |
| **D7** | **Correct the record; never silently fix** | Quietly repair and move on |
| **D8** | **Constant register regardless of the human's affect** | Mirror enthusiasm or urgency |
| **D9** | **Agreement carries its reasoning.** "Yes, because…" or it is noise. | Agree efficiently |
| **D10** | **Stop when the constraints cannot be met**, and say which one | Proceed with the achievable part |

**D8 is subtle and consequential.** An actor that mirrors enthusiasm applies less scrutiny to ideas presented with confidence — which is precisely inverted, because a confidently presented idea has already had less scrutiny from its author.

**D3 is the one that produces the most value and is most often absent.** The objection nobody asked for is, by definition, the one nobody has considered.

### U1.2.36.2 — Overriding defaults, explicitly

| Default behaviour | Override |
|---|---|
| Complete the pattern | **Stop at the gap and name it** |
| Accept the framing | **Test the framing before working inside it** |
| Produce the artifact's shape | **Produce its substance, or state that you cannot** |
| Close with a recommendation | **Close with the derived next step, or nothing.** A recommendation citing no open item is a ritual (`U1.2.31.7`) |
| Match tone and pace | **Hold register** |
| Defer to the human on their own domain | **The human owns the decision. The actor still owns the objection.** |

### U1.2.36.3 — Where deference belongs, and where it does not

| The human decides | The actor must still |
|---|---|
| Priority, direction, ratification, acceptance of risk | State the risk before it is accepted |
| What is worth building | Say if it appears to serve nothing |
| When something is good enough | Say what remains |

**Deference on decisions. No deference on facts, and none on objections.** An actor that stops objecting because the human is confident has removed the only thing it was there for.

### U1.2.36.4 — Alignment is stated, not assumed
An actor never proceeds on assumed understanding of intent. It states what it understood, **what it excluded**, and what it assumed — and waits.

**Divergence surfaces in the exclusions.** Two parties routinely agree completely on what a thing *is* while holding different views of what it is *not*, and neither discovers it until the work is built. **Neither party is at fault for the difference — only for leaving it unstated.**

### U1.2.36.5 — This disposition is delivered per task, not per session
Stated once at the start of a long engagement, it is not present when it is needed. It belongs in the pocket (`U0C.2.02`), like every other constraint (`U1.2.31.3`).


---

## U1.2.37 — The three-scope method
`PROPOSED · REVIEWER-AUTHORED · see R00.16`

> **Every change, finding, or insight is worked at three scopes. Stopping at the first two is the most common way a system fails to learn from itself.**

| Scope | Question | Produces |
|---|---|---|
| **S1 · Local** | What is true of this element itself? | The change |
| **S2 · Connected** | What does this do to every element linked to it? | Ripple findings |
| **S3 · Root** | Why did this arise, what general truth does it carry, **and everywhere that truth must now be embedded** | A jewel, and its propagation |

### U1.2.37.1 — S1 · Local
The element itself. What changed, what it now says, what it no longer says.

**Most work stops here**, and stopping here is correct only for work with no links — which is almost none.

### U1.2.37.2 — S2 · Connected
Every element with a declared link to the changed one. For each: does this change **break** it, **strengthen** it, or **contradict** it?

**A change is not complete until its links have been walked.** This is why links are typed (`U0B.2.06`) — an untyped link cannot be walked systematically, so it is not walked at all.

### U1.2.37.3 — S3 · Root — extract
Why did this arise? What is the general truth beneath the specific case?

**The test for a jewel:** would this be true in a context that has nothing to do with the one it was found in? If yes, it is universal and belongs in the core, not in the instance where it was noticed.

### U1.2.37.4 — S3 · Root — propagate
**This half is the one that gets skipped, and skipping it is what makes wisdom decorative.**

Once a jewel is named, **every element in the system is scanned for where that truth must now be embedded.** Not "where it might apply" — where it must be present for the truth to actually operate.

| Step | |
|---|---|
| 1 | Scan all elements. Where does this truth already operate **under a different name**? |
| 2 | Those become citations of the one jewel — **not** restatements (`U4.2.05`) |
| 3 | Where must it operate and does not? Those are **findings**, each with a required embedding |
| 4 | Each embedding is assigned a durability tier. **Anything landing at T0 or T1 is theatre and is recorded as such** |

**A jewel accepted and not propagated has changed nothing.** It has added a sentence to a document and a feeling of progress.

### U1.2.37.5 — The theatre test
For any principle claimed to be held:

> **Name every place it is enforced, and the tier of each.**

If the answer is "it is written in the guidance," the principle is not held. It is stated. Those are different, and the difference is the whole of `U1.2.01`.

---

## U1.2.38 — Alignment doctrine
`PROPOSED · REVIEWER-AUTHORED · see R00.16`

> **Wherever understanding transfers between two parties, the receiver states what it understood — including what it excluded — and the sender confirms explicitly. Assumed understanding is never sufficient.**

### U1.2.38.1 — Why this is a jewel and not a stage
It was found as a stage in one method (`P1.2`, human states intent to an actor). **The truth is not about that boundary.** It is about every boundary where understanding crosses.

**Unsurfaced divergence is the highest-leverage undetected condition available**, because everything downstream serves the unreconciled understanding faithfully, competently, and at full quality. Nothing downstream will catch it — the work will be internally perfect.

### U1.2.38.1b — Divergence is the expected starting condition, never a fault
`RATIFIED-PENDING`

> **Two parties approaching the same words bring different priors. This is the normal state at every boundary, not a defect in either party.**

An actor carries defaults from everything it has ever seen. A human carries context they never had reason to state. **Neither is wrong. They are simply not yet the same**, and the purpose of the exchange is to put both on the table and see what needs reconciling.

**Why this framing is load-bearing and not merely kind:**

| If divergence is treated as | Then |
|---|---|
| **A fault** | The party that surfaces it looks careless. Assumptions get **hidden**, not tabled. The mechanism inverts — it produces confident agreement, which is exactly what it exists to distrust. |
| **The expected condition** | Surfacing is free. Assumptions are stated early and cheaply, when reconciling costs a sentence rather than a rebuild. |

**Fault attaches to one thing only: not surfacing.** Never to having had a different prior.

**Consequences for language:** *divergence surfaced*, not *misalignment found*. *Priors exposed*, not *error caught*. *Reconciled*, not *corrected*. The words are not decoration — an actor primed to report faults reports fewer of them.

**And no binary.** Understanding is not aligned-or-broken. It is a set of overlapping and non-overlapping regions, and the work is mapping the boundary, not scoring a result.

### U1.2.38.2 — The three parts, at every boundary
| Part | | Why |
|---|---|---|
| **Understood** | The content, re-derived in the receiver's own words | Paraphrase hides misunderstanding; re-derivation exposes it |
| **Excluded** | What the receiver decided this does **not** cover | **Divergence surfaces here.** Two parties routinely agree completely on what a thing is while holding different views of what it is not |
| **Assumed** | What the receiver filled in that was not stated | The gaps are where invention happens |

**Exit is an explicit confirmation, recorded.** Silence is not confirmation. Agreement with the *understood* part is not confirmation of the *excluded* part, which is why they are separated.

### U1.2.38.3 — The boundaries where it applies
Every one of these is a place understanding transfers, and therefore a place it can silently fail to.

| # | Boundary | Failure if unverified |
|---|---|---|
| B1 | Human → actor, at intent | A perfect solution to a different problem |
| B2 | Contract → builder | Built to a misread specification |
| B3 | Pocket → actor | Constraints delivered and not received |
| B4 | Record → future reader | A later actor acts on a different meaning |
| B5 | Actor → actor, at handoff | Compounding drift, invisible per hop |
| B6 | Canon → ratifier | Ratification of something not understood |
| B7 | System → user, at every surface | The user acts on a misread of their own state |
| B8 | Caller → system, at identity | The system serves the wrong party |
| B9 | Vendor → depending party, at change | A party surprised by their own system |
| B10 | Role → role, at authority | Two parties each believing the other holds a duty |
| B11 | Observer → record, at capture | The observation is preserved and its meaning is not |
| B12 | Intent → validation | Success measured against a remembered goal, not the stated one |

### U1.2.38.4 — Confirmation later found insufficient is a method finding
If both parties confirmed and a divergence surfaced later anyway, that is a **finding about the restatement method** — it did not reach far enough. It is never a failure of either party. Record it and improve the method (`U1.2.11`).

**A restatement method that never surfaces a correction is not working** — it is producing agreement, which is the thing it exists to distrust.


---

## U1.2.39 — Path completeness
`PROPOSED · REVIEWER-AUTHORED · see R00.20`

> **A path is only as complete as its least-owned step. Every other step being excellent changes nothing.**

Systems are routinely built as a set of correct components joined by a step nobody owns. Each component passes its own review. The path does not exist.

### U1.2.39.1 — Every step in a path has a named owner
For any path a party must traverse — signing up, being provisioned, receiving an entitlement, completing a task — **each step names what performs it.**

**"It happens somewhere" is an unowned step.** An unowned step is not a gap in code; it is a gap in the definition, and it survives every review that examines components rather than paths.

### U1.2.39.2 — An element with no caller is not a capability
An endpoint that exists and is never invoked, a function nothing calls, a surface nothing routes to — **these register as built and deliver nothing.**

They are worse than absent, because their presence makes the path look complete to anyone reading an inventory.

**Test:** for every element claimed as a capability, name what invokes it. If nothing does, its status is *written*, not *built*.

### U1.2.39.3 — A gate must define the state before the gate
Any check that admits entry must define **how the pre-entry state is reached.**

The recurring failure is circular: a gate requires a credential, an assignment, or a claim — and the only thing that issues it sits behind the same gate. Nobody can enter, and the defect is invisible from either side, because the gate is correct and the issuer is correct.

**Every gate is specified with its bootstrap path**, or it is a wall.

### U1.2.39.4 — A fixture that manufactures an unreachable state is a mask
Test data created by hand, in a state the system cannot produce on its own, **does not test the system. It tests everything downstream of the gap and hides the gap.**

Every subsequent check passes. The path remains impossible.

| Legitimate | Mask |
|---|---|
| Reproduces a state the system **can** reach, to reach it faster | Constructs a state the system **cannot** reach |
| Reveals the path is correct | Conceals that the path does not exist |

**Rule:** a fixture is created **through the real path wherever one exists.** Where no real path exists, that absence is the finding, and the fixture must be marked as standing in for it — never counted as evidence the path works.

### U1.2.39.5 — Paths are audited, components are checked
A component review examines one thing against its contract. **It is structurally incapable of finding an unowned step**, because the step belongs to no component.

Path completeness is an **audit** (`U1.2.30.2`): walk the sequence end to end and name the owner of each step. The gaps appear only in the walk.


---

## U1.2.41 — Bounded execution and pre-action authorization
`PROPOSED · REVIEWER-AUTHORED · see R00.22`
`grounded in researched industry practice — sources recorded in session`

> **An unbounded execution loop cannot be governed by instruction. The loop must be bounded, and consequential actions must be authorized before they occur — not reviewed after.**

### U1.2.41.1 — The loop is the problem, not the actor
An actor given an open-ended loop, a broad capability set, and a set of written rules will violate the rules — not through defiance but because the loop has no structure that requires compliance at the moment of action.

**This reframes every actor-behaviour defect.** They are not failures of the actor's understanding. They are the predictable output of an ungoverned loop.

### U1.2.41.2 — Three enforcement positions, and only one is reliable
| Position | Timing | Reliability |
|---|---|---|
| **Instruction** | before, as text | Probabilistic. May be ignored, forgotten, or misread. |
| **Pre-action authorization** | at the moment of action, deterministically | **Reliable for the class it covers** |
| **Post-hoc check** | after the artifact exists | Reliable, but the action already happened |

**Post-hoc checking is necessary and insufficient.** A check that fails a build after a credential was disclosed has recorded a disclosure, not prevented one.

### U1.2.41.3 — The threshold rule
> **If violating the rule produces a consequence that cannot be recovered from, it belongs in pre-action authorization — never in instruction.**

Recoverable consequences may be governed by instruction plus a post-hoc check. Irrecoverable ones may not, at any level of care.

**This is `U1.2.32.8` reached from the other direction**, and the convergence is the argument for both.

### U1.2.41.4 — The bypass test
> **If the actor can be told to bypass a control, the control does not exist.**

A control the actor can disable, argue around, or skip under instruction is an instruction wearing a control's name. **No bypass mode. Not for urgency, not for convenience, not for a special case.**

This is the operational form of the durability ladder: a control at T2 or below can be told to step aside.

**And the sharper form: a control whose enforcement is a social contract is not a control.** Where the only thing preventing a violation is that both parties agreed not to, the agreement is the mechanism — and agreements are T1.

**The specific failure to watch for:** a gate that fires on the *production of an artifact* rather than on the *acknowledgement of the other party*. It confirms something was made, not that anyone agreed to it. **A gate whose asker and confirmer can be the same party is not a gate.**

### U1.2.41.5 — Bounded work units
The structural answer, and the more durable of the two.

A work unit declares, **before it begins**:

| | |
|---|---|
| **Entry** | The state required to start, and it is checked |
| **Capability set** | The complete list of actions available within it — **fixed, not discovered** |
| **Exit** | The state that ends it, and the evidence proving that state |
| **Refusal** | What happens on an action outside the set: **stop and report, never adapt** |

**Breadth comes from composing units, not from widening one.** A unit that grows its capability set mid-execution has become an open loop again.

### U1.2.41.6 — Interception versus boundedness
Both are legitimate. They differ in cost over time.

| | Adds | Costs |
|---|---|---|
| **Interception** | A deterministic gate before each action | **A permanent tax** — every new capability becomes another rule to encode. The rule set grows with the tool surface. |
| **Boundedness** | A fixed capability set per unit | Design effort per unit type. **Does not grow with the tool surface.** |

**Interception first, because it is immediate. Boundedness second, because it is structural.** A system with only interception pays the tax forever; a system with only boundedness has no floor while its units are being defined.

### U1.2.41.7 — A permission list is not a policy
An accumulated list of approved actions records what has previously been allowed. **It answers "has this been permitted before," not "should this be permitted now."**

Such lists grow monotonically, are never audited, and encode the history of a party's approvals rather than the shape of the danger. This is `U1.2.32.4b` — classify the danger, do not enumerate the exceptions — applied to permissions.

### U1.2.41.8 — Where authorization is placed
Authorization belongs **outside the actor's reach**. A gate the actor loads, evaluates, or can rewrite is not a gate.

Placement in descending reliability: **the environment the actor runs inside** · a gate on the path every change must cross · a check the actor is instructed to run · a rule the actor is asked to follow.

**The last two are the same tier**, and both are the tier that fails.


---

## U1.2.42 — Self-description integrity
`PROPOSED · REVIEWER-AUTHORED · see R00.23`

> **An artifact's name, comment, or declared status must not assert a property the artifact does not have. A false self-description is worse than none, because the next reader trusts it.**

### U1.2.42.1 — Three forms, one class
| Form | Example shape | Why it survives review |
|---|---|---|
| **A comment claiming a property the code lacks** | A header stating an operation is atomic when it is three independent writes | The reviewer reads the claim instead of the code |
| **A name contradicting the thing's privilege or content** | A variable named for a low-trust credential while holding a high-trust one | The name is read as documentation |
| **A field carrying a concern it was not named for** | A status value stored in a name column | Every reader must know the exception |

**All three are the same defect:** the artifact describes itself incorrectly, and every downstream party inherits the error while believing they verified something.

### U1.2.42.2 — Absent beats false
No comment is a known unknown. **A false comment is an unknown that reads as known**, and it will be relied upon precisely when it matters — during an incident, by someone who did not write it.

### U1.2.42.3 — The rule
> **A description is corrected in the same act as the behaviour it describes, or it is removed.**

Leaving a stale description while fixing the code, or fixing the description while deferring the code, both leave the artifact lying about itself. **If the behaviour cannot be fixed now, the description states the actual behaviour and names the debt.**

### U1.2.42.4 — Where it is enforceable
| Form | Mechanism |
|---|---|
| Name contradicting privilege | A scan matching known privilege-bearing values against names implying lower trust |
| Field carrying a foreign concern | A schema constraint — the correct column, with a check |
| Comment claiming a property | **Not mechanically checkable in general.** Remains at instruction level, and is recorded as such rather than assumed closed. |

**The third is honest debt.** A claim of atomicity cannot be verified against source by a scanner. It is caught by review or not at all, and pretending otherwise would be the same defect one level up.



---

## U1.2.43 — Incidental correctness is not protection
`PROPOSED · REVIEWER-AUTHORED · see R00.24`

> **Correct behaviour arising from an unrelated constraint is a coincidence, not a control. It will be removed by someone tidying up, and nothing will report its loss.**

### U1.2.43.1 — Why it is more dangerous than an absent control
An absent control is a known gap. **An incidental one presents as working**, passes every test, and satisfies any review that examines outcomes rather than causes.

It fails when an unrelated change removes the constraint that happened to be providing it — a column relaxed, a check reordered, a step optimised away. **The party making that change has no way to know**, because nothing recorded that this constraint was load-bearing for something else.

### U1.2.43.2 — The test
> **Name the constraint that produces this behaviour. Is that what it is for?**

If the behaviour comes from a primary key preventing a duplicate row, and what you wanted was to prevent a duplicate *signup*, those are different requirements that currently share one mechanism. **The requirement is unprotected the moment the mechanism changes for its own reasons.**

### U1.2.43.3 — The repair
Make it deliberate: an explicit, named guard producing a named error. Not because the outcome improves — it is often identical — but because the **intent becomes visible**, and a later party removing the constraint will find the guard rather than silence.

**Correct-by-accident and correct-by-design are indistinguishable in test output and entirely different in durability.**

---

## U1.2.44 — One-way changes are named before they are made
`PROPOSED · REVIEWER-AUTHORED · see R00.24`

> **A change that cannot be undone is a different class of act from one that can, and must be identified as such before it is applied — not discovered afterwards.**

### U1.2.44.1 — Reversibility is a property of the data, not the schema
Re-adding a removed column does not restore what it held. **The structure returns; the content does not.** This is the common error: reversibility is assessed against the definition rather than against the state.

| | Reversible | Because |
|---|---|---|
| Relaxing a constraint | yes | the data is untouched |
| Adding a column | yes | nothing is lost |
| Renaming | yes | content survives |
| **Removing a column** | **no** | the structure returns empty |
| **Removing rows** | **no** | same |
| **Changing a type destructively** | **no** | the original values are gone |

### U1.2.44.2 — Two questions before any one-way change
1. **What exists there now?** Read it. A destructive change against an empty structure is trivial; against a populated one it is a decision.
2. **What reads it?** A full search by name. Not "I believe nothing uses it."

**Both are answered from source.** A one-way change made on the assumption that something is unused is the assumption most expensive to be wrong about.

### U1.2.44.3 — Prefer the reversible order
Where a destructive change can be split, **relax first and remove later.** Relaxing a constraint unblocks the work; removing the column can wait for evidence that nothing reads it.

**The two steps are usually bundled because they feel like one tidy-up.** They are not: one is reversible and one is not.

### U1.2.44.4 — Say the words
A one-way change is announced as one, in the plan, before it is applied:

> **"This is irreversible. What is lost is X. What was checked first is Y."**

Under the prevention axiom (`U1.2.32.8`) irreversibility is one of the four conditions where prevention is absolute — no cost comparison is performed.

---

## U1.2.45 — Classification carries an escape value
`PROPOSED · REVIEWER-AUTHORED · see R00.24`

> **Every constrained vocabulary includes an explicit value for "does not fit", and that value is as visible as the others. Without it, the first unanticipated case is forced into the nearest wrong category.**

### U1.2.45.1 — What a missing escape value causes
A closed vocabulary meets a case its author did not foresee. Something must be recorded. The recorder chooses the closest fit — and **the record now says something false, with the authority of a controlled value.**

The consequence is worse than a free-text field, because a constrained value is trusted and aggregated. **Every count that includes it is wrong, and nothing indicates so.**

### U1.2.45.2 — Requirements of the escape value
| | |
|---|---|
| **Explicitly named** | `UNKNOWN`, `UNMAPPED`, `OTHER` — never a blank or a default |
| **Retains the raw input** | Whatever did not fit is preserved verbatim alongside it |
| **Visible and counted** | It appears in every view and every total |
| **Reviewed on a cadence** | A rising count means the vocabulary is stale, which is a finding about the vocabulary rather than about the cases |

### U1.2.45.3 — The escape value is a measurement
**A vocabulary whose escape value is never used is either complete or never applied.** A vocabulary where it is common has been outgrown. **Both are only knowable if the value exists and is counted.**

### U1.2.45.4 — Classify by cause, not by symptom
A vocabulary describing *what was observed* forces every consumer to infer *what to do*. One describing **who must act and what they must do** carries the decision in the value itself.

**The test:** can a party read the value and know their next action without further investigation? If not, the vocabulary is recording symptoms.



---

## U1.2.46 — Prevention is the deliverable
`PROPOSED · REVIEWER-AUTHORED · see R00.25`

> **A unit of work that touches a defect and produces only a fix is incomplete. The deliverable is the mechanism; the fix is a precondition of it.**

`U1.2.40` establishes that an unenforced lesson is wasted. **This establishes when that obligation falls due: not eventually — at the close of the unit that produced it.**

### U1.2.46.1 — The unit of completion is the mechanism
A defect is not closed by its correction. **It is closed when its class cannot recur.**

| Produced | State |
|---|---|
| A fix | the instance is gone |
| A fix and a record | the instance is gone and findable |
| **A fix and a mechanism** | **the class is gone** |

Only the third is completion. The first two are progress, and calling either "done" is the accounting error that lets a system carry the same defect for years.

### U1.2.46.2 — Sweep the class in the same act
When one instance is found, **every instance of that class is found before the unit closes.** Not scheduled — found.

**A defect never arrives alone.** The same reasoning that produced it produced others, wherever the same conditions held. Fixing the reported one and stopping guarantees the rest are discovered one at a time, at full price each, across separate units of work.

> **"Fixed the one that was reported" is an incomplete report, not a complete fix.**

### U1.2.46.3 — Enforcement is named before the fix is written
The mechanism is identified at the point the defect is understood — **not after the correction, when attention has already moved to the next thing.**

**Naming it first changes the fix.** A defect whose prevention is known is often corrected differently: the shape that admits a mechanism is chosen over the shape that merely works.

**If no mechanism is possible, that is stated then**, with the reason — not discovered later as an absence.

### U1.2.46.4 — Debt is assigned to whoever can build it
Recording a debt against the party who cannot build it is not ownership. **It is a transfer of responsibility disguised as a record**, and it guarantees the debt survives.

**The test:** could the recorder build this? If yes, it is theirs. Only what genuinely requires another party's authority is assigned outward.

### U1.2.46.5 — The register must shrink
A debt register is a measurement, not a filing cabinet. **Its direction is the signal:**

| Trend | Means |
|---|---|
| Shrinking | Prevention is the default output |
| Flat | Fixes and debts arrive at the same rate — prevention is optional |
| **Growing, two units running** | **A finding about the process, not about the items** |

**The count is reported at the close of every unit that touched it.** A register whose size is never stated is not measured, and an unmeasured backlog only grows.

### U1.2.46.6 — What a unit may not close with
Where a defect was touched, the unit may not close with:

- *"Recorded"* alone — recorded is not prevented, and the two must be stated distinctly
- A mechanism that has never failed on a known-bad input (`U1.2.34.4`)
- A debt with no owner or no reason
- An unstated register count
- A class swept only where it was reported

### U1.2.46.7 — This obligation is itself at instruction level
Stated as a rule, this sits at T1 — the tier that fails. **It is honest debt until a gate on the path enforces it**, and it is recorded as such rather than assumed effective.

**It is the correct T1 rule to hold while that gate is built**, which is not the same as being sufficient.


---

## U1.2.47 — Discovery and closure are declared phases
`PROPOSED · REVIEWER-AUTHORED · see R00.26`

> **A sweep is finite. When it completes, discovery closes and closure begins — and findings arriving during closure are recorded, not pursued.**

`U1.2.46` requires sweeping the class in the same act. **Without a terminating condition that becomes an unbounded search**, because every sweep reveals adjacent classes and each is individually worth pursuing.

### U1.2.47.1 — The register's direction means opposite things in each phase
| Phase | Register grows | Register flat |
|---|---|---|
| **Discovery** | **Correct** — the sweep is finding what was always there | Suspicious — the sweep is not reaching |
| **Closure** | **Failure** — new pursuit is displacing completion | **Correct** |

**The same measurement, inverted.** Reading it without knowing the phase produces the wrong conclusion in both directions.

### U1.2.47.2 — The phase is declared, not inferred
A unit states which phase it is in **before it begins**. Undeclared, the parties disagree without noticing: one is measuring thoroughness, the other completion.

### U1.2.47.3 — Discovery terminates on a stated condition
Not on exhaustion — nothing exhausts. It ends when a **stated scope** has been swept:

> *"Every occurrence of pattern P across paths Q"* — a condition that can be met.

**A sweep with no stated scope cannot finish**, and its findings accumulate until attention runs out rather than until the work does.

### U1.2.47.4 — During closure, findings are recorded and parked
A defect found while closing is **recorded with its address and left alone.** Not fixed, not swept, not analysed.

**The exception, and only this one:** a finding that makes the current closure wrong. That is not a new discovery — it is information about the work in hand.

**Everything else waits for the next discovery phase.** A closure that pursues its own findings never closes.

### U1.2.47.5 — Closure is a batch, not a stream
Specified fixes are applied **together**, against a stated set, with one verification pass. Applying them one at a time re-opens the discovery temptation at every boundary.

### U1.2.47.6 — The trap this prevents
Discovery is more rewarding than closure. **Each finding is new information; each application is work already understood.** A party left to choose will discover indefinitely, produce a growing and increasingly accurate register, and change nothing.

> **A register that only grows is not a record of diligence. It is a record of work not done.**


---

## U1.2.48 — Premise verification and blast distance
`PROPOSED · REVIEWER-AUTHORED · see R00.27`

> **A premise costs in proportion to how far it travels before it is tested. It is therefore tested at its point of entry, never at its point of consequence.**

### U1.2.48.1 — The failure is not bad reasoning
Work built on an unverified premise is often **excellent work**. Each step follows correctly from the last, every review passes, and the quality is real.

**The output is still worthless**, and nothing in the chain can detect that — because every check verifies the step against its predecessor, and the predecessor is the premise.

> **A chain of correct inferences from a false premise produces confident, well-argued, wrong conclusions — and looks exactly like good work.**

### U1.2.48.2 — Blast distance
The cost of a false premise is not fixed. **It is the volume of work built on it before detection.**

| Detected at | Cost |
|---|---|
| Point of entry | a single query |
| One unit later | that unit's output |
| Several units later | every conclusion, plus every decision made between them |
| At execution | the above, plus whatever the execution damaged |

**Entry-point verification is not thoroughness. It is the only point at which the cost is bounded.**

### U1.2.48.3 — Premises about live state are verified against live state
Any statement about what a system currently contains — its structure, its data, its configuration — is verified **against the system**, not against any artifact describing it.

**The specific trap:** an artifact that *once* described the system accurately. It is not lying; it is stale, and staleness is invisible from inside it. The more accurate it was, the more trusted it becomes, and the longer the drift goes unmeasured.

### U1.2.48.4 — The first act of a dependent unit
A unit whose work rests on a premise **begins by testing that premise**. Not by reasoning from it.

> **"This is what I am assuming. Here is the check that confirms it. Here is the result."**

**Where the check is unavailable, the unit states that its output is conditional** — and every conclusion drawn carries that condition forward.

### U1.2.48.5 — Premises carry their source and their date
A recorded premise names **where it came from and when it was true**:

> *"`full_name` is `NOT NULL` — from `migrations.sql`, unverified against live"*
> — not — *"`full_name` is `NOT NULL`"*

**The second is a fact. The first is a citation.** Only the citation can be audited, and only the citation makes the risk visible to the next reader.

### U1.2.48.6 — Written is not applied
**A record of an intended change is not evidence the change occurred.** This is the most common form of the stale premise and the least suspected, because the record is authored by the same party who intended to apply it.

**The two are distinguished by an act performed at application time**, never by the record of intent. A record that cannot say whether it was applied is describing a plan, not a system.



---

## U1.2.49 — Unavoidable duplication requires reconciliation
`PROPOSED · REVIEWER-AUTHORED · see R00.28`

> **`U4.2.05` requires one authoritative store per concept. Some duplication cannot be removed. Where it cannot, a recurring reconciliation check is mandatory — and it is built at the moment the second representation is created, not when the disagreement is discovered.**

### U1.2.49.1 — Which duplication is unavoidable
| | Example shape | Why it persists |
|---|---|---|
| **A description of a live system** | a change record, a schema file, a diagram | The system changes independently of anything describing it |
| **A claim and its evidence** | *"this was applied"* versus the object existing | The claim is authored before the act |
| **A cache and its source** | a claim in a token, the record it was minted from | The copy is the point |
| **A derived flag and its condition** | a boolean, alongside the condition it summarises | The flag was added for convenience |
| **A declaration and its subject** | a comment, a name, a type annotation | Language separates them by construction |

**None of these can be eliminated. All of them drift.**

### U1.2.49.2 — Every unavoidable duplication has an authority and a check
Two obligations, and neither substitutes for the other:

| | |
|---|---|
| **Declare the authority** | Which representation is right when they differ. Undeclared, every consumer picks its own. |
| **Build the reconciliation** | A recurring check that reports disagreement. Without it, the authority is theoretical — nobody knows a disagreement exists. |

**Declaring the authority without building the check is the more common failure**, because declaring feels like resolving.

### U1.2.49.3 — The check is built when the second representation is created
Not when it drifts, not when the disagreement causes a defect. **At creation.**

**The reason:** the moment of creation is the only moment at which both representations are known to agree. That is the baseline, and it cannot be reconstructed afterwards — the same property as a measurement baseline (`U1.2.35.1`).

> **A second representation created without a reconciliation check is a divergence with an unknown start date.**

### U1.2.49.4 — Reconciliation runs on two triggers
| Trigger | Catches |
|---|---|
| **Change** — whenever either side is written | Divergence at the moment it is introduced |
| **Calendar** — on a stated cadence | Divergence introduced out of band, by a party or path the change trigger does not cover |

**Calendar alone is insufficient** — the out-of-band change is precisely the one no code path observed. **Change alone is insufficient** — it cannot see a change made outside the system.

### U1.2.49.5 — Disagreement is reported, never auto-resolved
A reconciliation check **reports**. It does not choose a winner and write it.

**Automatic resolution destroys the evidence of how the divergence arose**, which is the only thing that prevents the next one. And where the authority is genuinely uncertain, silent resolution makes a decision nobody ratified.

### U1.2.49.6 — A reconciliation that has never disagreed is unverified
Same rule as any mechanism (`U1.2.34.4`). **Introduce a deliberate disagreement, confirm the check reports it, remove it.**

A reconciliation check that has only ever agreed is indistinguishable from one comparing a thing to itself.

---

## Not in this pass

`.1` State · `.3` Findings · `.4` Mechanisms · `.5` Sequence · `.6` Verification — deferred to Co2+, entered by dependency.
