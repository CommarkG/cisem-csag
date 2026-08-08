# Corespine — Complete Definition and Population Standard

**Status: BRAIN DRAFT — RAW-EXTERNAL. Not CISEM state.**
No ID assigned. No truth-bearing field written. Produced by Brain (Claude.ai), 2026-08-07.
Requires CISEM Existing-First verification at repo level, then Governor ratification.

**One of five.** Corespine · Overlay · Protocol · Wizard · Pipeline. Each is standalone; all five
share one skeleton so they can be validated against each other.

**Revision 3 — 2026-08-07 (changes visible, not silent).** Rebuilt as a standalone document.
Added: background, problem statement, confusion guards, the complete element inventory (§9), and
the three AI instruction layers (§10). Retained from Revision 2: the "runs through" formulation,
the standing-vs-firing discriminator, and the flow-position naming dispute. Nothing removed.

---

## 1. Background — why this concept exists

Every governed system eventually faces the same question: *when I create a new thing, what rules
automatically apply to it, and how does it find out?*

The naive answer is a folder structure. Things go in folders; the folder name says what they are.
This works until the first time a rule needs to apply to everything in a folder — at which point
you discover a folder has no way to enforce anything. It is an address, not a law.

The corespine is the answer to that. It is not where an element lives; it is what an element
inherits by virtue of belonging to a particular line of purpose.

## 2. The problem it solves

Without corespines, four failures are guaranteed:

**Orphan elements.** Things get created with no governing law, because nothing forced the question
"what does this inherit?"

**Rule duplication.** The same constraint gets restated in five places because there is no single
line carrying it. The five copies then drift.

**Silent exemption.** An element quietly does not obey a rule, and nothing detects it, because
membership was a label rather than a binding.

**Lost reasoning.** A rule survives but the need that created it does not, so nobody can judge
whether it still applies. The line's purpose is the thing that makes its rules interpretable.

## 3. The solution — the definition

> A corespine is a **lineage of purpose**. It answers *why an element exists and whose line it
> belongs to* — where it came from, what need created it, and what it owes to everything that
> comes after it in the same line.
>
> Every descendant inherits the complete binding context of its line, and must **actively load and
> apply** it when planning, executing and verifying. Inheritance is an obligation, not a label.
>
> Every element belongs to exactly one lineage, or it does not belong in the system.

**The one-line form:** a corespine is the inheritance line of a single topic — the accumulated
rules, decisions and constraints that everything in that topic inherits and cannot opt out of.

**The sharpest formulation:** *it doesn't contain things — it runs through them.*

### The four defining properties

**Lineage-bound.** One topic, one spine. Two spines for one topic is a fork, and a fork destroys
the property that makes a lineage useful: an element can no longer determine what it inherits.

**Cumulative and monotonic.** It only accumulates. Later never resets earlier. This is why it is a
*spine* and not a *list* — a list can be reordered; a spine grows in one direction and carries
everything below it.

**Binding.** Membership is not labelling. The accumulated law applies whether an element references
it or not. No opt-out, no silent exemption.

**Obligated usage.** *Nothing stands alone, and nothing acts alone.* A descendant must actively
load and apply its inherited context during planning, execution and verification — and must be able
to produce evidence that it did. This converts inheritance from a claim into something checkable.

---

## 4. A corespine is NOT

- **Not a folder or directory.** A folder holds; a corespine passes down.
- **Not a category.** A category tells you what something *is*; a corespine tells you what it
  *inherits*.
- **Not a container.** Elements are not inside it. They use it.
- **Not a visual grouping or page section.** Presentation is not lineage.
- **Not a feature area.** Features cluster by user value; lineages cluster by inherited law.
- **Not a team or ownership boundary.** Who maintains something is not what governs it.
- **Not a tag.** Tags describe; corespines bind.
- **Not optional for its members.** There is no partial membership.

---

## 5. Confusion guards

