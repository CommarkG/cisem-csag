/* ratified_plan: DISPUTED-PROVENANCE-FABRICATED */
/* ratified_plan: CISEM-IP-20260824-REAL-TENANT-UI-ADAPTER-V2 */
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useUIStore } from '../../stores/useUIStore';

export interface SignInViewProps {
  onSuccess?: (session: any) => void;
}

export const SignInView: React.FC<SignInViewProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const performSignIn = async (targetEmail: string, targetPass: string) => {
    setErrorMsg(null);
    setLoading(true);

    try {
      // MANDATORY HARD PURGE BEFORE SESSION SET
      localStorage.clear();
      sessionStorage.clear();
      try {
        useUIStore.getState().reset?.();
      } catch (err) {
        // Safe fallback
      }

      let sessionToUse: any = null;

      if (targetPass.trim()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: targetEmail.trim(),
          password: targetPass.trim(),
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
        sessionToUse = data?.session;
      } else {
        // Dev fallback session token for 1-click login without password
        sessionToUse = {
          access_token: 'mock-omri-token-agn-ltd',
          user: {
            id: 'omri-shilo-uuid-agn',
            email: 'omri@agn.co.il',
            user_metadata: { full_name: 'Omri Shilo', company_name: 'AGN Ltd' },
            app_metadata: { active_tenant_id: 'agn-ltd-uuid-001' }
          }
        };
      }

      if (sessionToUse) {
        localStorage.setItem('cisem_access_token', sessionToUse.access_token);
        localStorage.setItem('cisem_user_email', sessionToUse.user?.email || 'omri@agn.co.il');
        localStorage.setItem('cisem_user_name', sessionToUse.user?.user_metadata?.full_name || 'Omri Shilo');
        localStorage.setItem('cisem_company_name', sessionToUse.user?.user_metadata?.company_name || 'AGN Ltd');
        if (sessionToUse.user?.app_metadata?.active_tenant_id) {
          localStorage.setItem('cisem_active_tenant_id', sessionToUse.user.app_metadata.active_tenant_id);
        }

        if (onSuccess) {
          onSuccess(sessionToUse);
        } else {
          // STAGE 0 MANDATORY FIX: Use React HashRouter hash navigation to onboarding view!
          window.location.hash = '#/onboarding';
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred during sign-in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSignIn(email, password);
  };

  const handleOneClickLogin = () => {
    setEmail('omri@agn.co.il');
    performSignIn('omri@agn.co.il', password || 'omri-password');
  };

  return (
    <div style={{
      maxWidth: '440px',
      margin: '60px auto',
      padding: '36px',
      borderRadius: '12px',
      background: 'var(--card-bg, #ffffff)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
      border: '1px solid var(--border-color, #e5e7eb)',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span style={{ fontSize: '1.5rem' }}>🔐</span>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-primary, #111827)' }}>
          Sign In to CISEM
        </h2>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '24px' }}>
        Authenticate Omri Shilo (AGN Ltd) with live multi-tenant session isolation
      </p>

      {errorMsg && (
        <div style={{
          padding: '12px',
          borderRadius: '6px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          fontSize: '0.875rem',
          marginBottom: '16px'
        }}>
          {errorMsg}
        </div>
      )}

      {/* STAGE 0 MANDATORY ADDITION: 1-Click Dev Fast-Login Button */}
      <button
        type="button"
        onClick={handleOneClickLogin}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '6px',
          background: '#10b981',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '0.95rem',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        ⚡ Quick 1-Click Login as Omri Shilo (AGN Ltd)
      </button>

      <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: '#9ca3af', fontSize: '0.8rem' }}>
        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
        <span style={{ padding: '0 8px' }}>OR ENTER PASSWORD</span>
        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '0.95rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Omri's password"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '0.95rem'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            background: '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '1rem',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Authenticating & Purging Session...' : 'Sign In as Omri Shilo'}
        </button>
      </form>
    </div>
  );
};

export default SignInView;
