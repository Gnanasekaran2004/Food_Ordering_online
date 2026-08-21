import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
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
