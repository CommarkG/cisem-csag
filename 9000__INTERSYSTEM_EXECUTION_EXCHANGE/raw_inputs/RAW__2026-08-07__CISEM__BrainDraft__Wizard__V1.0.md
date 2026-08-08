# Wizard — Complete Definition and Population Standard

**Status: BRAIN DRAFT — RAW-EXTERNAL. Not CISEM state.**
No ID assigned. No truth-bearing field written. Produced by Brain (Claude.ai), 2026-08-07.
Requires CISEM Existing-First verification at repo level, then Governor ratification.

**One of five.** Corespine · Overlay · Protocol · Wizard · Pipeline. Each is standalone; all five
share one skeleton so they can be validated against each other.

**Revision 2 — 2026-08-07 (changes visible, not silent).** Rebuilt as a standalone document.
Added: background, problem statement, confusion guards, the complete element inventory (§9), and
the three AI instruction layers (§10). Retained: the where-judgment-lives discriminator, the
mirror rule, refusal capability, and the combined-node exception. Nothing removed.

---

## 1. Background — why this concept exists

A protocol is a specification, and specifications cannot be run. Something has to stand between the
written procedure and the person or model performing it — collecting what the procedure needs,
enforcing its order, refusing to advance past an unfinished step.

That thing is the wizard, and it exists for one specific reason: some steps need input that does
not exist until someone supplies it. No amount of preparation produces it in advance. The wizard is
the form a protocol takes when it must stop and ask.

## 2. The problem it solves

**Protocols nobody follows.** A written procedure with no runnable form gets read once and
approximated thereafter.

**Silent step-skipping.** Following a document by hand, steps get skipped, and nothing records which
ones.

**Fabricated inputs.** This is the AI-specific failure and the important one. Asked to perform a
procedure needing a judgment it cannot make, a model will supply a plausible value and continue.
The output looks complete. The judgment was never made. A wizard's job is to make that stop be
visible instead.

**Creation by momentum.** Without a refusal path, running a creation procedure produces a creation —
regardless of whether the thing should exist. The wizard is where "no" has to be possible.

## 3. The solution — the definition

> A wizard is a **protocol made runnable, where judgment is gathered in flight**. It walks an
> operator — human or model — through the protocol's steps, collecting the inputs that could not be
> supplied at the start, and produces a structured output.

**The one-line form:** a wizard is how you run a protocol when the protocol needs answers only you
can give.

### The discriminator — where judgment lives

The intuitive axis is *interactive vs automated*. It is real but it is the **symptom**, and it has
a clean falsifier:

> A model running a wizard with no human present is still running a wizard.

Interactive-vs-automated breaks there. The axis that survives:

| | Why this mode exists |
|---|---|
| **Wizard** | steps require input that **cannot be pre-supplied** — judgment gathered during the run |
| **Pipeline** | every step is **decidable from inputs already available** at start |

Human-at-each-step is what a wizard *looks like*. Judgment-requirement is what *makes* one
necessary.

**Why this matters practically:** it tells you how to convert one into the other. You turn a wizard
into a pipeline by **removing judgment** — finding a rule that decides what previously required a
call. Not by removing the human. The interactive/automated framing hides this lever entirely; the
judgment framing makes it the obvious next question for every wizard in the system.

---

## 4. A wizard is NOT

- **Not a protocol.** It mirrors one. The protocol is the source of truth; the wizard is its
  runnable form.
- **Not a form.** A form collects fields. A wizard enforces a procedure, can refuse, and produces a
  governed artifact.
- **Not a pipeline with prompts.** Asking "proceed?" once at the end is not gathering judgment
  through the run.
- **Not a checklist.** A checklist has no gates, no refusal path, no structured output.
- **Not an authority.** A completed run is not an approval, however complete it feels.
- **Not a place to store procedure.** Procedure lives in the protocol. A wizard containing the only
  copy of its procedure cannot be reviewed except by running it.
- **Not human-only.** The operator may be a model. That changes nothing about what it is.
- **Not permitted to diverge from its protocol.** A divergent wizard is a second, unratified
  protocol wearing a wizard's name.

