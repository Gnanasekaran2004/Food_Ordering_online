import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../../../context/CartContext';

const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

export default function FloatingCart({ onClick }) {
  const { totalItems, subtotal } = useCart();

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.button
          key="floating-cart"
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1,   y: 0  }}
          exit={{   opacity: 0, scale: 0.7,  y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          onClick={onClick}
          aria-label={`Open cart — ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
          style={{
            position: 'fixed',
            bottom: 'clamp(1.5rem, 4vh, 2.5rem)',
            right:  'clamp(1.5rem, 4vw, 2.5rem)',
            zIndex: 150,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.8rem 1.35rem',
            background: 'var(--gold)',
            border: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(201,168,76,0.25), 0 2px 8px rgba(0,0,0,0.5)',
            transition: 'box-shadow 0.25s ease, transform 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(201,168,76,0.4), 0 4px 12px rgba(0,0,0,0.5)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(201,168,76,0.25), 0 2px 8px rgba(0,0,0,0.5)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {/* Icon + badge */}
          <span style={{ position: 'relative', display: 'flex', color: 'var(--bg)' }}>
            <CartIcon />
            <motion.span
              key={totalItems}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              aria-hidden
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'var(--bg)',
                color: 'var(--gold)',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-label)',
                fontSize: '0.5rem',
                fontWeight: 700,
                letterSpacing: 0,
              }}
            >
              {totalItems > 9 ? '9+' : totalItems}
            </motion.span>
          </span>

          {/* Subtotal */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--font-label)', fontSize: '0.5rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(6,6,6,0.7)', lineHeight: 1 }}>
              View Cart
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 400, color: 'var(--bg)', lineHeight: 1.2 }}>
              ₹{subtotal.toLocaleString('en-IN')}
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
