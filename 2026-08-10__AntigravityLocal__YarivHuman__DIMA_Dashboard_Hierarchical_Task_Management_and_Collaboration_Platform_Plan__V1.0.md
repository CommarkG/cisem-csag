# DIMA Dashboard — Hierarchical Task Management & Collaboration Platform

A premium task management app for Software Development, Product Design, and Personal workflows — with deep hierarchy, multi-view visualization, real collaboration, and a calibratable notification engine.

---

## User Review Required

> [!IMPORTANT]
> **15 improvements over the previous plan** — please review the sections marked with 🆕 below.

> [!WARNING]
> **Scope Advisory**: This is a large application. The plan is structured in **3 build phases** so you can start using the app after Phase 1 (~core views + hierarchy) and we layer on collaboration and advanced features in Phases 2–3. Each phase produces a fully working app.

---

## Decisions (Resolved ✅)

1. ✅ **WhatsApp**: Start with in-app WhatsApp-style message log simulation. Later connect **GreenAPI** for real WhatsApp messaging in Phase 3.
2. ✅ **Team Members**: Pre-seed with **Yariv** (Boss) and **Dima** (You). Simple interface to add/remove team members anytime.
3. ✅ **Deployment**: Local-first. Deploy to Vercel when ready.

---

## Architecture Improvements (vs. Previous Plan)

| Area | ❌ Previous Plan | ✅ Improved Plan |
|---|---|---|
| **State Management** | React Context (collapses with deep nesting) | 🆕 **Zustand** — lightweight, no provider wrapping, scales with nested trees |
| **Data Layer** | Hardcoded to LocalStorage | 🆕 **Adapter pattern** (`StorageAdapter`) — swap between LocalStorage ↔ Supabase without touching components |
| **Drag & Drop** | No library specified | 🆕 **`@dnd-kit/core`** + `@dnd-kit/sortable` — best-in-class for Kanban, accessible, touch-friendly |
| **Routing** | Tab switching via state | 🆕 **React Router v7** — proper URL paths (`/kanban`, `/gantt`, `/calendar`), browser back/forward, deep-linkable views |
| **Task Model** | Flat status field | 🆕 Rich task model with **priority**, **labels/tags**, **assignee**, **due dates**, **estimated hours**, **dependencies**, and **comments** |
| **Search & Filter** | Missing entirely | 🆕 **Global search** (Cmd+K) + sidebar filters by status, assignee, priority, label |
| **Breadcrumbs** | Missing | 🆕 **Breadcrumb bar** showing full path: `Topic > Sub-Topic > Project > ...` |
| **Keyboard Shortcuts** | Missing | 🆕 `N` new task, `Cmd+K` search, `1-4` switch views, `Esc` close modals |
| **Task Templates** | Missing | 🆕 Reusable task templates (e.g., "Bug Report", "Feature Request", "Design Review") |
| **Activity Log** | Missing | 🆕 Per-task changelog: "Dima moved this to Review — 2 min ago" |
| **Analytics** | Missing | 🆕 **Dashboard Overview** with completion rates, overdue counts, velocity charts |
| **Responsive Design** | Not mentioned | 🆕 Responsive breakpoints: collapsible sidebar on tablet, card-stack on mobile |
| **Offline Support** | Not mentioned | 🆕 **Offline-first**: works fully from LocalStorage, syncs to Supabase when online |
| **Collaboration** | Simulated fake users | 🆕 **Real Supabase Auth** + **Realtime subscriptions** for live task updates between team members |
| **Notification Engine** | Simple toast | 🆕 **Rule-based calibration dashboard** — per-event toggles, quiet hours, per-person channels |

---

## Tech Stack (Revised)

