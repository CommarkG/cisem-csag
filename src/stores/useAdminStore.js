// Scope          : @store_scope: tenant
import { create } from 'zustand';

const generateId = () =>
  'xxxx-xxxx-xxxx'.replace(/x/g, () =>
    Math.floor(Math.random() * 16).toString(16)
  );

const defaultClients = [
  {
    id: 'client-1',
    name: 'Sarah Jenkins',
    company: 'TechCorp',
    email: 'sarah@techcorp.com',
    phone: '+972-54-123-4567',
    value: 120000,
    linkedProjectIds: [],
    tags: ['VIP', 'Software', 'Active'],
    comments: [
      { id: 'cc-1', author: 'Operator', text: 'Sent the proposal on Sunday', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() }
    ]
  },
  {
    id: 'client-2',
    name: 'David Cohen',
    company: 'Apex Retail',
    email: 'david@apex.com',
    phone: '+972-52-987-6543',
    value: 85000,
    linkedProjectIds: [],
    tags: ['Retail', 'Lead'],
    comments: []
  },
  {
    id: 'client-3',
    name: 'Elena Petrova',
    company: 'Mir Logistics',
    email: 'e.petrova@mir-log.ru',
    phone: '+7-916-123-4567',
    value: 240000,
    linkedProjectIds: [],
    tags: ['RU', 'Enterprise', 'VIP'],
    comments: [
      { id: 'cc-2', author: 'Operator', text: 'Initial consultation completed. High potential.', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() }
    ]
  }
];

const defaultSuppliers = [
  {
    id: 'supplier-1',
    name: 'John Doe',
    company: 'Global Electronics Ltd',
    email: 'sales@globalelec.com',
    phone: '+1-800-555-0199',
    materials: ['sensors', 'chips', 'resistors'],
    status: 'active',
    tags: ['Shenzhen', 'FastShipping'],
    comments: []
  },
  {
    id: 'supplier-2',
    name: 'Moshe Levi',
    company: 'Israel Metalworks',
    email: 'moshe@ismetal.co.il',
    phone: '+972-3-555-1212',
    materials: ['aluminum', 'steel', 'brackets'],
    status: 'active',
    tags: ['Local', 'Quality'],
    comments: [
      { id: 'sc-1', author: 'Operator', text: 'Negotiated 10% discount on bulk orders', timestamp: new Date(Date.now() - 86400000).toISOString() }
    ]
  },
  {
    id: 'supplier-3',
    name: 'Li Wei',
    company: 'Sino Plastics Corp',
    email: 'li.wei@sinoplast.cn',
    phone: '+86-21-5555-8888',
    materials: ['plastics', 'casings', 'molds'],
    status: 'pending',
    tags: ['China', 'Tooling'],
    comments: []
  }
];

const defaultTagColors = {
  'vip': '#e84393',
  'software': '#0984e3',
  'active': '#00b894',
  'retail': '#fdcb6e',
  'lead': '#d63031',
  'ru': '#6c5ce7',
  'enterprise': '#e17055',
  'local': '#00b894',
  'quality': '#0984e3',
  'fastshipping': '#e17055',
  'china': '#d63031',
  'tooling': '#6c5ce7'
};


const loadAdmin = () => {
  try {
    const stored = tenantStorageAdapter.getItem('dima-admin');
    if (stored) {
      return {
        clients: stored.clients || defaultClients,
        suppliers: stored.suppliers || defaultSuppliers,
        clientCustomFields: stored.clientCustomFields || [],
        supplierCustomFields: stored.supplierCustomFields || [],
        teamCustomFields: stored.teamCustomFields || [],
        tagColors: stored.tagColors || defaultTagColors,
        greenApiIdInstance: stored.greenApiIdInstance || '',
        greenApiTokenInstance: stored.greenApiTokenInstance || '',
        memberGreenApiCredentials: stored.memberGreenApiCredentials || {}
      };
    }
  } catch (e) {}
  return { 
    clients: defaultClients, 
    suppliers: defaultSuppliers,
    clientCustomFields: [],
    supplierCustomFields: [],
    teamCustomFields: [],
    tagColors: defaultTagColors,
    greenApiIdInstance: '',
    greenApiTokenInstance: '',
    memberGreenApiCredentials: {}
  };
};

