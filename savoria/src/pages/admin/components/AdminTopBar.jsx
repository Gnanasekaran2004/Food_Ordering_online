import React from 'react';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export default function AdminTopBar({ title, onNotificationClick, collapsed }) {
  const { adminUser, adminLogout } = useAdminAuth();
  const leftPad = collapsed ? '60px' : '220px';

  return (
    <div style={{
      position: 'fixed', top: 0, left: leftPad, right: 0, height: '60px', zIndex: 40,
      background: 'rgba(14,14,14,0.8)', backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border)', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
      transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <h1 style={{ margin: 0, color: 'var(--cream)', fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>{title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button onClick={onNotificationClick} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', position: 'relative' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: 'var(--gold)', borderRadius: '50%' }} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '20px', borderLeft: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'var(--cream)', fontSize: '0.85rem' }}>{adminUser?.name || 'Admin'}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Administrator</div>
          </div>
          <button onClick={adminLogout} style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--cream)', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>
    </div>
  );
}
