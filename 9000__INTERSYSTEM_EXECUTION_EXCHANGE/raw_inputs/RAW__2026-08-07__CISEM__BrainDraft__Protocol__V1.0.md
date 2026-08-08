# Protocol — Complete Definition and Population Standard

**Status: BRAIN DRAFT — RAW-EXTERNAL. Not CISEM state.**
No ID assigned. No truth-bearing field written. Produced by Brain (Claude.ai), 2026-08-07.
Requires CISEM Existing-First verification at repo level, then Governor ratification.

**One of five.** Corespine · Overlay · Protocol · Wizard · Pipeline. Each is standalone; all five
share one skeleton so they can be validated against each other.

**Revision 2 — 2026-08-07 (changes visible, not silent).** Rebuilt as a standalone document.
Added: background, problem statement, confusion guards, the complete element inventory (§9), and
the three AI instruction layers (§10). Retained: standing-vs-firing, the judgment-point field, and
the combined-node exception. Nothing removed.

---

## 1. Background — why this concept exists

Corespines say what must be true. Overlays say what constraints apply. Neither tells anyone *how
to do anything*.

That gap is where most organisational knowledge lives and where most of it is lost — in the head of
whoever last did the thing. A protocol is the act of moving that knowledge out of a head and into a
form two different operators can follow to the same result.

## 2. The problem it solves

Without protocols:

**Every run is a first run.** The same operation is re-derived each time, with different steps and
different gaps.

**Quality tracks whoever happened to do it.** There is no floor, only individual competence.

**Nothing can be audited.** You cannot check whether a procedure was followed if no procedure was
written.

**Improvement does not accumulate.** A lesson learned in one run does not reach the next, because
there is no artifact to write it into.

And one failure specific to AI systems: **freestyle building**. An AI asked to do an operation with
no protocol will invent a plausible one, execute it confidently, and leave no trace of which steps
it skipped.

## 3. The solution — the definition

> A protocol is a **step-by-step procedure for one specific operation**. It prescribes the sequence,
> the gates, and the decision points. It is invoked, it runs, it finishes.

**The one-line form:** a protocol is the playbook for doing one thing correctly, every time.

### What makes it *one* protocol

Scope discipline is what keeps protocols usable. One protocol covers **one operation** — how to
make a plan, how to harvest a session, how to audit invariants. A protocol covering "planning and
building and reviewing" is three protocols that were allowed to merge; it will be unmaintainable
within a few revisions and unfollowable before that.

> **The test:** can you name the operation as a verb phrase? "Create a plan" — yes. "Governance" —
> no, that is standing structure.

### The discriminator — standing vs firing

This is what separates a protocol from a corespine or overlay, and it matters because all three
constrain and all three have gates.

> A **corespine** and an **overlay** are always on. No start, no end, nothing invokes them.
> A **protocol** fires. It is invoked, it runs, it finishes.
>
> **The test:** ask *"when did it run?"* An answer means protocol. A meaningless question means
> standing structure.

A protocol runs **inside** the constraints its governing corespine and applicable overlays impose.
It never overrides them and cannot exempt itself from them.

---

## 4. A protocol is NOT

- **Not a corespine.** It fires; a corespine is always on.
- **Not an overlay.** It runs at a moment; an overlay applies continuously.
- **Not a wizard or a pipeline.** Those are its *execution modes*. A protocol is the specification;
  you cannot run a specification.
- **Not a checklist.** A checklist may be a component of a protocol; alone it lacks sequence,
  gates, preconditions and failure handling.
- **Not a description of how things are usually done.** Prose that describes is not procedure that
  prescribes.
- **Not a policy.** Policy says what must be true; a protocol says what to do in what order.
- **Not multi-operation.** One verb phrase or it is not one protocol.
- **Not self-ratifying.** A protocol that has run is not thereby approved.

---

## 5. Confusion guards

**Beware not to confuse a protocol with a CORESPINE**, which is a lineage of purpose — *why an
element exists and whose line it belongs to*. Both have gates, so gate-presence separates nothing.
Use standing-vs-firing. A corespine's gates fire *within* protocols; the corespine itself never
runs.

