import { create } from 'zustand';

// Read initial language
const initialLang = localStorage.getItem('dima-lang') || 'en';
// Set initial HTML direction for RTL languages like Hebrew
document.documentElement.dir = initialLang === 'he' ? 'rtl' : 'ltr';
document.documentElement.lang = initialLang;

export const useUIStore = create((set, get) => ({
  // Language
  language: initialLang,
  setLanguage: (lang) => {
    localStorage.setItem('dima-lang', lang);
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    set({ language: lang });
  },

  // Active User Profile
  activeUserId: localStorage.getItem('dima-active-user') || 'user-operator',
  setActiveUserId: (id) => {
    localStorage.setItem('dima-active-user', id);
    set({ activeUserId: id });
  },

  // Role Impersonation (sandbox only — does not affect real auth)
  simulatedRole: localStorage.getItem('dima-simulated-role') || 'platform_admin',
  setSimulatedRole: (role) => {
    localStorage.setItem('dima-simulated-role', role);
    set({ simulatedRole: role });
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

  // Table Visual Settings (Batch 1 & 2)
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
    // Automatically preset visible columns based on template selection
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

