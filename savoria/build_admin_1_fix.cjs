const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, 'src');
const files = {};

files['services/mockAdminAuth.js'] = `export const SESSION_KEY = 'savoria_admin_session_v1';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function adminLogin({ email, password }) {
  await delay(500);
  if (email === 'admin@savoria.com' && password === 'savoria-admin-2024') {
    const adminUser = { email, role: 'admin', name: 'Admin User' };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(adminUser));
    return adminUser;
  }
  const err = new Error('Invalid credentials');
  err.code = 'admin/invalid-credential';
  throw err;
}

export async function adminLogout() {
  await delay(500);
  sessionStorage.removeItem(SESSION_KEY);
}

export function getAdminSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY));
  } catch (e) {
    return null;
  }
}
`;

files['context/AdminAuthContext.jsx'] = `import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin as mockLogin, adminLogout as mockLogout, getAdminSession } from '../services/mockAdminAuth';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAdminUser(getAdminSession());
    setLoading(false);
  }, []);

  const adminLogin = async (creds) => {
    const user = await mockLogin(creds);
    setAdminUser(user);
  };

  const adminLogout = async () => {
    await mockLogout();
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, isAdmin: !!adminUser, loading, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
`;

files['pages/admin/data/adminMockData.js'] = `export const RANGES = ['today', '7d', '30d', '3m', '12m'];

export const getSummary = (range) => {
  const multipliers = { today: 1, '7d': 7, '30d': 30, '3m': 90, '12m': 365 };
  const m = multipliers[range] || 30;
  return {
    views: 1250 * m,
    orders: 45 * m,
    revenue: 125000 * m,
    avgOrderValue: 2750,
    customers: 20 * m,
    reservations: 15 * m,
    cancellationRate: '2.5%',
    retention: '68%',
    conversionRate: '3.6%',
    completionRate: '98%',
    viewsTrend: '+12.5%',
    ordersTrend: '+8.2%',
    revenueTrend: '+15.4%',
    aovTrend: '+2.1%'
  };
};

export const getTrafficData = (range) => {
  return Array.from({ length: 7 }).map((_, i) => ({
    label: \`Day \${i+1}\`,
    views: Math.floor(Math.random() * 1000 + 500),
    unique: Math.floor(Math.random() * 500 + 200)
  }));
};

export const getRevenueData = (range) => {
  return Array.from({ length: 7 }).map((_, i) => ({
    label: \`Day \${i+1}\`,
    revenue: Math.floor(Math.random() * 50000 + 10000),
    prev: Math.floor(Math.random() * 40000 + 10000)
  }));
};

export const ORDERS = Array.from({ length: 20 }).map((_, i) => {
  const statuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled', 'Refunded'];
  const payments = ['Paid', 'Refunded', 'Pending'];
  return {
    id: \`ORD-\${1000 + i}\`,
    customer: \`Customer \${i + 1}\`,
    email: \`customer\${i+1}@example.com\`,
    date: new Date(Date.now() - i * 3600000).toISOString(),
    items: Math.floor(Math.random() * 5) + 1,
    amount: Math.floor(Math.random() * 10000) + 500,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    payment: payments[Math.floor(Math.random() * payments.length)],
    orderItems: [{ name: 'Braised A5 Wagyu Short Rib', qty: 1, price: 4500 }]
  };
});

export const CUSTOMERS = Array.from({ length: 15 }).map((_, i) => ({
  id: \`CUST-\${i+1}\`,
  name: \`Customer \${i + 1}\`,
  email: \`customer\${i+1}@example.com\`,
  phone: \`+91 98765432\${10 + i}\`,
  orders: Math.floor(Math.random() * 50) + 1,
  totalSpent: Math.floor(Math.random() * 100000) + 1000,
  lastOrder: new Date(Date.now() - i * 86400000).toISOString(),
  status: Math.random() > 0.2 ? 'Active' : 'Inactive',
  joinDate: new Date(Date.now() - i * 86400000 * 30).toISOString(),
  favoriteDish: 'Braised A5 Wagyu Short Rib'
}));

export const TOP_DISHES = [
  { rank: 1, name: 'Braised A5 Wagyu Short Rib', category: 'Mains', orders: 450, revenue: 2025000, trend: '+15%' },
  { rank: 2, name: 'Butter-Poached Lobster', category: 'Mains', orders: 320, revenue: 1120000, trend: '+8%' },
  { rank: 3, name: 'Seared Scallop Amuse-Bouche', category: 'Starters', orders: 280, revenue: 420000, trend: '+5%' }
];

export const RESERVATIONS = Array.from({ length: 12 }).map((_, i) => ({
  id: \`RES-\${i+1}\`,
  name: \`Party of \${(i%4)+2}\`,
  party: (i%4)+2,
  date: new Date().toISOString().split('T')[0],
  time: \`19:30\`,
  status: i < 3 ? 'Completed' : i > 10 ? 'Cancelled' : 'Upcoming',
  notes: 'Window seat preferred'
}));

export const ACTIVITY = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  type: ['Orders', 'Customers', 'Reservations', 'Menu', 'System'][i % 5],
  message: \`Activity message \${i+1}\`,
  time: new Date(Date.now() - i * 3600000).toISOString(),
  icon: 'dot'
}));

export const NOTIFICATIONS = Array.from({ length: 8 }).map((_, i) => {
  const types = ['warning', 'info', 'success', 'error'];
  return {
    id: i,
    type: types[i % 4],
    title: \`Notification \${i+1}\`,
    message: \`Detailed message for notification \${i+1}\`,
    time: new Date(Date.now() - i * 1800000).toISOString(),
    read: i > 3
  };
});

export const KITCHEN_METRICS = {
  avgPrepTime: '18 min',
  onTimeRate: '94.2%',
  throughput: '21 orders/hr',
  completionRate: '97.8%',
  cancellationRate: '3.2%'
};

export const MENU_ITEMS = [
  { id: 'm1', name: 'Braised A5 Wagyu Short Rib', category: 'Mains', price: 4500, available: true, featured: true, chefSpecial: true, orders: 450, revenue: 2025000 },
  { id: 'm2', name: 'Butter-Poached Lobster', category: 'Mains', price: 3500, available: true, featured: false, chefSpecial: true, orders: 320, revenue: 1120000 }
];

export const ORDER_STATUS_DATA = { pending: 15, confirmed: 25, preparing: 10, ready: 5, completed: 150, cancelled: 5, refunded: 2 };

export const getOrderStatusData = (range) => ORDER_STATUS_DATA;
`;

