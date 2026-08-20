import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { usePayment } from '../../context/PaymentContext';
import { calcOrderSummary, formatINR } from '../../utils/orderUtils';
import { processPayment, generateOrderId } from '../../services/paymentService';
import { createOrder } from '../../services/orderService';
import ImagePlaceholder from '../../components/ImagePlaceholder';

/* ================================================================
   SVG ICONS
================================================================ */
const LockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const SpinnerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:'spin 1s linear infinite'}}>
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0110 10" strokeOpacity="1"/>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </svg>
);

/* ================================================================
   PAYMENT METHOD SELECTOR
================================================================ */
const METHODS = [
  { id: 'upi',    label: 'UPI',         desc: 'Pay using any UPI app' },
  { id: 'credit', label: 'Credit Card', desc: 'Visa, Mastercard, RuPay' },
  { id: 'debit',  label: 'Debit Card',  desc: 'All major banks' },
];

function MethodSelector({ selected, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {METHODS.map(m => {
        const active = selected === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem 1.25rem',
              background: active ? 'rgba(201,168,76,0.07)' : 'var(--surface-2)',
              border: active ? '1px solid var(--gold)' : '1px solid var(--border)',
              borderRadius: '6px', cursor: 'pointer', textAlign: 'left', width: '100%',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{
              width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
              border: active ? '2px solid var(--gold)' : '2px solid var(--muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'border-color 0.2s ease',
            }}>
              {active && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)' }} />}
            </span>
            <span>
              <span style={{ display: 'block', fontFamily: 'var(--font-label)', fontSize: '0.65rem', letterSpacing: '0.12em', color: active ? 'var(--gold)' : 'var(--cream)', marginBottom: '2px' }}>
                {m.label}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 300 }}>
                {m.desc}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ================================================================
   FORM FIELD
================================================================ */
function Field({ label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 400 }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#e05252' }}>{error}</span>
      )}
    </div>
  );
}

const inputStyle = (hasError) => ({
  width: '100%', padding: '0.75rem 1rem',
  background: 'var(--surface-3)', border: `1px solid ${hasError ? '#e05252' : 'var(--border)'}`,
  borderRadius: '4px', color: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
  outline: 'none', transition: 'border-color 0.2s ease',
});

/* ================================================================
   UPI FORM
================================================================ */
function UpiForm({ data, onChange, errors }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Field label="UPI ID" error={errors.upiId}>
        <input
          type="text"
          placeholder="name@okicici"
          value={data.upiId}
          onChange={e => onChange({ ...data, upiId: e.target.value })}
          style={inputStyle(!!errors.upiId)}
          autoComplete="off"
        />
      </Field>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.74rem', color: 'var(--muted)', fontWeight: 300 }}>
        Examples: mobile@upi · username@okaxis · name@ybl
      </p>
    </div>
  );
}

function validateUpi(data) {
  const errors = {};
  if (!data.upiId.trim()) errors.upiId = 'UPI ID is required';
  else if (!/^[\w.\-+]+@[\w]+$/.test(data.upiId.trim())) errors.upiId = 'Enter a valid UPI ID (e.g. name@okicici)';
  return errors;
}

/* ================================================================
   CARD FORM (Credit & Debit)
================================================================ */
function formatCardNumber(raw) {
  return raw.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return digits.slice(0, 2) + ' / ' + digits.slice(2);
  return digits;
}

function CardForm({ data, onChange, errors }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Field label="Cardholder Name" error={errors.holderName}>
        <input
          type="text"
          placeholder="As printed on card"
          value={data.holderName}
          onChange={e => onChange({ ...data, holderName: e.target.value })}
          style={inputStyle(!!errors.holderName)}
          autoComplete="cc-name"
        />
      </Field>
      <Field label="Card Number" error={errors.cardNumber}>
        <input
          type="text"
          inputMode="numeric"
          placeholder="1234 5678 9012 3456"
          value={data.cardNumber}
          onChange={e => onChange({ ...data, cardNumber: formatCardNumber(e.target.value) })}
          style={inputStyle(!!errors.cardNumber)}
          autoComplete="cc-number"
          maxLength={19}
        />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Expiry (MM / YY)" error={errors.expiry}>
          <input
            type="text"
            inputMode="numeric"
            placeholder="MM / YY"
            value={data.expiry}
            onChange={e => onChange({ ...data, expiry: formatExpiry(e.target.value) })}
            style={inputStyle(!!errors.expiry)}
            autoComplete="cc-exp"
            maxLength={7}
          />
        </Field>
        <Field label="CVV" error={errors.cvv}>
          <input
            type="password"
            inputMode="numeric"
            placeholder="•••"
            value={data.cvv}
            onChange={e => onChange({ ...data, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
            style={inputStyle(!!errors.cvv)}
            autoComplete="cc-csc"
            maxLength={4}
          />
        </Field>
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 300 }}>
        CVV is used for verification only and is not stored.
      </p>
    </div>
  );
}

