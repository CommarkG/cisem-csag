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
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Trash2, 
  MessageSquare, 
  Download, 
  Upload, 
  Search, 
  Plus, 
  Link2,
  Mail,
  Phone,
  Check,
  Tag
} from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useCollabStore } from '../../stores/useCollabStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { useAdminStore } from '../../stores/useAdminStore';
import { translations } from '../../utils/translations';
import TagInput from './TagInput';
import AdminCommentPanel from './AdminCommentPanel';

// --- Click-to-Activate & Hover-to-Reveal Email Cell ---
const EmailCell = ({ email, onChange, readOnly }) => {
  const [copied, setCopied] = useState(false);
  const language = useUIStore((s) => s.language);
  const isRtl = language === 'he';

  const handleCopy = (e) => {
    e.stopPropagation();
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (readOnly) {
    return (
      <div className="flex items-center gap-1.5 px-1.5 py-0.5 justify-between group/cell select-all">
        <div className="flex items-center gap-1.5 min-w-0">
          <Mail size={12} className="text-[var(--text-muted)] flex-shrink-0" />
          <span className="text-xs truncate font-medium">{email || '-'}</span>
        </div>
        {email && (
          <button 
            onClick={handleCopy}
            className="opacity-0 group-hover/cell:opacity-100 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-muted)] transition-all"
            title="Copy Email"
          >
            {copied ? <Check size={11} className="text-green-500" /> : <Link2 size={11} />}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-transparent border border-transparent hover:border-[var(--border)] focus-within:border-[var(--accent)] focus-within:bg-[var(--surface-elevated)] rounded-lg px-2 w-full transition-all group/cell">
      <Mail size={12} className="text-[var(--text-muted)] flex-shrink-0" />
      <input
        type="email"
        value={email || ''}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-none outline-none py-1.5 text-xs w-full font-medium text-[var(--text-primary)]"
        placeholder="email@example.com"
        style={{ textAlign: isRtl ? 'right' : 'left' }}
      />
      {email && (
        <button 
          onClick={handleCopy}
          className="opacity-0 group-hover/cell:opacity-100 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-muted)] transition-all flex-shrink-0"
          title="Copy Email"
        >
          {copied ? <Check size={12} className="text-green-500" /> : <Link2 size={12} />}
        </button>
      )}
    </div>
  );
};

// --- Click-to-Activate & Hover-to-Reveal Phone Cell ---
const PhoneCell = ({ phone, onChange, readOnly }) => {
  const [copied, setCopied] = useState(false);
  const language = useUIStore((s) => s.language);
  const isRtl = language === 'he';

  const handleCopy = (e) => {
    e.stopPropagation();
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (readOnly) {
    return (
      <div className="flex items-center gap-1.5 px-1.5 py-0.5 justify-between group/cell select-all">
        <div className="flex items-center gap-1.5 min-w-0">
          <Phone size={12} className="text-[var(--text-muted)] flex-shrink-0" />
          <span className="text-xs truncate font-medium">{phone || '-'}</span>
        </div>
        {phone && (
          <button 
            onClick={handleCopy}
            className="opacity-0 group-hover/cell:opacity-100 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-muted)] transition-all"
            title="Copy Phone"
          >
            {copied ? <Check size={11} className="text-green-500" /> : <Link2 size={11} />}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-transparent border border-transparent hover:border-[var(--border)] focus-within:border-[var(--accent)] focus-within:bg-[var(--surface-elevated)] rounded-lg px-2 w-full transition-all group/cell">
      <Phone size={12} className="text-[var(--text-muted)] flex-shrink-0" />
      <input
        type="text"
        value={phone || ''}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-none outline-none py-1.5 text-xs w-full font-medium text-[var(--text-primary)]"
        placeholder="+1 (555) 000-0000"
        style={{ textAlign: isRtl ? 'right' : 'left' }}
      />
      {phone && (
        <button 
          onClick={handleCopy}
          className="opacity-0 group-hover/cell:opacity-100 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-muted)] transition-all flex-shrink-0"
          title="Copy Phone"
        >
          {copied ? <Check size={12} className="text-green-500" /> : <Link2 size={12} />}
        </button>
      )}
    </div>
  );
};

// --- Collapsible Tags Cell ---
const TagsCell = ({ tags = [], onChange, placeholder, t }) => {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target) && document.body.contains(e.target)) {
        setExpanded(false);
      }
    };
    if (expanded) {
      document.addEventListener('click', handleOutside);
    }
    return () => document.removeEventListener('click', handleOutside);
  }, [expanded]);

  if (expanded) {
    return (
      <div ref={containerRef} onClick={e => e.stopPropagation()}>
        <TagInput tags={tags} onChange={onChange} placeholder={placeholder} />
      </div>
    );
  }

  if (tags.length === 0) {
    return <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>-</span>;
  }

  const maxVisible = 2;
  const visibleTags = tags.slice(0, maxVisible);
  const extraCount = tags.length - maxVisible;
  const tagColors = useAdminStore.getState().tagColors || {};

  return (
    <div 
      ref={containerRef} 
      className="relative inline-flex items-center gap-1 group"
      onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
      style={{ cursor: 'pointer' }}
    >
      {visibleTags.map(tag => {
        const color = tagColors[tag.toLowerCase().trim()] || 'var(--accent)';
        return (
          <span 
            key={tag}
            style={{
              fontSize: '9px',
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: 'var(--radius-xs)',
              background: `${color}15`,
              color: color,
              border: `1px solid ${color}30`,
              whiteSpace: 'nowrap'
            }}
          >
            {tag}
          </span>
        );
      })}
      {extraCount > 0 && (
        <span 
          style={{
            fontSize: '9px',
            fontWeight: 600,
            padding: '1px 4px',
            borderRadius: 'var(--radius-xs)',
            background: 'var(--surface-hover)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-light)'
          }}
        >
          +{extraCount}
        </span>
      )}
      
      {/* Tooltip on Hover showing all tags */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-50 p-2 rounded-lg bg-gray-900 text-white shadow-xl" style={{ minWidth: 120 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {tags.map(tag => {
            const color = tagColors[tag.toLowerCase().trim()] || 'var(--accent)';
            return (
              <span key={tag} style={{ fontSize: '9px', padding: '1px 4px', background: color, color: '#fff', borderRadius: '3px', whiteSpace: 'nowrap' }}>
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
// Dynamic alignment helper to ensure titles and content align identically (Rule 7.1/21)
const getColumnAlign = (col, language) => {
  const isRtl = language === 'he';
  const field = col.field;
  const type = col.type;

  // Center alignment for specific metadata/status/actions columns
  if (['status', 'tags', 'comments', 'actions', 'budget', 'value', 'startDate', 'dueDate', 'linkedClientId', 'linkedProjectIds'].includes(field) || type === 'tags' || type === 'select' || type === 'date' || type === 'currency') {
    return {
      headerClass: 'justify-center',
      cellClass: 'text-center justify-center',
      textStyle: { textAlign: 'center' }
    };
  }

// Left alignment (RTL: Right alignment) for standard fields. Never left in Hebrew!
  return {
    headerClass: 'justify-start',
    cellClass: 'text-start justify-start',
    textStyle: { textAlign: isRtl ? 'right' : 'left' }
  };
};

export default function AdminTable({ 
  type, // 'projects' | 'clients' | 'suppliers' | 'team'
  data, 
  columns, 
  groupByField, 
  onAddRow, 
  onUpdateRow, 
  onDeleteRow,
  onAddComment,
  searchTerm = '',
  maxColWidth = 160,
  readOnly = false
}) {
  const language = useUIStore((s) => s.language);
  const t = translations[language] || translations.en;
  
  const { members } = useCollabStore();
  const { items: tasks } = useTaskStore();
  const { clients } = useAdminStore();

  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [activeCommentRow, setActiveCommentRow] = useState(null); // { id, title, comments }

  // 1. Search & Filter
  const filteredData = useMemo(() => {
    return data.filter(row => {
      const searchStr = searchTerm.toLowerCase();
      // Search across name, company, email, phone, tags, materials
      const nameMatch = row.name?.toLowerCase().includes(searchStr);
      const companyMatch = row.company?.toLowerCase().includes(searchStr);
      const titleMatch = row.title?.toLowerCase().includes(searchStr);
      const emailMatch = row.email?.toLowerCase().includes(searchStr);
      const phoneMatch = row.phone?.toLowerCase().includes(searchStr);
      
      const tagsMatch = row.tags?.some(tag => tag.toLowerCase().includes(searchStr));
      const materialsMatch = row.materials?.some(mat => mat.toLowerCase().includes(searchStr));
      
      return nameMatch || companyMatch || titleMatch || emailMatch || phoneMatch || tagsMatch || materialsMatch;
    });
  }, [data, searchTerm]);

  // 2. Sorting
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle null/undefined
      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      // Number comparison
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      // String comparison
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  // 3. Grouping
  const groupedData = useMemo(() => {
    const groups = {};
    sortedData.forEach(row => {
      let groupKey = row[groupByField];
      
      // For Projects, group by parent Topic title
      if (type === 'projects' && groupByField === 'parentId') {
        const parent = tasks.find(item => item.id === row.parentId);
        groupKey = parent ? parent.title : t.allTopics;
      }

      if (!groupKey) groupKey = 'Unassigned';
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(row);
    });
    return groups;
  }, [sortedData, groupByField, type, tasks, t.allTopics]);

  // Toggle group collapse
  const toggleGroup = (groupKey) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  // Column sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">


      {/* 2. Responsive Table Container */}
      <div className="flex-1 overflow-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <table 
          className="w-full border-collapse table-fixed text-start" 
          dir={language === 'he' ? 'rtl' : 'ltr'}
          style={{ minWidth: '1000px', textAlign: language === 'he' ? 'right' : 'left' }}
        >
          <thead className="sticky top-0 bg-[var(--bg-secondary)] border-b border-[var(--border)] z-10">
            <tr>
              {columns.map((col) => {
                const align = getColumnAlign(col, language);
                return (
                  <th
                    key={col.field}
                    onClick={() => col.sortable !== false && handleSort(col.field)}
                    className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] border-x border-[var(--border-light)] select-none ${col.sortable !== false ? 'cursor-pointer hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)]' : ''}`}
                    style={{ 
                      width: col.width || 'auto', 
                      maxWidth: col.field === 'actions' || col.field === 'comments' ? 'auto' : `${maxColWidth}px`,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      textAlign: align.textStyle.textAlign
                    }}
                  >
                    <div className={`flex items-center gap-1.5 ${align.headerClass}`}>
                      {col.field === 'email' ? (
                        <Mail size={14} className="text-[var(--text-secondary)]" title={col.label} />
                      ) : col.field === 'phone' ? (
                        <Phone size={14} className="text-[var(--text-secondary)]" title={col.label} />
                      ) : (
                        col.label
                      )}
                      {sortField === col.field && (
                        <span className="text-[var(--accent)] text-[10px]">
                          {sortDirection === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          
          <tbody>
            {Object.entries(groupedData).map(([groupKey, rows]) => {
              const isCollapsed = collapsedGroups[groupKey];
              return (
                <React.Fragment key={groupKey}>
                  {/* Group Title Row */}
                  <tr className="bg-[rgba(108,92,231,0.03)] border-b border-[var(--border-light)] sticky z-[5]">
                    <td colSpan={columns.length} className="px-4 py-2 text-xs font-bold text-[var(--text-primary)]">
                      <div className="flex items-center justify-between">
                        <button 
                          onClick={() => toggleGroup(groupKey)}
                          className="flex items-center gap-2 text-left hover:text-[var(--accent)] transition-colors focus:outline-none"
                          style={{ direction: 'ltr' }}
                        >
                          {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                          <span style={{ direction: language === 'he' ? 'rtl' : 'ltr' }}>
                            {groupKey} ({rows.length})
                          </span>
                        </button>
                        
                        {/* Quick Add Row to Group */}
                        {!readOnly && (
                          <button
                            onClick={() => onAddRow(groupKey)}
                            className="p-1 rounded hover:bg-[rgba(108,92,231,0.1)] text-[var(--accent)] transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Rows inside Group */}
                  {!isCollapsed && rows.map((row) => (
                    <tr 
                      key={row.id} 
                      className="border-b border-[var(--border-light)] hover:bg-[rgba(0,0,0,0.01)] dark:hover:bg-[rgba(255,255,255,0.01)] transition-colors"
                    >
                      {columns.map((col) => {
                        const align = getColumnAlign(col, language);
                        // Render cell values dynamically based on type
                        let cellContent = null;
                        
                        if (readOnly && col.field === 'actions') {
                          cellContent = null;
                        } 
                        else if (readOnly && col.field !== 'comments' && col.field !== 'email' && col.field !== 'phone') {
                          if (col.type === 'select') {
                            let options = col.options || [];
                            if (col.field === 'assigneeId') {
                              options = [{ value: '', label: t.unassigned }, ...members.map(m => ({ value: m.id, label: m.name }))];
                            }
                            if (col.field === 'linkedClientId') {
                              options = [{ value: '', label: 'No Client' }, ...clients.map(c => ({ value: c.id, label: `${c.name} (${c.company})` }))];
                            }
                            const selectedOpt = options.find(o => o.value === row[col.field]);
                            cellContent = <span className="text-xs px-1.5 py-0.5">{selectedOpt ? selectedOpt.label : row[col.field] || '-'}</span>;
                          } else if (col.type === 'multi-select') {
                            if (col.field === 'linkedProjectIds') {
                              const linkedProjIds = row.linkedProjectIds || [];
                              cellContent = (
                                <div className="flex flex-wrap gap-1">
                                  {linkedProjIds.map(projId => {
                                    const projObj = tasks.find(p => p.id === projId);
                                    return projObj ? (
                                      <span key={projId} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent)] text-[10px] border border-[rgba(108,92,231,0.1)]">
                                        <Link2 size={8} />
                                        {projObj.title}
                                      </span>
                                    ) : null;
                                  })}
                                </div>
                              );
                            }
                          } else if (col.type === 'currency') {
                            cellContent = <span className="text-xs px-1.5 py-0.5">₪{row[col.field] || 0}</span>;
                          } else if (col.type === 'number') {
                            cellContent = <span className="text-xs px-1.5 py-0.5">{row[col.field] || 0}</span>;
                          } else if (col.type === 'date') {
                            cellContent = <span className="text-xs px-1.5 py-0.5">{row[col.field] ? row[col.field].split('T')[0] : '-'}</span>;
                          } else if (col.type === 'tags' || col.field === 'materials') {
                            cellContent = (
                              <TagsCell
                                tags={row[col.field] || []}
                                onChange={null}
                                t={t}
                              />
                            );
                          } else {
                            cellContent = <span className="text-xs px-1.5 py-0.5 font-medium block truncate" style={{ maxWidth: `${maxColWidth}px` }}>{row[col.field] || '-'}</span>;
                          }
                        }
                        else if (col.field === 'actions') {
                          cellContent = (
                            <button
                              onClick={() => {
                                if (window.confirm(t.confirmDeleteRow)) {
                                  onDeleteRow(row.id);
                                }
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          );
                        } 
                        else if (col.field === 'comments') {
                          const count = row.comments?.length || 0;
                          cellContent = (
                            <button
                              onClick={() => setActiveCommentRow({
                                id: row.id,
                                title: row.name || row.title || 'Comments',
                                comments: row.comments || []
                              })}
                              className={`relative flex items-center gap-1.5 p-1 rounded hover:bg-[rgba(108,92,231,0.08)] transition-colors ${count > 0 ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text-muted)]'}`}
                            >
                              <MessageSquare size={16} />
                              {count > 0 && <span className="text-[11px]">{count}</span>}
                            </button>
                          );
                        } 
                        else if (col.field === 'email') {
                          cellContent = (
                            <EmailCell 
                              email={row[col.field]} 
                              onChange={(val) => onUpdateRow(row.id, { [col.field]: val })}
                              readOnly={readOnly}
                            />
                          );
                        }
                        else if (col.field === 'phone') {
                          cellContent = (
                            <PhoneCell 
                              phone={row[col.field]} 
                              onChange={(val) => onUpdateRow(row.id, { [col.field]: val })}
                              readOnly={readOnly}
                            />
                          );
                        }
                        else if (col.type === 'tags' || col.field === 'materials') {
                          cellContent = (
                            <TagsCell
                              tags={row[col.field] || []}
                              onChange={(newTags) => onUpdateRow(row.id, { [col.field]: newTags })}
                              t={t}
                            />
                          );
                        } 
                        else if (col.type === 'select') {
                          let options = col.options || [];
                          
                          // Assignee select options
                          if (col.field === 'assigneeId') {
                            options = [{ value: '', label: t.unassigned }, ...members.map(m => ({ value: m.id, label: m.name }))];
                          }
                          
                          // Client selector for projects
                          if (col.field === 'linkedClientId') {
                            options = [{ value: '', label: 'No Client' }, ...clients.map(c => ({ value: c.id, label: `${c.name} (${c.company})` }))];
                          }

                          cellContent = (
                            <select
                              value={row[col.field] || ''}
                              onChange={(e) => onUpdateRow(row.id, { [col.field]: e.target.value })}
                              className="input select p-1.5 text-xs bg-transparent border-transparent hover:border-[var(--border)] focus:bg-[var(--surface-elevated)] w-full"
                              style={{ textAlign: align.textStyle.textAlign }}
                            >
                              {options.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          );
                        } 
                        else if (col.type === 'multi-select') {
                          // Link multiple projects to a client
                          if (col.field === 'linkedProjectIds') {
                            const linkedProjIds = row.linkedProjectIds || [];
                            const activeProjList = tasks.filter(t => t.type === 'project');
                            
                            cellContent = (
                              <div className="flex flex-col gap-1 w-full max-w-[200px]">
                                <div className="flex flex-wrap gap-1">
                                  {linkedProjIds.map(projId => {
                                    const projObj = tasks.find(p => p.id === projId);
                                    return projObj ? (
                                      <span key={projId} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent)] text-[10px] border border-[rgba(108,92,231,0.1)]">
                                        <Link2 size={8} />
                                        {projObj.title}
                                        <button 
                                          onClick={() => {
                                            const filtered = linkedProjIds.filter(id => id !== projId);
                                            onUpdateRow(row.id, { linkedProjectIds: filtered });
                                          }} 
                                          className="hover:text-red-500 font-bold ml-1"
                                        >
                                          ×
                                        </button>
                                      </span>
                                    ) : null;
                                  })}
                                </div>
                                
                                <select
                                  value=""
                                  onChange={(e) => {
                                    const selectVal = e.target.value;
                                    if (selectVal && !linkedProjIds.includes(selectVal)) {
                                      onUpdateRow(row.id, { linkedProjectIds: [...linkedProjIds, selectVal] });
                                    }
                                  }}
                                  className="input select p-0.5 text-[10px] bg-transparent"
                                >
                                  <option value="">{t.selectProjects}</option>
                                  {activeProjList.map(proj => (
                                    <option key={proj.id} value={proj.id} className="bg-[var(--bg-primary)]">
                                      {proj.title}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            );
                          }
                        }
                        else if (col.type === 'currency') {
                          cellContent = (
                            <div className="flex items-center justify-center gap-1 w-full">
                              <span className="text-[var(--text-muted)]">₪</span>
                              <input
                                type="number"
                                value={row[col.field] || 0}
                                onChange={(e) => onUpdateRow(row.id, { [col.field]: Number(e.target.value) })}
                                className="input p-1.5 text-xs bg-transparent border-transparent hover:border-[var(--border)] focus:bg-[var(--surface-elevated)] w-24"
                                style={{ textAlign: align.textStyle.textAlign }}
                              />
                            </div>
                          );
                        } 
                        else if (col.type === 'number') {
                          cellContent = (
                            <input
                              type="number"
                              value={row[col.field] || 0}
                              onChange={(e) => onUpdateRow(row.id, { [col.field]: Number(e.target.value) })}
                              className="input p-1.5 text-xs bg-transparent border-transparent hover:border-[var(--border)] focus:bg-[var(--surface-elevated)] w-20"
                              style={{ textAlign: align.textStyle.textAlign }}
                            />
                          );
                        } 
                        else if (col.type === 'date') {
                          cellContent = (
                            <input
                              type="date"
                              value={row[col.field] ? row[col.field].split('T')[0] : ''}
                              onChange={(e) => onUpdateRow(row.id, { [col.field]: e.target.value ? new Date(e.target.value).toISOString() : null })}
                              className="input p-1 text-xs bg-transparent border-transparent hover:border-[var(--border)] focus:bg-[var(--surface-elevated)] w-full"
                              style={{ textAlign: align.textStyle.textAlign }}
                            />
                          );
                        } 
                        else {
                          // Standard editable text
                          cellContent = (
                            <input
                              type="text"
                              value={row[col.field] || ''}
                              onChange={(e) => onUpdateRow(row.id, { [col.field]: e.target.value })}
                              className="input p-1.5 text-xs bg-transparent border-transparent hover:border-[var(--border)] focus:bg-[var(--surface-elevated)] w-full font-medium text-[var(--text-primary)] truncate"
                              style={{ maxWidth: `${maxColWidth}px`, textAlign: align.textStyle.textAlign }}
                            />
                          );
                        }

                        const isInteractive = ['actions', 'comments', 'materials', 'tags'].includes(col.field) || col.type === 'tags';
                        return (
                          <td 
                            key={col.field} 
                            className={`px-4 py-2.5 text-xs border-x border-[var(--border-light)] align-middle ${align.cellClass}`}
                            style={{ 
                              width: col.width || 'auto',
                              maxWidth: isInteractive ? 'auto' : `${maxColWidth}px`,
                              overflow: 'hidden',
                              textAlign: align.textStyle.textAlign
                            }}
                          >
                            <div className={`${!isInteractive ? 'truncate' : ''} flex items-center ${align.cellClass}`} style={{ maxWidth: isInteractive ? 'auto' : `${maxColWidth}px`, width: '100%' }}>
                              {cellContent}
                            </div>
                          </td>
                        );

                      })}
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 3. Row Comments Overlay Slide-Out */}
      {activeCommentRow && (
        <AdminCommentPanel
          isOpen={!!activeCommentRow}
          onClose={() => setActiveCommentRow(null)}
          rowTitle={activeCommentRow.title}
          comments={activeCommentRow.comments}
          onAddComment={readOnly ? null : (text) => {
            // Commit to active store
            const currentUser = useUIStore.getState().language === 'he' ? 'משתמש' : 'User';
            onAddComment(activeCommentRow.id, text, currentUser);
            
            // Instantly update local state overlay
            setActiveCommentRow(prev => ({
              ...prev,
              comments: [...prev.comments, {
                id: Math.random().toString(),
                author: currentUser,
                text,
                timestamp: new Date().toISOString()
              }]
            }));
          }}
        />
      )}
    </div>
  );
}
