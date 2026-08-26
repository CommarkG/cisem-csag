// Seed data for onboarding
const generateId = () => {
  return 'xxxx-xxxx-xxxx'.replace(/x/g, () =>
    Math.floor(Math.random() * 16).toString(16)
  );
};

// Seed data for onboarding
export const createSeedData = () => {
  const topicId = generateId();
  const subtopicId = generateId();
  const projectId = generateId();
  const subprojectId = generateId();
  const task1Id = generateId();
  const task2Id = generateId();
  const task3Id = generateId();
  const task4Id = generateId();
  const task5Id = generateId();

  const now = new Date().toISOString();
  const tomorrow = new Date(Date.now() + 86400000).toISOString();
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString();
  const in3Days = new Date(Date.now() + 3 * 86400000).toISOString();
  const in5Days = new Date(Date.now() + 5 * 86400000).toISOString();
  const yesterday = new Date(Date.now() - 86400000).toISOString();

  return [
    {
      id: topicId,
      type: 'topic',
      parentId: null,
      title: 'Product Development',
      description: 'Main product development initiatives',
      status: 'in_progress',
      priority: 'high',
      assigneeId: 'user-operator',
      labels: ['product'],
      dueDate: null,
      startDate: now,
      estimatedHours: null,
      dependencies: [],
      comments: [],
      activityLog: [{ action: 'Created topic', actor: 'Operator', timestamp: now }],
      createdAt: now,
      updatedAt: now,
      order: 0,
    },
    {
      id: subtopicId,
      type: 'subtopic',
      parentId: topicId,
      title: 'Frontend',
      description: 'Frontend development workstream',
      status: 'in_progress',
      priority: 'high',
      assigneeId: 'user-operator',
      labels: ['frontend'],
      dueDate: null,
      startDate: now,
      estimatedHours: null,
      dependencies: [],
      comments: [],
      activityLog: [{ action: 'Created sub-topic', actor: 'Operator', timestamp: now }],
      createdAt: now,
      updatedAt: now,
      order: 0,
    },
    {
      id: projectId,
      type: 'project',
      parentId: subtopicId,
      title: 'Dashboard Redesign',
      description: 'Complete redesign of the client-facing dashboard',
      status: 'in_progress',
      priority: 'high',
      assigneeId: 'user-operator',
      labels: ['design', 'frontend'],
      dueDate: nextWeek,
      startDate: now,
      estimatedHours: 40,
      budget: 150000,
      linkedClientId: 'client-1',
      dependencies: [],
      comments: [
        { author: 'Yariv', text: 'Priority project — lets finish this week', timestamp: yesterday }
      ],
      activityLog: [
        { action: 'Created project', actor: 'Operator', timestamp: now },
        { action: 'Yariv added a comment', actor: 'Yariv', timestamp: yesterday },
      ],
      createdAt: now,
      updatedAt: now,
      order: 0,
    },
    {
      id: subprojectId,
      type: 'subproject',
      parentId: projectId,
      title: 'Navigation Components',
      description: 'Build sidebar and header navigation',
      status: 'in_progress',
      priority: 'medium',
      assigneeId: 'user-operator',
      labels: ['components'],
      dueDate: in5Days,
      startDate: now,
      estimatedHours: 16,
      dependencies: [],
      comments: [],
      activityLog: [{ action: 'Created sub-project', actor: 'Operator', timestamp: now }],
      createdAt: now,
      updatedAt: now,
      order: 0,
    },
    {
      id: task1Id,
      type: 'task',
      parentId: subprojectId,
      title: 'Design sidebar tree component',
      description: 'Create a collapsible tree navigation with drag-to-reorder',
      status: 'done',
      priority: 'high',
      assigneeId: 'user-operator',
      labels: ['design', 'components'],
      dueDate: yesterday,
      startDate: yesterday,
      estimatedHours: 4,
      dependencies: [],
      comments: [
        { author: 'Yariv', text: 'Looks great! Ship it.', timestamp: now }
      ],
      activityLog: [
        { action: 'Created task', actor: 'Operator', timestamp: yesterday },
        { action: 'Moved to Done', actor: 'Operator', timestamp: now },
      ],
      createdAt: yesterday,
      updatedAt: now,
      order: 0,
    },
    {
      id: task2Id,
      type: 'task',
      parentId: subprojectId,
      title: 'Implement header with search bar',
      description: 'Build the global header with Cmd+K search trigger and notification bell',
      status: 'in_progress',
      priority: 'medium',
      assigneeId: 'user-operator',
      labels: ['components'],
      dueDate: in3Days,
      startDate: now,
      estimatedHours: 6,
      dependencies: [task1Id],
      comments: [],
      activityLog: [
        { action: 'Created task', actor: 'Operator', timestamp: now },
      ],
      createdAt: now,
      updatedAt: now,
      order: 1,
    },
    {
      id: task3Id,
      type: 'task',
      parentId: subprojectId,
      title: 'Add breadcrumb navigation',
      description: 'Show full path: Topic > Sub-Topic > Project > Sub-Project',
      status: 'todo',
      priority: 'low',
      assigneeId: 'user-operator',
      labels: ['navigation'],
      dueDate: in5Days,
      startDate: in3Days,
      estimatedHours: 3,
      dependencies: [task2Id],
      comments: [],
      activityLog: [
        { action: 'Created task', actor: 'Operator', timestamp: now },
      ],
      createdAt: now,
      updatedAt: now,
      order: 2,
    },
    {
      id: task4Id,
      type: 'task',
      parentId: projectId,
      title: 'Review design mockups with Yariv',
      description: 'Schedule meeting to review all component designs before development',
      status: 'review',
      priority: 'urgent',
      assigneeId: 'user-yariv',
      labels: ['meeting', 'design'],
      dueDate: tomorrow,
      startDate: now,
      estimatedHours: 2,
      dependencies: [],
      comments: [
        { author: 'Operator', text: 'Mockups ready in Figma', timestamp: now }
      ],
      activityLog: [
        { action: 'Created task', actor: 'Operator', timestamp: now },
        { action: 'Moved to Review', actor: 'Operator', timestamp: now },
      ],
      createdAt: now,
      updatedAt: now,
      order: 1,
    },
    {
      id: task5Id,
      type: 'task',
      parentId: projectId,
      title: 'Set up CI/CD pipeline',
      description: 'Configure Vercel deployment with preview branches',
      status: 'backlog',
      priority: 'low',
      assigneeId: null,
      labels: ['devops'],
      dueDate: null,
      startDate: null,
      estimatedHours: 4,
      dependencies: [],
      comments: [],
      activityLog: [
        { action: 'Created task', actor: 'Operator', timestamp: now },
      ],
      createdAt: now,
      updatedAt: now,
      order: 2,
    },
  ];
};

