/* ratified_plan: DISPUTED-PROVENANCE-FABRICATED */
import React, { useState } from 'react';

export interface InquiryIntakeProps {
  onInquiryCreated?: (inquiry: any) => void;
}

export const InquiryIntakeView: React.FC<InquiryIntakeProps> = ({ onInquiryCreated }) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [requirementsSummary, setRequirementsSummary] = useState('');
  const [budget, setBudget] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cisem_access_token') : null;
      const response = await fetch('/api/v1/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          contact_name: contactName,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          requirements_summary: requirementsSummary,
          estimated_budget: budget
        })
      });
      const data = await response.json();
      if (data.inquiry && onInquiryCreated) {
        onInquiryCreated(data.inquiry);
      }
    } catch (err) {
      console.error('Error creating inquiry:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl border border-slate-800 max-w-2xl mx-auto shadow-2xl">
      <h2 className="text-xl font-bold mb-4 text-emerald-400">Universal Inquiry Intake (CoreCycle 1)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Contact Name *</label>
          <input
            type="text"
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="e.g. Acme Corp Operations"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="contact@acme.com"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
            <input
              type="tel"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+972-50-000-0000"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Requirements Summary</label>
          <textarea
            rows={3}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            value={requirementsSummary}
            onChange={(e) => setRequirementsSummary(e.target.value)}
            placeholder="Describe the project requirements..."
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Estimated Budget (ILS)</label>
          <input
            type="number"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            value={budget}
            onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition text-sm disabled:opacity-50"
        >
          {loading ? 'Submitting Inquiry...' : 'Submit Inquiry'}
        </button>
      </form>
    </div>
  );
};
