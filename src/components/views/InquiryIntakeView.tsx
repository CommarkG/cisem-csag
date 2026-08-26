/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: PLAN-CISEM-20260826-ITP-WIRING
# governor_signature: GOV-YARIV-20260826-ITP-WIRING-V2
# version: V2.0
# reasoning: |
#   Stage 1 Implementation of ratified PLAN-CISEM-20260826-ITP-WIRING V2.0.
#   Persists free-text intent to POST /api/v1/inquiries (PostgreSQL inquiries table),
#   hydrates on mount from GET /api/v1/inquiries, sets counterparty_id = NULL,
#   and contains ZERO localStorage fallback to guarantee live database row proof.
# history:
#   - timestamp: "2026-08-26T07:15:00Z"
#     ratified_plan: PLAN-CISEM-20260826-ITP-WIRING
#     governor_signature: GOV-YARIV-20260826-ITP-WIRING-V2
#     reasoning: "Governor ratified Stage 1 Inquiry Intake persistence & hydration."
# */
import React, { useState, useEffect } from 'react';

export interface InquiryIntakeProps {
  onInquiryCreated?: (inquiry: any) => void;
}

export const InquiryIntakeView: React.FC<InquiryIntakeProps> = ({ onInquiryCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [budget, setBudget] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/v1/inquiries', {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.inquiries) {
          setInquiries(data.inquiries);
        }
      }
    } catch (err: any) {
      console.warn('Error fetching persisted inquiries:', err);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const intentTitle = title.trim() || contactName.trim() || "New Free-Text Inquiry";

    try {
      const response = await fetch('/api/v1/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: intentTitle,
          description: description,
          contact_name: contactName,
          contact_email: contactEmail,
          estimated_budget: budget,
          counterparty_id: null // NULL per Schema Registry (counterparty_id is nullable)
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.inquiry) {
        setSuccessMessage(`Inquiry persisted cleanly in PostgreSQL (ID: ${data.inquiry.id || 'new'})`);
        setTitle('');
        setDescription('');
        if (onInquiryCreated) {
          onInquiryCreated(data.inquiry);
        }
        await fetchInquiries();
      } else {
        throw new Error("Invalid response payload from /api/v1/inquiries");
      }
    } catch (err: any) {
      console.error('Error creating inquiry:', err);
      // STRICT POLICY: NO localStorage fallback. Error alert displayed directly to user.
      setErrorMessage(`Persistence Failed: ${err.message || 'Server Unreachable'}. No local storage cache used.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl border border-slate-800 max-w-3xl mx-auto shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-emerald-400">Universal Inquiry Intake (CoreCycle 1 · Stage 1)</h2>
          <p className="text-xs text-slate-400">Direct PostgreSQL Persistence · Nullable Counterparty ID</p>
        </div>
        <span className="px-2.5 py-1 text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
          RATIFIED: GOV-V2
        </span>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-950/80 border border-red-800 rounded-lg text-red-300 text-xs font-mono">
          ⚠️ {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-lg text-emerald-300 text-xs font-mono">
          ✓ {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Inquiry Title / Brief Subject *</label>
          <input
            type="text"
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 100 premium branded notebooks for AGN Ltd event by Sept 15"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Free-Text Intent Details</label>
          <textarea
            rows={3}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe scope, quantities, destinations, or specific requirements..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Contact Name</label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Omri Shilo"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Estimated Budget (ILS)</label>
            <input
              type="number"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
              value={budget}
              onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition text-sm disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <span>Persisting to PostgreSQL...</span>
          ) : (
            <span>Submit Intent to PostgreSQL</span>
          )}
        </button>
      </form>

      {/* Active Persisted Inquiries Section */}
      <div className="border-t border-slate-800 pt-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-200">Persisted Active Inquiries (Database Hydrated)</h3>
          <button
            onClick={fetchInquiries}
            className="text-xs text-emerald-400 hover:underline"
          >
            ↻ Refresh List
          </button>
        </div>

        {inquiries.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">No persisted inquiries found in tenant context.</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {inquiries.map((inq, idx) => (
              <div key={inq.id || idx} className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-emerald-300">{inq.title || inq.contact_name || 'Untitled Inquiry'}</div>
                  <div className="text-xs text-slate-400 truncate max-w-md">{inq.description || inq.requirements_summary || 'No description'}</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-700 text-slate-300 rounded">
                    {inq.status_code || 'proposal_draft'}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">
                    counterparty_id: <code className="text-slate-400">{inq.counterparty_id === null ? 'NULL' : (inq.counterparty_id || 'NULL')}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
