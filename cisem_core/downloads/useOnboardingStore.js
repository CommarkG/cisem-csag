// Scope          : @store_scope: person
import { create } from 'zustand';
import { tenantStorageAdapter } from '../utils/tenantStorageAdapter';

const ONBOARDING_STEPS = [
  {
    targetId: 'sidebar-header',
    title: 'Your Project Tree',
    text: 'This is your project hierarchy. Topics → Sub-Topics → Projects → Tasks. Click the + button to create your first topic.',
    position: 'right',
  },
  {
    targetId: 'header-search',
    title: 'Quick Search',
    text: 'Press Cmd+K (or Ctrl+K) to instantly find any task, project, or topic from anywhere.',
    position: 'bottom',
  },
  {
    targetId: 'view-tabs',
    title: 'Multiple Views',
    text: 'Switch between Kanban, Gantt, Calendar, and List views. Each shows the same data differently.',
    position: 'bottom',
  },
  {
    targetId: 'quick-add-btn',
    title: 'Quick Add',
    text: 'Click here to create a task from anywhere. It goes into the currently selected project.',
    position: 'bottom',
  },
  {
    targetId: 'notification-btn',
    title: 'Notifications',
    text: 'Your notification center. Go to Settings to calibrate exactly when and how you get alerted.',
    position: 'bottom',
  },
  {
    targetId: 'theme-toggle',
    title: 'Theme',
    text: 'The app auto-matches your system theme. You can also toggle it manually here.',
    position: 'bottom',
  },
];

const loadOnboarding = () => {
  try {
    const hasAuthToken = typeof window !== 'undefined' && localStorage.getItem('cisem_access_token');
    if (hasAuthToken) {
      return { completed: true, currentStep: 0, active: false }; // FORBID welcome tour modal
    }
    const stored = tenantStorageAdapter.getItem('dima-onboarding');
    if (stored) return stored;
  } catch (e) {}
  return { completed: false, currentStep: 0, active: false };
};

const saveOnboarding = (data) => {
  try {
    tenantStorageAdapter.setItem('dima-onboarding', data);
  } catch (e) {}
};

export const useOnboardingStore = create((set, get) => {
  const initial = loadOnboarding();
  const hasAuthToken = typeof window !== 'undefined' && localStorage.getItem('cisem_access_token');
  return {
    completed: initial.completed || false,
    currentStep: initial.currentStep || 0,
    active: false, // only true while tour is running
    showWelcome: false,
    steps: ONBOARDING_STEPS,

    startTour: () => {
      set({ active: true, currentStep: 0, showWelcome: false });
    },

    nextStep: () => {
      const { currentStep, steps } = get();
      if (currentStep < steps.length - 1) {
        set({ currentStep: currentStep + 1 });
      } else {
        // Tour complete
        const data = { completed: true, currentStep: 0, active: false };
        saveOnboarding(data);
        set({ ...data, showWelcome: false });
      }
    },

    prevStep: () => {
      const { currentStep } = get();
      if (currentStep > 0) {
        set({ currentStep: currentStep - 1 });
      }
    },

    skipTour: () => {
      const data = { completed: true, currentStep: 0, active: false };
      saveOnboarding(data);
      set({ ...data, showWelcome: false });
    },

    dismissWelcome: () => {
      set({ showWelcome: false });
    },

    restartTour: () => {
      set({ active: true, currentStep: 0, completed: false, showWelcome: false });
    },
  };
});
