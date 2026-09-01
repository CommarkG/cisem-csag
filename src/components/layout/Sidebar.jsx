import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Inbox, FileText, CheckCircle2, BookOpen, Users, Truck, Shield,
  Settings, ChevronRight, Plus, Folder, Layers, Box
} from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { buildTree } from '../../utils/treeHelpers';
import { translations, tValue } from '../../utils/translations';
import { supabase } from '../../lib/supabaseClient';

const CANONICAL_PIPELINE_MENU = [
  { id: '1', title_en: 'Inquiries', title_he: 'פניות והזמנות', route: '#/inquiry-intake', icon: 'inbox', display_order: 1 },
  { id: '2', title_en: 'Quote Builder', title_he: 'מחולל הצעות מחיר', route: '#/quote-builder', icon: 'file-text', display_order: 2 },
  { id: '3', title_en: 'Order Acceptance', title_he: 'אישור והזמנות עבודה', route: '#/work-order-acceptance', icon: 'check-circle', display_order: 3 },
  { id: '4', title_en: 'Catalog', title_he: 'קטלוג מוצרים', route: '#/catalogue', icon: 'book-open', display_order: 4 },
  { id: '5', title_en: 'Clients & Counterparties', title_he: 'לקוחות וצדדים שכנגד', route: '#/clients', icon: 'users', display_order: 5 },
  { id: '6', title_en: 'Suppliers', title_he: 'ספקים וספקים מורשים', route: '#/suppliers', icon: 'truck', display_order: 6 },
  { id: '7', title_en: 'Team & Access', title_he: 'צוות והרשאות', route: '#/admin', icon: 'shield', display_order: 7 }
];

const getMenuIcon = (iconName) => {
  switch (iconName) {
    case 'inbox': return <Inbox className="item-icon" size={18} />;
    case 'file-text': return <FileText className="item-icon" size={18} />;
    case 'check-circle': return <CheckCircle2 className="item-icon" size={18} />;
    case 'book-open': return <BookOpen className="item-icon" size={18} />;
    case 'users': return <Users className="item-icon" size={18} />;
    case 'truck': return <Truck className="item-icon" size={18} />;
    case 'shield': return <Shield className="item-icon" size={18} />;
    default: return <FileText className="item-icon" size={18} />;
  }
};

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
  const location = useLocation();
  const { 
    activeView, setActiveView, 
    sidebarCollapsed, openAddItemModal,
    language
  } = useUIStore();
  const items = useTaskStore(state => state.items);
  
  const [navItems, setNavItems] = useState(CANONICAL_PIPELINE_MENU);
  const tree = buildTree(items, null);
  const t = translations[language] || translations.en;

  useEffect(() => {
    async function fetchDatabaseNavigation() {
      try {
        const { data, error } = await supabase
          .from('navigation_menu_items')
          .select('*')
          .order('display_order', { ascending: true });

        if (data && data.length > 0) {
          setNavItems(data);
        }
      } catch (err) {
        console.warn('Using canonical pipeline fallback for navigation sidebar:', err);
      }
    }
    fetchDatabaseNavigation();
  }, []);

  const handleNavClick = (item) => {
    const cleanPath = item.route.replace(/^#/, '') || '/';
    const viewName = cleanPath.replace(/^\//, '');
    setActiveView(viewName);
    navigate(cleanPath);
  };

  return (
    <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-nav" style={{ paddingTop: 12 }}>
        {!sidebarCollapsed && <div className="sidebar-section-label">{language === 'he' ? 'ציר פעילות מסחרי' : 'Commercial Pipeline'}</div>}
        {navItems.map(item => {
          const cleanPath = item.route.replace(/^#/, '') || '/';
          const isActive = location.pathname === cleanPath || activeView === cleanPath.replace(/^\//, '');
          const label = language === 'he' ? (item.title_he || item.title_en) : (item.title_en || item.title_he);

          return (
            <div 
              key={item.id || item.route} 
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item)}
              title={label}
            >
              {getMenuIcon(item.icon)}
              {!sidebarCollapsed && <span>{label}</span>}
            </div>
          );
        })}

        {!sidebarCollapsed && (
          <>
            <div className="sidebar-section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
              <span>{t.projects || 'Reference Context'}</span>
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
          onClick={() => { setActiveView('settings'); navigate('/settings'); }}
        >
          <Settings className="item-icon" />
          {!sidebarCollapsed && <span>{t.settings}</span>}
        </div>
      </div>
    </div>
  );
}
