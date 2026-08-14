import React, { useState } from 'react';
import Modal from './Modal';
import { useUIStore } from '../../stores/useUIStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { useCollabStore } from '../../stores/useCollabStore';
import { useNotificationStore } from '../../stores/useNotificationStore';
import { getAllowedChildType } from '../../utils/treeHelpers';
import { translations } from '../../utils/translations';

const TYPE_CONFIG = {
  topic: { label: 'Topic' },
  subtopic: { label: 'Sub-Topic' },
  project: { label: 'Project' },
  subproject: { label: 'Sub-Project' },
  task: { label: 'Task' }
};

export default function AddItemModal() {
  const { addItemModal, closeAddItemModal, language } = useUIStore();
  const { items, addItem } = useTaskStore();
  const { members } = useCollabStore();
  const { showToast } = useNotificationStore();

  const t = translations[language] || translations.en;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('none');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');

  if (!addItemModal) return null;

  const parentId = addItemModal.parentId;
  let type = addItemModal.type;

  if (!type) {
    const parent = items.find(i => i.id === parentId);
    type = getAllowedChildType(parent ? parent.type : null);
  }

  if (!type) type = 'task';

  const isTask = type === 'task';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addItem({
      title: title.trim(),
      description: description.trim(),
      type,
      parentId,
      status,
      priority,
      ...(isTask ? { assigneeId, dueDate: dueDate || null } : {})
    });

    showToast({
      title: `Added ${t[type] || TYPE_CONFIG[type].label}`,
      message: `"${title.trim()}" was created successfully.`,
      type: 'success'
    });

    closeAddItemModal();
    setTitle('');
    setDescription('');
    setStatus('todo');
    setPriority('none');
    setAssigneeId('');
    setDueDate('');
  };

  const modalTitle = language === 'he' 
    ? `הוסף ${t[type] || type} חדש`
    : language === 'ru'
    ? `Добавить новый ${t[type] || type}`
    : `Add New ${TYPE_CONFIG[type].label}`;

  const createBtnLabel = language === 'he'
    ? `צור ${t[type] || type}`
    : language === 'ru'
    ? `Создать ${t[type] || type}`
    : `Create ${TYPE_CONFIG[type].label}`;

  return (
    <Modal isOpen={!!addItemModal} onClose={closeAddItemModal} title={modalTitle}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', direction: language === 'he' ? 'rtl' : 'ltr' }}>
        <div>
          <label className="detail-field-label" style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 500 }}>{t.title}</label>
          <input 
            className="input" 
            autoFocus
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder={t.title + '...'} 
            required 
          />
        </div>

        <div>
          <label className="detail-field-label" style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 500 }}>{t.description}</label>
          <textarea 
            className="input textarea" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder={t.description + '...'} 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label className="detail-field-label" style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 500 }}>{t.status}</label>
            <select className="input select" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="todo">{t.todo}</option>
              <option value="in_progress">{t.in_progress}</option>
              <option value="review">{t.review}</option>
              <option value="done">{t.done}</option>
              <option value="backlog">{t.backlog}</option>
              <option value="blocked">{t.blocked}</option>
            </select>
          </div>
          
          <div>
            <label className="detail-field-label" style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 500 }}>{t.priority}</label>
            <select className="input select" value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="none">{t.none}</option>
              <option value="low">{t.low}</option>
              <option value="medium">{t.medium}</option>
              <option value="high">{t.high}</option>
              <option value="urgent">{t.urgent}</option>
            </select>
          </div>
        </div>

        {isTask && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="detail-field-label" style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 500 }}>{t.assignee}</label>
              <select className="input select" value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
                <option value="">{t.unassigned}</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="detail-field-label" style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 500 }}>{t.dueDate}</label>
              <input 
                type="date" 
                className="input" 
                value={dueDate} 
                onChange={e => setDueDate(e.target.value)} 
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px', flexDirection: language === 'he' ? 'row-reverse' : 'row' }}>
          <button type="button" className="btn btn-secondary" onClick={closeAddItemModal}>{t.cancel}</button>
          <button type="submit" className="btn btn-primary">{createBtnLabel}</button>
        </div>
      </form>
    </Modal>
  );
}
