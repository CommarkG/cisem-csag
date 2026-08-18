// @playbook_category: Micro-interaction Module
/**
 * RATIFIED RESOLUTION : GOV-2026-08-16-TENANCY / Quota Upgrade Modal
 * REASONING           : Self-service modal dialog prompting plan upgrades when circuit breaker or quota warnings trigger.
 * PARENT PRINCIPLES   : AxiomsAndPrinciples.md (U1.2.32.7, Quota Conversion UI)
 */

import React from "react";

interface QuotaUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: string;
}

export default function QuotaUpgradeModal({ isOpen, onClose, currentTier = "STARTER" }: QuotaUpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5">
        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>⚡</span> Upgrade Package Quota
            </h3>
            <p className="text-xs text-slate-400">Current Tier: <span className="text-cyan-400 font-mono font-bold">{currentTier}</span></p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-bold p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
          <p className="text-xs text-slate-300 leading-relaxed">
            Your tenant account has reached its monthly API call limit (100,000 requests). Upgrade to the <span className="text-cyan-400 font-bold">PRO</span> or <span className="text-amber-400 font-bold">ENTERPRISE</span> tier to remove circuit breaker restrictions.
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => {
              alert("Redirecting to Plan Upgrade Checkout...");
              onClose();
            }}
            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-cyan-950/50 transition"
          >
            Upgrade to PRO Tier ($99/mo)
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition"
          >
            Remind Me Later
          </button>
        </div>
      </div>
    </div>
  );
}
