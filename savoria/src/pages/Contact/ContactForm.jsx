import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { contactData } from '../../data/contactData';

/* ── Reusable styled input ─────────────────────────────────── */
function Field({ label, id, error, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: 'var(--font-label)',
          fontSize: '0.52rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: error ? '#e05c5c' : 'var(--muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}
      >
        {label}
        {required && (
          <span style={{ color: 'var(--gold)', opacity: 0.7 }} aria-hidden>*</span>
        )}
      </label>
      {children}
      {error && (
        <span
          role="alert"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.72rem',
            color: '#e05c5c',
            fontWeight: 300,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

const inputStyle = (hasError) => ({
  width: '100%',
  padding: '0.85rem 1rem',
  background: 'rgba(255,255,255,0.025)',
  border: `1px solid ${hasError ? 'rgba(224,92,92,0.5)' : 'rgba(255,255,255,0.08)'}`,
  borderRadius: '2px',
  color: 'var(--cream)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  fontWeight: 300,
  outline: 'none',
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
});

const focusStyle = {
  borderColor: 'rgba(201,168,76,0.45)',
  background: 'rgba(201,168,76,0.03)',
  boxShadow: '0 0 0 3px rgba(201,168,76,0.06)',
};

/* ── Validate helpers ─────────────────────────────────────── */
function validateForm(values) {
  const errors = {};
  if (!values.name.trim())             errors.name    = 'Please enter your name.';
  if (!values.email.trim())            errors.email   = 'Please enter your email.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
                                       errors.email   = 'Please enter a valid email address.';
  if (!values.message.trim())          errors.message = 'Please enter a message.';
  else if (values.message.trim().length < 10)
                                       errors.message = 'Message must be at least 10 characters.';
  return errors;
}

/* ══════════════════════════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════════════════════════ */
export default function ContactForm() {
  const [values, setValues]   = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus]   = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [focused, setFocused] = useState(null);

  const set = (field) => (e) => {
    setValues(v => ({ ...v, [field]: e.target.value }));
    if (touched[field]) {
      const errs = validateForm({ ...values, [field]: e.target.value });
      setErrors(prev => ({ ...prev, [field]: errs[field] }));
    }
  };

  const blur = (field) => () => {
    setTouched(t => ({ ...t, [field]: true }));
    const errs = validateForm(values);
    setErrors(prev => ({ ...prev, [field]: errs[field] }));
  };

  const getFocusStyle = (field) => focused === field ? focusStyle : {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = { name: true, email: true, phone: true, subject: true, message: true };
    setTouched(allTouched);
    const errs = validateForm(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('loading');
    // Simulated API call — replace with real endpoint when ready
    await new Promise(r => setTimeout(r, 1600));
    setStatus('success');
  };

  /* ── Success state ────────────────────────────────────────── */
  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: '3px',
          background: 'rgba(201,168,76,0.03)',
        }}
      >
        {/* Gold ring checkmark */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          border: '1.5px solid var(--gold)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 300, color: 'var(--cream)', marginBottom: '0.75rem' }}>
          Message Received
        </h3>
        <div style={{ width: '40px', height: '1px', background: 'var(--gold)', margin: '0 auto 1rem', opacity: 0.6 }} />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--muted)', fontWeight: 300, lineHeight: 1.8, maxWidth: '340px', margin: '0 auto 1.5rem' }}>
          Thank you for reaching out. Our team will respond within 24 hours.
        </p>
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.5rem', letterSpacing: '0.18em', color: 'var(--muted-2)', textTransform: 'uppercase' }}>
          Demo submission — no data was sent
        </p>
        <button
          onClick={() => { setStatus('idle'); setValues({ name: '', email: '', phone: '', subject: '', message: '' }); setTouched({}); setErrors({}); }}
          style={{ marginTop: '1.5rem', background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--muted)', padding: '0.6rem 1.4rem', borderRadius: '2px', fontFamily: 'var(--font-label)', fontSize: '0.52rem', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s ease' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--muted)'; }}
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
      <div style={{ display: 'grid', gap: '1.25rem' }}>

        {/* Name + Email row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
          <Field label="Name" id="contact-name" error={touched.name && errors.name} required>
            <input
              id="contact-name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={set('name')}
              onBlur={blur('name')}
              onFocus={() => setFocused('name')}
              placeholder="Your name"
              style={{ ...inputStyle(touched.name && errors.name), ...getFocusStyle('name') }}
              aria-describedby={errors.name ? 'err-name' : undefined}
              aria-invalid={!!(touched.name && errors.name)}
            />
          </Field>

          <Field label="Email" id="contact-email" error={touched.email && errors.email} required>
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={set('email')}
              onBlur={blur('email')}
              onFocus={() => setFocused('email')}
              placeholder="your@email.com"
              style={{ ...inputStyle(touched.email && errors.email), ...getFocusStyle('email') }}
              aria-invalid={!!(touched.email && errors.email)}
            />
          </Field>
        </div>

        {/* Phone + Subject row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
          <Field label="Phone" id="contact-phone">
            <input
              id="contact-phone"
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={set('phone')}
              onFocus={() => setFocused('phone')}
              onBlur={() => setFocused(null)}
              placeholder="+91 00000 00000 (optional)"
              style={{ ...inputStyle(false), ...getFocusStyle('phone') }}
            />
          </Field>

          <Field label="Inquiry Type" id="contact-subject">
            <select
              id="contact-subject"
              value={values.subject}
              onChange={set('subject')}
              onFocus={() => setFocused('subject')}
              onBlur={() => setFocused(null)}
              style={{
                ...inputStyle(false),
                ...getFocusStyle('subject'),
                cursor: 'pointer',
                WebkitAppearance: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C9A84C' stroke-width='1.2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                paddingRight: '2.5rem',
                color: values.subject ? 'var(--cream)' : 'rgba(92,81,71,0.8)',
              }}
            >
              <option value="" disabled hidden>Select type</option>
              {contactData.inquiryTypes.map(t => (
                <option key={t} value={t} style={{ background: '#0E0E0E', color: 'var(--cream)' }}>{t}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Message */}
        <Field label="Message" id="contact-message" error={touched.message && errors.message} required>
          <textarea
            id="contact-message"
            rows={5}
            value={values.message}
            onChange={set('message')}
            onBlur={blur('message')}
            onFocus={() => setFocused('message')}
            placeholder="How can we help you?"
            style={{
              ...inputStyle(touched.message && errors.message),
              ...getFocusStyle('message'),
              resize: 'vertical',
              minHeight: '120px',
            }}
            aria-invalid={!!(touched.message && errors.message)}
          />
        </Field>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            width: '100%',
            padding: '1rem',
            background: status === 'loading' ? 'rgba(201,168,76,0.08)' : 'transparent',
            border: '1px solid var(--gold)',
            color: 'var(--gold)',
            fontFamily: 'var(--font-label)',
            fontSize: '0.65rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            cursor: status === 'loading' ? 'wait' : 'pointer',
            borderRadius: '2px',
            transition: 'background 0.35s ease, color 0.35s ease, transform 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            marginTop: '0.25rem',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            if (status !== 'loading') {
              e.currentTarget.style.background = 'var(--gold)';
              e.currentTarget.style.color = '#060606';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--gold)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          aria-label={status === 'loading' ? 'Sending message…' : 'Send message'}
        >
          {status === 'loading' ? (
            <>
              <span style={{
                display: 'inline-block',
                width: '12px', height: '12px',
                border: '1px solid rgba(201,168,76,0.3)',
                borderTopColor: 'var(--gold)',
                borderRadius: '50%',
                animation: 'contact-spin 0.7s linear infinite',
              }} />
              Sending…
            </>
          ) : (
            'Send Message'
          )}
        </button>

      </div>

      {/* Styles */}
      <style>{`
        @keyframes contact-spin {
          to { transform: rotate(360deg); }
        }
        .form-row {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
        input::placeholder, textarea::placeholder { color: rgba(92,81,71,0.6); }
        select option { background: #0E0E0E; }
      `}</style>
    </form>
  );
}
