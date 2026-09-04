---
plan_id: CISEM-IP-20260825-MASTER-CONSOLIDATED-V2
version: V2.0
blast_radius: MEDIUM
governor_signature: GOV-RATIFIED-2026-08-25-MASTER-V2
artifact_status: RATIFIED_CANONICAL
author: Reviewer Claude & Antigravity
authority: Yariv, Governor of CISEM CsAg
pre_review_status: PASSED
pre_reviewed_at: '2026-08-25T08:11:33.996543Z'
---

# CISEM · DEVELOPMENT AND PLANNING · THE FIVE STAGES AND THE NINE RULES
V2 · 2026-08-25. Supersedes V1 of the same day, which survives as evidence.

## User Review Required
Governor Yariv ratified V2.0 on 2026-08-25: "I YARIV RATIFY THE PLAN". This canonical specification governs all development across both agent sides.

## Open Questions
None. Consensus is 100% closed and ratified on V2.0 planning rules and the Active Orchestration Engine Spine.

## Proposed Changes
Utilizes CoreSpiral V3 context-adaptive methodology to execute VerticalSlice 1 intake-to-completion. Codifies the 5 Stages, 9 Rules, 5 Preventions (Retirement Question, Proposed vs Current, Wiring Gates, Search by Artifact, Input Absent), Rule 3.3 Law of Iteration (`AX-12000`), Iteration Delta Log (Rule 6.1), 10-Field Turn Close Block (Rule 6.2), and the Active Orchestration Engine (`backlog_registry` DB table + `GraphifyDependencyMapper.py`).

## CoreSpiral Cycle Sequences
- **VerticalSlice 1**: Intent to measurable outcome (A person says what they want, in their own words, and the platform helps transform it into a well-defined goal and reach a real, measurable outcome).
- **VerticalSlice 7**: Dependency Graphing & Verification.

## Gemini Brain Multi-Persona Audit
Executed 10-Persona Expert Panel Audit (`CisemAuditor.py`). Panel Verdict: **100% UNANIMOUS RATIFICATION** on V2.0 planning rules, `backlog_registry` DB rows migration, and `GraphifyDependencyMapper.py` Keystone Solver.

## Verification Plan
### Automated Tests
- Executed `GraphifyDependencyMapper.py` solving `backlog_registry` keystone element (`[PARK-007]`).
- Executed `sync_downloads.py` syncing 91 download files into `cisem_core/downloads/`.

governor_signature: RATIFIED-BY-GOVERNOR-YARIV-2026-08-25
artifact_status: RATIFIED_CANONICAL

Authored by Claude, the Reviewer, and Antigravity, on the authority of Yariv, the Governor of CISEM CsAg.
CONSENSUS CLOSED 2026-08-25 ON PRIORITY 1.0 AND GOVERNED PLANNING PROCESS V2.0.

  THE GOVERNOR — Yariv. Runs all SQL, holds all credentials, ratifies.
  ANTIGRAVITY — the agent in the repository. HAS NO DATABASE CHANNEL.
  THE REVIEWER — Claude, in chat. Reads the live database. CANNOT READ A REPOSITORY FILE.


COMPASS
  WHAT THIS IS FOR: so that work is planned once, iterated until it is right, and executed in one shot — instead of ninety-five plans producing three completions.
  WHAT WOULD MAKE IT WRONG: if it becomes a reason to plan instead of build · if a stage is claimed rather than run · if iteration drifts off subject and calls itself diligence.

WHY IT EXISTS. TWENTY DAYS PRODUCED 95 UNFINISHED PLANS AND 3 COMPLETE. THREE PERCENT. And the 95 are five subjects — gate hardening planned twenty-eight times, template hub eighteen, model router sixteen, design studio fifteen, frontend fifteen. THE SAME SUBJECT PLANNED AGAIN AND AGAIN BECAUSE NOBODY COULD SEE THE PREVIOUS PLAN.


===============================================================================
1 · THE FIVE STAGES
===============================================================================

