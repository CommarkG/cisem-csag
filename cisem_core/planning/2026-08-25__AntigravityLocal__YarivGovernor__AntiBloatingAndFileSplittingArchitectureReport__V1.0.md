# CISEM ANTI-BLOATING AND GOVERNED FILE-SPLITTING ARCHITECTURE REPORT V1.0

```yaml
metadata:
  date: "2026-08-25"
  author: "Antigravity Local Builder"
  governor_ratification: "GOV-RATIFIED-2026-08-25"
  governing_rules: ["PR-11100", "PR-11400", "AX-100000", "Phase 20 Monolithic File Guard"]
  status: "RATIFIED_FOR_PRIORITIZATION"
```

## 1. Executive Summary

1.1 **Current Modularity Reality**:
An audit of workspace files against Phase 20 (1,500-line Monolithic File Guard Ceiling) reveals critical file bloating across backend controllers and frontend page shells:
- `backend/src/backend/main.py`: **2,371 lines** (Violates 1,500-line ceiling by +871 lines).
- `src/app/page.tsx`: **4,200 lines** (Violates 1,500-line ceiling by +2,700 lines).
- `src/components/views/ListView.jsx`: **831 lines**.
- `src/components/shared/AdminTable.jsx`: **760 lines**.
- `src/utils/translations.js`: **636 lines**.

1.2 **Architectural Goal**:
Deconstruct monolithic files into modular, domain-isolated units governed by CISEM's 5-digit numbering grid (`U0B` backend, `U0S` frontend, `U0T` translations).

---

## 2. Governed 5-Digit Numbering Grid & Splitting Plan

### 2.1 Domain U0B · Backend API Controller Splitting Plan (`backend/src/backend/`)
`main.py` will be reduced to a lightweight FastAPI app orchestrator (<300 lines) by extracting 4 domain routers:

1. **`U0B01__Router__Inquiries__V1.0.py`**:
   - *Target Path*: `backend/src/backend/routers/inquiries_router.py`
   - *Scope*: `/api/v1/inquiries/*`, `/api/v1/briefs/*` (mapped to `inquiries`).
2. **`U0B02__Router__Quotes__V1.0.py`**:
   - *Target Path*: `backend/src/backend/routers/quotes_router.py`
   - *Scope*: `/api/v1/quotes/*`, `/api/v1/proposals/*` (mapped to `quotes` & `quote_lines`).
3. **`U0B03__Router__Tenant__V1.0.py`**:
   - *Target Path*: `backend/src/backend/routers/tenant_router.py`
   - *Scope*: `/api/v1/tenant/members`, `/api/v1/tenant/vocabulary`, `/api/v1/tenant/settings`.
4. **`U0B04__Router__Catalog__V1.0.py`**:
   - *Target Path*: `backend/src/backend/routers/catalog_router.py`
   - *Scope*: `/api/v1/catalog/*`, `/api/v1/suppliers/*`, `/api/v1/rate_cards/*`.

### 2.2 Domain U0S · Frontend Viewport Splitting Plan (`src/app/page.tsx`)
`page.tsx` will be stripped of inline viewports and reduced to a clean layout router (<350 lines):

1. **`U0S01__Viewport__Catalog__V1.0.jsx`**:
   - *Target Path*: `src/components/views/CatalogViewport.jsx`
2. **`U0S02__Viewport__Inquiries__V1.0.jsx`**:
   - *Target Path*: `src/components/views/InquiriesViewport.jsx`
3. **`U0S03__Viewport__Quotes__V1.0.jsx`**:
   - *Target Path*: `src/components/views/QuotesViewport.jsx`
4. **`U0S04__Viewport__Settings__V1.0.jsx`**:
   - *Target Path*: `src/components/views/SettingsViewport.jsx`

### 2.3 Domain U0T · Dynamic DB Vocabulary & Translations Hook (`src/utils/translations.js`)
1. **`U0T01__Hook__TenantVocabulary__V1.0.js`**:
   - *Target Path*: `src/hooks/useTenantVocabulary.js`
   - *Scope*: Replaces hardcoded 636-line `translations.js` dictionary with live fetch from `/api/v1/tenant/vocabulary` (backed by DB tables `vocabulary_terms` and `translations`).

---

## 3. Implementation Prioritization

| Priority | Task Code | Target File | Action | Unblocked Impact |
|---|---|---|---|---|
| P1 | `U0B03-TNT` | `backend/src/backend/routers/tenant_router.py` | Split tenant/members/vocab endpoints | Unblocks LGG Phase 20 compliance on backend |
| P2 | `U0B01-INQ` | `backend/src/backend/routers/inquiries_router.py` | Split inquiry & quote endpoints | Eliminates main.py monolith |
| P3 | `U0S01-CAT` | `src/components/views/CatalogViewport.jsx` | Extract inline viewports from `page.tsx` | Reduces `page.tsx` from 4.2k to <350 lines |
| P4 | `U0T01-VOC` | `src/hooks/useTenantVocabulary.js` | Retire hardcoded `translations.js` | Extends vocabulary consolidation across all screens |

