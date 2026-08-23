/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: DISPUTED-PROVENANCE-FABRICATED
# original_claimed_plan: CISEM-IP-20260811-FRONTEND-ALIGNMENT-AND-LAYOUT-FIX [UNVERIFIED]
# original_claimed_signature: GOV-YARIV-20260811-FRONTEND-ALIGNMENT-V1 [UNVERIFIED]
# status: DISPUTED_PROVENANCE_FABRICATED
# history:
#   - timestamp: "2026-08-23T07:52:00Z"
#     ratified_plan: CISEM-IP-20260822-PEOPLE-PLACES-FILES
#     governor_signature: GOV-YARIV-20260823-PEOPLE-PLACES-FILES-V19
#     reasoning: "Original plan ID flagged as un-manifested synthetic header during V19 audit; re-ratified under V19."
*/
// @playbook_category: Bento Page Layout Recipe
import React, { useState, useRef, useEffect } from 'react';
import { useTaskStore } from '../../stores/useTaskStore';
import { useUIStore } from '../../stores/useUIStore';
import PageGreetingBanner from '../shared/PageGreetingBanner';
import { useCollabStore } from '../../stores/useCollabStore';
import { getChildren } from '../../utils/treeHelpers';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../../utils/seedData';
import { 
  ChevronRight, 
  ChevronDown, 
  CalendarIcon, 
  AlertCircle, 
  Eye, 
  Printer, 
  Mail, 
  Phone, 
  MessageSquare, 
  Copy, 
  Edit2, 
  Trash2, 
  Plus, 
  Settings, 
  Check, 
  FileSpreadsheet, 
  Download, 
  User, 
  Tag, 
  DollarSign, 
  MoreHorizontal,
  BookmarkPlus,
  Send,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { translations, tValue } from '../../utils/translations';

// --- Multi-Comment Popup Component ---
const CommentsPopup = ({ item, onClose, t }) => {
  const { addComment } = useTaskStore();
  const [newComment, setNewComment] = useState('');
  const popupRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target) && document.body.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [onClose]);

  const handleSend = () => {
    if (!newComment.trim()) return;
    addComment(item.id, newComment, 'Operator');
    setNewComment('');
  };

  return (
    <div 
      ref={popupRef}
      className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl p-4 z-50 glass-card"
      style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', minHeight: '220px' }}
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-3 pb-2 border-b" style={{ borderColor: 'var(--border-light)' }}>
        <h4 className="text-sm font-semibold flex items-center gap-1">
          <MessageSquare size={14} /> {t.comments || 'Comments'} ({item.comments?.length || 0})
        </h4>
        <button onClick={onClose} className="text-muted hover:text-red-400 p-1">
          <X size={14} />
        </button>
      </div>

      <div className="overflow-y-auto max-h-40 flex flex-col gap-2 mb-3 pr-1">
        {item.comments && item.comments.length > 0 ? (
          item.comments.map((c, i) => (
            <div key={i} className="text-xs p-2 rounded-lg" style={{ background: 'var(--surface-hover)' }}>
              <div className="flex justify-between font-semibold text-muted mb-1">
                <span>{c.author}</span>
                <span>{c.timestamp ? format(new Date(c.timestamp), 'MMM d, HH:mm') : ''}</span>
              </div>
              <p className="text-sm text-foreground">{c.text}</p>
            </div>
          ))
        ) : (
          <div className="text-xs text-muted text-center py-6">{t.no_comments || 'No comments yet'}</div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input 
          type="text" 
          value={newComment} 
          onChange={e => setNewComment(e.target.value)} 
          placeholder={t.add_comment || "Write a comment..."} 
          className="flex-1 text-xs p-2 rounded-lg bg-transparent border focus:outline-none" 
          style={{ borderColor: 'var(--border)' }}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          className="btn p-2 rounded-lg bg-primary text-white flex items-center justify-center hover:opacity-90"
        >
          <Send size={12} />
        </button>
      </div>
    </div>
  );
};

// --- View / Edit Form Modal Component ---
const EditItemModal = ({ item, onClose, t, language }) => {
  const { updateItem } = useTaskStore();
  const [formData, setFormData] = useState({ ...item });

  const handleChange = (key, val) => {
    const updated = { ...formData, [key]: val };
    if (key === 'sum' || key === 'vat') {
      const sumCents = Math.round((Number(key === 'sum' ? val : updated.sum) || 0) * 100);
      const vatPct = Math.round(Number(key === 'vat' ? val : updated.vat) || 0);
      const totalCents = Math.round((sumCents * (100 + vatPct)) / 100);
      updated.total = (totalCents / 100).toFixed(2);
    }
    setFormData(updated);
  };

  const handleSave = () => {
    updateItem(item.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-2xl w-full p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)' }}>
        <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: 'var(--border-light)' }}>
          <h3 className="text-lg font-bold">{t.edit_item || 'Edit Table Row Info'}</h3>
          <button onClick={onClose} className="p-1 text-muted hover:text-foreground"><X size={20} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-xs text-muted mb-1">{t.title || 'Title'}</label>
            <input 
              type="text" 
              value={tValue(formData.title, language)} 
              onChange={e => handleChange('title', e.target.value)} 
              className="w-full p-2 border rounded-lg bg-transparent" 
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1">{t.entity || 'Entity Relation'}</label>
            <select 
              value={formData.entity || ''} 
              onChange={e => handleChange('entity', e.target.value)} 
              className="w-full p-2 border rounded-lg bg-transparent" 
              style={{ borderColor: 'var(--border)' }}
            >
              <option value="">None</option>
              <option value="Customer A">Customer A</option>
              <option value="Customer B">Customer B</option>
              <option value="Supplier A">Supplier A</option>
              <option value="Supplier B">Supplier B</option>
              <option value="Operator">Operator</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted mb-1">{t.type || 'Asset/Category Type'}</label>
            <select 
              value={formData.itemType || 'event'} 
              onChange={e => handleChange('itemType', e.target.value)} 
              className="w-full p-2 border rounded-lg bg-transparent" 
              style={{ borderColor: 'var(--border)' }}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="product">Product</option>
              <option value="project">Project</option>
              <option value="event">Event</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted mb-1">{t.priority || 'Priority'}</label>
            <select 
              value={formData.priority || 'none'} 
              onChange={e => handleChange('priority', e.target.value)} 
              className="w-full p-2 border rounded-lg bg-transparent" 
              style={{ borderColor: 'var(--border)' }}
            >
              {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted mb-1">Sum (ILS/Foreign)</label>
            <input 
              type="number" 
              value={formData.sum || 0} 
              onChange={e => handleChange('sum', e.target.value)} 
              className="w-full p-2 border rounded-lg bg-transparent" 
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1">Vat (%)</label>
            <input 
              type="number" 
              value={formData.vat || 17} 
              onChange={e => handleChange('vat', e.target.value)} 
              className="w-full p-2 border rounded-lg bg-transparent" 
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1">Total (Vat Included)</label>
            <input 
              type="text" 
              value={formData.total || 0} 
              disabled 
              className="w-full p-2 border rounded-lg bg-transparent opacity-60" 
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1">Currency</label>
            <select 
              value={formData.currency || 'ILS'} 
              onChange={e => handleChange('currency', e.target.value)} 
              className="w-full p-2 border rounded-lg bg-transparent" 
              style={{ borderColor: 'var(--border)' }}
            >
              <option value="ILS">₪ ILS</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted mb-1">Ref</label>
            <input 
              type="text" 
              value={formData.ref || ''} 
              onChange={e => handleChange('ref', e.target.value)} 
              className="w-full p-2 border rounded-lg bg-transparent" 
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1">Ref#1</label>
            <input 
              type="text" 
              value={formData.ref1 || ''} 
              onChange={e => handleChange('ref1', e.target.value)} 
              className="w-full p-2 border rounded-lg bg-transparent" 
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
          <button onClick={onClose} className="px-4 py-2 border rounded-lg bg-transparent hover:bg-gray-100/10">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

// --- Status & Custom Color Dropdown ---
const StatusDropdown = ({ task, t }) => {
  const { changeStatus, updateItem } = useTaskStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && document.body.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  const handleCustomColor = (hex) => {
    updateItem(task.id, { statusColor: hex });
    setOpen(false);
  };

  const activeColor = task.statusColor || STATUS_CONFIG[task.status]?.color || '#94a3b8';

  return (
    <div className="relative inline-block text-left" onClick={e => e.stopPropagation()} ref={dropdownRef}>
      <button 
        className="badge flex items-center gap-1 text-xs" 
        style={{ 
          backgroundColor: activeColor + '20', 
          color: activeColor,
          border: 'none',
          cursor: 'pointer'
        }}
        onClick={() => setOpen(!open)}
      >
        {t[task.status] || STATUS_CONFIG[task.status]?.label} <ChevronDown size={12} />
      </button>
      {open && (
        <div className="absolute left-0 mt-1 w-44 rounded-xl shadow-xl z-50 p-2 border" style={{background: 'var(--surface-elevated)', borderColor: 'var(--border)'}}>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <div 
              key={key}
              className="px-3 py-1.5 text-xs rounded-lg cursor-pointer hover:bg-gray-100/10 transition-colors flex items-center justify-between"
              style={{ color: config.color }}
              onClick={() => {
                changeStatus(task.id, key);
                setOpen(false);
              }}
            >
              <span>{t[key] || config.label}</span>
              {task.status === key && <Check size={10} />}
            </div>
          ))}
          <div className="border-t my-1.5" style={{ borderColor: 'var(--border-light)' }} />
          <div className="px-2 pb-1 text-[10px] text-muted font-semibold">Custom Color Picker:</div>
          <div className="flex gap-1 px-2 justify-between">
            {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(c => (
              <button 
                key={c} 
                onClick={() => handleCustomColor(c)}
                className="w-4 h-4 rounded-full border border-white/20 transition-transform hover:scale-125"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Individual Table Row ---
const Row = ({ item, depth, expanded, setExpanded, t, language, visibleColumns, checkedRows, toggleCheckRow }) => {
  const { duplicateItem, archiveItem, addItem } = useTaskStore();
  const { openDetailPanel } = useUIStore();
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  
  const descendants = getChildren(useTaskStore.getState().items, item.id);
  const hasChildren = descendants.length > 0;
  const isExpanded = expanded[item.id];
  const isTask = item.type === 'task';

  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && document.body.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  const handleDuplicate = (e) => {
    e.stopPropagation();
    duplicateItem(item.id);
    setMenuOpen(false);
  };

  const handleArchive = (e) => {
    e.stopPropagation();
    archiveItem(item.id);
    setMenuOpen(false);
  };

  const handleAddTask = (e) => {
    e.stopPropagation();
    addItem({ parentId: item.id, type: 'task', title: 'New Linked Task' });
    setMenuOpen(false);
  };

  return (
    <>
      <tr 
        className="cursor-pointer border-b hover:bg-black/5" 
        style={{borderColor: 'var(--border-light)', transition: 'background var(--transition-fast)'}}
        onClick={() => openDetailPanel(item.id)}
      >
        {/* CHECKBOX */}
        {visibleColumns.checkbox && (
          <td className="p-3 text-center border-x border-[var(--border-light)] w-[40px] min-w-[40px] max-w-[40px]" onClick={e => e.stopPropagation()}>
            <input 
              type="checkbox" 
              checked={!!checkedRows[item.id]} 
              onChange={() => toggleCheckRow(item.id)} 
              className="rounded"
            />
          </td>
        )}

        {/* DRAG HANDLE */}
        {visibleColumns.drag && (
          <td className="p-3 text-center text-muted border-x border-[var(--border-light)] w-[40px] min-w-[40px] max-w-[40px]" style={{ cursor: 'grab' }}>
            ⋮⋮
          </td>
        )}

        {/* ID */}
        {visibleColumns.id && (
          <td className="p-3 text-xs text-muted font-mono border-x border-[var(--border-light)] w-[60px] min-w-[60px] max-w-[60px]">{item.id.slice(0, 4)}</td>
        )}

        {/* TITLE */}
        {visibleColumns.title && (
          <td className="p-3 font-semibold text-sm border-x border-[var(--border-light)] w-[260px] min-w-[260px] max-w-[320px]" style={{ 
            paddingLeft: language === 'he' ? '12px' : `${depth * 20 + 24}px`, 
            paddingRight: language === 'he' ? `${depth * 20 + 24}px` : '12px',
            textAlign: 'inherit'
          }}>
            <div className="flex items-center gap-1">
              {hasChildren ? (
                <button 
                  className="p-1 hover:bg-gray-100/10 rounded" 
                  onClick={(e) => { e.stopPropagation(); setExpanded(prev => ({...prev, [item.id]: !prev[item.id]})); }}
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              ) : (
                <span className="w-5 inline-block"></span>
              )}
              <span>{tValue(item.title, language)}</span>
              {!isTask && <span className="text-[10px] opacity-60 bg-gray-500/20 px-1.5 py-0.5 rounded-full ml-1 font-normal">({t[item.type] || item.type})</span>}
            </div>
          </td>
        )}

        {/* ENTITY RELATION */}
        {visibleColumns.entity && (
          <td className="p-3 text-xs text-muted font-semibold border-x border-[var(--border-light)] w-[130px] min-w-[130px] max-w-[160px] truncate">{item.entity || 'Unassigned'}</td>
        )}

        {/* ASSET TYPE */}
        {visibleColumns.type && (
          <td className="p-3 text-xs text-muted font-semibold uppercase border-x border-[var(--border-light)] w-[100px] min-w-[100px] max-w-[120px] truncate">{item.itemType || 'event'}</td>
        )}

        {/* STATUS */}
        <td className="p-3 border-x border-[var(--border-light)] w-[110px] min-w-[110px] max-w-[120px]">
          <StatusDropdown task={item} t={t} />
        </td>

        {/* PRIORITY */}
        {visibleColumns.priority && (
          <td className="p-3 border-x border-[var(--border-light)] w-[90px] min-w-[90px] max-w-[100px]">
            {item.priority && item.priority !== 'none' && (
              <span className={`badge badge-priority-${item.priority}`}>
                {t[item.priority] || PRIORITY_CONFIG[item.priority]?.label}
              </span>
            )}
          </td>
        )}

        {/* FINANCIAL DATA (Sum, Vat, Total, Currency) */}
        {visibleColumns.sum && <td className="p-3 text-xs font-mono border-x border-[var(--border-light)] w-[80px] min-w-[80px] max-w-[100px] truncate">{item.sum || 0}</td>}
        {visibleColumns.vat && <td className="p-3 text-xs text-muted font-mono border-x border-[var(--border-light)] w-[80px] min-w-[80px] max-w-[100px] truncate">{item.vat || 17}%</td>}
        {visibleColumns.total && <td className="p-3 text-xs font-mono font-bold border-x border-[var(--border-light)] w-[80px] min-w-[80px] max-w-[100px] truncate">{item.total || 0}</td>}
        {visibleColumns.currency && <td className="p-3 text-xs font-mono border-x border-[var(--border-light)] w-[80px] min-w-[80px] max-w-[100px] truncate">{item.currency || 'ILS'}</td>}

        {/* REFERENCES */}
        {visibleColumns.ref && <td className="p-3 text-xs text-muted font-mono border-x border-[var(--border-light)] w-[80px] min-w-[80px] max-w-[100px] truncate">{item.ref || '-'}</td>}
        {visibleColumns.ref1 && <td className="p-3 text-xs text-muted font-mono border-x border-[var(--border-light)] w-[80px] min-w-[80px] max-w-[100px] truncate">{item.ref1 || '-'}</td>}

        {/* METADATA (Creator, Dates) */}
        {visibleColumns.creator && <td className="p-3 text-xs text-muted border-x border-[var(--border-light)] w-[100px] min-w-[100px] max-w-[120px] truncate">{item.creator || 'Operator'}</td>}
        {visibleColumns.createdAt && <td className="p-3 text-[10px] text-muted border-x border-[var(--border-light)] w-[100px] min-w-[100px] max-w-[120px] truncate">{item.createdAt ? format(new Date(item.createdAt), 'yyyy-MM-dd') : '-'}</td>}
        {visibleColumns.updatedAt && <td className="p-3 text-[10px] text-muted border-x border-[var(--border-light)] w-[100px] min-w-[100px] max-w-[120px] truncate">{item.updatedAt ? format(new Date(item.updatedAt), 'yyyy-MM-dd') : '-'}</td>}

        {/* ACTIONS */}
        {visibleColumns.actions && (
          <td className="p-3 text-center border-x border-[var(--border-light)] w-[130px] min-w-[130px] max-w-[140px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-center gap-1.5">
              <button onClick={() => openDetailPanel(item.id)} className="p-1 hover:text-primary transition-colors hover:bg-gray-100/10 rounded" title="View details">
                <Eye size={13} />
              </button>
              <button onClick={() => setEditOpen(true)} className="p-1 hover:text-yellow-500 transition-colors hover:bg-gray-100/10 rounded" title="Edit row">
                <Edit2 size={13} />
              </button>
              <button onClick={handleArchive} className="p-1 hover:text-red-500 transition-colors hover:bg-gray-100/10 rounded" title="Archive row">
                <Trash2 size={13} />
              </button>
              <div className="relative inline-block text-left">
                <button onClick={() => setCommentOpen(!commentOpen)} className="p-1 hover:text-blue-500 transition-colors hover:bg-gray-100/10 rounded" title="Comments">
                  <MessageSquare size={13} />
                </button>
                {commentOpen && <CommentsPopup item={item} onClose={() => setCommentOpen(false)} t={t} />}
              </div>
              
              {/* Overflow Menu */}
              <div className="relative inline-block text-left" ref={menuRef}>
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 hover:text-gray-300 transition-colors hover:bg-gray-100/10 rounded">
                  <MoreHorizontal size={13} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-1 w-40 rounded-xl shadow-xl p-2 z-50 border" style={{ background: 'var(--surface-elevated)', borderColor: 'var(--border)' }}>
                    <button onClick={handleDuplicate} className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-gray-100/10 flex items-center gap-2">
                      <Copy size={11} /> {t.duplicate || 'Duplicate'}
                    </button>
                    <button onClick={handleAddTask} className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-gray-100/10 flex items-center gap-2">
                      <BookmarkPlus size={11} /> {t.add_task || 'Add Task'}
                    </button>
                    <button onClick={() => { alert('Mailing row data...'); setMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-gray-100/10 flex items-center gap-2">
                      <Mail size={11} /> Send Email
                    </button>
                    <button onClick={() => { alert('Sending SMS/WhatsApp message...'); setMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-gray-100/10 flex items-center gap-2">
                      <Phone size={11} /> Send SMS
                    </button>
                  </div>
                )}
              </div>
            </div>
          </td>
        )}
      </tr>

      {/* Edit Form Modal */}
      {editOpen && <EditItemModal item={item} onClose={() => setEditOpen(false)} t={t} language={language} />}

      {/* Render children rows */}
      {isExpanded && descendants.map(child => (
        <Row 
          key={child.id} 
          item={child} 
          depth={depth + 1} 
          expanded={expanded} 
          setExpanded={setExpanded} 
          t={t} 
          language={language}
          visibleColumns={visibleColumns}
          checkedRows={checkedRows}
          toggleCheckRow={toggleCheckRow}
        />
      ))}
    </>
  );
};

// --- Main Grid View ---
export default function ListView() {
  const { items, addItem } = useTaskStore();
  const { 
    selectedNodeId, 
    filters, 
    language,
    tableTemplate,
    tableFontSize,
    visibleColumns,
    setTableTemplate,
    setTableFontSize,
    setVisibleColumns
  } = useUIStore();

  const [expanded, setExpanded] = useState({});
  const [checkedRows, setCheckedRows] = useState({});
  const [fieldEditorOpen, setFieldEditorOpen] = useState(false);

  const t = translations[language] || translations.en;
  const fieldEditorRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (fieldEditorRef.current && !fieldEditorRef.current.contains(e.target) && document.body.contains(e.target)) {
        setFieldEditorOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  let rootItems = selectedNodeId 
    ? getChildren(items, selectedNodeId)
    : items.filter(i => !i.parentId);

  if (rootItems.length === 0 && selectedNodeId) {
    const node = items.find(i => i.id === selectedNodeId);
    if (node) rootItems.push(node);
  }

  // Top level filtering
  if (filters.status) {
    rootItems = rootItems.filter(i => i.status === filters.status || i.type !== 'task');
  }

  const toggleCheckRow = (id) => {
    setCheckedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const next = {};
    if (checked) {
      items.forEach(item => { next[item.id] = true; });
    }
    setCheckedRows(next);
  };

  const handleExportCSV = () => {
    const headers = Object.keys(visibleColumns).filter(k => visibleColumns[k]);
    const rows = items.map(item => {
      return headers.map(h => {
        if (h === 'title') return tValue(item.title, language);
        return item[h] !== undefined ? String(item[h]).replace(/,/g, '') : '';
      }).join(',');
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `table_${tableTemplate}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%', overflow: 'hidden' }}>
      <PageGreetingBanner view="list" />

      {/* --- FLOW GUIDE (Batch 5 Conversational Component) --- */}
      <div className="glass-card p-4 flex flex-col gap-2 rounded-2xl relative overflow-hidden" style={{ border: '1px solid var(--border-light)', background: 'var(--surface-elevated)' }}>
        <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full filter blur-xl pointer-events-none" />
        <h3 className="text-sm font-semibold flex items-center gap-1 text-primary">
          <span>✨</span> {t.flow_guide_title || "Striving for Flowless Usage: What would you like to build today?"}
        </h3>
        <p className="text-xs text-muted mb-2">Select a template below to auto-configure table columns, metadata tags, and financial details in one click.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { id: 'master', label: '🛠️ Master Table', desc: 'Complete settings grid' },
            { id: 'quotes', label: '📄 Client Quotes', desc: 'Price summary & status' },
            { id: 'finance', label: '📊 Finance Ledger', desc: 'VAT, Sum & total' },
            { id: 'products', label: '📦 Product Catalog', desc: 'Inventory refs & priority' }
          ].map(opt => (
            <button 
              key={opt.id}
              onClick={() => setTableTemplate(opt.id)}
              className={`p-3 rounded-xl border text-left transition-all text-xs hover:scale-[1.02] flex flex-col gap-1 ${tableTemplate === opt.id ? 'border-primary bg-primary/10' : 'bg-transparent border-gray-500/20'}`}
            >
              <span className="font-bold text-foreground">{opt.label}</span>
              <span className="text-[10px] text-muted">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- SETTINGS TOOLBAR (Batch 1 Toggles) --- */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 glass-card rounded-xl" style={{ border: '1px solid var(--border-light)' }}>
        <div className="flex flex-wrap items-center gap-2">
          {/* Template Label */}
          <span className="text-xs font-semibold text-muted">Active: <span className="text-foreground capitalize">{tableTemplate}</span></span>
          <div className="h-4 w-px bg-gray-500/20 mx-1" />

          {/* Font Sizer */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-muted uppercase">Size:</span>
            {['xs', 'sm', 'md', 'lg'].map(sz => (
              <button 
                key={sz} 
                onClick={() => setTableFontSize(sz)}
                className={`px-2 py-1 text-[10px] font-bold rounded hover:bg-gray-100/10 transition-colors uppercase ${tableFontSize === sz ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-transparent text-muted'}`}
              >
                {sz}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-gray-500/20 mx-1" />

          {/* Field Editor toggle */}
          <div className="relative inline-block" ref={fieldEditorRef}>
            <button 
              onClick={() => setFieldEditorOpen(!fieldEditorOpen)}
              className="btn flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg bg-transparent hover:bg-gray-100/10"
              style={{ borderColor: 'var(--border)' }}
            >
              <Settings size={12} /> {t.field_editor || 'Configure Columns'}
            </button>

            {fieldEditorOpen && (
              <div 
                className="absolute left-0 mt-2 w-52 rounded-xl shadow-2xl p-3 z-50 text-xs border"
                style={{ background: 'var(--surface-elevated)', borderColor: 'var(--border)' }}
              >
                <div className="font-semibold pb-2 border-b mb-2" style={{ borderColor: 'var(--border-light)' }}>Select Visible Columns</div>
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {Object.keys(visibleColumns).map(col => (
                    <label key={col} className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                      <input 
                        type="checkbox" 
                        checked={visibleColumns[col]} 
                        onChange={() => setVisibleColumns({ [col]: !visibleColumns[col] })} 
                        className="rounded"
                      />
                      <span className="capitalize">{col.replace(/([A-Z])/g, ' $1')}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Actions */}
          <button 
            onClick={handleExportCSV} 
            className="btn flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg bg-transparent hover:bg-gray-100/10"
            style={{ borderColor: 'var(--border)' }}
          >
            <Download size={12} /> Export CSV
          </button>
          <button 
            onClick={() => addItem({ type: 'task', title: 'New Item' })}
            className="btn flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-white rounded-lg hover:opacity-90"
          >
            <Plus size={12} /> Add Row
          </button>
        </div>
      </div>

      {/* --- MASTER GRID TABLE --- */}
      <div className="glass-card flex-1 overflow-hidden flex flex-col rounded-2xl" style={{ border: '1px solid var(--border-light)' }}>
        <div className="overflow-auto flex-1">
          <table 
            className={`w-full text-start border-collapse text-${tableFontSize}`} 
            dir={language === 'he' ? 'rtl' : 'ltr'}
            style={{ textAlign: language === 'he' ? 'right' : 'left' }}
          >
            <thead className="text-[10px] text-muted uppercase sticky top-0 z-10" style={{backgroundColor: 'var(--surface-elevated)'}}>
              <tr>
                {visibleColumns.checkbox && (
                  <th className="p-3 text-center border-b border-x border-[var(--border-light)] w-[40px] min-w-[40px] max-w-[40px]" style={{ borderColor: 'var(--border)' }}>
                    <input type="checkbox" onChange={handleSelectAll} className="rounded" />
                  </th>
                )}
                {visibleColumns.drag && <th className="p-3 border-b border-x border-[var(--border-light)] w-[40px] min-w-[40px] max-w-[40px] text-center" style={{ borderColor: 'var(--border)' }}>Drag</th>}
                {visibleColumns.id && <th className="p-3 border-b border-x border-[var(--border-light)] w-[60px] min-w-[60px] max-w-[60px]" style={{ borderColor: 'var(--border)' }}>ID</th>}
                {visibleColumns.title && (
                  <th className="p-3 font-semibold border-b border-x border-[var(--border-light)] w-[260px] min-w-[260px] max-w-[320px]" style={{
                    borderColor: 'var(--border)', 
                    textAlign: 'inherit',
                    paddingRight: language === 'he' ? '24px' : '12px',
                    paddingLeft: language === 'he' ? '12px' : '24px'
                  }}>
                    {t.title}
                  </th>
                )}
                {visibleColumns.entity && <th className="p-3 font-semibold border-b border-x border-[var(--border-light)] w-[130px] min-w-[130px] max-w-[160px]" style={{ borderColor: 'var(--border)', textAlign: 'inherit' }}>{t.entity || 'Entity'}</th>}
                {visibleColumns.type && <th className="p-3 font-semibold border-b border-x border-[var(--border-light)] w-[100px] min-w-[100px] max-w-[120px]" style={{ borderColor: 'var(--border)', textAlign: 'inherit' }}>{t.type}</th>}
                <th className="p-3 font-semibold border-b border-x border-[var(--border-light)] w-[110px] min-w-[110px] max-w-[120px]" style={{ borderColor: 'var(--border)', textAlign: 'inherit' }}>{t.status}</th>
                {visibleColumns.priority && <th className="p-3 font-semibold border-b border-x border-[var(--border-light)] w-[90px] min-w-[90px] max-w-[100px]" style={{ borderColor: 'var(--border)', textAlign: 'inherit' }}>{t.priority}</th>}
                
                {/* Financial columns */}
                {visibleColumns.sum && <th className="p-3 font-semibold border-b border-x border-[var(--border-light)] w-[80px] min-w-[80px] max-w-[100px]" style={{ borderColor: 'var(--border)', textAlign: 'inherit' }}>Sum</th>}
                {visibleColumns.vat && <th className="p-3 font-semibold border-b border-x border-[var(--border-light)] w-[80px] min-w-[80px] max-w-[100px]" style={{ borderColor: 'var(--border)', textAlign: 'inherit' }}>VAT</th>}
                {visibleColumns.total && <th className="p-3 font-semibold border-b border-x border-[var(--border-light)] w-[80px] min-w-[80px] max-w-[100px]" style={{ borderColor: 'var(--border)', textAlign: 'inherit' }}>Total</th>}
                {visibleColumns.currency && <th className="p-3 font-semibold border-b border-x border-[var(--border-light)] w-[80px] min-w-[80px] max-w-[100px]" style={{ borderColor: 'var(--border)', textAlign: 'inherit' }}>Cur</th>}

                {/* References */}
                {visibleColumns.ref && <th className="p-3 font-semibold border-b border-x border-[var(--border-light)] w-[80px] min-w-[80px] max-w-[100px]" style={{ borderColor: 'var(--border)', textAlign: 'inherit' }}>Ref</th>}
                {visibleColumns.ref1 && <th className="p-3 font-semibold border-b border-x border-[var(--border-light)] w-[80px] min-w-[80px] max-w-[100px]" style={{ borderColor: 'var(--border)', textAlign: 'inherit' }}>Ref#1</th>}

                {/* Metadata */}
                {visibleColumns.creator && <th className="p-3 font-semibold border-b border-x border-[var(--border-light)] w-[100px] min-w-[100px] max-w-[120px]" style={{ borderColor: 'var(--border)', textAlign: 'inherit' }}>Creator</th>}
                {visibleColumns.createdAt && <th className="p-3 font-semibold border-b border-x border-[var(--border-light)] w-[100px] min-w-[100px] max-w-[120px]" style={{ borderColor: 'var(--border)', textAlign: 'inherit' }}>Created</th>}
                {visibleColumns.updatedAt && <th className="p-3 font-semibold border-b border-x border-[var(--border-light)] w-[100px] min-w-[100px] max-w-[120px]" style={{ borderColor: 'var(--border)', textAlign: 'inherit' }}>Updated</th>}

                {visibleColumns.actions && <th className="p-3 font-semibold border-b border-x border-[var(--border-light)] w-[130px] min-w-[130px] max-w-[140px] text-center" style={{ borderColor: 'var(--border)' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {rootItems.length > 0 ? rootItems.map(item => (
                <Row 
                  key={item.id} 
                  item={item} 
                  depth={0} 
                  expanded={expanded} 
                  setExpanded={setExpanded} 
                  t={t} 
                  language={language}
                  visibleColumns={visibleColumns}
                  checkedRows={checkedRows}
                  toggleCheckRow={toggleCheckRow}
                />
              )) : (
                <tr>
                  <td colSpan={24} className="p-8 text-center text-muted">
                    <div className="empty-state">
                      <AlertCircle className="empty-state-icon" />
                      <div className="empty-state-title">No items found</div>
                      <div className="empty-state-text">There are no items to display in this view.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
