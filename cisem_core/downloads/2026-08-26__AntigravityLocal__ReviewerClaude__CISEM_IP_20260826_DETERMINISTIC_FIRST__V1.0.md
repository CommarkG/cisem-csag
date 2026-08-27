# CISEM · PLAN · DETERMINISTIC FIRST
CYCLE ONE IS HARDCODED. AI POCKETS ARE DISCOVERED, NOT DESIGNED.
PLAN ID: CISEM-IP-20260826-DETERMINISTIC-FIRST
DRAFT V1 · 2026-08-26

governor_signature: UNRATIFIED-DRAFT-IN-PROGRESS
artifact_status: DRAFT

Authored by Claude, the Reviewer, from the Governor's own proposal made
2026-08-25. TO BE SAVED TO DISK IN THE REPOSITORY. Antigravity has not seen it.

  THE GOVERNOR — Yariv. Runs all SQL, holds all credentials, ratifies.
  ANTIGRAVITY — the agent in the repository. HAS NO DATABASE CHANNEL.
  THE REVIEWER — Claude, in chat. Reads the live database. CANNOT READ A
    REPOSITORY FILE.


COMPASS
  WHAT THIS IS FOR: so the first working cycle runs with the language model
  switched off, and every place that genuinely needs intelligence is FOUND BY
  HITTING IT rather than guessed at in advance.
  WHAT WOULD MAKE IT WRONG: if "hardcoded" is read as hardcoded VALUES ·
  if a pocket is declared before the deterministic path has actually failed ·
  if it becomes a reason to defer the pipeline rather than to finish it.


===============================================================================
1 · THE GOVERNOR'S PROPOSAL, IN HIS OWN TERMS
===============================================================================
Made 2026-08-25 and agreed by the Reviewer in the same turn.

  Build the first cycle HARDCODED ONLY. Built BY AI, but with NO LIVE MODEL
  ENGINE INSIDE THE PRODUCT.
  Then come back and ask WHAT AI POCKETS WOULD IMPROVE THE OUTCOME.

WHY IT IS RIGHT, AND THE REASONING IS THE WHOLE PLAN:
A MODEL HIDES GAPS BY PRODUCING SOMETHING PLAUSIBLE. DETERMINISTIC CODE CANNOT.
If a route has no rule for what happens when a tenant has no members, it FAILS
VISIBLY — and that failure is the design decision this project keeps deferring.

AND IT INVERTS THE CURRENT ORDER. Today the intelligence is load-bearing and the
structure is thin. Reversed, THE PLATFORM WORKS WITH THE MODEL SWITCHED OFF, and
a model then improves outcomes rather than producing them.

THE EVIDENCE THAT IT IS ALREADY TRUE: the intake-to-project steps were written
out in full across eight steps, and EXACTLY ONE HONEST AI POCKET APPEARED —
matching free language to a catalogue. EVERYTHING ELSE WAS A QUERY OR A RULE.
Neither party expected that ratio.


===============================================================================
2 · WHAT HARDCODED MEANS, AND WHAT IT DOES NOT
===============================================================================
THIS SECTION EXISTS BECAUSE THE WORD WILL BE MISREAD.

  HARDCODED MEANS: DETERMINISTIC LOGIC. Given the same inputs, the same output,
  every time, with no model in the path.

  HARDCODED DOES NOT MEAN HARDCODED VALUES. The platform's first law stands:
  A VALUE THAT COULD DIFFER BETWEEN TWO TENANTS, TWO INDUSTRIES OR TWO MOMENTS
  IS A ROW.
  Deterministic logic READS CONFIGURATION ROWS. It does not carry constants.

THE EVIDENCE THAT THIS DISTINCTION IS NOT ACADEMIC — every one of these was a
hardcoded VALUE, and every one was a defect:
  · 29 real people's names and emails written into backend code.
  · A fallback member roster returned to any tenant that asked.
  · 'TENANT-SESSION-ACTIVE' rendered on screen as a tenant identifier.
  · A user's identifier proposed as a company's identifier, FOUR TIMES.
  · An invented status code refused by a foreign key.
DETERMINISTIC LOGIC WOULD HAVE PREVENTED NONE OF THOSE. CONFIGURATION-AS-DATA
WOULD HAVE PREVENTED ALL OF THEM.


===============================================================================
3 · THE ONE THING TO FINISH BEFORE ANYTHING ELSE
===============================================================================
THE GOVERNOR HAS ASKED FOR COMPLETION BEFORE ENHANCEMENT AND THIS PLAN OBEYS IT.

  STAGE 1 OF PLAN-CISEM-20260826-ITP-WIRING IS NOT DONE.
  ZERO ROWS EXIST IN `inquiries`. The Governor's own query, 2026-08-26.

NOTHING IN SECTIONS 4 AND 5 STARTS UNTIL A ROW HE TYPED COMES BACK OUT OF
POSTGRESQL. That is the completion this plan is subordinate to, and it is the
only thing standing between three weeks of foundation and a working pipeline.

