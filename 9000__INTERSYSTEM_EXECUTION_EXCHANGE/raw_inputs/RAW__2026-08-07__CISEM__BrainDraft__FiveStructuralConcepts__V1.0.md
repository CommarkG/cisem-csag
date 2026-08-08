# The Five Structural Concepts — Complete Definition and Population Standard

**Corespine · Overlay · Protocol · Wizard · Pipeline**

**Status: BRAIN DRAFT — RAW-EXTERNAL. Not CISEM state.**
No ID assigned. No truth-bearing field written. Produced by Brain (Claude.ai), 2026-08-07.
Requires CISEM Existing-First verification at repo level, then Governor ratification.

**Supersession (changes visible, not silent).** This document **supersedes and replaces** the five
separate files `BRAIN-DRAFT_{Corespine|Overlay|Protocol|Wizard|Pipeline}-Definition_2026-08-07.md`.
Nothing was dropped in the merge. Three things changed:

1. The three AI instruction layers and the document skeleton were stated **five times**; they are
   now stated **once** (Part II), with each concept declaring only its **deviations**. This removes
   real duplication — five copies of one rule set is five drift paths.
2. Cross-concept material that had no home — the confusion matrix, the halt-condition table, the
   side-by-side inventory comparison — now exists (Part IV). It could not exist in five separate
   documents without duplicating into all five.
3. Each concept section remains readable alone, carrying its own background, problem, definition,
   is-NOT list, confusion guards, and inventory.

---

## How to read this

| If you want | Read |
|---|---|
| The map — five concepts, how they relate | Part I |
| The rules that apply to writing, templating and populating **any** of them | Part II |
| One concept in full | Part III, its section |
| How two concepts differ, or which halt conditions exist | Part IV |
| What is unresolved, and what is blocking | Part V |

---

# PART I — THE FRAME

## I.1 Three tiers, five concepts, one question each

| Tier | Concept | The one question it answers |
|---|---|---|
| **Standing structure** — always on, never invoked | **Corespine** | *Why* does it exist, and *whose line* is it in? |
| | **Overlay** | *What constraints* apply to it, from every direction? |
| **Procedure** — fires, runs, finishes | **Protocol** | *How* is this one operation done? |
| **Run mode** — how a protocol executes | **Wizard** | The protocol run with judgment gathered **in flight** |
| | **Pipeline** | The protocol run with **no judgment needed** |

```
        STANDING STRUCTURE (always on)
        ┌──────────────┐   ┌──────────────┐
        │  CORESPINE   │   │   OVERLAY    │
        │  (lineage)   │   │(cross-cutting)│
        └──────┬───────┘   └──────┬───────┘
               │ governs          │ constrains
               └────────┬─────────┘
                        ▼
                 ┌─────────────┐
                 │  PROTOCOL   │   PROCEDURE (fires)
                 │ (the how)   │
                 └──────┬──────┘
                 ┌──────┴──────┐
                 ▼             ▼
            ┌─────────┐   ┌──────────┐
            │ WIZARD  │   │ PIPELINE │   RUN MODES
            │judgment │   │   no     │
            │in flight│   │ judgment │
            └─────────┘   └──────────┘
```

## I.2 The two discriminators that do all the work

**Standing vs firing** — separates tier 1 from tier 2.

> Ask *"when did it run?"* An answer means **protocol**. A meaningless question — because the thing
> never *not* applies — means **standing structure**.

This matters because corespines, overlays and protocols all constrain and all have gates, so
gate-presence separates nothing.

**Where judgment lives** — separates the two run modes.

> Ask *"is there a step whose input cannot be supplied before the run starts?"* Yes → **wizard**.
> No → **pipeline**.

The intuitive alternative — interactive vs automated — is the *symptom*, not the cause, and it has
a clean falsifier: **a model running a wizard with no human present is still running a wizard.**
The judgment axis survives that case; the interactive axis does not.

**Why this distinction pays for itself:** it tells you how to convert one mode into the other. You
turn a wizard into a pipeline by **removing judgment** — finding a rule that decides what previously
required a call. Not by removing the human. The interactive framing hides that lever entirely.

## I.3 Within vs across — separating the two standing structures

> A **corespine** binds *within* one lineage. An **overlay** binds *across all* lineages.

Test: *does an element inherit its rules from being this thing, or does this thing constrain it on
top of the line it already belongs to?* Security is the clearest case — nothing inherits its rules
from *being secure*; security constrains whatever line the element is actually in.

## I.4 The fourth axis — flow-position

Distinct from all five, and named here because it is routinely confused with pipeline:

- **Corespine** — lineage-directed: *why* it exists, *whose line*
- **Flow-position** — goal-directed: *what happens, in what order*

Both are mandatory:

- Knows its flow position but not its corespine → **structurally incomplete**
- Knows its corespine but not its flow position → **ungoverned at execution**

The name is disputed, because "pipeline" currently carries both this axis and the execution mode.
See III.E.2 — this is the one **blocking** open question in the whole set.

---

# PART II — UNIVERSAL STANDARDS

Everything here applies to **all five** concepts. Part III states only deviations.

## II.1 The document skeleton

Every concept document carries these sections, in this order:

1. Background — why the concept exists at all
2. Problem — what breaks without it
3. Definition — the solution, plus defining properties
4. Is NOT — the exclusion list
5. Confusion guards — *beware not to confuse X with Y, which is…*
6. The other four — short definitions and relationships
7. Qualification test — should this be one?
8. Element inventory — the complete field list
9. Instruction deviations — where it departs from Part II
10. Worked examples — qualifies and fails
11. Open questions
12. Provenance

The order is not stylistic. Background before definition means the definition is read as a
*solution to something*, which is what makes it interpretable in five years when the original need
is forgotten.

## II.2 The AUTHORITY boundary — applies to every concept

`AUTHORITY` marks an element only the Governor or a ratification act may write. **An AI populating
any of the five leaves every AUTHORITY element empty.** No exceptions, no inference, no "filling it
in provisionally."

Universally AUTHORITY: **ID**, **Status**. Plus, for pipelines only, **activation state** — see
III.E.9, the most consequential single field in the set.

Why this is stated once and hard: an AI that has just produced a complete, well-formed document is
in exactly the cognitive position where writing "Status: RATIFIED" feels like finishing rather than
usurping.

## II.3 Writing the instruction — the universal rules

An instruction telling an AI to create any of the five must:

1. **Be executable, not descriptive.** Every clause checkable as done-or-not-done. If a clause
   cannot be marked done, it is prose and must be rewritten. This applies with double force to
   instructions about procedure — one written as prose teaches the wrong shape by example.
2. **Be refusal-first.** State the default outcome as *do not create*. The AI's job is to find the
   reasons this should not exist and proceed only if none survive.
3. **State a halt condition, explicitly.** Every one of the five has a condition under which
   population must **stop and report** rather than continue. This is the load-bearing clause — not
   the field list. See the halt table at IV.3.
4. **Give per-element acceptance *and* rejection criteria.** Acceptance alone produces
   plausible-looking filler that satisfies the criteria and means nothing.
5. **Give one worked example and one counter-example per element.** The counter-example does the
   heavier work — it is what stops output that reads correct and is empty.
6. **Name the authority boundary explicitly.** List the elements the AI may never write. Do not
   rely on inference.
7. **Forbid inference-as-population.** Any element that cannot be sourced is marked `MISSING` with
   the reason. Never plausibly filled.
