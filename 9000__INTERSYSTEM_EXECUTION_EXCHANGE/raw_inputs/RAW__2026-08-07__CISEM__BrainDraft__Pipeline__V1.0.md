# Pipeline — Complete Definition and Population Standard

**Status: BRAIN DRAFT — RAW-EXTERNAL. Not CISEM state.**
No ID assigned. No truth-bearing field written. Produced by Brain (Claude.ai), 2026-08-07.
Requires CISEM Existing-First verification at repo level, then Governor ratification.

**One of five.** Corespine · Overlay · Protocol · Wizard · Pipeline. Each is standalone; all five
share one skeleton so they can be validated against each other.

> **Read §5 first.** This is the only one of the five terms currently carrying **two different
> concepts under one word.** Any definition written before that is settled will be correct for one
> sense and wrong for the other.

**Revision 2 — 2026-08-07 (changes visible, not silent).** Rebuilt as a standalone document.
Added: background, problem statement, confusion guards, the complete element inventory (§10), and
the three AI instruction layers (§11). Retained: the word-collision finding, the
where-judgment-lives discriminator, and fail-closed. Nothing removed.

---

## 1. Background — why this concept exists

Some procedures need no judgment. Every decision they make is derivable from what is already known
when they start. Running those by hand is waste — and worse, it introduces variance into something
that had none, because a human following a deterministic procedure will occasionally deviate and
occasionally skip.

A pipeline is what a protocol becomes when nothing in it requires a call.

## 2. The problem it solves

**Manual execution of deterministic work.** Cost with no benefit, plus injected variance.

**Work that does not happen.** Anything requiring someone to remember to run it, weekly, eventually
stops running.

**Inconsistent application.** The same rule applied by hand across a hundred elements produces a
hundred slightly different applications.

But automation creates its own failure, which is what most of this document guards against:
**confident wrong output at scale.** A pipeline that guesses does not guess once — it guesses across
every item it touches, unattended, and leaves the result looking authoritative. This is why the
rules here are stricter than the wizard's, not looser.

## 3. The solution — the definition

*(Sense A — see §5. This is the execution-mode sense.)*

> A pipeline is a **protocol made runnable, where no judgment is required**. Every step is decidable
> from inputs available at the start, so the chain executes end to end without stopping to ask.

**The one-line form:** a pipeline is how the system runs a protocol by itself.

### The discriminator — where judgment lives

Not interactive-vs-automated — that framing fails on a model running a wizard with no human
present. The axis that survives:

| | Why this mode exists |
|---|---|
| **Wizard** | steps require input that **cannot be pre-supplied** |
| **Pipeline** | every step is **decidable from what is already available** |

**The practical consequence:** a wizard becomes a pipeline by *removing judgment* — finding a rule
that decides what previously required a call. Not by removing the human. That is the real
automation lever, and it is invisible under the interactive/automated framing.

---

## 4. A pipeline is NOT

- **Not a protocol.** It mirrors one. The protocol is the specification.
- **Not a wizard.** No judgment gathered during the run.
- **Not a script.** A script is code with no protocol behind it and no mirror obligation.
- **Not automatically on.** Built is not activated. Activation is a separate ratified act.
- **Not permitted to guess.** On an undecidable input it stops and surfaces.
- **Not exempt from governance.** Automation creates no exemption from any corespine's law or any
  overlay's constraint.
- **Not unobservable.** A run that leaves no evidence cannot be verified and therefore cannot be
  trusted.
- **Not a flow diagram.** That is the other sense of the word — see §5.

---

## 5. The word collision — the central finding

Two concepts are in active use under the single word "pipeline."

### Sense A — Pipeline-as-runner (execution mode)

> An automated processing chain executing a protocol's steps end to end with no judgment gathered
> during the run.

Live examples: a weekly batch draining a registry; a harvest chain running its steps in fixed order;
a dispatch fanning a task to two reviewers and collecting both.

### Sense B — Pipeline-as-position (an axis)

> The ordered flow an element travels through, and the coordinate of where it currently sits.

This is the sense in which an element "knows its pipeline position." It appears in the
position-view work, and it is the sense paired against corespine in the two-axis model:

- **Corespine** — lineage-directed: *why* it exists, *whose line* it is in
- **This axis** — goal-directed: *what* happens and *in what order*

