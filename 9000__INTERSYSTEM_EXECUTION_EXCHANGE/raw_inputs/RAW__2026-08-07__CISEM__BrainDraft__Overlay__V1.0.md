# Overlay — Complete Definition and Population Standard

**Status: BRAIN DRAFT — RAW-EXTERNAL. Not CISEM state.**
No ID assigned. No truth-bearing field written. Produced by Brain (Claude.ai), 2026-08-07.
Requires CISEM Existing-First verification at repo level, then Governor ratification.

**One of five.** Corespine · Overlay · Protocol · Wizard · Pipeline. Each is standalone; all five
share one skeleton so they can be validated against each other.

**Revision 3 — 2026-08-07 (changes visible, not silent).** Rebuilt as a standalone document.
Added: background, problem statement, confusion guards, the complete element inventory (§9), and
the three AI instruction layers (§10). Retained: the invariant-core/scope-profile structure,
tighten-never-loosen, and the Priority worked example. Nothing removed.

---

## 1. Background — why this concept exists

Some binding concerns refuse to sit in one lineage. Security applies to the frontend, to intake,
to creation, to storage — not because those are related, but because security is a different *kind*
of thing from a lineage.

Software engineering hit this decades ago and named it: the **cross-cutting concern**. The
aspect-oriented tradition, policy engines, and the CSS cascade all converged on the same shape —
a universal layer, scoped layers beneath it, and an explicit resolution order.

The overlay is CISEM's form of that shape.

## 2. The problem it solves

Force a cross-cutting concern into a lineage and one of two things happens.

**You break the corespine model.** Security-as-a-corespine would have to claim every element in the
system as a descendant, which contradicts one-element-one-lineage and makes membership meaningless.

**Or you scatter it.** Security rules get restated inside every lineage separately. Five copies,
five drift paths, and no way to answer "what is our actual security position?"

There is a third failure, subtler and worse: **scoped exemption**. Once you allow "security works
differently in this domain," you have created a mechanism for weakening universal rules that looks
like reasonable localisation. This is the failure the overlay structure is specifically shaped to
prevent.

## 3. The solution — the definition

> An overlay is a **binding concern that applies across every lineage** rather than forming one. It
> consists of an **invariant core** that holds everywhere without exception, plus **scope profiles**
> declaring how it applies within each lineage it touches, plus a **resolution rule** for conflicts.
>
> **An overlay may tighten, never loosen.**

### The three mandatory parts

**A — Invariant Core.** The non-negotiable minimum holding in every lineage, no override anywhere.
Deliberately small. *The test: if it can be weakened somewhere, it was never invariant — move it to
a scope profile.* This part behaves exactly like a corespine's accumulated law.

**B — Scope Profiles.** One per lineage the overlay touches. Each declares how the concern applies
*within that lineage*. Inherits the invariant core automatically, adds domain detail, and is bound
by the governing law. A scope profile is **not** an exemption mechanism.

**C — Resolution Rule.** What happens when two scopes disagree, or when the overlay meets a
corespine's own law. Stated explicitly, never left to interpretation.

### The governing law

> **Tighten, never loosen.** Monotonic in the restrictive direction.

This is the direct analogue of a corespine's cumulative-and-monotonic property, and it is what
stops scoped application from becoming scoped exemption. Composition is **fail-closed**: the more
restrictive rule wins; when it is unclear which is more restrictive, the system does not guess.

### Naming

CISEM already registers "overlay." Keep it. The outside vocabulary, for reading external material:
*cross-cutting concern* (aspect-oriented — aspect, join point, weaving); *policy overlay with
scoped resolution* (policy engines — explicit deny wins, most-restrictive-wins, fail-closed); *the
cascade* (CSS — universal rules, specific rules winning where they apply, inheritance down the
tree). **Do not coin a new term.** The concept is registered; what was missing was structure.

---

## 4. An overlay is NOT

- **Not a corespine.** It binds across lineages, not within one.
- **Not an exemption mechanism.** Scope profiles add; they never subtract.
- **Not optional per domain.** A lineage cannot decline an overlay that applies to it.
- **Not a checklist.** A checklist is run at a moment; an overlay is always on.
- **Not a policy document.** A document that states preferences without an invariant core and a
  resolution rule is advice, not an overlay.