| Layer | Technology | Why |
|---|---|---|
| Build | **Vite 6 + React 19** | Instant HMR, modern JSX transform |
| State | **Zustand** | Minimal boilerplate, scales with deep nesting, devtools |
| Routing | **React Router v7** | URL-based views, deep linking, browser navigation |
| DnD | **@dnd-kit/core + sortable** | Accessible, touch-friendly, keyboard DnD |
| Icons | **Lucide React** | Tree-shakeable, consistent design |
| Dates | **date-fns** | Lightweight date utilities (for Gantt/Calendar) |
| CSS | **Vanilla CSS** with custom properties | Full theme control, no framework lock-in |
| Storage (Phase 1) | **LocalStorage** via adapter | Zero-setup, offline-first |
| Storage (Phase 2+) | **Supabase** (Postgres + Realtime + Auth) | Real collaboration, cross-device sync |
| Deploy | **Vercel** | Zero-config React hosting, preview deploys |

---

## Data Model

### 🆕 Hierarchical Node Schema
Every item in the tree shares a common shape, differentiated by `type`:

```js
{
  id: "uuid",
  type: "topic" | "subtopic" | "project" | "subproject" | "task",
  parentId: null | "uuid",        // null = root-level topic
  title: "string",
  description: "markdown string",
  status: "backlog" | "todo" | "in_progress" | "review" | "done" | "blocked",
  priority: "urgent" | "high" | "medium" | "low" | "none",
  assigneeId: "uuid" | null,
  labels: ["bug", "feature", "design"],
  dueDate: "ISO date" | null,
  startDate: "ISO date" | null,
  estimatedHours: number | null,
  dependencies: ["task-uuid"],     // for Gantt linking
  templateId: "template-uuid" | null,
  comments: [{ author, text, timestamp }],
  activityLog: [{ action, actor, timestamp }],
  createdAt: "ISO date",
  updatedAt: "ISO date",
  order: number                    // sort position within siblings
}
```

### 🆕 Notification Rule Schema
```js
{
  id: "uuid",
  event: "status_change" | "due_approaching" | "assigned_to_me" | "comment_added" | "overdue",
  channel: "in_app" | "whatsapp_log" | "both",
  enabled: true,
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
  leadTimeDays: 1,                 // for "due_approaching": fire 1 day before
  recipientFilter: "all" | "boss" | "self"
}
```

---

## File Structure (Revised)

```text
DIMA DASHBOARD/
├── index.html
├── package.json
├── vite.config.js
├── .env.example                        # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
├── src/
│   ├── main.jsx                        # React DOM + Router bootstrap
│   ├── index.css                       # Design system: tokens, themes, components
│   ├── App.jsx                         # Layout shell: Sidebar + Header + <Outlet>
│   │
│   ├── stores/                         # 🆕 Zustand stores (replaces Context)
│   │   ├── useTaskStore.js             # Hierarchical CRUD, drag reorder, bulk actions
│   │   ├── useNotificationStore.js     # Notification log, rules engine, toast queue
│   │   ├── useCollabStore.js           # Team members, presence, activity feed
│   │   ├── useOnboardingStore.js       # Tour step index, completion state
│   │   └── useUIStore.js              # Sidebar collapsed, active filters, search query
│   │
│   ├── services/                       # 🆕 Data layer abstraction
│   │   ├── StorageAdapter.js           # Interface: save/load/delete/subscribe
│   │   ├── LocalStorageAdapter.js      # Implements StorageAdapter for localStorage
│   │   └── SupabaseAdapter.js          # Implements StorageAdapter for Supabase (Phase 2)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx             # Collapsible tree + drag-to-reorder nodes
│   │   │   ├── Header.jsx              # Search (Cmd+K), notifications, theme, user
│   │   │   └── Breadcrumbs.jsx         # 🆕 Full hierarchy path display
│   │   │
│   │   ├── onboarding/
│   │   │   ├── OnboardingTour.jsx      # Spotlight overlay + speech bubble steps
│   │   │   └── WelcomeModal.jsx        # 🆕 First-launch modal: name, role, seed demo data?
│   │   │
│   │   ├── shared/
│   │   │   ├── Modal.jsx               # Reusable modal (task detail, confirmations)
│   │   │   ├── CommandPalette.jsx      # 🆕 Cmd+K fuzzy search across all items
│   │   │   ├── TaskCard.jsx            # Shared card used in Kanban + Calendar
│   │   │   ├── TaskDetailPanel.jsx     # 🆕 Slide-out panel: full task editor
│   │   │   ├── NotificationTray.jsx    # Bell dropdown with grouped alerts
│   │   │   └── ToastContainer.jsx      # Animated toast stack
│   │   │
│   │   └── views/
│   │       ├── DashboardView.jsx       # 🆕 Overview: completion %, overdue, velocity chart
│   │       ├── KanbanView.jsx          # DnD lanes: Backlog → Todo → In Progress → Review → Done
│   │       ├── GanttView.jsx           # Timeline bars with dependency arrows
│   │       ├── CalendarView.jsx        # Month grid with task dots, click to expand
│   │       ├── ListView.jsx            # Sortable table with inline editing
│   │       ├── CollaborationHub.jsx    # Team roster, activity feed, assign rules
│   │       └── SettingsView.jsx        # Notification calibrator, theme, storage, templates
│   │
│   ├── hooks/                          # 🆕 Custom hooks
│   │   ├── useKeyboardShortcuts.js     # Global hotkeys
│   │   ├── useTheme.js                 # System theme detection + manual override
│   │   └── useDebouncedSearch.js       # Search input debouncing
│   │
│   └── utils/
│       ├── treeHelpers.js              # Flatten/unflatten, find ancestors, move nodes
│       ├── dateHelpers.js              # Relative time, date ranges for Gantt
│       └── seedData.js                 # Demo project for onboarding
```

