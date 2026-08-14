/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260810-FRONTBOOK-REFACTOR
# governor_signature: GOV-YARIV-20260810-FRONTEND-PLAYBOOK-REFACTOR-V1.0
# version: V1.1
# reasoning: |
#   Root client-side application wrapper routing context for DIMA Dashboard views.
#   Parent principles: AxiomsAndPrinciples V1.30 >AX-10000, >PR-58950.
# */
// @playbook_category: Design Token

import { useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '../stores/useUIStore';
import { useOnboardingStore } from '../stores/useOnboardingStore';

import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import CommandPalette from './shared/CommandPalette';
import TaskDetailPanel from './shared/TaskDetailPanel';
import NotificationTray from './shared/NotificationTray';
import ToastContainer from './shared/ToastContainer';
import AddItemModal from './shared/AddItemModal';
import OnboardingTour from './onboarding/OnboardingTour';
import WelcomeModal from './onboarding/WelcomeModal';

import KanbanView from './views/KanbanView';
import ListView from './views/ListView';
import CalendarView from './views/CalendarView';
import GanttView from './views/GanttView';
import DashboardView from './views/DashboardView';
import SettingsView from './views/SettingsView';
import CollaborationHub from './views/CollaborationHub';
import AdminView from './views/AdminView';
import TemplateHubView from './views/TemplateHubView';

function DimaAppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const commandPaletteOpen = useUIStore((s) => s.commandPaletteOpen);
  const detailPanelItemId = useUIStore((s) => s.detailPanelItemId);
  const notificationTrayOpen = useUIStore((s) => s.notificationTrayOpen);
  const addItemModal = useUIStore((s) => s.addItemModal);
  const openCommandPalette = useUIStore((s) => s.openCommandPalette);
  const closeCommandPalette = useUIStore((s) => s.closeCommandPalette);
  const closeDetailPanel = useUIStore((s) => s.closeDetailPanel);
  const closeNotificationTray = useUIStore((s) => s.closeNotificationTray);
  const closeAddItemModal = useUIStore((s) => s.closeAddItemModal);
  const setActiveView = useUIStore((s) => s.setActiveView);

  const onboardingActive = useOnboardingStore((s) => s.active);
  const showWelcome = useOnboardingStore((s) => s.showWelcome);

  // Synchronize route changes to store's activeView
  useEffect(() => {
    const path = location.pathname.substring(1);
    const validViews = ['dashboard', 'kanban', 'list', 'calendar', 'gantt', 'settings', 'collaboration', 'admin', 'templates'];
    if (validViews.includes(path)) {
       setActiveView(path);
    } else if (location.pathname === '/') {
       setActiveView('dashboard');
    }
  }, [location.pathname, setActiveView]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e) => {
      // Cmd+K / Ctrl+K = Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openCommandPalette();
        return;
      }

      // Escape = close overlays
      if (e.key === 'Escape') {
        if (commandPaletteOpen) {
          closeCommandPalette();
        } else if (detailPanelItemId) {
          closeDetailPanel();
        } else if (notificationTrayOpen) {
          closeNotificationTray();
        } else if (addItemModal) {
          closeAddItemModal();
        }
        return;
      }

      // Don't handle shortcuts if typing in an input
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.tagName === 'SELECT' ||
        e.target.isContentEditable
      ) {
        return;
      }

      // Number keys for view switching
      switch (e.key) {
        case '1':
          navigate('/kanban');
          break;
        case '2':
          navigate('/list');
          break;
        case '3':
          navigate('/calendar');
          break;
        case '4':
          navigate('/gantt');
          break;
        case '5':
          navigate('/dashboard');
          break;
        default:
          break;
      }
    },
    [
      commandPaletteOpen,
      detailPanelItemId,
      notificationTrayOpen,
      addItemModal,
      openCommandPalette,
      closeCommandPalette,
      closeDetailPanel,
      closeNotificationTray,
      closeAddItemModal,
      navigate,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <Sidebar />
        <div className="app-content" style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/kanban" element={<KanbanView />} />
            <Route path="/list" element={<ListView />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/gantt" element={<GanttView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/collaboration" element={<CollaborationHub />} />
            <Route path="/admin" element={<AdminView />} />
            <Route path="/templates" element={<TemplateHubView />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>

      {/* Overlays */}
      {commandPaletteOpen && <CommandPalette />}
      {detailPanelItemId && <TaskDetailPanel />}
      {notificationTrayOpen && <NotificationTray />}
      {addItemModal && <AddItemModal />}
      <ToastContainer />

      {/* Onboarding */}
      {showWelcome && <WelcomeModal />}
      {onboardingActive && <OnboardingTour />}
    </div>
  );
}

export default function DimaAppWrapper() {
  return (
    <HashRouter>
      <DimaAppContent />
    </HashRouter>
  );
}
