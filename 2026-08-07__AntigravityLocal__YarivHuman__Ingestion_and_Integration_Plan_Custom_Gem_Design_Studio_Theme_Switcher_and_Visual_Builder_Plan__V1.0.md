---
owner: "CISEM_GOVERNOR"
plan_id: "CISEM-IP-20260807-DESIGN-STUDIO"
canonical_location: "C:\\Users\\finky\\.gemini\\antigravity\\brain\\7d7012df-7840-40da-a530-4da7587db5b9\\implementation_plan.md"
artifact_status: "AWAITING_APPROVAL"
maturity: "WORKING_IMPLEMENTATION"
version: "1.0"
role_type: "PLAN"
blast_radius: "MEDIUM"
---
# Ingestion and Integration Plan: Custom Gem Design Studio (Theme Switcher & Visual Builder)

This plan details the design, variables setup, and page layout for the Custom Gem Design Studio inside the Next.js frontend, allowing interactive testing of color themes, spacing scales, and modular components.

## User Review Required
*   **CSS Variable System**: We will implement the Design Token Switcher Matrix directly via CSS variables in the document root, ensuring that switching density or theme instantly re-skins all layout components.

## Open Questions
*   None. We will provide 4 high-quality presets (Slate, Emerald, Indigo, Amber) and 2 density modes (Balanced, Condensed) as specified.

## Proposed Changes

### 1. Style System Variables Setup
*   **[MODIFY]** [`src/app/globals.css`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem CsAg/src/app/globals.css):
    *   Add color palette theme classes (`theme-slate`, `theme-emerald`, `theme-indigo`, `theme-amber`) supporting both Light and Dark modes.
    *   Add density classes (`density-balanced`, `density-condensed`) mapping spacing multipliers (`--spacing-card`, `--spacing-gap`, `--padding-button`, etc.).

### 2. Frontend Design Studio Tab & Sidebar
*   **[MODIFY]** [`src/app/page.tsx`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem CsAg/src/app/page.tsx):
    *   Update `currentMenu` state type to support `"design_studio"`.
    *   Add the sidebar button for `🎨 Design Studio` right under `Architecture Visualizer`.
    *   Implement the Visual Builder Studio viewport containing:
        1.  **Toolbar Control Matrix**: Bright/Dark selector, 4 theme options, 2 spacing scales.
        2.  **Modular Component Panel**: Click-to-add premade modules (Hero, Features Grid, Pricing, CTA, Footer).
        3.  **Active Canvas**: Drag-and-drop/reorder list of active sections displaying real-time styling changes under the current theme/density matrix.

## Verification Plan

### Automated Tests
*   Run the compiler gate script to verify code formatting and compilation:
    ```cmd
    python cisem_core/cisem_gate.py
    ```

### Manual Verification
*   Open the application interface, select the **Design Studio** tab, click different colors and density modes, and confirm the visual preview updates immediately.
