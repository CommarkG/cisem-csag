import React, { useState } from 'react';
import { useTaskStore } from '../../stores/useTaskStore';
import { useUIStore } from '../../stores/useUIStore';
import { useCollabStore } from '../../stores/useCollabStore';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../../utils/seedData';
import { translations } from '../../utils/translations';
import { X, Calendar, User, Clock, Tag, MessageSquare, Trash2, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru, he } from 'date-fns/locale';

const localeMap = { ru, he };

export default function TaskDetailPanel() {
  const { detailPanelItemId, closeDetailPanel, language } = useUIStore();
  const { items, updateItem, deleteItem, changeStatus, addComment } = useTaskStore();
  const { members } = useCollabStore();
  const { showToast } = useNotificationStore();

  const t = translations[language] || translations.en;
  const activeLocale = localeMap[language];

  const [commentText, setCommentText] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [showLabelInput, setShowLabelInput] = useState(false);

  const task = items.find(i => i.id === detailPanelItemId);

  if (!task) return null;

  const handleTitleChange = (e) => {
    updateItem(task.id, { title: e.target.value });
  };

  const handleDescChange = (e) => {
    updateItem(task.id, { description: e.target.value });
  };

  const handleStatusChange = (e) => {
    changeStatus(task.id, e.target.value);
    showToast({
      title: 'Status Updated',
      message: `"${task.title}" is now ${STATUS_CONFIG[e.target.value]?.label}`,
      type: 'info'
    });
  };

  const handlePriorityChange = (e) => {
    updateItem(task.id, { priority: e.target.value });
  };

  const handleAssigneeChange = (e) => {
    updateItem(task.id, { assigneeId: e.target.value || null });
  };

  const handleDateChange = (field, value) => {
    updateItem(task.id, { [field]: value || null });
  };

  const handleHoursChange = (e) => {
    const val = parseInt(e.target.value, 10);
    updateItem(task.id, { estimatedHours: isNaN(val) ? null : val });
  };

  const handleAddLabel = (e) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    const labels = [...(task.labels || [])];
    if (!labels.includes(newLabel.trim())) {
      labels.push(newLabel.trim());
      updateItem(task.id, { labels });
    }
    setNewLabel('');
    setShowLabelInput(false);
  };

  const handleRemoveLabel = (labelToRemove) => {
    const labels = (task.labels || []).filter(l => l !== labelToRemove);
    updateItem(task.id, { labels });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(task.id, commentText.trim());
    setCommentText('');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteItem(task.id);
      showToast({
        title: 'Task Deleted',
        message: `"${task.title}" was deleted`,
        type: 'danger'
      });
      closeDetailPanel();
    }
  };

  return (
    <div className="detail-panel" style={{ direction: language === 'he' ? 'rtl' : 'ltr' }}>
      <div className="detail-panel-header">
        <input 
          className="input" 
          value={task.title} 
          onChange={handleTitleChange} 
          style={{ 
            fontSize: '1.1rem', 
            fontWeight: 700, 
            border: 'none', 
            background: 'transparent',
            padding: 0
          }} 
        />
        <button className="btn-icon" onClick={closeDetailPanel}>
          <X size={20} />
        </button>
      </div>

      <div className="detail-panel-body">
        {/* Status */}
        <div className="detail-field">
          <label className="detail-field-label">{t.status}</label>
          <select className="input select" value={task.status} onChange={handleStatusChange}>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{t[key] || config.label}</option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div className="detail-field">
          <label className="detail-field-label">{t.priority}</label>
          <select className="input select" value={task.priority} onChange={handlePriorityChange}>
            {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{t[key] || config.label}</option>
            ))}
          </select>
        </div>

        {/* Assignee */}
        <div className="detail-field">
          <label className="detail-field-label">{t.assignee}</label>
          <select className="input select" value={task.assigneeId || ''} onChange={handleAssigneeChange}>
            <option value="">{t.unassigned}</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Due Date & Start Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="detail-field">
            <label className="detail-field-label">{t.startDate}</label>
            <input 
              type="date" 
              className="input" 
              value={task.startDate ? task.startDate.slice(0, 10) : ''} 
              onChange={(e) => handleDateChange('startDate', e.target.value)} 
            />
          </div>
          <div className="detail-field">
            <label className="detail-field-label">{t.dueDate}</label>
            <input 
              type="date" 
              className="input" 
              value={task.dueDate ? task.dueDate.slice(0, 10) : ''} 
              onChange={(e) => handleDateChange('dueDate', e.target.value)} 
            />
          </div>
        </div>

        {/* Est. Hours */}
        <div className="detail-field">
          <label className="detail-field-label">{t.estimatedHours}</label>
          <input 
            type="number" 
            className="input" 
            value={task.estimatedHours || ''} 
            onChange={handleHoursChange} 
            placeholder="0" 
          />
        </div>

        {/* Labels / Tags */}
        <div className="detail-field">
          <label className="detail-field-label">Tags</label>
          <div className="flex flex-wrap gap-2 items-center">
            {task.labels?.map(label => (
              <span key={label} className="label-tag" style={{ gap: 4 }}>
                {label}
                <X size={10} className="cursor-pointer" onClick={() => handleRemoveLabel(label)} />
              </span>
            ))}
            {showLabelInput ? (
              <form onSubmit={handleAddLabel} style={{ display: 'flex', gap: 4 }}>
                <input 
                  className="input" 
                  style={{ width: 80, padding: '2px 6px', fontSize: '0.8rem' }}
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  autoFocus
                />
              </form>
            ) : (
              <button 
                className="btn btn-secondary btn-sm" 
                style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)' }}
                onClick={() => setShowLabelInput(true)}
              >
                <Plus size={12} /> Add Tag
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="detail-field">
          <label className="detail-field-label">{t.description}</label>
          <textarea 
            className="input textarea" 
            value={task.description} 
            onChange={handleDescChange} 
            placeholder={t.description + '...'} 
          />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '24px 0' }} />

        {/* Comments */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MessageSquare size={16} /> {t.comments}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {task.comments?.map((comment, index) => (
              <div key={index} style={{ background: 'var(--surface)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{comment.author}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true, locale: activeLocale })}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{comment.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: 8 }}>
            <input 
              className="input" 
              value={commentText} 
              onChange={e => setCommentText(e.target.value)} 
              placeholder={t.writeComment} 
            />
            <button type="submit" className="btn btn-primary btn-sm">{t.addComment}</button>
          </form>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '24px 0' }} />

        {/* Activity Log */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={16} /> {t.activityLog}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {task.activityLog?.slice().reverse().map((log, index) => (
              <div key={index} style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{log.actor}</span>: {log.action}
                <span style={{ fontSize: '0.65rem', marginLeft: 8, marginRight: 8 }}>
                  ({formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: activeLocale })})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delete */}
        <button className="btn btn-danger w-full" onClick={handleDelete}>
          <Trash2 size={16} /> {t.deleteTask}
        </button>
      </div>
    </div>
  );
}
