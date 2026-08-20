import React, { useState } from 'react';
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
