import React, { useState, useRef, useEffect } from 'react';
import { X, MessageSquare } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { translations } from '../../utils/translations';
import { formatDistanceToNow } from 'date-fns';
import { ru, he } from 'date-fns/locale';

const localeMap = { ru, he };

export default function AdminCommentPanel({ isOpen, onClose, comments = [], onAddComment, rowTitle }) {
  const language = useUIStore((s) => s.language);
  const t = translations[language] || translations.en;
  const activeLocale = localeMap[language];
  const [text, setText] = useState('');
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        // Prevent close if clicking another comment bubble button
        if (e.target.closest('button')?.className?.includes('MessageSquare') || e.target.closest('svg')?.className?.baseVal?.includes('MessageSquare')) {
          return;
        }
        onClose();
      }
    };
    const timeout = setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 10);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddComment(text.trim());
    setText('');
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={panelRef}
      className={`detail-panel open`} 
      style={{
        zIndex: 350, 
        width: '380px',
        boxShadow: 'var(--shadow-xl)',
        background: 'var(--surface-elevated)',
        backdropFilter: 'var(--glass-blur)',
        borderLeft: language === 'he' ? 'none' : '1px solid var(--border)',
        borderRight: language === 'he' ? '1px solid var(--border)' : 'none',
        left: language === 'he' ? 0 : 'auto',
        right: language === 'he' ? 'auto' : 0,
      }}
    >
      <div className="detail-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)' }}>
          <MessageSquare size={16} className="text-[var(--accent)]" />
          {t.comments}
        </h3>
        <button 
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', padding: 4 }}
        >
          <X size={18} />
        </button>
      </div>

      <div style={{ padding: '12px 20px 6px 20px', background: 'rgba(0,0,0,0.01)', borderBottom: '1px solid var(--border-light)' }}>
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>{rowTitle}</span>
      </div>

      <div className="detail-panel-body" style={{ padding: 20, display: 'flex', flexDirection: 'column', height: 'calc(100% - 130px)', justifyContent: 'space-between' }}>
        <div style={{ flex1: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          {comments.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {t.noCommentsYet}
            </div>
          ) : (
            comments.map((comment) => (
              <div 
                key={comment.id || Math.random()} 
                style={{ 
                  background: 'var(--surface)', 
                  padding: 12, 
                  borderRadius: 'var(--radius-sm)', 
                  border: '1px solid var(--border-light)' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, gap: 8 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{comment.author}</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {comment.timestamp ? formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true, locale: activeLocale }) : ''}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{comment.text}</p>
              </div>
            ))
          )}
        </div>

        {onAddComment && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input
              type="text"
              className="input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.writeComment}
              style={{ fontSize: '0.82rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
              {t.add}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
