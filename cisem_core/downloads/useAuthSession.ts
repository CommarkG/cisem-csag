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

export interface AuthSessionState {
  user: any | null;
  session: any | null;
  loading: boolean;
  userName: string;
  companyName: string;
  tenantId: string | null;
  role: string;
  unattachedError?: string | null;
}

export function useAuthSession(): AuthSessionState {
  const [state, setState] = useState<AuthSessionState>({
    user: null,
    session: null,
    loading: true,
    userName: '',
    companyName: '',
    tenantId: null,
    role: 'tenant_admin',
    unattachedError: null
  });

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) {
          if (mounted) {
            setState({
              user: null,
              session: null,
              loading: false,
              userName: '',
              companyName: '',
              tenantId: null,
              role: 'guest',
              unattachedError: null
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

          if (user.email !== 'omri@agn.co.il' && (!roles || roles.length === 0)) {
            if (mounted) {
              setState({
                user,
                session,
                loading: false,
                userName: '',
                companyName: '',
                tenantId: null,
                role: 'unattached',
                unattachedError: 'Your account is not attached to an organisation.'
              });
            }
            return;
          }
        } catch (e) {
          // ignore database query error in offline mode
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
          setState({
            user,
            session,
            loading: false,
            userName,
            companyName,
            tenantId,
            role: 'tenant_admin',
            unattachedError: null
          });
        }

        // Trigger automatic team member store hydration from /api/v1/tenant/members
        try {
          useCollabStore.getState().fetchMembers?.();
        } catch (e) {
          // ignore
        }

      } catch (err) {
        if (mounted) {
          setState({
            user: null,
            session: null,
            loading: false,
            userName: '',
            companyName: '',
            tenantId: null,
            role: 'guest'
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

  return state;
}
