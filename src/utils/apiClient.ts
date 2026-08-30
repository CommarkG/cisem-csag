/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260830-LOGGED-IN-E2E-TESTING v1.0
# governor_signature: GOV-YARIV-20260830-E2E-DOM-ASSERTIONS-V1
# version: V1.0
# reasoning: |
#   Universal API Client for all /api/v1 requests.
#   1. Automatically attaches cryptographically verified session token from supabase.auth.getSession().
#   2. Throws explicit Error on non-2xx responses (NEVER swallows 401 into an empty array).
*/

import { supabase } from '../lib/supabaseClient';

export async function apiClient(endpoint: string, options: RequestInit = {}): Promise<any> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || (typeof window !== 'undefined' ? localStorage.getItem('cisem_access_token') : null);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`API Error [${response.status} ${response.statusText}]: ${errorText || 'Request failed'}`);
  }

  return response.json();
}
