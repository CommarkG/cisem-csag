# Implementation Plan: System-Wide Optimizations & Verification Checks

This plan addresses the three approved core requirements (Green API verification, CSV receipt metadata, PDF print orientation) and includes a comprehensive review of today's modules (Medusa integration, custom fields, and color mappings).

---

## 1.0 Proposed Enhancements

### 1.1 Green API Connection Handshake (getStateInstance)
* **API Proxy Extension**: We will add a `/whatsapp/status` handler inside `route.ts` that triggers a GET request to Green API's `getStateInstance` endpoint.
* **UI Indicator**: We will place a "Check Status" button in `SettingsView.jsx`. When clicked, it calls the status route and renders a state badge (`● Active` or `● Disconnected`).

### 1.2 CSV Import Receipt metadata Toast
* **Feedback System**: We will modify `handleImportCsv` inside `AdminView.jsx` to collect parsing metrics:
  * Number of records imported.
  * Array of custom field keys successfully matched case-insensitively.
* **Metadata Alert**: Show a notification summarizing these results to give the operator certainty.

### 1.3 Dynamic PDF Print Optimizer & Margins Protection
* **Landscape Print Injector**: When exporting to PDF, we will count the visible columns in the active grid. If columns exceed five, we dynamically inject landscape rules:
  ```css
  @media print {
    @page { size: landscape; margin: 10mm; }
  }
  ```
* **Auto-Width Scale**: Scale font-sizes down to `8pt` for wide tables to keep data within printable bounds.

### 1.4 MedusaJS Operation Alerts & Synchronization feedback
* **Toast Dispatchers**: Add notification store toasts for Medusa client adapter success/failure events when sync catalog items or quotes trigger in `AdminView.jsx`.

---

## 2.0 Four-Question Checkpoint

1. **What already exists?**
   * Green API routes, CSV parsing hooks, PDF printer triggers, and MedusaJS grids.
2. **Where should this belong?**
   * Proxy endpoints in `src/app/api/v1/whatsapp/` routes.
   * View calibrations in `SettingsView.jsx` and `AdminView.jsx`.
3. **What will this affect?**
   * Hardens the operational reliability and visual feedback of today's systems.
4. **What is the smallest executable proof that validates this decision?**
   * Build compilation exit code 0 and successful simulation tests.

---

## 3.0 Proposed Changes

### [MODIFY] [route.ts](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/api/v1/whatsapp/send/route.ts)
* Support GET requests to check instance connection statuses dynamically from Green API.

### [MODIFY] [SettingsView.jsx](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/views/SettingsView.jsx)
* Add status verification widgets with trigger buttons next to credentials.

### [MODIFY] [AdminView.jsx](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/views/AdminView.jsx)
* Update CSV importer callbacks to log parsed fields and inject landscape styles dynamically on the PDF print container.
* Add success toasts for Medusa product catalog sync calls.

---

## 4.0 Verification Plan

### Automated Tests
* Run compilation check:
  ```powershell
  npx tsc --noEmit
  npm run build
  ```
