import React from 'react';

export default function AdminTable({ columns, data, onRowClick, emptyMessage = 'No records found' }) {
  if (!data || data.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>{emptyMessage}</div>;
  }

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            {columns.map((col, i) => (
              <th key={i} style={{ padding: '16px', color: 'var(--muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rIdx) => (
            <tr key={rIdx} 
              onClick={() => onRowClick && onRowClick(row)}
              style={{
                borderBottom: '1px solid var(--border)',
                cursor: onRowClick ? 'pointer' : 'default',
                background: rIdx % 2 === 0 ? 'transparent' : 'var(--surface-2)',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => { if(onRowClick) e.currentTarget.style.background = 'var(--surface-3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = rIdx % 2 === 0 ? 'transparent' : 'var(--surface-2)'; }}
            >
              {columns.map((col, cIdx) => (
                <td key={cIdx} style={{ padding: '16px', color: 'var(--cream)', fontSize: '0.9rem' }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