function validateCard(data) {
  const errors = {};
  if (!data.holderName.trim()) errors.holderName = 'Cardholder name is required';
  const rawNum = data.cardNumber.replace(/\s/g, '');
  if (!rawNum) errors.cardNumber = 'Card number is required';
  else if (rawNum.length < 13) errors.cardNumber = 'Card number must be 13–16 digits';
  const rawExpiry = data.expiry.replace(/\s/g, '');
  if (!rawExpiry) errors.expiry = 'Expiry date is required';
  else {
    const [mm, yy] = rawExpiry.split('/').map(s => parseInt(s, 10));
    if (!mm || mm < 1 || mm > 12) errors.expiry = 'Invalid month';
    else {
      const now = new Date();
      const cardYear = 2000 + (yy || 0);
      const cardMonth = mm;
      if (cardYear < now.getFullYear() || (cardYear === now.getFullYear() && cardMonth < now.getMonth() + 1)) {
        errors.expiry = 'Card has expired';
      }
    }
  }
  if (!data.cvv) errors.cvv = 'CVV is required';
  else if (data.cvv.length < 3) errors.cvv = 'CVV must be 3–4 digits';
  return errors;
}

/* ================================================================
   ORDER SUMMARY PANEL
================================================================ */
function OrderSummary({ summary }) {
  const { items, subtotal, tax, total } = summary;
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.25rem' }}>
        Order Summary
      </p>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
        {items.map(item => (
          <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ width: '44px', height: '44px', flexShrink: 0, borderRadius: '3px', overflow: 'hidden', background: 'var(--surface-2)' }}>
              {item.image
                ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <ImagePlaceholder label="" />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--cream)', marginBottom: '2px', lineHeight: 1.3 }}>{item.name}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 300 }}>Qty {item.qty}</p>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--cream)', flexShrink: 0 }}>
              ₹{formatINR(item.price * item.qty)}
            </p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border)', marginBottom: '1rem' }} />

      {/* Totals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 300 }}>Subtotal</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--cream)' }}>₹{formatINR(subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 300 }}>GST (5%)</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)' }}>₹{formatINR(tax)}</span>
        </div>
        <div style={{ height: '1px', background: 'rgba(201,168,76,0.2)', margin: '0.2rem 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream)' }}>Total</span>
          <div>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--gold)', marginRight: '2px' }}>₹</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--gold)', fontWeight: 400 }}>{formatINR(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   PROCESSING OVERLAY
================================================================ */
function ProcessingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(6,6,6,0.92)', backdropFilter: 'blur(12px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '1.5rem',
      }}
    >
      <SpinnerIcon />
      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)' }}>
        Processing Payment
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 300, textAlign: 'center', maxWidth: '260px' }}>
        Please wait while we securely process your payment.<br />Do not close this window.
      </p>
    </motion.div>
  );
}

