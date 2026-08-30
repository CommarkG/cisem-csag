# CISEM Frontend Dashboard Expert Evaluation & Checklist

1.1. **Introduction**:
Following a code and layout audit of [`page.tsx`](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/page.tsx), we identified 5 key areas where the frontend dashboard can be enhanced to transition from static mock-ups to a fully dynamic, production-ready SaaS interface. This document acts as an expert review and checklist for future implementation phases.

---

## 2.0 Priority Enhancement Areas

### 2.1. Dynamic Proposal Tokens in B2B CRM Kanban
* **Current State**: The "📥 הפק PDF ידנית" manual PDF generation button in the Sales CRM Kanban board passes a static proposal token ID `"ea1d5229-ada7-4bae-8ca9-6c7b488b694a"` for every deal card.
* **Proposed Enhancement**:
  - Update the `GET /api/v1/crm/deals` API to perform an optional join with the `proposals` table, returning the active `proposal_token` corresponding to each deal.
  - Re-wire the CRM card rendering in the frontend to pass the deal's actual proposal token to `handleManualPDFGeneration(deal.proposal_token)`. Disable the download button with a tooltip if a proposal has not been generated for the deal yet.
  - **Impact**: Enables genuine PDF download logs directly from the deal board, removing mock dependencies.

### 2.2. Interactive Client Brief Override Controls
* **Current State**: The Client Brief Ingestor relies solely on a single text-area block. If the parser makes an error, the operator cannot correct it easily in the UI.
* **Proposed Enhancement**:
  - Add optional override input fields (Target Quantity, Target Unit Budget, Event Date datepicker) inside the ingestion card.
  - If specified, these override parameters will be passed along with the requirements text to `POST /api/v1/briefs/qualify`, allowing manual override of parser defaults.
  - **Impact**: Improves usability and handles edge cases where client requirements are incomplete or ambiguous.

### 2.3. Real-Time Styles and Density Application in Design Studio
* **Current State**: The Custom Gem Design Studio offers button controls to switch presets ("Silver Slate", "Forest Emerald") and spacing density ("Balanced Mode", "Condensed Mode"), but these toggles do not affect the main dashboard layout.
* **Proposed Enhancement**:
  - Map `studioTheme`, `studioDensity`, and `studioMode` React state values to global CSS variables or container wrapper classes (e.g. `theme-slate`, `density-condensed`).
  - Wire these styles to dynamically alter padding, primary colors, borders, and margins of all cards and dashboards.
  - **Impact**: Provides instant visual feedback of whitelabel branding changes directly to the operator.

### 2.4. Visual Vector Indexer Feedback Overlay
* **Current State**: The visual upload panel uploads images to `POST /api/v1/catalog/upload-image` and shows raw json responses.
* **Proposed Enhancement**:
  - Render an interactive image preview card detailing:
    - AI-extracted visual description tags.
    - 768-dimension pgvector projection slices.
    - Tenant partitioning matching confirmation.
  - **Impact**: Enhances the AI-assisted vector indexing experience by making the indexing process transparent.

### 2.5. Permanent Bilingual (English / Hebrew) Toggle Framework
* **Current State**: Hardcoded text elements in page body are predominantly Hebrew, while menus, sidebar labels, and settings fields are in English.
* **Proposed Enhancement**:
  - Implement a persistent language switcher toggle (`English / עברית`) next to the Dark Mode button.
  - Wire all text elements to a nested JSON translation map, enabling seamless dynamic switching.
  - **Impact**: Resolves all language mix inconsistencies permanently.

---

## 3.0 Verification Checklist for Implementations

| Component | Target Enhancement | Verification Check |
| :--- | :--- | :--- |
| **CRM Kanban** | Dynamic proposal PDF mapping | Verify PDF print download retrieves actual proposal PDF stream. |
| **Ingestor** | Manual Override Controls | Verify override inputs populate brief qualifications database fields. |
| **Design Studio** | Live Theme & Spacing Apply | Click slate/indigo and balanced/condensed; verify real-time class changes. |
| **Vector Indexer** | Interactive tags feedback | Verify uploaded image shows extracted metadata card instead of raw JSON. |
| **i18n Toggle** | Unified Translation Map | Toggle language; verify 100% of labels, placeholders, and buttons translate. |
