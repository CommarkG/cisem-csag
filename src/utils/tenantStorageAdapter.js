// =============================================================================
// CISEM Mandatory Code Header
// File           : tenantStorageAdapter.js
// Ratified plan  : M3 & M6 Tenant-Blind Client State Prevention (2026-08-21)
// Architectural  : Dual-stamped local storage adapter.
//                  Stamps every written payload with _tenant_id and _user_id
//                  (or a transient guest_device_session_id for anonymous users).
//                  Validates stamp locally against active memory session state.
//                  Includes M6 legacy unpartitioned key purge on startup.
// Axioms         : AX-SECURITY-01, AX-STATELESS-01, U1.2.40 (Prevention Protocol)
// =============================================================================

const LEGACY_KEYS_TO_PURGE = [
  'dima-tasks',
  'dima-archive-tasks',
  'dima-collab',
  'dima-admin',
  'dima-notifications',
  'dima-onboarding',
  'dima-active-user',
  'dima-simulated-role'
];

/**
 * M6: Startup Purge of Legacy Unpartitioned Storage Keys.
 * Clears unpartitioned dima-* storage items lacking a dual-stamp prefix.
 */
export function purgeLegacyStorageKeys() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    LEGACY_KEYS_TO_PURGE.forEach((key) => {
      const val = window.localStorage.getItem(key);
      if (val) {
        // If raw string or un-stamped object, purge it
        try {
          const parsed = JSON.parse(val);
          if (!parsed || !parsed._tenant_id) {
            window.localStorage.removeItem(key);
          }
        } catch {
          window.localStorage.removeItem(key);
        }
      }
    });
  } catch (e) {
    console.warn('[tenantStorageAdapter] Legacy purge warning:', e);
  }
}

/**
 * M3: Dual-Stamp Storage Adapter
 * Wraps localStorage getItem/setItem to stamp tenant & person identity.
 */
export const tenantStorageAdapter = {
  getItem: (key, sessionContext = {}) => {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    try {
      const payload = JSON.parse(raw);
      if (!payload || typeof payload !== 'object' || !payload._tenant_id) {
        // Legacy unpartitioned key found — return null and trigger purge
        window.localStorage.removeItem(key);
        return null;
      }

      const activeTenant = sessionContext.tenantId || 'guest_tenant';
      const activeUser = sessionContext.userId || sessionContext.guestSessionId || 'guest_user';

      // Validate stamp locally against in-memory session
      if (payload._tenant_id !== activeTenant || payload._user_id !== activeUser) {
        // Identity mismatch: refused without network call
        return null;
      }

      return payload.data;
    } catch {
      return null;
    }
  },

  setItem: (key, value, sessionContext = {}) => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const activeTenant = sessionContext.tenantId || 'guest_tenant';
    const activeUser = sessionContext.userId || sessionContext.guestSessionId || 'guest_user';

    const stampedPayload = {
      _tenant_id: activeTenant,
      _user_id: activeUser,
      _timestamp: new Date().toISOString(),
      data: value
    };

    window.localStorage.setItem(key, JSON.stringify(stampedPayload));
  },

  removeItem: (key) => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(key);
  }
};
