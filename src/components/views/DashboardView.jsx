import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../../stores/useTaskStore';
import { useUIStore } from '../../stores/useUIStore';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { useCollabStore } from '../../stores/useCollabStore';
import { countByStatus, getTasksUnder } from '../../utils/treeHelpers';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../../utils/seedData';
import { translations } from '../../utils/translations';
import PageGreetingBanner from '../shared/PageGreetingBanner';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  ListTodo,
  Target,
  Zap,
  Sparkles,
  FolderPlus,
  Eye,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';

export default function DashboardView() {
  const navigate = useNavigate();
  const items = useTaskStore((s) => s.items);
  const selectedNodeId = useUIStore((s) => s.selectedNodeId);
  const setActiveView = useUIStore((s) => s.setActiveView);
  const language = useUIStore((s) => s.language);
  const setFilter = useUIStore((s) => s.setFilter);
  const setSelectedNodeId = useUIStore((s) => s.setSelectedNodeId);
  const openAddItemModal = useUIStore((s) => s.openAddItemModal);
  const activeUserId = useUIStore((s) => s.activeUserId);

  const members = useCollabStore((s) => s.members);

  const t = translations[language] || translations.en;

  const currentUser = useMemo(() => {
    return members.find(m => m.id === activeUserId) || members[0];
  }, [members, activeUserId]);

  const stats = useMemo(() => {
    const tasks = getTasksUnder(items, selectedNodeId);
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const overdue = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
    ).length;
    const review = tasks.filter((t) => t.status === 'review').length;
    const blocked = tasks.filter((t) => t.status === 'blocked').length;
    const urgent = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length;

    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    // Tasks by priority
    const byPriority = {};
    Object.keys(PRIORITY_CONFIG).forEach((p) => {
      byPriority[p] = tasks.filter((t) => t.priority === p && t.status !== 'done').length;
    });

    // Recent activity
    const recentTasks = [...tasks]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);

    return {
      total,
      done,
      inProgress,
      overdue,
      review,
      blocked,
      urgent,
      completionRate,
      byPriority,
      recentTasks,
    };
  }, [items, selectedNodeId]);

  const statusCounts = useMemo(
    () => countByStatus(items, selectedNodeId),
    [items, selectedNodeId]
  );

  const donePctText = useMemo(() => {
    return t.xOfY
      .replace('{done}', stats.done)
      .replace('{total}', stats.total);
  }, [t, stats.done, stats.total]);

  // Clickable Actions
  const handleStartProject = () => {
    openAddItemModal(null, 'project');
  };

  const handleSeeAllProjects = () => {
    setSelectedNodeId(null);
    setActiveView('list');
    navigate('/list');
  };

  const handleSeeTopPriority = () => {
    setSelectedNodeId(null);
    setFilter('priority', 'urgent');
    setActiveView('kanban');
    navigate('/kanban');
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', direction: language === 'he' ? 'rtl' : 'ltr' }}>
      
      {/* 🆕 Premium User Journey Section */}
      <PageGreetingBanner view="dashboard" />

      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 2 }}>
            {selectedNodeId ? t.allTopics + ' / Filtered' : t.allTopics}
          </h1>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 16 }}>
        <div 
          className="glass-card stat-card" 
          onClick={() => { setFilter('status', null); setActiveView('list'); navigate('/list'); }}
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)' }}>
            <Target size={14} />
            <span className="stat-label" style={{ fontSize: '0.78rem' }}>
              {language === 'he' ? 'סה"כ משימות' : 'Total Tasks'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
              {language === 'he' ? `(${stats.total} משימות)` : `(${stats.total} tasks)`}
            </span>
            <div className="stat-value" style={{ fontSize: '0.92rem', fontWeight: 600 }}>{stats.total}</div>
          </div>
        </div>

        <div 
          className="glass-card stat-card" 
          onClick={() => { setFilter('status', 'done'); setActiveView('kanban'); navigate('/kanban'); }}
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--success)' }}>
            <CheckCircle2 size={14} />
            <span className="stat-label" style={{ fontSize: '0.78rem' }}>
              {language === 'he' ? 'הושלמו' : 'Completed'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="stat-change positive" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
              ({donePctText})
            </span>
            <div className="stat-value" style={{ color: 'var(--success)', fontSize: '0.92rem', fontWeight: 600 }}>
              {stats.completionRate}%
            </div>
          </div>
        </div>

        <div 
          className="glass-card stat-card" 
          onClick={() => { setFilter('status', 'in_progress'); setActiveView('kanban'); navigate('/kanban'); }}
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)' }}>
            <Zap size={14} />
            <span className="stat-label" style={{ fontSize: '0.78rem' }}>
              {language === 'he' ? 'בתהליך' : 'In Progress'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
              {language === 'he' ? `(${stats.inProgress} בתהליך)` : `(${stats.inProgress} active)`}
            </span>
            <div className="stat-value" style={{ color: 'var(--accent)', fontSize: '0.92rem', fontWeight: 600 }}>
              {stats.inProgress}
            </div>
          </div>
        </div>

        <div 
          className="glass-card stat-card" 
          onClick={() => { setFilter('status', 'overdue'); setActiveView('kanban'); navigate('/kanban'); }}
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--danger)' }}>
            <AlertTriangle size={14} />
            <span className="stat-label" style={{ fontSize: '0.78rem' }}>
              {language === 'he' ? 'בפיגור' : 'Overdue'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
              {language === 'he' ? `(${stats.overdue} בפיגור)` : `(${stats.overdue} overdue)`}
            </span>
            <div className="stat-value" style={{ color: stats.overdue > 0 ? 'var(--danger)' : 'var(--text-muted)', fontSize: '0.92rem', fontWeight: 600 }}>
              {stats.overdue}
            </div>
          </div>
        </div>
      </div>

      {/* Status breakdown + Priority */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Status Breakdown */}
        <div className="glass-card-static" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={18} /> {t.statusBreakdown}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => {
              const count = statusCounts[key] || 0;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: config.color,
                          display: 'inline-block',
                        }}
                      />
                      {t[key] || config.label}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{count}</span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: 'var(--border)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: config.color,
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="glass-card-static" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={18} /> {t.activePriority}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(PRIORITY_CONFIG).map(([key, config]) => {
              const count = stats.byPriority[key] || 0;
              return (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: count > 0 ? `${config.color}10` : 'transparent',
                  }}
                >
                  <span style={{ fontSize: '0.82rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: config.color,
                        display: 'inline-block',
                      }}
                    />
                    {t[key] || config.label}
                  </span>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: count > 0 ? config.color : 'var(--text-muted)',
                    }}
                  >
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card-static" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={18} /> {t.recentlyUpdated}
        </h3>
        {stats.recentTasks.length === 0 ? (
          <div className="empty-state">
            <ListTodo size={48} className="empty-state-icon" />
            <p className="empty-state-title">{t.noTasksYet}</p>
            <p className="empty-state-text">{t.createFirstTask}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {stats.recentTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => {
                  useUIStore.getState().openDetailPanel(task.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: STATUS_CONFIG[task.status]?.color || 'var(--text-muted)',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {task.title}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span className={`badge badge-priority-${task.priority}`}>
                    {t[task.priority] || PRIORITY_CONFIG[task.priority]?.label}
                  </span>
                  <span className={`badge badge-status-${task.status}`}>
                    {t[task.status] || STATUS_CONFIG[task.status]?.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