**Beware not to confuse a corespine with an OVERLAY**, which is a binding concern that applies
*across* every lineage rather than forming one. Both bind, both are always on, both are monotonic.
The discriminator: a corespine binds *within* one line; an overlay binds *across all* lines.
Security is not a lineage — an element does not inherit its rules from *being secure*; it inherits
security constraints on top of whatever line it actually belongs to.

**Beware not to confuse a corespine with a PROTOCOL**, which is a step-by-step procedure for one
operation. Both have gates, so "it has gates" separates nothing. The discriminator is **standing vs
firing**: a corespine is always on and nothing invokes it; a protocol fires, runs, and finishes.
Ask *"when did it run?"* — if you get an answer, it is a protocol.

**Beware not to confuse a corespine with a CATEGORY.** This is the most common failure and it has
one test: remove the corespine and ask what its elements lose. Only an address → category. Their
rules → corespine.

**Beware not to confuse a corespine with a MEETING POINT.** Marketing looks like a subject area the
way Frontend does, but a marketing page inherits from Frontend, a marketing message from
Communication, a marketing claim from Validation. Where several lineages converge is not itself a
lineage.

---

## 6. The other four — short definitions and relationships

| Concept | Short definition | Relationship to a corespine |
|---|---|---|
| **Overlay** | a binding concern applying across every lineage — invariant core plus per-lineage scope profiles; may tighten, never loosen | attaches to a corespine through a scope profile; adds requirements to its law but can never relax it |
| **Protocol** | a step-by-step procedure for one specific operation; fires, runs, finishes | declares exactly one governing corespine and runs inside its accumulated law |
| **Wizard** | a protocol made runnable where judgment is gathered in flight | usually the place where a new element's corespine membership is first declared |
| **Pipeline** | a protocol made runnable where no judgment is needed | runs inside the same law; automation creates no exemption |

**The frame:** two standing structures (corespine, overlay), one procedure (protocol), two run
modes (wizard, pipeline).

---

## 7. Qualification test — should this be a corespine?

Apply in order. All must hold.

1. **Remove test.** Remove it — do its elements lose only an address, or their rules? Address →
   reject.
2. **Lineage test.** Can you state where its elements come from, what need created them, and what
   they owe forward? "Same subject" is not a lineage.
3. **Inheritance-source test.** Do elements inherit binding law *from being this thing*, or from
   elsewhere while carrying this word as a label?
4. **Fork test.** One lineage, or a place where several meet?
5. **Cross-cutting test.** Binds within one line, or across all of them? Across → overlay.

**Refusal-first:** the default answer is *no*. A candidate must earn a corespine, not be assigned
one by default.

---

## 8. The second axis — and a naming dispute

A corespine answers *why and whose*. A second, orthogonal axis answers *what happens and in what
order*. Both are mandatory:

- Knows its flow position but not its corespine → **structurally incomplete**
- Knows its corespine but not its flow position → **ungoverned at execution**

The name of that second axis is disputed, because "pipeline" is currently carrying two different
concepts. See the Pipeline document §2. This document uses **flow-position** provisionally.

---

## 9. Element inventory — the complete field list

Every corespine carries these. `AUTHORITY` = only the Governor or a ratification act may write it;
an AI populating a corespine leaves it empty.

### Block A — Identity

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| A1 | **Name** | the registered lineage name | unregistered names collide and fork the line |
| A2 | **ID** `AUTHORITY` | the assigned identifier | self-assigned IDs create phantom state |
| A3 | **Status** `AUTHORITY` | where it sits on the ratification path | a self-declared status is a lie the system then acts on |
| A4 | **Wiring state** | declared / connected / live | "done" claimed on a line nothing actually enforces |
| A5 | **Depth level** | position in the existing depth vocabulary | forks the depth scheme if a new one is invented |
| A6 | **Parent / position in schema** | where this line sits relative to others | a floating lineage governs nothing reliably |