**Beware not to confuse a protocol with a WIZARD**, which is the protocol made runnable where
judgment is gathered in flight. The protocol is the source of truth; the wizard mirrors it 1:1.
The most common error here is writing the procedure *inside* the wizard and leaving no protocol
behind it — at which point the executable form is the only record, and it cannot be reviewed
independently of being run. (There is one documented exception; see §11.)

**Beware not to confuse a protocol with a PIPELINE**, which is the protocol made runnable where no
judgment is needed. Same relationship, same warning — an automated chain with no protocol behind it
is automated freestyle building, and it is worse than the manual kind because it scales.

**Beware not to confuse a protocol with an OVERLAY.** An overlay may be *enforced by* a protocol;
that does not make them the same. The overlay states the constraint; the protocol is one occasion
on which the constraint is checked.

**Beware not to confuse a step with a gate.** A step is work performed. A gate is a decision that
can *stop* the run. A protocol whose gates are all steps has no stopping power and is a suggestion.

---

## 6. The other four — short definitions and relationships

| Concept | Short definition | Relationship to a protocol |
|---|---|---|
| **Corespine** | a lineage of purpose — why an element exists and whose line it is in; runs through elements rather than containing them | a protocol declares exactly one governing corespine and runs inside its accumulated law |
| **Overlay** | a binding concern applying across every lineage — invariant core plus scope profiles; tightens, never loosens | overlays constrain a protocol's steps; they may add requirements, never relax them |
| **Wizard** | the protocol made runnable, judgment gathered in flight | mirrors this protocol 1:1; used when steps need input that cannot be pre-supplied |
| **Pipeline** | the protocol made runnable, no judgment needed | mirrors this protocol 1:1; used when every step is decidable at start |

**The frame:** two standing structures (corespine, overlay), one procedure (protocol), two run
modes (wizard, pipeline).

---

## 7. Qualification test — should this be a protocol?

1. **Verb phrase.** Can you name the operation as one verb phrase? If not, it is probably standing
   structure.
2. **Firing.** Does *"when did it run?"* have an answer?
3. **One operation.** Exactly one, or has it absorbed neighbours?
4. **Followable.** Could two different operators follow it and produce the same shape of output?
   If it reads as description, it is not yet a protocol.
5. **Governed.** Which corespine does it run inside, and which overlays constrain it? No governing
   lineage means it is floating.

**Refusal-first:** the default answer is *no*. Most candidate protocols are either components of an
existing one or standing structure misfiled.

---

## 8. Run modes

A protocol is **not directly usable**. It is the specification. You use it through a run mode:

- a **wizard** — judgment gathered in flight
- a **pipeline** — no judgment needed

A protocol may have one, the other, or both. When it has both, they execute the *same* protocol and
must not diverge — the protocol is the single authority; run modes are its executable forms.

**The mirror rule** (existing, ratified): the protocol is the source; a run mode is verified to map
1:1 to its clauses. Ratifying a run mode means confirming it mirrors — not approving it separately.

**Which mode a protocol needs is determined by one of its own fields:** the judgment points (D3
below). Steps requiring in-flight input make it a wizard; none makes it a pipeline. This is not a
style choice — it is read off the protocol.

---

## 9. Element inventory — the complete field list

`AUTHORITY` = only the Governor or a ratification act may write it.

### Block A — Identity

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| A1 | **Name** | registered protocol name | collides or forks |
| A2 | **ID** `AUTHORITY` | assigned identifier | phantom state |
| A3 | **Status** `AUTHORITY` | ratification position | the system acts on a self-declared status |
| A4 | **Wiring state** | declared / connected / live | "done" claimed on an unwired procedure |
| A5 | **Position in schema** | where it sits | floating procedure |

### Block B — Purpose and governance

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| B1 | **Operation, as a verb phrase** | forces single-operation scope | multi-operation sprawl |
| B2 | **Goal, measurable** | what a successful run achieves | success becomes a matter of opinion |
| B3 | **Governing corespine** | the lineage it runs inside | ungoverned procedure |
| B4 | **Constraining overlays** | which cross-cutting concerns apply | constraints silently skipped |
| B5 | **Does NOT cover** | the explicit scope boundary | protocols expand into each other |

