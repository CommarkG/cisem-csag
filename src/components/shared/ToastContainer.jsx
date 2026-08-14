import React from 'react';
import { X, Check, Info, AlertTriangle, XCircle } from 'lucide-react';
import { useNotificationStore } from '../../stores/useNotificationStore';

const getIcon = (type) => {
  switch(type) {
    case 'success': return <Check size={18} color="var(--success)" />;
    case 'warning': return <AlertTriangle size={18} color="var(--warning)" />;
    case 'danger': return <XCircle size={18} color="var(--danger)" />;
    default: return <Info size={18} color="var(--info)" />;
  }
};

export default function ToastContainer() {
  const { toasts, removeToast } = useNotificationStore();

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type || 'info'}`}>
          <div style={{ flexShrink: 0 }}>{getIcon(toast.type)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{toast.title}</div>
            {toast.message && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{toast.message}</div>}
          </div>
          <button className="btn-icon" onClick={() => removeToast(toast.id)} style={{ alignSelf: 'flex-start', padding: '2px' }}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
