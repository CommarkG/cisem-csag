import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefineFieldsModal from './DefineFieldsModal';
import { useUIStore } from '../../stores/useUIStore';
import { useCollabStore } from '../../stores/useCollabStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { useAdminStore } from '../../stores/useAdminStore';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { translations, tValue } from '../../utils/translations';
import { 
  Sparkles, 
  Plus, 
  ListTodo, 
  FolderPlus,
  Eye, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Calendar,
  AlertTriangle,
  Upload,
  Settings,
  HelpCircle,
  MessageSquare
} from 'lucide-react';

const ZapIcon = () => (
  <span style={{ display: 'inline-flex', padding: 2, background: 'rgba(234,179,8,0.2)', borderRadius: 4, color: '#eab308' }}>
    <Sparkles size={14} />
  </span>
);

export default function PageGreetingBanner({ view }) {
  const navigate = useNavigate();
  const language = useUIStore((s) => s.language);
  const activeUserId = useUIStore((s) => s.activeUserId);
  const setActiveUserId = useUIStore((s) => s.setActiveUserId);
  const setFilter = useUIStore((s) => s.setFilter);
  const clearFilters = useUIStore((s) => s.clearFilters);
  const openAddItemModal = useUIStore((s) => s.openAddItemModal);
  const selectedNodeId = useUIStore((s) => s.selectedNodeId);
  const setActiveView = useUIStore((s) => s.setActiveView);
  
  const [defineFieldsType, setDefineFieldsType] = useState(null);
  
  const { members, addMember } = useCollabStore();
  const { addItem, resetData } = useTaskStore();
  const { addClient, addSupplier } = useAdminStore();
  const { showToast } = useNotificationStore();

  const t = translations[language] || translations.en;

  const currentUser = useMemo(() => {
    return members.find(m => m.id === activeUserId) || members[0];
  }, [members, activeUserId]);

  const handleUserSwap = (e) => {
    setActiveUserId(e.target.value);
    showToast({
      title: language === 'he' ? 'פרופיל הוחלף' : 'Profile Swapped',
      message: `${language === 'he' ? 'ברוך הבא' : 'Welcome back'}, ${members.find(m => m.id === e.target.value)?.name}!`,
      type: 'success'
    });
  };

  // Define Banners Configuration for each view
  const config = useMemo(() => {
    const defaultData = {
      greeting: t.promotingToday || 'What would we be promoting today?',
      actions: [
        {
          label: t.startNewProject || 'Start a new project',
          icon: <FolderPlus size={16} />,
          onClick: () => openAddItemModal(selectedNodeId, 'project')
        },
        {
          label: t.seeAllProjects || 'See all projects',
          icon: <Eye size={16} />,
          onClick: () => {
            clearFilters();
            setActiveView('list');
            navigate('/list');
          }
        },
        {
          label: t.seeTopPriority || 'See top priority tasks',
          icon: <ZapIcon />,
          onClick: () => {
            clearFilters();
            setFilter('priority', 'urgent');
            setActiveView('kanban');
            navigate('/kanban');
          }
        }
      ]
    };

    switch(view) {
      case 'dashboard':
        return defaultData;

      case 'kanban':
        return {
          greeting: language === 'he' ? 'מה תרצה לקדם בלוח הקנבן היום?' : language === 'ru' ? 'Что бы вы хотели продвинуть на Канбане сегодня?' : 'What would you like to build on Kanban today?',
          actions: [
            {
              label: language === 'he' ? 'הוסף משימה חדשה' : language === 'ru' ? 'Создать задачу' : 'Add a new task',
              icon: <Plus size={16} />,
              onClick: () => openAddItemModal(selectedNodeId, 'task')
            },
            {
              label: language === 'he' ? 'הראה משימות שלי' : language === 'ru' ? 'Мои задачи' : 'Show tasks assigned to me',
              icon: <UserCheck size={16} />,
              onClick: () => {
                clearFilters();
                setFilter('assigneeId', activeUserId);
              }
            },
            {
              label: language === 'he' ? 'סקור משימות חסומות' : language === 'ru' ? 'Заблокированные задачи' : 'Review blocked tasks',
              icon: <AlertTriangle size={16} />,
              onClick: () => {
                clearFilters();
                setFilter('status', 'blocked');
              }
            }
          ]
        };

      case 'list':
        return {
          greeting: language === 'he' ? 'כיצד תרצה לארגן את עץ הפרויקטים היום?' : language === 'ru' ? 'Как вы хотите структурировать проекты сегодня?' : 'How would you like to structure your project tree today?',
          actions: [
            {
              label: language === 'he' ? 'צור נושא חדש' : language === 'ru' ? 'Добавить тему' : 'Add a new Topic',
              icon: <Plus size={16} />,
              onClick: () => openAddItemModal(null, 'topic')
            },
            {
              label: language === 'he' ? 'אפס את כל המסננים' : language === 'ru' ? 'Сбросить фильтры' : 'Clear all filters',
              icon: <ListTodo size={16} />,
              onClick: () => clearFilters()
            },
            {
              label: language === 'he' ? 'פתח חיפוש מהיר' : language === 'ru' ? 'Быстрый поиск' : 'Open Search Palette',
              icon: <Sparkles size={16} />,
              onClick: () => useUIStore.getState().openCommandPalette()
            }
          ]
        };

      case 'calendar':
        return {
          greeting: language === 'he' ? 'איזה משימות מתוכננות לך היום?' : language === 'ru' ? 'Что запланировано в вашем расписании на сегодня?' : 'What is on your schedule today?',
          actions: [
            {
              label: language === 'he' ? 'תזמן משימה חדשה' : language === 'ru' ? 'Запланировать задачу' : 'Schedule a task',
              icon: <Calendar size={16} />,
              onClick: () => openAddItemModal(selectedNodeId, 'task')
            },
            {
              label: language === 'he' ? 'הצג תאריכי יעד דחופים' : language === 'ru' ? 'Срочные дедлайны' : 'Show urgent deadlines',
              icon: <AlertTriangle size={16} />,
              onClick: () => {
                clearFilters();
                setFilter('priority', 'urgent');
              }
            },
            {
              label: language === 'he' ? 'פתח תרשים גאנט' : language === 'ru' ? 'Перейти на Гант' : 'Open Timeline Gantt',
              icon: <Eye size={16} />,
              onClick: () => {
                setActiveView('gantt');
                navigate('/gantt');
              }
            }
          ]
        };

      case 'gantt':
        return {
          greeting: language === 'he' ? 'מהי אסטרטגיית לוחות הזמנים שלך היום?' : language === 'ru' ? 'Какова стратегия планирования на сегодня?' : 'What is the timeline strategy today?',
          actions: [
            {
              label: language === 'he' ? 'הוסף פרויקט חדש' : language === 'ru' ? 'Добавить проект' : 'Add new Project',
              icon: <Plus size={16} />,
              onClick: () => openAddItemModal(selectedNodeId, 'project')
            },
            {
              label: language === 'he' ? 'סנן נתיבים דחופים' : language === 'ru' ? 'Показать срочные пути' : 'Filter urgent timelines',
              icon: <AlertTriangle size={16} />,
              onClick: () => {
                clearFilters();
                setFilter('priority', 'urgent');
              }
            },
            {
              label: language === 'he' ? 'פתח לוח שנה' : language === 'ru' ? 'Открыть календарь' : 'Open Calendar View',
              icon: <Calendar size={16} />,
              onClick: () => {
                setActiveView('calendar');
                navigate('/calendar');
              }
            }
          ]
        };

      case 'admin':
        return {
          greeting: language === 'he' ? 'אילו הגדרות ונתונים תרצה לעדכן היום?' : language === 'ru' ? 'Какие настройки и списки вы обновите сегодня?' : 'What configurations will you update today?',
          actions: [
            {
              label: language === 'he' ? 'רשום לקוח חדש' : language === 'ru' ? 'Добавить клиента' : 'Onboard new Client',
              icon: <Plus size={16} />,
              onClick: () => {
                navigate('/admin?tab=clients');
                addClient({ name: 'New Client', company: 'New Company', value: 0 });
              },
              onDefine: () => setDefineFieldsType('clients')
            },
            {
              label: language === 'he' ? 'רשום ספק חדש' : language === 'ru' ? 'Добавить поставщика' : 'Onboard new Supplier',
              icon: <Plus size={16} />,
              onClick: () => {
                navigate('/admin?tab=suppliers');
                addSupplier({ name: 'New Supplier', company: 'New Logistics', status: 'pending' });
              },
              onDefine: () => setDefineFieldsType('suppliers')
            },
            {
              label: language === 'he' ? 'הוסף חבר צוות' : language === 'ru' ? 'Добавить сотрудника' : 'Add Team Member',
              icon: <Plus size={16} />,
              onClick: () => {
                navigate('/admin?tab=team');
                addMember('New Teammate', 'PM', '', '', 'CISEM Corp', []);
              },
              onDefine: () => setDefineFieldsType('team')
            }
          ]
        };

      case 'settings':
        return {
          greeting: language === 'he' ? 'איזה העדפות תרצה לכייל היום?' : language === 'ru' ? 'Какие параметры вы хотите настроить сегодня?' : 'What preferences would you like to adjust today?',
          actions: [
            {
              label: language === 'he' ? 'הפעל סיור הדרכה מחדש' : language === 'ru' ? 'Начать тур заново' : 'Restart Tour',
              icon: <HelpCircle size={16} />,
              onClick: () => {
                navigate('/dashboard');
                setActiveView('dashboard');
                // Restart onboarding tour
                localStorage.removeItem('dima-onboarding-done');
                window.location.reload();
              }
            },
            {
              label: language === 'he' ? 'אפס נתוני מערכת' : language === 'ru' ? 'Сбросить все данные' : 'Reset System Data',
              icon: <AlertTriangle size={16} />,
              onClick: () => {
                if (window.confirm(t.confirmReset || 'Are you sure?')) {
                  resetData();
                  showToast({
                    title: language === 'he' ? 'נתונים אופסו' : 'Data Reset',
                    message: language === 'he' ? 'המערכת שוחזרה לנתוני הדגמה' : 'All data restored to seed demo values.',
                    type: 'warning'
                  });
                }
              }
            },
            {
              label: language === 'he' ? 'כייל התראות' : language === 'ru' ? 'Настройка алертов' : 'Calibrate alerts',
              icon: <Settings size={16} />,
              onClick: () => {
                // Focus/scroll alerts calibration matrix
                const element = document.getElementById('notif-matrix');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }
            }
          ]
        };

      case 'collaboration':
        return {
          greeting: language === 'he' ? 'עם מי תרצה לשתף פעולה היום?' : language === 'ru' ? 'С кем вы хотите связаться сегодня?' : 'Who will you connect with today?',
          actions: [
            {
              label: language === 'he' ? 'הוסף חבר צוות' : language === 'ru' ? 'Добавить сотрудника' : 'Add Team Member',
              icon: <Plus size={16} />,
              onClick: () => {
                const element = document.getElementById('add-member-form');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }
            },
            {
              label: language === 'he' ? 'שלח הודעת ניסיון' : language === 'ru' ? 'Отправить тест WhatsApp' : 'Send WhatsApp Alert',
              icon: <MessageSquare size={16} />,
              onClick: () => {
                showToast({
                  title: 'WhatsApp Broadcast',
                  message: 'GreenAPI simulation alert sent to Dima / Yariv',
                  type: 'info'
                });
              }
            },
            {
              label: language === 'he' ? 'סקור לוג פעילויות' : language === 'ru' ? 'Лента активностей' : 'Review activity feeds',
              icon: <Eye size={16} />,
              onClick: () => {
                const element = document.getElementById('activity-feed');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }
            }
          ]
        };

      default:
        return defaultData;
    }
  }, [view, selectedNodeId, activeUserId, language, t, navigate, setActiveView, openAddItemModal, clearFilters, setFilter, addClient, addSupplier, addMember, resetData, showToast]);

  return (
    <div className="dashboard-welcome-banner glass-card" style={{ padding: '12px 18px', position: 'relative', marginBottom: 16, overflow: 'hidden' }}>
      {/* Visual background sparkles */}
      <div style={{ position: 'absolute', top: -20, right: -20, width: 140, height: 140, background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', pointerEvents: 'none' }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{t.hiUser ? t.hiUser.replace('{name}', tValue(currentUser?.name, language)) : `Hi ${tValue(currentUser?.name, language)},`}</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
              {config.greeting}
            </span>
          </h2>
        </div>
      </div>

      {/* Dynamic clickable common tasks blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginTop: 12 }}>
        {config.actions.map((act, index) => {
          const isDual = view === 'admin';
          return (
            <div 
              key={index}
              className={`welcome-card-block`}
              onClick={isDual ? undefined : act.onClick}
              style={{ 
                background: 'var(--surface-hover)', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius-sm)', 
                padding: '8px 12px', 
                cursor: isDual ? 'default' : 'pointer', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all var(--transition-base)',
                boxShadow: 'var(--shadow-xs)',
                gap: isDual ? 6 : 8
              }}
            >
              {isDual ? (
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 8, justifyContent: 'space-between', flexDirection: language === 'he' ? 'row-reverse' : 'row' }}>
                  {/* Primary click area */}
                  <div 
                    onClick={act.onClick}
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1, gap: 8 }}
                  >
                    <span style={{ display: 'flex', padding: '4px 6px', background: 'var(--accent-glow)', borderRadius: 'var(--radius-xs)', color: 'var(--accent)' }}>
                      {React.cloneElement(act.icon, { size: 12 })}
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                      {act.label}
                    </span>
                  </div>

                  {/* Secondary click: Define fields */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); act.onDefine(); }}
                    className="btn btn-ghost btn-sm"
                    style={{ 
                      fontSize: '0.7rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 4,
                      fontWeight: 500,
                      padding: '4px 8px',
                      background: 'var(--accent-subtle)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-xs)',
                      height: '24px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Settings size={10} className="text-[var(--accent)]" />
                    {language === 'he' ? 'הגדר' : language === 'ru' ? 'Настроить' : 'Define'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ display: 'flex', padding: '4px 6px', background: 'var(--accent-glow)', borderRadius: 'var(--radius-xs)', color: 'var(--accent)' }}>
                      {React.cloneElement(act.icon, { size: 12 })}
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {act.label}
                    </span>
                  </div>
                  <span className="arrow-icon" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {language === 'he' ? '←' : '→'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Define Fields Modal container */}
      <DefineFieldsModal 
        isOpen={!!defineFieldsType} 
        onClose={() => setDefineFieldsType(null)} 
        entityType={defineFieldsType} 
      />
    </div>
  );
}