### Why they are not the same thing

An element's position on a flow is **not** a position inside a weekly batch job. Sense B is a
coordinate describing *any* element; Sense A is a mechanism executing *one protocol*. An element can
have a flow position while no runner exists at all — most do.

They collide badly in one place: **"add a pipeline"** is ambiguous between *build an automation* and
*define a flow*. Entirely different pieces of work.

### Recommendation

| Concept | Proposed name |
|---|---|
| Sense A — the automated runner | **Pipeline** (keep) |
| Sense B — the flow and its coordinates | **Flow** / **Flow-position** |

Register the split explicitly and record the old spelling as an alias pointing at both, so existing
references stay resolvable rather than being silently re-interpreted.

**This is a Governor decision.** It is a rename touching live artifacts in both senses, and a rename
is not done until every live surface carries the new name.

---

## 6. Confusion guards

**Beware not to confuse a pipeline with a WIZARD**, which is the same protocol run where judgment is
gathered in flight. Do not use human-presence as the test — it fails on a model operating a wizard
alone. Ask: *is there a step whose input cannot be supplied before the run starts?* Yes → wizard.

**Beware not to confuse a pipeline with a PROTOCOL**, which is the specification it mirrors. An
automated chain with no protocol behind it is automated freestyle building — worse than the manual
kind, because it scales and nobody is watching.

**Beware not to confuse Sense A with Sense B** (§5). "Pipeline position" is a coordinate on a flow;
a pipeline in the execution sense is a runner. The ambiguity is live and unresolved.

**Beware not to confuse a pipeline with a SCRIPT.** A script does work. A pipeline executes a
ratified procedure, mirrors it 1:1, fails closed, and leaves a run record. Most things called
pipelines in practice are scripts, and calling them pipelines imports a trust they have not earned.

**Beware not to confuse "built" with "on."** Manual-activation-by-default: any autonomous mechanism
is off until separately ratified. A pipeline that was built and quietly started running has
bypassed the only gate that matters for autonomy.

---

## 7. The other four — short definitions and relationships

| Concept | Short definition | Relationship to a pipeline |
|---|---|---|
| **Corespine** | a lineage of purpose — why an element exists and whose line it is in; runs through elements rather than containing them | the pipeline runs inside its accumulated law; automation creates no exemption |
| **Overlay** | a binding concern applying across every lineage — invariant core plus scope profiles; tightens, never loosens | the highest-risk place for a loosened constraint, because nobody watches a runner execute |
| **Protocol** | a step-by-step procedure for one operation; fires, runs, finishes | the pipeline's single source; mirrored 1:1; all authority inherited from it |
| **Wizard** | the same protocol run where judgment is gathered in flight | the sibling run mode; if both exist they must not diverge from each other or the protocol |

**The frame:** two standing structures (corespine, overlay), one procedure (protocol), two run
modes (wizard, pipeline).

---

## 8. Qualification test — should this be a pipeline?

1. **Does a protocol exist?** No protocol means automated freestyle building. Build the protocol
   first.
2. **Is every step genuinely decidable at start?** Walk each one. A single judgment step
   disqualifies it.
3. **Does it fail closed?** What happens on an input it cannot handle? "It picks a default" means
   not ready.
4. **Is it observable?** Could you reconstruct a run afterwards from what it left behind?
5. **Is activation separately gated?** Built ≠ on.

---

## 9. What a pipeline must hold

**The mirror rule.** The protocol is the source; the pipeline maps 1:1. A divergent pipeline is a
second, unratified protocol running unattended — strictly worse than a divergent wizard, because
nobody is present to notice.

**Every step decidable at start.** A step needing judgment means misclassification: build a wizard,
or lift the judgment into a preceding wizard stage.

**Fail-closed.** On undecidable input it **stops and surfaces**. It does not guess and does not
proceed on a default.

**Manual activation by default.** Any autonomous mechanism is off until separately ratified.

**Observable.** A run leaves evidence of what it did — which steps fired, what it decided, what it
skipped.

---

## 10. Element inventory — the complete field list

`AUTHORITY` = only the Governor or a ratification act may write it.

