// Scope          : @store_scope: tenant
import { create } from 'zustand';
import { defaultNotificationRules } from '../utils/seedData';
import { useAdminStore } from './useAdminStore';
import { tenantStorageAdapter } from '../utils/tenantStorageAdapter';

const generateId = () =>
  'xxxx-xxxx-xxxx'.replace(/x/g, () =>
    Math.floor(Math.random() * 16).toString(16)
  );

const loadNotifications = () => {
  try {
    const stored = tenantStorageAdapter.getItem('dima-notifications');
    if (stored) return stored;
  } catch (e) {}
  return { log: [], rules: defaultNotificationRules, whatsappLog: [] };
};

const saveNotifications = (data) => {
  try {
    tenantStorageAdapter.setItem('dima-notifications', data);
  } catch (e) {}
};

export const useNotificationStore = create((set, get) => {
  const initial = loadNotifications();
  return {
    // Notification log (in-app)
    log: initial.log || [],
    // Notification rules
    rules: initial.rules || defaultNotificationRules,
    // WhatsApp message log
    whatsappLog: initial.whatsappLog || [],
    // Toast queue (ephemeral, not persisted)
    toasts: [],

    // Add notification to log
    addNotification: (notification) => {
      const entry = {
        id: generateId(),
        read: false,
        timestamp: new Date().toISOString(),
        ...notification,
      };
      set((state) => {
        const log = [entry, ...state.log].slice(0, 100);
        saveNotifications({ log, rules: state.rules, whatsappLog: state.whatsappLog });
        return { log };
      });
      return entry;
    },

    // Mark as read
    markRead: (id) => {
      set((state) => {
        const log = state.log.map((n) =>
          n.id === id ? { ...n, read: true } : n
        );
        saveNotifications({ log, rules: state.rules, whatsappLog: state.whatsappLog });
        return { log };
      });
    },

    // Mark all as read
    markAllRead: () => {
      set((state) => {
        const log = state.log.map((n) => ({ ...n, read: true }));
        saveNotifications({ log, rules: state.rules, whatsappLog: state.whatsappLog });
        return { log };
      });
    },

    // Get unread count
    getUnreadCount: () => {
      return get().log.filter((n) => !n.read).length;
    },

    // Show toast (ephemeral)
    showToast: (toast) => {
      const entry = {
        id: generateId(),
        type: 'info',
        duration: 4000,
        ...toast,
      };
      set((state) => ({
        toasts: [...state.toasts, entry],
      }));
      // Auto-remove after duration
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== entry.id),
        }));
      }, entry.duration);
    },

    // Remove toast manually
    removeToast: (id) => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    },

    // Update notification rule
    updateRule: (id, updates) => {
      set((state) => {
        const rules = state.rules.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        );
        saveNotifications({ log: state.log, rules, whatsappLog: state.whatsappLog });
        return { rules };
      });
    },

    // Add WhatsApp log entry
    addWhatsAppMessage: (message) => {
      const entry = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        direction: 'sent',
        ...message,
      };
      set((state) => {
        const whatsappLog = [...state.whatsappLog, entry].slice(-100);
        saveNotifications({ log: state.log, rules: state.rules, whatsappLog });
        return { whatsappLog };
      });
      return entry.id;
    },

    // Update WhatsApp log entry status/direction
    updateWhatsAppMessage: (id, updates) => {
      set((state) => {
        const whatsappLog = state.whatsappLog.map((msg) =>
          msg.id === id ? { ...msg, ...updates } : msg
        );
        saveNotifications({ log: state.log, rules: state.rules, whatsappLog });
        return { whatsappLog };
      });
    },

    // Fire notification based on event
    fireEvent: (event, data) => {
      const state = get();
      const matchingRules = state.rules.filter(
        (r) => r.event === event && r.enabled
      );

      matchingRules.forEach((rule) => {
        // Check quiet hours
        if (rule.quietHours) {
          const hour = new Date().getHours();
          if (hour >= 22 || hour < 8) return;
        }

        // In-app notification
        if (rule.channel === 'in_app' || rule.channel === 'both') {
          state.addNotification({
            title: data.title || rule.label,
            message: data.message || '',
            type: data.type || 'info',
            taskId: data.taskId,
          });
          state.showToast({
            title: data.title || rule.label,
            message: data.message || '',
            type: data.type || 'info',
          });
        }

        // WhatsApp log
        if (rule.channel === 'whatsapp_log' || rule.channel === 'both') {
          const text = data.message || `${rule.label}: ${data.title || ''}`;
          const to = data.to || '';
          
          const msgId = state.addWhatsAppMessage({
            to: to,
            text: text,
            direction: 'sent',
          });

          // Fetch active user credentials
          const adminState = useAdminStore.getState();
          const activeUserId = adminState.activeUserId;
          const memberCreds = adminState.memberGreenApiCredentials?.[activeUserId] || {};
          const idInstance = memberCreds.idInstance || adminState.greenApiIdInstance || '';
          const apiTokenInstance = memberCreds.apiTokenInstance || adminState.greenApiTokenInstance || '';

          // Fire proxy call in the background
          fetch('/api/v1/whatsapp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to, text, idInstance, apiTokenInstance })
          }).then(res => {
            if (!res.ok) {
              state.updateWhatsAppMessage(msgId, { direction: 'failed' });
              res.json().then(err => {
                state.showToast({
                  title: 'WhatsApp Dispatch Failed',
                  message: err.error || 'Check Green API logs',
                  type: 'warning'
                });
              });
            }
          }).catch(() => {
            state.updateWhatsAppMessage(msgId, { direction: 'failed' });
          });
        }
      });
    },
  };
});
