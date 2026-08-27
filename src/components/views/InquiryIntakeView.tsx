/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: PLAN-CISEM-20260826-ITP-WIRING
# governor_signature: GOV-YARIV-20260826-ITP-WIRING-V2
# version: V5.0
# reasoning: |
#   Stage 1 Human-First UX Re-anchoring to Canonical Platform Light Glassmorphism UI.
#   Replaces clashing dark slate containers with native platform glassmorphism tokens
#   (--surface, --text-primary, --text-secondary, --accent, --border).
#   Ensures 100% visual consistency with PageGreetingBanner and platform layout.
# history:
#   - timestamp: "2026-08-26T08:58:00Z"
#     ratified_plan: PLAN-CISEM-20260826-ITP-WIRING
#     governor_signature: GOV-YARIV-20260826-ITP-WIRING-V2
#     reasoning: "Governor mandate: Enforce 100% visual consistency with platform light glassmorphism theme."
# */
import React, { useState, useEffect } from 'react';
import PageGreetingBanner from '../shared/PageGreetingBanner';

export interface InquiryIntakeProps {
  onInquiryCreated?: (inquiry: any) => void;
}

export const InquiryIntakeView: React.FC<InquiryIntakeProps> = ({ onInquiryCreated }) => {
  const [intentText, setIntentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchInquiries = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('cisem_access_token') : null;
    if (!token) return; // Unauthenticated guest intake does not read existing inquiries!

    try {
      const response = await fetch('/api/v1/inquiries', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.inquiries) {
          setInquiries(data.inquiries);
        }
      }
    } catch (err: any) {
      console.warn('Error loading inquiries:', err);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = intentText.trim();
    if (!text) return;

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/v1/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: text,
          description: text
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error (${response.status})`);
      }

      const data = await response.json();
      if (data.inquiry) {
        setSuccessMessage('Inquiry submitted successfully.');
        setIntentText('');
        if (onInquiryCreated) {
          onInquiryCreated(data.inquiry);
        }
        await fetchInquiries();
      } else {
        throw new Error('Could not submit inquiry. Please try again.');
      }
    } catch (err: any) {
      console.error('Error submitting inquiry:', err);
      setErrorMessage(err.message || 'Unable to connect to the server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Universal Shared Page Greeting Banner */}
      <PageGreetingBanner view="inquiry-intake" />

      {/* Main Glassmorphism Card Container (Matches Platform Glass Design System) */}
      <div
        className="p-8 rounded-2xl border w-full shadow-lg backdrop-blur-md space-y-6"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        {/* Header Area */}
        <div className="space-y-1">
          <h2
            className="text-xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Start a New Inquiry
          </h2>
          <p
            className="text-sm font-normal"
            style={{ color: 'var(--text-secondary)' }}
          >
            Describe what you need in your own words. We will handle the setup and next steps.
          </p>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div
            className="p-4 rounded-xl border text-sm flex items-start space-x-2"
            style={{
              background: 'var(--danger-bg)',
              borderColor: 'var(--danger)',
              color: 'var(--danger)'
            }}
          >
            <span className="font-bold">✕</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Feedback */}
        {successMessage && (
          <div
            className="p-4 rounded-xl border text-sm flex items-start space-x-2"
            style={{
              background: 'var(--success-bg)',
              borderColor: 'var(--success)',
              color: 'var(--success)'
            }}
          >
            <span className="font-bold">✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Single Open Question Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="inquiry-intent"
              className="block text-sm font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              What do you need?
            </label>
            <textarea
              id="inquiry-intent"
              rows={4}
              required
              className="w-full rounded-xl p-4 text-base transition shadow-sm leading-relaxed focus:outline-none"
              style={{
                background: 'var(--surface-hover)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)'
              }}
              value={intentText}
              onChange={(e) => setIntentText(e.target.value)}
              placeholder="Describe what you need. For example: 100 branded notebooks for a conference in March."
            />
          </div>

          <button
            type="submit"
            disabled={loading || !intentText.trim()}
            className="w-full py-3.5 px-6 font-semibold rounded-xl transition text-base shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            style={{
              background: 'var(--accent)',
              color: 'var(--text-inverse)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            {loading ? (
              <span>Sending...</span>
            ) : (
              <span>Start Inquiry</span>
            )}
          </button>
        </form>

        {/* Active Inquiries List */}
        <div
          className="border-t pt-6 mt-8 space-y-4"
          style={{ borderColor: 'var(--border-light)' }}
        >
          <div className="flex items-center justify-between">
            <h3
              className="text-base font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Your Inquiries
            </h3>
            <button
              onClick={fetchInquiries}
              className="text-xs font-semibold hover:underline transition"
              style={{ color: 'var(--accent)' }}
            >
              Refresh
            </button>
          </div>

          {inquiries.length === 0 ? (
            <p
              className="text-sm italic py-2"
              style={{ color: 'var(--text-muted)' }}
            >
              No inquiries submitted yet.
            </p>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {inquiries.map((inq, idx) => (
                <div
                  key={inq.id || idx}
                  className="p-4 rounded-xl border flex items-center justify-between shadow-sm transition"
                  style={{
                    background: 'var(--surface-hover)',
                    borderColor: 'var(--border-light)'
                  }}
                >
                  <div className="space-y-1">
                    <div
                      className="text-sm font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {inq.title || inq.description || 'Inquiry'}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Submitted {inq.created_at ? new Date(inq.created_at).toLocaleDateString() : 'recently'}
                    </div>
                  </div>
                  <span
                    className="px-3 py-1 text-xs font-semibold rounded-full border"
                    style={{
                      background: 'var(--accent-subtle)',
                      color: 'var(--accent)',
                      borderColor: 'var(--border-light)'
                    }}
                  >
                    Draft
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiryIntakeView;
