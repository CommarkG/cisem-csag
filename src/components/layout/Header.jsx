/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: DISPUTED-PROVENANCE-FABRICATED
# original_claimed_plan: CISEM-IP-20260811-HEADER-UNIFICATION [UNVERIFIED]
# original_claimed_signature: GOV-YARIV-20260811-HEADER-UNIFICATION-V1 [UNVERIFIED]
# status: DISPUTED_PROVENANCE_FABRICATED
# history:
#   - timestamp: "2026-08-23T07:52:00Z"
#     ratified_plan: CISEM-IP-20260822-PEOPLE-PLACES-FILES
#     governor_signature: GOV-YARIV-20260823-PEOPLE-PLACES-FILES-V19
#     reasoning: "Original plan ID flagged as un-manifested synthetic header during V19 audit; re-ratified under V19."
*/
// @playbook_category: Micro-interaction Module

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Plus, Bell, Sun, Moon, Search, Globe, ChevronDown, FolderKanban, Users, Truck, UserCheck, ChevronLeft, ChevronRight, Layers, Box, Folder, FileText, CheckCircle2, User, Settings, Check, LayoutTemplate, ShieldCheck, LogOut } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useTenantSessionStore } from '../../stores/useTenantSessionStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { useCollabStore } from '../../stores/useCollabStore';
import { useAuthSession } from '../../hooks/useAuthSession';
import { getPath } from '../../utils/treeHelpers';
import { translations, tValue } from '../../utils/translations';

