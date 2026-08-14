import React from 'react';
import { Check, Info, AlertTriangle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { useUIStore } from '../../stores/useUIStore';

const getIcon = (type) => {
  switch(type) {
    case 'success': return <Check size={16} color="var(--success)" />;
    case 'warning': return <AlertTriangle size={16} color="var(--warning)" />;
    case 'danger': return <XCircle size={16} color="var(--danger)" />;
    default: return <Info size={16} color="var(--info)" />;
  }
};

export default function NotificationTray() {
  const { notificationTrayOpen, closeNotificationTray } = useUIStore();
  const { log, markRead, markAllRead } = useNotificationStore();

  if (!notificationTrayOpen) return null;

  return (
    <>
      <div 
        className="modal-overlay" 
        style={{ background: 'transparent', zIndex: 'calc(var(--z-dropdown) - 1)' }} 
        onClick={closeNotificationTray}
      />
      <div className="notification-tray glass-card" style={{
        position: 'absolute', top: '70px', right: '24px', width: '340px',
        maxHeight: '400px', overflowY: 'auto', zIndex: 'var(--z-dropdown)',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Notifications</h3>
          <button className="btn-sm btn-ghost" onClick={markAllRead}>Mark all read</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {log.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No notifications
            </div>
          ) : (
            log.map(item => (
              <div 
                key={item.id} 
                className={`notification-item ${!item.read ? 'unread' : ''}`}
                onClick={() => markRead(item.id)}
                style={{ 
                  padding: '12px 16px', borderBottom: '1px solid var(--border-light)', 
                  display: 'flex', gap: '12px', cursor: 'pointer',
                  background: !item.read ? 'var(--accent-subtle)' : 'transparent'
                }}
              >
                <div style={{ marginTop: '2px' }}>{getIcon(item.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: !item.read ? 600 : 500 }}>{item.title}</div>
                  {item.message && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.message}</div>}
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {formatDistanceToNow(new Date(item.timestamp))} ago
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