AND THE THREE OPEN FIXES BELONG TO THAT COMPLETION, NOT TO THIS PLAN:
  · The x-tenant-id header read at main.py:146 — a caller may name their own
    tenant.
  · Every 'TENANT-SESSION-ACTIVE' fallback, with NO substitute value.
  · The intake screen mounted and reachable from the navigation.


===============================================================================
4 · THE RULE FOR CYCLE ONE
===============================================================================

  CYCLE ONE CONTAINS NO LANGUAGE MODEL IN ANY REQUEST PATH.

Every step of intake-to-project is answered by one of three things, and the
order they are tried in is fixed:

  DERIVED · a query. The system asks itself and answers from a row.
    TRIED FIRST, ALWAYS. A question answerable from data MUST NEVER REACH A
    PERSON OR A MODEL.
  RULE · deterministic logic reading configuration rows.
  ASKED · put to a person, one question at a time.

WHAT HAPPENS WHERE NONE OF THE THREE WORKS: THE STEP STOPS AND SAYS WHICH ANSWER
IS MISSING. It does not proceed with a plausible one.
THAT STOP IS THE MOST VALUABLE OUTPUT OF CYCLE ONE — IT IS AN AI POCKET
ANNOUNCING ITSELF WITH EVIDENCE.

AND THE HONEST PLACEHOLDER: where a model would eventually match free language
to a catalogue, cycle one presents the catalogue and the person chooses. SLOWER,
CORRECT, AND IT SHIPS.


===============================================================================
5 · HOW AN AI POCKET IS DECLARED
===============================================================================
A POCKET IS EARNED, NEVER ASSUMED. This is the section that prevents the plan
being read as a delay tactic.

A CANDIDATE POCKET EXISTS WHEN ALL FOUR ARE TRUE:
  1 · THE DETERMINISTIC PATH WAS BUILT AND RAN. Not skipped. Not estimated.
  2 · IT PRODUCED A STOP OR A BAD OUTCOME, AND THE INSTANCE IS RECORDED — what
      was asked, what happened, when.
  3 · NO QUERY AND NO RULE CAN ANSWER IT. If a lookup exists, IT IS NOT A
      POCKET. "What did we quote the bank last year" IS A QUERY, and a model
      asked it will answer plausibly and wrongly.
  4 · THE MODEL PROPOSES AND NEVER DECIDES. It returns candidates; a person
      chooses. WHERE IT WOULD DECIDE, IT IS NOT A POCKET.

AND EVERY POCKET DECLARES THREE THINGS BEFORE IT IS BUILT:
  · WHAT IT DOES WHEN THE MODEL IS UNAVAILABLE OR RATE-LIMITED. The
    deterministic path must still be there — A POCKET IS AN IMPROVEMENT, NEVER A
    DEPENDENCY.
  · HOW A WRONG ANSWER IS CAUGHT. Every pocket needs its correct and incorrect
    examples, accumulated from real cases.
  · WHAT IT COSTS PER CALL, AND WHO PAYS.

THE ONE CANDIDATE VISIBLE TODAY: matching free language to a catalogue at Step
5. IT HAS NOT MET CONDITION 1 — the deterministic version has never run.


===============================================================================
6 · WHAT THIS PLAN DOES NOT AUTHORISE
===============================================================================
  · Any model call in any request path during cycle one.
  · Building the catalogue matcher before the deterministic path has run.
  · Any work at all before Stage 1 produces a real row.
  · Removing the model router. It is specified, unwired, and IT IS THE RIGHT
    SHAPE FOR POCKETS LATER — retiring it would be a loss.


===============================================================================
7 · WHAT DEFEATS THIS
===============================================================================
  · "HARDCODED" READ AS HARDCODED VALUES. Section 2 exists for this and it will
    still happen. FOUR IDENTIFIER FABRICATIONS IN TWO DAYS SAY SO.
  · A POCKET DECLARED FROM IMAGINATION. "This obviously needs AI" before the
    deterministic path exists is a guess wearing an architecture's clothes.
  · THE PLAN USED AS A REASON TO DEFER. Section 3 is the answer: FINISH STAGE 1
    FIRST.
  · AND THE ONE THE REVIEWER WOULD BET ON: cycle one ships, works, and the
    pockets are never revisited because nothing hurts enough. THAT IS AN
    ACCEPTABLE OUTCOME AND SHOULD BE SAID OUT LOUD — a platform that works
    without a model is not a failure of this plan. IT IS THE PLAN SUCCEEDING.


===============================================================================
8 · CARRIED WITHOUT RE-CHECKING
===============================================================================
  · That the eight steps hold only one AI pocket. It is the Reviewer's reading
    of its own draft and Antigravity has not attacked it.
  · Every repository claim here is Antigravity's.
  · Whether the model router still exists and in what state.


End of CISEM · PLAN · DETERMINISTIC FIRST · DRAFT V1 · 2026-08-26