files['pages/admin/hooks/useAdminData.js'] = `import { useState, useEffect } from 'react';
import {
  getSummary, getTrafficData, getRevenueData, ORDERS, CUSTOMERS,
  TOP_DISHES, RESERVATIONS, ACTIVITY, NOTIFICATIONS, KITCHEN_METRICS,
  MENU_ITEMS, getOrderStatusData
} from '../data/adminMockData';

export function useAdminData(range = '30d') {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [range]);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  return {
    loading,
    refreshData,
    summary: getSummary(range),
    traffic: getTrafficData(range),
    revenue: getRevenueData(range),
    orders: ORDERS,
    customers: CUSTOMERS,
    topDishes: TOP_DISHES,
    reservations: RESERVATIONS,
    activity: ACTIVITY,
    notifications: NOTIFICATIONS,
    kitchenMetrics: KITCHEN_METRICS,
    menuItems: MENU_ITEMS,
    orderStatusData: getOrderStatusData(range)
  };
}
`;

files['pages/admin/components/StatusBadge.jsx'] = `import React from 'react';

export default function StatusBadge({ status }) {
  let color = 'var(--muted)';
  let bg = 'var(--surface-3)';
  
  switch(status) {
    case 'Pending': color = '#f59e0b'; bg = 'rgba(245, 158, 11, 0.1)'; break;
    case 'Confirmed': color = '#3b82f6'; bg = 'rgba(59, 130, 246, 0.1)'; break;
    case 'Preparing': color = '#f97316'; bg = 'rgba(249, 115, 22, 0.1)'; break;
    case 'Ready': color = '#10b981'; bg = 'rgba(16, 185, 129, 0.1)'; break;
    case 'Completed': color = '#059669'; bg = 'rgba(5, 150, 105, 0.1)'; break;
    case 'Active': color = '#10b981'; bg = 'rgba(16, 185, 129, 0.1)'; break;
    case 'Cancelled': color = '#ef4444'; bg = 'rgba(239, 68, 68, 0.1)'; break;
    case 'Refunded': color = '#a855f7'; bg = 'rgba(168, 85, 247, 0.1)'; break;
    case 'Upcoming': color = '#3b82f6'; bg = 'rgba(59, 130, 246, 0.1)'; break;
    case 'Inactive': color = '#9ca3af'; bg = 'rgba(156, 163, 175, 0.1)'; break;
    default: break;
  }

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
      color,
      backgroundColor: bg,
      border: \`1px solid \${color}40\`
    }}>
      {status}
    </span>
  );
}
`;

