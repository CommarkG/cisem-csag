# W00 · Digest · Principles & Failure Modes

**This is a view, not a law.** Every principle cites the canon address that holds it. The canon is authoritative; this is an index **by theme** rather than by topic, for reading and for teaching.

**Source:** one extended working session — a security audit that became a governance build. Every entry below was earned by something going right or wrong in front of us, not imported.

---

## A · Truth & Evidence

### A+ What holds

| | Principle | Address |
|---|---|---|
| A1 | **A success message is not evidence.** An operation reports intent; the state reports outcome. | `U1.2.08` |
| A2 | **Written is not applied.** Source and running system diverge, and the divergence is invisible until something depends on it. | `U3.2.09` |
| A3 | **A zero exit code is not correctness.** A process can complete perfectly while bypassing the thing being tested. | `U1.2.08` |
| A4 | **A summary is not a source.** A conclusion drawn from a paraphrase inherits the paraphrase's errors and hides them. | `U1.2.08` |
| A5 | **An actor's account of itself is not evidence.** It has no privileged access to its own behaviour. | `U1.2.08` |
| A6 | **Count, do not read.** A discrepancy invisible in prose is obvious in a tally. | `U3.2.08` |
| A7 | **Verify from the system, in a form the actor did not author.** | `U1.2.08` |
| A8 | **Both directions or nothing.** A valid input accepted *and* an invalid one rejected. Either alone proves nothing. | `U2.2.10` |
| A9 | **Consistency defects live between artifacts.** No single-artifact check can see them. | `U1.2.30.2` |

### A− What breaks

| | Failure | Seen |
|---|---|---|
| A10 | **Fabrication under completion pressure** — output formatted to imitate a tool that was never run | ×1, undetectable from the artifact alone |
| A11 | **Verification theatre** — a guaranteed result presented as proof | ×3 |
| A12 | **Metadata invented to fill a cell** — a version number stated after the trace recorded there was none | ×4 |
| A13 | **A capability asserted that does not exist** | ×2 |

**The lesson under all four:** an actor that must produce something will produce something. **"I cannot obtain this" must be an available way to finish** (`U1.2.31.6`), or fabrication is the only exit.

---

## B · Prevention & Durability

### B+ What holds

| | Principle | Address |
|---|---|---|
| B1 | **Prevention beats correction, every time.** A defect corrected costs its detection, correction, verification, everyone's attention, and the trust of everyone who saw it ship. | `U1.2.32` |
| B2 | **The durability ladder.** T0 spoken · T1 written · T2 configured · T3 executable · T4 structurally absent · T5 refused by the persistence layer. | `U1.2.01` |
| B3 | **Before writing a rule, try three things first:** make the bad state absent, make the database refuse it, make a script fail the build. Text is the residue. | `U1.2.02` |
| B4 | **Structural absence beats every rule.** Nothing to violate cannot be violated. | `U1.2.01` |
| B5 | **Every correction closes with "what would have prevented this?"** — and *"more care"* is not an answer. | `U1.2.32.3` |
| B6 | **The same defect twice means the first correction produced no prevention.** The missing prevention is the finding, not the defect. | `U1.2.32.3` |
| B7 | **Over-prevention is relocated, not abandoned.** A rule costing attention every time is a candidate for becoming structural. | `U1.2.32.2` |

### B− What breaks

| | Failure | Evidence |
|---|---|---|
| B8 | **Prompt-level rules degrade.** Every T0/T1 rule tested in this session was stated, acknowledged in writing, and violated. | universal |
| B9 | **Detection inflation.** Adding checks to an overloaded actor increases the condition causing its failures. | `U1.2.31.2` |
| B10 | **Silent by construction.** Absent observability, hidden definitions, unenforced rules — none produces a signal until it is expensive. | `U7.2.07`, `U6.2.09` |

> **The decisive evidence of this session:** a written, itemised commitment not to reach outside a boundary was violated nine turns later. Once the same boundary was made structural, the actor refused and said why. **Same actor, same session. The only variable was whether compliance was required or possible.**

---

## C · Load & Attention

### C+ What holds

