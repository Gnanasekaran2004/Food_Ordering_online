import React, { useRef, useEffect } from 'react';
import { CATEGORIES } from '../../../data/menuData';

/* Search icon SVG */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);

  return (
    <div
      style={{
        position: 'relative',
        maxWidth: '520px',
        width: '100%',
      }}
    >
      {/* Search icon */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '1.1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: value ? 'var(--gold)' : 'var(--muted)',
          transition: 'color 0.25s ease',
          pointerEvents: 'none',
          display: 'flex',
        }}
      >
        <SearchIcon />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search dishes, ingredients…"
        aria-label="Search menu"
        style={{
          width: '100%',
          padding: '0.85rem 2.8rem 0.85rem 3rem',
          background: 'var(--surface)',
          border: `1px solid ${value ? 'rgba(201,168,76,0.3)' : 'var(--border)'}`,
          borderRadius: '2px',
          color: 'var(--cream)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.85rem',
          fontWeight: 300,
          outline: 'none',
          transition: 'border-color 0.25s ease, background 0.25s ease',
          caretColor: 'var(--gold)',
        }}
        onFocus={e => {
          e.currentTarget.style.background = 'var(--surface-2)';
          e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
        }}
        onBlur={e => {
          e.currentTarget.style.background = 'var(--surface)';
          e.currentTarget.style.borderColor = value ? 'rgba(201,168,76,0.3)' : 'var(--border)';
        }}
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => { onChange(''); inputRef.current?.focus(); }}
          aria-label="Clear search"
          style={{
            position: 'absolute',
            right: '0.9rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '50%',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--cream)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
        >
          <XIcon />
        </button>
      )}
    </div>
  );
}
