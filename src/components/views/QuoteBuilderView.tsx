/* ratified_plan: DISPUTED-PROVENANCE-FABRICATED */
import React, { useState } from 'react';

export interface QuoteBuilderProps {
  inquiryId: string;
  onQuoteCreated?: (quote: any) => void;
}

export const QuoteBuilderView: React.FC<QuoteBuilderProps> = ({ inquiryId, onQuoteCreated }) => {
  const [currency, setCurrency] = useState('ILS');
  const [validUntil, setValidUntil] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<Array<{ description: string; quantity: number; unit_price: number }>>([
    { description: '', quantity: 1, unit_price: 0 }
  ]);
  const [loading, setLoading] = useState(false);

  const addLine = () => {
    setLines([...lines, { description: '', quantity: 1, unit_price: 0 }]);
  };

  const updateLine = (index: number, field: string, value: any) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const handleCreateQuote = async () => {
    setLoading(true);
    try {
      // 1. Create quote header
      const token = typeof window !== 'undefined' ? localStorage.getItem('cisem_access_token') : null;
      const res = await fetch('/api/v1/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          inquiry_id: inquiryId,
          currency,
          valid_until: validUntil,
          notes
        })
      });
      const data = await res.json();
      const quoteId = data.quote?.id;

      if (quoteId) {
        // 2. Add line items
        for (const line of lines) {
          if (line.description) {
            await fetch(`/api/v1/quotes/${quoteId}/lines`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              },
              body: JSON.stringify(line)
            });
          }
        }
        if (onQuoteCreated) onQuoteCreated(data.quote);
      }
    } catch (err) {
      console.error('Error creating quote:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return lines.reduce((acc, l) => acc + (l.quantity * l.unit_price), 0);
  };

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl border border-slate-800 max-w-3xl mx-auto shadow-2xl space-y-6">
      <h2 className="text-xl font-bold text-sky-400">Universal Quote Builder (CoreCycle 1)</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Currency</label>
          <select
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="ILS">ILS (₪)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Valid Until</label>
          <input
            type="date"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-2">Quote Line Items</label>
        {lines.map((line, idx) => (
          <div key={idx} className="flex gap-3 mb-2 items-center">
            <input
              type="text"
              placeholder="Item description"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm"
              value={line.description}
              onChange={(e) => updateLine(idx, 'description', e.target.value)}
            />
            <input
              type="number"
              placeholder="Qty"
              className="w-20 bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm"
              value={line.quantity}
              onChange={(e) => updateLine(idx, 'quantity', parseFloat(e.target.value) || 0)}
            />
            <input
              type="number"
              placeholder="Unit Price"
              className="w-28 bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm"
              value={line.unit_price}
              onChange={(e) => updateLine(idx, 'unit_price', parseFloat(e.target.value) || 0)}
            />
            <span className="w-24 text-right text-sm text-emerald-400 font-mono">
              {(line.quantity * line.unit_price).toFixed(2)} {currency}
            </span>
          </div>
        ))}
        <button
          onClick={addLine}
          className="text-xs text-sky-400 hover:underline mt-1"
        >
          + Add Line Item
        </button>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-800">
        <div>
          <span className="text-xs text-slate-400 block">Total Calculated Value</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono">
            {calculateTotal().toFixed(2)} {currency}
          </span>
        </div>
        <button
          onClick={handleCreateQuote}
          disabled={loading}
          className="py-3 px-6 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-lg transition text-sm disabled:opacity-50"
        >
          {loading ? 'Creating Quote...' : 'Generate Quote'}
        </button>
      </div>
    </div>
  );
};
