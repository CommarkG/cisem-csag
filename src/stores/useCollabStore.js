import { create } from 'zustand';
import { defaultTeamMembers } from '../utils/seedData';

const generateId = () =>
  'xxxx-xxxx-xxxx'.replace(/x/g, () =>
    Math.floor(Math.random() * 16).toString(16)
  );

const loadCollab = () => {
  try {
    const stored = localStorage.getItem('dima-collab');
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return { members: defaultTeamMembers, activityFeed: [] };
};

const saveCollab = (data) => {
  try {
    localStorage.setItem('dima-collab', JSON.stringify(data));
  } catch (e) {}
};

const AVATAR_COLORS = [
  '#6c5ce7', '#e17055', '#00cec9', '#fdcb6e', '#e84393',
  '#0984e3', '#55a630', '#6d6875', '#b5838d', '#f72585',
];

export const useCollabStore = create((set, get) => {
  const initial = loadCollab();
  return {
    members: initial.members || defaultTeamMembers,
    activityFeed: initial.activityFeed || [],

    // Add a new team member
    addMember: (name, role = 'colleague', email = '', phone = '', company = '', tags = []) => {
      const initials = name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      const member = {
        id: `user-${generateId()}`,
        name,
        role,
        email,
        phone,
        company,
        tags,
        comments: [],
        avatar: AVATAR_COLORS[get().members.length % AVATAR_COLORS.length],
        initials,
      };
      set((state) => {
        const members = [...state.members, member];
        saveCollab({ members, activityFeed: state.activityFeed });
        return { members };
      });
      return member;
    },

    // Remove team member
    removeMember: (id) => {
      // Don't allow removing Dima
      if (id === 'user-operator') return;
      set((state) => {
        const members = state.members.filter((m) => m.id !== id);
        saveCollab({ members, activityFeed: state.activityFeed });
        return { members };
      });
    },

    // Update team member
    updateMember: (id, updates) => {
      set((state) => {
        const members = state.members.map((m) =>
          m.id === id ? { ...m, ...updates } : m
        );
        saveCollab({ members, activityFeed: state.activityFeed });
        return { members };
      });
    },

    // Add comment to team member
    addMemberComment: (memberId, text, author) => {
      const comment = {
        id: `comm-${generateId()}`,
        author,
        text,
        timestamp: new Date().toISOString()
      };
      set((state) => {
        const members = state.members.map((m) => {
          if (m.id === memberId) {
            return { ...m, comments: [...(m.comments || []), comment] };
          }
          return m;
        });
        saveCollab({ members, activityFeed: state.activityFeed });
        return { members };
      });
    },

    // Add activity feed entry
    addActivity: (activity) => {
      const entry = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        ...activity,
      };
      set((state) => {
        const activityFeed = [entry, ...state.activityFeed].slice(0, 50);
        saveCollab({ members: state.members, activityFeed });
        return { activityFeed };
      });
    },

    // Get member by id
    getMember: (id) => {
      return get().members.find((m) => m.id === id);
    },
  };
});
