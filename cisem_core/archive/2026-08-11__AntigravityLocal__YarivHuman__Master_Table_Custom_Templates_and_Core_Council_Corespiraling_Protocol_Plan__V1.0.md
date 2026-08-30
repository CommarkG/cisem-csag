# Implementation Plan: Master Table, Custom Templates & Core Council Corespiraling Protocol

This document details the architectural blueprint and design contract for the **CISEM Master Table System** and the **Conversational Flow Guide**. It defines the consensus, open debates, and discarded paths under the Core Council protocol.

---

## 1.0 Proposed Architecture & Design

### 1.1 Predefined Templates (Core & Sub-Core Alignment)
We define a single `MasterTable.jsx` component that accepts a `template` prop. The component resolves column visibility dynamically:
* **`master`**: Shows all available system columns (default template).
* **`quotes`**: Optimized for quotes (hides unrelated columns, shows Client/Supplier, Sum, Vat, Total).
* **`finance`**: Optimized for accounting (shows Income/Expense type, Sum, Vat, Total, Currency, and Ref dynamic columns).
* **`products`**: Optimized for inventory (shows Product type, Supplier, Cat number, Priority).

### 1.2 The Conversational Flow Guide
Mounted inline within the greeting banner, this component asks the user: *"What would you like to build today?"*, presenting contextual options (e.g. `[Create Quote Table]`, `[Review Active Invoices]`) to streamline user workflow.

### 1.3 Auto-Width & Max Width Controls (Corecycle 5)
To prevent table columns from wrapping and creating visual noise:
* **Auto-Width**: Enabled by default, using `table-layout: auto` with cell overflow hidden.
* **Max Width Slider**: Added to the table controls, allowing users to manually set the maximum width limit (e.g., `80px` to `400px`) for table inputs and tags, with ellipsis clipping.
* **Scroll Lock Fix**: Update `AdminView.jsx` viewport to `overflow-hidden` so the table card's inner scrollbar handles overflow. This keeps the bottom bar of the viewport sticky and visible.
* **Table Sizing Standards (ListView.jsx & AdminTable.jsx)**:
  * Set explicit width parameters (`w-[px] min-w-[px] max-w-[px]`) on both headers and cell wrappers to enforce layout alignment.
  * Lock the container height in `ListView.jsx` using `overflow-hidden` style properties so that vertical scrolling stays constrained inside the dynamic grid card.

### 1.4 Click-to-Activate & Hover-to-Reveal Cells (Corecycle 5)
To keep the layout clean and simple while remaining powerful:
* **Email & Phone Cells**:
  * Render as simple clickable icons (`Mail` / `Phone`) by default.
  * Hovering over the icon displays the actual content in an overlay tooltip.
  * Clicking copies the text to the clipboard (showing a checkmark indicator) and triggers direct action (`mailto:` / `tel:` link).
* **Tags & Materials**:
  * Render as a collapsed tag count badge (e.g. `Tag (3)`) by default.
  * Clicking expands the full tag pill editor input. Clicking outside or hitting Enter collapses it back to the icon badge.
  * Hovering shows all active tags as a tooltipped comma-separated list.

### 1.5 Click Event Phase Conflict Resolution (Corecycle 6)
To fix dropdown menus disappearing when trying to click them:
* **The Root Cause**: The outside click handler listens to `mousedown` on the document, while button clicks inside the dropdown listen to `onClick` (which fires during the later `mouseup`/`click` phases). Document-level `mousedown` triggers first, unmounting the menu before the click registers.
* **The Solution**:
  * Convert all document event listeners for outside-clicks from `mousedown` to `click`.
  * Add a guard check to verify the clicked target is still attached to the DOM (`document.body.contains(e.target)`). If the clicked button was unmounted during click propagation, the guard prevents closing.
  * Explicitly call `e.stopPropagation()` on all click/toggle containers to isolate event flow.

