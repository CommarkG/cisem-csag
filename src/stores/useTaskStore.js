import { create } from 'zustand';
import { createSeedData } from '../utils/seedData';
import { getDescendants, getNextOrder, wouldCreateCycle } from '../utils/treeHelpers';

const generateId = () =>
  'xxxx-xxxx-xxxx'.replace(/x/g, () =>
    Math.floor(Math.random() * 16).toString(16)
  );

// Load from localStorage or seed
const loadTasks = () => {
  try {
    const stored = localStorage.getItem('dima-tasks');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return createSeedData();
};

const loadArchive = () => {
  try {
    const stored = localStorage.getItem('dima-archive-tasks');
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return [];
};

const saveTasks = (tasks) => {
  try {
    localStorage.setItem('dima-tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks:', e);
  }
};

const saveArchive = (archive) => {
  try {
    localStorage.setItem('dima-archive-tasks', JSON.stringify(archive));
  } catch (e) {
    console.error('Failed to save archive:', e);
  }
};

export const useTaskStore = create((set, get) => ({
  items: loadTasks(),
  archivedItems: loadArchive(),

  // Add a new item
  addItem: (item) => {
    const now = new Date().toISOString();
    const newItem = {
      id: generateId(),
      type: 'task',
      parentId: null,
      title: '',
      description: '',
      status: 'todo',
      priority: 'none',
      assigneeId: 'user-operator',
      labels: [],
      dueDate: null,
      startDate: null,
      estimatedHours: null,
      dependencies: [],
      comments: [],
      activityLog: [{ action: `Created ${item.type || 'task'}`, actor: 'Operator', timestamp: now }],
      createdAt: now,
      updatedAt: now,
      order: getNextOrder(get().items, item.parentId || null),

      // New columns (Batch 2)
      creator: 'user-operator',
      entity: '', // Client / Supplier / Team Member relation
      itemType: 'event', // income / expense / product / project / event
      statusColor: '', // status color custom override hex
      sum: 0,
      vat: 17, // default 17% vat
      total: 0,
      currency: 'ILS',
      ref: '',
      ref1: '',
      ref2: '',
      ref3: '',
      ref4: '',
      ref5: '',
      ...item,
    };
    // Calculate total if sum and vat are present
    if (newItem.sum !== undefined && newItem.vat !== undefined) {
      const sumCents = Math.round((Number(newItem.sum) || 0) * 100);
      const vatPct = Math.round(Number(newItem.vat) || 0);
      const totalCents = Math.round((sumCents * (100 + vatPct)) / 100);
      newItem.total = (totalCents / 100).toFixed(2);
    }
    set((state) => {
      const items = [...state.items, newItem];
      saveTasks(items);
      return { items };
    });
    return newItem;
  },

  // Duplicate an item
  duplicateItem: (id) => {
    const state = get();
    const itemToCopy = state.items.find(item => item.id === id);
    if (!itemToCopy) return;

    const now = new Date().toISOString();
    const newItem = {
      ...itemToCopy,
      id: generateId(),
      title: `Copy of ${itemToCopy.title}`,
      createdAt: now,
      updatedAt: now,
      order: getNextOrder(state.items, itemToCopy.parentId || null),
      activityLog: [{ action: `Duplicated from ${id}`, actor: 'Operator', timestamp: now }],
    };

    set((state) => {
      const items = [...state.items, newItem];
      saveTasks(items);
      return { items };
    });
  },

  // Archive an item (moves to archivedItems and saves both)
  archiveItem: (id) => {
    set((state) => {
      const itemToArchive = state.items.find(item => item.id === id);
      if (!itemToArchive) return {};

      const now = new Date().toISOString();
      const archivedItem = {
        ...itemToArchive,
        archivedAt: now,
        status: 'archived',
      };

      const newItems = state.items.filter(item => item.id !== id);
      const newArchive = [...state.archivedItems, archivedItem];

      saveTasks(newItems);
      saveArchive(newArchive);

      return {
        items: newItems,
        archivedItems: newArchive,
      };
    });
  },


  // Update an item
  updateItem: (id, updates) => {
    set((state) => {
      const items = state.items.map((item) =>
        item.id === id
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      );
      saveTasks(items);
      return { items };
    });
  },

  // Delete an item and all descendants
  deleteItem: (id) => {
    set((state) => {
      const descendants = getDescendants(state.items, id);
      const idsToRemove = new Set([id, ...descendants.map((d) => d.id)]);
      const items = state.items.filter((item) => !idsToRemove.has(item.id));
      saveTasks(items);
      return { items };
    });
  },

  // Change status with activity log
  changeStatus: (id, newStatus, actor = 'Operator') => {
    set((state) => {
      const now = new Date().toISOString();
      const items = state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              updatedAt: now,
              activityLog: [
                ...item.activityLog,
                { action: `Moved to ${newStatus}`, actor, timestamp: now },
              ],
            }
          : item
      );
      saveTasks(items);
      return { items };
    });
  },

  // Add comment
  addComment: (id, text, author = 'Operator') => {
    set((state) => {
      const now = new Date().toISOString();
      const items = state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              comments: [...item.comments, { author, text, timestamp: now }],
              activityLog: [
                ...item.activityLog,
                { action: `${author} added a comment`, actor: author, timestamp: now },
              ],
              updatedAt: now,
            }
          : item
      );
      saveTasks(items);
      return { items };
    });
  },

  // Move item to new parent (with cycle check)
  moveItem: (id, newParentId) => {
    const state = get();
    if (wouldCreateCycle(state.items, id, newParentId)) {
      console.warn('Cannot move: would create cycle');
      return false;
    }
    set((state) => {
      const items = state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              parentId: newParentId,
              order: getNextOrder(state.items, newParentId),
              updatedAt: new Date().toISOString(),
            }
          : item
      );
      saveTasks(items);
      return { items };
    });
    return true;
  },

  // Reorder within siblings
  reorderItem: (id, newOrder) => {
    set((state) => {
      const items = state.items.map((item) =>
        item.id === id
          ? { ...item, order: newOrder, updatedAt: new Date().toISOString() }
          : item
      );
      saveTasks(items);
      return { items };
    });
  },

  // Reset to seed data
  resetData: () => {
    const items = createSeedData();
    saveTasks(items);
    set({ items });
  },
}));