### Block B — Purpose (the lineage itself)

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| B1 | **Goal** | the target, stated as DO first then DON'T | a "why" written where a target belongs makes the line un-testable |
| B2 | **Origin — the need that created this line** | makes the rules interpretable later | rules survive, reasoning dies, nobody can judge relevance |
| B3 | **Forward obligation** | what this line owes its descendants | inheritance becomes one-directional and hollow |
| B4 | **North-star service** | how this goal serves the platform goal | sub-goals drift from the apex |

### Block C — Boundary

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| C1 | **Scope — what belongs** | membership criteria in positive form | ambiguous membership means ambiguous inheritance |
| C2 | **Scope — what explicitly does NOT belong** | the boundary, stated | lineages silently expand into each other |
| C3 | **Qualification evidence** | the §7 tests, answered | corespines get created by assertion |
| C4 | **Governed artifact classes** | what kinds of things inherit here | nothing can be mechanically checked for membership |

### Block D — The binding law

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| D1 | **Invariants** | the numbered bright-line rules descendants inherit | an unnumbered rule cannot be cited, tested, or enforced |
| D2 | **Vocabulary owned** | terms this line defines authoritatively | the same word means different things in different lines |
| D3 | **Inheritance contract** | what a descendant must load and apply, and when | obligated usage degrades into passive membership |
| D4 | **Evidence-of-load requirement** | what proves the context was actually applied | inheritance becomes an unverifiable claim |

### Block E — Connections

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| E1 | **Overlays attached** | which cross-cutting concerns apply, with scope-profile references | constraints apply invisibly or not at all |
| E2 | **Protocols governed** | which procedures run inside this line | procedures float outside any law |
| E3 | **Sibling boundaries** | the nearest lineages and where the line between them falls | boundary disputes recur every session |

### Block F — Integrity

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| F1 | **Rejected paths** | what was considered and deliberately not done, with reasons | rejected ideas return as new proposals forever |
| F2 | **Open questions** | what is genuinely unresolved | uncertainty gets smoothed into false confidence |
| F3 | **Provenance** | where this content came from and its verification state | inferred material gets treated as verified |
| F4 | **Change log** | what changed, when, why | silent structural change |

---

## 10. The three AI instruction layers

### 10.A — How to write the instruction

The instruction that tells an AI to create a corespine must itself obey these rules:

1. **Executable, not descriptive.** Every clause is a step an operator can perform. If a clause
   cannot be checked as done-or-not-done, it is prose and must be rewritten.
2. **Refusal-first.** State the default outcome as *do not create*. The instruction's job is to
   make the AI find reasons this should not be a corespine, and only proceed if none survive.
3. **Per-element acceptance and rejection criteria.** For each element in §9, state what a good
   value looks like *and* what a bad one looks like. Acceptance criteria alone produce
   plausible-looking filler.
4. **One worked example and one counter-example per element.** The counter-example does more work
   than the example — it is what stops the AI generating something that reads correct and is empty.
5. **Name the authority boundary explicitly.** List which elements the AI may never write, and say
   why. Do not rely on the AI inferring it.
6. **Forbid inference-as-population.** State: any element the AI cannot source must be marked
   MISSING with the reason. Never inferred, never plausibly filled.
7. **Require certainty marking.** Every populated value carries confirmed / inferred / assumed.
8. **State the stop conditions.** What makes the AI halt and ask rather than continue.
9. **Declare what the instruction does NOT cover**, so it does not silently absorb neighbouring
   procedures.

### 10.B — How to build the template

1. **Every slot present and empty.** A template with optional slots omitted teaches the operator
   that omission is normal. Present-and-empty is visible; absent is not.
2. **Inline guidance in each slot** — one line saying what goes here and one saying what does not.
   Guidance lives with the slot, not in a separate document nobody opens.
3. **Type every slot** — free text, enum, reference, list, boolean. Untyped slots receive whatever
   shape the operator felt like.
4. **Order slots by dependency, not by importance.** Goal before scope; scope before invariants;
   invariants before connections. An operator filling out of order produces internally inconsistent
   documents.
