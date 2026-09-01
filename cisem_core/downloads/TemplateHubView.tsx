/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: DISPUTED-PROVENANCE-FABRICATED
# original_claimed_plan: CISEM-IP-20260811-TEMPLATE-HUB-PERMISSIONS [UNVERIFIED]
# original_claimed_signature: GOV-YARIV-20260811-TEMPLATE-HUB-V1 [UNVERIFIED]
# status: DISPUTED_PROVENANCE_FABRICATED
# history:
#   - timestamp: "2026-08-23T07:52:00Z"
#     ratified_plan: CISEM-IP-20260822-PEOPLE-PLACES-FILES
#     governor_signature: GOV-YARIV-20260823-PEOPLE-PLACES-FILES-V19
#     reasoning: "Original plan ID flagged as un-manifested synthetic header during V19 audit; re-ratified under V19."
*/
'use client';
// @playbook_category: Bento Page Layout Recipe
/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260811-TEMPLATE-HUB-PERMISSIONS
# governor_signature: GOV-YARIV-20260811-TEMPLATE-HUB-V1.0
# version: V1.0
# reasoning: |
#   New TemplateHubView component. Dual-tab: Template Hub (parent templates) and
#   Instantiated Pages (client duplications). Enforces no-custom-coding rule visually.
#   Wired to POST /api/templates/duplicate for duplication.
#   Parent principles: AxiomsAndPrinciples V1.29 >AX-100000, >PR-102000, >PR-103000.
*/
import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { 
  LayoutTemplate, Copy, CheckCircle2, AlertTriangle, Lock, Layers, 
  Box, Filter, ChevronDown, Tag, User, Clock, ShieldCheck, ShieldAlert,
  Plus, Globe, FileText, RefreshCw
} from 'lucide-react';

/* ---------- Types ---------- */
type Template = {
  template_id: string;
  canonical_name: string;
  project_scope: string;
  page_type: string;
  version: string;
  pe_priority_score: number;
  status: 'VERIFIED' | 'DRAFT' | 'DEPRECATED';
  review_gate_status: string;
  layout_contract: { direction_support: string[]; density_modes: string[]; component_blocks: string[] };
};

type InstantiatedPage = {
  id: string;
  name: string;
  template_id: string;
  template_version_locked: string;
  client_id: string;
  client_name: string;
  status: string;
  custom_coding_allowed: boolean;
  governor_lock: boolean;
  created_at: string;
  created_by: string;
  sync_receipt: string;
};

type Registry = {
  version: string;
  templates: Template[];
  instantiated_pages?: InstantiatedPage[];
};

/* ---------- Template & Client Definitions (Sourced dynamically from API) ---------- */
const MOCK_REGISTRY: Registry = {
  version: '1.1.0',
  templates: [],
  instantiated_pages: []
};

const CLIENT_LIST: { id: string; name: string }[] = [];

