import React, { useState } from 'react';
import { X, Trash2, Plus, Settings } from 'lucide-react';
import { useAdminStore } from '../../stores/useAdminStore';
import { useUIStore } from '../../stores/useUIStore';
import { translations } from '../../utils/translations';

export default function DefineFieldsModal({ isOpen, onClose, entityType }) {
  const language = useUIStore((s) => s.language);
  const t = translations[language] || translations.en;

  const { 
    clientCustomFields, 
    supplierCustomFields, 
    teamCustomFields, 
    addCustomField, 
    deleteCustomField 
  } = useAdminStore();

  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState('text');

  if (!isOpen) return null;

  const currentCustomFields = 
    entityType === 'clients' ? clientCustomFields :
    entityType === 'suppliers' ? supplierCustomFields :
    entityType === 'team' ? teamCustomFields : [];

  const handleAddField = (e) => {
    e.preventDefault();
    if (!fieldName.trim()) return;
    addCustomField(entityType, fieldName.trim(), fieldType);
    setFieldName('');
    setFieldType('text');
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'text': return language === 'he' ? 'טקסט' : 'Text';
      case 'number': return language === 'he' ? 'מספר' : 'Number';
      case 'currency': return language === 'he' ? 'מטבע (₪)' : 'Currency (₪)';
      case 'date': return language === 'he' ? 'תאריך' : 'Date';
      case 'tags': return language === 'he' ? 'תגיות' : 'Tags';
      default: return type;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 460 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)' }}>
            <Settings size={18} className="text-[var(--accent)]" />
            {language === 'he' ? 'הגדרת עמודות מותאמות' : 'Define Custom Fields'}
          </h3>
          <button 
            className="btn-icon" 
            onClick={onClose}
            style={{ padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
          {language === 'he' 
            ? `הגדר עמודות מותאמות אישית עבור לקוחות, ספקים או צוות. עמודות אלו יתווספו אוטומטית לטבלה.` 
            : `Add or delete custom columns for your table. They will immediately render as interactive editors.`}
        </p>

        {/* Existing Custom Fields */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
            {language === 'he' ? 'עמודות קיימות' : 'Current Custom Fields'} ({currentCustomFields.length})
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto', paddingRight: 4 }}>
            {currentCustomFields.length === 0 ? (
              <div style={{ padding: 12, textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)' }}>
                {language === 'he' ? 'אין עמודות מותאמות עדיין' : 'No custom fields defined yet'}
              </div>
            ) : (
              currentCustomFields.map((f) => (
                <div 
                  key={f.field} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    background: 'var(--surface)', 
                    border: '1px solid var(--border-light)', 
                    padding: '8px 12px', 
                    borderRadius: 'var(--radius-sm)' 
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{f.label}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Type: {getTypeName(f.type)}</span>
                  </div>
                  <button
                    onClick={() => deleteCustomField(entityType, f.field)}
                    className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add New Custom Field Form */}
        <form onSubmit={handleAddField} style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
          <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            {language === 'he' ? 'הוסף עמודה חדשה' : 'Create Custom Column'}
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {language === 'he' ? 'שם העמודה' : 'Column Name'}
            </label>
            <input
              type="text"
              className="input"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="e.g. Project Value, Material Grade"
              style={{ fontSize: '0.82rem', padding: '8px 12px' }}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {language === 'he' ? 'סוג נתונים' : 'Data Type'}
            </label>
            <select
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value)}
              className="input select"
              style={{ fontSize: '0.82rem', padding: '8px 12px', height: 38 }}
            >
              <option value="text">Text (Inline Edit)</option>
              <option value="number">Number</option>
              <option value="currency">Currency (₪)</option>
              <option value="date">Date Picker</option>
              <option value="tags">Tags Chip Input</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full" 
            style={{ marginTop: 8, padding: '10px 16px', fontSize: '0.82rem', display: 'flex', justify: 'center', gap: 6 }}
          >
            <Plus size={16} />
            {language === 'he' ? 'הוסף עמודה לטבלה' : 'Add Column to Table'}
          </button>
        </form>
      </div>
    </div>
  );
}
