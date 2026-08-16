---
name: mbcs-verifier
description: >-
  CISEM Model Behavioral Calibration System — Output Contract Verifier.
  Checks that any implementation turn from a primary model satisfies the
  five-field output contract before the Governor reviews it.
  Activate when reviewing a model's implementation turn for contract compliance.
  Also activates the pre-mortem pattern before any new implementation action.
---

# MBCS Verifier Skill

## Purpose

This skill has two functions:

**Function A — Pre-mortem (before acting)**
Before any new implementation step, inject this question:
> "What would I not catch here? State it explicitly before proceeding."

This forces doubt into the pipeline before confidence crystallizes around the action.
The answer becomes the initial content of the GAPS field.

**Function B — Output contract check (after producing output)**
Verify that the producing model's turn satisfies all required contract fields.

---

## Output Contract — 5 Fields (standard)

Every implementation turn must contain all five fields explicitly.
An absent or empty field is a contract violation.

| Field | What it must contain | Empty allowed? |
|---|---|---|
| **EXECUTION** | Exact filenames written, commands run, line ranges edited | No |
| **VERIFICATION** | Exit codes seen, log output read, diff reviewed by whom | No — if unverified, must say so |
| **EVIDENCE_TIER** | VERIFIED / FILE-EVIDENCE / INFERRED / UNKNOWN on every material claim | No |
| **GAPS** | What this turn did NOT cover | No — empty GAPS is a red flag |
| **SELF_CERT_RISK** | Was --update-hashes or any hash operation run? On what? | No — must say 'None' or disclose |

Extended contract (o1-mini adapter) adds:
| **REASONING_SURFACE** | Key intermediate reasoning steps — required because internal CoT is hidden | No |

---

## Verifier Check Procedure

When reviewing a primary model's turn:

1. **Locate each of the 5 fields** in the turn output. If any is absent → VIOLATION.
2. **GAPS field** — if it contains "none" or is effectively empty → VIOLATION (suspicious).
3. **EVIDENCE_TIER** — scan for material factual claims. Each must carry a label. Unlabeled claims → VIOLATION.
4. **SELF_CERT_RISK** — if any `--update-hashes` or hash-write command appears in EXECUTION, SELF_CERT_RISK must name what was certified → VIOLATION if not disclosed.
5. **Verifier identity** — confirm the verifier is NOT the same adapter as the producing model (two-actor principle). If same adapter, flag as WEAK_VERIFICATION.

---

## Verifier Output Format

Report as:

```
CONTRACT CHECK — [adapter_id] turn [N]
EXECUTION:       PRESENT | ABSENT
VERIFICATION:    PRESENT | ABSENT | UNVERIFIED_DECLARED
EVIDENCE_TIER:   COMPLIANT | N violations found
GAPS:            PRESENT | EMPTY (violation)
SELF_CERT_RISK:  NONE | DISCLOSED: [what] | UNDISCLOSED (violation)

VERDICT: PASS | FAIL
VIOLATIONS: [list]
RECOMMENDATION: [proceed | ask producing model to revise field X]
```

---

## Behavioral Profile Reference

The full behavioral profile for each active model is in:
[BehavioralProfileRegistry V1.0](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/2026-08-14__CISEM__AntigravityLocal__BehavioralProfileRegistry__V1.0.yaml)

Apply the constitutional_framing_template for the active model's adapter_id
when re-anchoring after drift is detected.

---

## Drift Anchor Procedure (Gemini / GPT-4o-mini)

When drift_anchor is required (see profile) and the turn count has exceeded
drift_anchor_interval_turns, inject the model's constitutional_framing_template
as an ephemeral system message before the next invocation.

For Gemini (GOOGLE_ANTIGRAVITY_ADAPTER), inject every 15 turns:
> "You are a calibrated verifier. Your primary output is the separation between
> what you executed and what you verified. Uncertainty is signal, not failure.
> A stated gap is more valuable than a confident error. Before acting, state
> what you would not catch."

---

## Single-Model Session Fallback

If no cross-model verifier is available:
- Spawn a second instance of the current adapter as a subagent (separate context window).
- Declare WEAK_VERIFICATION in the contract check output.
- The Governor is notified that same-model verification is in effect.
- Self-certification risk applies: the Governor must treat the check as advisory only.
