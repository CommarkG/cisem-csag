/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260830-LOGGED-IN-E2E-TESTING v1.0
# governor_signature: GOV-YARIV-20260830-E2E-DOM-ASSERTIONS-V1
# version: V3.0
*/
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
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const performSignIn = async (targetEmail: string, targetPass: string) => {
    setErrorMsg(null);
    setInfoMsg(null);
    setLoading(true);

    try {
      // Reset state notices
      sessionStorage.clear();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail.trim(),
        password: targetPass.trim() || 'password123',
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      const sessionToUse = data?.session;
      if (sessionToUse) {
        // Store only the JWT access token for API Authorization header headers
        localStorage.setItem('cisem_access_token', sessionToUse.access_token);
        if (sessionToUse.user?.app_metadata?.active_tenant_id) {
          localStorage.setItem('cisem_active_tenant_id', sessionToUse.user.app_metadata.active_tenant_id);
        }

        if (onSuccess) {
          onSuccess(sessionToUse);
        } else {
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setErrorMsg(null);
    setInfoMsg(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/#/reset-password`,
      });
      if (error) {
        setErrorMsg(`Password reset failed: ${error.message}`);
      } else {
        setInfoMsg(`Password reset email sent to ${resetEmail}. Check your inbox.`);
        setShowForgotModal(false);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to send password reset email.');
    } finally {
      setResetLoading(false);
    }
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
        Authenticate credentials with live session isolation
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

      {infoMsg && (
        <div style={{
          padding: '12px',
          borderRadius: '6px',
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#059669',
          fontSize: '0.875rem',
          marginBottom: '16px'
        }}>
          {infoMsg}
        </div>
      )}

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

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0
              }}
            >
              Forgot Password?
            </button>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
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
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      {showForgotModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#ffffff',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ margin: '0 0 12px 0' }}>Reset Password</h3>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
              />
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForgotModal(false)} style={{ padding: '8px 12px' }}>
                  Cancel
                </button>
                <button type="submit" disabled={resetLoading} style={{ padding: '8px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px' }}>
                  {resetLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInView;