8. **Require certainty marking** on every populated value: confirmed / inferred / assumed.
9. **State the stop-and-ask conditions** — what makes the AI halt and ask rather than continue.
10. **Declare what the instruction does NOT cover**, so it does not silently absorb neighbours.

## II.4 Building the template — the universal rules

1. **Every slot present and empty.** A template omitting optional slots teaches that omission is
   normal. Present-and-empty is visible; absent is not.
2. **Inline guidance in each slot** — one line for what goes here, one for what does not. Guidance
   in a separate document is guidance nobody reads.
3. **Type every slot** — free text, enum, reference, list, boolean.
4. **Mark mandatory vs optional**, and require a stated reason code for any empty mandatory slot.
   Silent "N/A" is how templates rot.
5. **Repeatable sub-blocks, never free-form lists**, for anything that repeats (steps, scope
   profiles, invariants). A free-form list reliably drops the same two or three sub-elements every
   time — and those are always the ones carrying the value.
6. **Put each check adjacent to what it checks**, not in a summary section. Proximity is what makes
   a check actually happen. A gate flag next to its step gets set; a gate summary table at the
   bottom gets filled in from memory afterwards.
7. **Order slots by dependency, not importance.** Filling out of order produces internally
   inconsistent documents.
8. **Mark AUTHORITY slots visually** so momentum cannot fill them.
9. **Carry the validation checklist inside the template.** A checklist stored elsewhere is a
   checklist not run.
10. **Ship a complete worked reference instance alongside the blank.** Operators copy patterns;
    supply the right one.

## II.5 Populating — the universal order and rules

**Order of operations, common to all five:**

1. **Existing-First** — does this already exist under another name? Search the concept and its
   known aliases. Report *not found under checked aliases*, **never** *confirmed absent*. A
   near-match is an enhancement candidate, not a reason to create a sibling.
2. **Purpose** — goal, origin, what need created this.
3. **Qualification** — run the concept's test and record the answers. **If it fails, stop.**
   Producing a well-formed document for something that should not exist is worse than producing
   nothing.
4. **Boundary** — scope and explicit non-scope, written *before* substance. A boundary written
   afterwards describes what was produced instead of constraining it.
5. **Substance** — the concept-specific body.
6. **Connections** — what it attaches to.
7. **Integrity** — rejected paths, open questions, provenance, change log.
8. **Identity last**, with AUTHORITY elements left empty.

**Rules for every element, in every concept:**

- One stated source per value — **the source itself, never a paraphrase of it.**
- Certainty marked: confirmed / inferred / assumed.
- Unknown → `MISSING` with a reason. Never a plausible guess.
- Never populate an AUTHORITY element.
- If populating reveals a conflict with inherited law, **stop and report the conflict.** Do not
  write the violation and flag it afterwards.

---

# PART III — THE FIVE CONCEPTS

---

## III.A — CORESPINE

### A.1 Background
Every governed system eventually faces one question: *when I create a new thing, what rules
automatically apply to it, and how does it find out?* The naive answer is a folder structure — until
the first time a rule must apply to everything in a folder, at which point you discover a folder
enforces nothing. It is an address, not a law.

### A.2 The problem
Without corespines, four failures are guaranteed. **Orphan elements** — created with no governing
law, because nothing forced the question "what does this inherit?" **Rule duplication** — the same
constraint restated in five places, which then drift. **Silent exemption** — an element quietly does
not obey, and nothing detects it, because membership was a label. **Lost reasoning** — a rule
survives but the need that created it does not, so nobody can judge whether it still applies.

### A.3 The definition

> A corespine is a **lineage of purpose**. It answers *why an element exists and whose line it
> belongs to* — where it came from, what need created it, and what it owes to everything that comes
> after it in the same line.
>
> Every descendant inherits the complete binding context of its line, and must **actively load and
> apply** it when planning, executing and verifying. Inheritance is an obligation, not a label.
>
> Every element belongs to exactly one lineage, or it does not belong in the system.

**One-line form:** the inheritance line of a single topic — the accumulated rules, decisions and
constraints everything in that topic inherits and cannot opt out of.

**Sharpest formulation:** *it doesn't contain things — it runs through them.*

**Four defining properties.** *Lineage-bound* — one topic, one spine; a fork destroys the property
that makes a lineage useful. *Cumulative and monotonic* — later never resets earlier; this is why it
is a spine and not a list. *Binding* — the law applies whether an element references it or not.
*Obligated usage* — "nothing stands alone, and nothing acts alone"; a descendant must actively load
and apply inherited context, and produce evidence it did.

### A.4 A corespine is NOT
Not a folder (a folder holds; a corespine passes down) · not a category (a category says what
something *is*; a corespine says what it *inherits*) · not a container (elements are not inside it;
they use it) · not a visual grouping · not a feature area (features cluster by user value, lineages
by inherited law) · not a team or ownership boundary · not a tag (tags describe, corespines bind) ·
not optional for its members — there is no partial membership.

### A.5 Confusion guards

**Beware not to confuse a corespine with an OVERLAY**, which is a binding concern applying *across*
every lineage rather than forming one. Both bind, both are always on, both are monotonic. The
discriminator: within one line vs across all lines. Nothing inherits its rules from *being secure*.

**Beware not to confuse a corespine with a PROTOCOL**, which is a procedure for one operation. Both
have gates, so gate-presence separates nothing. Use standing-vs-firing. A corespine's gates fire
*within* protocols; the corespine itself never runs.

**Beware not to confuse a corespine with a CATEGORY.** One test: remove it and ask what its
elements lose. Only an address → category. Their rules → corespine.

**Beware not to confuse a corespine with a MEETING POINT.** Marketing looks like a subject area the
way Frontend does — but a marketing page inherits from Frontend, its message from Communication, its
claims from Validation. Where lineages converge is not itself a lineage.

### A.6 The other four
**Overlay** — a binding concern across every lineage; invariant core plus scope profiles; tightens,
never loosens. *Attaches to a corespine through a scope profile; may add to its law, never relax it.*
**Protocol** — a step-by-step procedure for one operation; fires, runs, finishes. *Declares exactly
one governing corespine and runs inside its accumulated law.*
**Wizard** — a protocol made runnable, judgment gathered in flight. *Usually where a new element's
corespine membership is first declared.*
**Pipeline** — a protocol made runnable, no judgment needed. *Runs inside the same law; automation
creates no exemption.*

### A.7 Qualification test
1. **Remove test** — do elements lose only an address, or their rules? Address → reject.
2. **Lineage test** — can you state origin, creating need, and forward obligation? "Same subject" is
   not a lineage.
3. **Inheritance-source test** — do elements inherit law *from being this thing*?
4. **Fork test** — one lineage, or a place where several meet?
5. **Cross-cutting test** — within one line, or across all? Across → overlay.

### A.8 Element inventory

**Block A — Identity.** A1 Name (registered lineage name — *unregistered names collide and fork the
line*) · A2 ID `AUTHORITY` · A3 Status `AUTHORITY` · A4 Wiring state (declared/connected/live —
*"done" claimed on a line nothing enforces*) · A5 Depth level (*inventing a new scheme forks the
existing one*) · A6 Parent / position in schema (*a floating lineage governs nothing reliably*).

