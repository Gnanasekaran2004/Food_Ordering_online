import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationPanel({ notifications, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute', top: '60px', right: '20px', width: '320px',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', zIndex: 100,
        overflow: 'hidden'
      }}
    >
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--cream)', fontSize: '1rem', fontFamily: 'var(--font-display)' }}>Notifications</h3>
        <button style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '0.8rem' }}>Mark all read</button>
      </div>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {notifications.map(n => (
          <div key={n.id} style={{
            padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '12px',
            background: n.read ? 'transparent' : 'rgba(201,168,76,0.05)'
          }}>
            <div style={{ fontSize: '1.2rem', color: n.type === 'warning' ? '#f59e0b' : n.type === 'error' ? '#ef4444' : n.type === 'success' ? '#10b981' : '#3b82f6' }}>
              {n.type === 'warning' ? '⚠' : n.type === 'error' ? '✕' : n.type === 'success' ? '✓' : 'ℹ'}
            </div>
            <div>
              <div style={{ color: 'var(--cream)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>{n.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '8px' }}>{n.message}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>{new Date(n.time).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
