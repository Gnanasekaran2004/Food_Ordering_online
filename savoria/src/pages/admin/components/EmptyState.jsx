import React from 'react';

export default function EmptyState({ icon = 'Inbox', title = 'No data found', message = 'There is no data to display.', action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', textAlign: 'center', background: 'var(--surface)',
      borderRadius: '12px', border: '1px solid var(--border)'
    }}>
      <div style={{ fontSize: '3rem', color: 'var(--muted)', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ fontSize: '1.2rem', color: 'var(--cream)', margin: '0 0 8px 0', fontFamily: 'var(--font-display)' }}>{title}</h3>
      <p style={{ color: 'var(--muted)', margin: '0 0 24px 0', fontSize: '0.9rem' }}>{message}</p>
      {action}
    </div>
  );
}
