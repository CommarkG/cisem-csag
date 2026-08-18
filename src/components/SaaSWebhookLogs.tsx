// @playbook_category: Micro-interaction Module
/**
 * RATIFIED RESOLUTION : GOV-2026-08-16-TENANCY / Webhook Audit Viewport
 * REASONING           : Renders outgoing webhook dispatch audit logs with HTTP response codes & signature statuses.
 * PARENT PRINCIPLES   : AxiomsAndPrinciples.md (U1.2.32.7, Webhook UI Audit)
 */

import React, { useEffect, useState } from "react";

interface WebhookLogItem {
  id: string;
  app_code: string;
  event_name: string;
  target_url: string;
  response_status: number | null;
  error_message: string | null;
  dispatched_at: string;
}

export default function SaaSWebhookLogs() {
  const [logs, setLogs] = useState<WebhookLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/tenant/webhooks/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to fetch webhook logs:", err);
    } finally {
      setLoading(false);
    }
  const handleReplay = async (logId: string) => {
    try {
      const res = await fetch(`/api/v1/tenant/webhooks/logs/${logId}/replay`, { method: "POST" });
      if (res.ok) {
        fetchLogs();
      }
    } catch (err) {
      console.error("Failed to replay webhook event:", err);
    }
  };

  const successCount = logs.filter((l) => l.response_status && l.response_status >= 200 && l.response_status < 300).length;
  const healthPct = logs.length > 0 ? Math.round((successCount / logs.length) * 100) : 100;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 font-sans shadow-lg">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>📡</span> Webhook Delivery Logs
            </h3>
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold rounded">
              {healthPct}% Health Uptime
            </span>
          </div>
          <p className="text-xs text-slate-400">HMAC-SHA256 Signed Outgoing Dispatches</p>
        </div>
        <button
          onClick={fetchLogs}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg border border-slate-700 transition"
        >
          Refresh Logs
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400">Loading webhook telemetry...</div>
      ) : logs.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">No outgoing webhook events recorded yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-start table-fixed text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                <th className="py-2.5 px-3">Event</th>
                <th className="py-2.5 px-3">App Code</th>
                <th className="py-2.5 px-3">Target URL</th>
                <th className="py-2.5 px-3">HTTP Status</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => {
                const isSuccess = log.response_status && log.response_status >= 200 && log.response_status < 300;
                return (
                  <tr key={log.id} className="hover:bg-slate-850/50 transition">
                    <td className="py-2.5 px-3 font-mono text-cyan-400 font-semibold">{log.event_name}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">{log.app_code}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400 truncate max-w-[180px]" title={log.target_url}>
                      {log.target_url}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isSuccess
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : "bg-rose-950 text-rose-400 border border-rose-800"
                        }`}
                      >
                        {log.response_status ? `HTTP ${log.response_status}` : "FAILED"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => handleReplay(log.id)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-cyan-400 rounded transition"
                      >
                        Re-Send
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