files['pages/admin/components/SkeletonCard.jsx'] = `import React from 'react';

export default function SkeletonCard({ width = '100%', height = '100px', borderRadius = '12px' }) {
  return (
    <>
      <style>
        {\`
          @keyframes pulseAdmin {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        \`}
      </style>
      <div style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--surface-2)',
        animation: 'pulseAdmin 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        border: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.05), transparent)',
          transform: 'translateX(-100%)',
          animation: 'shimmer 2s infinite'
        }} />
      </div>
    </>
  );
}
`;

files['pages/admin/components/EmptyState.jsx'] = `import React from 'react';

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
`;

files['pages/admin/components/KpiCard.jsx'] = `import React, { useState, useEffect } from 'react';
import SkeletonCard from './SkeletonCard';

export default function KpiCard({ label, value, trend, trendPositive = true, icon, loading }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (loading) return;
    const isNum = typeof value === 'number';
    if (!isNum) {
      setDisplayValue(value);
      return;
    }
    let start = 0;
    const duration = 1000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const inc = value / steps;
    
    const timer = setInterval(() => {
      start += inc;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value, loading]);

  if (loading) return <SkeletonCard height="120px" />;

  const formatVal = (val) => {
    if (typeof val === 'number') {
      if (val > 10000) return '₹' + (val/1000).toFixed(1) + 'k';
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div style={{
      background: 'var(--surface)', padding: '20px', borderRadius: '12px',
      border: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      gap: '12px', borderTop: '2px solid var(--gold)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
        <span style={{ color: 'var(--gold)' }}>{icon}</span>
      </div>
      <div style={{ fontSize: '1.8rem', color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>
        {formatVal(displayValue)}
      </div>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
          <span style={{ color: trendPositive ? '#10b981' : '#ef4444' }}>
            {trendPositive ? '↑' : '↓'} {trend}
          </span>
          <span style={{ color: 'var(--muted)' }}>vs prev. period</span>
        </div>
      )}
    </div>
  );
}
`;

files['pages/admin/components/DateRangePicker.jsx'] = `import React from 'react';

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
`;

files['pages/admin/components/SvgLineChart.jsx'] = `import React, { useEffect, useState } from 'react';

export default function SvgLineChart({ data, width = 600, height = 200, color = 'var(--gold)', showPrev = false }) {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { setDrawn(true); }, []);

  if (!data || data.length === 0) return null;

  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const w = width - padding.left - padding.right;
  const h = height - padding.top - padding.bottom;

  const allVals = data.map(d => d.value || d.views || d.revenue || 0);
  if (showPrev) data.forEach(d => { if(d.prev) allVals.push(d.prev); });
  const max = Math.max(...allVals, 10);
  const min = 0;

  const getX = (i) => padding.left + (i * (w / (data.length - 1 || 1)));
  const getY = (val) => padding.top + h - ((val - min) / (max - min)) * h;

  const makePath = (key) => {
    return data.map((d, i) => {
      const val = d[key] || 0;
      return \`\${i === 0 ? 'M' : 'L'} \${getX(i)} \${getY(val)}\`;
    }).join(' ');
  };

  const mainPath = makePath('value') || makePath('views') || makePath('revenue');
  const prevPath = showPrev ? makePath('prev') : '';

  const areaPath = mainPath.replace('M', 'M') + \` L \${getX(data.length - 1)} \${getY(0)} L \${getX(0)} \${getY(0)} Z\`;

  return (
    <svg width="100%" height={height} viewBox={\`0 0 \${width} \${height}\`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map(r => (
        <line key={r} x1={padding.left} y1={padding.top + h * r} x2={width - padding.right} y2={padding.top + h * r} stroke="var(--border)" strokeWidth="1" />
      ))}

      {/* Area */}
      <path d={areaPath} fill="url(#chartGrad)" style={{ transition: 'opacity 1s', opacity: drawn ? 1 : 0 }} />

      {/* Prev Line */}
      {showPrev && prevPath && (
        <path d={prevPath} fill="none" stroke="var(--muted)" strokeWidth="2" strokeDasharray="5,5" />
      )}

      {/* Main Line */}
      <path d={mainPath} fill="none" stroke={color} strokeWidth="2" 
            strokeDasharray="2000" strokeDashoffset={drawn ? 0 : 2000} 
            style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />

      {/* Labels */}
      {data.map((d, i) => (
        <text key={i} x={getX(i)} y={height - 5} fill="var(--muted)" fontSize="10" textAnchor="middle">
          {d.label?.substring(0, 5)}
        </text>
      ))}
    </svg>
  );
}
`;

Object.keys(files).forEach(f => {
  const fullPath = path.join(srcDir, f);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, files[f]);
});
