import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Columns3, List, Calendar, BarChart3, 
  Settings, Users, ChevronRight, Plus, 
  Folder, FileText, CheckCircle2, Box, Layers, Sparkles
} from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { buildTree } from '../../utils/treeHelpers';
import { translations, tValue } from '../../utils/translations';

const getTypeIcon = (type) => {
  switch(type) {
    case 'topic': return <Layers className="item-icon" size={16} />;
    case 'subtopic': return <Box className="item-icon" size={16} />;
    case 'project': return <Folder className="item-icon" size={16} />;
    case 'subproject': return <FileText className="item-icon" size={16} />;
    case 'task': return <CheckCircle2 className="item-icon" size={16} />;
    default: return <CheckCircle2 className="item-icon" size={16} />;
  }
};

const TreeNode = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedNodeId, setSelectedNodeId, openAddItemModal, language } = useUIStore();
  
  const isSelected = selectedNodeId === node.id;
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = () => {
    setSelectedNodeId(node.id);
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    openAddItemModal(node.id);
  };

  return (
    <div className="tree-node">
      <div 
        className={`tree-node-header ${isSelected ? 'selected' : ''}`}
        onClick={handleSelect}
      >
        <div 
          className={`tree-toggle ${isOpen ? 'open' : ''}`} 
          onClick={hasChildren ? handleToggle : undefined}
          style={{ visibility: hasChildren ? 'visible' : 'hidden' }}
        >
          <ChevronRight size={14} />
        </div>
        {getTypeIcon(node.type)}
        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {tValue(node.title, language)}
        </span>
        {node.type !== 'task' && isSelected && (
          <button className="btn-icon" style={{ width: 20, height: 20, padding: 0 }} onClick={handleAdd}>
            <Plus size={14} />
          </button>
        )}
      </div>
      {isOpen && hasChildren && (
        <div className="tree-node-children">
          {node.children.map(child => <TreeNode key={child.id} node={child} />)}
        </div>
      )}
    </div>
  );
};

export default function Sidebar() {
  const navigate = useNavigate();
  const { 
    activeView, setActiveView, 
    sidebarCollapsed, openAddItemModal,
    language
  } = useUIStore();
  const items = useTaskStore(state => state.items);
  
  const tree = buildTree(items, null);
  const t = translations[language] || translations.en;

  const handleViewClick = (view, path) => {
    setActiveView(view);
    navigate(path);
  };

  const views = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard, path: '/dashboard' },
    { id: 'onboarding', label: language === 'he' ? 'קליטה ארגונית' : 'Onboarding', icon: Sparkles, path: '/onboarding' },
    { id: 'kanban', label: t.kanban, icon: Columns3, path: '/kanban' },
    { id: 'list', label: t.list, icon: List, path: '/list' },
    { id: 'calendar', label: t.calendar, icon: Calendar, path: '/calendar' },
    { id: 'gantt', label: t.gantt, icon: BarChart3, path: '/gantt' },
  ];

  return (
    <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-nav" style={{ paddingTop: 12 }}>
        {!sidebarCollapsed && <div className="sidebar-section-label">{t.views}</div>}
        {views.map(v => (
          <div 
            key={v.id} 
            className={`sidebar-item ${activeView === v.id ? 'active' : ''}`}
            onClick={() => handleViewClick(v.id, v.path)}
          >
            <v.icon className="item-icon" />
            {!sidebarCollapsed && <span>{v.label}</span>}
          </div>
        ))}

        {!sidebarCollapsed && (
          <>
            <div className="sidebar-section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{t.projects}</span>
              <button 
                className="btn-icon" 
                style={{ padding: 2 }} 
                onClick={() => openAddItemModal(null)}
                title={language === 'he' ? 'נושא חדש / פרויקט חדש' : 'New Topic / Project'}
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="tree-container">
              {tree.map(node => <TreeNode key={node.id} node={node} />)}
            </div>
          </>
        )}
      </div>

      <div className="sidebar-nav" style={{ flex: 'none', borderTop: '1px solid var(--border)' }}>
        <div 
          className={`sidebar-item ${activeView === 'settings' ? 'active' : ''}`}
          onClick={() => handleViewClick('settings', '/settings')}
        >
          <Settings className="item-icon" />
          {!sidebarCollapsed && <span>{t.settings}</span>}
        </div>
        <div 
          className={`sidebar-item ${activeView === 'collaboration' ? 'active' : ''}`}
          onClick={() => handleViewClick('collaboration', '/collaboration')}
        >
          <Users className="item-icon" />
          {!sidebarCollapsed && <span>{t.collaboration}</span>}
        </div>
      </div>
    </div>
  );
}