**Block B — Purpose.** B1 Goal, DO first then DON'T (*a "why" written where a target belongs makes
the line untestable*) · B2 Origin — the need that created this line (*rules survive, reasoning dies,
nobody can judge relevance*) · B3 Forward obligation — what it owes descendants (*inheritance becomes
one-directional and hollow*) · B4 North-star service (*sub-goals drift from the apex*).

**Block C — Boundary.** C1 Scope, what belongs · C2 Scope, what explicitly does not (*lineages
silently expand into each other*) · C3 Qualification evidence — the A.7 tests, answered (*corespines
get created by assertion*) · C4 Governed artifact classes (*nothing can be mechanically checked for
membership*).

**Block D — The binding law.** D1 Invariants, numbered (*an unnumbered rule cannot be cited, tested
or enforced*) · D2 Vocabulary owned (*the same word means different things in different lines*) ·
D3 Inheritance contract — what a descendant must load and apply, and when (*obligated usage degrades
into passive membership*) · D4 Evidence-of-load requirement (*inheritance becomes unverifiable*).

**Block E — Connections.** E1 Overlays attached, with scope-profile references (*constraints apply
invisibly or not at all*) · E2 Protocols governed (*procedures float outside any law*) · E3 Sibling
boundaries — nearest lineages and where the line falls (*boundary disputes recur every session*).

**Block F — Integrity.** F1 Rejected paths (*rejected ideas return as new proposals forever*) ·
F2 Open questions · F3 Provenance · F4 Change log.

### A.9 Instruction deviations from Part II
- **Halt condition:** qualification test fails (A.7) → stop and report. Do not populate.
- **Instruction must force B1 through dialogue, not drafting-on-behalf.** The goal is the step where
  most of the value is created and the step most often rushed. The instruction states: do not
  proceed until the goal is defined and saved.
- **Template:** invariants as a repeatable numbered sub-block, never a prose paragraph.
- **Population:** B2 and B3 immediately after B1 — they are what make B1 interpretable later.

### A.10 Worked examples
**Qualifies** — Creation (every artifact passed through it and inherits its gates) · Validation
(what counts as proof; every truth-claim inherits it) · Authority (what makes a decision binding) ·
Frontend (instructive: a *domain* that still qualifies, because surfaces inherit law from being
surfaces).
**Fails** — Marketing (meeting point) · Priority (binds across all lines → overlay) · UX/UI
(converges into Frontend; creating it would fork an existing lineage) · Security, Privacy,
Observability, Accessibility (cross-cutting → overlays, one possibly dual-facet).

### A.11 Open questions
1. **The structural-tree model** — external material proposes a fixed ladder (Core → Pillars →
   Trunks → Branches → Leaves). Conflicts with the ratified position that a corespine is inheritance
   infrastructure not a container tree; implies a single apex where corespines are peers; forks the
   existing depth vocabulary. **Not absorbed** — needs an explicit decision.
2. **Recursive Completeness / Child Set Rule / 5-step deepening sequence** — deepening protocol, not
   definition. Needs Existing-First and its own home. Worth carrying regardless: *a deeper cycle
   cannot fix an unstable parent.*
3. **Epistemology** — overlay, Validation's real name, or its parent?
4. **Three inherited definition issues** — root corespine violating its own recurrence criterion; one
   corespine ambiguously corespine-vs-gate; a root self-reference resolved by decree not schema logic.
5. **Marketing's classification** — fails both tests; needs a home or an explicit ruling.

---

## III.B — OVERLAY

### B.1 Background
Some binding concerns refuse to sit in one lineage. Security applies to frontend, intake, creation
and storage — not because those are related, but because security is a different *kind* of thing
from a lineage. Software engineering named this decades ago: the **cross-cutting concern**. The
aspect-oriented tradition, policy engines and the CSS cascade all converged on one shape — a
universal layer, scoped layers beneath, and an explicit resolution order.

### B.2 The problem
Force a cross-cutting concern into a lineage and one of two things happens. **You break the corespine
model** — security-as-a-lineage would claim every element as a descendant, contradicting
one-element-one-lineage and making membership meaningless. **Or you scatter it** — restated inside
every lineage separately; five copies, five drift paths, no way to answer "what is our actual
position?" And a third, subtler failure: **scoped exemption.** Once "security works differently
here" is allowed, you have built a mechanism for weakening universal rules that looks like
reasonable localisation. That is the failure this structure is shaped to prevent.

### B.3 The definition

> An overlay is a **binding concern that applies across every lineage** rather than forming one. It
> consists of an **invariant core** holding everywhere without exception, plus **scope profiles**
> declaring how it applies within each lineage it touches, plus a **resolution rule** for conflicts.
>
> **An overlay may tighten, never loosen.**

**A — Invariant Core.** The non-negotiable minimum, no override anywhere. Deliberately small. *Test:
if it can be weakened somewhere, it was never invariant — move it to a profile.*
**B — Scope Profiles.** One per lineage. Inherits the core, adds domain detail, bound by the
governing law. **Not** an exemption mechanism.
**C — Resolution Rule.** What happens when two scopes disagree, or when the overlay meets a
corespine's own law. Explicit, never left to interpretation.

**The governing law — tighten, never loosen.** Monotonic in the restrictive direction; the direct
analogue of a corespine's cumulative property. Composition is **fail-closed**: the more restrictive
rule wins; where it is unclear which is more restrictive, the system does not guess.

**Naming.** "Overlay" is already registered — keep it. Outside vocabulary for reading external
material: *cross-cutting concern* (aspect, join point, weaving) · *policy overlay with scoped
resolution* (explicit deny wins, most-restrictive-wins, fail-closed) · *the cascade*. **Do not coin
a new term** — the concept is registered; what was missing was structure.

### B.4 An overlay is NOT
Not a corespine (binds across, not within) · not an exemption mechanism (profiles add, never
subtract) · not optional per domain · not a checklist (run at a moment vs always on) · not a policy
document (preferences without an invariant core and resolution rule are advice) · not a rank or
number (for ordering overlays the law is a comparator) · not a tag.

### B.5 Confusion guards

**Beware not to confuse an overlay with a CORESPINE**, which is a lineage of purpose. Both bind,
both always on, both monotonic, both inherited. Discriminator: within one line vs across all. Ask
*does an element inherit its rules from being this thing, or does this constrain it on top of the
line it already belongs to?*

**Beware not to confuse an overlay with a PROTOCOL**, which fires and finishes. An overlay never
runs — it applies. A protocol may *enforce* an overlay; that does not make them the same.

**Beware not to confuse the invariant core with a scope profile.** If a rule needs relaxing in even
one domain, it was never core — and putting it in the core "for strength" is how tighten-never-loosen
breaks, because the first domain that cannot comply will force an exemption.

**Beware not to confuse an overlay with a meeting point.** Marketing touches everything, which looks
cross-cutting — but it has no invariant core. Touching everything is not constraining everything.

### B.6 The other four
**Corespine** — a lineage of purpose; runs through elements rather than containing them. *The
overlay attaches through a scope profile and may only tighten its law.*
**Protocol** — a procedure for one operation. *Overlays constrain its steps; a protocol may be the
mechanism that enforces an overlay.*
**Wizard** — a protocol run with judgment in flight. *Overlay constraints may add judgment points.*
**Pipeline** — a protocol run with no judgment. *The highest-risk place for a loosened constraint —
nobody watches a runner execute.*

### B.7 Qualification test
1. **Cross-cutting?** Within one lineage → corespine.
2. **Real invariant core?** If nothing survives being made universal, there is no overlay — only a
   label.