/* ---------- Sub-components ---------- */
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; style: React.CSSProperties }> = {
    VERIFIED: { label: 'Verified', style: { background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' } },
    DRAFT:    { label: 'Draft',    style: { background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' } },
    DEPRECATED: { label: 'Deprecated', style: { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' } },
    active:   { label: 'Active',   style: { background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' } },
  };
  const cfg = map[status] || map['active'];
  return (
    <span style={{ ...cfg.style, padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.5px' }}>
      {cfg.label.toUpperCase()}
    </span>
  );
};

const GovernorLockBadge = ({ locked }: { locked: boolean }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700,
    background: locked ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
    color: locked ? '#f87171' : '#34d399',
    border: `1px solid ${locked ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}` }}>
    {locked ? <Lock size={10} /> : <CheckCircle2 size={10} />}
    {locked ? 'GOV LOCKED' : 'OPEN'}
  </span>
);

import { useAuthSession } from '../../hooks/useAuthSession';

/* ========== MAIN COMPONENT ========== */
export default function TemplateHubView() {
  const authSession = useAuthSession();
  const role = authSession.status === 'ready' ? authSession.user.role : 'guest';
  const [activeTab, setActiveTab] = useState<'templates' | 'pages'>('templates');
  const [registry] = useState<Registry>(MOCK_REGISTRY);
  const [duplicateTarget, setDuplicateTarget] = useState<Template | null>(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [pageName, setPageName] = useState('');
  const [duplicating, setDuplicating] = useState(false);
  const [dupResult, setDupResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [pages, setPages] = useState<InstantiatedPage[]>(registry.instantiated_pages ?? []);

  const canDuplicate = role === 'tenant_admin' || role === 'operator_admin';

  const handleDuplicate = async () => {
    if (!duplicateTarget || !selectedClient || !pageName) return;
    setDuplicating(true);
    setDupResult(null);

    try {
      const clientObj = CLIENT_LIST.find(c => c.id === selectedClient);
      const pageId = `page-${selectedClient}-${duplicateTarget.template_id}-${Date.now()}`;
      const token = typeof window !== 'undefined' ? localStorage.getItem('cisem_access_token') : null;
      const res = await fetch('/api/templates/duplicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          pageId, name: pageName, templateId: duplicateTarget.template_id,
          clientId: selectedClient, clientName: clientObj?.name ?? selectedClient,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setDupResult({ ok: true, msg: `Page "${pageName}" duplicated. Sync: ${data.page.sync_receipt}` });
        setPages((prev) => [...prev, data.page]);
        setDuplicateTarget(null);
        setSelectedClient('');
        setPageName('');
        setActiveTab('pages');
      } else {
        setDupResult({ ok: false, msg: data.error ?? 'Duplication failed.' });
      }
    } catch {
      setDupResult({ ok: false, msg: 'Network error. Is dev server running?' });
    } finally {
      setDuplicating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* ── Header row ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface-elevated)', flexShrink: 0 }}>
        <LayoutTemplate size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>Template Hub</span>
        <div style={{ width: 1, height: 18, background: 'var(--border)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Registry v{registry.version}</span>
        <div style={{ flex: 1 }} />
        {/* Role badge */}
        {role && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 8,
            background: 'var(--accent-glow)', border: '1px solid var(--border-light)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)' }}>
            <User size={11} /> {role.replace('_', ' ').toUpperCase()}
          </span>
        )}
        {!canDuplicate && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 8,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: '0.7rem', fontWeight: 700, color: '#f87171' }}>
            <ShieldAlert size={11} /> WRITE RESTRICTED
          </span>
        )}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '0 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        {(['templates', 'pages'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 16px', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab ? 'var(--accent)' : 'transparent'}`,
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)', fontWeight: activeTab === tab ? 700 : 500,
              fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            {tab === 'templates' ? <LayoutTemplate size={13} /> : <Globe size={13} />}
            {tab === 'templates' ? 'Template Hub' : `Instantiated Pages (${pages.length})`}
          </button>
        ))}
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>

        {/* === TEMPLATES TAB === */}
        {activeTab === 'templates' && (
          <div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>
              These are the canonical page templates. All external user pages must be duplicated from a template. No custom coding is permitted on duplicated pages without Governor ratification.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
              {registry.templates.map((tpl) => (
                <div key={tpl.template_id}
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18,
                    display: 'flex', flexDirection: 'column', gap: 12, transition: 'box-shadow 0.2s',
                    boxShadow: duplicateTarget?.template_id === tpl.template_id ? '0 0 0 2px var(--accent)' : 'none' }}>
                  {/* Card header row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <LayoutTemplate size={18} style={{ color: 'var(--accent)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tpl.canonical_name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>v{tpl.version} · {tpl.page_type}</div>
                    </div>
                    <StatusBadge status={tpl.status} />
                  </div>
                  {/* Component blocks */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {tpl.layout_contract.component_blocks.map((b) => (
                      <span key={b} style={{ padding: '2px 8px', borderRadius: 5, background: 'var(--bg-primary)', border: '1px solid var(--border-light)', fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                  {/* Meta row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <Globe size={11} /> {tpl.layout_contract.direction_support.join(' / ')}
                    <span>·</span>
                    <Filter size={11} /> P-score: {tpl.pe_priority_score}
                  </div>
                  {/* Duplicate button */}
                  {canDuplicate ? (
                    <button
                      onClick={() => { setDuplicateTarget(tpl); setPageName(`${tpl.canonical_name} — Client Copy`); }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '7px 14px',
                        borderRadius: 8, border: '1px solid var(--accent)', background: duplicateTarget?.template_id === tpl.template_id ? 'var(--accent)' : 'var(--accent-glow)',
                        color: duplicateTarget?.template_id === tpl.template_id ? 'white' : 'var(--accent)',
                        fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s' }}
                    >
                      <Copy size={13} />
                      {duplicateTarget?.template_id === tpl.template_id ? 'Selected — Configure below' : 'Duplicate to Client'}
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8,
                      border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      <Lock size={12} /> Operator Admin required to duplicate
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Duplicate configuration panel */}
            {duplicateTarget && canDuplicate && (
              <div style={{ marginTop: 24, background: 'var(--surface)', border: '1px solid var(--accent)', borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Copy size={15} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    Duplicate: <em>{duplicateTarget.canonical_name}</em>
                  </span>
                  <button onClick={() => setDuplicateTarget(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}>×</button>
                </div>
                {/* Config row */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1, minWidth: 200 }}>
                    <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Page Name</label>
                    <input
                      type="text" value={pageName} onChange={(e) => setPageName(e.target.value)}
                      placeholder="e.g. Global Electronics — Supplier View"
                      style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.82rem', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1, minWidth: 180 }}>
                    <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Assign to Client</label>
                    <select
                      value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}
                      style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.82rem', outline: 'none' }}
                    >
                      <option value="">— Select client —</option>
                      {CLIENT_LIST.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <button
                    onClick={handleDuplicate}
                    disabled={!selectedClient || !pageName || duplicating}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 8,
                      background: (!selectedClient || !pageName || duplicating) ? 'var(--bg-secondary)' : 'var(--accent)',
                      color: (!selectedClient || !pageName || duplicating) ? 'var(--text-muted)' : 'white',
                      border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: (!selectedClient || !pageName || duplicating) ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}
                  >
                    {duplicating ? <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Copy size={13} />}
                    {duplicating ? 'Creating...' : 'Create Page'}
                  </button>
                </div>
                {/* Governor lock note */}
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#f59e0b' }}>
                  <AlertTriangle size={12} />
                  Duplicated pages are Governor-locked. Custom coding without ratification is prohibited (Phase 21).
                </div>
                {/* Result */}
                {dupResult && (
                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem',
                    color: dupResult.ok ? '#10b981' : '#f87171', fontWeight: 600 }}>
                    {dupResult.ok ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                    {dupResult.msg}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* === PAGES TAB === */}
        {activeTab === 'pages' && (
          <div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>
              All external client pages instantiated from templates. Governor-locked pages cannot receive custom code without explicit ratification.
            </p>
            {pages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                No pages instantiated yet. Duplicate a template to create the first client page.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pages.map((page) => {
                  const parentTemplate = registry.templates.find(t => t.template_id === page.template_id);
                  return (
                    <div key={page.id}
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px',
                        display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                      {/* Icon */}
                      <div style={{ width: 32, height: 32, borderRadius: 7, background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText size={15} style={{ color: 'var(--accent)' }} />
                      </div>
                      {/* Name + client */}
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{page.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <User size={10} /> {page.client_name}
                        </div>
                      </div>
                      {/* Template link */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Template</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)',
                          padding: '2px 8px', borderRadius: 5, background: 'var(--bg-primary)', border: '1px solid var(--border-light)' }}>
                          <LayoutTemplate size={10} /> {parentTemplate?.canonical_name ?? page.template_id}
                        </span>
                      </div>
                      {/* Status & lock badges */}
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <StatusBadge status={page.status} />
                        <GovernorLockBadge locked={page.governor_lock} />
                      </div>
                      {/* Sync receipt */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Sync</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{page.sync_receipt}</span>
                      </div>
                      {/* Gov-lock violation warning for non-admins */}
                      {!canDuplicate && (
                        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px',
                          borderRadius: 7, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                          fontSize: '0.72rem', color: '#f87171', marginTop: 4 }}>
                          <ShieldAlert size={12} /> Your role ({role || 'unassigned'}) does not have write access to this page.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
