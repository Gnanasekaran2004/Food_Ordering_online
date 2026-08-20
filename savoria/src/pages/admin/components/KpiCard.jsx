import React, { useState, useEffect } from 'react';
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