3. **Do profiles differ meaningfully?** If every lineage applies it identically, it may belong in
   the constitutional layer.
4. **Tighten-only?** If the only way to make it work somewhere is relaxing the universal rule, the
   universal rule was wrong. Fix the core; do not permit the exemption.

### B.8 Worked example — Priority

**Three objects wearing one word.** *Priority-as-law* — the ordering principles, universal → the
invariant core. *Priority-as-value* — the rank tag on an item → a per-element field.
*Priority-as-resolution* — who wins on a tie or across domains → **the actual gap**.

**Central insight: priority laws are comparators, not numbers.** A rank is a frozen snapshot of a
comparison with the reasoning deleted — exactly why a static precedence rank failed once already.
The number survived, the reason did not, nobody could re-derive it. **Store the comparison rule;
derive the rank when needed.**

**The invariant comparators**, already in the platform's DNA and unnamed as such — each a comparison
between two items, never an absolute rank: blocking beats non-blocking · prevention before
production · completion before new · enhancement over new · correctness before speed.

**Partial order, not total.** Some pairs are genuinely incomparable. Forcing a total order fabricates
precision that does not exist, and the fabrication is invisible afterwards.

> An incomparable pair is **not resolved mechanically — it is surfaced as a decision.** An overlay
> that cannot decide must say so loudly rather than guess quietly.

**Per-part optimisation.** Each queue declares a **local comparator set**, layered on the invariants
and evaluated **lexicographically** — invariants first, always; local rules break remaining ties.
Frontend may order by user-facing impact, governance by blast radius, build by dependency depth.
None can violate the core, because tighten-never-loosen forbids it. That is "universal principles,
scoped application" with the escape hatch closed.

### B.9 Element inventory

**Block A — Identity.** A1 Name · A2 ID `AUTHORITY` · A3 Status `AUTHORITY` · A4 Wiring state ·
A5 Dual-facet declaration — whether it also carries a spine-like facet (*a dual concern forced into
one shape loses half of itself*).

**Block B — The concern.** B1 Concern statement, one sentence (*scope creep with nothing to check it
against*) · B2 Why cross-cutting — the evidence it is not a lineage · B3 Origin.

**Block C — The invariant core.** C1 Core rules, numbered · C2 Universality evidence per rule —
proof each holds everywhere with no override (*a non-universal rule in the core forces the first
exemption*) · C3 Minimality statement (*bloated cores guarantee exemptions*).

**Block D — Scope profiles, repeated per lineage.** D1 Lineage reference (*orphan profiles apply to
nothing*) · D2 Added requirements (*else the profile is decorative*) · D3 Rationale · D4
Tighten-only assertion, explicit (*the exemption arrives disguised as localisation*) · D5 Join
points — where it attaches (*no attachment surface means unenforceable*).

**Block E — Resolution.** E1 Conflict rule (*silent arbitrary resolution*) · E2 Comparators, for
ordering-type overlays (*frozen numbers with deleted reasoning*) · E3 Incomparability handling
(*fabricated precision*) · E4 Fail-closed statement (*confident wrong output at scale*) · E5
Excluded lineages and why (*unexplained gaps read as oversights*).

**Block F — Verification and integrity.** F1 Evidence-of-application (*an unverifiable claim*) ·
F2 Rejected paths · F3 Open questions · F4 Provenance · F5 Change log.

### B.10 Instruction deviations from Part II
- **Halt condition:** a profile cannot be written without relaxing the core → stop and report **that
  the core is wrong**. Do not write the exemption.
- **The instruction must force the core/profile split explicitly**, requiring per rule an answer to
  *can this be weakened anywhere?* An instruction that does not ask this produces a bloated core
  every time.
- **The tighten-only assertion is a separate explicit act per profile** — never inferred from the
  profile's content.
- **Template:** scope profiles as an identical repeatable block, so profiles can be compared against
  each other; the tighten-only assertion placed adjacent to each profile's added requirements.
- **Population:** the entire core is completed before any profile is written. A template permitting
  otherwise produces profiles quietly containing core material.

### B.11 Candidate assessment
**Security** — overlay, dual-facet; invariant core behaves spine-like, profiles are the overlay
facet. One structure, two layers. The hardest and best second trial. **Privacy** — overlay; profiles
differ sharply by domain. **Priority** — overlay; recommended first trial. **UX/UI** — neither;
converges into Frontend, settled. **Epistemology** — unresolved. **Marketing** — neither; fails the
corespine test (meeting point) *and* the overlay test (no invariant core). **Observability,
Accessibility** — overlay candidates, not yet examined at depth.

**Recommendation:** define the overlay structure generically, using **Priority** as its single trial
instance. *Pros* — one reusable structure instead of six ad-hoc ones; Priority's failure mode is
already documented, so the trial has a known target. *Cons* — slower, and one trial does not seal
it; Security is needed as a second, divergent trial. *Why anyway* — defining Priority as a one-off
means discovering at Security that the shape does not transfer, amplifying unresolved gaps into the
remaining five.

### B.12 Open questions
1. **The parked precedence ruling** — total-ordering sits on the archive as ruled-out-temporary
   *pending fork*. This resolves it toward partial-order with surfaced incomparability. Must be
   explicitly confirmed or overturned, not walked past.
2. **How a dual-facet concern is registered** — the registry has no shape for it. Security needs one.
3. **Where scope profiles physically live** — with the overlay, or with the corespine they attach to?
4. **Evidence-of-application** — the corespine model requires provable context-loading; the overlay
   equivalent is undesigned.

---

## III.C — PROTOCOL

### C.1 Background
Corespines say what must be true; overlays say what constraints apply. Neither tells anyone *how to
do anything*. That gap is where most organisational knowledge lives and where most of it is lost —
in the head of whoever last did the thing. A protocol is the act of moving that knowledge out of a
head and into a form two different operators can follow to the same result.

### C.2 The problem
**Every run is a first run** — the operation re-derived each time with different steps and gaps.
**Quality tracks whoever happened to do it** — no floor, only individual competence. **Nothing can
be audited** — you cannot check adherence to a procedure never written. **Improvement does not
accumulate** — a lesson from one run does not reach the next. And one failure specific to AI
systems: **freestyle building** — an AI asked to perform an operation with no protocol will invent a
plausible one, execute it confidently, and leave no trace of which steps it skipped.

### C.3 The definition

> A protocol is a **step-by-step procedure for one specific operation**. It prescribes the sequence,
> the gates, and the decision points. It is invoked, it runs, it finishes.

**One-line form:** the playbook for doing one thing correctly, every time.

**What makes it *one* protocol.** One protocol covers **one operation**. A protocol covering
"planning and building and reviewing" is three that were allowed to merge; it becomes unmaintainable
within a few revisions and unfollowable before that. *Test: can you name the operation as a verb
phrase?* "Create a plan" — yes. "Governance" — no, that is standing structure.

**The discriminator — standing vs firing.** A corespine and an overlay are always on; nothing invokes
them. A protocol fires, runs, finishes. A protocol runs **inside** the constraints its governing
corespine and applicable overlays impose; it never overrides them and cannot exempt itself.

### C.4 A protocol is NOT
Not a corespine (fires vs always on) · not an overlay · not a wizard or pipeline — those are its
*execution modes*; a protocol is the specification and you cannot run a specification · not a
checklist (a checklist may be a component; alone it lacks sequence, gates, preconditions, failure
handling) · not a description of how things are usually done (prose that describes is not procedure
that prescribes) · not a policy (policy says what must be true) · not multi-operation · not
self-ratifying — a protocol that has run is not thereby approved.