---

## 5. Confusion guards

**Beware not to confuse a wizard with a PROTOCOL**, which is the step-by-step specification it
mirrors 1:1. The frequent error is writing the procedure *inside* the wizard and leaving no protocol
behind it. The executable then becomes the only record, reviewable only by execution, and no
independent check on it is possible. (One documented exception exists; see §11.)

**Beware not to confuse a wizard with a PIPELINE**, which is the same protocol run where no judgment
is needed. Do not use human-presence as the test — it fails on a model operating a wizard alone. Ask
instead: *is there a step whose input cannot be supplied before the run starts?* Yes → wizard.

**Beware not to confuse a wizard with a CORESPINE or an OVERLAY.** Those are standing structure —
always on, never invoked. A wizard fires, and it fires *inside* whatever law those impose. A
creation wizard is typically where a new element's corespine membership is first declared, which
makes it easy to mistake the wizard for the source of that law. It is not; it is where the law is
applied.

**Beware not to confuse a judgment point with a confirmation prompt.** A judgment point is a step
whose input does not exist until the operator supplies it. A confirmation prompt asks approval for
something already decided. A wizard made of confirmation prompts is a pipeline with friction — and
worse, it trains operators to click through.

---

## 6. The other four — short definitions and relationships

| Concept | Short definition | Relationship to a wizard |
|---|---|---|
| **Corespine** | a lineage of purpose — why an element exists and whose line it is in; runs through elements rather than containing them | the wizard runs inside its accumulated law and cannot exempt its output from it |
| **Overlay** | a binding concern applying across every lineage — invariant core plus scope profiles; tightens, never loosens | may add requirements, and therefore judgment points, to the wizard's steps |
| **Protocol** | a step-by-step procedure for one operation; fires, runs, finishes | the wizard's single source; mirrored 1:1; all the wizard's authority is inherited from it |
| **Pipeline** | the same protocol run where no judgment is needed | the sibling run mode; if both exist they must not diverge from each other or the protocol |

**The frame:** two standing structures (corespine, overlay), one procedure (protocol), two run
modes (wizard, pipeline).

---

## 7. Qualification test — should this be a wizard?

1. **Does a protocol exist?** A wizard with no protocol behind it is freestyle building with a
   friendly interface. If the protocol is missing, *that* is the gap — build it first.
2. **Does the protocol require in-flight judgment?** If every step is decidable at start, build a
   pipeline.
3. **Does it mirror 1:1?** Every protocol clause reachable; none added.
4. **Can it refuse?** If the only possible outcome is "created," it is a production line, not a gate.
5. **Is the output shape defined?** If two runs can produce structurally different outputs, it is
   under-specified.

---

## 8. What a wizard must hold

**The mirror rule** (existing, ratified). The protocol is the source; the wizard maps 1:1.
Ratifying a wizard means confirming it mirrors — not approving it independently.

**Named judgment points.** Every stop should be identifiable as a step that genuinely requires
judgment. A wizard asking for something already derivable is friction, and friction trains
click-through.

**Structured output.** A defined artifact shape, not free text.

**No self-ratification.** The wizard produces; authority approves. Inherited, but the most eroded
rule in practice, because a completed run *feels* like an approval.

**Refusal capability.** A wizard that can only produce is dangerous. It must be able to conclude
that the thing should not be created — refusal-first, where the default outcome of a creation wizard
is "no" until criteria are met.

---

## 9. Element inventory — the complete field list

`AUTHORITY` = only the Governor or a ratification act may write it.

### Block A — Identity

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| A1 | **Name** | registered wizard name | collides or forks |
| A2 | **ID** `AUTHORITY` | assigned identifier | phantom state |
| A3 | **Status** `AUTHORITY` | ratification position | the system acts on a self-declared status |
| A4 | **Wiring state** | declared / connected / live | a wizard claimed live that nothing invokes |
| A5 | **Invocation handle** | how it is actually called | an unreachable wizard is a document |