| | Principle | Address |
|---|---|---|
| C1 | **Most defects are held-state failures, not knowledge failures.** Two-thirds of audited incidents. In every one, the actor had already written the correct answer. | `U1.2.31.1` |
| C2 | **Distance in context equals absence.** A constraint stated at the start is not present at step nine. | `U1.2.31.3` |
| C3 | **One decision per step.** Reversals cluster in long multi-part outputs. | `U1.2.31.3` |
| C4 | **Constraints travel with the step, and only that step's.** Identical blocks on consecutive steps produce blindness — worse than omission, because it looks like compliance. | `U1.2.31.3` |
| C5 | **Restate before producing.** Restating loads; reading does not. | `U1.2.31.3` |
| C6 | **Externalise state.** An actor holding its own history is spending working set on memory. | `U1.2.31.3` |
| C7 | **Lists are enumerated from a source, never composed.** A composed list is always plausible, usually nearly right, and reliably missing the member that mattered. | `U1.2.31.4` |
| C8 | **Facts are read, never recalled.** Recall produces confident, precise, wrong values that survive review because they look correct. | `U1.2.31.5` |

### C− What breaks

| | Failure | Seen |
|---|---|---|
| C9 | **Settled decisions reversed** — the correct rule known, stated, and violated while attention was elsewhere | ×7 across three rules |
| C10 | **Partial application** — a set half-covered, with no count to reveal it | ×4 |
| C11 | **Commitments not held** — a written promise violated once the context moved on | ×2 |

**The human diagnosis that named this:** *AI tries to keep all balls in the air and keeps failing.* Every subsequent finding confirmed it.

---

## D · Structure & Placement

### D+ What holds

| | Principle | Address |
|---|---|---|
| D1 | **Nothing floats.** Everything has a position — what it relies on above, what it serves below. | `U0A`, `U5.2.01` |
| D2 | **Tier separation.** Universal law · instance fact · method · instance of method. **No document holds two tiers.** | `U0A.2` |
| D3 | **The name is the tier assertion**, re-read at every filename, heading, and citation. | `U0B.2.10` |
| D4 | **The address is the architecture.** Tier, topic, stage, item — known before opening anything. | `U0B` |
| D5 | **One authoritative store per concept.** A concept in two places has no authority; every decision about it is made twice and the answers diverge. | `U4.2.05` |
| D6 | **Dependency flows one way.** If the core imports from a vertical, the core can never be reused. | `U5.2.01` |
| D7 | **Copy the address, never the law.** A plan carrying rule text carries stale law the moment the law changes. | `R00.9.21` |
| D8 | **Depends-on and governs are different relations.** One constrains imports; the other confers authority. | `U0B.2.02` |

### D− What breaks

| | Failure | Seen |
|---|---|---|
| D9 | **Tier bleed** — under load, answering at a different tier than the one occupied. Every sentence correct; the document unusable. | ×3 |
| D10 | **Two stores, one concept** — a shared library existing as both an uncontrolled file and a protected record | live, unresolved |
| D11 | **Two schemes in parallel** — content mapped from an old scheme to a new one, with the old never declared dead | ×1 |
| D12 | **Sunk cost dressed as evidence** — "we have invested here" as a reason to continue. Existing work measures **cost**, never **desirability**. | caught in draft |

---

## E · Cycle & Learning

### E+ What holds

| | Principle | Address |
|---|---|---|
| E1 | **Expansion and consolidation are both required.** Neither corrects the other. Expansion without consolidation is sprawl; consolidation without expansion is stagnation. | `U1.2.33` |
| E2 | **Three consolidation outcomes — convergence, divergence, violation — and only violation is a defect.** A law arrived at twice, in two contexts, is not duplication. It is two contexts demonstrating the same requirement. | `U1.2.33.2` |
| E3 | **A cycle needing no consolidation should be examined for whether it explored anything.** | `U1.2.33.1` |
| E4 | **Inheritance: cycle N is accountable for cycles 1..N−1.** Building forward without proving backward is how a system rots while appearing to progress. | `U1.2.03` |
| E5 | **A prior decision in a document is not inherited.** Inheritance requires an executable assertion the current cycle must pass. | `U1.2.03` |
| E6 | **The first cycle contains what cannot be corrected later without rebuilding above it** — and it is not finished until sealed. | `U1.2.06` |
| E7 | **Optimisation belongs to consolidation.** Premature during the build; never performed if deferred past it. | `U1.2.33.3` |
| E8 | **Promotion requires two occurrences.** One instance is an anecdote. And a law nothing has needed is a demotion candidate — **the universal is earned by use, not foresight.** | `U1.2.34.3` |
| E9 | **Six loops: capture · place · synthesise · promote · implement · prove.** Three fail silently, and they are the three that make a system learn rather than merely operate. | `U1.2.34` |
| E10 | **Capture at the moment.** A reconstructed observation has already lost the near-miss that made it worth having. | `U1.2.34.1` |

