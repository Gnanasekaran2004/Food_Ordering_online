const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const files = {};

files['pages/admin/pages/DashboardPage.jsx'] = `import React, { useState } from 'react';
import { useAdminData } from '../hooks/useAdminData';
import KpiCard from '../components/KpiCard';
import DateRangePicker from '../components/DateRangePicker';
import SvgLineChart from '../components/SvgLineChart';
import SvgBarChart from '../components/SvgBarChart';
import SvgDonutChart from '../components/SvgDonutChart';
import StatusBadge from '../components/StatusBadge';

export default function DashboardPage() {
  const [range, setRange] = useState('30d');
  const { loading, summary, traffic, revenue, orderStatusData, topDishes, kitchenMetrics, activity, notifications } = useAdminData(range);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Overview</h2>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <KpiCard label="Website Views" value={summary.views} trend={summary.viewsTrend} trendPositive={true} icon="👁️" loading={loading} />
        <KpiCard label="Total Orders" value={summary.orders} trend={summary.ordersTrend} trendPositive={true} icon="🛒" loading={loading} />
        <KpiCard label="Revenue" value={summary.revenue} trend={summary.revenueTrend} trendPositive={true} icon="₹" loading={loading} />
        <KpiCard label="Avg Order Value" value={summary.avgOrderValue} trend={summary.aovTrend} trendPositive={true} icon="📈" loading={loading} />
        <KpiCard label="Total Customers" value={summary.customers} icon="👥" loading={loading} />
        <KpiCard label="Reservations" value={summary.reservations} icon="📅" loading={loading} />
        <KpiCard label="Conversion Rate" value={summary.conversionRate} icon="⚡" loading={loading} />
        <KpiCard label="Completion Rate" value={summary.completionRate} icon="✅" loading={loading} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--gold)', fontSize: '1rem' }}>Website Views</h3>
          {loading ? <div style={{ height: 200 }} /> : <SvgLineChart data={traffic} color="#3b82f6" />}
        </div>
        <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--gold)', fontSize: '1rem' }}>Revenue Trend (₹)</h3>
          {loading ? <div style={{ height: 200 }} /> : <SvgLineChart data={revenue} color="#10b981" showPrev={true} />}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--gold)', fontSize: '1rem' }}>Order Status</h3>
          {loading ? <div style={{ height: 200 }} /> : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SvgDonutChart segments={[
                { label: 'Pending', value: orderStatusData.pending, color: '#f59e0b' },
                { label: 'Preparing', value: orderStatusData.preparing, color: '#f97316' },
                { label: 'Completed', value: orderStatusData.completed, color: '#10b981' },
                { label: 'Cancelled', value: orderStatusData.cancelled, color: '#ef4444' }
              ]} />
            </div>
          )}
        </div>
        <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--gold)', fontSize: '1rem' }}>Top Dishes</h3>
          {loading ? <div style={{ height: 200 }} /> : <SvgBarChart data={topDishes.map(d => ({ label: d.name, value: d.orders, sub: d.category }))} color="#C9A84C" />}
        </div>
      </div>

      <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--gold)', fontSize: '1rem' }}>Kitchen Performance</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          {Object.entries(kitchenMetrics).map(([k, v]) => (
            <div key={k} style={{ background: 'var(--surface-2)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '8px' }}>{k.replace(/([A-Z])/g, ' $1').trim()}</div>
              <div style={{ color: 'var(--cream)', fontSize: '1.25rem', fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: '3 1 400px', background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--gold)', fontSize: '1rem' }}>Live Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activity.slice(0, 5).map(a => (
              <div key={a.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.type === 'Orders' ? '#3b82f6' : 'var(--gold)' }} />
                <div style={{ flex: 1, color: 'var(--cream)', fontSize: '0.85rem' }}>{a.message}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{new Date(a.time).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: '2 1 300px', background: 'var(--surface)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--gold)', fontSize: '1rem' }}>Recent Notifications</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.slice(0, 3).map(n => (
              <div key={n.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ fontSize: '1rem', color: n.type === 'warning' ? '#f59e0b' : '#3b82f6' }}>{n.type === 'warning' ? '⚠' : 'ℹ'}</div>
                <div>
                  <div style={{ color: 'var(--cream)', fontSize: '0.85rem' }}>{n.title}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{new Date(n.time).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
`;

