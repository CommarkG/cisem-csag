# Storefront Whitelabel Exporter UI & Git-Sync Plan

1.1. **Introduction**:
This design plan specifies the implementation of the **Enterprise Storefront Whitelabel Exporter UI and Git-Sync pipeline**. It expands the monetization strategy by restricting whitelabel custom domains and automated Git repository synchronization exclusively to Tier 3 (Enterprise) accounts. It implements cryptographic verification at the boundary, a visual settings dashboard, and an interactive terminal console simulating live Git pushing.

---

## User Review Required

> [!IMPORTANT]
> - **Tier-3 (Enterprise) Hard Gate**: The `/api/v1/tenant/whitelabel` configurations and Git sync endpoints will strictly block any request whose signed `TenantContext` does not specify the Enterprise tier. Pro (Tier 2) and Free (Tier 1) accounts receive an HTTP 403 Forbidden response.
> - **Git-Sync Terminal Simulation**: For visual demonstration in the mockup portal, clicking the "Sync to Repository" button will open a terminal emulator log stream detailing actual git actions (e.g. key exchange, repository binding, stylesheet injection, bundle push, and webhook dispatch).

---

## Open Questions

> [!NOTE]
> - **Q: How is the whitelabel state persisted?**: It will resolve via request-scoped parameter hooks. The settings will save in the active FastAPI session state, falling back to a memory mock map when the backend is offline.

---

## Proposed Changes

### Component: Style System & Visual Frontend

#### [MODIFY] [page.tsx](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/page.tsx)
- Integrate an **Enterprise Whitelabel** setup dashboard panel.
- Implement config fields: Custom Domain Name, Git Target URL (SSH/HTTPS), and Webhook Deployment Secret.
- Add an interactive terminal output box displaying real-time lines of a mock Git commit & deployment process.
- Overlay a locked shield banner on the tab if the user's active session is Free or Pro tier, preventing settings edits.

---

### Component: Next.js API Proxy Routes

#### [MODIFY] [[...path]/route.ts](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/api/v1/%5B...path%5D/route.ts)
- Append mock data resolvers in `getMockData` for `tenant/whitelabel`:
  - `GET /api/v1/tenant/whitelabel` -> Returns active whitelabel configurations (custom domain, git repo url, sync status).
  - `POST /api/v1/tenant/whitelabel` -> Validates that the signed `TenantContext` is Enterprise. If not, returns `403 Forbidden` (`ENTERPRISE_TIER_REQUIRED`). Validates domain syntax and Git URL formats.
  - `POST /api/v1/tenant/whitelabel/sync` -> Executes simulation response of a Git push process.

---

### Component: Python Platform Core & Registry

#### [MODIFY] [main.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/backend/src/backend/main.py)
- Append the corresponding FastAPI routes mapping whitelabel settings.
- Implement signed token decoding checks ensuring only Tier 3 can access this controller.

#### [NEW] [update_registry_v1.41.py](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/cisem_core/update_registry_v1.41.py)
- Create a script to copy and upgrade the Universal Workspace Registry to version `V1.41`.
- Add registry references for the new files and re-calculate SHA-256 checksums.

---

## Verification Plan

### Automated Tests
- Run `python cisem_core/platform_core/cisem_gate.py` to verify workspace compliance.
- Run `npm run build` to confirm Next.js build compilation.
- Execute mock HTTP request checks to `/api/v1/tenant/whitelabel` using Enterprise, Pro, and Free JWT tokens. Assert `200 Success` for Enterprise and `403 Forbidden` for others.

### Manual Verification
- Navigate to `http://localhost:3000` in the browser.
- Select the "Enterprise Whitelabel" tab.
- Input a valid custom domain (e.g. `shop.company.com`) and Git repository URL, then click **Sync to Repository**.
- Verify that the terminal console runs the log stream and reports completion.
