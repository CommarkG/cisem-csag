import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { translations } from '../../utils/translations';

export default function TagInput({ tags = [], onChange, placeholder }) {
  const language = useUIStore((s) => s.language);
  const t = translations[language] || translations.en;
  const [input, setInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const clean = input.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      const newTags = [...tags, clean];
      onChange(newTags);
      setInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    onChange(newTags);
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 min-h-[38px] p-1.5 rounded-lg border border-[var(--border)] bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)]">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[rgba(108,92,231,0.12)] text-[var(--accent)] border border-[rgba(108,92,231,0.2)]"
        >
          #{tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="hover:text-red-500 transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {isAdding ? (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            addTag();
            setIsAdding(false);
          }}
          autoFocus
          placeholder={placeholder || t.tagsPlaceholder}
          className="flex-1 min-w-[80px] bg-transparent border-none outline-none text-xs p-0 text-[var(--text-primary)]"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border border-dashed border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          <Plus size={12} />
          {t.add}
        </button>
      )}
    </div>
  );
}