### C.5 Confusion guards

**Beware not to confuse a protocol with a CORESPINE.** Both have gates, so gate-presence separates
nothing. Use standing-vs-firing. A corespine's gates fire *within* protocols.

**Beware not to confuse a protocol with a WIZARD**, which is the protocol made runnable with
judgment in flight. The frequent error is writing the procedure *inside* the wizard and leaving no
protocol behind it — the executable then becomes the only record, reviewable only by execution.

**Beware not to confuse a protocol with a PIPELINE.** Same relationship, same warning — an automated
chain with no protocol behind it is automated freestyle building, worse than the manual kind because
it scales.

**Beware not to confuse a protocol with an OVERLAY.** An overlay may be *enforced by* a protocol.
The overlay states the constraint; the protocol is one occasion on which it is checked.

**Beware not to confuse a step with a gate.** A step is work performed; a gate is a decision that can
*stop* the run. A protocol whose gates are all steps has no stopping power and is a suggestion.

### C.6 The other four
**Corespine** — a lineage of purpose. *A protocol declares exactly one governing corespine and runs
inside its accumulated law.*
**Overlay** — a binding concern across every lineage. *Constrains a protocol's steps; adds
requirements, never relaxes them.*
**Wizard** — the protocol made runnable, judgment in flight. *Mirrors it 1:1.*
**Pipeline** — the protocol made runnable, no judgment. *Mirrors it 1:1.*

### C.7 Qualification test
1. **Verb phrase** — nameable as one? If not, probably standing structure.
2. **Firing** — does *"when did it run?"* have an answer?
3. **One operation** — or has it absorbed neighbours?
4. **Followable** — could two operators produce the same shape of output?
5. **Governed** — which corespine, which overlays? No governing lineage means floating.

### C.8 Run modes
A protocol is **not directly usable**. You use it through a run mode: a **wizard** (judgment in
flight) or a **pipeline** (none needed). It may have one, the other, or both; when both, they execute
the *same* protocol and must not diverge.

**The mirror rule** (existing, ratified): the protocol is the source; a run mode maps 1:1 to its
clauses. Ratifying a run mode means confirming it mirrors — not approving it separately.

**Which mode is needed is read off the protocol's own judgment-points field (D3).** Not a style
choice.

**The combined-node exception.** At least one existing node is a declared combined
protocol-and-wizard, embedding its protocol inline as a documented one-home exception. The split is
a **strong default, not an invariant** — a second combined node must be a conscious, documented
decision, never drift.

### C.9 Element inventory

**Block A — Identity.** A1 Name · A2 ID `AUTHORITY` · A3 Status `AUTHORITY` · A4 Wiring state ·
A5 Position in schema.

**Block B — Purpose and governance.** B1 Operation as a verb phrase (*forces single-operation scope*)
· B2 Goal, measurable (*else success is opinion*) · B3 Governing corespine · B4 Constraining overlays
(*constraints silently skipped*) · B5 Does NOT cover (*protocols expand into each other*).

**Block C — Entry conditions.** C1 Trigger (*runs at the wrong time or never*) · C2 Preconditions
(*runs on invalid state and produces confident garbage*) · C3 Required inputs (*mid-run stalls, or
fabricated inputs*) · C4 Refusal conditions (*runs when it should have stopped*).

**Block D — The procedure.** D1 Numbered steps as executable actions (*description instead of
prescription; unrepeatable*) · D2 Gates (*no stopping power = a suggestion*) · **D3 Judgment points —
which steps need input that cannot be pre-supplied** (*determines wizard vs pipeline; wrong here
means the wrong run mode gets built*) · D4 Per-step acceptance criteria · D5 Loop conditions
(*premature advance*) · D6 Failure and abort handling (*half-executed runs, inconsistent state*) ·
D7 Rollback.

**Block E — Output.** E1 Output artifact shape (*structurally different outputs from one protocol*) ·
E2 Definition of done for a run · E3 Verification requirement (*completion asserted not shown*) ·
E4 Handoff (*outputs that go nowhere*).

**Block F — Modes and integrity.** F1 Run-mode references (*unusable protocol, or an unratified
executable with no source*) · F2 Single-home declaration · F3 Self-compliance note · F4 Rejected
paths · F5 Ratification path · F6 Open questions · F7 Provenance · F8 Change log.

### C.10 Instruction deviations from Part II
- **Halt condition:** the operation takes more than one verb phrase → stop; this is two or more
  protocols. Also: steps cannot be written without violating the governing corespine's law → stop
  and report the conflict.
- **B1 is required first**, before anything else — it is the only thing preventing multi-operation
  sprawl, and sprawl cannot be fixed later without a full rewrite.
- **D3 must be marked deliberately per step, not inferred at the end.** Deferring it means the run
  mode is chosen by whoever builds it rather than by the protocol.
- **Step vs gate must be distinguished explicitly with an example of each.** Left implicit,
  everything becomes a step and the protocol loses stopping power.
- **Template:** steps as a repeatable sub-block, each carrying its own acceptance criteria, gate flag
  and judgment flag — a free-form numbered list omits all three.
- **Population:** boundary (B5) written before steps, not after.

### C.11 Worked examples
Plan protocol (how to create a plan → wizard) · Harvest protocol (extract a session's learnings →
pipeline) · Meta-protocol (how to create any protocol → wizard) · Corespine creation (combined node)
· Skill ingestion (staged, partly automated).
**Not protocols:** *Governance* — not a verb phrase, never fires. *A checklist inside a protocol* — a
component. *"Be careful about X"* — a constraint belonging in a corespine or overlay.

### C.12 Open questions
1. **Combined protocol-wizard nodes** — is the exception case-by-case, or does a rule govern when
   combining is legitimate? Unstated.
2. **Protocol-to-protocol invocation** — no stated rule for nesting depth or failure propagation.
3. **Where a protocol's overlay constraints are recorded** — in the protocol, or the scope profile?
4. **Partial run modes** — a protocol automated for four steps with judgment on the fifth has no name.

---

## III.D — WIZARD

### D.1 Background
A protocol is a specification, and specifications cannot be run. Something must stand between the
written procedure and whoever performs it — collecting what it needs, enforcing its order, refusing
to advance past an unfinished step. A wizard exists for one specific reason: **some steps need input
that does not exist until someone supplies it.** No amount of preparation produces it in advance.
A wizard is the form a protocol takes when it must stop and ask.

### D.2 The problem
**Protocols nobody follows** — a written procedure with no runnable form is read once and
approximated thereafter. **Silent step-skipping** — following by hand, steps get skipped and nothing
records which. **Fabricated inputs** — the AI-specific failure and the important one: asked to
perform a procedure needing a judgment it cannot make, a model supplies a plausible value and
continues; the output looks complete and the judgment was never made. **Creation by momentum** —
without a refusal path, running a creation procedure produces a creation regardless of whether the
thing should exist.

### D.3 The definition

> A wizard is a **protocol made runnable, where judgment is gathered in flight**. It walks an
> operator — human or model — through the protocol's steps, collecting inputs that could not be
> supplied at the start, and produces a structured output.

**One-line form:** how you run a protocol when it needs answers only you can give.

