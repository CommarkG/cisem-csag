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
import { Menu, Plus, Bell, Sun, Moon, Search, Globe, ChevronDown, FolderKanban, Users, Truck, UserCheck, ChevronLeft, ChevronRight, Layers, Box, Folder, FileText, CheckCircle2, User, Settings, Check, LayoutTemplate, ShieldCheck } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useTenantSessionStore } from '../../stores/useTenantSessionStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { useCollabStore } from '../../stores/useCollabStore';
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
  const simulatedRole = useTenantSessionStore(state => state.simulatedRole);
  const setSimulatedRole = useTenantSessionStore(state => state.setSimulatedRole);
  const items = useTaskStore(state => state.items);
  const unreadCount = useNotificationStore(state => state.getUnreadCount());
  
  const activeUserId = useTenantSessionStore(state => state.userId);
  const members = useCollabStore(state => state.members);
  
  // STAGE 1: Live authenticated session profile resolution
  const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('cisem_access_token') : null;
  const sessionName = typeof window !== 'undefined' ? localStorage.getItem('cisem_user_name') : null;
  const sessionCompany = typeof window !== 'undefined' ? localStorage.getItem('cisem_company_name') : null;

  const currentUser = sessionToken ? {
    name: sessionName || 'Authenticated User',
    role: 'account_admin',
    company: sessionCompany || 'Active Tenant'
  } : {
    name: 'Guest User',
    role: 'viewer',
    company: 'Public Workspace'
  };
  
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('dima-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target) && document.body.contains(e.target)) {
        setLangOpen(false);
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
          workspace
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
        gap: 4, 
        position: 'absolute', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 10 
      }}>
        {/* Views Dropdown Menu */}
        <div className="admin-dropdown-container">
          <button 
            className={`view-tab ${views.includes(activeView) ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {language === 'he' ? 'מבטים' : 'Views'}
            <ChevronDown size={14} />
          </button>
          <div className="admin-dropdown-menu">
            {views.map(v => (
              <div 
                key={v}
                className={`admin-dropdown-item ${activeView === v ? 'selected' : ''}`}
                onClick={() => handleTabClick(v)}
                style={{ cursor: 'pointer' }}
              >
                {t[v] || v}
              </div>
            ))}
          </div>
        </div>
        
        {/* Ext/Arch/Gov/Tools Dropdown Menu */}
        <div className="admin-dropdown-container">
          <button 
            className="view-tab"
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            Ext/Arch/Gov/Tools
            <ChevronDown size={14} />
          </button>
          <div className="admin-dropdown-menu" style={{ minWidth: 130 }}>
            <div 
              className="admin-dropdown-item" 
              onClick={() => navigate('/old-b2b?menu=purchasing_quotes_hub')} 
              style={{ cursor: 'pointer', textAlign: 'inherit' }}
            >
              <FileText size={14} /> Ext
            </div>
            <div 
              className="admin-dropdown-item" 
              onClick={() => navigate('/old-b2b?menu=system_schema')} 
              style={{ cursor: 'pointer', textAlign: 'inherit' }}
            >
              <Layers size={14} /> Arch
            </div>
            <div 
              className="admin-dropdown-item" 
              onClick={() => navigate('/old-b2b?menu=threshold')} 
              style={{ cursor: 'pointer', textAlign: 'inherit' }}
            >
              <ShieldCheck size={14} /> Gov
            </div>
            <div 
              className="admin-dropdown-item" 
              onClick={() => { setActiveView('templates'); navigate('/templates'); }} 
              style={{ cursor: 'pointer', textAlign: 'inherit' }}
            >
              <LayoutTemplate size={14} /> Template Hub
            </div>
            <div 
              className="admin-dropdown-item" 
              onClick={() => openCommandPalette()} 
              style={{ cursor: 'pointer', textAlign: 'inherit' }}
            >
              <Settings size={14} /> Tools
            </div>
          </div>
        </div>

        {/* Cnfg Hover Dropdown Menu */}
        <div className="admin-dropdown-container">
          <button 
            className={`view-tab ${activeView === 'admin' ? 'active' : ''}`}
            onClick={() => {
              setActiveView('admin');
              navigate('/admin?tab=clients');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            Cnfg
            <ChevronDown size={14} />
          </button>
          
          <div className="admin-dropdown-menu">
            <div className="admin-dropdown-item" onClick={() => { setActiveView('admin'); navigate('/admin?tab=clients'); }}>
              <Users size={14} />
              {t.clients}
            </div>
            <div className="admin-dropdown-item" onClick={() => { setActiveView('admin'); navigate('/admin?tab=suppliers'); }}>
              <Truck size={14} />
              {t.suppliers}
            </div>
            <div className="admin-dropdown-item" onClick={() => { setActiveView('admin'); navigate('/admin?tab=projects'); }}>
              <FolderKanban size={14} />
              {t.projects}
            </div>
            <div className="admin-dropdown-item" onClick={() => { setActiveView('admin'); navigate('/admin?tab=team'); }}>
              <UserCheck size={14} />
              {t.teamMembersTab}
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

        <div className="admin-dropdown-container header-user-profile-menu" style={{ position: 'relative' }}>
          <button className="btn-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={currentUser?.name || "User Profile"}>
            <User size={20} />
          </button>
          <div 
            className="admin-dropdown-menu header-user-dropdown-popover" 
            style={{ 
              position: 'absolute', 
              right: 0, 
              left: 'auto',
              top: 'calc(100% + 6px)', 
              width: 250, 
              maxWidth: 'calc(100vw - 24px)', 
              padding: 12, 
              zIndex: 1000, 
              boxShadow: '0 8px 30px rgba(0,0,0,0.22)', 
              borderRadius: 12, 
              background: 'var(--surface-elevated, #ffffff)',
              border: '1px solid var(--border)',
              boxSizing: 'border-box'
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
            <div className="admin-dropdown-item" onClick={() => { setActiveView('settings'); navigate('/settings'); }} style={{ padding: '6px 8px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Settings size={14} />
              {t.settings}
            </div>
            <div className="admin-dropdown-item" onClick={() => { setActiveView('admin'); navigate('/admin?tab=team'); }} style={{ padding: '6px 8px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Users size={14} />
              {t.teamMembersTab}
            </div>
            {/* Role impersonation sandbox */}
            <div style={{ padding: '8px 8px 4px', marginTop: 6, borderTop: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 5, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5 }}>
                <ShieldCheck size={10} /> Simulate Role
              </div>
              {['platform_admin', 'manager', 'buyer', 'partner', 'guest'].map((r) => (
                <div key={r}
                  className="admin-dropdown-item"
                  onClick={() => setSimulatedRole(r)}
                  style={{ padding: '5px 8px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                    background: simulatedRole === r ? 'var(--accent-glow)' : 'transparent',
                    color: simulatedRole === r ? 'var(--accent)' : 'var(--text-secondary)' }}
                >
                  {simulatedRole === r ? <Check size={11} /> : <span style={{ width: 11, display: 'inline-block' }} />}
                  {r.replace('_', ' ')}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