### Block A — Identity

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| A1 | **Name** | registered pipeline name | collides or forks |
| A2 | **ID** `AUTHORITY` | assigned identifier | phantom state |
| A3 | **Status** `AUTHORITY` | ratification position | the system acts on a self-declared status |
| A4 | **Wiring state** | declared / connected / live | claimed live while nothing invokes it |
| A5 | **Activation state** `AUTHORITY` | off by default; on only by ratified act | an unratified autonomous mechanism running |

### Block B — Source binding

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| B1 | **Protocol reference** | the single protocol it mirrors | an ownerless automation |
| B2 | **Clause-to-step map** | explicit 1:1 mapping | divergence undetectable |
| B3 | **Additions declaration** | anything here and not in the protocol | silent procedure growth in the automated layer |
| B4 | **Governing corespine and overlays** | inherited law | non-compliant output at scale |
| B5 | **Decidability proof** | per step, why no judgment is required | a judgment step automated as a guess |

### Block C — Trigger and inputs

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| C1 | **Trigger** | what starts a run | runs at the wrong time, or never |
| C2 | **Inputs available at start** | the complete set | a step discovers mid-run it lacks an input |
| C3 | **Preconditions** | what must be true before it starts | runs on invalid state |
| C4 | **Scope limits** | how much it may touch in one run | unbounded blast radius |
| C5 | **Rate limits** | how often it may run | resource exhaustion, or repeated writes |

### Block D — The chain (repeated per step)

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| D1 | **Step reference** | which protocol clause this executes | untraceable steps |
| D2 | **Decision rule** | the explicit rule replacing judgment | the guess re-enters, disguised as logic |
| D3 | **Inputs consumed** | what this step reads | hidden dependencies |
| D4 | **Outputs produced** | what it writes | untracked side effects |
| D5 | **Undecidable handling** | what happens when the rule does not resolve | silent default; confident wrong output |
| D6 | **Failure handling** | what happens on error | half-executed runs, inconsistent state |

### Block E — Run behaviour

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| E1 | **Fail-closed statement** | explicit stop-and-surface behaviour | the pipeline guesses |
| E2 | **Idempotency** | what a re-run does | duplicated writes, corrupted accumulation |
| E3 | **Rollback** | how to undo a run | no path back |
| E4 | **Run record** | what evidence a run leaves | unverifiable execution |
| E5 | **Surfacing channel** | where a stop is reported, and to whom | it stops and nobody learns |
| E6 | **Blast radius statement** | worst case if it runs wrong | risk unassessed before activation |

### Block F — Integrity

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| F1 | **Mirror verification record** | when the 1:1 map was last checked, and how | asserted rather than verified |
| F2 | **Activation ratification reference** | the act that permitted it to run | autonomy without authorisation |
| F3 | **Rejected paths** | considered and deliberately not done | rejected designs return forever |
| F4 | **Open questions** | genuinely unresolved | false confidence |
| F5 | **Provenance** | source and verification state | inferred treated as verified |
| F6 | **Change log** | what changed, when, why | silent divergence from the protocol |

---

## 11. The three AI instruction layers

### 11.A — How to write the instruction

1. **Executable, not descriptive.** Every clause checkable as done-or-not-done.
2. **Protocol-first, halt if absent.** Same as the wizard's, and more consequential: an automation
   with no protocol runs unattended.
3. **Require the decidability proof (B5) per step, as a separate act.** This is the clause that
   carries the whole concept. Without it, a judgment step gets automated as a plausible default and
   the failure is invisible until it has been wrong many times.
4. **Require the decision rule (D2) to be stated as a rule, not a description.** "It picks the most
   relevant one" is a guess with better grammar.
5. **Require undecidable handling (D5) per step**, and state that "apply a default" is not an
   acceptable value.
6. **Require the blast radius statement (E6) before activation is even discussed.**
7. **Separate build from activation explicitly.** The instruction must state that producing the
   pipeline does not switch it on, and that activation is a distinct ratified act.
8. **Name the authority boundary** — including activation state.
9. **Forbid inference-as-population** — unsourced elements marked MISSING with a reason.
10. **Require certainty marking.**
11. **Declare what the instruction does NOT cover.**

### 11.B — How to build the template

1. **Every slot present and empty**, with inline guidance.
2. **Steps as a repeatable sub-block** carrying all six D-elements. D2 and D5 are the two a
   free-form list always omits, and they are the two that matter.