---

## Build Phases

### Phase 1 — Core App (Build First)
> Goal: A fully working local task manager with all 4 views + hierarchy.

| # | Component | Description |
|---|---|---|
| 1 | Vite + React scaffold | `npx create-vite`, install deps |
| 2 | `index.css` | Full design system: tokens, dark/light themes, glass cards, animations |
| 3 | Zustand stores | `useTaskStore`, `useUIStore`, `useOnboardingStore` |
| 4 | `LocalStorageAdapter` | Persist all state changes automatically |
| 5 | Layout shell | `Sidebar` + `Header` + `Breadcrumbs` + React Router |
| 6 | `KanbanView` | DnD lanes with `@dnd-kit`, task cards, quick-add |
| 7 | `ListView` | Sortable table with accordion hierarchy |
| 8 | `CalendarView` | Month grid rendered from task due dates |
| 9 | `GanttView` | Horizontal timeline, dependency arrows, drag-to-resize |
| 10 | `TaskDetailPanel` | Slide-out editor for any task |
| 11 | `CommandPalette` | Cmd+K global search |
| 12 | `OnboardingTour` + `WelcomeModal` | First-run guided walkthrough |
| 13 | Seed demo data | Pre-populated project for onboarding |

### Phase 2 — Notifications & Collaboration
> Goal: Add notification engine + team features.

| # | Component | Description |
|---|---|---|
| 14 | `useNotificationStore` | Rule engine, toast queue, notification log |
| 15 | `NotificationTray` + `ToastContainer` | UI for alerts |
| 16 | `SettingsView` — Notification Calibrator | Per-event toggles, quiet hours, lead times |
| 17 | WhatsApp-style message log | In-app simulation of messages sent to team |
| 18 | `CollaborationHub` | Team member roster, activity feed |
| 19 | `DashboardView` | Analytics overview: completion rates, velocity, overdue |

### Phase 3 — Supabase & Real-Time (Future)
> Goal: Move from local to cloud. Enable real collaboration.