**The discriminator — where judgment lives.** Not interactive-vs-automated; that is the symptom and
it has a clean falsifier — *a model running a wizard with no human present is still running a
wizard.* The surviving axis: a wizard exists because steps require input that **cannot be
pre-supplied**; a pipeline exists because every step is **decidable from what is already available**.
**Practical consequence:** you convert a wizard into a pipeline by *removing judgment* — finding a
rule that decides what previously required a call — not by removing the human.

**What a wizard must hold.** The mirror rule (protocol is source; wizard maps 1:1; ratifying means
confirming it mirrors) · named judgment points, not implicit stops (a wizard asking for something
already derivable is friction, and friction trains click-through) · structured output · no
self-ratification (the most eroded rule in practice, because a completed run *feels* like approval) ·
refusal capability — it must be able to conclude the thing should not be created.

### D.4 A wizard is NOT
Not a protocol (it mirrors one) · not a form (a form collects fields; a wizard enforces a procedure,
can refuse, produces a governed artifact) · not a pipeline with prompts (asking "proceed?" once is
not gathering judgment through the run) · not a checklist · not an authority · not a place to store
procedure (a wizard containing the only copy cannot be reviewed except by running it) · not
human-only (the operator may be a model — that changes nothing) · not permitted to diverge from its
protocol.

### D.5 Confusion guards

**Beware not to confuse a wizard with a PROTOCOL**, which is the specification it mirrors 1:1. The
frequent error is writing the procedure inside the wizard with no protocol behind it.

**Beware not to confuse a wizard with a PIPELINE.** Do not use human-presence as the test — it fails
on a model operating a wizard alone. Ask: *is there a step whose input cannot be supplied before the
run starts?*

**Beware not to confuse a wizard with a CORESPINE or OVERLAY.** Those are standing structure. A
creation wizard is typically where corespine membership is first *declared*, which makes it easy to
mistake the wizard for the source of that law. It is where the law is applied, not where it lives.

**Beware not to confuse a judgment point with a confirmation prompt.** A judgment point's input does
not exist until supplied; a confirmation asks approval for something already decided. A wizard made
of confirmations is a pipeline with friction — and it trains operators to click through.

### D.6 The other four
**Corespine** — a lineage of purpose. *The wizard runs inside its law and cannot exempt its output.*
**Overlay** — a binding concern across lineages. *May add requirements, and therefore judgment
points.* **Protocol** — the wizard's single source; mirrored 1:1; all authority inherited.
**Pipeline** — the sibling run mode; if both exist they must not diverge.

### D.7 Qualification test
1. **Does a protocol exist?** No protocol behind it is freestyle building with a friendly interface —
   *that* is the gap; build it first.
2. **Does the protocol require in-flight judgment?** If not, build a pipeline.
3. **Does it mirror 1:1?** Every clause reachable, none added.
4. **Can it refuse?** Only-outcome-is-created means a production line, not a gate.
5. **Is the output shape defined?**

### D.8 Element inventory

**Block A — Identity.** A1 Name · A2 ID `AUTHORITY` · A3 Status `AUTHORITY` · A4 Wiring state ·
A5 Invocation handle (*an unreachable wizard is a document*).

**Block B — Source binding.** B1 Protocol reference (*an ownerless executable*) · B2 Clause-to-step
map, explicit 1:1 (*divergence becomes undetectable*) · B3 Additions declaration (*silent procedure
growth in the executable layer*) · B4 Governing corespine and overlays.

**Block C — Operator and inputs.** C1 Operator type — human/model/either · C2 Input schema · C3
Preconditions · C4 Session/state handling (*partial runs lost or silently resumed wrong*).

**Block D — The guided sequence, repeated per step.** D1 Step reference (*untraceable steps*) ·
D2 The question asked (*vague prompts produce vague inputs*) · **D3 Why it cannot be pre-supplied**
(*friction steps accumulate and train click-through*) · D4 Acceptance criteria for the answer (*any
input accepted, including empty plausibility*) · D5 Rejection criteria · D6 Loop condition ·
**D7 Behaviour on non-answer** (*this is where fabrication enters*).

**Block E — Outcomes.** E1 Output artifact shape · E2 Refusal paths (*a production line with no
gate*) · E3 Cannot-do declaration — explicitly does not ratify, assign IDs, or write authority
fields · E4 Handoff · E5 Run record (*no evidence which steps fired*).

**Block F — Integrity.** F1 Mirror verification record (*asserted rather than verified*) · F2
Refusal-rate note (*a gate that never stops anything*) · F3 Rejected paths · F4 Open questions ·
F5 Provenance · F6 Change log.

### D.9 Instruction deviations from Part II
- **Halt condition:** no protocol exists → stop and report the gap. Do not build the wizard first and
  write the protocol afterwards — the resulting protocol will be a description of the wizard rather
  than its source. Also: a step cannot be mapped to a protocol clause → stop.
- **The clause-to-step map is a required artifact, not a claim of fidelity.** "It mirrors the
  protocol" is unverifiable; a clause-by-clause table is checkable.
- **D3 and D7 are required per step.** D7 is where fabrication enters and must be designed rather
  than discovered.
- **Refusal paths (E2) are a mandatory block that cannot be marked N/A.** A wizard with no reachable
  refusal outcome fails review.
- **Template:** the clause map pre-filled from the protocol, so a missing mirror shows as an empty
  row rather than an absence nobody notices.
- **Population:** E2 before E1 — designing refusal before output prevents a wizard whose only shape
  is "produced."

### D.10 Worked examples
Plan wizard (judgment: scope, blast level, what the plan is actually for) · Corespine creation wizard
(judgment: the goal — via a dialogue that refuses to draft on the operator's behalf and will not
advance until a goal is defined and saved; that input does not exist until someone supplies it, which
is precisely why the protocol needs a wizard) · Meta-wizard (judgment: the concern the new protocol
owns, and its boundary).
**Not wizards:** a form collecting fields · a pipeline with a confirmation at the end · a checklist.

### D.11 Open questions
1. **The wizard→pipeline conversion path** — no mechanism notices when a judgment point has *become*
   decidable and should be promoted into automation. A real optimisation surface, unbuilt.
2. **Refusal-rate as a health metric** — a creation wizard that never refuses is either perfectly fed
   or not actually gating. Nothing measures this.
3. **Combined-node rule** — unstated.
4. **Mirror divergence detection** — required, but how divergence is *detected* rather than asserted
   is unspecified.

---

## III.E — PIPELINE

> **Read E.2 first.** This is the only one of the five carrying **two different concepts under one
> word.** Any definition written before that is settled is correct for one sense and wrong for the
> other.

### E.1 Background and problem
Some procedures need no judgment — every decision is derivable from what is known at the start.
Running those by hand is waste, and worse, injects variance into something that had none.
**Manual execution of deterministic work** costs without benefit. **Work that needs remembering
eventually stops happening.** **Inconsistent application** — one rule applied by hand across a
hundred elements produces a hundred slightly different applications.

But automation creates its own failure, which most of this section guards against: **confident wrong
output at scale.** A pipeline that guesses does not guess once — it guesses across every item it
touches, unattended, and leaves the result looking authoritative. This is why the rules here are
stricter than the wizard's, not looser.

### E.2 The word collision — the central finding

**Sense A — pipeline-as-runner (execution mode).** An automated processing chain executing a
protocol's steps end to end with no judgment gathered during the run. Live examples: a weekly batch
draining a registry; a harvest chain; a dispatch fanning a task to two reviewers.

