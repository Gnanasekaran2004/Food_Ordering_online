import React, { useRef, useEffect } from 'react';
import { CATEGORIES } from '../../../data/menuData';

export default function CategoryNav({ activeCategory, onSelect }) {
  const trackRef = useRef(null);
  const indicatorRef = useRef(null);

  /* ── Slide the gold indicator to the active pill ────────────── */
  useEffect(() => {
    if (!trackRef.current || !indicatorRef.current) return;
    const activePill = trackRef.current.querySelector(`[data-cat="${activeCategory}"]`);
    if (!activePill) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const pillRect  = activePill.getBoundingClientRect();
    const left   = pillRect.left - trackRect.left + trackRef.current.scrollLeft;
    const width  = pillRect.width;
    indicatorRef.current.style.transform = `translateX(${left}px)`;
    indicatorRef.current.style.width     = `${width}px`;
  }, [activeCategory]);

  return (
    <div style={{ position: 'relative', overflowX: 'auto', scrollbarWidth: 'none' }}>
      {/* Scrollable pill track */}
      <div
        ref={trackRef}
        role="tablist"
        aria-label="Menu categories"
        style={{
          display: 'flex',
          gap: '0.25rem',
          position: 'relative',
          padding: '0.25rem',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '2px',
          width: 'max-content',
          maxWidth: '100%',
        }}
      >
        {/* Sliding background indicator */}
        <div
          ref={indicatorRef}
          aria-hidden
          style={{
            position: 'absolute',
            top: '0.25rem',
            bottom: '0.25rem',
            left: 0,
            width: 0,
            background: 'var(--gold)',
            borderRadius: '1px',
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {Object.entries(CATEGORIES).map(([key, { label }]) => {
          const isActive = key === activeCategory;
          return (
            <button
              key={key}
              data-cat={key}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(key)}
              style={{
                position: 'relative',
                zIndex: 1,
                padding: '0.55rem 1.2rem',
                background: 'transparent',
                border: 'none',
                borderRadius: '1px',
                fontFamily: 'var(--font-label)',
                fontSize: '0.58rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--bg)' : 'var(--muted)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'color 0.25s ease',
                outline: 'none',
              }}
              onFocus={e => {
                if (!isActive) e.currentTarget.style.color = 'var(--cream)';
              }}
              onBlur={e => {
                if (!isActive) e.currentTarget.style.color = 'var(--muted)';
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
