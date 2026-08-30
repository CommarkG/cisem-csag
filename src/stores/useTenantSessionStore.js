// =============================================================================
// CISEM Mandatory Code Header
// File           : useTenantSessionStore.js
// Ratified plan  : Prerequisite Store Split & M2 Store Scope Declaration (2026-08-21)
// Architectural  : Decoupled session store carrying tenant_id, user_id, and role.
//                  Annotated with mandatory store scope declaration.
// Scope          : @store_scope: tenant
// Axioms         : AX-SECURITY-01, AX-STATELESS-01, U1.2.40 (Prevention Protocol)
// =============================================================================

import { create } from 'zustand';

// Generate transient guest session ID for unauthenticated sessions
const generateGuestSessionId = () => {
  return 'guest_' + Math.random().toString(36).substring(2, 11);
};

export const useTenantSessionStore = create((set, get) => ({
  tenantId: null,
  userId: null,
  role: 'tenant_admin',
  guestSessionId: generateGuestSessionId(),

  setSession: (tenantId, userId, role) => set({
    tenantId,
    userId,
    role: role || 'tenant_admin'
  }),

  setActiveUserId: (userId) => set({ userId }),

  resetSession: () => set({
    tenantId: null,
    userId: null,
    role: 'tenant_admin',
    guestSessionId: generateGuestSessionId()
  })
}));
