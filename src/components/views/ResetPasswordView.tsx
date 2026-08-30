/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260830-LOGGED-IN-E2E-TESTING v1.0
# governor_signature: GOV-YARIV-20260830-E2E-DOM-ASSERTIONS-V1
# version: V1.0
# reasoning: |
#   Password Reset Callback View.
#   Calls supabase.auth.updateUser({ password: newPassword }).
*/

import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export const ResetPasswordView: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMsg(null);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setError(error.message);
      } else {
        setMsg('Password updated successfully! You can now sign in with your new password.');
        setTimeout(() => {
          window.location.hash = '#/signin';
        }, 2000);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '60px auto',
      padding: '32px',
      borderRadius: '12px',
      background: '#ffffff',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>Set New Password</h2>
      {error && <div style={{ color: '#dc2626', marginBottom: '12px' }}>{error}</div>}
      {msg && <div style={{ color: '#059669', marginBottom: '12px' }}>{msg}</div>}

      <form onSubmit={handleUpdate}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '4px' }}>
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter new password"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            background: '#2563eb',
            color: '#fff',
            fontWeight: 600,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Updating Password...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordView;