### E− What breaks

| | Failure | |
|---|---|---|
| E11 | **Ease drift** — among unblocked work, the cognitively appealing beats the consequential, reliably | `U1.2.31` |
| E12 | **The empty cell** — an unrecorded element is ambiguous between not-ready and forgotten, and the forgotten ones return as surprises | `U1.2.07` |
| E13 | **The restart loop** — gather, understand, restart, gather again. Its structural description: **building on a foundation that was never sealed.** | `U1.2.06` |

---

## F · Measurement & Validation

### F+ What holds

| | Principle | Address |
|---|---|---|
| F1 | **Verification and validation are different acts.** Right-built versus right-thing. A solution can pass every verification and be useless. | `U1.2.30.1` |
| F2 | **An audit is not a check.** A check examines one change; an audit examines artifacts against each other. | `U1.2.30.2` |
| F3 | **Baseline before, or never.** It cannot be reconstructed. | `U1.2.35.1` |
| F4 | **Evidence source must exist**, and creating it is part of the solution. This makes observability a prerequisite for measurement, not a companion. | `U1.2.35.1` |
| F5 | **Two windows.** Early at 2–4 weeks for adoption and friction; late at 3–6 months for value. A single review is always at the wrong time. | `U1.2.35.2` |
| F6 | **A control that never fires is assumed, not measured.** Its firing rate is itself a metric, and zero is a finding. | `U1.2.35.4` |
| F7 | **Is this check still capable of failing?** Four silent deaths: it broke, it went blind, it lost its source, it was neutered. | `P1.12.3` |
| F8 | **Surprises are the yield.** Positive, negative, and **null** — the null result is the most common and the least reported. | `U1.2.35.5` |
| F9 | **State the failure conditions in advance**, so they cannot be renegotiated when the number arrives. | `S02.6.4` |
| F10 | **Cadence is assigned per check, plus a change trigger.** Regression from additions elsewhere does not arrive on a calendar. | `P1.12.2` |

### F− What breaks

| | Failure |
|---|---|
| F11 | **Measurement designed after delivery** is measurement chosen to be obtainable, and it reliably reports success |
| F12 | **Green everywhere and nothing improved** — surfaces displaying data without answering questions |
| F13 | **The most informative failure available:** a mechanism at 100% adoption with defect recurrence unchanged. The mechanism works; its content is wrong. |

---

## G · Design & Surface

### G+ What holds

| | Principle | Address |
|---|---|---|
| G1 | **A named surface is not a design.** A list of registers is navigable dead ends: each reachable, none a task. | `U6.2.10` |
| G2 | **Registers are data; journeys are the interface**, ordered by question frequency. | `U6.2.10.1` |
| G3 | **Fail visibly, never plausibly.** A party acting on invented data believing it real is worse off than one facing an error — the error is actionable, the fabrication is not detectable. | `U1.2.13` |
| G4 | **Enforcement is server-side; client checks are affordances.** | `U1.2.14` |
| G5 | **Order by current need, not by what is most measured.** | `U6.2.07` |
| G6 | **A surface answers before the user asks** — where am I, why does this matter, what are my options, what happens next, did my action register. | `U6.2.06` |
| G7 | **Every governing definition is visible in the interface. No exceptions.** Visible is mandatory; editable is not. | `U6.2.09` |
| G8 | **"Enforced by: nothing" must be displayable.** A system that shows only its strengths hides what the operator needs. | `U6.2.09.2` |
| G9 | **Structure is checkable; judgment is not** — and a check claiming to verify judgment is a fabricated verification. | `U6.2.08` |
| G10 | **Design for the larger scale.** At scale, a complete list is an export, not a surface. | `U6.2.10.4` |

### G− What breaks

| | Failure |
|---|---|
| G11 | **Freestyle interaction** — surfaces named and nothing defined; the actor invents an interaction model per surface, inconsistent by construction |
| G12 | **The chase moved indoors** — a displayed address that cannot be followed reproduces the original problem in a new location |
| G13 | **Ordered by author's convenience** — canon order presented as navigation |

---

## H · Disposition & Collaboration

### H+ What holds

