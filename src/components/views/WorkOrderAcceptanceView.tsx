/* ratified_plan: DISPUTED-PROVENANCE-FABRICATED */
import React, { useState } from 'react';

export interface WorkOrderAcceptanceProps {
  quoteId: string;
  onWorkOrderSigned?: (workOrder: any) => void;
}

export const WorkOrderAcceptanceView: React.FC<WorkOrderAcceptanceProps> = ({ quoteId, onWorkOrderSigned }) => {
  const [evidenceKind, setEvidenceKind] = useState('internal_acceptance');
  const [acceptedBy, setAcceptedBy] = useState('');
  const [evidenceData, setEvidenceData] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAcceptAndIssue = async () => {
    setLoading(true);
    try {
      // 1. Record customer acceptance
      const token = typeof window !== 'undefined' ? localStorage.getItem('cisem_access_token') : null;
      const acceptRes = await fetch(`/api/v1/quotes/${quoteId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          evidence_kind: evidenceKind,
          evidence_data: evidenceData,
          accepted_by: acceptedBy
        })
      });
      const acceptData = await acceptRes.json();
      const acceptanceId = acceptData.acceptance_record?.id;

      if (acceptanceId) {
        // 2. Derive signed work order
        const woRes = await fetch(`/api/v1/acceptance-records/${acceptanceId}/work-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ acceptance_record_id: acceptanceId, notes })
        });
        const woData = await woRes.json();
        if (onWorkOrderSigned) onWorkOrderSigned(woData.work_order);
      }
    } catch (err) {
      console.error('Error accepting quote & deriving work order:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl border border-slate-800 max-w-2xl mx-auto shadow-2xl space-y-4">
      <h2 className="text-xl font-bold text-amber-400">Universal Acceptance & Work Order Signing</h2>
      
      <div>
        <label className="block text-xs text-slate-400 mb-1">Evidence Kind (PR-11100 / P-19)</label>
        <select
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none"
          value={evidenceKind}
          onChange={(e) => setEvidenceKind(e.target.value)}
        >
          <option value="internal_acceptance">Internal Acceptance</option>
          <option value="customer_reference">Customer Reference Code</option>
          <option value="captured_confirmation">Captured Confirmation Email/Text</option>
          <option value="signature">Digital Signature</option>
        </select>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Accepted By (Name / Identifier)</label>
        <input
          type="text"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none"
          value={acceptedBy}
          onChange={(e) => setAcceptedBy(e.target.value)}
          placeholder="e.g. John Doe, VP Procurement"
        />
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Evidence Data / Confirmation Reference</label>
        <textarea
          rows={2}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none"
          value={evidenceData}
          onChange={(e) => setEvidenceData(e.target.value)}
          placeholder="Enter PO number, email signature block, or reference hash..."
        />
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Work Order Notes</label>
        <textarea
          rows={2}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Execution instructions for work order..."
        />
      </div>

      <button
        onClick={handleAcceptAndIssue}
        disabled={loading}
        className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition text-sm disabled:opacity-50"
      >
        {loading ? 'Deriving Work Order...' : 'Sign & Issue Work Order'}
      </button>
    </div>
  );
};
