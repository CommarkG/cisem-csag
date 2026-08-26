/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: DISPUTED-PROVENANCE-FABRICATED
# original_claimed_plan: CISEM-IP-20260810-SETTINGS-REFACTOR [UNVERIFIED]
# original_claimed_signature: GOV-YARIV-20260810-SETTINGS-REFACTOR-V1 [UNVERIFIED]
# status: DISPUTED_PROVENANCE_FABRICATED
# history:
#   - timestamp: "2026-08-23T07:52:00Z"
#     ratified_plan: CISEM-IP-20260822-PEOPLE-PLACES-FILES
#     governor_signature: GOV-YARIV-20260823-PEOPLE-PLACES-FILES-V19
#     reasoning: "Original plan ID flagged as un-manifested synthetic header during V19 audit; re-ratified under V19."
*/
// @playbook_category: Bento Page Layout Recipe

import React, { useState, useEffect } from 'react';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { useCollabStore } from '../../stores/useCollabStore';
import { useOnboardingStore } from '../../stores/useOnboardingStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { useUIStore } from '../../stores/useUIStore';
import { useTenantSessionStore } from '../../stores/useTenantSessionStore';
import { tenantStorageAdapter } from '../../utils/tenantStorageAdapter';
import { translations } from '../../utils/translations';
import PageGreetingBanner from '../shared/PageGreetingBanner';
import {
  Bell,
  Download,
  Upload,
  Trash2,
  HelpCircle,
  RotateCcw,
  Globe,
  Phone,
  MessageCircle,
  Send,
  Plus,
  UserCheck,
} from 'lucide-react';

import { useAdminStore } from '../../stores/useAdminStore';

