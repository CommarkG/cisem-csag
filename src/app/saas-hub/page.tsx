// @playbook_category: Bento Page Layout Recipe
/**
 * RATIFIED RESOLUTION : GOV-2026-08-16-TENANCY / SaaS App Store Control Center
 * REASONING           : Consolidated dashboard page bringing together Marketplace apps, installations, API keys & webhook logs.
 * PARENT PRINCIPLES   : AxiomsAndPrinciples.md (U1.2.32.7, SaaS Control Hub)
 */

"use client";

import React, { useEffect, useState } from "react";
import SaaSWebhookLogs from "../../components/SaaSWebhookLogs";
import TenantUsageWidget from "../../components/TenantUsageWidget";

interface AppItem {
  id: string;
  app_code: string;
  app_name: string;
  description: string;
  pricing_tier: string;
  webhook_events: string[];
}

interface InstallationItem {
  id: string;
  app_id: string;
  is_enabled: boolean;
  config: { webhook_url?: string };
  app_registry: AppItem;
}

export default function SaaSMarketplacePage() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [installations, setInstallations] = useState<InstallationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [webhookUrlInput, setWebhookUrlInput] = useState<string>("");

  useEffect(() => {
    fetchMarketplaceData();
  }, []);

  const fetchMarketplaceData = async () => {
    try {
      setLoading(true);
      const [appsRes, instRes] = await Promise.all([
        fetch("/api/v1/apps"),
        fetch("/api/v1/tenant/installations")
      ]);

      if (appsRes.ok) {
        const data = await appsRes.json();
        setApps(data.apps || []);
      }
      if (instRes.ok) {
        const data = await instRes.json();
        setInstallations(data.installations || []);
      }
    } catch (err) {
      console.error("Failed to load SaaS marketplace data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = async (appId: string) => {
    try {
      const res = await fetch("/api/v1/tenant/installations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_id: appId,
          config: { webhook_url: webhookUrlInput }
        })
      });
      if (res.ok) {
        setWebhookUrlInput("");
        setSelectedApp(null);
        fetchMarketplaceData();
      }
    } catch (err) {
      console.error("Failed to install app:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans space-y-8">
      {/* Header Banner */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-3">
            <span>🚀</span> SaaS App Store & Integration Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse modular SaaS apps, configure HMAC webhooks, and monitor API key usage.
          </p>
        </div>
        <div className="px-4 py-2 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-xl text-xs font-bold">
          Tenant Isolation Active
        </div>
      </div>

      {/* Grid Section: Marketplace Catalog & Usage Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Catalog Viewport */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <span>📦</span> Available Modular SaaS Apps
            </h2>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading SaaS catalog...</div>
            ) : apps.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">No apps available in catalog.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apps.map((app) => {
                  const isInstalled = installations.some((inst) => inst.app_id === app.id);
                  return (
                    <div
                      key={app.id}
                      className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-slate-700 transition"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-sm text-slate-200">{app.app_name}</h3>
                          <span className="px-2 py-0.5 bg-slate-800 text-[10px] font-mono text-cyan-400 border border-slate-700 rounded">
                            {app.pricing_tier}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">{app.description}</p>
                      </div>

                      <div>
                        {selectedApp === app.id ? (
                          <div className="mt-3 space-y-2">
                            <input
                              type="url"
                              placeholder="https://your-webhook-endpoint.com/receive"
                              value={webhookUrlInput}
                              onChange={(e) => setWebhookUrlInput(e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleInstall(app.id)}
                                className="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-slate-950 rounded transition"
                              >
                                Save & Enable
                              </button>
                              <button
                                onClick={() => setSelectedApp(null)}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedApp(app.id)}
                            disabled={isInstalled}
                            className={`w-full py-2 rounded text-xs font-bold transition ${
                              isInstalled
                                ? "bg-slate-800/80 text-emerald-400 cursor-default border border-emerald-900/40"
                                : "bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950"
                            }`}
                          >
                            {isInstalled ? "✓ Installed & Active" : "Install App"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Webhook Delivery Logs Audit Widget */}
          <SaaSWebhookLogs />
        </div>

        {/* Side Panel: Quota Metering & Telemetry Widget */}
        <div className="space-y-6">
          <TenantUsageWidget />
        </div>
      </div>
    </div>
  );
}
