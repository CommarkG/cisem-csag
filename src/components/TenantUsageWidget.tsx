// @playbook_category: Micro-interaction Module
/**
 * RATIFIED RESOLUTION : GOV-2026-08-16-TENANCY / Quota Telemetry Progress Widget
 * REASONING           : Renders real-time package consumption progress bars & quota warnings.
 * PARENT PRINCIPLES   : AxiomsAndPrinciples.md (U1.2.32.7, Quota UI Widget)
 */

import React, { useEffect, useState } from "react";

interface QuotaMetric {
  used: number;
  limit: number;
  percentage_used: number;
  status: "OK" | "WARNING" | "CRITICAL";
}

interface UsageSummary {
  status: string;
  tenant_id: string;
  metrics: Record<string, number>;
  quota_evaluation: Record<string, QuotaMetric>;
  warning_triggered: boolean;
}

export default function TenantUsageWidget() {
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/tenant/usage");
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (err) {
      console.error("Failed to fetch usage summary:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 font-sans shadow-lg">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>📊</span> Usage & Quota Metering
          </h3>
          <p className="text-xs text-slate-400">Real-Time Monthly Package Consumption</p>
        </div>
        {summary?.warning_triggered && (
          <span className="px-2.5 py-1 bg-amber-950 text-amber-400 border border-amber-800 rounded-lg text-xs font-bold animate-pulse">
            ⚠️ Quota Warning Triggered
          </span>
        )}
      </div>

      {loading ? (
        <div className="py-6 text-center text-xs text-slate-400">Aggregating consumption telemetry...</div>
      ) : !summary || !summary.quota_evaluation ? (
        <div className="py-6 text-center text-xs text-slate-500">No usage data recorded yet.</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(summary.quota_evaluation).map(([metricName, metric]) => {
            const isCritical = metric.status === "CRITICAL";
            const isWarning = metric.status === "WARNING";
            const barColor = isCritical ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-cyan-500";

            return (
              <div key={metricName} className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="font-semibold text-slate-200 capitalize">
                    {metricName.replace("_", " ")}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {metric.used.toLocaleString()} / {metric.limit.toLocaleString()} ({metric.percentage_used}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} transition-all duration-500 rounded-full`}
                    style={{ width: `${Math.min(100, metric.percentage_used)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
