---
plan_id: CISEM-IP-20260809-ACCOUNTABILITY-DASHBOARD
version: '1.0'
status: DRAFT
blast_radius: HIGH
governor_signature: PENDING-REVIEW
axioms_linked:
- AX-10000
- PR-13980
- PR-13990
pre_review_status: PASSED
pre_reviewed_at: '2026-08-08T21:09:46.304315Z'
---

# Implementation Plan: Accountability Dashboard & Portal Integration

This plan outlines the scaffolding, routing, and data integration required to implement the visual **Accountability Dashboard** tab in the Next.js portal. It connects the UI to local backend JSON metrics to display compiler turn status, ATV gaps, and registry verification.

## User Review Required

> [!IMPORTANT]
> The dashboard will query `cisem_core/cael_status.json` and `cisem_core/sandbox/atv_report.json` via a new local Next.js API route (`/api/dashboard`). Ensure uvicorn/next.js servers are running locally during verification.

## Open Questions

- **Aesthetic Preference**: Should the turn counter visualizer use a circular gauge or a linear progress bar to count down from 0 to 15 turns? (We propose a premium circular countdown ring with color-shifting severity alert warnings).

## Proposed Changes

### Component: Frontend Dashboard UI

#### [MODIFY] [page.tsx](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/page.tsx)
- Upgrade the `{currentMenu === "threshold" && (...)}` block to render:
  - **Turn Status Gauge**: A premium circular countdown tracking active turns (0/15).
  - **ATV Audit Indicator**: Displaying the number of Gaps found, root cause patterns, and planning/execution (P/E) ratio warnings.
  - **Cryptographic Registry Ledgers**: A scrolling table showing all 39 canonical registry files, active versions, and verification SHA256 hashes loaded from `Registry V1.16.yaml`.

### Component: Backend Data Pipeline

#### [NEW] [route.ts](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/api/dashboard/route.ts)
- Create a Next.js App Router API endpoint that:
  1. Reads `cisem_core/cael_status.json` (to fetch the active turn counter).
  2. Reads `cisem_core/sandbox/atv_report.json` (to fetch the latest validator gaps).
  3. Returns a unified JSON payload to power the dashboard.

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure the new API route compiles successfully under Next.js Turbopack typechecks.
- Run `python cisem_core/cisem_gate.py` to verify gate health.

### Manual Verification
- Navigate to `/` in the browser, select the **Gov ➔ Threshold Input Gate** option in the menu, and confirm that the circular turn counter and registry hash tables populate dynamically from the local filesystem.
