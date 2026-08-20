import React, { useState } from 'react';
import { useAdminData } from '../hooks/useAdminData';

export default function MenuPage() {
  const { menuItems } = useAdminData('30d');
  const [items, setItems] = useState(menuItems);
  const [search, setSearch] = useState('');
  
  const toggleAvail = (id) => {
    setItems(items.map(i => i.id === id ? { ...i, available: !i.available } : i));
  };

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Menu Management</h2>
        <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Changes are not persisted until backend is connected</span>
      </div>
      <input type="text" placeholder="Search menu items..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', maxWidth: '400px', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none' }} />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filtered.map(item => (
          <div key={item.id} style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', color: 'var(--cream)', fontSize: '1.1rem' }}>{item.name}</h3>
                <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{item.category}</span>
              </div>
              <div style={{ color: 'var(--gold)', fontWeight: 600 }}>₹{item.price.toLocaleString()}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {item.featured && <span style={{ padding: '4px 8px', background: 'rgba(201,168,76,0.1)', color: 'var(--gold)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>Featured</span>}
              {item.chefSpecial && <span style={{ padding: '4px 8px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>Chef Special</span>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <div><div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Orders (30d)</div><div style={{ color: 'var(--cream)' }}>{item.orders}</div></div>
              <div><div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Revenue (30d)</div><div style={{ color: 'var(--cream)' }}>₹{item.revenue.toLocaleString()}</div></div>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: item.available ? '#10b981' : '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>{item.available ? 'Available' : 'Unavailable'}</span>
              <button onClick={() => toggleAvail(item.id)} style={{
                background: item.available ? 'transparent' : 'var(--gold)',
                color: item.available ? 'var(--muted)' : 'black',
                border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
              }}>
                {item.available ? 'Mark Unavailable' : 'Mark Available'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