**Sense B — pipeline-as-position (an axis).** The ordered flow an element travels through, and the
coordinate of where it currently sits. This is the sense in which an element "knows its pipeline
position," and the sense paired against corespine in the two-axis model (Part I.4).

**Why they are not the same.** An element's position on a flow is **not** a position inside a weekly
batch job. Sense B is a coordinate describing *any* element; Sense A is a mechanism executing *one
protocol*. An element can have a flow position while no runner exists at all — most do. They collide
badly in one place: **"add a pipeline"** is ambiguous between *build an automation* and *define a
flow*. Entirely different work.

**Recommendation:** keep **Pipeline** for the runner; use **Flow** / **Flow-position** for the axis.
Register the split explicitly and record the old spelling as an alias pointing at both, so existing
references stay resolvable rather than being silently re-interpreted. **This is a Governor
decision** — a rename touching live artifacts in both senses, and a rename is not done until every
live surface carries the new name.

### E.3 The definition *(Sense A)*

> A pipeline is a **protocol made runnable, where no judgment is required**. Every step is decidable
> from inputs available at the start, so the chain executes end to end without stopping to ask.

**One-line form:** how the system runs a protocol by itself.

**What a pipeline must hold.** The mirror rule — a divergent pipeline is a second, unratified
protocol running unattended, strictly worse than a divergent wizard because nobody is present to
notice · every step decidable at start · **fail-closed** — on undecidable input it stops and
surfaces; it does not guess and does not proceed on a default · **manual activation by default** —
any autonomous mechanism is off until separately ratified · **observable** — a run leaves evidence of
which steps fired, what it decided, what it skipped.

### E.4 A pipeline is NOT
Not a protocol (it mirrors one) · not a wizard · not a script (a script is code with no protocol
behind it and no mirror obligation) · not automatically on — built is not activated · not permitted
to guess · not exempt from governance — automation creates no exemption · not unobservable · not a
flow diagram (that is Sense B).

### E.5 Confusion guards

**Beware not to confuse a pipeline with a WIZARD.** Do not use human-presence as the test — it fails
on a model operating a wizard alone. Ask: *is there a step whose input cannot be supplied before the
run starts?*

**Beware not to confuse a pipeline with a PROTOCOL.** An automated chain with no protocol behind it
is automated freestyle building — worse than the manual kind, because it scales and nobody watches.

**Beware not to confuse Sense A with Sense B** (E.2). "Pipeline position" is a coordinate on a flow;
a pipeline in the execution sense is a runner. Live and unresolved.

**Beware not to confuse a pipeline with a SCRIPT.** A script does work. A pipeline executes a
ratified procedure, mirrors it 1:1, fails closed, and leaves a run record. Most things called
pipelines in practice are scripts, and calling them pipelines imports a trust they have not earned.

**Beware not to confuse "built" with "on."** A pipeline built and quietly started has bypassed the
only gate that matters for autonomy.

### E.6 The other four
**Corespine** — a lineage of purpose. *The pipeline runs inside its law; automation creates no
exemption.* **Overlay** — a binding concern across lineages. *The highest-risk place for a loosened
constraint, because nobody watches a runner execute.* **Protocol** — the pipeline's single source;
mirrored 1:1. **Wizard** — the sibling run mode; if both exist they must not diverge.

### E.7 Qualification test
1. **Does a protocol exist?** No protocol means automated freestyle building.
2. **Is every step genuinely decidable at start?** A single judgment step disqualifies it.
3. **Does it fail closed?** "It picks a default" means not ready.
4. **Is it observable?** Could you reconstruct a run from what it left behind?
5. **Is activation separately gated?** Built ≠ on.

### E.8 Element inventory

**Block A — Identity.** A1 Name · A2 ID `AUTHORITY` · A3 Status `AUTHORITY` · A4 Wiring state ·
**A5 Activation state `AUTHORITY`** — off by default; on only by ratified act (*an unratified
autonomous mechanism running*).

**Block B — Source binding.** B1 Protocol reference (*an ownerless automation*) · B2 Clause-to-step
map · B3 Additions declaration · B4 Governing corespine and overlays (*non-compliant output at
scale*) · **B5 Decidability proof, per step — why no judgment is required** (*a judgment step
automated as a guess*).

**Block C — Trigger and inputs.** C1 Trigger · C2 Inputs available at start, complete set (*a step
discovers mid-run it lacks an input*) · C3 Preconditions · C4 Scope limits (*unbounded blast
radius*) · C5 Rate limits.

**Block D — The chain, repeated per step.** D1 Step reference · **D2 Decision rule — the explicit
rule replacing judgment** (*the guess re-enters, disguised as logic*) · D3 Inputs consumed (*hidden
dependencies*) · D4 Outputs produced (*untracked side effects*) · **D5 Undecidable handling**
(*silent default; confident wrong output*) · D6 Failure handling.

**Block E — Run behaviour.** E1 Fail-closed statement · E2 Idempotency — what a re-run does
(*duplicated writes, corrupted accumulation*) · E3 Rollback · E4 Run record (*unverifiable
execution*) · E5 Surfacing channel — where a stop is reported and to whom (*it stops and nobody
learns*) · E6 Blast radius statement (*risk unassessed before activation*).

**Block F — Integrity.** F1 Mirror verification record · F2 Activation ratification reference
(*autonomy without authorisation*) · F3 Rejected paths · F4 Open questions · F5 Provenance ·
F6 Change log.

### E.9 Instruction deviations from Part II
- **Halt condition:** any step is not decidable from start-available inputs → stop; this is a wizard,
  or a wizard-then-pipeline split. Also: a decision rule cannot be stated without a judgment call →
  stop and report that this is not a pipeline. **Do not write a plausible rule and flag it later** —
  that is exactly the failure the decidability proof exists to catch.
- **B5 is a separate explicit act per step.** This clause carries the whole concept. Without it a
  judgment step gets automated as a plausible default, and the failure is invisible until it has been
  wrong many times.
- **D2 must be stated as a rule, not a description.** "It picks the most relevant one" is a guess
  with better grammar.
- **D5 must be present per step, and "apply a default" is not an acceptable value.**
- **Build and activation are separated explicitly.** The instruction states that producing the
  pipeline does not switch it on; activation is a distinct ratified act.
- **Template:** activation last, always, and visually separated; A5 marked most prominently of all
  AUTHORITY fields; the decidability proof adjacent to each step, not in a summary.
- **Population:** E6 completed before activation is even discussed. **A5 is never populated under any
  circumstance** — it is the single most consequential boundary violation available in the whole set.

### E.10 Worked examples
Weekly prevention batch (accumulation and grouping are rule-decidable) · Session harvest chain (none
for extraction; *routing* of findings may need a wizard stage) · Dual-review dispatch (fan out,
collect, compare).
**Not pipelines:** a wizard with a confirm-at-the-end · a flow diagram (Sense B) · a script with no
protocol behind it.

### E.11 Open questions
1. **The name split (E.2)** — unresolved and **blocking**. Everything else here is provisional on it.
2. **Whether Sense B is a primitive at all** — if flow-position is derived from tags and statuses
   rather than declared, it may need no definition, only a view. A ratified insight holds that a
   process's branches are tags and statuses on the element, not rigid hardcoded sequences — the
   strongest available argument that Sense B is derived rather than primitive.
