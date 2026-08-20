import React from 'react';

export default function SkeletonCard({ width = '100%', height = '100px', borderRadius = '12px' }) {
  return (
    <>
      <style>
        {`
          @keyframes pulseAdmin {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
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
