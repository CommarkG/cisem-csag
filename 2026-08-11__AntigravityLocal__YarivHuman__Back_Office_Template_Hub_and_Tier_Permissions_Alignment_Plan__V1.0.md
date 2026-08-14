# Implementation Plan: Back-Office Template Hub & Tier Permissions Alignment

This plan outlines the architecture and implementation path to formalize page templates, enable client page duplication, enforce role-based access tiers, and establish compiler-level compliance checking to prevent custom coding on external pages.

---

## User Review Required

> [!IMPORTANT]
> **1. Impersonation Sandbox Controls**:
> To allow the Governor to verify access permissions visually, we propose adding a **Role Impersonation Selector** inside the Header's user profile avatar. Selecting different roles (e.g., `operator_admin`, `partner`, `buyer`, `guest`) will immediately toggle UI capabilities and restrict pages.
>
> **2. Dynamic Duplication Engine**:
> Clicking "Duplicate to Client" in the Template Hub will trigger an API request that dynamically appends a new page record to [`templates_registry.json`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/templates_registry.json) on disk.
>
> **3. Compiler Gate (No Custom Code Rule)**:
> We will add an automated Phase check to [`cisem_gate.py`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py) to audit client pages, ensuring they map cleanly to templates and do not contain inline scripts or non-standard components.

---

## Open Questions

- **Client Selection**: Should duplication target the predefined static list of clients (e.g., *Global Electronics*, *Israel Metalworks*) or allow write-in input names?
  - *Recommendation*: Use the predefined list of client organizations from our collaborative state to maintain consistent identifiers, with a write-in fallback.

---

## Proposed Changes

### Configuration Plane & APIs

#### [MODIFY] [templates_registry.json](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/templates_registry.json)
- Add mock client page examples representing duplicated states.

#### [NEW] [route.ts](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/api/templates/duplicate/route.ts)
- Implement a POST endpoint to receive `{ pageId, name, templateId, clientId }` configurations.
- Validates the tenant context, locks the file, appends the new page structure to the templates registry, and saves it.

### Frontend View & Controller

#### [NEW] [TemplateHubView.tsx](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/views/TemplateHubView.tsx)
- Create a dual-tab template and page workspace matching the design guidelines:
  - **Template Hub tab**: Lists available templates with visual layout blocks, version tags, and verification statuses. Features a `[Duplicate]` button.
  - **Instantiated Pages tab**: Displays all duplicated pages with active templates inheritance links and sync receipts.
  - **Permissions Indicator**: Displays warning banners when restricted user tiers attempt write mutations.

#### [MODIFY] [Header.jsx](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/layout/Header.jsx)
- Wire the dynamic category selectors `template_hub` and `web_pages` to navigate to the new Template Hub view paths.
- Add a Role selector inside the user profile card to update simulated roles inside `useUIStore`.

#### [MODIFY] [DimaAppWrapper.jsx](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/DimaAppWrapper.jsx)
- Register the `/templates` route matching the dynamic menu selections.

### Compiler Gatekeeper

#### [MODIFY] [cisem_gate.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py)
- **Phase 21: External Page Coding Lock**: Scans client pages and template registries, blocking builds if custom inline components are hardcoded into external views without prior governor signature ratification.

---

## Verification Plan

### Automated Tests
- Run compiler type checks:
  ```bash
  npx tsc --noEmit
  ```
- Run Next.js production build:
  ```bash
  npm run build
  ```

### Manual Verification
1. Access **Template Hub** from the top-right Arch dropdown menu.
2. Toggle permissions using the Header Role impersonation dropdown (e.g., switch to `Buyer` to witness edit operations lock).
3. Switch to `Operator Admin`, click `Duplicate` on the *Dashboard Grid* template, assign it to a client, and verify that the page catalog updates.
