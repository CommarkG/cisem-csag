/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: DISPUTED-PROVENANCE-FABRICATED
# original_claimed_plan: CISEM-IP-20260810-FRONTBOOK-REFACTOR [UNVERIFIED]
# original_claimed_signature: GOV-YARIV-20260810-FRONTEND-PLAYBOOK-REFACTOR-V1 [UNVERIFIED]
# status: DISPUTED_PROVENANCE_FABRICATED
# history:
#   - timestamp: "2026-08-23T07:52:00Z"
#     ratified_plan: CISEM-IP-20260822-PEOPLE-PLACES-FILES
#     governor_signature: GOV-YARIV-20260823-PEOPLE-PLACES-FILES-V19
#     reasoning: "Original plan ID flagged as un-manifested synthetic header during V19 audit; re-ratified under V19."
*/
// @playbook_category: Design Token

import { useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '../stores/useUIStore';
import { useTenantSessionStore } from '../stores/useTenantSessionStore';
import { useOnboardingStore } from '../stores/useOnboardingStore';
import { purgeLegacyStorageKeys } from '../utils/tenantStorageAdapter';

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
import SignInView from './views/SignInView';
import UniversalOnboardingViewport from './views/UniversalOnboardingViewport';
import InquiryIntakeView from './views/InquiryIntakeView';
import QuoteBuilderView from './views/QuoteBuilderView';
import WorkOrderAcceptanceView from './views/WorkOrderAcceptanceView';
import CatalogueListView from './views/CatalogueListView';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Execute M6 startup purge of legacy unpartitioned storage keys
  useEffect(() => {
    purgeLegacyStorageKeys();
  }, []);

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
    const validViews = ['inquiry-intake', 'quote-builder', 'work-order-acceptance', 'catalogue', 'clients', 'suppliers', 'admin', 'settings', 'collaboration'];
    if (validViews.includes(path)) {
       setActiveView(path);
    } else if (location.pathname === '/') {
       setActiveView('inquiry-intake');
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
            <Route path="/" element={<Navigate to="/inquiry-intake" replace />} />
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/inquiry-intake" element={<InquiryIntakeView />} />
            <Route path="/quote-builder" element={<QuoteBuilderView />} />
            <Route path="/work-order-acceptance" element={<WorkOrderAcceptanceView />} />
            <Route path="/catalogue" element={<CatalogueListView />} />
            <Route path="/onboarding" element={<UniversalOnboardingViewport />} />
            <Route path="/kanban" element={<KanbanView />} />
            <Route path="/list" element={<ListView />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/gantt" element={<GanttView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/collaboration" element={<CollaborationHub />} />
            <Route path="/admin" element={<AdminView />} />
            <Route path="/templates" element={<TemplateHubView />} />
            <Route path="/signin" element={<SignInView onSuccess={() => window.location.hash = '#/onboarding'} />} />
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </Routes>
        </div>
      </div>

      {/* Overlays */}
      {commandPaletteOpen && <CommandPalette />}
      {detailPanelItemId && <TaskDetailPanel />}
      {notificationTrayOpen && <NotificationTray />}
      {addItemModal && <AddItemModal />}
      <ToastContainer />

      {/* Onboarding - Session & Hash Guarded */}
      {showWelcome && !window.location.hash.includes('signin') && location.pathname !== '/signin' && <WelcomeModal />}
      {onboardingActive && !window.location.hash.includes('signin') && location.pathname !== '/signin' && <OnboardingTour />}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
