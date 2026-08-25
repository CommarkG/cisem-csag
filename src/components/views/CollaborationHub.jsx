/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: PRE-RATIFICATION-LEGACY
# governor_signature: GOV-LEGACY-BASELINE
# status: PRE_RATIFICATION_LEGACY
# reasoning: |
#   File created prior to formal plan ratification governance. Preserved as legacy baseline.
*/
import { useState } from 'react';
import { useCollabStore } from '../../stores/useCollabStore';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { useUIStore } from '../../stores/useUIStore';
import { translations } from '../../utils/translations';
import PageGreetingBanner from '../shared/PageGreetingBanner';
import { formatDistanceToNow } from 'date-fns';
import {
  Users,
  UserPlus,
  Trash2,
  MessageCircle,
  Activity,
  Phone,
  Send,
  Crown,
  User,
} from 'lucide-react';

export default function CollaborationHub() {
  const storeMembers = useCollabStore((s) => s.members);
  const activityFeed = useCollabStore((s) => s.activityFeed);
  const addMember = useCollabStore((s) => s.addMember);
  const removeMember = useCollabStore((s) => s.removeMember);
  const showToast = useNotificationStore((s) => s.showToast);
  const whatsappLog = useNotificationStore((s) => s.whatsappLog);
  const addWhatsAppMessage = useNotificationStore((s) => s.addWhatsAppMessage);

  const language = useUIStore((s) => s.language);
  const t = translations[language] || translations.en;

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('colleague');
  const [waMessage, setWaMessage] = useState('');
  const [waRecipient, setWaRecipient] = useState('');

  // STAGE 3 MANDATORY ADAPTER: Hydrate team members from backend API
  const [realMembers, setRealMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoadingMembers(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('cisem_access_token') : null;
        const res = await fetch('/api/v1/tenant/members', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.members && data.members.length > 0) {
            const mapped = data.members.map((m) => ({
              id: m.id || m.email,
              name: m.name || m.full_name || m.email,
              email: m.email,
              role: m.role || 'member',
              company: m.company || 'AGN Ltd',
              initials: (m.name || m.email || 'U').substring(0, 2).toUpperCase(),
              avatar: m.avatar || '👨‍💼'
            }));
            setRealMembers(mapped);
          }
        }
      } catch (err) {
        console.error('Error fetching tenant members:', err);
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchMembers();
  }, []);

  const members = realMembers.length > 0 ? realMembers : storeMembers;

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    addMember(newMemberName.trim(), newMemberRole);
    showToast({ title: t.teamMembers, message: `${newMemberName} added to the team`, type: 'success' });
    setNewMemberName('');
  };

  const handleSendWA = (e) => {
    e.preventDefault();
    if (!waMessage.trim()) return;
    addWhatsAppMessage({
      to: waRecipient,
      text: waMessage.trim(),
      direction: 'sent',
    });
    setWaMessage('');
  };

  const roleIcon = (role) => {
    switch (role) {
      case 'boss':
        return <Crown size={14} style={{ color: 'var(--warning)' }} />;
      case 'user':
        return <User size={14} style={{ color: 'var(--accent)' }} />;
      default:
        return <User size={14} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <PageGreetingBanner view="collaboration" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Team Members */}
        <div id="add-member-form">
          <div className="glass-card-static" style={{ padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={18} /> {t.teamMembers}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {members.map((member) => (
                <div
                  key={member.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface)',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      className="avatar"
                      style={{ background: member.avatar }}
                    >
                      {member.initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {member.name}
                        {roleIcon(member.role)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                        {t[member.role] || member.role}
                      </div>
                    </div>
                  </div>
                  {member.id !== 'user-operator' && (
                    <button
                      className="btn-icon"
                      onClick={() => {
                        removeMember(member.id);
                        showToast({ title: t.delete, message: `${member.name} removed`, type: 'warning' });
                      }}
                      title="Remove member"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Member Form */}
            <form onSubmit={handleAddMember} style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <input
                className="input"
                placeholder={t.name + '...'}
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                style={{ flex: 1 }}
              />
              <select
                className="input select"
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="colleague">{t.colleague}</option>
                <option value="boss">{t.boss}</option>
                <option value="designer">{t.designer}</option>
                <option value="developer">{t.developer}</option>
                <option value="pm">{t.pm}</option>
              </select>
              <button type="submit" className="btn btn-primary btn-sm">
                <UserPlus size={14} /> {t.add}
              </button>
            </form>
          </div>

          {/* Activity Feed */}
          <div className="glass-card-static" style={{ padding: 20 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={18} /> {t.activityFeed}
            </h3>
            {activityFeed.length === 0 ? (
              <div className="empty-state" style={{ padding: 24 }}>
                <Activity size={36} className="empty-state-icon" />
                <p className="empty-state-text">{t.noActivity}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activityFeed.slice(0, 10).map((entry) => (
                  <div key={entry.id} style={{ fontSize: '0.82rem', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <span style={{ fontWeight: 600 }}>{entry.actor}</span>{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>{entry.action}</span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp Style Chat Log */}
        <div className="whatsapp-chat">
          <div className="whatsapp-header">
            <Phone size={18} />
            <span>{t.waLog}</span>
          </div>
          <div className="whatsapp-messages" style={{ minHeight: 300 }}>
            {whatsappLog.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <MessageCircle size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                <p>{t.noWaMsg}</p>
                <p style={{ fontSize: '0.75rem' }}>{t.waDesc}</p>
              </div>
            ) : (
              whatsappLog.map((msg) => (
                <div key={msg.id} className={`whatsapp-bubble ${msg.direction}`}>
                  {msg.direction === 'sent' && (
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--whatsapp-dark)', marginBottom: 2 }}>
                      To: {msg.to}
                    </div>
                  )}
                  <div>{msg.text}</div>
                  <div className="whatsapp-time">
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
              background: 'var(--surface)',
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
              style={{ flex: 1, padding: '6px 10px', fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ background: 'var(--whatsapp-green)' }}>
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
