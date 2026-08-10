# Implementation Plan: Cisem CsAg Mockup Homepage & Page Issues Resolution
**Plan ID**: `CISEM-IP-20260810-ISSUES-RESOLUTION`  
**Version**: 1.1  
**Authority**: Governor Ratification Required  

This plan outlines the steps to resolve the 4 key issues identified on the page, ensuring full adherence to the classical rectangular minimalist style and removing developer/warning overlays.

---

## User Review Required

> [!IMPORTANT]
> - **Global Flattening (Light & Dark Modes)**: All border-radius overrides in CSS will be applied globally to eliminate rounded buttons, tags, badges, and input elements in light mode as well. We will use a wildcard attribute selector `[class*="rounded-"]` to enforce `border-radius: 0px !important`.
> - **Next.js Dev Overlay Removal**: The dev indicators, announcers, and error overlays will be completely hidden via CSS overrides to ensure a clean visual mockup presentation.
> - **Anti-Theater Fetch Redirections**: All UI fetches will be redirected from direct `http://localhost:8000/api/v1` URLs to relative `/api/v1` proxy endpoints. This routes traffic through the Next.js catch-all proxy route which serves mock responses when the backend is offline, resolving connection failures.

---

## Open Questions

> [!NOTE]
> - **Turbopack Warning Ignoration**: We will configure Next.js experimental Turbopack options in `next.config.ts` to ignore the static file tracing warning. This resolves the Turbopack NFT trace issue without losing dynamic file scanning capability.

---

## Proposed Changes

### Component: Style System & Configurations

#### [MODIFY] [globals.css](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/globals.css)
- Move border-radius overrides, custom scrollbar styling, and color mapping selectors (amber/orange/blue-to-red) from the `.dark` class scope to the global root scope.
- Use `[class*="rounded-"]` to target all Tailwind rounded utility variants and force-flatten them.
- Add CSS overrides to hide dev portals and indicators:
  ```css
  #nextjs-portal,
  next-route-announcer,
  .nextjs-toast-errors-parent,
  [data-nextjs-dialog-overlay] {
    display: none !important;
  }
  ```

#### [MODIFY] [next.config.ts](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/next.config.ts)
- Add experimental Turbopack configuration to ignore the `Encountered unexpected file in NFT list` issue:
  ```typescript
  experimental: {
    turbopack: {
      ignoreIssue: [
        {
          path: /.*/,
          title: /Encountered unexpected file in NFT list/,
        },
      ],
    },
  }
  ```

---

### Component: Frontend UI & Proxies

#### [MODIFY] [page.tsx](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/page.tsx)
- Replace all direct `http://localhost:8000/api/v1` strings in fetch requests with `/api/v1` to utilize the local catch-all proxy for mock data fallback.
- Update `knownMenus` in `onSelectCategory` to support all dynamic sub-views (`template_hub`, `web_pages`, `crm_pipeline`, `sandbox_playground`, etc.) so navigation functions correctly.

#### [MODIFY] [dynamic_menu.tsx](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/components/dynamic_menu.tsx)
- Replace `http://localhost:8000/api/v1/menu/dynamic` fetch call with `/api/v1/menu/dynamic` relative endpoint.

---

### Component: Control Plane & Registry

#### [NEW] [update_registry_v1.34.py](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/update_registry_v1.34.py)
- Create a python script to bump the registry to `V1.34.yaml`, update metadata, append history entry, and run the Workspace Reconciler to sync SHA-256 hashes of modified files.

#### [DELETE] [Universal_Workspace_and_Accountability_Registry__V1.33.yaml](file:///c:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/2026-08-05__CISEM__Universal_Workspace_and_Accountability_Registry__V1.33.yaml)
- Prune the old registry file once `V1.34.yaml` is fully ratified.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify compilation passes cleanly with zero Turbopack warnings.
- Run `python cisem_core/cisem_gate.py` to confirm all validation phases pass.

### Manual Verification
- Load `http://localhost:3000` in the browser.
- Check light mode: verify that all inputs, buttons, and badges are completely rectangular (no rounded corners) and active tab borders are red, not yellow/orange.
- Verify that the bottom-left Next.js dev indicator warning badge is hidden.