files['pages/admin/pages/OrdersPage.jsx'] = `import React, { useState } from 'react';
import { useAdminData } from '../hooks/useAdminData';
import AdminTable from '../components/AdminTable';
import StatusBadge from '../components/StatusBadge';
import OrderDrawer from '../components/OrderDrawer';

export default function OrdersPage() {
  const { orders } = useAdminData('30d');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'date', label: 'Date', render: (r) => new Date(r.date).toLocaleString() },
    { key: 'items', label: 'Items' },
    { key: 'amount', label: 'Amount', render: (r) => \`₹\${r.amount.toLocaleString()}\` },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'payment', label: 'Payment', render: (r) => <StatusBadge status={r.payment} /> },
    { key: 'actions', label: 'Actions', render: (r) => <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(r); }} style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--cream)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>View</button> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Orders</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['All', 'Pending', 'Preparing', 'Completed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              background: statusFilter === s ? 'var(--gold)' : 'var(--surface)',
              color: statusFilter === s ? 'black' : 'var(--muted)',
              border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: statusFilter === s ? 600 : 400
            }}>{s}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <input type="text" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none' }} />
      </div>
      <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <AdminTable columns={columns} data={filtered} onRowClick={setSelectedOrder} emptyMessage="No orders found." />
      </div>
      <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
`;

files['pages/admin/pages/CustomersPage.jsx'] = `import React, { useState } from 'react';
import { useAdminData } from '../hooks/useAdminData';
import AdminTable from '../components/AdminTable';
import StatusBadge from '../components/StatusBadge';
import CustomerDrawer from '../components/CustomerDrawer';
import KpiCard from '../components/KpiCard';

export default function CustomersPage() {
  const { customers } = useAdminData('30d');
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key: 'name', label: 'Customer', render: (r) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 600 }}>{r.name.substring(0,2).toUpperCase()}</div>
        <div><div style={{ color: 'var(--cream)' }}>{r.name}</div><div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{r.email}</div></div>
      </div>
    )},
    { key: 'orders', label: 'Orders' },
    { key: 'totalSpent', label: 'Total Spent', render: (r) => \`₹\${r.totalSpent.toLocaleString()}\` },
    { key: 'lastOrder', label: 'Last Order', render: (r) => new Date(r.lastOrder).toLocaleDateString() },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: 'Actions', render: (r) => <button onClick={(e) => { e.stopPropagation(); setSelectedCustomer(r); }} style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--cream)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>View</button> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Customers</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <KpiCard label="Total Customers" value={customers.length} icon="👥" loading={false} />
        <KpiCard label="Active Now" value={customers.filter(c => c.status === 'Active').length} icon="⚡" loading={false} />
        <KpiCard label="Avg Lifetime Value" value={Math.floor(customers.reduce((a,c)=>a+c.totalSpent,0)/customers.length)} icon="₹" loading={false} />
      </div>
      <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', maxWidth: '400px', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none' }} />
      <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <AdminTable columns={columns} data={filtered} onRowClick={setSelectedCustomer} emptyMessage="No customers found." />
      </div>
      <CustomerDrawer customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
    </div>
  );
}
`;

files['pages/admin/pages/MenuPage.jsx'] = `import React, { useState } from 'react';
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
`;

files['pages/admin/pages/ReservationsPage.jsx'] = `import React from 'react';
import { useAdminData } from '../hooks/useAdminData';
import AdminTable from '../components/AdminTable';
import StatusBadge from '../components/StatusBadge';
import KpiCard from '../components/KpiCard';

export default function ReservationsPage() {
  const { reservations } = useAdminData('30d');

  const columns = [
    { key: 'id', label: 'Res ID' },
    { key: 'name', label: 'Name' },
    { key: 'party', label: 'Party Size' },
    { key: 'date', label: 'Date', render: r => new Date(r.date).toLocaleDateString() },
    { key: 'time', label: 'Time' },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'notes', label: 'Notes', render: r => <span style={{ color: 'var(--muted)' }}>{r.notes || '-'}</span> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Reservations</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <KpiCard label="Total" value={reservations.length} icon="📅" />
        <KpiCard label="Upcoming" value={reservations.filter(r=>r.status==='Upcoming').length} icon="⏳" />
        <KpiCard label="Completed" value={reservations.filter(r=>r.status==='Completed').length} icon="✅" />
        <KpiCard label="Cancelled" value={reservations.filter(r=>r.status==='Cancelled').length} icon="✕" trendPositive={false} />
      </div>
      <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <AdminTable columns={columns} data={reservations} />
      </div>
    </div>
  );
}
`;