export default function SettingsView() {
  const rules = useNotificationStore((s) => s.rules);
  const updateRule = useNotificationStore((s) => s.updateRule);
  const showToast = useNotificationStore((s) => s.showToast);
  const resetData = useTaskStore((s) => s.resetData);
  const restartTour = useOnboardingStore((s) => s.restartTour);
  const items = useTaskStore((s) => s.items);

  const whatsappLog = useNotificationStore((s) => s.whatsappLog);
  const addWhatsAppMessage = useNotificationStore((s) => s.addWhatsAppMessage);
  const members = useCollabStore((s) => s.members);

  const clientCustomFields = useAdminStore((s) => s.clientCustomFields);
  const supplierCustomFields = useAdminStore((s) => s.supplierCustomFields);
  const teamCustomFields = useAdminStore((s) => s.teamCustomFields);
  const addCustomField = useAdminStore((s) => s.addCustomField);
  const deleteCustomField = useAdminStore((s) => s.deleteCustomField);
  const tagColors = useAdminStore((s) => s.tagColors || {});
  const setTagColor = useAdminStore((s) => s.setTagColor);
  const deleteTagColor = useAdminStore((s) => s.deleteTagColor);
  const greenApiIdInstance = useAdminStore((s) => s.greenApiIdInstance);
  const greenApiTokenInstance = useAdminStore((s) => s.greenApiTokenInstance);
  const memberGreenApiCredentials = useAdminStore((s) => s.memberGreenApiCredentials || {});
  const setGlobalGreenApiCredentials = useAdminStore((s) => s.setGlobalGreenApiCredentials);
  const setMemberGreenApiCredentials = useAdminStore((s) => s.setMemberGreenApiCredentials);
  const deleteMemberGreenApiCredentials = useAdminStore((s) => s.deleteMemberGreenApiCredentials);

  const { language, setLanguage } = useUIStore();
  const t = translations[language] || translations.en;

  const [confirmReset, setConfirmReset] = useState(false);
  const [waRecipient, setWaRecipient] = useState('All');
  const [waMessage, setWaMessage] = useState('');

  const [cfEntity, setCfEntity] = useState('clients');
  const [cfName, setCfName] = useState('');
  const [cfType, setCfType] = useState('text');

  const [globalId, setGlobalId] = useState(greenApiIdInstance || '');
  const [globalToken, setGlobalToken] = useState(greenApiTokenInstance || '');
  
  const [selectedMember, setSelectedMember] = useState('');
  const [memberIdVal, setMemberIdVal] = useState('');
  const [memberTokenVal, setMemberTokenVal] = useState('');

  React.useEffect(() => {
    setGlobalId(greenApiIdInstance || '');
    setGlobalToken(greenApiTokenInstance || '');
  }, [greenApiIdInstance, greenApiTokenInstance]);

  React.useEffect(() => {
    if (members.length > 0 && !selectedMember) {
      setSelectedMember(members[0].id);
    }
  }, [members, selectedMember]);

  React.useEffect(() => {
    if (selectedMember) {
      const creds = memberGreenApiCredentials[selectedMember] || {};
      setMemberIdVal(creds.idInstance || '');
      setMemberTokenVal(creds.apiTokenInstance || '');
    } else {
      setMemberIdVal('');
      setMemberTokenVal('');
    }
  }, [selectedMember, memberGreenApiCredentials]);

  const [globalStatus, setGlobalStatus] = useState('');
  const [memberStatus, setMemberStatus] = useState('');

  const testGlobalConnection = async () => {
    if (!globalId.trim() || !globalToken.trim()) {
      showToast({ title: 'Validation Warning', message: 'Enter instance ID and API token first.', type: 'warning' });
      return;
    }
    setGlobalStatus('checking');
    try {
      const res = await fetch(`/api/v1/whatsapp/send?idInstance=${globalId.trim()}&apiTokenInstance=${globalToken.trim()}`);
      const data = await res.json();
      setGlobalStatus(data.status);
      if (data.status === 'authorized') {
        showToast({ title: 'Connection Active', message: 'Global Green API instance is online and authorized.', type: 'success' });
      } else {
        showToast({ title: 'Connection Failed', message: data.error || `Instance state: ${data.status}`, type: 'danger' });
      }
    } catch (err) {
      setGlobalStatus('offline');
      showToast({ title: 'Connection Failed', message: 'Could not reach proxy API.', type: 'danger' });
    }
  };

  const testMemberConnection = async () => {
    if (!memberIdVal.trim() || !memberTokenVal.trim()) {
      showToast({ title: 'Validation Warning', message: 'Enter member credentials first.', type: 'warning' });
      return;
    }
    setMemberStatus('checking');
    try {
      const res = await fetch(`/api/v1/whatsapp/send?idInstance=${memberIdVal.trim()}&apiTokenInstance=${memberTokenVal.trim()}`);
      const data = await res.json();
      setMemberStatus(data.status);
      if (data.status === 'authorized') {
        showToast({ title: 'Connection Active', message: 'Member Green API instance is online and authorized.', type: 'success' });
      } else {
        showToast({ title: 'Connection Failed', message: data.error || `Instance state: ${data.status}`, type: 'danger' });
      }
    } catch (err) {
      setMemberStatus('offline');
      showToast({ title: 'Connection Failed', message: 'Could not reach proxy API.', type: 'danger' });
    }
  };

  const handleAddCustomField = (e) => {
    e.preventDefault();
    const cleanLabel = cfName.trim();
    if (!cleanLabel) return;

    if (cleanLabel.length > 32) {
      showToast({
        title: 'Validation Failed',
        message: 'Attribute label must be 32 characters or fewer.',
        type: 'warning'
      });
      return;
    }

    const reservedColumns = ['name', 'company', 'email', 'phone', 'value', 'tags', 'materials', 'status', 'role', 'actions', 'comments', 'id'];
    if (reservedColumns.includes(cleanLabel.toLowerCase())) {
      showToast({
        title: 'Validation Failed',
        message: `"${cleanLabel}" is a system reserved column name.`,
        type: 'warning'
      });
      return;
    }

    const currentFields = cfEntity === 'clients' ? clientCustomFields :
                          cfEntity === 'suppliers' ? supplierCustomFields :
                          teamCustomFields;

    const isDuplicate = currentFields.some(f => f.label.toLowerCase() === cleanLabel.toLowerCase());
    if (isDuplicate) {
      showToast({
        title: 'Validation Failed',
        message: `Attribute "${cleanLabel}" already exists on ${cfEntity}.`,
        type: 'warning'
      });
      return;
    }

    addCustomField(cfEntity, cleanLabel, cfType);
    setCfName('');
    showToast({
      title: 'Custom Field Added',
      message: `Successfully created "${cleanLabel}" on ${cfEntity}`,
      type: 'success'
    });
  };

  const handleDeleteCustomField = (entity, fieldKey, label) => {
    deleteCustomField(entity, fieldKey);
    showToast({
      title: 'Custom Field Removed',
      message: `Deleted "${label}" from ${entity}`,
      type: 'danger'
    });
  };

  // Auto-fill first recipient once members are loaded
  React.useEffect(() => {
    const validRecipients = members.filter(m => m.id !== 'user-operator');
    if (validRecipients.length > 0 && waRecipient === 'All') {
      setWaRecipient(validRecipients[0].name);
    }
  }, [members, waRecipient]);

  const handleSendWA = (e) => {
    e.preventDefault();
    if (!waMessage.trim()) return;

    // Find recipient details
    const targetMember = members.find(m => m.name === waRecipient);
    const toPhone = targetMember?.phone || '+972541234567';

    addWhatsAppMessage({
      to: waRecipient,
      text: waMessage,
      direction: 'sent',
    });

    const activeUserId = useAdminStore.getState().activeUserId;
    const memberCreds = memberGreenApiCredentials?.[activeUserId] || {};
    const idInstance = memberCreds.idInstance || greenApiIdInstance || '';
    const apiTokenInstance = memberCreds.apiTokenInstance || greenApiTokenInstance || '';

    const token = typeof window !== 'undefined' ? localStorage.getItem('cisem_access_token') : null;
    // Fire actual Green API request via Next proxy
    fetch('/api/v1/whatsapp/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        to: toPhone,
        text: waMessage,
        idInstance,
        apiTokenInstance
      })
    }).then(async (res) => {
      const respData = await res.json();
      if (!res.ok) {
        showToast({
          title: 'WhatsApp Dispatch Failed',
          message: respData.error || 'Server error',
          type: 'warning'
        });
      } else if (respData.mock) {
        showToast({
          title: 'WhatsApp Broadcast Simulated',
          message: `Simulation logged successfully to ${waRecipient}`,
          type: 'info'
        });
      } else {
        showToast({
          title: 'WhatsApp Broadcast Sent',
          message: `Real message delivered to ${waRecipient} (${toPhone}) via Green API`,
          type: 'success'
        });
      }
    }).catch(() => {
      showToast({
        title: 'Connection Failed',
        message: 'Could not connect to proxy gateway.',
        type: 'danger'
      });
    });

    setWaMessage('');
  };

  const handleExport = () => {
    const data = {
      tasks: items,
      notifications: { rules },
      members: useCollabStore.getState().members,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dima-dashboard-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast({ title: t.save, message: 'Data exported successfully', type: 'success' });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);
          if (data.tasks) {
            localStorage.setItem('dima-tasks', JSON.stringify(data.tasks));
          }
          showToast({ title: t.add, message: 'Data imported. Refresh to apply.', type: 'success' });
        } catch (err) {
          showToast({ title: 'Error', message: 'Invalid JSON file', type: 'danger' });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetData();
    tenantStorageAdapter.removeItem('dima-notifications');
    tenantStorageAdapter.removeItem('dima-collab');
    tenantStorageAdapter.removeItem('dima-onboarding');
    tenantStorageAdapter.removeItem('dima-theme');
    tenantStorageAdapter.removeItem('dima-lang');
    showToast({ title: 'Reset', message: 'All data has been reset', type: 'warning' });
    setConfirmReset(false);
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 0', direction: language === 'he' ? 'rtl' : 'ltr' }}>
      <PageGreetingBanner view="settings" />

      {/* Language Selection */}
      <div className="settings-section">
        <h2 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Globe size={20} /> {t.language}
        </h2>
        <div className="glass-card-static" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Select System Language</span>
            <select
              className="input select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ width: 'auto', minWidth: 160 }}
            >
              <option value="en">English (EN)</option>
              <option value="ru">Русский (RU)</option>
              <option value="he">עברית (HE)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Role Authorization Matrix */}
      <div className="settings-section">
        <h2 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserCheck size={20} /> {t.roleAuthTitle}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
          {t.roleAuthDesc}
        </p>
        <div className="glass-card-static" style={{ padding: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, direction: 'ltr' }}>
            {[
              {
                role: t.roleOwnerName,
                desc: t.roleOwnerDesc,
                color: 'var(--accent)'
              },
              {
                role: t.roleAdminName,
                desc: t.roleAdminDesc,
                color: 'var(--info)'
              },
              {
                role: t.roleFinanceName,
                desc: t.roleFinanceDesc,
                color: 'var(--success)'
              },
              {
                role: t.roleSalesName,
                desc: t.roleSalesDesc,
                color: 'var(--warning)'
              },
              {
                role: t.roleViewerName,
                desc: t.roleViewerDesc,
                color: 'var(--text-muted)'
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="role-chip" 
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: 'var(--radius-sm)', 
                  border: '1px solid var(--border-light)', 
                  background: 'var(--surface-hover)', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flex: '1 1 calc(20% - 10px)',
                  minWidth: 140
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{item.role}</span>
                
                {/* CSS Tooltip on Hover */}
                <div className="role-tooltip">
                  <div style={{ fontWeight: 'bold', marginBottom: 4, color: item.color }}>{item.role}</div>
                  <div style={{ opacity: 0.9 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notification Calibration */}
      <div id="notif-matrix" className="settings-section">
        <h2 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={20} /> {t.notifCalibration}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
          {t.notifDesc}
        </p>

        {/* Rules table */}
        <div className="glass-card-static" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-hover)', borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>{t.event}</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>{t.enabled}</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>{t.channel}</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>{t.quietHours}</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={tdStyle}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{rule.label}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <div
                      className={`toggle ${rule.enabled ? 'active' : ''}`}
                      onClick={() => updateRule(rule.id, { enabled: !rule.enabled })}
                      style={{ margin: '0 auto' }}
                    />
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <select
                      className="input select"
                      value={rule.channel}
                      onChange={(e) => updateRule(rule.id, { channel: e.target.value })}
                      style={{ width: 'auto', padding: '4px 8px', fontSize: '0.8rem' }}
                    >
                      <option value="in_app">In-App Only</option>
                      <option value="whatsapp_log">WhatsApp Only</option>
                      <option value="both">Both</option>
                    </select>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <div
                      className={`toggle ${rule.quietHours ? 'active' : ''}`}
                      onClick={() => updateRule(rule.id, { quietHours: !rule.quietHours })}
                      style={{ margin: '0 auto' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
          {t.quietHoursDesc}
        </p>
      </div>

      {/* WhatsApp Message Log Simulator */}
      <div className="settings-section">
        <h2 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Phone size={20} /> {t.waSimulatorTitle}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
          {t.waSimulatorDesc}
        </p>

        <div className="whatsapp-chat glass-card-static" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-lg)' }}>
          <div className="whatsapp-header" style={{ background: 'var(--whatsapp-dark)', color: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Phone size={18} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t.waLog}</span>
          </div>
          <div className="whatsapp-messages" style={{ minHeight: 240, maxHeight: 320, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {whatsappLog.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <MessageCircle size={32} style={{ opacity: 0.3, marginBottom: 8, margin: '0 auto' }} />
                <p>{t.noWaMsg}</p>
                <p style={{ fontSize: '0.75rem', marginTop: 4 }}>{t.waDesc}</p>
              </div>
            ) : (
              whatsappLog.map((msg) => (
                <div key={msg.id} className={`whatsapp-bubble ${msg.direction}`} style={{
                  alignSelf: msg.direction === 'sent' ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  padding: '8px 12px',
                  borderRadius: msg.direction === 'sent' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}>
                  {msg.direction === 'sent' && (
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--whatsapp-dark)', marginBottom: 2 }}>
                      To: {msg.to}
                    </div>
                  )}
                  <div style={{ fontSize: '0.85rem' }}>{msg.text}</div>
                  <div className="whatsapp-time" style={{ fontSize: '0.65rem', textAlign: 'right', marginTop: 4, opacity: 0.6 }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Manual message send */}
          <form
            onSubmit={handleSendWA}
            style={{
              display: 'flex',
              gap: 8,
              padding: '12px 16px',
              borderTop: '1px solid var(--border)',
              background: 'var(--surface-elevated)',
            }}
          >
            <select
              className="input select"
              value={waRecipient}
              onChange={(e) => setWaRecipient(e.target.value)}
              style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8rem' }}
            >
              {members
                .filter((m) => m.id !== 'user-operator')
                .map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
            </select>
            <input
              className="input"
              placeholder={t.typeMsg}
              value={waMessage}
              onChange={(e) => setWaMessage(e.target.value)}
              style={{ flex: 1, padding: '6px 10px', fontSize: '0.85rem', background: 'transparent' }}
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ background: 'var(--whatsapp-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, padding: 0, borderRadius: '50%' }}>
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Custom Fields Calibration */}
      <div className="settings-section">
        <h2 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={20} /> {t.cfCalibrationTitle}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
          {t.cfCalibrationDesc}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {/* List existing custom fields */}
          <div className="glass-card-static" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 240 }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, borderBottom: '1px solid var(--border-light)', paddingBottom: 8, marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{t.cfActiveAttr}</span>
              <select 
                className="input select" 
                value={cfEntity} 
                onChange={(e) => setCfEntity(e.target.value)}
                style={{ width: 'auto', padding: '2px 8px', fontSize: '0.75rem' }}
              >
                <option value="clients">{t.clients}</option>
                <option value="suppliers">{t.suppliers}</option>
                <option value="team">{t.teamMembersTab || 'Team Members'}</option>
              </select>
            </h3>
            
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(() => {
                const currentFields = cfEntity === 'clients' ? clientCustomFields : cfEntity === 'suppliers' ? supplierCustomFields : teamCustomFields;
                if (currentFields.length === 0) {
                  return (
                    <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {t.cfNoFields}
                    </div>
                  );
                }
                return currentFields.map(f => (
                  <div key={f.field} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px', background: 'var(--surface-hover)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{f.label}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Type: {f.type.toUpperCase()}</span>
                    </div>
                    <button 
                      className="p-1 rounded text-red-500 hover:bg-red-500/10 transition-colors"
                      style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => handleDeleteCustomField(cfEntity, f.field, f.label)}
                    >
                      <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                    </button>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Add custom field form */}
          <form onSubmit={handleAddCustomField} className="glass-card-static" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 240 }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, borderBottom: '1px solid var(--border-light)', paddingBottom: 8, marginBottom: 4 }}>
              {t.cfAddAttr}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>{t.cfAttrLabel}</span>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. Tax ID, Region, Preferred Contact" 
                value={cfName}
                onChange={(e) => setCfName(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '0.8rem', background: 'transparent' }}
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>{t.cfAttrType}</span>
              <select 
                className="input select" 
                value={cfType} 
                onChange={(e) => setCfType(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '0.8rem' }}
              >
                <option value="text">Text (String)</option>
                <option value="number">Number</option>
                <option value="currency">Currency (₪)</option>
                <option value="date">Date</option>
                <option value="tags">Tags (Multi-select)</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ marginTop: 'auto', padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
            >
              <Plus size={14} /> {t.cfAddButton}
            </button>
          </form>

          {/* Tag Colors Mapping Calibration */}
          <div className="glass-card-static" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 240, gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, borderBottom: '1px solid var(--border-light)', paddingBottom: 8, marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Tag Color Mappings</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {Object.keys(tagColors).map((tagKey) => (
                <div 
                  key={tagKey} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '8px 12px', 
                    background: 'var(--surface-hover)', 
                    border: '1px solid var(--border-light)', 
                    borderRadius: 'var(--radius-sm)' 
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{tagKey.toUpperCase()}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input 
                      type="color" 
                      value={tagColors[tagKey]} 
                      onChange={(e) => setTagColor(tagKey, e.target.value)}
                      style={{ 
                        border: 'none', 
                        background: 'none', 
                        width: 24, 
                        height: 24, 
                        cursor: 'pointer',
                        padding: 0
                      }}
                    />
                    <button 
                      onClick={() => deleteTagColor(tagKey)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      <Trash2 size={12} style={{ color: 'var(--danger)' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Form to add custom mapping */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12, borderTop: '1px solid var(--border-light)', paddingTop: 12 }}>
              <input 
                type="text" 
                className="input" 
                placeholder="New Tag Name" 
                id="new-tag-name-input"
                style={{ flex: 1, padding: '4px 8px', fontSize: '0.75rem', background: 'transparent' }}
              />
              <input 
                type="color" 
                defaultValue="#6c5ce7" 
                id="new-tag-color-input"
                style={{ border: 'none', background: 'none', width: 28, height: 28, cursor: 'pointer', padding: 0 }}
              />
              <button 
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  const tagInput = document.getElementById('new-tag-name-input');
                  const colorInput = document.getElementById('new-tag-color-input');
                  if (tagInput && tagInput.value.trim()) {
                    setTagColor(tagInput.value.trim(), colorInput.value);
                    tagInput.value = '';
                  }
                }}
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              >
                Add Mapping
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Green API Calibration */}
      <div className="settings-section">
        <h2 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserCheck size={20} /> Green API WhatsApp Gateway
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
          Configure custom Green API instances to dispatch real-time WhatsApp alerts for team members and external stakeholders.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Global configurations */}
          <div className="glass-card-static" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, borderBottom: '1px solid var(--border-light)', paddingBottom: 8, marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Global Backup Gateway Settings</span>
              {globalStatus && (
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  color: globalStatus === 'authorized' ? 'var(--success)' : globalStatus === 'checking' ? 'var(--warning)' : 'var(--danger)'
                }}>
                  ● {globalStatus === 'checking' ? 'Checking...' : globalStatus === 'authorized' ? 'Active' : 'Offline'}
                </span>
              )}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Global Instance ID</span>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. 1101123456" 
                value={globalId}
                onChange={(e) => setGlobalId(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '0.8rem', background: 'transparent' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Global API Token</span>
              <input 
                type="password" 
                className="input" 
                placeholder="API Token Instance" 
                value={globalToken}
                onChange={(e) => setGlobalToken(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '0.8rem', background: 'transparent' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={testGlobalConnection}
                style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
              >
                Test Gateway
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => {
                  setGlobalGreenApiCredentials(globalId.trim(), globalToken.trim());
                  showToast({ title: 'Success', message: 'Global Green API credentials saved.', type: 'success' });
                }}
                style={{ flex: 2, padding: '8px 12px', fontSize: '0.8rem' }}
              >
                Save Global Credentials
              </button>
            </div>
          </div>

          {/* Member-level configurations */}
          <div className="glass-card-static" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, borderBottom: '1px solid var(--border-light)', paddingBottom: 8, marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>Team Member Gateways</span>
                {memberStatus && (
                  <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 600, 
                    color: memberStatus === 'authorized' ? 'var(--success)' : memberStatus === 'checking' ? 'var(--warning)' : 'var(--danger)'
                  }}>
                    ● {memberStatus === 'checking' ? '...' : memberStatus === 'authorized' ? 'Active' : 'Offline'}
                  </span>
                )}
              </div>
              <select 
                className="input select"
                value={selectedMember}
                onChange={(e) => {
                  setSelectedMember(e.target.value);
                  setMemberStatus('');
                }}
                style={{ width: 'auto', padding: '2px 8px', fontSize: '0.75rem' }}
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Member Instance ID</span>
              <input 
                type="text" 
                className="input" 
                placeholder="User Instance ID" 
                value={memberIdVal}
                onChange={(e) => setMemberIdVal(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '0.8rem', background: 'transparent' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Member API Token</span>
              <input 
                type="password" 
                className="input" 
                placeholder="User API Token Instance" 
                value={memberTokenVal}
                onChange={(e) => setMemberTokenVal(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '0.8rem', background: 'transparent' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 'auto', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  deleteMemberGreenApiCredentials(selectedMember);
                  showToast({ title: 'Removed', message: 'Member-specific credentials cleared.', type: 'info' });
                }}
                style={{ flex: '1 1 calc(30% - 8px)', padding: '8px 12px', fontSize: '0.8rem' }}
              >
                Clear
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={testMemberConnection}
                style={{ flex: '1 1 calc(30% - 8px)', padding: '8px 12px', fontSize: '0.8rem' }}
              >
                Test
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => {
                  if (!selectedMember) return;
                  setMemberGreenApiCredentials(selectedMember, memberIdVal.trim(), memberTokenVal.trim());
                  showToast({ title: 'Success', message: 'Member Green API credentials saved.', type: 'success' });
                }}
                style={{ flex: '1 1 calc(40% - 8px)', padding: '8px 12px', fontSize: '0.8rem' }}
              >
                Save Member
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="settings-section">
        <h2 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Download size={20} /> {t.dataManagement}
        </h2>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={16} /> {t.exportData}
          </button>
          <button className="btn btn-secondary" onClick={handleImport}>
            <Upload size={16} /> {t.importData}
          </button>
          <button
            className={`btn ${confirmReset ? 'btn-danger' : 'btn-secondary'}`}
            onClick={handleReset}
          >
            <Trash2 size={16} /> {confirmReset ? t.confirmReset : t.resetData}
          </button>
        </div>
      </div>

      {/* Onboarding */}
      <div className="settings-section">
        <h2 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HelpCircle size={20} /> {t.helpOnboarding}
        </h2>
        <button className="btn btn-secondary" onClick={restartTour}>
          <RotateCcw size={16} /> {t.restartTour}
        </button>
      </div>

      {/* Keyboard shortcuts */}
      <div className="settings-section">
        <h2 className="settings-section-title">{t.kbdShortcuts}</h2>
        <div className="glass-card-static" style={{ padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px 16px', fontSize: '0.85rem' }}>
            <kbd style={kbdStyle}>Ctrl + K</kbd>
            <span>{t.kbdSearch}</span>
            <kbd style={kbdStyle}>Esc</kbd>
            <span>{t.kbdEsc}</span>
            <kbd style={kbdStyle}>1</kbd>
            <span>Switch to Kanban view</span>
            <kbd style={kbdStyle}>2</kbd>
            <span>Switch to List view</span>
            <kbd style={kbdStyle}>3</kbd>
            <span>Switch to Calendar view</span>
            <kbd style={kbdStyle}>4</kbd>
            <span>Switch to Gantt view</span>
            <kbd style={kbdStyle}>5</kbd>
            <span>Switch to Dashboard</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  padding: '10px 14px',
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--text-muted)',
  textAlign: 'left',
};

const tdStyle = {
  padding: '10px 14px',
};

const kbdStyle = {
  display: 'inline-block',
  padding: '2px 8px',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-xs)',
  fontFamily: 'monospace',
  fontSize: '0.82rem',
};