3. **The decidability proof adjacent to each step**, not in a summary section — proximity is what
   makes the check actually happen.
4. **The clause-to-step map pre-filled from the protocol**, so a missing mirror shows as an empty
   row.
5. **Type every slot**; mandatory vs optional marked; reason code for empty mandatory slots.
6. **Order by dependency** — protocol reference → clause map → decidability proof → trigger →
   steps → run behaviour → activation. Activation last, always, and visually separated.
7. **Mark AUTHORITY slots visually**, with activation state marked most prominently of all.
8. **Make fail-closed and undecidable-handling required sections that cannot be marked N/A.**
9. **Carry the validation checklist in the template.**
10. **Include a complete worked reference instance.**

### 11.C — How to populate

**Order of operations:**

1. **Existing-First.** Does a pipeline or protocol for this already exist under another name?
   Report *not found under checked aliases*, never *confirmed absent*.
2. **Protocol reference (B1).** If none exists, **stop and report the gap.**
3. **Clause-to-step map (B2).** Enumerate every protocol clause before writing any step.
4. **Decidability proof (B5).** Per step: is this genuinely decidable from what we have at start?
   **If any step is not, stop** — this is a wizard, or a wizard-then-pipeline split.
5. **Trigger and inputs (C1–C5).**
6. **Steps (D1–D6)**, one at a time, each with an explicit decision rule and explicit undecidable
   handling.
7. **Run behaviour (E1–E6).** E6 before considering activation.
8. **Integrity (F1, F3–F6).**
9. **Identity (A1, A4).** Leave A2, A3 and **A5 activation state** empty — activation is an
   authority act and populating it is the single most consequential boundary violation available
   here.

**Rules for every element:**

- One stated source per value; the source itself, never a paraphrase.
- Certainty marked.
- Unknown → MISSING with a reason.
- Never populate an AUTHORITY element, and never populate activation state under any circumstance.
- If a decision rule cannot be stated without a judgment call, **stop and report that this is not a
  pipeline.** Do not write a plausible rule and flag it later — that is exactly the failure the
  decidability proof exists to catch.

---

## 12. Worked examples

| Pipeline (Sense A) | Protocol run | Judgment required |
|---|---|---|
| Weekly prevention batch | the learning/prevention protocol | none — accumulation and grouping are rule-decidable |
| Session harvest chain | the harvest protocol | none for extraction; *routing* of findings may need a wizard stage |
| Dual-review dispatch | the review protocol | none — fan out, collect, compare |

**Not pipelines:** a wizard with a confirm-at-the-end (judgment still in flight); a flow diagram
(Sense B); a script with no protocol behind it.

---

## 13. Open questions

1. **The name split (§5).** Unresolved and blocking. Everything else here is provisional on it.
2. **Whether Sense B is a primitive at all.** If flow-position is derived from tags and statuses
   rather than declared as its own structure, it may need no definition — only a view. A ratified
   insight holds that a process's branches are tags and statuses on the element, not rigid
   hardcoded sequences. That is the strongest available argument that Sense B is derived rather
   than primitive.
3. **Partial pipelines.** A chain automated for four steps needing judgment on the fifth is common
   and has no name. Wizard-with-automation, or pipeline-with-a-gate? Unnamed things drift.
4. **Divergence detection.** The 1:1 mirror is required; how divergence is *detected* rather than
   asserted is unspecified. Higher stakes here than anywhere, since nobody watches a runner.
5. **The wizard→pipeline promotion path.** No mechanism notices when a judgment point has become
   decidable and should be automated.
6. **Sealing.** Not sealed, and this one is furthest from it of the five.

---

## 14. Provenance and verification status

Produced by Brain (Claude.ai), 2026-08-07, from a working session plus a CISEM (Sonnet) framing and
Governor-supplied external material. CISEM's Sense A definition ("the automated back-end of a
protocol") is adopted for that sense; the Governor-supplied material defined the word in Sense B.
**Both were correct about different concepts** — that discovery is §5 and is the main output of
this document. Examples and policy references are **inferred** from a project-knowledge snapshot
predating the current architecture range; not verified against the live repo. **Nothing here is
CISEM state.**
