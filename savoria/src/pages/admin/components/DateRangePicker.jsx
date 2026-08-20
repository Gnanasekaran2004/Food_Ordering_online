import React from 'react';

const OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '3m', label: '3 Months' },
  { value: '12m', label: '12 Months' }
];

export default function DateRangePicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', background: 'var(--surface-2)', padding: '4px', borderRadius: '8px', gap: '4px' }}>
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            background: value === opt.value ? 'var(--surface)' : 'transparent',
            color: value === opt.value ? 'var(--gold)' : 'var(--muted)',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontWeight: value === opt.value ? '600' : '400',
            borderBottom: value === opt.value ? '1px solid var(--gold)' : '1px solid transparent'
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