files['pages/admin/pages/AnalyticsPage.jsx'] = `import React, { useState } from 'react';
import { useAdminData } from '../hooks/useAdminData';
import DateRangePicker from '../components/DateRangePicker';
import SvgLineChart from '../components/SvgLineChart';
import SvgDonutChart from '../components/SvgDonutChart';
import SvgBarChart from '../components/SvgBarChart';

export default function AnalyticsPage() {
  const [range, setRange] = useState('30d');
  const { traffic, revenue, topDishes } = useAdminData(range);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Analytics</h2>
        <DateRangePicker value={range} onChange={setRange} />
      </div>
      
      <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <h3 style={{ margin: '0 0 24px 0', color: 'var(--gold)', fontSize: '1.2rem' }}>Website Traffic</h3>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <SvgLineChart data={traffic} color="#3b82f6" height={300} />
          </div>
          <div style={{ width: 250, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--surface-2)', padding: '16px', borderRadius: '8px' }}>
              <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '8px' }}>Total Views</div>
              <div style={{ color: 'var(--cream)', fontSize: '1.5rem', fontWeight: 600 }}>{traffic.reduce((a,c)=>a+c.views,0).toLocaleString()}</div>
            </div>
            <div style={{ background: 'var(--surface-2)', padding: '16px', borderRadius: '8px' }}>
              <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '8px' }}>Unique Visitors</div>
              <div style={{ color: 'var(--cream)', fontSize: '1.5rem', fontWeight: 600 }}>{traffic.reduce((a,c)=>a+c.unique,0).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 24px 0', color: 'var(--gold)', fontSize: '1.2rem' }}>Customer Acquisition</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SvgDonutChart segments={[
              { label: 'New', value: 45, color: '#10b981' },
              { label: 'Returning', value: 120, color: '#3b82f6' }
            ]} />
          </div>
        </div>
        <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 24px 0', color: 'var(--gold)', fontSize: '1.2rem' }}>Top Dishes Performance</h3>
          <SvgBarChart data={topDishes.map(d => ({ label: d.name, value: d.revenue, sub: d.category }))} color="#C9A84C" />
        </div>
      </div>
    </div>
  );
}
`;

files['pages/admin/pages/ActivityPage.jsx'] = `import React, { useState } from 'react';
import { useAdminData } from '../hooks/useAdminData';

export default function ActivityPage() {
  const { activity } = useAdminData('30d');
  const [filter, setFilter] = useState('All');
  const [limit, setLimit] = useState(10);

  const types = ['All', 'Orders', 'Customers', 'Reservations', 'Menu', 'System'];
  const filtered = activity.filter(a => filter === 'All' || a.type === filter);

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
                <div style={{ color: 'var(--cream)', fontSize: '0.95rem' }}>{a.message}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '4px' }}>
                  <span style={{ color: 'var(--gold)', marginRight: '8px' }}>{a.type}</span>
                  {new Date(a.time).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
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
`;

files['pages/admin/pages/SettingsPage.jsx'] = `import React, { useState } from 'react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Settings</h2>
        <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Settings will persist once Firebase is connected</span>
      </div>
      
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--gold)', fontSize: '1.1rem' }}>Restaurant Profile</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Restaurant Name</label>
              <input type="text" defaultValue="SAVORIA" style={{ width: '100%', padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Tagline</label>
              <input type="text" defaultValue="A Culinary Journey of Excellence" style={{ width: '100%', padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Description</label>
              <textarea rows={4} defaultValue="Experience fine dining at its best." style={{ width: '100%', padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none', resize: 'vertical' }} />
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--gold)', fontSize: '1.1rem' }}>Business Hours</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ width: 100, color: 'var(--cream)', fontSize: '0.9rem' }}>{d}</span>
                <input type="time" defaultValue="17:00" style={{ padding: '8px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '4px', outline: 'none' }} />
                <span style={{ color: 'var(--muted)' }}>to</span>
                <input type="time" defaultValue="23:00" style={{ padding: '8px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '4px', outline: 'none' }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: 'var(--gold)', fontSize: '1.1rem' }}>Admin Preferences</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--cream)', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Enable Email Notifications
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--cream)', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Enable Order Alerts Sound
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button type="submit" style={{ background: 'var(--gold)', color: 'black', border: 'none', padding: '12px 32px', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Save Changes</button>
          {saved && <span style={{ color: '#10b981', fontSize: '0.9rem' }}>✓ Changes saved successfully</span>}
        </div>
      </form>
    </div>
  );
}
`;

files['pages/admin/AdminApp.jsx'] = `import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from '../../context/AdminAuthContext';
import AdminLayout from './AdminLayout';
import AdminLoginPage from './auth/AdminLoginPage';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const CustomersPage = lazy(() => import('./pages/CustomersPage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const ReservationsPage = lazy(() => import('./pages/ReservationsPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const ActivityPage = lazy(() => import('./pages/ActivityPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function ProtectedAdminRoute({ children }) {
  const { isAdmin, loading } = useAdminAuth();
  if (loading) return <div style={{ height: '100vh', background: 'var(--bg)' }} />;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Suspense fallback={<div style={{ height: '100vh', background: 'var(--bg)' }} />}>
        <Routes>
          <Route path="login" element={<AdminLoginPage />} />
          
          <Route path="/" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="activity" element={<ActivityPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<div style={{ padding: 40, color: 'white' }}>404 Admin Page Not Found</div>} />
          </Route>
        </Routes>
      </Suspense>
    </AdminAuthProvider>
  );
}
`;

Object.keys(files).forEach(f => {
  const fullPath = path.join(srcDir, f);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, files[f]);
});
console.log('Batch 3 done.');
