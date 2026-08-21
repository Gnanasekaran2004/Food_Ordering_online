import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';

export default function ActivityPage() {
  const { activity } = useAdminData('30d');
  const [filter, setFilter] = useState('All');
  const [limit, setLimit] = useState(10);

  const types = ['All', 'ORDER', 'USER', 'RESERVATION', 'MENU', 'SETTINGS'];
  const filtered = activity.filter(a => filter === 'All' || a.entityType === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Activity Log</h2>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            background: filter === t ? 'var(--gold)' : 'var(--surface)',
            color: filter === t ? 'black' : 'var(--muted)',
            border: '1px solid var(--border)', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: filter === t ? 600 : 400
          }}>{t}</button>
        ))}
      </div>
      <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filtered.slice(0, limit).map((a, i) => (
            <div key={a.id} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
              {i !== filtered.slice(0, limit).length - 1 && <div style={{ position: 'absolute', left: 5, top: 20, bottom: -20, width: 2, background: 'var(--surface-3)' }} />}
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--gold)', marginTop: 4, position: 'relative', zIndex: 2 }} />
              <div>
                <div style={{ color: 'var(--cream)', fontSize: '0.95rem' }}>{a.summary || a.message}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '4px' }}>
                  <span style={{ color: 'var(--gold)', marginRight: '8px' }}>{a.entityType || a.type}</span>
                  {a.createdAt?.toDate ? a.createdAt.toDate().toLocaleString() : (a.time ? new Date(a.time).toLocaleString() : 'Just now')}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ color: 'var(--muted)' }}>No activity logs found.</div>}
        </div>
        {limit < filtered.length && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button onClick={() => setLimit(l => l + 10)} style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '8px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Load More</button>
          </div>
        )}
      </div>
    </div>
  );
}