- **Not a rank or a number.** For ordering-type overlays: the law is a comparator, not a value.
- **Not a tag.** Tags describe; overlays constrain.

---

## 5. Confusion guards

**Beware not to confuse an overlay with a CORESPINE**, which is a lineage of purpose — *why an
element exists and whose line it belongs to*. Both bind, both are always on, both are monotonic,
and both are inherited. The single discriminator: within one line (corespine) versus across all
lines (overlay). Ask *does an element inherit its rules from being this thing, or does this thing
constrain it on top of the line it already belongs to?*

**Beware not to confuse an overlay with a PROTOCOL**, which fires at a moment and finishes. An
overlay never runs — it applies. Ask *"when did it run?"*: meaningless for an overlay, answerable
for a protocol. A protocol may *enforce* an overlay; that does not make them the same.

**Beware not to confuse the invariant core with a scope profile.** The core is what cannot be
overridden anywhere. If a rule needs to be relaxed in even one domain, it was never core — and
moving it into the core "for strength" is how the tighten-never-loosen law gets quietly broken,
because the first domain that cannot comply will force an exemption.

**Beware not to confuse an overlay with a meeting point.** Marketing touches everything, which
makes it *look* cross-cutting. But it has no invariant core — there is no non-negotiable minimum
that marketing imposes on every lineage. Touching everything is not the same as constraining
everything.

---

## 6. The other four — short definitions and relationships

| Concept | Short definition | Relationship to an overlay |
|---|---|---|
| **Corespine** | a lineage of purpose — why an element exists and whose line it is in; runs through elements rather than containing them | the overlay attaches to it through a scope profile, and may only tighten its law |
| **Protocol** | a step-by-step procedure for one operation; fires, runs, finishes | overlays constrain a protocol's steps from across lineages; a protocol may be the mechanism that enforces an overlay |
| **Wizard** | a protocol made runnable, judgment gathered in flight | overlay constraints may add judgment points to a wizard's steps |
| **Pipeline** | a protocol made runnable, no judgment needed | the highest-risk place for a loosened constraint — nobody is watching a runner execute |

**The frame:** two standing structures (corespine, overlay), one procedure (protocol), two run
modes (wizard, pipeline).

---

## 7. Qualification test — should this be an overlay?

1. **Cross-cutting?** Within one lineage → corespine, not overlay.
2. **Real invariant core?** Can you state a non-negotiable minimum holding everywhere with no
   override? If nothing survives being made universal, there is no overlay here — only a label.
3. **Do scope profiles differ meaningfully?** If every lineage applies it identically, it may belong
   in the constitutional layer instead.
4. **Tighten-only?** If the only way to make it work somewhere is to relax the universal rule, the
   universal rule was wrong. Fix the core; do not permit the exemption.

**Refusal-first:** the default answer is *no*.

---

## 8. Worked example — Priority

**Three objects wearing one word.** Separating them is most of the work.

| | What it is | Where it goes |
|---|---|---|
| Priority-as-law | the ordering principles, universal | the invariant core |
| Priority-as-value | the rank tag on an item | a per-element field |
| Priority-as-resolution | who wins on a tie, or across domains | **the actual gap** |

**The central insight: priority laws are comparators, not numbers.** A rank is a frozen snapshot of
a comparison with the reasoning deleted — which is exactly why a static precedence rank failed once
already. The number survived, the reason did not, nobody could re-derive it. **Store the comparison
rule; derive the rank when needed.**

**The invariant comparators**, already present in the platform's DNA and unnamed as such — each a
comparison between two items, never an absolute rank: blocking beats non-blocking · prevention
before production · completion before new · enhancement over new · correctness before speed.

**Partial order, not total order.** Some pairs are genuinely incomparable. Forcing a total order
fabricates precision that does not exist, and the fabrication is invisible afterward.

> An incomparable pair is **not resolved mechanically — it is surfaced as a decision.** An overlay
> that cannot decide must say so loudly rather than guess quietly.

