/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: PRE-RATIFICATION-LEGACY
# governor_signature: GOV-LEGACY-BASELINE
# status: PRE_RATIFICATION_LEGACY
# reasoning: |
#   File created prior to formal plan ratification governance. Preserved as legacy baseline.
*/
// Ratified Plan: CISEM-IP-20260810-FRONTEND-PLAYBOOK-REFACTOR
// Architectural Reasoning: Modular Enterprise storefront and git repository synchronizer with dynamic bash sync console simulation.
// Parent Principles: PR-13990 (Sandbox Boundaries), AX-50000

"use client";

import React, { useState } from "react";

interface WhitelabelViewProps {
  isDarkMode: boolean;
  locale: "en" | "he";
  dict: any;
}

export default function WhitelabelView({ isDarkMode, locale, dict }: WhitelabelViewProps) {
  const isRTL = locale === "he";

  const [whitelabelDomain, setWhitelabelDomain] = useState("shop.company.com");
  const [whitelabelGitUrl, setWhitelabelGitUrl] = useState("git@github.com:enterprise/storefront.git");
  const [whitelabelSecret, setWhitelabelSecret] = useState("wh_sec_example_12345");
  const [whitelabelSyncStatus, setWhitelabelSyncStatus] = useState("synced");
  const [whitelabelLogs, setWhitelabelLogs] = useState<string[]>([
    "Initializing Git sync pipeline...",
    "SSH credentials verified with git@github.com",
    "Branch synchronization completed. Verdict: SUCCESS"
  ]);
  const [isSyncingWhitelabel, setIsSyncingWhitelabel] = useState(false);
  const [whitelabelLicenseTier, setWhitelabelLicenseTier] = useState<"free" | "pro" | "enterprise">("enterprise");
  const [whitelabelError, setWhitelabelError] = useState<string | null>(null);

  const handleSaveWhitelabel = () => {
    if (!whitelabelDomain.includes(".")) {
      setWhitelabelError(isRTL ? "דומיין שגוי. יש להזין כתובת תקינה." : "Invalid custom domain name.");
      return;
    }
    setWhitelabelError(null);
    alert(isRTL ? "הגדרות מותג לבן נשמרו!" : "Whitelabel settings saved!");
  };

  const handleSyncWhitelabel = () => {
    setIsSyncingWhitelabel(true);
    setWhitelabelLogs(prev => [...prev, "Sync triggered at runtime...", "Fetching latest repository updates..."]);
    setTimeout(() => {
      setIsSyncingWhitelabel(false);
      setWhitelabelSyncStatus("synced");
      setWhitelabelLogs(prev => [...prev, "Repository synchronized successfully. 0 errors, 0 warnings."]);
    }, 1500);
  };

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center text-right">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isRTL ? "שער מיתוג לבן וצינור סנכרון מאגרים" : "Enterprise Whitelabel & Git-Sync"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isRTL 
              ? "הגדרת דומיינים מותאמים אישית וסנכרון אוטומטי של קוד המקור של החנות ישירות ל-GitHub/GitLab של הלקוח."
              : "Configure custom domains and automate storefront codebase synchronization to customer repositories."}
          </p>
        </div>
        
        {/* Mock License Tier Selector */}
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <span className="font-bold text-slate-500">{isRTL ? "דרגת רישיון לסימולציה:" : "License Tier:"}</span>
          <div className="flex gap-1">
            {(["free", "pro", "enterprise"] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setWhitelabelLicenseTier(tier)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                  whitelabelLicenseTier === tier
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 p-8 shadow-lg overflow-hidden min-h-[500px]">
        {/* Lock Overlay for Free/Pro */}
        {whitelabelLicenseTier !== "enterprise" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm text-center p-8 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 text-3xl mb-4 animate-bounce">
              🔒
            </div>
            <h3 className="text-xl font-bold text-white">
              {isRTL ? "רכיב נעול - נדרש רישיון Enterprise" : "Enterprise Feature Only"}
            </h3>
            <p className="max-w-md text-sm text-slate-400 mt-2 leading-relaxed">
              {isRTL 
                ? "הגדרת דומיין מותאם אישית וסנכרון מאגרי קוד ל-Git מוגבלים לחשבונות ארגוניים בלבד. אנא שדרג את החשבון לקבלת גישה לצינור הסנכרון והמותג הלבן."
                : "Custom domain mapping and repository git synchronization are available for Enterprise license tier only. Please upgrade to unlock these workflows."}
            </p>
            <button
              onClick={() => setWhitelabelLicenseTier("enterprise")}
              className="mt-6 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg transition-all"
            >
              {isRTL ? "שדרג ל-Enterprise לצרכי הדגמה" : "Upgrade to Enterprise for Demo"}
            </button>
          </div>
        )}

        {/* Sync Settings and Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-right">
          {/* Settings Form */}
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              {isRTL ? "הגדרות מותג לבן" : "Whitelabel Config"}
            </h2>

            {whitelabelError && (
              <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 text-xs">
                ⚠️ {whitelabelError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">
                  {isRTL ? "דומיין מותאם אישית (Custom Domain)" : "Custom Domain (CNAME)"}
                </label>
                <input
                  type="text"
                  value={whitelabelDomain}
                  onChange={(e) => setWhitelabelDomain(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm outline-none focus:border-amber-500 font-mono text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">
                  {isRTL ? "כתובת מאגר Git יעד (Git Repository)" : "Git Repository SSH/HTTPS URL"}
                </label>
                <input
                  type="text"
                  value={whitelabelGitUrl}
                  onChange={(e) => setWhitelabelGitUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm outline-none focus:border-amber-500 font-mono text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">
                  {isRTL ? "מפתח Deploy Secret" : "Deploy Secret Hook Token"}
                </label>
                <input
                  type="password"
                  value={whitelabelSecret}
                  onChange={(e) => setWhitelabelSecret(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm outline-none focus:border-amber-500 font-mono text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 justify-start">
              <button
                onClick={handleSaveWhitelabel}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md"
              >
                💾 {isRTL ? "שמור הגדרות" : "Save Settings"}
              </button>
              <button
                onClick={handleSyncWhitelabel}
                disabled={isSyncingWhitelabel}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2"
              >
                {isSyncingWhitelabel ? "🔄 ..." : (isRTL ? "🚀 סנכרן מאגר כעת" : "🚀 Sync Repo Now")}
              </button>
            </div>
          </div>

          {/* Console Output */}
          <div className="flex flex-col h-full space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-400 font-mono">
                git-sync-terminal
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isRTL ? "פלט תהליך סנכרון (Git Push)" : "Git Push Console output"}
              </h3>
            </div>

            <div className="flex-1 min-h-[280px] rounded-2xl bg-slate-950 p-5 font-mono text-[11px] text-slate-350 border border-slate-800 overflow-y-auto space-y-2 text-left" dir="ltr">
              {whitelabelLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  $ {log}
                </div>
              ))}
              {isSyncingWhitelabel && (
                <div className="text-indigo-400 animate-pulse">$ uploading codebase changesets to main branch...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
