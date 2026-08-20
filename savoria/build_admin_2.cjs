const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const files = {};

// ... skipping redefining everything for speed, I'll just put the same string
files['pages/admin/components/SvgBarChart.jsx'] = `import React, { useEffect, useState } from 'react';

export default function SvgBarChart({ data, maxValue, color = 'var(--gold)' }) {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { setDrawn(true); }, []);

  if (!data || !data.length) return null;
  const max = maxValue || Math.max(...data.map(d => d.value));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {data.map((d, i) => {
        const widthPct = (d.value / max) * 100;
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--cream)' }}>{d.label} {d.sub && <span style={{color:'var(--muted)', fontSize:'0.75rem'}}>({d.sub})</span>}</span>
              <span style={{ color: 'var(--muted)' }}>{d.value.toLocaleString()}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--surface-2)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: color,
                width: drawn ? \`\${widthPct}%\` : '0%',
                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: '4px'
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
`;

files['pages/admin/components/SvgDonutChart.jsx'] = `import React, { useEffect, useState } from 'react';

export default function SvgDonutChart({ segments }) {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { setDrawn(true); }, []);

  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 70;
  const strokeW = 20;

  const total = segments.reduce((acc, s) => acc + s.value, 0);
  let currentAngle = -90;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={\`0 0 \${size} \${size}\`}>
          {segments.map((seg, i) => {
            const angle = (seg.value / total) * 360;
            const dashArray = 2 * Math.PI * r;
            const dashOffset = dashArray - (dashArray * (angle / 360));
            
            const p = (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                stroke={seg.color} strokeWidth={strokeW}
                strokeDasharray={dashArray} strokeDashoffset={drawn ? dashOffset : dashArray}
                style={{ transition: 'stroke-dashoffset 1s ease-out', transformOrigin: 'center', transform: \`rotate(\${currentAngle}deg)\` }}
              />
            );
            currentAngle += angle;
            return p;
          })}
        </svg>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Total</span>
          <span style={{ color: 'var(--cream)', fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>{total}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: seg.color }} />
            <span style={{ color: 'var(--cream)', width: 80 }}>{seg.label}</span>
            <span style={{ color: 'var(--muted)' }}>({((seg.value/total)*100).toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
`;

files['pages/admin/components/AdminTable.jsx'] = `import React from 'react';

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
`;

files['pages/admin/components/NotificationPanel.jsx'] = `import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationPanel({ notifications, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute', top: '60px', right: '20px', width: '320px',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', zIndex: 100,
        overflow: 'hidden'
      }}
    >
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '1rem', fontFamily: 'var(--font-display)' }}>Notifications</h3>
        <button style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '0.8rem' }}>Mark all read</button>
      </div>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {notifications.map(n => (
          <div key={n.id} style={{
            padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '12px',
            background: n.read ? 'transparent' : 'rgba(201,168,76,0.05)'
          }}>
            <div style={{ fontSize: '1.2rem', color: n.type === 'warning' ? '#f59e0b' : n.type === 'error' ? '#ef4444' : n.type === 'success' ? '#10b981' : '#3b82f6' }}>
              {n.type === 'warning' ? '⚠' : n.type === 'error' ? '✕' : n.type === 'success' ? '✓' : 'ℹ'}
            </div>
            <div>
              <div style={{ color: 'var(--cream)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>{n.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '8px' }}>{n.message}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>{new Date(n.time).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
`;

files['pages/admin/components/OrderDrawer.jsx'] = `import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from './StatusBadge';

export default function OrderDrawer({ order, onClose }) {
  if (!order) return null;
  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: '450px', maxWidth: '100%',
            background: 'var(--bg)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column'
          }}
        >
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>Order {order.id}</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div><span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Customer</span><div style={{ color: 'var(--cream)' }}>{order.customer}</div><div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{order.email}</div></div>
              <div style={{ textAlign: 'right' }}><span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Date</span><div style={{ color: 'var(--cream)' }}>{new Date(order.date).toLocaleString()}</div></div>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div><span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Status</span><div style={{ marginTop: '4px' }}><StatusBadge status={order.status} /></div></div>
              <div><span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Payment</span><div style={{ marginTop: '4px' }}><StatusBadge status={order.payment} /></div></div>
            </div>
            <div>
              <h3 style={{ color: 'var(--gold)', fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Items</h3>
              {order.orderItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--surface-3)' }}>
                  <div style={{ color: 'var(--cream)' }}>{item.qty}x {item.name}</div>
                  <div style={{ color: 'var(--cream)' }}>₹{(item.qty * item.price).toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--surface-2)', padding: '16px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--muted)' }}><span>Subtotal</span><span>₹{order.amount.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--muted)' }}><span>Tax (5%)</span><span>₹{(order.amount * 0.05).toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '16px', color: 'var(--cream)', fontSize: '1.2rem', fontWeight: 600 }}><span>Total</span><span>₹{(order.amount * 1.05).toLocaleString()}</span></div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
`;

