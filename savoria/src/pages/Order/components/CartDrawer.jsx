import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import ImagePlaceholder from '../../../components/ImagePlaceholder';
import { calcOrderSummary } from '../../../utils/orderUtils';

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const BagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

/* ── Single cart item row ────────────────────────────────────── */
function CartItem({ item }) {
  const { increaseQty, decreaseQty, removeItem } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        gap: '0.9rem',
        padding: '0.9rem 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Image */}
      <div style={{ width: '60px', height: '60px', flexShrink: 0, borderRadius: '2px', overflow: 'hidden', background: 'var(--surface-2)' }}>
        {item.image
          ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <ImagePlaceholder label="" />}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 400, color: 'var(--cream)', lineHeight: 1.25 }}>
            {item.name}
          </h4>
          <button
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-2)', display: 'flex', flexShrink: 0, padding: '2px', transition: 'color 0.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.color = '#c62828'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-2)'}
          >
            <TrashIcon />
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Qty controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1px solid var(--border)', borderRadius: '2px' }}>
            <button
              onClick={() => decreaseQty(item.id)}
              aria-label="Decrease quantity"
              style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1 }}
            >
              −
            </button>
            <span style={{ minWidth: '22px', textAlign: 'center', fontFamily: 'var(--font-label)', fontSize: '0.62rem', color: 'var(--cream)', lineHeight: '26px' }}>
              {item.qty}
            </span>
            <button
              onClick={() => increaseQty(item.id)}
              aria-label="Increase quantity"
              style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1 }}
            >
              +
            </button>
          </div>

          {/* Item subtotal */}
          <div>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.5rem', color: 'var(--muted)', marginRight: '2px' }}>₹</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--cream)', fontWeight: 400 }}>
              {(item.price * item.qty).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CART DRAWER
══════════════════════════════════════════════════════════════ */
export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, clearCart } = useCart();
  const drawerRef = useRef(null);
  const navigate = useNavigate();

  /* ── Keyboard: Escape closes ──────────────────────────────── */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  /* ── Trap body scroll while open ─────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const { tax, total } = calcOrderSummary(items);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.65)',
              zIndex: 200,
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(420px, 100vw)',
              background: 'var(--surface)',
              borderLeft: '1px solid var(--border)',
              zIndex: 201,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
              <div>
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.25rem' }}>
                  Your Order
                </p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--cream)' }}>
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close cart"
                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--muted)', transition: 'all 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
              >
                <XIcon />
              </button>
            </div>

            {/* Items list */}
            <div style={{ flex: 1, padding: '0 1.5rem', overflowY: 'auto' }}>
              {items.length === 0 ? (
                /* Empty state */
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', paddingTop: '4rem', textAlign: 'center' }}>
                  <BagIcon />
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--muted)' }}>
                    Your cart is waiting<br />for something delicious.
                  </p>
                  <button onClick={onClose} className="btn-ghost" style={{ marginTop: '0.5rem' }}>
                    <span>Continue Browsing</span>
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map(item => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer — totals + CTA */}
            {items.length > 0 && (
              <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 300 }}>Subtotal</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--cream)' }}>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 300 }}>GST (5%)</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)' }}>₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="divider-gold" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream)' }}>Total</span>
                    <div>
                      <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--gold)', marginRight: '3px' }}>₹</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 400, color: 'var(--gold)' }}>{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => { onClose(); navigate('/payment'); }}
                  className="btn-gold" 
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span>Proceed to Checkout</span>
                </button>

                <button
                  onClick={clearCart}
                  style={{ width: '100%', marginTop: '0.75rem', background: 'none', border: 'none', fontFamily: 'var(--font-label)', fontSize: '0.52rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted-2)', cursor: 'pointer', padding: '0.4rem', transition: 'color 0.2s ease' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#c62828'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-2)'}
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
