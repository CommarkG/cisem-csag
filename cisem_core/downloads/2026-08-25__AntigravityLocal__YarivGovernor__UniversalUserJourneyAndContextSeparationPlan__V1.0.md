# UNIVERSAL USER JOURNEY & CONTEXT SEPARATION ARCHITECTURE PLAN
**Active Version:** `Version 1.0`  
**Ratified Plan ID:** `PLAN-CISEM-20260825-USER-JOURNEY-V1`  
**Governor Signature:** `GOV-YARIV-20260825-USER-JOURNEY-APPROVED`  
**Parent Principles:** AxiomsAndPrinciples V1.30 §PR-11100, §PR-11400, §AX-12000, §AX-20.1

---

## 1. Executive Summary & Intent

1.1 **Core Objective**: Establish a universal, tenant-isolated User Journey architecture that completely decouples platform infrastructure and universal UI spines (Header, Dynamic Menu, Navigation, Viewports) from specific user profile data, while enforcing strict viewport boundary security (zero overlaps, zero popover clipping).

1.2 **Axiom Enforced**: **Rule 20.1 (Tenant Identity Non-Discriminator Invariant)**.
- Application code paths MUST NEVER branch conditionally based on tenant IDs or specific user identities.
- Universal layout components receive structured tenant context (`TenantContext`) and active user state (`CurrentUserState`) dynamically from single-source-of-truth stores (`useTenantSessionStore`).

---

## 2. Universal vs. Specific User Separation Model

| Architectural Layer | Universal Platform Spine (Shared Engine) | Specific Tenant / User Context (Dynamic Rows) |
|---|---|---|
| **API Boundary** | Stateless FastAPI endpoints (`/api/v1/tenant/members`) | Database rows in `user_account_roles`, `users`, `customer_accounts` |
| **State Storage** | `useTenantSessionStore`, `useUIStore` | Authenticated session token claims |
| **UI Components** | `Header.jsx`, `UniversalOnboardingViewport.jsx` | User profile details, avatar, assigned roles, team members list |
| **Viewport Boundary Guard** | `max-width: calc(100vw - 24px)`, `zIndex: 1000`, `boxSizing: border-box` | Dynamic dropdown items and popover contents |

---

## 3. Viewport Boundary & Overlap Prevention Law

3.1 **Single-Row Placement Rule (Rule 21)**: Combine indicators, titles, and controls on a single row to conserve vertical space and maintain text density.

3.2 **Sibling Representation Rule (Rule 22)**: Sibling items inside horizontal groups must retain consistent icon/text formatting.

3.3 **Zero Overflow Invariant**:
- Every floating popover, dropdown, or modal container MUST include explicit bounds limits:
  `right: 0; left: auto; max-width: calc(100vw - 24px); box-sizing: border-box;`
- Container overflow clipping (`overflow: hidden`) on top header bars MUST NOT clip child z-index popovers.

---

## 4. Automated Viewport & User Journey Verification Suite

4.1 Automated E2E verification via Playwright (`scratch/verify_ui.js`) tests:
1. **User Profile Dropdown Click**: Triggers click on `<User />` button, verifies popup opens inside viewport coordinates without clipping.
2. **Team Members Hydration**: Verifies 5 real database members (`Gil Shilo`, `Omri Shilo`, `Idan Shilo`, `Revital`, `Yariv Fink`) render across all tenant views.
3. **Viewport Bounds Assertions**: Asserts `popover.right <= window.innerWidth` and `popover.left >= 0`.
