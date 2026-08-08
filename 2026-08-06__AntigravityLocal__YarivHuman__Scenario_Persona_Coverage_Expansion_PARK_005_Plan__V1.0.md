---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-06__AntigravityLocal__YarivHuman__Scenario_Persona_Coverage_Expansion_PARK_005_Plan__V1.0.md"
  artifact_status: "DRAFT"
  maturity: "WORKING_DRAFT"
  version: "1.0"
  role_type: "IMPLEMENTATION_PLAN"
---

# Implementation Plan: Scenario Persona Coverage Expansion (PARK-005)

**Plan ID**: `CISEM-IP-20260806-PERSONA-EXPANSION-V1.0`  
**Date**: 2026-08-06  
**Status**: DRAFT (Awaiting Governor Sign-off)  

---

## User Review Required

Documenting the pre-implementation gestation checks and architectural changes for ratifying the expansion of the Auditor Scenario Coverage:

> [!IMPORTANT]
> This change refactors the core auditor matching logic from hardcoded `if/elif` blocks to dynamic, profile-based keyword scanning. This ensures all 10 internal expert personas trigger contextually, resolving the 50% coverage gap currently flagged by the compiler gates.

---

## Open Questions

> [!NOTE]
> 1. Should we add a CLI flag to `CisemAuditor.py` to allow executing a single targeted scenario during development, alongside the default multi-scenario suite execution?
> 2. Are the keyword associations for the newly active personas (e.g. `COMPLETION_EXPERT_PERSONA` triggered on `todo` or `stub`) fully aligned with the vocabulary requirements?

---

## Proposed Changes

### Ingestion & Verification Gestation Cycles (PR-58950)
1. **Vocabulary Alignment**: All parsed tags match the canonical registries in `tag_library_draft.yaml` and `persona_registry_draft.yaml`.
2. **Failure-Path Dry Run**: Traced parser behaviors if the registry YAML or MAP files are corrupted, ensuring fallback to default `MIXED` scenario types rather than crashing.
3. **Persona Simulation**: Pre-evaluated that the Security persona will trigger on backdoor keywords, while the UI persona will trigger on visual layout tags.

---

### Component: Sandbox Review Engine

#### [MODIFY] [CisemAuditor.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/sandbox_code_review/CisemAuditor.py)
- Update `execute_audit` to run a loop over **six distinct mock scenarios** (Security, Stability, Architecture, Visual UI, Performance, and Completion Audit) instead of a single hardcoded run.
- Replace the mutually exclusive `if/elif` conditions with a dynamic, non-exclusive match loop that scans code diffs for focus keywords associated with each persona's profile.
- Output a structured list of reports (one per scenario) to `orchestration_trial_report.json`.

#### [MODIFY] [CisemATV.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/sandbox_code_review/CisemATV.py)
- Update Check 1 (Contextual Persona Relevance) to parse the multi-scenario list from `orchestration_trial_report.json`.
- Compute and verify the average relevance score across all scenarios, ensuring that every scenario type triggers its expected expert personas correctly.

---

## Verification Plan

### Automated Tests
- Run `python sandbox_code_review/CisemAuditor.py` to generate the expanded multi-scenario report.
- Run `python sandbox_code_review/CisemATV.py` to verify that Check 1 outputs a 100% Relevance Score and clears the gap.
