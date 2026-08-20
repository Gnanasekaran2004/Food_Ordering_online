import React, { useEffect, useState } from 'react';

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
                width: drawn ? `${widthPct}%` : '0%',
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