**Per-part optimisation.** Each queue declares a **local comparator set**, layered on the invariant
comparators and evaluated **lexicographically** — invariants first, always; local rules break the
remaining ties. Frontend may order by user-facing impact, governance by blast radius, build by
dependency depth. None can violate the core, because tighten-never-loosen forbids it.

---

## 9. Element inventory — the complete field list

`AUTHORITY` = only the Governor or a ratification act may write it.

### Block A — Identity

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| A1 | **Name** | the registered concern name | unregistered names fork the concern |
| A2 | **ID** `AUTHORITY` | assigned identifier | phantom state |
| A3 | **Status** `AUTHORITY` | ratification position | the system acts on a self-declared status |
| A4 | **Wiring state** | declared / connected / live | an overlay claimed live that nothing enforces |
| A5 | **Dual-facet declaration** | whether it also carries a spine-like facet | a dual concern gets forced into one shape and half of it is lost |

### Block B — The concern

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| B1 | **Concern statement** | what this overlay protects, in one sentence | scope creep with nothing to check it against |
| B2 | **Why cross-cutting** | the evidence it is not a lineage | corespines and overlays get mixed |
| B3 | **Origin** | the need that created it | rules survive, reasoning dies |

### Block C — The invariant core

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| C1 | **Core rules, numbered** | the non-negotiable minimum | unnumbered rules cannot be cited or enforced |
| C2 | **Universality evidence per rule** | proof each holds in every lineage with no override | a non-universal rule sits in the core and forces the first exemption |
| C3 | **Minimality statement** | why nothing more belongs in the core | bloated cores guarantee exemptions |

### Block D — Scope profiles (repeated per lineage)

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| D1 | **Lineage reference** | which corespine this profile attaches to | orphan profiles apply to nothing |
| D2 | **Added requirements** | what this lineage must do beyond the core | the profile is decorative |
| D3 | **Rationale** | why this lineage needs more | additions accumulate without justification |
| D4 | **Tighten-only assertion** | explicit confirmation nothing is relaxed | the exemption arrives disguised as localisation |
| D5 | **Join points** | where in the lineage it attaches | the constraint has no attachment surface and is unenforceable |

### Block E — Resolution

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| E1 | **Conflict rule** | what wins when two scopes disagree | silent arbitrary resolution |
| E2 | **Comparators** (ordering-type overlays) | the comparison rules replacing ranks | frozen numbers with deleted reasoning |
| E3 | **Incomparability handling** | what happens when nothing decides | fabricated precision |
| E4 | **Fail-closed statement** | behaviour on undecidable input | confident wrong output at scale |
| E5 | **Excluded lineages and why** | where it deliberately does not apply | unexplained gaps read as oversights |

### Block F — Verification and integrity

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| F1 | **Evidence-of-application** | what proves a profile was actually applied | the overlay becomes an unverifiable claim |
| F2 | **Rejected paths** | considered and deliberately not done | rejected ideas return forever |
| F3 | **Open questions** | genuinely unresolved | false confidence |
| F4 | **Provenance** | source and verification state | inferred treated as verified |
| F5 | **Change log** | what changed, when, why | silent structural change |

---

## 10. The three AI instruction layers

### 10.A — How to write the instruction

1. **Executable, not descriptive** — every clause checkable as done-or-not-done.
2. **Refusal-first** — default outcome *do not create*; the AI's job is to find reasons this is not
   an overlay.
3. **Force the core/profile split explicitly.** The instruction must require, per rule, an answer
   to *can this be weakened anywhere?* This single question is what keeps the core honest, and an
   instruction that does not ask it will produce a bloated core every time.
4. **Per-element acceptance and rejection criteria**, with a worked example and a counter-example
   each. Counter-examples do the heavier work.
5. **Name the authority boundary** — which elements the AI may never write.
6. **Forbid inference-as-population** — unsourced elements marked MISSING with a reason.
7. **Require certainty marking** — confirmed / inferred / assumed.
8. **Require the tighten-only assertion per profile** as a separate, explicit act — never inferred
   from the profile's content.
9. **Declare what the instruction does NOT cover.**

### 10.B — How to build the template

1. **Every slot present and empty**, including all scope-profile blocks.
2. **Scope profiles as a repeatable sub-template**, not a free-form list — one identical block per
   lineage, so profiles can be compared against each other.