### Block B — Source binding

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| B1 | **Protocol reference** | the single protocol it mirrors | an ownerless executable |
| B2 | **Clause-to-step map** | explicit 1:1 mapping, clause by clause | divergence becomes undetectable |
| B3 | **Additions declaration** | anything present here and absent in the protocol | silent procedure growth in the executable layer |
| B4 | **Governing corespine and overlays** | inherited law | a wizard producing non-compliant output |

### Block C — Operator and inputs

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| C1 | **Operator type** | human / model / either | steps written for the wrong operator |
| C2 | **Input schema** | what is supplied at start | mid-run stalls, or fabricated values |
| C3 | **Preconditions** | what must be true before it runs | runs on invalid state |
| C4 | **Session/state handling** | what survives an interruption | partial runs lost or silently resumed wrong |

### Block D — The guided sequence (repeated per step)

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| D1 | **Step reference** | which protocol clause this executes | untraceable steps |
| D2 | **The question asked** | the actual prompt | vague prompts produce vague inputs |
| D3 | **Why it cannot be pre-supplied** | justifies the stop | friction steps accumulate and train click-through |
| D4 | **Acceptance criteria for the answer** | what a valid response is | any input accepted, including empty plausibility |
| D5 | **Rejection criteria** | what must be sent back | bad inputs pass and propagate |
| D6 | **Loop condition** | does this repeat until satisfied? | premature advance past an unfinished step |
| D7 | **Behaviour on non-answer** | what happens when the operator will not or cannot answer | the wizard fabricates a value to continue |

### Block E — Outcomes

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| E1 | **Output artifact shape** | what a run produces | structurally inconsistent outputs |
| E2 | **Refusal paths** | conditions under which it concludes *do not create* | a production line with no gate |
| E3 | **Cannot-do declaration** | explicitly: it does not ratify, assign IDs, or write authority fields | a completed run treated as approval |
| E4 | **Handoff** | who receives the output and for what act | outputs that go nowhere, or straight into use unratified |
| E5 | **Run record** | what a completed run leaves behind | no evidence which steps actually fired |

### Block F — Integrity

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| F1 | **Mirror verification record** | when the 1:1 map was last checked, and how | asserted rather than verified |
| F2 | **Refusal-rate note** | whether it ever actually refuses | a gate that never stops anything |
| F3 | **Rejected paths** | considered and deliberately not done | rejected designs return forever |
| F4 | **Open questions** | genuinely unresolved | false confidence |
| F5 | **Provenance** | source and verification state | inferred treated as verified |
| F6 | **Change log** | what changed, when, why | silent divergence from the protocol |

---

## 10. The three AI instruction layers

### 10.A — How to write the instruction

1. **Executable, not descriptive.** Every clause checkable as done-or-not-done.
2. **Protocol-first.** The instruction must require the protocol reference (B1) as the *first* act
   and **halt** if none exists. This is the single most important clause: a wizard built without a
   protocol is the failure this concept exists to prevent, and no later step recovers from it.
3. **Require the clause-to-step map (B2) as an explicit artifact**, not a claim of fidelity. "It
   mirrors the protocol" is unverifiable; a clause-by-clause table is checkable.
4. **Require per-step justification of the stop (D3).** Without it, wizards accumulate friction
   steps, and friction is what trains operators to click through the real ones.
5. **Require the non-answer behaviour (D7) per step.** This is where fabrication enters, and it must
   be designed rather than discovered.
6. **Require refusal paths (E2) as a mandatory block.** State that a wizard with no reachable
   refusal outcome fails review.
7. **Name the authority boundary** — the wizard never ratifies, never assigns IDs, never writes
   truth-bearing fields.
8. **Forbid inference-as-population** — unsourced elements marked MISSING with a reason.
9. **Require certainty marking.**
10. **Declare what the instruction does NOT cover.**

### 10.B — How to build the template

1. **Every slot present and empty**, with inline guidance.
2. **Steps as a repeatable sub-block** carrying all seven D-elements. A free-form step list will
   omit D3, D5 and D7 every time — those three are the ones that do the work.
