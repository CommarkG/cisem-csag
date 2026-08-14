# Implementation Plan: Clean Page Rewrite and Modularization

This plan proposes a clean rewrite of the colossal `src/app/page.tsx` file from scratch. Instead of maintaining a 3800-line JSX file prone to compilation brace mismatches and code leftovers, we will build a modular component-based architecture. We will start with a clean page structure containing only the sticky top dynamic menu, breadcrumbs history navigation, light/dark theme toggles, and the AI assistant chat widget, and gradually reintegrate the viewports as separate, clean React components.

## User Review Required

> [!IMPORTANT]
> - Rebuilding the page from scratch will resolve the current compilation syntax error (`Unexpected token`) permanently by replacing the monolithic page structure with clean, modular imports.
> - Views (e.g., Platform Telemetry & Priority Engine, B2B Purchasing Hub Sidebar & tabs, Whitelabel Git Sync, System Schema Auditing) will be relocated into separate, readable component files under `src/components/views/`.

## Proposed Changes

---

### main_application

#### [MODIFY] [page.tsx](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/page.tsx)
- Rebuild the page from scratch, keeping it under 300 lines.
- Initialize core states: active tab/menu, history stack for back/forward navigation, dark/light theme toggle, locale translation hooks, and mounted lifecycle.
- Render layout shell:
  1. Sticky top navigation bar wrapping [`dynamic_menu.tsx`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/dynamic_menu.tsx).
  2. Breadcrumbs row with navigation arrows and language selection toggles in the same row.
  3. Dynamic viewport rendering based on `currentMenu`.
  4. Floating [`agent_chat_widget.tsx`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/agent_chat_widget.tsx).

---

### views_library

#### [NEW] [HomeView.tsx](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/views/HomeView.tsx)
- Clean component rendering platform-level telemetry metrics: compile safety gates, Supabase connectivity status, pgvector partition audits, Cael watch-lock loop status.
- Includes the developer Priority Engine slider cards.

#### [NEW] [B2bHubView.tsx](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/views/B2bHubView.tsx)
- Unified component containing the glassmorphic B2B sidebar on the right column (`lg:col-span-1`) mapping to Brief Clarifier, Catalog Ingestion, CRM Pipeline, Supplier Registry, and Design Studio.
- Displays the active viewport dynamically on the left column (`lg:col-span-3`).

#### [NEW] [SystemSchemaView.tsx](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/views/SystemSchemaView.tsx)
- Encapsulates pgvector partition table audits, postgres connections, and schema mapping.

#### [NEW] [WhitelabelView.tsx](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/views/WhitelabelView.tsx)
- Contains domain settings, git clone repository URLs, and git-sync action status telemetry.

## Verification Plan

### Automated Tests
- Run CISEM compiler safety gates:
  ```powershell
  python cisem_core/platform_core/cisem_gate.py
  ```
- Run Next.js production build verification:
  ```powershell
  npm run build
  ```
- Update Universal Workspace Registry SHA-256 hashes:
  ```powershell
  python cisem_core/update_registry_v1.43.py
  ```

### Manual Verification
- Access http://localhost:3000 to verify light/dark transitions, responsive layouts, and menu clicks.