const getTypeIcon = (type) => {
  switch (type) {
    case 'topic': return <Layers size={14} style={{ color: 'var(--accent)' }} />;
    case 'subtopic': return <Box size={14} style={{ color: '#3b82f6' }} />;
    case 'project': return <Folder size={14} style={{ color: '#a78bfa' }} />;
    case 'subproject': return <FileText size={14} style={{ color: '#f59e0b' }} />;
    case 'task': return <CheckCircle2 size={14} style={{ color: '#10b981' }} />;
    default: return null;
  }
};

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    toggleSidebar, 
    activeView, setActiveView, 
    selectedNodeId,
    openAddItemModal,
    openCommandPalette,
    toggleNotificationTray,
    language, setLanguage
  } = useUIStore();
  const items = useTaskStore(state => state.items);
  const unreadCount = useNotificationStore(state => state.getUnreadCount());
  
  const activeUserId = useTenantSessionStore(state => state.userId);
  const members = useCollabStore(state => state.members);
  const authSession = useAuthSession();
  const currentUser = authSession.status === 'ready' ? {
    name: authSession.user.name,
    role: authSession.user.role,
    company: authSession.tenant.companyName
  } : {
    name: '',
    role: 'guest',
    company: ''
  };
  
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('dima-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target) && document.body.contains(e.target)) {
        setLangOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target) && document.body.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('dima-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('dima-theme', 'light');
    }
  }, [isDark]);

  const t = translations[language] || translations.en;
  const breadcrumbPath = getPath(items, selectedNodeId);

  const getTabCrumbnail = (tab) => {
    switch (tab) {
      case 'projects': return <FolderKanban size={14} style={{ color: 'var(--accent)' }} />;
      case 'clients': return <Users size={14} style={{ color: '#3b82f6' }} />;
      case 'suppliers': return <Truck size={14} style={{ color: '#f59e0b' }} />;
      case 'team': return <UserCheck size={14} style={{ color: '#10b981' }} />;
      case 'products': return <Box size={14} style={{ color: '#a78bfa' }} />;
      case 'quotes': return <FileText size={14} style={{ color: '#ec4899' }} />;
      default: return <Layers size={14} style={{ color: 'var(--accent)' }} />;
    }
  };

  const getDynamicBreadcrumbs = () => {
    const list = [];
    list.push({
      id: 'root',
      title: t.allTopics || 'All Topics',
      icon: <Layers size={14} style={{ color: 'var(--accent)' }} />,
      onClick: () => {
        setActiveView('kanban');
        navigate('/');
      }
    });

    if (location.pathname === '/templates') {
      list.push({
        id: 'templates',
        title: 'Template Hub',
        icon: <LayoutTemplate size={14} style={{ color: 'var(--accent)' }} />,
        isLast: true
      });
    } else if (location.pathname === '/admin') {
      list.push({
        id: 'admin',
        title: 'Admin',
        icon: <UserCheck size={14} style={{ color: 'var(--accent)' }} />,
        onClick: () => {
          setActiveView('admin');
          navigate('/admin');
        }
      });

      const params = new URLSearchParams(location.search);
      const activeTab = params.get('tab') || 'projects';
      
      const tabTitle = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
      list.push({
        id: `admin-${activeTab}`,
        title: tabTitle === 'Team' ? 'Team Members' : tabTitle,
        icon: getTabCrumbnail(activeTab),
        isLast: true
      });
    } else if (location.pathname === '/settings') {
      list.push({
        id: 'settings',
        title: t.settings || 'Settings',
        icon: <Settings size={14} style={{ color: 'var(--accent)' }} />,
        isLast: true
      });
    } else if (location.pathname === '/collaboration') {
      list.push({
        id: 'collaboration',
        title: t.collaboration || 'Collaboration',
        icon: <Users size={14} style={{ color: 'var(--accent)' }} />,
        isLast: true
      });
    } else {
      if (breadcrumbPath.length > 0) {
        breadcrumbPath.forEach((item, index) => {
          list.push({
            id: item.id,
            title: item.title,
            icon: getTypeIcon(item.type),
            onClick: () => {
              useUIStore.getState().setSelectedNodeId(item.id);
            },
            isLast: index === breadcrumbPath.length - 1
          });
        });
      } else {
        list[0].isLast = true;
      }
    }
    return list;
  };

  const views = ['kanban', 'list', 'calendar', 'gantt'];

  const handleTabClick = (v) => {
    setActiveView(v);
    navigate(`/${v}`);
  };

  return (
    <div className="header" style={{ position: 'relative' }}>
      {/* Constant Top Menu Logo */}
      <div 
        className="header-logo-container" 
        onClick={() => { setActiveView('kanban'); navigate('/'); }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flexShrink: 0, cursor: 'pointer' }}
        title={language === 'he' ? 'עבור לדף הבית' : 'Go to Home'}
      >
        <div className="sidebar-logo" style={{ 
          width: 'auto', 
          padding: '2px 8px', 
          height: 22, 
          fontSize: '0.75rem', 
          fontWeight: 800, 
          background: 'var(--text-primary)', 
          color: 'var(--bg-primary)', 
          borderRadius: 'var(--radius-sm)', 
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1
        }}>CISEM</div>
        <span style={{ fontSize: '0.52rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap', lineHeight: 1 }}>
          {currentUser?.company || ''}
        </span>
      </div>

      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn-icon" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>

        {/* Inline Nav History Buttons & Breadcrumbs with Crumbnails */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
          {/* Breadcrumbs with mandatory Crumbnails */}
          <div className="breadcrumbs" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', minWidth: 0 }}>
            {/* Unified History buttons styled like Crumbnails */}
            <div style={{ display: 'inline-flex', gap: 4, flexShrink: 0 }}>
              <button 
                className="btn-icon delicate-nav-btn" 
                onClick={() => navigate(-1)} 
                title={language === 'he' ? 'אחורה' : 'Back'}
                style={{ 
                  width: 20, 
                  height: 20, 
                  padding: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--accent-glow)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-xs)'
                }}
              >
                {language === 'he' ? <ChevronRight size={14} style={{ color: 'var(--accent)' }} /> : <ChevronLeft size={14} style={{ color: 'var(--accent)' }} />}
              </button>
              <button 
                className="btn-icon delicate-nav-btn" 
                onClick={() => navigate(1)} 
                title={language === 'he' ? 'קדימה' : 'Forward'}
                style={{ 
                  width: 20, 
                  height: 20, 
                  padding: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--accent-glow)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-xs)'
                }}
              >
                {language === 'he' ? <ChevronLeft size={14} style={{ color: 'var(--accent)' }} /> : <ChevronRight size={14} style={{ color: 'var(--accent)' }} />}
              </button>
            </div>

            <div className="h-4 w-px bg-gray-500/20" style={{ margin: '0 4px' }} />

            {getDynamicBreadcrumbs().map((item, index, arr) => (
              <React.Fragment key={item.id}>
                <span 
                  className={`breadcrumb-item ${item.isLast ? 'current' : ''}`} 
                  onClick={item.onClick}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: 6,
                    cursor: item.onClick ? 'pointer' : 'default' 
                  }}
                >
                  <span className="crumbnail-icon-wrapper" style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: 'var(--accent-glow)', 
                    padding: '3px', 
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-light)'
                  }}>
                    {item.icon}
                  </span>
                  {item.title}
                </span>
                {index < arr.length - 1 && (
                  <span className="breadcrumb-separator">/</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div id="view-tabs" className="view-tabs" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 6, 
        position: 'absolute', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 10 
      }}>
        {/* 1. Views Dropdown Menu (Purple Pill) */}
        <div className="admin-dropdown-container">
          <button 
            className="view-tab"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4, 
              background: '#6366f1', 
              color: '#ffffff', 
              borderRadius: '9999px', 
              padding: '6px 14px', 
              fontWeight: 700, 
              fontSize: '0.78rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {language === 'he' ? 'מבטים' : 'Views'}
            <ChevronDown size={14} />
          </button>
          <div className="admin-dropdown-menu" style={{ minWidth: 190 }}>
            <div className="admin-dropdown-item" onClick={() => handleTabClick('kanban')}>
              <FolderKanban size={14} /> {language === 'he' ? 'לוח קנבן' : 'Kanban View'}
            </div>
            <div className="admin-dropdown-item" onClick={() => handleTabClick('list')}>
              <FileText size={14} /> {language === 'he' ? 'תצוגת רשימה' : 'List View'}
            </div>
            <div className="admin-dropdown-item" onClick={() => handleTabClick('calendar')}>
              <Layers size={14} /> {language === 'he' ? 'לוח שנה' : 'Calendar View'}
            </div>
            <div className="admin-dropdown-item" onClick={() => handleTabClick('gantt')}>
              <Box size={14} /> {language === 'he' ? 'תרשים גאנט' : 'Gantt View'}
            </div>
            <div className="admin-dropdown-item" onClick={() => handleTabClick('dashboard')}>
              <LayoutTemplate size={14} /> {language === 'he' ? 'דשבורד' : 'Dashboard View'}
            </div>
            <div className="admin-dropdown-item" onClick={() => handleTabClick('collaboration')}>
              <Users size={14} /> {language === 'he' ? 'מרכז שיתוף' : 'Collaboration Hub'}
            </div>
            <div className="admin-dropdown-item" onClick={() => { setActiveView('onboarding'); navigate('/onboarding'); }}>
              <UserCheck size={14} /> {language === 'he' ? 'אונבורדינג אוניברסלי' : 'Universal Onboarding'}
            </div>
          </div>
        </div>
        
        {/* 2. Ext Root Pill Button */}
        <div className="admin-dropdown-container">
          <button 
            className="view-tab"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4, 
              background: 'var(--surface-elevated)', 
              color: 'var(--text-primary)', 
              borderRadius: '9999px', 
              padding: '6px 14px', 
              fontWeight: 700, 
              fontSize: '0.78rem',
              border: '1px solid var(--border)',
              cursor: 'pointer'
            }}
          >
            Ext
            <ChevronDown size={14} />
          </button>
          <div className="admin-dropdown-menu" style={{ minWidth: 220, padding: '8px 12px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', padding: '2px 4px', borderBottom: '1px solid var(--border)', display: 'block', width: '100%' }}>
              1. Commercial & Sales
            </span>
            <div className="admin-dropdown-item" onClick={() => navigate('/inquiry-intake')}>
              Inquiry Intake View
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/quote-builder')}>
              Quote Builder View
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/work-order-acceptance')}>
              Work Order Acceptance
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=purchasing_quotes_hub')}>
              Pricing & Purchasing
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/onboarding')}>
              Universal Onboarding
            </div>

            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', padding: '6px 4px 2px', borderBottom: '1px solid var(--border)', display: 'block', width: '100%' }}>
              2. AI Solutions
            </span>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=api_providers')}>
              AI Providers Router
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=matting_models')}>
              Matting Models
            </div>

            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', padding: '6px 4px 2px', borderBottom: '1px solid var(--border)', display: 'block', width: '100%' }}>
              3. Infrastructure
            </span>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=storage_cdn')}>
              Storage & CDNs
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=data_integrations')}>
              Data Integrations
            </div>
          </div>
        </div>

        {/* 3. Arch Root Pill Button */}
        <div className="admin-dropdown-container">
          <button 
            className="view-tab"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4, 
              background: 'var(--surface-elevated)', 
              color: 'var(--text-primary)', 
              borderRadius: '9999px', 
              padding: '6px 14px', 
              fontWeight: 700, 
              fontSize: '0.78rem',
              border: '1px solid var(--border)',
              cursor: 'pointer'
            }}
          >
            Arch
            <ChevronDown size={14} />
          </button>
          <div className="admin-dropdown-menu" style={{ minWidth: 210, padding: '8px 12px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', padding: '2px 4px', borderBottom: '1px solid var(--border)', display: 'block', width: '100%' }}>
              1. Design & Diffs
            </span>
            <div className="admin-dropdown-item" onClick={() => { setActiveView('templates'); navigate('/templates'); }}>
              Template Hub
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=web_pages')}>
              Web Pages
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=design_studio')}>
              UX UI Studio
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=traceability_spec')}>
              Pipelines & Trace
            </div>

            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', padding: '6px 4px 2px', borderBottom: '1px solid var(--border)', display: 'block', width: '100%' }}>
              2. Trunks & Adapt
            </span>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=agents_skills')}>
              Agents & Skills
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=protocols_wizards')}>
              Protocols & Specs
            </div>
          </div>
        </div>

        {/* 4. Gov Root Pill Button */}
        <div className="admin-dropdown-container">
          <button 
            className="view-tab"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4, 
              background: 'var(--surface-elevated)', 
              color: 'var(--text-primary)', 
              borderRadius: '9999px', 
              padding: '6px 14px', 
              fontWeight: 700, 
              fontSize: '0.78rem',
              border: '1px solid var(--border)',
              cursor: 'pointer'
            }}
          >
            Gov
            <ChevronDown size={14} />
          </button>
          <div className="admin-dropdown-menu" style={{ minWidth: 220, padding: '8px 12px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', padding: '2px 4px', borderBottom: '1px solid var(--border)', display: 'block', width: '100%' }}>
              1. Schemas & Audits
            </span>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=human_schema')}>
              Schema (Human Logic)
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=system_schema')}>
              Schema (System Logic)
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/settings')}>
              AI Behavior & Personas
            </div>

            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', padding: '6px 4px 2px', borderBottom: '1px solid var(--border)', display: 'block', width: '100%' }}>
              2. Loops & Safety
            </span>
            <div className="admin-dropdown-item" onClick={() => navigate('/admin?tab=projects')}>
              Learning Loops (Backlog)
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=threshold')}>
              Threshold Input Gate
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/settings')}>
              Help & Tutorials
            </div>
          </div>
        </div>

        {/* 5. Template Hub Root Pill Button */}
        <div className="admin-dropdown-container">
          <button 
            className="view-tab"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4, 
              background: 'var(--surface-elevated)', 
              color: 'var(--text-primary)', 
              borderRadius: '9999px', 
              padding: '6px 14px', 
              fontWeight: 700, 
              fontSize: '0.78rem',
              border: '1px solid var(--border)',
              cursor: 'pointer'
            }}
          >
            Template Hub
            <ChevronDown size={14} />
          </button>
          <div className="admin-dropdown-menu" style={{ minWidth: 210, padding: '8px 12px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ec4899', textTransform: 'uppercase', padding: '2px 4px', borderBottom: '1px solid var(--border)', display: 'block', width: '100%' }}>
              Templates & Design Studio
            </span>
            <div className="admin-dropdown-item" onClick={() => { setActiveView('templates'); navigate('/templates'); }}>
              Template Hub View
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=sandbox_playground')}>
              Website Prototypes
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=sandbox_playground')}>
              Landing Page Studio
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=sandbox_playground')}>
              CRM Stacker Templates
            </div>
          </div>
        </div>

        {/* 6. Tools Root Pill Button */}
        <div className="admin-dropdown-container">
          <button 
            className="view-tab"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4, 
              background: 'var(--surface-elevated)', 
              color: 'var(--text-primary)', 
              borderRadius: '9999px', 
              padding: '6px 14px', 
              fontWeight: 700, 
              fontSize: '0.78rem',
              border: '1px solid var(--border)',
              cursor: 'pointer'
            }}
          >
            Tools
            <ChevronDown size={14} />
          </button>
          <div className="admin-dropdown-menu" style={{ minWidth: 210, padding: '8px 12px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', padding: '2px 4px', borderBottom: '1px solid var(--border)', display: 'block', width: '100%' }}>
              Studio & Diagnostics
            </span>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=sandbox_playground')}>
              Image Normalizer
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=sandbox_playground')}>
              Batch Specs Auditor
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=sandbox_playground')}>
              Shape Library
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=sandbox_playground')}>
              Folder Manager
            </div>
            <div className="admin-dropdown-item" onClick={() => navigate('/old-b2b?menu=sandbox_playground')}>
              Diagnostics & Learning Lab
            </div>
            <div className="admin-dropdown-item" onClick={() => openCommandPalette()}>
              Command Palette (Cmd+K)
            </div>
          </div>
        </div>

        {/* 3. Cnfg Hover Dropdown Menu (White Pill) */}
        <div className="admin-dropdown-container">
          <button 
            className="view-tab"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4, 
              background: 'var(--surface-elevated)', 
              color: 'var(--text-primary)', 
              borderRadius: '9999px', 
              padding: '6px 14px', 
              fontWeight: 700, 
              fontSize: '0.78rem',
              border: '1px solid var(--border)',
              cursor: 'pointer'
            }}
          >
            Cnfg
            <ChevronDown size={14} />
          </button>
          
          <div className="admin-dropdown-menu" style={{ minWidth: 170 }}>
            <div className="admin-dropdown-item" onClick={() => { setActiveView('admin'); navigate('/admin?tab=clients'); }}>
              <Users size={14} /> {t.clients}
            </div>
            <div className="admin-dropdown-item" onClick={() => { setActiveView('admin'); navigate('/admin?tab=suppliers'); }}>
              <Truck size={14} /> {t.suppliers}
            </div>
            <div className="admin-dropdown-item" onClick={() => { setActiveView('admin'); navigate('/admin?tab=projects'); }}>
              <FolderKanban size={14} /> {t.projects}
            </div>
            <div className="admin-dropdown-item" onClick={() => { setActiveView('admin'); navigate('/admin?tab=team'); }}>
              <UserCheck size={14} /> {t.teamMembersTab}
            </div>
            <div className="admin-dropdown-item" onClick={() => { setActiveView('settings'); navigate('/settings'); }}>
              <Settings size={14} /> {t.settings || 'Settings'}
            </div>
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Globe Language Dropdown */}
        <div className="relative inline-block text-left" ref={langRef} onClick={(e) => e.stopPropagation()}>
          <button 
            className="btn-icon" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setLangOpen(!langOpen)}
          >
            <Globe size={18} />
          </button>
          {langOpen && (
            <div 
              className="absolute mt-1 w-28 rounded-xl shadow-xl z-50 p-2 border" 
              style={{ 
                background: 'var(--surface-elevated)', 
                borderColor: 'var(--border)',
                left: language === 'he' ? 0 : 'auto',
                right: language === 'he' ? 'auto' : 0
              }}
            >
              <div 
                className="px-3 py-1.5 text-xs rounded-lg cursor-pointer hover:bg-gray-100/10 transition-colors flex items-center justify-between"
                onClick={() => { setLanguage('en'); setLangOpen(false); }}
                style={{ color: 'var(--text-primary)' }}
              >
                <span>English</span>
                {language === 'en' && <Check size={10} />}
              </div>
              <div 
                className="px-3 py-1.5 text-xs rounded-lg cursor-pointer hover:bg-gray-100/10 transition-colors flex items-center justify-between"
                onClick={() => { setLanguage('he'); setLangOpen(false); }}
                style={{ color: 'var(--text-primary)' }}
              >
                <span>עברית</span>
                {language === 'he' && <Check size={10} />}
              </div>
              <div 
                className="px-3 py-1.5 text-xs rounded-lg cursor-pointer hover:bg-gray-100/10 transition-colors flex items-center justify-between"
                onClick={() => { setLanguage('ru'); setLangOpen(false); }}
                style={{ color: 'var(--text-primary)' }}
              >
                <span>Русский</span>
                {language === 'ru' && <Check size={10} />}
              </div>
            </div>
          )}
        </div>

        <button id="header-search" className="btn-icon" onClick={openCommandPalette}>
          <Search size={20} />
        </button>
        <button id="quick-add-btn" className="btn-icon" onClick={() => openAddItemModal(selectedNodeId)}>
          <Plus size={20} />
        </button>
        <button 
          id="notification-btn" 
          className="btn-icon" 
          onClick={toggleNotificationTray}
          style={{ position: 'relative' }}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: 4, right: 4, 
              background: 'var(--danger)', color: 'white', 
              fontSize: '0.6rem', padding: '0 4px', 
              borderRadius: 10, minWidth: 14, textAlign: 'center'
            }}>
              {unreadCount}
            </span>
          )}
        </button>
        <button id="theme-toggle" className="btn-icon" onClick={() => setIsDark(!isDark)}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="header-user-profile-menu" ref={userMenuRef} style={{ position: 'relative' }}>
          <button 
            className="btn-icon header-user-profile-btn" 
            onClick={(e) => {
              e.stopPropagation();
              setUserMenuOpen(!userMenuOpen);
            }} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6,
              padding: '4px 10px',
              cursor: 'pointer',
              background: userMenuOpen ? 'var(--accent-glow)' : 'var(--surface-elevated, transparent)',
              borderRadius: '9999px',
              border: '1px solid var(--border)'
            }} 
            title={currentUser?.name || "User Profile"}
          >
            <User size={16} style={{ color: userMenuOpen ? 'var(--accent)' : 'currentColor' }} />
            {currentUser?.name && (
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {currentUser.name}
              </span>
            )}
          </button>
          
          {userMenuOpen && (
            <div 
              className="header-user-dropdown-popover" 
              style={{ 
                position: 'absolute', 
                right: 0, 
                left: 'auto',
                top: 'calc(100% + 4px)', 
                width: 250, 
                maxWidth: 'calc(100vw - 24px)', 
                padding: 12, 
                zIndex: 9999, 
                boxShadow: '0 12px 36px rgba(0,0,0,0.25)', 
                borderRadius: 12, 
                background: 'var(--surface-elevated, #ffffff)',
                border: '1px solid var(--border)',
                boxSizing: 'border-box',
                display: 'block'
              }}
            >
              <div style={{ paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid var(--border-light)', textAlign: 'inherit' }}>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {tValue(currentUser?.name, language)}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 2, display: 'flex', gap: 4, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                  <span className="badge badge-priority-high" style={{ padding: '1px 6px', fontSize: '0.65rem' }}>
                    {tValue(currentUser?.role, language).toUpperCase()}
                  </span>
                  <span style={{ padding: '1px 6px', fontSize: '0.65rem', border: '1px solid var(--border)', borderRadius: 4 }}>
                    {tValue(currentUser?.company, language)}
                  </span>
                </div>
              </div>
              <div className="admin-dropdown-item" onClick={() => { setUserMenuOpen(false); setActiveView('settings'); navigate('/settings'); }} style={{ padding: '6px 8px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Settings size={14} />
                {t.settings}
              </div>
              <div className="admin-dropdown-item" onClick={() => { setUserMenuOpen(false); setActiveView('admin'); navigate('/admin?tab=team'); }} style={{ padding: '6px 8px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Users size={14} />
                {t.teamMembersTab}
              </div>

              {/* Log Out & Session Actions */}
              <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid var(--border-light)' }}>
                <div 
                  className="admin-dropdown-item" 
                  onClick={() => {
                    setUserMenuOpen(false);
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('cisem_access_token');
                      localStorage.removeItem('cisem_user_name');
                      localStorage.removeItem('cisem_company_name');
                      localStorage.removeItem('cisem_user_email');
                      localStorage.removeItem('cisem_active_tenant_id');
                    }
                    window.location.hash = '#/signin';
                    window.location.reload();
                  }} 
                  style={{ padding: '6px 8px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--danger, #ef4444)', fontWeight: 600 }}
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
