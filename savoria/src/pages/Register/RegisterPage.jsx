import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

/* ═══════════════════════════════════════════════════════════════
   SAVORIA — REGISTER PAGE
   Premium account creation experience.
═══════════════════════════════════════════════════════════════ */

function mapError(err) {
  const map = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/username-taken':       'This username is already taken. Please choose another.',
    'auth/weak-password':        'Your password is too weak. Please choose a stronger one.',
  };
  return map[err?.code] || (err?.message || 'Something went wrong. Please try again.');
}

/* ── Password strength ─────────────────────────────────────── */
function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}
const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', '#e05c5c', '#e2a84a', '#8bc34a', '#4caf50'];

function StrengthBar({ password }) {
  if (!password) return null;
  const score = getStrength(password);
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '0.3rem' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: '2px', borderRadius: '2px',
            background: i <= score ? STRENGTH_COLORS[score] : 'rgba(255,255,255,0.08)',
            transition: 'background 0.35s ease',
          }} />
        ))}
      </div>
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: '0.72rem',
        color: STRENGTH_COLORS[score], fontWeight: 300,
        transition: 'color 0.35s ease',
      }}>
        {STRENGTH_LABELS[score]}
      </p>
    </div>
  );
}

/* ── AuthInput ─────────────────────────────────────────────── */
function AuthInput({ label, type = 'text', value, onChange, error, autoComplete, hint, rightElement }) {
  const [focused, setFocused] = useState(false);
  const id = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label htmlFor={id} style={{
        fontFamily: 'var(--font-label)', fontSize: '0.5rem', letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: error ? 'rgba(224,92,92,0.8)' : focused ? 'var(--gold)' : 'var(--muted)',
        transition: 'color 0.3s ease',
      }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          id={id} type={type} value={value} onChange={onChange}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: rightElement ? '0.85rem 3rem 0.85rem 0' : '0.85rem 0',
            background: 'transparent', border: 'none',
            borderBottom: `1px solid ${error ? 'rgba(224,92,92,0.5)' : focused ? 'var(--gold)' : 'rgba(255,255,255,0.12)'}`,
            color: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: '0.95rem',
            fontWeight: 300, outline: 'none', transition: 'border-color 0.3s ease',
          }}
        />
        {rightElement && (
          <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
            {rightElement}
          </div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(224,92,92,0.8)', fontWeight: 300, margin: 0 }}>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 300, margin: 0 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function EyeToggle({ show, onToggle }) {
  return (
    <button type="button" onClick={onToggle} aria-label={show ? 'Hide password' : 'Show password'}
      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s ease' }}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
      {show ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
        </svg>
      )}
    </button>
  );
}

