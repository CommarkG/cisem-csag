---
plan_id: CISEM-IP-20260811-HEADER-UNIFICATION
blast_radius: MEDIUM
axioms_linked:
- AX-10000
- PR-13500
- PR-13990
- AX-50000
- AX-55000
- PR-58950
artifact_status: COMPLETED
pre_review_status: PASSED
governor_signature: GOV-YARIV-20260811-HEADER-UNIFICATION-V1.0
date: '2026-08-11'
version: '1.4'
history:
- timestamp: '2026-08-11T12:11:00Z'
  action: COMPLETED_IMPLEMENTATION_OF_HEADER_UNIFICATION
  actor: Gemini 3.6 Pro (Antigravity)
  version: '1.4'
- timestamp: '2026-08-11T11:59:00Z'
  action: CREATED_HEADER_UNIFICATION_PLAN
  actor: Gemini 3.5 (Medium)
  version: '1.3'
pre_reviewed_at: '2026-08-11T08:59:31.544119Z'
---

# Consolidated Header Navigation and Menu Unification

This plan addresses the layout discrepancy between the main dashboard header ([Header.jsx](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/layout/Header.jsx)) and the previous platform's dynamic header ([dynamic_menu.tsx](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/dynamic_menu.tsx)). It consolidates back/forward navigation controls and breadcrumbs with crumbnails into a single unified row in the header menu bar, fully satisfying the Single-Row Placement and Sibling Representation Consistency Rules.

---

## User Review Required

> [!IMPORTANT]
> **Consolidation of Layout Rows**: The breadcrumbs row currently rendered separately below the header in the old B2B page will be deleted. It will be merged directly into the left side of the header navigation menu bar inside `DynamicMenu.tsx` to save vertical screen space and ensure layout uniformity.

---

## Open Questions

- **Chevrons Visibility for Guests**: Should back and forward navigation chevrons remain disabled or completely hidden when activeRole is set to `guest`? (Proposed default: disabled).

---

## Proposed Changes

### Header Layout Consolidation

#### [MODIFY] [dynamic_menu.tsx](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/dynamic_menu.tsx)
- **Wiring**: Wired into parent state properties passing history index, history length, and breadcrumbs data.
- **Triggering**: Triggers navigation stack changes via click handlers.
- **Availability**: Available globally in `src/components/` as the dynamic layout navigation bar.
- **User Journey**: Embeds navigation arrows and breadcrumbs inside the header bar, ensuring the user journey remains consistent regardless of the active page layout.

#### [MODIFY] [page.tsx](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/old-b2b/page.tsx)
- **Wiring**: Direct parent viewport that passes history context, stack details, and breadcrumb lists to `DynamicMenu`.
- **Triggering**: State mutations trigger changes in navigation indices and active menus.
- **Availability**: Available at route `/old-b2b`.
- **User Journey**: Deletes the duplicate second-row breadcrumb container, saving vertical workspace space and achieving identical visual branding alignment.

---

## CoreSpiral Methodology & CoreCycle Definitions

### CoreCycle 1: Design Alignment & Interface Signature
- Define new optional routing props inside `DynamicMenuProps` in `dynamic_menu.tsx` to receive navigation context.
- Implement Single-Row Placement formatting in the left section of the menu bar.

### CoreCycle 2: Viewport Cleaning & Data Wiring
- Remove the redundant breadcrumbs container from `src/app/old-b2b/page.tsx`.
- Wire the history index, stack, and breadcrumb getters directly to `DynamicMenu` props.

---

## Gemini Brain Multi-Persona Audit

### Persona Review Summary & Mitigation Matrix

20.1. **UI/UX Designer (Verdict: PASS)**
- *Gap identified*: Separate breadcrumbs container wastes vertical density and violates page layout rules.
- *Mitigation*: Consolidate all elements into a single header row in `DynamicMenu.tsx`.

20.2. **QA Architect (Verdict: PASS)**
- *Gap identified*: Back/forward transitions must not raise routing errors under boundary states.
- *Mitigation*: Validate history index constraints before invoking backward or forward handlers.

20.3. **Bilingual Coordinator (Verdict: PASS)**
- *Gap identified*: Chevron direction must dynamically mirror context under RTL Hebrew layout.
- *Mitigation*: Adjust chevron direction depending on language and active locale parameters.

---

## Verification Plan

### Automated Tests
- Validate codebase gate compliance:
  ```bash
  python cisem_core/platform_core/cisem_gate.py
  ```

### Manual Verification
- Navigate between different category items on the B2B page and verify that back/forward chevrons successfully change states (enable/disable) and update breadcrumbs inside the header bar.
