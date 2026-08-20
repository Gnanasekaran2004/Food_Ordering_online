import React from 'react';

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
      border: `1px solid ${color}40`
    }}>
      {status}
    </span>
  );
}