const saveAdmin = (partialData) => {
  try {
    const currentParsed = tenantStorageAdapter.getItem('dima-admin') || {};
    const merged = {
      clients: partialData.clients !== undefined ? partialData.clients : currentParsed.clients,
      suppliers: partialData.suppliers !== undefined ? partialData.suppliers : currentParsed.suppliers,
      clientCustomFields: partialData.clientCustomFields !== undefined ? partialData.clientCustomFields : currentParsed.clientCustomFields,
      supplierCustomFields: partialData.supplierCustomFields !== undefined ? partialData.supplierCustomFields : currentParsed.supplierCustomFields,
      teamCustomFields: partialData.teamCustomFields !== undefined ? partialData.teamCustomFields : currentParsed.teamCustomFields,
      tagColors: partialData.tagColors !== undefined ? partialData.tagColors : currentParsed.tagColors,
      greenApiIdInstance: partialData.greenApiIdInstance !== undefined ? partialData.greenApiIdInstance : currentParsed.greenApiIdInstance,
      greenApiTokenInstance: partialData.greenApiTokenInstance !== undefined ? partialData.greenApiTokenInstance : currentParsed.greenApiTokenInstance,
      memberGreenApiCredentials: partialData.memberGreenApiCredentials !== undefined ? partialData.memberGreenApiCredentials : currentParsed.memberGreenApiCredentials
    };
    tenantStorageAdapter.setItem('dima-admin', merged);
  } catch (e) {}
};

