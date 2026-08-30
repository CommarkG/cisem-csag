# Implementation Plan: Hebrew UI RTL Alignment & Fixed Table Layout Controls

**Plan ID**: `CISEM-IP-20260811-FRONTEND-ALIGNMENT-AND-LAYOUT-FIX`
**Date**: 2026-08-11
**Governor Signature Required**: `GOV-YARIV-20260811-FRONTEND-ALIGNMENT-V1.0`
**Status**: `DRAFT — PENDING GOVERNOR RATIFICATION`

---

## 1.0 Why This Matters

> [!IMPORTANT]
> **RTL Alignment Issue**: When the Hebrew language (RTL) is selected, table headers and cell inputs align incorrectly (often left-aligned) because Tailwind utilities like `text-left` are hardcoded on `<table>` elements and custom classes like `justify-end` misalign flex content under native RTL.
>
> **Column Sizing Issue**: The table currently uses `table-layout: auto`, which causes the browser to ignore explicit column widths (e.g. `col.width`) in favor of dynamic content widths, leading to inconsistent columns.
>
> **Gate Vulnerability**: The UI Playbook Compliance Scanner (Phase 19) is bypassed on Windows because it fails to normalize path separators (`\` vs `/`) when filtering modified files, leading to zero verification coverage for UI changes.

---

## 2.0 Proposed Changes

### 2.1 Table Sizing and Alignment Hardening

#### [MODIFY] [AdminTable.jsx](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/shared/AdminTable.jsx)
- Set JSDoc CISEM Code Header at the top of the file.
- Add `table-fixed` layout and remove hardcoded `text-left` from `<table>` to allow RTL inherit:
  ```javascript
  <table 
    className="w-full border-collapse table-fixed text-start" 
    dir={language === 'he' ? 'rtl' : 'ltr'}
    style={{ minWidth: '1000px', textAlign: language === 'he' ? 'right' : 'left' }}
  >
  ```
- Rewrite `getColumnAlign` to map standard text fields natively without LTR/RTL hardcoding:
  ```javascript
  return {
    headerClass: 'justify-start',
    cellClass: 'text-start justify-start',
    textStyle: { textAlign: isRtl ? 'right' : 'left' }
  };
  ```
- Wire `language` context to the `EmailCell` and `PhoneCell` sub-components, updating their input styling to explicitly align `right` in Hebrew:
  ```javascript
  style={{ textAlign: isRtl ? 'right' : 'left' }}
  ```

#### [MODIFY] [ListView.jsx](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/views/ListView.jsx)
- Set JSDoc CISEM Code Header and `@playbook_category` comment at the top of the file.
- Update `<table>` element class to use `text-start` and add `dir={language === 'he' ? 'rtl' : 'ltr'}`:
  ```javascript
  <table 
    className={`w-full text-start border-collapse text-${tableFontSize}`} 
    dir={language === 'he' ? 'rtl' : 'ltr'}
    style={{ textAlign: language === 'he' ? 'right' : 'left' }}
  >
  ```

#### [MODIFY] [HomeView.tsx](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/views/HomeView.tsx)
- Set JSDoc CISEM Code Header at the top.
- Make the "SHA-256 Hash" header cell and its content cells direction-aware under Hebrew to satisfy "Never Left in Hebrew":
  ```typescript
  className={`px-4 py-3 ${isRTL ? "text-right" : "text-left"}`}
  ```

### 2.2 Compiler Gating Hardening

#### [MODIFY] [cisem_gate.py](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/platform_core/cisem_gate.py)
- Normalize file paths to forward slashes in Phase 19 `check_ui_playbook_compliance` to ensure it triggers correctly on Windows:
  ```python
  fpath_norm = ui_file.replace("\\", "/")
  # Then check "src/components" in fpath_norm
  ```

---

## 3.0 Verification Plan

### 3.1 Automated Tests
- Run compiler gate checks:
  ```bash
  python cisem_core/platform_core/cisem_gate.py
  ```
- Ensure zero TS compilation issues:
  ```bash
  npx tsc --noEmit
  ```

### 3.2 Manual Verification
- Toggle app language to Hebrew.
- Verify table headers and cells are aligned cleanly to the right.
- Verify columns respect width boundaries under different zoom levels.