5. **Mark mandatory vs optional per slot**, and require a stated reason code for any empty
   mandatory slot. Silent "N/A" is how templates rot.
6. **Mark AUTHORITY slots visually** so an AI cannot fill them by momentum.
7. **Carry the validation checklist at the bottom of the template itself** — the checks that must
   pass before the document is submitted. A checklist stored elsewhere is a checklist not run.
8. **Include a worked reference instance**, complete, alongside the blank. Operators copy patterns;
   give them the right one.

### 10.C — How to populate

**Order of operations — do not deviate:**

1. **Existing-First.** Before writing anything, establish whether this lineage already exists under
   another name. Search the concept and its known aliases. Report *not found under checked aliases*
   — never *confirmed absent*.
2. **Goal (B1).** Through dialogue, not drafting-on-behalf. Do not proceed until it is defined and
   saved. This is the step where most of the value is created and it is the step most often rushed.
3. **Origin and forward obligation (B2, B3).** These make B1 interpretable.
4. **Qualification (C3).** Run the §7 tests and record the answers. If any fails, **stop and
   report** — do not proceed to populate a corespine that did not qualify.
5. **Boundary (C1, C2, C4).**
6. **Law (D1–D4).** Invariants numbered; vocabulary declared; inheritance contract explicit.
7. **Connections (E1–E3).**
8. **Integrity (F1–F4).**
9. **Identity (A1, A4–A6).** Leave A2 and A3 empty — authority writes those.

**Rules that apply to every element:**

- One source per value, stated. Never a paraphrase of a source — the source itself.
- Certainty marked: confirmed / inferred / assumed.
- Unknown → MISSING with a reason. Never a plausible guess.
- Never populate an AUTHORITY element.
- If populating reveals the candidate should not exist, say so and stop. Producing a well-formed
  document for something that should not be created is worse than producing nothing.

---

## 11. Worked examples

**Qualifies —** Creation (every artifact passed through it and inherits its gates); Validation
(what counts as proof; every truth-claim inherits it); Authority (what makes a decision binding);
Frontend (every surface inherits the same invariants and integrity laws — instructive because it is
a *domain* and still qualifies).

**Fails —** Marketing (a meeting point of three lineages; strip the word and nothing loses a rule).
Priority (binds across all lines → overlay). UX/UI (converges into Frontend; creating it would
fork an existing lineage). Security, Privacy, Observability, Accessibility (all cross-cutting →
overlays, though one may carry a dual facet).

---

## 12. Open questions

1. **The structural-tree model.** External material proposes a fixed ladder (Core → Pillars →
   Trunks → Branches → Leaves). It conflicts with the ratified position that a corespine is
   inheritance infrastructure rather than a container tree, implies a single apex where corespines
   are peers, and forks the existing depth vocabulary. **Not absorbed.** Needs an explicit decision.
2. **Recursive Completeness / Child Set Rule / the 5-step deepening sequence.** Deepening protocol,
   not definition. Needs Existing-First and its own home. Worth carrying regardless: *a deeper cycle
   cannot fix an unstable parent.*
3. **Epistemology** — overlay, Validation's real name, or its parent? Unresolved.
4. **Three inherited definition issues** — the root corespine violating its own recurrence
   criterion; one corespine ambiguously classified corespine-vs-gate; a root self-reference resolved
   by decree rather than schema logic.
5. **Marketing's classification** — fails both tests; needs a home or an explicit ruling.
6. **Sealing.** Not sealed. Earns sealing only after divergent trials stop surfacing edges.

---

## 13. Provenance and verification status

Merged from Brain's working session (2026-08-07), Governor-supplied external material, and a CISEM
(Sonnet) cross-check. The external material shows non-CISEM identifier formats and vocabulary — it
is input, not evidence. Status marks and examples are **inferred** from a project-knowledge snapshot
predating the current architecture range; not verified against the live repo. **Nothing here is
CISEM state.**