### 1.6 Header Navigation, Logo Routing & CSS Hover Bridges (Corecycle 7)
* **Logo Homepage Routing**: Wrap the header logo container in a click handler that triggers navigation to `/` and sets the active view to `kanban`.
* **Breadcrumbs History Buttons Integration**: Align the back/forward history navigation arrows directly on the same line as the breadcrumbs, separated by a vertical divider `|`.
* **CSS Hover Bridge**:
  * The `4px` layout gap between dropdown trigger buttons and their menus causes the mouse hover check to break when crossing, unmounting the menus.
  * *Fix*: Add a transparent `::before` pseudo-element to `.admin-dropdown-menu` in [`globals.css`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/globals.css) that extends 6px upwards, keeping the `:hover` selector active during mouse movement.

### 1.7 Globe Language Selection Dropdown Click Control (Corecycle 8)
* **The Problem**: The globe language selector is hover-based, causing the dropdown to close before registered click events resolve when mouse coordinates shift.
* **The Solution**: Convert the globe language selection dropdown from CSS-hover to a Javascript state-controlled toggle (`langOpen` state), matching `StatusDropdown`. Render active checkmarks next to the current language, and register document-level `click` listeners with body-containment verification to gracefully close it on outside click.

### 1.8 Table Edge Safety Padding (Corecycle 9)
* **The Problem**: Table header labels and cell icons rendered next to the card container boundaries get clipped by parent `border-radius` corners when `overflow: hidden` is applied.
* **The Solution**:
  * Inject global CSS rules using CSS logical properties (`padding-inline-start` and `padding-inline-end`) targeting `:first-child` and `:last-child` cells of tables.
  * This guarantees a 16px safety margin at the start and end edges of all rows, preventing clipping of text and action buttons in LTR and RTL orientations alike.

### 1.9 Single-Row Consolidated Toolbar, Default Hover Icons & Multi-Format Documents (Corecycle 10)
* **Consolidated Tab & Toolbar Row**:
  * Re-architect the `AdminView.jsx` layout to merge the tab buttons (Products, Clients, Suppliers, Team Members) and the search/slider/download buttons into a single horizontal row.
* **Icon-Default Hover Triggers**:
  * Convert the search slider labels and import/export buttons to clean icons by default. Hovering over them reveals context labels/tooltips.
  * Group import and export actions under state-controlled click dropdowns.
* **Multi-Format Document Upload/Download**:
  * Support multiple file formats: **CSV**, **Excel** (`.xlsx`), **Word** (`.docx`), **Markdown** (`.md`), **PDF** (`.pdf`), **Google Sheets**, and **Google Docs**.
  * Write full export generators for **CSV** and **Markdown** (MD table representation).
  * Build interactive mock downloads/redirect templates for Excel, Word, and Google Workspace integrations.
* **Crumbnails in old-b2b Pages**:
  * Integrate miniature type indicators (`Home`, `Database`, `Shield`, `ShoppingBag` icons) inside the breadcrumbs list on [`page.tsx`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/old-b2b/page.tsx).

### 1.10 Unified Navigation Arrows Alignment (Corecycle 11)
* **The Problem**: The history navigation arrows (`<` and `>`) in the header reside in a separate visual container, causing alignment discrepancies and breaking the flow of the breadcrumb trail.
* **The Solution**:
  * Move the back/forward history navigation buttons directly inside the global breadcrumb list container wrapper in [`Header.jsx`](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/layout/Header.jsx).
  * Style the navigation buttons to match the exact size (`20px`), border (`1px solid var(--border-light)`), border-radius (`var(--radius-xs)`), and background (`var(--accent-glow)`) of the crumbnail icon badges. This ensures they look and feel like part of a single unified trail.

---