export const useAdminStore = create((set, get) => {
  const initial = loadAdmin();
  return {
    clients: initial.clients,
    suppliers: initial.suppliers,
    clientCustomFields: initial.clientCustomFields || [],
    supplierCustomFields: initial.supplierCustomFields || [],
    teamCustomFields: initial.teamCustomFields || [],
    tagColors: initial.tagColors || defaultTagColors,
    greenApiIdInstance: initial.greenApiIdInstance || '',
    greenApiTokenInstance: initial.greenApiTokenInstance || '',
    memberGreenApiCredentials: initial.memberGreenApiCredentials || {},

    setGlobalGreenApiCredentials: (idInstance, apiTokenInstance) => {
      set((state) => {
        const update = { greenApiIdInstance: idInstance, greenApiTokenInstance: apiTokenInstance };
        saveAdmin({ ...state, ...update });
        return update;
      });
    },

    setMemberGreenApiCredentials: (memberId, idInstance, apiTokenInstance) => {
      set((state) => {
        const updatedMap = {
          ...state.memberGreenApiCredentials,
          [memberId]: { idInstance, apiTokenInstance }
        };
        saveAdmin({ ...state, memberGreenApiCredentials: updatedMap });
        return { memberGreenApiCredentials: updatedMap };
      });
    },

    deleteMemberGreenApiCredentials: (memberId) => {
      set((state) => {
        const updatedMap = { ...state.memberGreenApiCredentials };
        delete updatedMap[memberId];
        saveAdmin({ ...state, memberGreenApiCredentials: updatedMap });
        return { memberGreenApiCredentials: updatedMap };
      });
    },

    setTagColor: (tag, color) => {
      set((state) => {
        const key = tag.toLowerCase().trim();
        const updatedColors = { ...state.tagColors, [key]: color };
        saveAdmin({ ...state, tagColors: updatedColors });
        return { tagColors: updatedColors };
      });
    },

    deleteTagColor: (tag) => {
      set((state) => {
        const key = tag.toLowerCase().trim();
        const updatedColors = { ...state.tagColors };
        delete updatedColors[key];
        saveAdmin({ ...state, tagColors: updatedColors });
        return { tagColors: updatedColors };
      });
    },

    // Custom fields management
    addCustomField: (entityType, name, type) => {
      const newField = {
        field: `custom_${generateId().replace(/-/g, '_')}`,
        label: name,
        type: type, // 'text' | 'number' | 'currency' | 'date' | 'tags'
        isCustom: true
      };

      set((state) => {
        let update = {};
        if (entityType === 'clients') {
          update = { clientCustomFields: [...state.clientCustomFields, newField] };
        } else if (entityType === 'suppliers') {
          update = { supplierCustomFields: [...state.supplierCustomFields, newField] };
        } else if (entityType === 'team') {
          update = { teamCustomFields: [...state.teamCustomFields, newField] };
        }

        const nextState = { ...state, ...update };
        saveAdmin({
          clients: nextState.clients,
          suppliers: nextState.suppliers,
          clientCustomFields: nextState.clientCustomFields,
          supplierCustomFields: nextState.supplierCustomFields,
          teamCustomFields: nextState.teamCustomFields
        });
        return update;
      });
    },

    deleteCustomField: (entityType, fieldKey) => {
      set((state) => {
        let update = {};
        if (entityType === 'clients') {
          update = { clientCustomFields: state.clientCustomFields.filter(f => f.field !== fieldKey) };
        } else if (entityType === 'suppliers') {
          update = { supplierCustomFields: state.supplierCustomFields.filter(f => f.field !== fieldKey) };
        } else if (entityType === 'team') {
          update = { teamCustomFields: state.teamCustomFields.filter(f => f.field !== fieldKey) };
        }

        const nextState = { ...state, ...update };
        
        // Clean data records by removing the field key
        let cleanedClients = nextState.clients;
        let cleanedSuppliers = nextState.suppliers;
        
        if (entityType === 'clients') {
          cleanedClients = nextState.clients.map(c => {
            const copy = { ...c };
            delete copy[fieldKey];
            return copy;
          });
          update.clients = cleanedClients;
        } else if (entityType === 'suppliers') {
          cleanedSuppliers = nextState.suppliers.map(s => {
            const copy = { ...s };
            delete copy[fieldKey];
            return copy;
          });
          update.suppliers = cleanedSuppliers;
        }

        saveAdmin({
          clients: cleanedClients,
          suppliers: cleanedSuppliers,
          clientCustomFields: nextState.clientCustomFields,
          supplierCustomFields: nextState.supplierCustomFields,
          teamCustomFields: nextState.teamCustomFields
        });
        return update;
      });
    },

    // Clients CRUD
    addClient: (clientData) => {
      const client = {
        id: `client-${generateId()}`,
        name: clientData.name || '',
        company: clientData.company || 'Unassigned',
        email: clientData.email || '',
        phone: clientData.phone || '',
        value: Number(clientData.value) || 0,
        linkedProjectIds: clientData.linkedProjectIds || [],
        tags: clientData.tags || [],
        comments: []
      };
      // Populate custom fields with empty/default values
      get().clientCustomFields.forEach(f => {
        client[f.field] = f.type === 'tags' ? [] : f.type === 'number' || f.type === 'currency' ? 0 : '';
      });

      set((state) => {
        const clients = [...state.clients, client];
        saveAdmin({ 
          clients, 
          suppliers: state.suppliers,
          clientCustomFields: state.clientCustomFields,
          supplierCustomFields: state.supplierCustomFields,
          teamCustomFields: state.teamCustomFields
        });
        return { clients };
      });
      return client;
    },

    updateClient: (id, updates) => {
      set((state) => {
        const clients = state.clients.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        );
        saveAdmin({ 
          clients, 
          suppliers: state.suppliers,
          clientCustomFields: state.clientCustomFields,
          supplierCustomFields: state.supplierCustomFields,
          teamCustomFields: state.teamCustomFields
        });
        return { clients };
      });
    },

    deleteClient: (id) => {
      set((state) => {
        const clients = state.clients.filter((c) => c.id !== id);
        saveAdmin({ 
          clients, 
          suppliers: state.suppliers,
          clientCustomFields: state.clientCustomFields,
          supplierCustomFields: state.supplierCustomFields,
          teamCustomFields: state.teamCustomFields
        });
        return { clients };
      });
    },

    addClientComment: (clientId, text, author) => {
      const comment = {
        id: `comm-${generateId()}`,
        author,
        text,
        timestamp: new Date().toISOString()
      };
      set((state) => {
        const clients = state.clients.map((c) => {
          if (c.id === clientId) {
            return { ...c, comments: [...(c.comments || []), comment] };
          }
          return c;
        });
        saveAdmin({ 
          clients, 
          suppliers: state.suppliers,
          clientCustomFields: state.clientCustomFields,
          supplierCustomFields: state.supplierCustomFields,
          teamCustomFields: state.teamCustomFields
        });
        return { clients };
      });
    },

    // Suppliers CRUD
    addSupplier: (supplierData) => {
      const supplier = {
        id: `supplier-${generateId()}`,
        name: supplierData.name || '',
        company: supplierData.company || 'Unassigned',
        email: supplierData.email || '',
        phone: supplierData.phone || '',
        materials: supplierData.materials || [],
        status: supplierData.status || 'pending',
        tags: supplierData.tags || [],
        comments: []
      };
      // Populate custom fields with empty/default values
      get().supplierCustomFields.forEach(f => {
        supplier[f.field] = f.type === 'tags' ? [] : f.type === 'number' || f.type === 'currency' ? 0 : '';
      });

      set((state) => {
        const suppliers = [...state.suppliers, supplier];
        saveAdmin({ 
          clients: state.clients, 
          suppliers,
          clientCustomFields: state.clientCustomFields,
          supplierCustomFields: state.supplierCustomFields,
          teamCustomFields: state.teamCustomFields
        });
        return { suppliers };
      });
      return supplier;
    },

    updateSupplier: (id, updates) => {
      set((state) => {
        const suppliers = state.suppliers.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        );
        saveAdmin({ 
          clients: state.clients, 
          suppliers,
          clientCustomFields: state.clientCustomFields,
          supplierCustomFields: state.supplierCustomFields,
          teamCustomFields: state.teamCustomFields
        });
        return { suppliers };
      });
    },

    deleteSupplier: (id) => {
      set((state) => {
        const suppliers = state.suppliers.filter((s) => s.id !== id);
        saveAdmin({ 
          clients: state.clients, 
          suppliers,
          clientCustomFields: state.clientCustomFields,
          supplierCustomFields: state.supplierCustomFields,
          teamCustomFields: state.teamCustomFields
        });
        return { suppliers };
      });
    },

    addSupplierComment: (supplierId, text, author) => {
      const comment = {
        id: `comm-${generateId()}`,
        author,
        text,
        timestamp: new Date().toISOString()
      };
      set((state) => {
        const suppliers = state.suppliers.map((s) => {
          if (s.id === supplierId) {
            return { ...s, comments: [...(s.comments || []), comment] };
          }
          return s;
        });
        saveAdmin({ 
          clients: state.clients, 
          suppliers,
          clientCustomFields: state.clientCustomFields,
          supplierCustomFields: state.supplierCustomFields,
          teamCustomFields: state.teamCustomFields
        });
        return { suppliers };
      });
    },

    // Bulk actions
    importClients: (clientsList) => {
      set((state) => {
        const updated = [...state.clients];
        clientsList.forEach(imported => {
          const idx = updated.findIndex(c => c.id === imported.id || (c.email && c.email === imported.email));
          if (idx > -1) {
            updated[idx] = { ...updated[idx], ...imported, comments: updated[idx].comments || [] };
          } else {
            const client = {
              id: imported.id || `client-${generateId()}`,
              name: imported.name || '',
              company: imported.company || 'Unassigned',
              email: imported.email || '',
              phone: imported.phone || '',
              value: Number(imported.value) || 0,
              linkedProjectIds: imported.linkedProjectIds || [],
              tags: imported.tags || [],
              comments: imported.comments || []
            };
            // Map custom properties too
            state.clientCustomFields.forEach(f => {
              if (imported[f.field] !== undefined) {
                client[f.field] = imported[f.field];
              }
            });
            updated.push(client);
          }
        });
        saveAdmin({ 
          clients: updated, 
          suppliers: state.suppliers,
          clientCustomFields: state.clientCustomFields,
          supplierCustomFields: state.supplierCustomFields,
          teamCustomFields: state.teamCustomFields
        });
        return { clients: updated };
      });
    },

    importSuppliers: (suppliersList) => {
      set((state) => {
        const updated = [...state.suppliers];
        suppliersList.forEach(imported => {
          const idx = updated.findIndex(s => s.id === imported.id || (s.email && s.email === imported.email));
          if (idx > -1) {
            updated[idx] = { ...updated[idx], ...imported, comments: updated[idx].comments || [] };
          } else {
            const supplier = {
              id: imported.id || `supplier-${generateId()}`,
              name: imported.name || '',
              company: imported.company || 'Unassigned',
              email: imported.email || '',
              phone: imported.phone || '',
              materials: imported.materials || [],
              status: imported.status || 'pending',
              tags: imported.tags || [],
              comments: imported.comments || []
            };
            state.supplierCustomFields.forEach(f => {
              if (imported[f.field] !== undefined) {
                supplier[f.field] = imported[f.field];
              }
            });
            updated.push(supplier);
          }
        });
        saveAdmin({ 
          clients: state.clients, 
          suppliers: updated,
          clientCustomFields: state.clientCustomFields,
          supplierCustomFields: state.supplierCustomFields,
          teamCustomFields: state.teamCustomFields
        });
        return { suppliers: updated };
      });
    }
  };
});
