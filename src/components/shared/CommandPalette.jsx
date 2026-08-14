import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { getPath } from '../../utils/treeHelpers';

export default function CommandPalette() {
  const { commandPaletteOpen, closeCommandPalette, setSelectedNodeId, openDetailPanel } = useUIStore();
  const items = useTaskStore(state => state.items);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        useUIStore.getState().toggleCommandPalette();
      }
      if (e.key === 'Escape' && useUIStore.getState().commandPaletteOpen) {
        closeCommandPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeCommandPalette]);

  if (!commandPaletteOpen) return null;

  const results = items.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item) => {
    setSelectedNodeId(item.id);
    if (item.type === 'task') {
      openDetailPanel(item.id);
    }
    closeCommandPalette();
  };

  return (
    <div className="command-palette-overlay modal-overlay" onClick={closeCommandPalette}>
      <div className="command-palette modal-content" onClick={e => e.stopPropagation()} style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Search className="item-icon" size={20} style={{ color: 'var(--text-muted)' }} />
          <input
            ref={inputRef}
            className="command-palette-input input"
            style={{ border: 'none', background: 'transparent', padding: 0, outline: 'none', boxShadow: 'none' }}
            placeholder="Search tasks, projects, topics..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="command-palette-results" style={{ maxHeight: '300px', overflowY: 'auto', padding: '8px' }}>
          {results.map(item => {
            const path = getPath(items, item.parentId).map(p => p.title).join(' / ');
            return (
              <div 
                key={item.id} 
                className="command-palette-item" 
                onClick={() => handleSelect(item)}
                style={{ padding: '12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge" style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}>{item.type}</span>
                  <span style={{ fontWeight: 600 }}>{item.title}</span>
                </div>
                {path && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{path}</div>}
              </div>
            );
          })}
          {results.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No results found</div>
          )}
        </div>
      </div>
    </div>
  );
}