3. **Inline guidance per slot** — what goes here, what does not.
4. **Type every slot**; mark mandatory vs optional; require a reason code for empty mandatory slots.
5. **Order by dependency** — concern → cross-cutting evidence → core → profiles → resolution.
   Profiles cannot be written before the core exists, and a template that permits it will produce
   profiles that quietly contain core material.
6. **Mark AUTHORITY slots visually.**
7. **Put the tighten-only assertion adjacent to each profile's added requirements**, not in a
   separate section — proximity is what makes the check actually happen.
8. **Carry the validation checklist in the template.**
9. **Include a complete worked reference instance.**

### 10.C — How to populate

**Order of operations:**

1. **Existing-First** — does this concern already exist under another name? Report *not found under
   checked aliases*, never *confirmed absent*.
2. **Concern statement (B1)** and **cross-cutting evidence (B2)**. If B2 fails, **stop** — this is a
   corespine question, not an overlay one.
3. **Invariant core (C1–C3).** For each candidate rule, ask *can this be weakened anywhere?* If yes,
   it is not core — move it to a profile. Do this before writing any profile.
4. **Scope profiles (D1–D5)**, one lineage at a time, each with its own explicit tighten-only
   assertion.
5. **Resolution (E1–E5).** E3 is the one most often skipped and it is the one that prevents
   fabricated precision.
6. **Verification and integrity (F1–F5).**
7. **Identity (A1, A4, A5).** Leave A2 and A3 empty.

**Rules for every element:**

- One stated source per value; the source itself, never a paraphrase.
- Certainty marked.
- Unknown → MISSING with a reason.
- Never populate an AUTHORITY element.
- If a profile cannot be written without relaxing the core, **stop and report that the core is
  wrong.** Do not write the exemption.

---

## 11. Candidate assessment

| Candidate | Verdict | Note |
|---|---|---|
| **Security** | Overlay, dual-facet | invariant core behaves spine-like; profiles are the overlay facet. One structure, two layers. The hardest and best second trial. |
| **Privacy** | Overlay | same shape; profiles differ sharply by domain |
| **Priority** | Overlay | the recommended first trial |
| **UX/UI** | Neither | converges into Frontend — settled, do not reopen |
| **Epistemology** | Unresolved | may be an overlay, may be Validation's real name, may be its parent |
| **Marketing** | Neither | fails the corespine test (meeting point) *and* the overlay test (no invariant core) |
| **Observability, Accessibility** | Overlay candidates | same class; not yet examined at this depth |

**Recommendation:** define the overlay structure generically, using **Priority** as its single trial
instance. Not Priority alone; not all six at once. *Pros* — one reusable structure instead of six
ad-hoc ones, and Priority's failure mode is already documented so the trial has a known target.
*Cons* — slower, and one trial does not seal it; Security is needed as a second, divergent trial.
*Why anyway* — defining Priority as a one-off means discovering at Security that the shape does not
transfer, which amplifies unresolved gaps into the remaining five.

---

## 12. Open questions

1. **The parked precedence ruling.** Total-ordering precedence sits on the archive as
   ruled-out-temporary *pending fork*. This document resolves it toward partial-order with surfaced
   incomparability. That must be explicitly confirmed or explicitly overturned — not walked past.
2. **How a dual-facet concern is registered.** The registry has no shape for something both
   invariant-core and overlay. Security needs one.
3. **Where scope profiles physically live** — with the overlay, or with the corespine they attach
   to? Affects ownership and discoverability.
4. **Evidence-of-application.** The corespine model requires provable context-loading; the overlay
   equivalent is undesigned.
5. **Sealing.** Not sealed. Two divergent trials minimum.

---

## 13. Provenance and verification status

Produced by Brain (Claude.ai), 2026-08-07, from a working session plus a CISEM (Sonnet)
cross-check. Outside terminology in §3 is standard industry vocabulary offered for reference — not
imported as CISEM structure. Status marks and archive references are **inferred** from a
project-knowledge snapshot predating the current architecture range; not verified against the live
repo. **Nothing here is CISEM state.**