### Block C — Entry conditions

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| C1 | **Trigger** | what invokes it | runs at the wrong time or never |
| C2 | **Preconditions** | what must be true before it starts | runs on invalid state and produces confident garbage |
| C3 | **Required inputs** | what the operator must bring | mid-run stalls, or fabricated inputs |
| C4 | **Refusal conditions** | when it must decline to run | runs when it should have stopped |

### Block D — The procedure

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| D1 | **Numbered steps, as executable actions** | the procedure itself | description instead of prescription; unrepeatable |
| D2 | **Gates** | decisions that can stop the run | a protocol with no stopping power is a suggestion |
| D3 | **Judgment points** | which steps need input that cannot be pre-supplied | **determines wizard vs pipeline**; wrong here means the wrong run mode gets built |
| D4 | **Per-step acceptance criteria** | what makes a step complete | steps marked done that were not |
| D5 | **Loop conditions** | which steps repeat until satisfied | premature advance past an unfinished step |
| D6 | **Failure and abort handling** | what happens when a step fails | half-executed runs leaving inconsistent state |
| D7 | **Rollback** | how to undo a partial run | no path back from a bad run |

### Block E — Output

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| E1 | **Output artifact shape** | what a run produces | structurally different outputs from the same protocol |
| E2 | **Definition of done for a run** | when the run is complete | "done" declared on partial execution |
| E3 | **Verification requirement** | what proves the run was correct | completion asserted rather than shown |
| E4 | **Handoff** | who or what receives the output | outputs that go nowhere |

### Block F — Modes and integrity

| # | Element | Purpose | Failure if wrong |
|---|---|---|---|
| F1 | **Run-mode references** | its wizard, its pipeline, or both | the protocol is unusable, or an unratified executable exists with no source |
| F2 | **Single-home declaration** | this protocol is the one authority for its concern | duplicate procedures diverge |
| F3 | **Self-compliance note** | does it obey its own rules? | protocols that violate their own standard |
| F4 | **Rejected paths** | considered and deliberately not done | rejected approaches return forever |
| F5 | **Ratification path** | how it becomes authoritative | provisional procedures used as final |
| F6 | **Open questions** | genuinely unresolved | false confidence |
| F7 | **Provenance** | source and verification state | inferred treated as verified |
| F8 | **Change log** | what changed, when, why | silent structural change |

---

## 10. The three AI instruction layers

### 10.A — How to write the instruction

1. **Executable, not descriptive.** Every clause checkable as done-or-not-done. This applies with
   double force here — an instruction for writing procedures that is itself prose teaches the
   wrong shape by example.
2. **Refusal-first.** Default *do not create*; most candidates are components of an existing
   protocol or standing structure misfiled.
3. **Force the verb phrase first.** The instruction must require B1 before anything else, because
   it is the only thing that prevents multi-operation sprawl, and sprawl cannot be fixed later
   without a full rewrite.
4. **Require judgment points to be marked deliberately (D3)**, not inferred at the end. This field
   determines which run mode gets built; deferring it means the run mode is chosen by whoever
   builds it rather than by the protocol.
5. **Distinguish step from gate explicitly**, with an example of each. Left implicit, everything
   becomes a step and the protocol loses stopping power.
6. **Per-element acceptance and rejection criteria**, plus worked example and counter-example.
7. **Name the authority boundary.**
8. **Forbid inference-as-population** — unsourced elements marked MISSING with a reason.
9. **Require certainty marking** — confirmed / inferred / assumed.
10. **Declare what the instruction does NOT cover.**

### 10.B — How to build the template

1. **Every slot present and empty**, with inline guidance — what goes here, what does not.
2. **Steps as a repeatable sub-block**, each carrying its own acceptance criteria, gate flag, and
   judgment flag. A free-form numbered list will silently omit those three per step, which is where
   the value is.
