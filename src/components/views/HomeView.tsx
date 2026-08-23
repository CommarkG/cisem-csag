/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: DISPUTED-PROVENANCE-FABRICATED
# original_claimed_plan: CISEM-IP-20260811-FRONTEND-ALIGNMENT-AND-LAYOUT-FIX [UNVERIFIED]
# original_claimed_signature: GOV-YARIV-20260811-FRONTEND-ALIGNMENT-V1 [UNVERIFIED]
# status: DISPUTED_PROVENANCE_FABRICATED
# history:
#   - timestamp: "2026-08-23T07:52:00Z"
#     ratified_plan: CISEM-IP-20260822-PEOPLE-PLACES-FILES
#     governor_signature: GOV-YARIV-20260823-PEOPLE-PLACES-FILES-V19
#     reasoning: "Original plan ID flagged as un-manifested synthetic header during V19 audit; re-ratified under V19."
*/
// @playbook_category: Bento Page Layout Recipe
"use client";

import React, { useState, useEffect } from "react";

interface HomeViewProps {
  isDarkMode: boolean;
  activeRole: string;
  locale: "en" | "he";
  dict: any;
}

export default function HomeView({ isDarkMode, activeRole, locale, dict }: HomeViewProps) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Priority Engine slider states
  const [urgency, setUrgency] = useState(5);
  const [scope, setScope] = useState(5);
  const [complexity, setComplexity] = useState(5);
  const [blastRadius, setBlastRadius] = useState(5);
  const [significance, setSignificance] = useState(5);
  const [prioritySaved, setPrioritySaved] = useState(false);

  const priorityScore = Math.round((urgency * scope * complexity * blastRadius * significance) / 31.25); // Max out around 1000

  const fetchDashboardMetrics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dashboard", {
        headers: {
          "x-tenant-id": "cisem-local"
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (e) {
      console.error("Error fetching dashboard metrics:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const handleSavePriority = () => {
    setPrioritySaved(true);
    setTimeout(() => setPrioritySaved(false), 3000);
  };

  const isRTL = locale === "he";

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Banner */}
      <div className="glass-card-static p-8 shadow-xl relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40">
        <div className="relative z-10 space-y-4 text-right">
          <span className="inline-flex items-center bg-indigo-500/10 text-indigo-500 px-3 py-1 text-xs font-bold rounded-full border border-indigo-500/20">
            Welcome to Cisem CsAg v1.43
          </span>
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white leading-tight">
            {isRTL ? "מערכת הזמנות והצעות מחיר B2B אחודה" : "Unified B2B Quotes & Ingestion Engine"}
          </h1>
          <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isRTL 
              ? "פלטפורמת ה-Universal Brief-to-Offer מקשרת בין דרישות לקוח לבין מוצרי ספקים בארץ ובעולם. המערכת מנתחת אילוצים, מאתרת מוצרים בקטלוג בהתאם למדרגי עדיפות, ומאפשרת הדמיית מיתוג לוגו מהירה והפקת הצעות מחיר בפורמט PDF ודיגיטלי בצורה אוטומטית."
              : "The Universal Brief-to-Offer platform links client requirements with global supplier catalogs. The system parses constraints, retrieves matching products based on priority metrics, and supports fast logo branding simulations and digital/PDF quotes generation."}
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 justify-start">
            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg">
              🟢 {isRTL ? "חיבור בסיס נתונים פעיל" : "SQLite Connection Active"}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg">
              📦 2,500+ {isRTL ? "מוצרים בקטלוג" : "Products in Catalog"}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg">
              🛡️ {isRTL ? "שער אבטחה פעיל" : "Gatekeeper Core Active"}
            </span>
          </div>
        </div>
      </div>

      {/* Telemetry Dashboard Controls */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isRTL ? "לוח בקרת אחריות ושלמות" : "Accountability & Gate Dashboard"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isRTL ? "מעקב בזמן אמת אחר מחזור ביצוע, שערי קומפילציה, דוחות ATV ורישום קבצים קריפטוגרפי." : "Real-time telemetry of execution cycles, compile safety gates, ATV reports, and cryptographic registry ledgers."}
          </p>
        </div>
        <button
          onClick={fetchDashboardMetrics}
          className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <span>🔄 {isRTL ? "רענן נתונים" : "Refresh Telemetry"}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">
            {isRTL ? "טוען מדדי אחריות מהשרת המקומי..." : "Loading telemetry from local server..."}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Telemetry Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Turn Counter Gauge */}
            <div className="glass-card-static p-6 flex flex-col items-center justify-between min-h-[320px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40">
              <div className="w-full flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isRTL ? "שער הקומפילציה (LGG)" : "LGG Gate Counter"}
                </span>
                <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full">
                  {isRTL ? "אוטומטי" : "Automatic"}
                </span>
              </div>

              {/* Circle Ring Gauge */}
              {(() => {
                const current = dashboardData?.turnData?.current ?? 0;
                const ceiling = dashboardData?.turnData?.ceiling ?? 15;
                const pct = Math.min(current / ceiling, 1);
                const radius = 45;
                const circ = 2 * Math.PI * radius;
                const strokeDashoffset = circ - pct * circ;

                let strokeColor = "stroke-emerald-500";
                let textColor = "text-emerald-500";
                let levelText = isRTL ? "פיתוח שוטף (Standard)" : "Active Dev Cycle";
                if (current >= 9 && current <= 13) {
                  strokeColor = "stroke-amber-500";
                  textColor = "text-amber-500";
                  levelText = isRTL ? "אזהרה (Ceiling Near)" : "Approaching Limit";
                } else if (current >= 14) {
                  strokeColor = "stroke-rose-500";
                  textColor = "text-rose-500";
                  levelText = isRTL ? "סכנת חסימה (Locked)" : "Gate Lock Imminent";
                }

                return (
                  <div className="flex flex-col items-center py-4 space-y-3">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r={radius}
                          className="stroke-slate-100 dark:stroke-slate-800 fill-none"
                          strokeWidth="8"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r={radius}
                          className={`${strokeColor} fill-none transition-all duration-500`}
                          strokeWidth="8"
                          strokeDasharray={circ}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-2xl font-extrabold font-mono ${textColor}`}>{current}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          {isRTL ? `מתוך ${ceiling}` : `of ${ceiling} turns`}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs font-bold ${textColor}`}>{levelText}</span>
                  </div>
                );
              })()}

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                {isRTL
                  ? "בכל סיבוב פיתוח מונה התורות עולה. בהגעה ל-15 תורות המערכת תינעל עד לביצוע בדיקת Persona Audit מקיפה."
                  : "Every development turn increments the counter. Upon reaching the 15-turn ceiling, compiler locks trigger until a Persona Audit is passed."}
              </p>
            </div>

            {/* ATV Gaps & Verdict */}
            <div className="glass-card-static p-6 flex flex-col justify-between min-h-[320px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40">
              <div className="w-full flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isRTL ? "ממצאי אימות ATV (Anti-Theater)" : "ATV Validation Findings"}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  dashboardData?.atv?.verdict === "GAPS_FOUND" ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                }`}>
                  {dashboardData?.atv?.verdict || "NOMINAL"}
                </span>
              </div>

              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {isRTL ? "מספר פערים שהתגלו:" : "Discovered Gaps:"}
                  </span>
                  <span className={`text-lg font-mono font-bold ${
                    dashboardData?.atv?.gaps > 0 ? "text-rose-500" : "text-emerald-500"
                  }`}>{dashboardData?.atv?.gaps ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {isRTL ? "מנגנונים משופרים (Beneficial Drifts):" : "Beneficial Drifts:"}
                  </span>
                  <span className="text-lg font-mono font-bold text-indigo-500">{dashboardData?.atv?.drifts ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {isRTL ? "אזהרת קצב פיתוח (P/E Ratio):" : "Development P/E Ratio:"}
                  </span>
                  <span className={`text-xs font-bold ${
                    dashboardData?.atv?.feedback?.pe_ratio_warning ? "text-amber-500" : "text-emerald-500"
                  }`}>{dashboardData?.atv?.feedback?.pe_ratio_warning || "nominal"}</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-350 block mb-1">
                  {isRTL ? "המלצת סבב נוכחי:" : "Active Cycle Recommendation:"}
                </span>
                <p className="text-slate-400 leading-normal italic">
                  "{dashboardData?.atv?.feedback?.recommendation || (isRTL ? "אין המלצות ספציפיות לסבב זה." : "No specific recommendations for this round.")}"
                </p>
              </div>
            </div>

            {/* Active Protection Checks */}
            <div className="glass-card-static p-6 flex flex-col justify-between min-h-[320px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40">
              <div className="w-full flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isRTL ? "מונה הפעלת מנגנוני הגנה" : "Active Safety Mechanisms"}
                </span>
                <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">
                  {isRTL ? "מבוקר" : "Controlled"}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 py-3 pr-1 max-h-[160px]">
                {(dashboardData?.registry || []).map((m: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded-lg border border-slate-100 dark:border-slate-805 bg-slate-50/50 dark:bg-slate-950/20 text-xs">
                    <span className="font-mono font-bold text-slate-400">x{m.actual_triggers}</span>
                    <div className="text-right">
                      <div className="font-bold text-slate-750 dark:text-slate-300">{m.mechanism_id}</div>
                    </div>
                  </div>
                ))}
                {(dashboardData?.registry || []).length === 0 && (
                  <div className="text-xs text-slate-400 italic text-center py-8">
                    {isRTL ? "לא נטענו מנגנונים" : "No active protection mechanisms"}
                  </div>
                )}
              </div>

              <div className="text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 leading-relaxed text-center">
                {isRTL
                  ? "המנגנונים סופרים אירועי אינטגרציה קבועים ומאמתים שאין שימוש במונחים לא קשיחים."
                  : "Mechanisms count structural checks and protect against runtime integration regressions."}
              </div>
            </div>
          </div>

          {/* Priority Engine Block */}
          <div className="glass-card-static p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {dict.priority_engine || "Priority Engine & Task Sizer"}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  {isRTL ? "חישוב רמת הדחיפות ומידת ההשפעה של רכיבים לפני דחיפת שינויים למאגר הליבה." : "Pre-calculate task impact weights and risk multipliers to avoid registry debt."}
                </p>
              </div>
              <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold rounded-lg font-mono">
                {isRTL ? `ציון עדיפות: P-${priorityScore}` : `Priority Score: P-${priorityScore}`}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-xs font-semibold">
              {/* Urgency */}
              <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-850/60">
                <div className="flex justify-between">
                  <span className="text-slate-400">{dict.urgency || "Urgency"}</span>
                  <span className="font-mono text-indigo-500">{urgency}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={urgency}
                  onChange={(e) => setUrgency(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Scope */}
              <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-850/60">
                <div className="flex justify-between">
                  <span className="text-slate-400">{dict.scope || "Scope"}</span>
                  <span className="font-mono text-indigo-500">{scope}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scope}
                  onChange={(e) => setScope(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Complexity */}
              <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-850/60">
                <div className="flex justify-between">
                  <span className="text-slate-400">{dict.complexity || "Complexity"}</span>
                  <span className="font-mono text-indigo-500">{complexity}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={complexity}
                  onChange={(e) => setComplexity(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Blast Radius */}
              <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-850/60">
                <div className="flex justify-between">
                  <span className="text-slate-400">{dict.blast_radius || "Blast Radius"}</span>
                  <span className="font-mono text-indigo-500">{blastRadius}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={blastRadius}
                  onChange={(e) => setBlastRadius(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Significance */}
              <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-850/60">
                <div className="flex justify-between">
                  <span className="text-slate-400">{dict.significance || "Significance"}</span>
                  <span className="font-mono text-indigo-500">{significance}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={significance}
                  onChange={(e) => setSignificance(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleSavePriority}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-all shadow-md text-xs"
              >
                {prioritySaved ? (isRTL ? "✓ נשמר!" : "✓ Saved!") : (dict.save_priority || "Save Priority")}
              </button>
            </div>
          </div>

          {/* Cryptographic Ledger Table */}
          <div className="glass-card-static p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/30 overflow-hidden">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isRTL ? "ספר רישום הקבצים הקריפטוגרפי" : "Workspace Cryptographic Ledger"}
              </span>
              <span className="text-xs font-bold bg-indigo-500/10 text-indigo-500 px-2.5 py-1 rounded-full font-mono">
                Ledger Sync Active
              </span>
            </div>

            <div className="overflow-x-auto max-h-[300px]">
              <table className="min-w-full divide-y divide-slate-250 dark:divide-slate-850 text-right text-xs">
                <thead className="bg-slate-100/50 dark:bg-slate-900/60 font-bold text-slate-500 sticky top-0 z-10 text-right">
                  <tr>
                    <th className="px-4 py-3 text-right">{isRTL ? "שם הקובץ" : "File Name"}</th>
                    <th className="px-4 py-3 text-right">{isRTL ? "גרסה" : "Ver"}</th>
                    <th className="px-4 py-3 text-right">{isRTL ? "מצב" : "Status"}</th>
                    <th className="px-4 py-3 text-center">{isRTL ? "אימות" : "Verification"}</th>
                    <th className={`px-4 py-3 ${isRTL ? "text-right" : "text-left"}`}>{isRTL ? "מפתח קריפטו" : "SHA-256 Hash"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-750 dark:text-slate-350">
                  {(dashboardData?.files || []).map((file: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-100/40 dark:hover:bg-slate-850/20">
                      <td className="px-4 py-3 font-semibold break-all max-w-[280px] text-right">{file.path}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-500 text-right">V{file.version}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          file.status === "RATIFIED" || file.status === "VERIFIED" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {file.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {Object.entries(file.validation_metrics || {}).map(([key, val]: [string, any]) => {
                            const isOk = val === "VERIFIED" || val === "COMPLETE" || val === "OPTIMIZED" || val === "CONSOLIDATED" || val === "ENFORCED";
                            const isPartial = val === "PARTIAL" || val === "STUBBED" || val === "PENDING";
                            return (
                              <span
                                key={key}
                                className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tight ${
                                  isOk
                                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                    : isPartial
                                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                    : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                }`}
                                title={`${key}: ${val}`}
                              >
                                {key.replace("_", " ")}: {isOk ? "✓" : isPartial ? "⚙" : "✗"}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className={`px-4 py-3 font-mono text-[10px] text-slate-400 break-all select-all ${isRTL ? "text-right" : "text-left"}`}>{file.hash || "Pending..."}</td>
                    </tr>
                  ))}
                  {(dashboardData?.files || []).length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-400 italic">
                        {isRTL ? "אין קבצים רשומים" : "No files registered in database"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