files['pages/admin/components/CustomerDrawer.jsx'] = `import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from './StatusBadge';

export default function CustomerDrawer({ customer, onClose }) {
  if (!customer) return null;
  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: '450px', maxWidth: '100%',
            background: 'var(--bg)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column'
          }}
        >
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>Customer Profile</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: '2rem', border: '1px solid var(--border)' }}>
                {customer.name.substring(0,2).toUpperCase()}
              </div>
              <div>
                <div style={{ color: 'var(--cream)', fontSize: '1.5rem', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{customer.name}</div>
                <StatusBadge status={customer.status} />
              </div>
            </div>
            <div style={{ background: 'var(--surface-2)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Email</span><span style={{ color: 'var(--cream)' }}>{customer.email}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Phone</span><span style={{ color: 'var(--cream)' }}>{customer.phone}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Join Date</span><span style={{ color: 'var(--cream)' }}>{new Date(customer.joinDate).toLocaleDateString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Favorite Dish</span><span style={{ color: 'var(--cream)' }}>{customer.favoriteDish}</span></div>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, background: 'var(--surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '8px' }}>Total Orders</div>
                <div style={{ color: 'var(--cream)', fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>{customer.orders}</div>
              </div>
              <div style={{ flex: 1, background: 'var(--surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '8px' }}>Total Spent</div>
                <div style={{ color: 'var(--cream)', fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>₹{customer.totalSpent.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
`;

files['pages/admin/components/AdminSidebar.jsx'] = `import React from 'react';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: 'M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z' },
  { path: '/admin/orders', label: 'Orders', icon: 'M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z' },
  { path: '/admin/customers', label: 'Customers', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
  { path: '/admin/menu', label: 'Menu', icon: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z' },
  { path: '/admin/reservations', label: 'Reservations', icon: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z' },
  { path: '/admin/analytics', label: 'Analytics', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z' },
  { path: '/admin/activity', label: 'Activity', icon: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z' },
  { path: '/admin/settings', label: 'Settings', icon: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33c-.22-.08-.47 0-.59.22L2.73 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z' },
];

export default function AdminSidebar({ collapsed, onToggle, currentPath }) {
  const navigate = useNavigate();
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
      width: collapsed ? '60px' : '220px',
      background: 'var(--surface-2)',
      borderRight: '1px solid var(--border)',
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      <div style={{ height: '60px', display: 'flex', alignItems: 'center', padding: collapsed ? '0 10px' : '0 20px', justifyContent: collapsed ? 'center' : 'space-between', borderBottom: '1px solid var(--border)' }}>
        {!collapsed && <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-label)', letterSpacing: '1px' }}>SAVORIA Admin</span>}
        <button onClick={onToggle} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex', padding: '4px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
        </button>
      </div>
      <div style={{ flex: 1, padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map(item => {
          const active = currentPath.startsWith(item.path);
          return (
            <div key={item.path} onClick={() => navigate(item.path)} style={{
              display: 'flex', alignItems: 'center', padding: '12px 20px',
              cursor: 'pointer', color: active ? 'var(--gold)' : 'var(--muted)',
              background: active ? 'rgba(201,168,76,0.05)' : 'transparent',
              borderLeft: active ? '3px solid var(--gold)' : '3px solid transparent',
              transition: 'all 0.2s'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}><path d={item.icon} /></svg>
              {!collapsed && <span style={{ marginLeft: '16px', fontSize: '0.9rem', fontWeight: active ? 600 : 400 }}>{item.label}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
`;

files['pages/admin/components/AdminTopBar.jsx'] = `import React from 'react';
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
`;

files['pages/admin/AdminLayout.jsx'] = `import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminTopBar from './components/AdminTopBar';
import NotificationPanel from './components/NotificationPanel';
import { useAdminData } from './hooks/useAdminData';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const { notifications } = useAdminData();

  useEffect(() => {
    const saved = localStorage.getItem('savoria_admin_sidebar');
    if (saved) setCollapsed(saved === 'true');
  }, []);

  const toggleSidebar = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('savoria_admin_sidebar', String(next));
  };

  const getTitle = () => {
    const path = location.pathname.split('/').pop();
    return path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Dashboard';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--cream)', fontFamily: 'var(--font-body)' }}>
      <AdminSidebar collapsed={collapsed} onToggle={toggleSidebar} currentPath={location.pathname} />
      <AdminTopBar title={getTitle()} onNotificationClick={() => setNotifOpen(!notifOpen)} collapsed={collapsed} />
      {notifOpen && <NotificationPanel notifications={notifications} onClose={() => setNotifOpen(false)} />}
      <div style={{
        marginLeft: collapsed ? '60px' : '220px',
        paddingTop: '60px',
        minHeight: '100vh',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '24px', flex: 1, overflowX: 'hidden' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
`;

files['pages/admin/auth/AdminLoginPage.jsx'] = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@savoria.com');
  const [password, setPassword] = useState('savoria-admin-2024');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin({ email, password });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: 'var(--gold)', fontFamily: 'var(--font-label)', letterSpacing: '2px', margin: 0, fontSize: '2rem' }}>SAVORIA</h1>
          <p style={{ color: 'var(--muted)', marginTop: '8px', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Admin Portal</p>
        </div>
        
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Admin Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '14px', background: 'var(--gold)', color: 'black', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--muted)' }}>
          This is a private administrative area. <br/><a href="/" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Return to public site</a>
        </div>
      </div>
    </div>
  );
}
`;

Object.keys(files).forEach(f => {
  const fullPath = path.join(srcDir, f);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, files[f]);
});
console.log('Batch 2 done.');
