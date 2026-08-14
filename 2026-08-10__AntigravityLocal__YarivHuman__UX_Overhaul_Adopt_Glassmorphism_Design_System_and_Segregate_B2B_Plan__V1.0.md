# UX Overhaul — Adopt Glassmorphism Design System & Segregate B2B

This plan outlines the design and structural overhaul of the Cisem CsAg Platform UX. It adopts a premium, universal glassmorphism design system (gradients, translucent panels, rounded corners, Inter typography, violet accent tokens), isolates all B2B features under the centralized Purchasing & Quotes Hub, removes redundant double menus, and adds breadcrumb tracking with history back/forth navigation.

---

## 1. Governance Quintet Registrations

To prevent unanchored modules and ensure full architectural validation, each modified element maps to the following governance profiles:

| Target File | Pipeline | Protocol | CoreSpine | Config/Wizard | Playbook / Plan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **globals.css** | Rendering Pipeline | UX Style Compliance | Frontend CoreSpine | Theme Customizer | This Overhaul Plan |
| **dynamic_menu.tsx** | Navigation Routing | Menu Authorization | UI Header Spine | Role Settings Drawer | This Overhaul Plan |
| **page.tsx** | Layout & Viewport | Navigation Integrity | Main App Spine | Developer Mode Switch | This Overhaul Plan |
| **en.json / he.json** | Internationalization | Translation Completeness | Content CoreSpine | Language Selector | This Overhaul Plan |

---

## 2. Component Design & Integration Specifications

### 2.1. Styling System (DIMA-derived Glassmorphism)
* **Font Loading Strategy**: Load Google Font `Inter` with fallback to prevent render blocking:
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  ```
  Set `font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;`.
* **Theme Selector Unification**: Combine Tailwind `.dark` classes and design token attributes:
  - Toggling theme will simultaneously toggle `document.documentElement.classList.add("dark")` AND `document.documentElement.setAttribute("data-theme", "dark")`.
* **Corner Radius Restoration**: Remove the rigid `.rounded-0px` and `border-radius: 0px !important` overrides. Re-introduce responsive rounded curves using:
  - `--radius-lg: 16px;`
  - `--radius-md: 12px;`
  - `--radius-sm: 8px;`
* **Color Accents Shift**: Replace generic red/amber accents with DIMA violet tokens:
  - Light Accent: `#6c5ce7` (indigo/violet)
  - Dark Accent: `#a78bfa` (lavender/purple)

### 2.2. Navigation & History Stack Contract
* **History Data Model**: A stateful object inside `page.tsx`:
  - `historyStack: string[]` (array of menu keys visited)
  - `historyIndex: number` (active pointer in the history array)
* **Arrow Action Click Handlers**:
  - `handleGoBack()`: Decrements `historyIndex` by 1 and sets `currentMenu = historyStack[newIndex]`. Disabled if `historyIndex === 0`.
  - `handleGoForward()`: Increments `historyIndex` by 1 and sets `currentMenu = historyStack[newIndex]`. Disabled if `historyIndex === historyStack.length - 1`.
* **Breadcrumbs Component Routing**: Renders below the header as a horizontal bar in the format: `Home / [Dropdown Category] / [Subtopic] / [Active Page]`. Clicks on breadcrumbs navigate to target viewports.

### 2.3. B2B App Segregation
* **Viewport**: Set `currentMenu = "purchasing_quotes_hub"` when clicking `Ext` > `Business` > `Purchasing & Quotes Hub`.
* **Sub-View Navigation**: A vertical side-menu lets users toggle between:
  1. `brief`: Ingest Client Brief
  2. `catalog`: Catalog & Sheets Ingestion
  3. `crm`: Sales CRM & PDF Pipeline
  4. `suppliers`: Subcontractors Configuration
  5. `design`: Design Studio & Branding Simulator

### 2.4. Universal Platform Home Page
* **Telemetry Display**: Displays platform-level universal metrics only:
  - DB Connectivity Status
  - Local FastAPI status
  - Cael watch-lock loop telemetry
  - LGG Gate checksum validations list

---

## 3. Proposed File Modifications

### [MODIFY] [globals.css](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/globals.css)
- Implement glassmorphism classes (`.glass-card`, `.glass-card-static`) using `backdrop-filter: blur(20px)`.
- Set background gradient on body.
- Define light/dark variables for `--surface`, `--accent`, `--border`, `--bg-gradient`.
- Remove all `border-radius: 0px !important` flat overrides.

### [MODIFY] [dynamic_menu.tsx](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/dynamic_menu.tsx)
- Remove the "B2B Portal" badge next to the logo.
- Setup `Ext` dropdown to map `Business` -> `Purchasing & Quotes Hub` (calls `onSelectCategory("purchasing_quotes_hub")`).
- Remove B2B items from the `Tools` category.
- Apply glassmorphism styling to dropdown panels.

### [MODIFY] [page.tsx](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/page.tsx)
- Track history stack variables (`historyStack`, `historyIndex`).
- Remove the double menu horizontal tab rows (`WORKSPACE CONTROLS & DYNAMIC TAB GRID`).
- Insert Breadcrumb navigation bar with back/forth arrows right under the dynamic menu header.
- Restructure `home` viewport to render only universal platform metrics and schemas dashboard.
- Add `purchasing_quotes_hub` container rendering the sidebar + selected B2B sub-page.

### [MODIFY] [en.json](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/locales/en.json) / [he.json](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/locales/he.json)
- Add missing localization strings:
  - `"menu_purchasing_quotes_hub"`: `"Purchasing & Quotes Hub"` / `"מרכז רכש והצעות"`
  - `"purchasing_quotes_hub"`: `"Purchasing & Quotes Hub (B2B)"` / `"מרכז רכש והצעות מחיר (B2B)"`
  - `"search_placeholder"`: `"Search components..."` / `"חפש רכיבים..."`
  - `"breadcrumb_home"`: `"Home"` / `"בית"`
  - `"breadcrumb_ext"`: `"Ext"` / `"הרחבה"`
  - `"breadcrumb_business"`: `"Business"` / `"עסקים"`

---

## 4. Verification Plan

### Automated Tests
* Run compilation gate to verify syntax and checksums:
  ```bash
  python cisem_core/platform_core/cisem_gate.py
  ```
* Run playbooks validation:
  ```bash
  python scratch/test_api.py
  ```

### Manual Verification
* Access `localhost:3000`. Confirm glass styling, Inter font, and violet colors are active.
* Verify B2B sub-views render correctly when toggled inside the new `Purchasing & Quotes Hub` sidebar.
* Verify back/forth arrows step through the history stack, and clicking breadcrumb links updates the active page.