3. **The clause-to-step map as a two-column table** with the protocol's clauses **pre-filled from
   the protocol**, so a missing mirror shows as an empty row rather than an absence nobody notices.
4. **Type every slot**; mandatory vs optional marked; reason code for empty mandatory slots.
5. **Order by dependency** — protocol reference → clause map → operator → steps → outcomes. Steps
   cannot be written before the clause map exists, and a template allowing it produces steps with
   no source.
6. **Mark AUTHORITY slots visually.**
7. **Make refusal paths a required section that cannot be marked N/A.**
8. **Carry the validation checklist in the template**, including a mirror check.
9. **Include a complete worked reference instance.**

### 10.C — How to populate

**Order of operations:**

1. **Existing-First.** Does a wizard for this protocol already exist under another name? Report
   *not found under checked aliases*, never *confirmed absent*.
2. **Protocol reference (B1).** If no protocol exists, **stop and report the gap.** Do not proceed
   to build the wizard first and write the protocol afterwards — the resulting protocol will be a
   description of the wizard rather than its source.
3. **Clause-to-step map (B2).** Enumerate every protocol clause before writing any step.
4. **Judgment points.** Read them off the protocol's own judgment-point field. If the protocol has
   none, **stop** — this should be a pipeline.
5. **Operator and inputs (C1–C4).**
6. **Steps (D1–D7)**, one at a time, each with question, justification, acceptance, rejection, loop
   condition, and non-answer behaviour.
7. **Outcomes (E1–E5).** E2 before E1 — designing refusal before output prevents a wizard whose
   only shape is "produced."
8. **Integrity (F1–F6).**
9. **Identity (A1, A4, A5).** Leave A2 and A3 empty.

**Rules for every element:**

- One stated source per value; the source itself, never a paraphrase.
- Certainty marked.
- Unknown → MISSING with a reason.
- Never populate an AUTHORITY element.
- If a step cannot be mapped to a protocol clause, **stop and report** — either the protocol is
  incomplete or the step does not belong. Do not add it and note it later.

---

## 11. Worked examples

| Wizard | Protocol mirrored | Judgment gathered |
|---|---|---|
| Plan wizard | the plan protocol | scope, blast level, what the plan is actually for |
| Corespine creation wizard | embedded inline (declared combined node) | the goal — via a dialogue that refuses to draft on the operator's behalf and will not advance until a goal is defined and saved |
| Meta-wizard | the meta-protocol | the concern the new protocol owns, and its boundary |

The corespine creation wizard illustrates §3 precisely: its first step is a goal-setting dialogue
that explicitly refuses to draft the goal for the operator and refuses to advance until one is
defined and saved. That input does not exist until someone supplies it. That is why the protocol
needs a wizard rather than a pipeline.

**Not wizards:** a form that collects fields (no protocol, no judgment, no refusal); a pipeline with
a confirmation at the end; a checklist.

**The combined-node exception.** At least one existing node is a declared combined
protocol-and-wizard, documented as a deliberate one-home exception. The split is a **strong default,
not an invariant** — a second combined node must be a conscious, documented decision.

---

## 12. Open questions

1. **The wizard→pipeline conversion path.** §3 identifies removing judgment as the lever. No
   mechanism exists for noticing when a judgment point has *become* decidable and should be promoted
   into automation. A real optimisation surface, unbuilt.
2. **Refusal-rate as a health metric.** A creation wizard that never refuses is either perfectly fed
   or not actually gating. Nothing measures this.
3. **Combined-node rule.** Unstated — see §11.
4. **Mirror divergence detection.** The 1:1 map is required; how divergence is *detected* rather
   than asserted is unspecified.
5. **Sealing.** Not sealed.

---

## 13. Provenance and verification status

Merged from Brain's working session and a CISEM (Sonnet) framing received 2026-08-07. CISEM's "you
can't use a protocol directly — you use its wizard" is adopted. Its interactive-vs-automated axis is
**replaced**, with the falsifier stated in §3. The mirror rule and combined-node exception restate
existing ratified material from a project-knowledge snapshot predating the current architecture
range; not verified against the live repo. **Nothing here is CISEM state.**