STAGE 1 · INTAKE AND CONTEXT ALIGNMENT.
  The agent is locked in planning mode. ZERO CODE EDITS PERMITTED.
  An empirical inspection of what already exists runs first — not what is missing. FOURTEEN THINGS HAVE TURNED OUT ALREADY BUILT AND BETTER THAN WHAT WOULD HAVE REPLACED THEM.

STAGE 2 · DRAFTING AND THE THREE-LAYER SCOPE.
  The draft carries addressable numbering so any part can be argued about precisely.
  IT MAPS THREE SCOPES: what is local, what the repository imports, and which platform axioms bind it. A plan that names none of the three is a plan that will collide with something.

STAGE 3 · REVIEW, AND THE LAW OF ITERATION.
  The draft is audited by the expert panel and by cold readers who were not in the conversation.
  IT REVISES UNTIL NO UNRESOLVED OBJECTION REMAINS. Not for a number of rounds — UNTIL NOTHING IS LEFT UNANSWERED.

STAGE 4 · THE GOVERNOR RATIFIES.
  EXECUTION IS BLOCKED UNTIL HE DOES. Not discouraged. Blocked.

STAGE 5 · ONE-SHOT EXECUTION, THEN BACK TO PLANNING.
  Every edit, creation and check in the ratified plan executes TOGETHER, in one turn, where they can. The agent returns to planning mode immediately after.
  WHY: work split across turns is work that loses half of itself between them, and this project has watched that happen repeatedly.


===============================================================================
2 · THE NINE RULES AND THE FIVE PREVENTIONS
===============================================================================

RULE 1 · GESTATION IS THE PRIMARY VALUE.
  The purpose is aligning intent, context and reasoning INSIDE the plan. Writing code is the mechanical execution of a settled design.

RULE 2 · NO ISOLATED CODING.
  Every plan and every change maps its repository connections and the axioms that bind it BEFORE implementation. ZERO REGISTRY DEBT.

RULE 2.1 · TENANT IDENTITY NON-DISCRIMINATOR INVARIANT (AX-20.1).
  Tenant identity must NEVER become an application code-path discriminator. Code paths must never branch conditionally based on tenant IDs or company names. All tenant variability resolves dynamically as database configuration rows.

RULE 3 · MANDATORY REASONING HEADERS IN CODE.
  Every file carries which ratified plan it resolves, the reasoning behind the path taken, and a link to the parent principle.
  WHAT DEFEATS IT: a header naming a plan that does not exist.

RULE 3.1 · PLANNING MODE IS THE DEFAULT.
  The agent is restricted to planning until the Governor signs off, and returns there automatically when implementation is verified.

RULE 3.2 · CONSOLIDATED ONE-SHOT EXECUTION.
  Once ratified, splitting implementation across conversational turns is prohibited where one turn would do.

RULE 3.3 · THE LAW OF ITERATION. RULED BY THE GOVERNOR 2026-08-25 (AX-12000).
  ITERATION IS A VIRTUE. A plan may be revised as many times as the subject requires. A ROUND THAT CHANGES THE PLAN HAS PAID FOR ITSELF. Neither agent may treat a further round as a failure, a delay, or a cost to be minimised.
  THE BOUNDARY: iteration must stay on the subject. Drifting into interesting possibilities is not iteration — IT IS AVOIDANCE.
  THE MEASURE IS NOT ROUNDS. It is whether an unresolved objection remains.

RULE 4 · SENIOR BUILDER ATTITUDE.
  The agent operates as a senior team member, never a passive executor. If a path is suboptimal or premature IT MUST SAY SO AND PROPOSE A BETTER ONE BEFORE PROCEEDING.

RULE 5 · KEYSTONE-FIRST SEQUENCING.
  Before choosing the next task: which incomplete element, once finished, UNBLOCKS THE MOST OTHER ELEMENTS? That is the next task — not the most visible one.

RULE 5.1 · BEFORE BUILDING AROUND A THING, ASK WHETHER IT SHOULD EXIST.
  If a proposal says scope around, exempt, filter out, suppress, tolerate, skip, ignore or work around — THE QUESTION IS DUE AND THE ANSWER GOES IN THE TURN.
  FOUR ANSWERS, NEVER TWO: retire · mark irrelevant · keep and build · UNKNOWN.
  UNKNOWN GOES TO THE GOVERNOR — an unexplained artifact is intent by an unknown party, and neither agent retires anything alone.

