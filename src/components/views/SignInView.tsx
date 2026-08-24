/* ratified_plan: DISPUTED-PROVENANCE-FABRICATED */
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useUIStore } from '../../stores/useUIStore';

export interface SignInViewProps {
  onSuccess?: (session: any) => void;
}

export const SignInView: React.FC<SignInViewProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('omri@agn.co.il');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      // MANDATORY HARD PURGE BEFORE SESSION SET
      // Clears cached demonstration data from browser storage and resets stores
      localStorage.clear();
      sessionStorage.clear();
      try {
        useUIStore.getState().reset?.();
      } catch (err) {
        // Safe fallback if reset is optional
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data?.session) {
        // Store access token for bearer headers
        localStorage.setItem('cisem_access_token', data.session.access_token);
        if (data.session.user?.app_metadata?.active_tenant_id) {
          localStorage.setItem('cisem_active_tenant_id', data.session.user.app_metadata.active_tenant_id);
        }
        if (onSuccess) {
          onSuccess(data.session);
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred during sign-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '420px',
      margin: '60px auto',
      padding: '32px',
      borderRadius: '12px',
      background: 'var(--card-bg, #ffffff)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
      border: '1px solid var(--border-color, #e5e7eb)',
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary, #111827)' }}>
        Sign In to CISEM
      </h2>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '24px' }}>
        Enter credentials to authenticate Omri Shilo (AGN Ltd)
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

      <form onSubmit={handleSignIn}>
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
            required
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
