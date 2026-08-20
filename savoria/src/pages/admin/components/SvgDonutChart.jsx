import React, { useEffect, useState } from 'react';

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
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {segments.map((seg, i) => {
            const angle = (seg.value / total) * 360;
            const dashArray = 2 * Math.PI * r;
            const dashOffset = dashArray - (dashArray * (angle / 360));
            
            const p = (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                stroke={seg.color} strokeWidth={strokeW}
                strokeDasharray={dashArray} strokeDashoffset={drawn ? dashOffset : dashArray}
                style={{ transition: 'stroke-dashoffset 1s ease-out', transformOrigin: 'center', transform: `rotate(${currentAngle}deg)` }}
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
