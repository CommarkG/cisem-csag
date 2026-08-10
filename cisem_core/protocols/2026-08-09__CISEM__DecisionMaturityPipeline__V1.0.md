# The 7-Phase Decision Maturity Pipeline
<!--
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CRUEL-REVIEW-AX70000-CONSOLIDATED-V1.0
# governor_signature: GOV-YARIV-20260809-CONSOLIDATED-APPROVED
# version: V1.0
# reasoning: |
#   Decision maturity pipeline governing standard progression from ideation
#   to retroactive validation under AX-75000 (Statistical Maturity).
#   Parent principles: AX-10000, AX-75000, PR-84900, PR-84505.
-->

Every idea that enters CISEM must travel this pipeline before becoming permanent:

## PHASE 0 — IDEATION
*   **Entry**: A concept is introduced in conversation.
*   **Output**: A clear problem statement in one sentence.
*   **Gate**: Can we state what success looks like numerically? If NO — stay in Phase 0.
*   **SWIFT role**: Not applicable yet.

## PHASE 1 — GESTATION & MATURITY CHECK
*   Questions the agent must answer explicitly:
    *   a) What problem does this solve? (must be distinct from existing mechanisms)
    *   b) What is the numeric success metric?
    *   c) What is the current baseline (measurable)?
*   **Gate**: All 3 must be answerable. Any NO keeps the idea parked.
*   **Output**: A Parking Vault entry with status: `gestating`

## PHASE 2 — STRUCTURED RESEARCH (PR-75500)
*   The agent runs all 4 Research Channels:
    *   *Channel A — Internal*: parking vault, transcripts, existing registry, past trials
    *   *Channel B — External*: published benchmarks, competitor implementations, docs
    *   *Channel C — Synthetic Pre-Trial*: 5 sample runs per option to calibrate trial design
    *   *Channel D — Expert Panel*: CisemAuditor review of the trial design for gaps
*   **Output**: Research Brief (max 1 page, filed in `cisem_core/trials/research/`)
*   **Gate**: All 4 channels documented. Governor reviews before advancing.

## PHASE 3 — TRIAL DESIGN (PR-75300)
*   The agent produces a trial_design document containing all mandatory fields.
*   Governor must sign off before any trial begins.
*   **Output**: `trial_registry.yaml` entry with status: `design_approved`
*   **SWIFT role**: If tactical urgency exists, SWIFT deploys Option A here as Trial Run 1. The `PARK-xxx` entry is created. Trial continues with Options B and C.

## PHASE 4 — PARALLEL TRIAL EXECUTION (PR-75200)
*   All options run simultaneously.
*   Agent collects data into a comparison matrix at each checkpoint.
*   Agent may NOT form conclusions mid-trial.
*   SWIFT output becomes the first data point in the matrix.
*   **Output**: Checkpoint reports filed in `cisem_core/trials/checkpoints/`

## PHASE 5 — STATISTICAL MATURITY CHECK (PR-75100, PR-75400)
*   Trial ends when exit condition is met (not before).
*   Results compared across all options across ALL checkpoints.
*   Winner = best average across checkpoints, not best single reading.
*   Variance penalty: a volatile winner loses to a consistent second-place.
*   **Output**: Trial Conclusion Report filed in `cisem_core/trials/conclusions/`

## PHASE 6 — OPTIMAL PATH DECLARATION
*   Governor ratifies the winner.
*   Permanent change registered in `AxiomsAndPrinciples.md` with `trial_id` reference.
*   All other options archived with their data in `cisem_core/trials/archive/`.
*   SWIFT placeholder promoted to canonical solution (if SWIFT was used).
*   **Output**: Updated AxiomsAndPrinciples + parking vault status -> `validated_impact` (now with required fields: `trial_id`, `outcome_delta_pct`, `measurement_timestamp`)

## PHASE 7 — RETROACTIVE VALIDATION (30 days post-deployment)
*   Was the declared winner still winning after 30 days of production?
*   If outcome_delta > 10% vs. declared expectation:
    *   -> Auto-generate `PARK-xxx` tagged `[IMPROVEMENT.GAP]`
    *   -> New trial starts from Phase 1 with the gap as the problem statement
*   This is the only phase that closes the loop permanently.