3. **Partial pipelines** — a chain automated for four steps needing judgment on the fifth has no name.
4. **Divergence detection** — highest stakes here, since nobody watches a runner.
5. **The wizard→pipeline promotion path** — no mechanism notices when a judgment point has become
   decidable.

---

# PART IV — CROSS-CONCEPT VIEWS

## IV.1 The confusion matrix — every pair, and the one question that separates them

| Pair | The separating question |
|---|---|
| Corespine ↔ Overlay | Within one lineage, or across all of them? |
| Corespine ↔ Protocol | *When did it run?* — answerable means protocol |
| Corespine ↔ Category | Remove it: rules lost, or only an address? |
| Corespine ↔ Meeting point | One lineage, or where several converge? |
| Overlay ↔ Protocol | Applies continuously, or fires at a moment? |
| Overlay ↔ Meeting point | Is there a real invariant core, or does it just touch everything? |
| Protocol ↔ Wizard | Specification, or the runnable form of it? |
| Protocol ↔ Pipeline | Specification, or the automated form of it? |
| Wizard ↔ Pipeline | Is any step's input unavailable before the run starts? |
| Pipeline ↔ Script | Is there a ratified protocol behind it, and does it fail closed? |
| Pipeline-A ↔ Pipeline-B | Runner, or coordinate on a flow? **(unresolved — E.2)** |
| Step ↔ Gate | Can it *stop* the run? |

## IV.2 Side-by-side inventories

| Block | Corespine | Overlay | Protocol | Wizard | Pipeline |
|---|---|---|---|---|---|
| **Identity** | name, ID, status, wiring, depth, position | + dual-facet declaration | + position | + invocation handle | **+ activation state** |
| **Purpose** | goal, origin, forward obligation, north-star | concern, why cross-cutting, origin | operation verb phrase, goal, governance, does-not-cover | — (inherited from protocol) | — (inherited from protocol) |
| **Source binding** | — | — | — | protocol ref, clause map, additions | + **decidability proof** |
| **Boundary** | scope in/out, qualification, artifact classes | excluded lineages | does-not-cover | — | scope + rate limits |
| **Substance** | invariants, vocabulary, inheritance contract, evidence-of-load | invariant core, scope profiles, resolution | steps, gates, **judgment points**, failure, rollback | steps + question, why-not-pre-supplied, acceptance, rejection, non-answer | steps + **decision rule**, **undecidable handling** |
| **Output** | — | — | artifact shape, DoD, verification, handoff | artifact shape, **refusal paths**, cannot-do, run record | fail-closed, idempotency, rollback, run record, blast radius |
| **Connections** | overlays, protocols, siblings | join points per profile | run modes | — | surfacing channel |
| **Integrity** | rejected, open, provenance, changelog | + evidence-of-application | + single-home, self-compliance, ratification path | + mirror verification, refusal rate | + mirror verification, **activation ratification ref** |

The pattern worth noticing: **the two run modes have no Purpose block.** They inherit purpose
entirely from their protocol. A wizard or pipeline with its own goal statement is a sign it has
drifted from being a run mode into being a second protocol.

## IV.3 Halt conditions — the load-bearing clause per concept

| Concept | Population **stops and reports** when |
|---|---|
| **Corespine** | the qualification test fails · a needed rule conflicts with inherited law |
| **Overlay** | a scope profile cannot be written without relaxing the core → **the core is wrong** |
| **Protocol** | the operation needs more than one verb phrase → this is two protocols · steps would violate the governing corespine |
| **Wizard** | no protocol exists · a step cannot be mapped to a protocol clause |
| **Pipeline** | any step is not decidable at start → this is a wizard · a decision rule needs a judgment call |

**Universal:** any element that cannot be sourced → `MISSING` with a reason, never a plausible guess.
Any AUTHORITY element → left empty, always.

---

# PART V — CONSOLIDATED OPEN QUESTIONS

**Blocking (nothing downstream is safe until settled):**

1. **The pipeline name split** (III.E.2) — Sense A runner vs Sense B flow-position. A rename touching
   live artifacts in both senses. Governor decision.

**Structural (affect more than one concept):**

2. **The corespine structural-tree model** — the fixed ladder conflicts with the ratified
   inheritance-infrastructure position, implies a single apex, and forks the depth vocabulary. Not
   absorbed; needs an explicit decision.
3. **The parked precedence ruling** — this set resolves it toward partial-order with surfaced
   incomparability. Must be explicitly confirmed or overturned, not walked past.
4. **Where scope profiles and overlay constraints physically live** — with the overlay, or with the
   corespine/protocol they attach to? Affects ownership and discoverability.
5. **Mirror divergence detection** — required for both run modes, asserted rather than checked in
   both. Highest stakes for pipelines.
6. **Combined protocol-wizard nodes** — one exists and is documented. Is there a rule, or is it
   case-by-case?
7. **Partial run modes** — a protocol automated for four steps with judgment on the fifth has no name.
   Unnamed things drift.
8. **The wizard→pipeline promotion path** — no mechanism notices when a judgment point has become
   decidable and should be automated.

**Classification (unresolved candidates):**

9. **Epistemology** — overlay, Validation's real name, or its parent?
10. **Marketing** — fails both the corespine and overlay tests; needs a home or an explicit
    "not a governed concept" ruling.
11. **How a dual-facet concern is registered** — the registry has no shape for it; Security needs one.

**Deepening protocol, currently homeless:**

12. **Recursive Completeness / Child Set Rule / the 5-step sequence** — needs Existing-First and its
    own home. Worth carrying regardless: *a deeper cycle cannot fix an unstable parent.*

**Mechanical guards named but unbuilt:**

13. **Pipeline activation state** needs a mechanical guard, not just an AUTHORITY marking.
14. **These five inventories are a template set with no governing home** — unplaced, they will drift
    from the definitions they came from.

**Sealing:** none of the five is sealed. Under divergent-iteration discipline, each earns sealing only
after real trials stop surfacing edges — at minimum two genuinely different trials per concept. The
overlay structure's recommended trials are Priority first, then Security.

---

# PART VI — PROVENANCE AND VERIFICATION STATUS

**Sources.** Brain's working session (2026-08-07, eight turns) · Governor-supplied external material
(non-CISEM identifier formats and vocabulary — **input, not evidence**) · a CISEM (Sonnet) framing
cross-check.

**Adopted from CISEM.** "It doesn't contain things — it runs through them" (kept verbatim, better
than the original) · protocol-as-playbook scoped to one operation · wizard and pipeline as two
execution modes of one protocol · the Sense A pipeline definition · the worked examples.

**Replaced, with reasons stated in-line.** Interactive-vs-automated → where-judgment-lives
(falsifier: a model running a wizard alone is still a wizard). ARE/DO → standing-vs-firing (ARE/DO
cannot separate corespine from overlay, nor corespine from protocol since both gate).

**Not absorbed.** The fixed structural ladder (III.A.11 #1) — conflicts with a ratified position.

**Verification state.** Status marks, examples, archive references and policy references throughout
are **inferred** from a project-knowledge snapshot that predates the current architecture range. Not
verified against the live repo. Restatements of existing ratified material (the mirror rule, the
meta-protocol's structural requirements, the combined-node exception, manual-activation-by-default)
are marked as such where they appear.

**Nothing in this document is CISEM state.** It requires CISEM Existing-First verification at repo
level, then Governor ratification. Brain has no write path to git; this document exists outside the
repository.