3. **Type every slot**; mandatory vs optional marked; reason code required for empty mandatory
   slots.
4. **Order by dependency** — operation → goal → governance → preconditions → steps → output →
   modes. Steps cannot be written before the boundary exists, and a template permitting it produces
   steps that quietly exceed scope.
5. **Put the gate flag and judgment flag adjacent to each step**, not in a summary table. Proximity
   is what makes the classification actually happen.
6. **Mark AUTHORITY slots visually.**
7. **Carry the validation checklist in the template**, including a self-compliance check.
8. **Include a complete worked reference instance.**

### 10.C — How to populate

**Order of operations:**

1. **Existing-First.** Does a protocol for this operation already exist under another name? Report
   *not found under checked aliases*, never *confirmed absent*. A near-match is an enhancement
   candidate, not a reason to create a sibling.
2. **Operation as a verb phrase (B1).** If it takes more than one verb phrase, **stop** — this is
   two or more protocols.
3. **Goal and governance (B2–B4).** Identify the governing corespine *before* writing steps;
   inherited law shapes what the steps are allowed to do.
4. **Boundary (B5).** Written before the steps, not after. A boundary written afterwards describes
   what was produced rather than constraining it.
5. **Entry conditions (C1–C4).**
6. **Steps (D1–D7).** One at a time. For each: is it a step or a gate? Does it require judgment
   that cannot be pre-supplied? What makes it complete? What happens if it fails?
7. **Output (E1–E4).**
8. **Modes (F1).** Read off D3 — judgment points present means wizard; none means pipeline; some
   means both, split at the judgment boundary.
9. **Integrity (F2–F8).**
10. **Identity (A1, A4, A5).** Leave A2 and A3 empty.

**Rules for every element:**

- One stated source per value; the source itself, never a paraphrase.
- Certainty marked.
- Unknown → MISSING with a reason.
- Never populate an AUTHORITY element.
- If the steps cannot be written without violating the governing corespine's law, **stop and
  report the conflict.** Do not write the violation and flag it later.

---

## 11. Worked examples

| Protocol | Operation | Run mode |
|---|---|---|
| Plan protocol | how to create a plan | wizard |
| Harvest protocol | how to extract a session's learnings | pipeline |
| Meta-protocol | how to create any protocol | wizard |
| Corespine creation | how to create a corespine | combined node — see below |
| Skill ingestion | how to absorb an external skill | staged; partly automated |

**Not protocols:** *Governance* — not a verb phrase, never fires; standing structure. *A checklist
inside a protocol* — a component. *"Be careful about X"* — a constraint belonging in a corespine or
overlay.

**The combined-node exception.** At least one existing node is a declared combined
protocol-and-wizard: the corespine creation wizard embeds its protocol inline rather than pointing
at a separate file, documented as a deliberate one-home exception. This means the protocol/wizard
split is a **strong default, not an invariant** — a second combined node should be a conscious,
documented decision, never drift.

---

## 12. Open questions

1. **Combined protocol-wizard nodes.** One exists and is documented. Is the exception
   case-by-case, or does a rule govern when combining is legitimate? Unstated.
2. **Protocol-to-protocol invocation.** Protocols call each other. No stated rule for nesting depth
   or how failure propagates back up.
3. **Where a protocol's overlay constraints are recorded** — in the protocol, or in the overlay's
   scope profile? Same unresolved question as Overlay §12.3.
4. **Partial run modes.** A protocol automated for four steps with judgment on the fifth has no
   name. Unnamed things drift.
5. **Sealing.** Not sealed.

---

## 13. Provenance and verification status

Merged from Brain's working session and a CISEM (Sonnet) framing received 2026-08-07. CISEM's
"protocol = the playbook, one specific operation" is adopted; its ARE/DO framing is replaced by
standing-vs-firing, which survives the corespine-vs-overlay and corespine-vs-protocol boundaries
that ARE/DO does not. Structural requirements in §9 restate an existing ratified meta-protocol from
a project-knowledge snapshot predating the current architecture range; not verified against the
live repo. **Nothing here is CISEM state.**
