---
plan_id: CISEM-IP-20260809-GATE-GIT-DIFF-OPTIMIZATION
version: '1.0'
status: DRAFT
blast_radius: HIGH
governor_signature: PENDING-REVIEW
axioms_linked:
- AX-10000
- PR-11000
pre_review_status: PASSED
pre_reviewed_at: '2026-08-09T07:18:48.891596Z'
---

# Implementation Plan: Git-Diff Scope Optimization in Cisem Gate

This plan implements Git-based scope scanning in our compile gate (`cisem_gate.py`) Phase 11. Instead of recursively walking and scanning the entire workspace on every compile trigger, the gate will query git status to identify only modified/staged files, optimizing build speed.

## User Review Required

> [!NOTE]
> The gate falls back to full workspace scan if Git is not installed or the directory is not inside a git repository.

## Open Questions

- *None.*

## Proposed Changes

### Component: Compile Gate

#### [MODIFY] [cisem_gate.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/cisem_gate.py)
- Implement `get_git_modified_files()` helper using `git status --porcelain`.
- Modify `check_axioms_integrity()` to scan only the git-reported modified files, falling back to full walk only if git returns an error or is unavailable.

## Verification Plan

### Automated Tests
- Run `python cisem_core/cisem_gate.py` to confirm LGG runs successfully.
- Run `npm run build` to confirm production Next.js compilation remains nominal.

### Manual Verification
- Verify output log details that Phase 11 successfully runs with git-diff scope.
