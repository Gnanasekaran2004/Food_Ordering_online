import React, { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePayment } from '../../context/PaymentContext';
import { formatINR } from '../../utils/orderUtils';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { paymentResult, clearPaymentResult } = usePayment();

  // Clean up payment result when leaving the success page
  useEffect(() => {
    return () => {
      if (paymentResult) clearPaymentResult();
    };
  }, [paymentResult, clearPaymentResult]);

  // Protect route
  if (!paymentResult) {
    return <Navigate to='/order' replace />;
  }

  const {
    orderId, amount, method, transactionId, timestamp, items
  } = paymentResult;

  const dateStr = new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div style={{ minHeight: '100svh', background: 'var(--bg)', paddingTop: '100px', paddingBottom: '6rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '600px', padding: '2rem clamp(1.5rem, 4vw, 3rem)' }}>
        
        {/* Success Animation */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{ position: 'relative', width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width='32' height='32' viewBox='0 0 24 24' fill='none'>
              <motion.path
                d='M20 6L9 17L4 12'
                stroke='var(--gold)' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              />
            </svg>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.2 }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
              style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.3)' }}
            />
          </motion.div>
        </div>

        {/* Header Text */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 300, color: 'var(--cream)', marginBottom: '0.5rem', fontStyle: 'italic' }}
          >
            Order Confirmed
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 300 }}
          >
            Thank you for your order. We are preparing it now.
          </motion.p>
        </div>

        {/* Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem', marginBottom: '2.5rem' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>Order Number</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.2rem', color: 'var(--cream)', letterSpacing: '1px' }}>{orderId}</p>
          </div>

          <div style={{ height: '1px', background: 'var(--border)', margin: '1.5rem 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.25rem' }}>Payment Method</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--cream)' }}>
                {method === 'upi' ? 'UPI' : method === 'credit' ? 'Credit Card' : 'Debit Card'}
              </p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.25rem' }}>Amount Paid</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--cream)' }}>â‚¹{formatINR(amount)}</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.25rem' }}>Transaction ID</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--cream)' }}>{transactionId}</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.25rem' }}>Date</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--cream)' }}>{dateStr}</p>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border)', margin: '1.5rem 0' }} />

          <div>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>Items summary</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items && items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--cream)' }}>{item.qty} Ã— {item.name}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)' }}>â‚¹{formatINR(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <button onClick={() => navigate('/order')} className="btn-gold" style={{ width: '100%', justifyContent: 'center', padding: '1.25rem' }}>
            <span>Order More</span>
          </button>
          <button onClick={() => navigate('/')} className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
            <span>Return to Home</span>
          </button>
        </motion.div>

      </div>
    </div>
  );
}