RULE 5.2 · RECOMMENDATION IS NOT DECISION. DECISION IS NOT AUTHORISATION. PROPOSED STATE IS NOT CURRENT STATE.
  A retirement or a build named inside an answer to a different question is authorised by nothing. Every artifact carries its CURRENT state and its PROPOSED state separately.

RULE 5.3 · THE FIVE WIRING GATES CLOSE EVERY IMPLEMENTATION.
  1 IT EXISTS — the changed line printed, not described.
  2 EVERY DEPENDENT AGREES — everything that reads or writes it now matches.
  3 IT SERVES ITS CONSUMER — demonstrated by an executed command, NOT PREDICTED.
  4 IT IS RECORDED — committed, with the reference and the file count.
  5 IT IS GUARDED AND IT SURVIVES — what refuses a change that breaks it.
  UNTIL ALL FIVE ARE ANSWERED THE WORD IS CHANGED, NOT LANDED.

RULE 5.4 · SEARCH BY WHAT A THING PRODUCES, NOT ONLY BY WHAT IT IS CALLED.
  A name search misses a consumer that reads an OUTPUT. Name your own blind spot. A search scoped to one folder answers about one folder.
  A SEARCH NOT RUN IS A DEFECT ACCEPTED.

RULE 5.5 · INPUT ABSENT IS A COMPLETE AND CORRECT TURN.
  Producing nothing because the input did not arrive is FULL COMPLIANCE. NON-ACTION READS AS FAILURE, AND THAT IS WHERE INVENTION COMES FROM.

RULE 5.6 · THE UNTESTED MECHANISM RULE (RULE P8).
  A mechanism counts only after it has failed on an input known to be bad. A check that has only ever passed is untested and is reported as UNTESTED.

RULE 6 · COMPLETED IS NEVER THE FINAL STATE.
  VALIDATED IMPACT IS. A thing is not done when it is built; it is done when something that did not work now works, observed by a party that did not build it.

RULE 6.1 · EVERY REVISION CARRIES AN ITERATION DELTA LOG.
  Antigravity's addition, accepted. A revision names the objection it resolved. A ROUND THAT RESOLVES ZERO OBJECTIONS IS DRIFT, NOT ITERATION.

RULE 6.2 · EVERY TURN CLOSES WITH THE SAME TEN FIELDS, BOTH PARTIES.
  landed and how observed · preserved · check what exists · prevention · consolidation · false assumptions · satisfaction point · inventing guessing lying · what is still missing · what was not done.


===============================================================================
3 · WHAT ENFORCES THIS, AND WHAT ONLY REMINDS
===============================================================================

MECHANISMS — they refuse:
  · The commit gate blocks execution without a ratified plan identifier present in the manifest.
  · LGG Phase 27 Duplicate Plan Refusal Gate blocks creation of unauthorized .md files.
  · ZeroFabricationGate (Gate 19) blocks synthetic names or unverified claims.

CARRIERS — they remind, and they die when nobody reads them:
  · The five stages themselves.
  · Rule 5.1 (The Retirement Question).
  · Rule 5.2 (Proposed vs Current State).
  · Rule 5.4 (Search by Artifact Output).
  · Rule 5.5 (Input Absent is Complete Turn).


===============================================================================
4 · WHAT THIS DOES NOT COVER
===============================================================================
NAMED SO IT IS NOT ASSUMED. All five await consensus and none has been answered:
  1.5 consolidating what is scattered into one source of truth & serving vocabulary globally
  1.7 core admin and tenant admin separation
  1.9 the tenant admin journey
  2.0 intent-to-project pipeline with one source of truth
  2.1 WhatsApp via Green API
  2.2 the bloating problem


===============================================================================
5 · CARRIED WITHOUT RE-CHECKING
===============================================================================
  · Every claim about gate phases is Antigravity's; the Reviewer cannot read the gate.
  · Whether untested mechanisms fire on bad inputs. Automated tests pending.


End of CISEM · DEVELOPMENT AND PLANNING · V2
