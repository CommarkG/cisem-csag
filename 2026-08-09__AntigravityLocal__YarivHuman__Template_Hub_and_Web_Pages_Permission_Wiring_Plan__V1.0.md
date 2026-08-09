---
plan_id: CISEM-IP-20260809-TEMPLATE-HUB-PERMISSION-WIRING
version: '1.0'
status: DRAFT
blast_radius: LOW
governor_signature: PENDING-REVIEW
axioms_linked:
- AX-10000
- PR-11000
pre_review_status: PASSED
pre_reviewed_at: '2026-08-09T16:32:43.706199Z'
---

# Implementation Plan: Template Hub & Web Pages Permission Wiring

This plan completes the permission-wiring sequence for the Layout Sandbox and Accountability Dashboards. It retrofits the API to dynamically load the latest version of the accountability registry, and enforces tier-aware permissions on UI action controls.

## User Review Required

> [!NOTE]
> The API route will now dynamically load whichever registry version is active (e.g. `V1.20.yaml`) instead of being hardcoded to `V1.16.yaml`.

## Open Questions

- *None.*

## Proposed Changes

### Component: Control Plane Dashboard API

#### [MODIFY] [route.ts](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/api/dashboard/route.ts)
- Add a helper function `findLatestRegistryFile()` that scans the `cisem_core` directory for `*Workspace_and_Accountability_Registry*` YAML files, extracts version indices, sorts them, and loads the latest.
- Bind the YAML parser to this dynamic path.

### Component: React Client Interface

#### [MODIFY] [page.tsx](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/page.tsx)
- Renders the selected permission tier's active capabilities as status badges (e.g. `[read:templates]`, `[write:pages]`) in the header of the Template Hub view.
- Disables the layout sandbox button rails ("New Template", "Register Template", "Export Registry") dynamically unless the `selectedPermissionTier` contains the required permission scopes (`write:templates`, `write:registry`).

## Verification Plan

### Automated Tests
- Run `python cisem_core/cisem_gate.py` to confirm compile gates pass.
- Run `npm run build` to verify Next.js builds successfully.

### Manual Verification
- Launch the browser view, toggle the active role in the menu (Guest ➔ Buyer ➔ Partner ➔ Operator Admin), and verify that action buttons lock/unlock and the permissions list updates dynamically.