## 2.0 Tag & Status Library Specifications
* **Statuses**: `backlog` (בקלוג), `todo` (לביצוע), `in_progress` (בתהליך), `review` (בסקירה), `done` (הושלם), `blocked` (חסום).
* **Tags**: `devops` (תשתית), `navigation` (ניווט), `components` (רכיבים), `design` (עיצוב), `meeting` (פגישה).

---

## 3.0 Core Council Corespiraling Protocol (Corecycles Log)

Every plan modification progresses through sequential *corecycles*. To prevent redundant exploration of invalid paths, the council logs its architectural decisions and preserves discarded paths with explicit justification tags.

### 3.1 Council Consensus Registry (Ratified Decisions)
1. **`[CONSENSUS.SINGLE_TABLE]`**: Render all templates using a single dynamic `MasterTable.jsx` component instead of building separate domain codebases.
2. **`[CONSENSUS.DND_LIBRARY]`**: Use the already-installed `@dnd-kit/sortable` for row reordering.
3. **`[CONSENSUS.ACTION_OVERFLOW]`**: Group secondary actions (Email, SMS, WhatsApp, Print) under a `•••` hover popover to prevent layout clutter. Limit inline action buttons to 3 primary icons (View, Edit, Delete).
4. **`[CONSENSUS.PRE_BATCH_0]`**: Create `tag_library.json`, `status_library.json`, and `roles_schema.json` as Pre-Batch 0 deliverables to build the system data vocabulary.
5. **`[CONSENSUS.ICON_DEFAULT_CELLS]`**: Collapse email, phone, and tags into interactive icons by default, expanding/revealing contents on click or hover to keep the interface simple.
6. **`[CONSENSUS.MANUAL_WIDTH_LIMITS]`**: Implement manual slider control to limit the max-width of input containers in the table rows.
7. **`[CONSENSUS.MISSING_TRANSLATIONS]`**: Register `contactPhone` in translations map for English, Russian, and Hebrew to align table headers correctly.
8. **`[CONSENSUS.CLICK_PHASE_ISOLATION]`**: Standardize outside click listeners on `click` instead of `mousedown` to prevent unmounting race conditions.
9. **`[CONSENSUS.CSS_HOVER_BRIDGE]`**: Add transparent pseudo-elements to CSS dropdown containers to prevent trigger hover loss.
10. **`[CONSENSUS.LOGO_ROUTING]`**: Bind the global workspace logo to trigger home page navigation.
11. **`[CONSENSUS.INLINE_BREADCRUMBS_HISTORY]`**: Group history back/forth arrow buttons directly inside the breadcrumb line container.
12. **`[CONSENSUS.STATE_CONTROLLED_LANGUAGE_DROPDOWN]`**: Toggle language dropdown state via React click triggers with Check indicators.
13. **`[CONSENSUS.TABLE_EDGE_SAFETY_MARGIN]`**: Apply logical start/end safety padding to the outermost columns of all workspace tables to prevent rounded corner clipping.
14. **`[CONSENSUS.SINGLE_ROW_TOOLBAR]`**: Align administrative tab selectors, query search inputs, and manual column sliders in one single row container.
15. **`[CONSENSUS.MULTI_FORMAT_EXPORTS]`**: Provision multi-format download pathways including Markdown text buffers, PDF printing triggers, and mock Google Cloud Office templates.
16. **`[CONSENSUS.UNIFIED_CRUMBNAIL_ARROWS]`**: Embed back/forward chevrons directly inside the breadcrumb line, sharing matching sizing, border, and background styles with the crumbnails.

---

## 4.0 Proposed Changes

### main_application

#### [MODIFY] [Header.jsx](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/layout/Header.jsx)
* Embed history navigation arrow buttons directly inside the breadcrumbs list wrapper.
* Change arrow styles to match the border, background, and sizing of the crumbnail icon wrappers.

---

## 5.0 Verification Plan

### Automated Tests
* Run TypeScript validation:
  ```powershell
  npx tsc --noEmit
  ```
* Run Next.js build:
  ```powershell
  npm run build
  ```
