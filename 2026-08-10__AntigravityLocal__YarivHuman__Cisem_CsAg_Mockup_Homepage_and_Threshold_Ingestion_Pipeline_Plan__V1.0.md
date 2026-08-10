# Implementation Plan: Cisem CsAg Mockup Homepage & Threshold Ingestion Pipeline
**Plan ID**: `CISEM-IP-20260809-HOMEPAGE-THRESHOLD`  
**Version**: 1.0  
**Authority**: Governor Ratification Required  

This plan outlines the steps to refactor the frontend homepage UI in [`page.tsx`](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/page.tsx) to establish a premium dashboard aligned with the Governor's dropdown structure (`Ext 🔌`, `Arch 📐`, `Gov 🏛️`, `Tools 🛠️`), a Tenant Context Selector, and an interactive **Threshold Input Ingestion & Intent Refinement Pipeline** based on the ratified platform specs.

---

## User Review Required

> [!IMPORTANT]
> - **Visual Layout Transition**: We will replace the current horizontal administration tabs with a responsive top navigation bar using the dropdown categories: **Ext**, **Arch**, **Gov**, and **Tools**, along with an active **Tenant Context Selector** (`x-tenant-context`).
> - **Interactive Simulation**: The dashboard will feature a functional **"Universal Input Gate"** panel where the Governor can submit raw inputs, trigger real-time AI-assisted parsing (mocked or api-driven), and interactively refine the intent before transitioning it through the 12 lifecycle stages.

---

## Open Questions

> [!NOTE]
> - **API Integration vs. Simulation**: Should the parsing and intent refinement panel use actual backend endpoint routes (e.g. calling an API route `/api/v1/threshold/parse` that runs a lightweight Gemini/VLM prompt) or a high-fidelity interactive simulation on the client? (We recommend a local API endpoint that falls back gracefully to a mock schema if credentials are absent).

---

## Proposed Changes

### Component: Frontend UI & API Gates

#### [MODIFY] [page.tsx](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/page.tsx)
- Refactor the dashboard layout:
  1. **Top Menu Navigation**: Implement dropdown arrays for:
     - `Ext 🔌`: Ingested Briefs, Sheets Imports, Google Drive Watcher state.
     - `Arch 📐`: Master Schemas, Vocabulary, Axioms & Principles, Subsystems map.
     - `Gov 🏛️`: Local Compile Gate Status, Parking Vault items, Accountability Turn Counter.
     - `Tools 🛠️`: Image Normalization Dashboard, Gradio Sandbox, Telemetry logs.
  2. **Tenant Context Selector**: Add a header control to switch active tenant context headers (symmetric HMAC key simulation).
  3. **Threshold Pipeline Panel**: Build the visual **Universal Ingestion & Intent Refinement Gate** containing:
     - An input area for raw briefs or developer tasks.
     - A parsing engine interface displaying focus tags, blast radius estimation, and triage state (Green/Red light validation rules).
     - Interactive controls to "Refine Intent", "Align to Plan", or "Re-Park to Vault".
     - A visual horizontal stage node graph showing the 12 states (from `raw_and_context` to `validated_impact`).

#### [NEW] [route.ts](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/api/v1/threshold/parse/route.ts)
- Create a Next.js API route that accepts raw input text, estimates the structural magnitude (Scope 2/3 blast radius), parses keywords to extract tags, and returns structured JSON for the frontend threshold workspace.

#### [MODIFY] [Registry V1.31](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.31.yaml)
- Register the new API route file and update the hash registries.

---

## Verification Plan

### Automated Tests
- Run `npm run build` or compile check to ensure TypeScript builds without compilation warnings.
- Verify `python cisem_core/cisem_gate.py` passes successfully with the newly created route.

### Manual Verification
- Open the dashboard at `http://localhost:3000`, toggle the tenant selector, input a raw brief in the Gate panel, and confirm that the stages update dynamically.