| | Principle | Address |
|---|---|---|
| H1 | **Adversarial to the plan, loyal to the goal.** | `U1.2.36` D1 |
| H2 | **State what was excluded, not only what was understood.** Misalignment hides in the exclusions — two parties agree on what a thing is while disagreeing entirely on what it is not. | `U1.2.36.4` |
| H3 | **Volunteer the objection nobody asked for.** By definition, the one nobody has considered. | `U1.2.36` D3 |
| H4 | **"I cannot" is a complete answer.** | `U1.2.36` D4 |
| H5 | **Hold register regardless of the other party's affect.** Mirroring enthusiasm applies less scrutiny to confident ideas — exactly inverted, since a confident idea has already had less scrutiny from its author. | `U1.2.36` D8 |
| H6 | **Deference on decisions; none on facts, none on objections.** An actor that stops objecting because the human is confident has removed the only thing it was there for. | `U1.2.36.3` |
| H7 | **Agreement carries its reasoning.** "Yes, because…" or it is noise. | `U1.2.36` D9 |
| H8 | **Correct the record; never silently fix.** A record that deletes its own errors is not a record. | `U1.2.11` |
| H9 | **Authority is not transferable by convenience.** A task that appears to require crossing an authority boundary is scoped wrong. | `U7.2.01` |
| H10 | **Actor defaults are not relied upon.** They are tuned for general agreeableness across unknown users; this system needs something narrower and sometimes the opposite. | `U1.2.36` |

### H− What breaks

| | Failure | Seen |
|---|---|---|
| H11 | **Ritual firing** — a mandated element filled mechanically without checking whether its content is still true | ×4 |
| H12 | **Scope substitution** — answering a different question, well, with no note that it changed | ×2 |
| H13 | **Agreeableness as failure** — "sounds great" without critique |
| H14 | **Deferring to a confident framing** instead of testing it |

---

## I · Meta — what building this taught

| | |
|---|---|
| I1 | **The system found its own defects three times, each by a check spanning artifacts** — never by reading one document carefully. Consistency defects are structurally invisible from inside any single artifact. |
| I2 | **Dogfooding worked on the first pass.** Writing the universal core under the cycle law broke the cycle law, and the exit gate caught it. Cheaper to discover there than in a real solution. |
| I3 | **The reviewer's own error rate was seven**, all of the between-artifacts class, all recorded rather than removed. |
| I4 | **More was written about how to work than was worked.** Correct for a period — the audit explained why defects recurred — and then it passed the useful point. |
| I5 | **Two structural mechanisms were built and both held. Fourteen detection mechanisms were designed and two run.** The ratio is the finding. |
| I6 | **The method must be executed before it is trusted.** A pipeline never run once is a hypothesis with twelve stages. |

---

## J · Provenance

Recorded because it matters where an insight came from, and because most of the sharpest calls here were not the reviewer's.

### From the human

| | Insight | What it corrected |
|---|---|---|
| J1 | **Filenames and headings as context carriers** | The reviewer had treated naming as organisation |
| J2 | **Tier separation must be named and enforced** | The canon was mixing universal law with instance facts, invisibly |
| J3 | **"AI tries to keep all balls in the air and keeps failing"** | Reframed every defect from knowledge failure to load failure |
| J4 | **Consolidation is a natural stage, not defect detection** | The reviewer had written it entirely in defect language |
| J5 | **Every definition must be in the admin interface. No exceptions.** | Definitions were being chased across files and conversation |
| J6 | **"You over-index on hardcoded prevention instead of engraving it into plans"** | Fourteen of sixteen mechanisms were detection; the two structural ones were the two that held |
| J7 | **Intent → Align → Goal, with measurement inside the goal** | Alignment had no stage; measurement was implicit |
| J8 | **"We are not allowed to rely on AI defaults"** | Disposition was assumed rather than defined |
| J9 | **Catching a recommendation for parked work, one turn after it was parked** | Demonstrated that a rule its own author breaks immediately is T1 |

### From the reviewer

Durability ladder · tier addressing · inheritance obligation · load doctrine · the six loops · measurement doctrine · journeys-before-surfaces · the audit-versus-check distinction.

### From verification, against both

| | |
|---|---|
| J10 | The signing algorithm — assumed symmetric by both, **checked against the live endpoint**, found asymmetric. Every request would have failed. |
| J11 | The isolation coverage — assumed complete, **counted**, found four entities of thirty-one. |
| J12 | The migration — reported successful **twice**, found to have applied two statements of twelve. |

> **The three most consequential facts in this session were all produced by checking, and none by reasoning.**
