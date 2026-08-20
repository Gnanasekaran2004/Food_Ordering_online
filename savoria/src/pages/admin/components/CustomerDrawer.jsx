import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from './StatusBadge';

export default function CustomerDrawer({ customer, onClose }) {
  if (!customer) return null;
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
            <h2 style={{ margin: 0, color: 'var(--cream)', fontFamily: 'var(--font-display)' }}>Customer Profile</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: '2rem', border: '1px solid var(--border)' }}>
                {customer.name.substring(0,2).toUpperCase()}
              </div>
              <div>
                <div style={{ color: 'var(--cream)', fontSize: '1.5rem', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{customer.name}</div>
                <StatusBadge status={customer.status} />
              </div>
            </div>
            <div style={{ background: 'var(--surface-2)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Email</span><span style={{ color: 'var(--cream)' }}>{customer.email}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Phone</span><span style={{ color: 'var(--cream)' }}>{customer.phone}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Join Date</span><span style={{ color: 'var(--cream)' }}>{new Date(customer.joinDate).toLocaleDateString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Favorite Dish</span><span style={{ color: 'var(--cream)' }}>{customer.favoriteDish}</span></div>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, background: 'var(--surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '8px' }}>Total Orders</div>
                <div style={{ color: 'var(--cream)', fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>{customer.orders}</div>
              </div>
              <div style={{ flex: 1, background: 'var(--surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '8px' }}>Total Spent</div>
                <div style={{ color: 'var(--cream)', fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>₹{customer.totalSpent.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
