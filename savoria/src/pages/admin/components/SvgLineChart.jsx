import React, { useEffect, useState } from 'react';

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
      return `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(val)}`;
    }).join(' ');
  };

  const mainPath = makePath('value') || makePath('views') || makePath('revenue');
  const prevPath = showPrev ? makePath('prev') : '';

  const areaPath = mainPath.replace('M', 'M') + ` L ${getX(data.length - 1)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
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
