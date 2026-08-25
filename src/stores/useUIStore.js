// =============================================================================
// CISEM Mandatory Code Header
// File           : useUIStore.js
// Ratified plan  : Prerequisite Store Split & M2 Store Scope Declaration (2026-08-21)
// Architectural  : Pure device UI preferences store (language, theme, visual layout).
//                  Decoupled from tenant session authority and active user identity.
// Scope          : @store_scope: device
// Axioms         : AX-SECURITY-01, AX-STATELESS-01, U1.2.40 (Prevention Protocol)
// =============================================================================

import { create } from 'zustand';

// Read initial language safely on client
const getInitialLang = () => {
  if (typeof window === 'undefined' || !window.localStorage) return 'en';
  return window.localStorage.getItem('dima-lang') || 'en';
};

const initialLang = getInitialLang();

if (typeof document !== 'undefined') {
  document.documentElement.dir = initialLang === 'he' ? 'rtl' : 'ltr';
  document.documentElement.lang = initialLang;
}

export const useUIStore = create((set, get) => ({
  // Language (Device Scope)
  language: initialLang,
  setLanguage: (lang) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('dima-lang', lang);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
    set({ language: lang });
  },

  // Sidebar
  sidebarCollapsed: false,
  sidebarOpen: true, // for mobile
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Active view
  activeView: 'kanban',
  setActiveView: (view) => set({ activeView: view }),

  // Selected node in sidebar
  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  // Search / Command palette
  commandPaletteOpen: false,
  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),

  // Task detail panel
  detailPanelItemId: null,
  openDetailPanel: (id) => set({ detailPanelItemId: id }),
  closeDetailPanel: () => set({ detailPanelItemId: null }),

  // Notification tray
  notificationTrayOpen: false,
  toggleNotificationTray: () => set((s) => ({ notificationTrayOpen: !s.notificationTrayOpen })),
  closeNotificationTray: () => set({ notificationTrayOpen: false }),

  // Add item modal
  addItemModal: null, // { parentId, type } or null
  openAddItemModal: (parentId, type) => set({ addItemModal: { parentId, type } }),
  closeAddItemModal: () => set({ addItemModal: null }),

  // Filters
  filters: {
    status: null,
    priority: null,
    assigneeId: null,
    label: null,
  },
  setFilter: (key, value) =>
    set((s) => ({
      filters: { ...s.filters, [key]: value },
    })),
  clearFilters: () =>
    set({
      filters: { status: null, priority: null, assigneeId: null, label: null },
    }),

  // Table Visual Settings
  tableTemplate: 'master',
  tableFontSize: 'sm',
  visibleColumns: {
    checkbox: true,
    drag: true,
    id: true,
    actions: true,
    title: true,
    createdAt: false,
    updatedAt: false,
    creator: false,
    entity: true,
    type: true,
    statusColor: false,
    priority: true,
    addTask: false,
    ref: true,
    ref1: false,
    ref2: false,
    ref3: false,
    ref4: false,
    ref5: false,
    sum: false,
    vat: false,
    total: false,
    currency: false,
  },
  setTableTemplate: (template) => {
    let columns = { ...get().visibleColumns };
    if (template === 'quotes') {
      columns = {
        checkbox: true, drag: true, id: true, actions: true, title: true,
        entity: true, type: false, priority: false, ref: true, ref1: false,
        sum: true, vat: true, total: true, currency: false
      };
    } else if (template === 'finance') {
      columns = {
        checkbox: true, drag: true, id: true, actions: true, title: true,
        entity: true, type: true, priority: false, ref: true, ref1: true,
        sum: true, vat: true, total: true, currency: true
      };
    } else if (template === 'products') {
      columns = {
        checkbox: true, drag: true, id: true, actions: true, title: true,
        entity: true, type: true, priority: true, ref: false, ref1: true,
        sum: false, vat: false, total: false, currency: false
      };
    } else { // master
      columns = {
        checkbox: true, drag: true, id: true, actions: true, title: true,
        createdAt: true, updatedAt: true, creator: true, entity: true, type: true,
        statusColor: true, priority: true, addTask: true, ref: true, ref1: true,
        sum: true, vat: true, total: true, currency: true
      };
    }
    set({ tableTemplate: template, visibleColumns: columns });
  },
  setTableFontSize: (size) => set({ tableFontSize: size }),
  setVisibleColumns: (cols) => set((s) => ({ visibleColumns: { ...s.visibleColumns, ...cols } })),
}));