export default function RegisterPage() {
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, authLoading, navigate]);

  const [form, setForm] = useState({
    displayName: '', username: '', email: '', password: '', confirmPassword: '', phone: '',
  });
  const [errors, setErrors]     = useState({});
  const [showPw, setShowPw]     = useState(false);
  const [showCpw, setShowCpw]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [globalError, setGlobalError] = useState('');

  const [verificationSent, setVerificationSent] = useState(false);

  const setField = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrors(er => ({ ...er, [key]: '' }));
    setGlobalError('');
  };

  function validate() {
    const errs = {};
    if (!form.displayName.trim()) errs.displayName = 'Full name is required.';
    if (!form.username.trim())    errs.username    = 'Username is required.';
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username.trim()))
      errs.username = 'Username must be 3–20 characters: letters, numbers, underscores only.';
    if (!form.email)              errs.email    = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.';
    if (!form.password)           errs.password = 'Password is required.';
    else if (getStrength(form.password) < 2) errs.password = 'Password is too weak. Add uppercase, numbers, or symbols.';
    if (!form.confirmPassword)    errs.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setGlobalError('');
    try {
      await register({
        displayName: form.displayName.trim(),
        username:    form.username.trim(),
        email:       form.email.trim(),
        password:    form.password,
        phone:       form.phone.trim(),
      });
      setVerificationSent(true);
    } catch (err) {
      setGlobalError(mapError(err));
    } finally {
      setLoading(false);
    }
  }

  // Staggered field entrance delays
  const fields = [
    { key: 'displayName', label: 'Full Name', autoComplete: 'name', hint: 'This is how your name will appear.' },
    { key: 'username',    label: 'Username',  autoComplete: 'username', hint: 'Letters, numbers and underscores only.' },
    { key: 'email',       label: 'Email',     autoComplete: 'email', type: 'email' },
    { key: 'password',    label: 'Password',  autoComplete: 'new-password', type: showPw ? 'text' : 'password' },
    { key: 'confirmPassword', label: 'Confirm Password', autoComplete: 'new-password', type: showCpw ? 'text' : 'password' },
    { key: 'phone',       label: 'Phone (optional)', autoComplete: 'tel', type: 'tel' },
  ];

  return (
    <div className="page-enter" style={{
      minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 'clamp(5rem, 10vw, 6rem) clamp(1.5rem, 5vw, 3rem) 3rem',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div aria-hidden style={{
        position: 'absolute', top: 0, right: 0,
        width: '500px', height: '500px',
        background: 'radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px', opacity: 0.4,
      }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
        {/* Emblem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              width: '48px', height: '48px', borderRadius: '50%',
              border: '1px solid rgba(201,168,76,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-label)', fontSize: '1rem', color: 'var(--gold)',
              background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)',
            }}>S</span>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', letterSpacing: '0.3em', color: 'var(--cream)', textTransform: 'uppercase' }}>Savoria</span>
          </Link>
        </motion.div>

        <AnimatePresence mode="wait">
          {verificationSent ? (
            <motion.div
              key="verification"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                border: '1px solid rgba(201,168,76,0.3)'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: '2rem',
                fontWeight: 300, color: 'var(--cream)', marginBottom: '1rem',
              }}>Verify Your Email</h1>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                color: 'var(--muted)', fontWeight: 300, marginBottom: '2rem', lineHeight: 1.6,
              }}>
                We've sent a verification link to <strong>{form.email}</strong>.<br />
                Please check your inbox (and spam folder) to activate your account.
              </p>
              
              <Link to="/login" className="btn-gold" style={{ display: 'inline-flex', justifyContent: 'center', padding: '1rem 2rem' }}>
                <span>Continue to Sign In</span>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                <div className="section-label" style={{ marginBottom: '1.25rem' }}>Welcome to Savoria</div>
                <h1 style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1, marginBottom: '0.75rem',
                }}>Make Your Table Yours.</h1>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                  color: 'var(--muted)', fontWeight: 300, marginBottom: '2.5rem', lineHeight: 1.7,
                }}>
                  Create your SAVORIA account for a more personal dining experience.
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2rem' }}>
                  {fields.map((f, i) => (
                    <motion.div key={f.key}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <AuthInput
                        label={f.label} type={f.type || 'text'}
                        value={form[f.key]} onChange={setField(f.key)}
                        error={errors[f.key]} autoComplete={f.autoComplete} hint={f.hint}
                        rightElement={
                          f.key === 'password'        ? <EyeToggle show={showPw}  onToggle={() => setShowPw(v => !v)} />
                          : f.key === 'confirmPassword' ? <EyeToggle show={showCpw} onToggle={() => setShowCpw(v => !v)} />
                          : null
                        }
                      />
                      {f.key === 'password' && <StrengthBar password={form.password} />}
                    </motion.div>
                  ))}
                </div>

                <AnimatePresence>
                  {globalError && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{
                        padding: '0.75rem 1rem', background: 'rgba(224,92,92,0.06)',
                        border: '1px solid rgba(224,92,92,0.2)', borderRadius: '2px', marginBottom: '1.5rem',
                        fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(224,92,92,0.8)', fontWeight: 300,
                      }}>
                      {globalError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}>
                  <button type="submit" className="btn-gold"
                    style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem', opacity: loading ? 0.7 : 1 }}
                    disabled={loading}>
                    <span>{loading ? 'Creating account…' : 'Create Account'}</span>
                  </button>
                </motion.div>
              </form>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}
                style={{
                  textAlign: 'center', marginTop: '2rem',
                  borderTop: '1px solid var(--border)', paddingTop: '2rem',
                  fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 300,
                }}>
                Already have an account?{' '}
                <Link to="/login" style={{
                  color: 'var(--gold)', textDecoration: 'none',
                  fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                }}>Sign in</Link>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
