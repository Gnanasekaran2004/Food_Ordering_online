import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from './StatusBadge';

export default function OrderDrawer({ order, onClose }) {
  if (!order) return null;
  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: '450px', maxWidth: '100%',
            background: 'var(--bg)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column'
          }}
        >
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>Order {order.id}</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div><span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Customer</span><div style={{ color: 'var(--cream)' }}>{order.customer}</div><div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{order.email}</div></div>
              <div style={{ textAlign: 'right' }}><span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Date</span><div style={{ color: 'var(--cream)' }}>{new Date(order.date).toLocaleString()}</div></div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
              <div><span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Status</span><div style={{ marginTop: '4px' }}><StatusBadge status={order.status} /></div></div>
              <div><span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Payment</span><div style={{ marginTop: '4px' }}><StatusBadge status={order.payment} /></div></div>
              
              <div style={{ marginLeft: 'auto' }}>
                <select 
                  onChange={(e) => onClose(order, e.target.value)}
                  value={order.status}
                  style={{
                    background: 'var(--surface)', color: 'var(--cream)',
                    border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '4px'
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Ready">Ready</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div>
              <h3 style={{ color: 'var(--gold)', fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Items</h3>
              {order.orderItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--surface-3)' }}>
                  <div style={{ color: 'var(--cream)' }}>{item.qty}x {item.name}</div>
                  <div style={{ color: 'var(--cream)' }}>₹{(item.qty * item.price).toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--surface-2)', padding: '16px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--muted)' }}><span>Subtotal</span><span>₹{order.amount.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--muted)' }}><span>Tax (5%)</span><span>₹{(order.amount * 0.05).toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '16px', color: 'var(--cream)', fontSize: '1.2rem', fontWeight: 600 }}><span>Total</span><span>₹{(order.amount * 1.05).toLocaleString()}</span></div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