/* ================================================================
   MAIN PAYMENT PAGE
================================================================ */
export default function PaymentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { savePaymentResult } = usePayment();

  const summary = useMemo(() => calcOrderSummary(items), [items]);

  const [method, setMethod] = useState('upi');
  const [upiData,  setUpiData]  = useState({ upiId: '' });
  const [cardData, setCardData] = useState({ holderName: '', cardNumber: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [payError, setPayError] = useState('');

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100svh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '2rem' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontStyle: 'italic', color: 'var(--cream)', fontWeight: 300 }}>Your cart is empty.</p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 300 }}>Add dishes before proceeding to checkout.</p>
        <button onClick={() => navigate('/order')} className="btn-gold"><span>Return to Menu</span></button>
      </div>
    );
  }

  const handleMethodChange = (m) => {
    setMethod(m);
    setErrors({});
    setPayError('');
  };

  const validate = useCallback(() => {
    if (method === 'upi') return validateUpi(upiData);
    return validateCard(cardData);
  }, [method, upiData, cardData]);

  const handlePay = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setPayError('');
    setProcessing(true);

    const orderId = generateOrderId();
    try {
      const result = await processPayment({ method, amount: summary.total, orderId });
      
      // Merge items into the result so we can save it to Firestore
      const enrichedResult = { ...result, items: summary.items, subtotal: summary.subtotal, tax: summary.tax, total: summary.total };
      
      // Persist to Firestore
      if (user) {
        await createOrder(user.uid, user, enrichedResult);
      }

      savePaymentResult(enrichedResult);
      clearCart();
      navigate('/payment-success');
    } catch (err) {
      setPayError(err.message || 'Payment processing failed. Please try again.');
      setProcessing(false);
    }
  };

  const methodLabel = METHODS.find(m => m.id === method)?.label ?? '';

  return (
    <>
      {processing && <ProcessingOverlay />}

      <div style={{ minHeight: '100svh', background: 'var(--bg)', paddingBottom: '6rem' }}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)', padding: '1.1rem clamp(1.5rem,4vw,4rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', transition: 'color 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--cream)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >
              <ChevronLeft /> Back
            </button>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.9rem', letterSpacing: '0.2em', color: 'var(--cream)', textTransform: 'uppercase' }}>SAVORIA</span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 300 }}>
            <LockIcon /> Secure Checkout
          </span>
        </div>

        {/* Page title */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem clamp(1.5rem,4vw,4rem) 0' }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>Checkout</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 300, fontStyle: 'italic', color: 'var(--cream)' }}>Complete Your Order</h1>
        </div>

        {/* Two-column layout */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem clamp(1.5rem,4vw,4rem)', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 360px', gap: '2.5rem', alignItems: 'start' }} className="payment-grid">

          {/* LEFT — Payment form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

            {/* Method selector */}
            <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>Payment Method</p>
              <MethodSelector selected={method} onChange={handleMethodChange} />
            </section>

            {/* Method-specific form */}
            <AnimatePresence mode="wait">
              <motion.section
                key={method}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}
              >
                <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.25rem' }}>
                  {methodLabel} Details
                </p>
                {method === 'upi'
                  ? <UpiForm data={upiData} onChange={setUpiData} errors={errors} />
                  : <CardForm data={cardData} onChange={setCardData} errors={errors} />
                }
              </motion.section>
            </AnimatePresence>

            {/* Pay button (desktop) */}
            <div className="pay-btn-desktop">
              {payError && (
                <div style={{ padding: '0.85rem 1rem', background: 'rgba(224,82,82,0.1)', border: '1px solid rgba(224,82,82,0.3)', borderRadius: '6px', marginBottom: '1rem', fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#e05252' }}>
                  {payError}
                </div>
              )}
              <button
                onClick={handlePay}
                disabled={processing}
                className="btn-gold"
                style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '0.7rem', letterSpacing: '0.15em', opacity: processing ? 0.6 : 1, cursor: processing ? 'not-allowed' : 'pointer' }}
              >
                {processing ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><SpinnerIcon /> Processing...</span>
                ) : (
                  <span>Pay ₹{formatINR(summary.total)}</span>
                )}
              </button>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 300, textAlign: 'center', marginTop: '0.75rem' }}>
                Payment details are securely handled. This is a demo checkout.
              </p>
            </div>
          </div>

          {/* RIGHT — Order summary */}
          <div style={{ position: 'sticky', top: '1.5rem' }}>
            <OrderSummary summary={summary} />

            {/* Pay button mobile */}
            <div className="pay-btn-mobile" style={{ marginTop: '1rem' }}>
              {payError && (
                <div style={{ padding: '0.85rem 1rem', background: 'rgba(224,82,82,0.1)', border: '1px solid rgba(224,82,82,0.3)', borderRadius: '6px', marginBottom: '0.75rem', fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#e05252' }}>
                  {payError}
                </div>
              )}
              <button
                onClick={handlePay}
                disabled={processing}
                className="btn-gold"
                style={{ width: '100%', justifyContent: 'center', padding: '1rem', opacity: processing ? 0.6 : 1, cursor: processing ? 'not-allowed' : 'pointer' }}
              >
                {processing ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><SpinnerIcon /> Processing...</span> : <span>Pay ₹{formatINR(summary.total)}</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 780px) {
          .payment-grid { grid-template-columns: 1fr !important; }
          .pay-btn-desktop { display: none !important; }
          .pay-btn-mobile { display: block !important; }
        }
        @media (min-width: 781px) {
          .pay-btn-mobile { display: none !important; }
          .pay-btn-desktop { display: block; }
        }
      `}</style>
    </>
  );
}