| # | Component | Description |
|---|---|---|
| 20 | Supabase project setup | Tables, RLS policies, auth |
| 21 | `SupabaseAdapter` | Implement `StorageAdapter` for Supabase |
| 22 | Supabase Auth | Login/signup, team invites |
| 23 | Realtime subscriptions | Live task updates across tabs/devices |
| 24 | Vercel deployment | CI/CD, preview branches |

---

## Onboarding Tour Steps (🆕 Detailed)

| Step | Highlights Element | Message |
|---|---|---|
| 1 | Welcome Modal | "Welcome to DIMA Dashboard! Let's set up your workspace in 60 seconds." |
| 2 | Sidebar | "This is your project tree. Topics → Sub-Topics → Projects → Tasks. Click the + to create your first topic." |
| 3 | Header search | "Press Cmd+K to instantly find any task, project, or topic." |
| 4 | View tabs | "Switch between Kanban, Gantt, Calendar, and List views. Each shows the same data differently." |
| 5 | Quick Add button | "Click here to create a task from anywhere. It'll go into the currently selected project." |
| 6 | Notification bell | "Your notification center. Go to Settings to calibrate exactly when and how you get alerted." |
| 7 | Theme toggle | "Light or dark? The app auto-matches your system, but you can override it here." |
| 8 | Task card (in Kanban) | "Drag cards between lanes to change status. Click to open the full detail editor." |
| 9 | Celebration | "You're all set! 🎉 We've loaded a demo project to explore. Delete it anytime." |

---

## Notification Calibration Dashboard (🆕 Detailed)

The Settings → Notifications panel will present a table of rules the user can toggle:

| Event Trigger | In-App | WhatsApp Log | Quiet Hours | Lead Time |
|---|---|---|---|---|
| Task assigned to me | ✅ | ❌ | Respect | — |
| Task moved to "Review" | ✅ | ✅ | Respect | — |
| Due date approaching | ✅ | ✅ | Ignore | 1 day before |
| Task overdue | ✅ | ✅ | Ignore | — |
| Comment on my task | ✅ | ❌ | Respect | — |
| New task in my project | ✅ | ❌ | Respect | — |
| Daily digest | ❌ | ✅ | — | 09:00 daily |

Each row is independently togglable per channel. Quiet hours prevent non-critical alerts from 22:00–08:00.

---

## Design System Highlights

### Auto Theme (System-Matching)
```css
/* Light theme (default) */
:root {
  --bg-primary: #f8f9fc;
  --surface: rgba(255, 255, 255, 0.72);
  --text-primary: #1a1d2e;
  --accent: #6c5ce7;
  --accent-glow: rgba(108, 92, 231, 0.15);
}

/* Dark theme (auto via system preference) */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0f0f1a;
    --surface: rgba(30, 30, 50, 0.65);
    --text-primary: #e8e8f0;
    --accent: #a78bfa;
    --accent-glow: rgba(167, 139, 250, 0.12);
  }
}
```

### Glassmorphism Cards
```css
.glass-card {
  background: var(--surface);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
}
```

---

## Verification Plan

### Automated
```bash
npm run build   # Ensure zero compilation errors
npm run dev     # Verify HMR and all routes load
```

### Manual Testing Checklist
1. **Hierarchy CRUD** — Create Topic → Sub-Topic → Project → Sub-Project → Task, then delete the Topic and confirm cascade.
2. **Cross-View Sync** — Move a task to "Done" in Kanban, verify it updates in List, Calendar, and Gantt.
3. **Drag & Drop** — Drag tasks between Kanban lanes and within the sidebar tree.
4. **Onboarding** — Complete the full tour on a fresh session (clear localStorage).
5. **Theme** — Toggle system dark/light, verify all components adapt.
6. **Search** — Cmd+K search for a task buried 4 levels deep, confirm navigation.
7. **Notifications** — Trigger a "due approaching" event, verify toast and notification tray entry.
8. **Responsive** — Resize to tablet (768px) and mobile (375px), verify sidebar collapses and cards stack.
9. **Offline** — Disconnect network, make changes, reconnect, verify data persists.
