---
metadata:
  owner: "CISEM_GOVERNOR"
  plan_id: "CISEM-IP-20260807-DESIGN-STUDIO"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\2026-08-07__AntigravityLocal__YarivHuman__Ingestion_and_Integration_Plan_Custom_Gem_Design_Studio_Consensus_Aligned_Plan__V1.1.md"
  artifact_status: "COMPLETED"
  maturity: "WORKING_IMPLEMENTATION"
  version: "1.1"
  role_type: "PLAN"
  blast_radius: "MEDIUM"
plan_id: "CISEM-IP-20260807-DESIGN-STUDIO"
title: "Custom Gem Design Studio Ingestion and Integration Plan"
version: "V1.1"
governor_signature: "GOV-YARIV-20260807-DESIGN-STUDIO-V1.0"
blast_radius: "MEDIUM"
artifact_status: "COMPLETED"
axioms_linked:
  - "AX-10000"
  - "PR-98000"
---
# Ingestion and Integration Plan: Custom Gem Design Studio (Consensus Aligned)

This plan details the design, variables setup, and page layout for the Custom Gem Design Studio inside the Next.js frontend, allowing interactive testing of color themes, spacing scales, and modular components.

## User Review Required
*   **Design Token Matrix**: We will implement 2 spacing density scales (Balanced & Condensed) and 4 color theme presets (Slate/Silver, Emerald/Forest, Indigo/Amethyst, Amber/Rust) using custom CSS variables in Tailwind CSS v4.
*   **Modular Component Palette**: The visual builder will support 7 default sections (Hero, Features Grid, Pricing Cards, CTA, Footer, Statistics Dashboard, Testimonial Carousel Grid).

## Open Questions
*   None. Consensus has been reached via interactive dialogue.

## Proposed Changes

### 1. Style System Variables Setup
*   **[MODIFY]** [`src/app/globals.css`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem CsAg/src/app/globals.css):
    *   Add color palette theme classes (`theme-slate`, `theme-emerald`, `theme-indigo`, `theme-amber`) supporting both Light and Dark modes.
    *   Add density classes (`density-balanced`, `density-condensed`) mapping spacing multipliers (`--spacing-card`, `--spacing-gap`, `--padding-y`, `--padding-x`, `--radius-custom`).

### 2. Frontend Design Studio Tab & Sidebar
*   **[MODIFY]** [`src/app/page.tsx`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/page.tsx):
    *   Update `currentMenu` state type to support `"design_studio"`.
    *   Add the sidebar button for `🎨 Design Studio` right under `Architecture Visualizer`.
    *   Implement the Visual Builder Studio viewport containing:
        1.  **Toolbar Control Matrix**: Appearance switcher (Light/Dark), 4 theme options, 2 spacing scales.
        2.  **Modular Component Panel**: Click-to-add palette for all 7 modules (Hero, Features, Pricing, CTA, Footer, Stats, Testimonials).
        3.  **Active Canvas**: Drag-and-drop/reorder list of active sections displaying real-time styling changes under the current theme/density matrix.

## Verification Plan

### Automated Tests
*   Run the compiler gate script to verify code formatting and compilation:
    ```cmd
    python cisem_core/cisem_gate.py
    ```

### Manual Verification
*   Open the application interface, select the **Design Studio** tab, click different colors and density modes, and confirm the visual preview updates immediately.

---
history:
  - timestamp: "2026-08-07T21:52:00Z"
    action: "REMEDIATE_METADATA_HEADER"
    actor: "GOOGLE_ANTIGRAVITY_ADAPTER"
    version: "1.1"