export const defaultTeamMembers = [
  { id: "5c3e147d-546d-4a65-aec8-5814e9ba09b0", name: "Gil Shilo", email: "gil@agn.co.il", role: "account_owner", company: "AGN Ltd", avatar: "#6c5ce7", initials: "GS" },
  { id: "db0cde40-1beb-4392-a4af-55f52332b86f", name: "Omri Shilo", email: "omri@agn.co.il", role: "account_admin", company: "AGN Ltd", avatar: "#00cec9", initials: "OS" },
  { id: "c88f11f6-6b6c-4582-9098-f0f81bda83de", name: "Idan Shilo", email: "design@agn.co.il", role: "member", company: "AGN Ltd", avatar: "#e17055", initials: "IS" },
  { id: "e0791b19-f04a-4ba3-b427-90bd7ed76b5f", name: "Revital", email: "nir@agn.co.il", role: "member", company: "AGN Ltd", avatar: "#fdcb6e", initials: "RV" },
  { id: "2a9bbdbf-cc36-4b23-a640-280d84819b7e", name: "Yariv Fink", email: "sales@btigift.com", role: "member", company: "AGN Ltd", avatar: "#0984e3", initials: "YF" }
];

export const defaultNotificationRules = [
  { id: generateId(), event: 'status_change', label: 'Task status changed', channel: 'in_app', enabled: true, quietHours: true, leadTimeDays: 0 },
  { id: generateId(), event: 'assigned_to_me', label: 'Task assigned to me', channel: 'in_app', enabled: true, quietHours: true, leadTimeDays: 0 },
  { id: generateId(), event: 'due_approaching', label: 'Due date approaching', channel: 'both', enabled: true, quietHours: false, leadTimeDays: 1 },
  { id: generateId(), event: 'overdue', label: 'Task overdue', channel: 'both', enabled: true, quietHours: false, leadTimeDays: 0 },
  { id: generateId(), event: 'comment_added', label: 'New comment on my task', channel: 'in_app', enabled: true, quietHours: true, leadTimeDays: 0 },
  { id: generateId(), event: 'moved_to_review', label: 'Task moved to Review', channel: 'both', enabled: true, quietHours: true, leadTimeDays: 0 },
  { id: generateId(), event: 'daily_digest', label: 'Daily task summary', channel: 'whatsapp_log', enabled: false, quietHours: false, leadTimeDays: 0 },
];

export const STATUS_CONFIG = {
  backlog: { label: 'Backlog', color: '#94a3b8' },
  todo: { label: 'Todo', color: '#3b82f6' },
  in_progress: { label: 'In Progress', color: '#a78bfa' },
  review: { label: 'Review', color: '#f59e0b' },
  done: { label: 'Done', color: '#10b981' },
  blocked: { label: 'Blocked', color: '#ef4444' },
};

export const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent', color: '#ef4444' },
  high: { label: 'High', color: '#f97316' },
  medium: { label: 'Medium', color: '#eab308' },
  low: { label: 'Low', color: '#22c55e' },
  none: { label: 'None', color: '#94a3b8' },
};

export const TYPE_CONFIG = {
  topic: { label: 'Topic', icon: 'Layers' },
  subtopic: { label: 'Sub-Topic', icon: 'GitBranch' },
  project: { label: 'Project', icon: 'FolderKanban' },
  subproject: { label: 'Sub-Project', icon: 'Folder' },
  task: { label: 'Task', icon: 'CheckSquare' },
};
