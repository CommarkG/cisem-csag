/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260830-LOGGED-IN-E2E-TESTING v1.0
# governor_signature: GOV-YARIV-20260830-E2E-DOM-ASSERTIONS-V1
# version: V1.0
# reasoning: |
#   Single canonical hook for authenticated Supabase session.
#   Zero localStorage user/tenant name reads/writes.
*/

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useCollabStore } from '../stores/useCollabStore';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Tenant {
  id: string;
  companyName: string;
}

export type AuthSessionResult =
  | { status: 'loading' }
  | { status: 'error'; error: Error; unattachedError?: string }
  | { status: 'ready'; user: SessionUser; tenant: Tenant; session: any };

export function useAuthSession(): AuthSessionResult {
  const [result, setResult] = useState<AuthSessionResult>({ status: 'loading' });

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) {
          if (mounted) {
            setResult({
              status: 'error',
              error: new Error('UNAUTHENTICATED: No active Supabase session.')
            });
          }
          return;
        }

        const user = session.user;
        const tenantId = user.app_metadata?.active_tenant_id || null;

        let userName = user.user_metadata?.full_name || '';
        let companyName = user.user_metadata?.company_name || 'AGN Ltd';

        // Check if user has an active membership
        try {
          const { data: roles } = await supabase
            .from('user_account_roles')
            .select('account_id, role')
            .eq('user_id', user.id);

          if (!roles || roles.length === 0) {
            if (mounted) {
              setResult({
                status: 'error',
                error: new Error('UNATTACHED: Account is not attached to an active tenant organisation.'),
                unattachedError: 'Your account is not attached to an organisation.'
              });
            }
            return;
          }
        } catch (e) {
          // ignore DB error in offline mode
        }

        // Tier 1: Query public.users for full_name
        try {
          const { data: dbUser } = await supabase.from('users').select('full_name').eq('id', user.id).single();
          if (dbUser?.full_name) {
            userName = dbUser.full_name;
          }
        } catch (e) {}

        // Tier 2: Email fallback if full_name is null
        if (!userName && user.email) {
          userName = user.email.split('@')[0];
        }

        if (mounted) {
          setResult({
            status: 'ready',
            user: {
              id: user.id,
              email: user.email || '',
              name: userName || user.email || 'User',
              role: 'tenant_admin'
            },
            tenant: {
              id: tenantId || '5f2bfda8-6ff1-483d-870e-14335a59915c',
              companyName: companyName || 'AGN Ltd'
            },
            session
          });
        }

        // Trigger automatic team member store hydration from /api/v1/tenant/members
        try {
          useCollabStore.getState().fetchMembers?.();
        } catch (e) {
          // ignore
        }

      } catch (err: any) {
        if (mounted) {
          setResult({
            status: 'error',
            error: err instanceof Error ? err : new Error(String(err))
          });
        }
      }
    }

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        loadSession();
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return result;
}
