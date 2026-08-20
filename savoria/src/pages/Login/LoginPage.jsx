import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { sendPasswordResetEmail } from '../../services/authService';

/* ═══════════════════════════════════════════════════════════════
   SAVORIA — LOGIN PAGE
   Premium sign-in experience. Cinematic, focused, elegant.
═══════════════════════════════════════════════════════════════ */

/* ── Map auth error codes → friendly messages ──────────────── */
function mapError(err) {
  const map = {
    'auth/invalid-credential': 'The email or password you entered is incorrect.',
    'auth/user-not-found':     'No account found with this email address.',
    'auth/wrong-password':     'Incorrect password. Please try again.',
    'auth/too-many-requests':  'Too many attempts. Please wait a moment before trying again.',
    'auth/network-request-failed': 'A network error occurred. Please check your connection.',
  };
  return map[err?.code] || 'Something went wrong. Please try again.';
}

/* ── Styled input component ────────────────────────────────── */
function AuthInput({ label, type = 'text', value, onChange, error, autoComplete, rightElement }) {
  const [focused, setFocused] = useState(false);
  const id = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: 'var(--font-label)', fontSize: '0.5rem',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: error ? 'rgba(224,92,92,0.8)' : focused ? 'var(--gold)' : 'var(--muted)',
          transition: 'color 0.3s ease',
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: rightElement ? '0.85rem 3rem 0.85rem 0' : '0.85rem 0',
            background: 'transparent',
            border: 'none',
            borderBottom: `1px solid ${error ? 'rgba(224,92,92,0.5)' : focused ? 'var(--gold)' : 'rgba(255,255,255,0.12)'}`,
            color: 'var(--cream)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            fontWeight: 300,
            outline: 'none',
            transition: 'border-color 0.3s ease',
            letterSpacing: '0.02em',
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
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '0.75rem',
              color: 'rgba(224,92,92,0.8)', fontWeight: 300, margin: 0,
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Show/Hide password toggle ─────────────────────────────── */
function EyeToggle({ show, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={show ? 'Hide password' : 'Show password'}
      style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'var(--muted)', padding: '4px', display: 'flex', alignItems: 'center',
        transition: 'color 0.2s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
    >
      {show ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )}
    </button>
  );
}

export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const emailRef  = useRef(null);

  const from = location.state?.from?.pathname || '/profile';

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => { emailRef.current?.focus(); }, []);

  const [form, setForm]     = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [forgotMode, setForgotMode]   = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg]     = useState('');

  const setField = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrors(er => ({ ...er, [key]: '' }));
    setGlobalError('');
  };

  function validate() {
    const errs = {};
    if (!form.email)  errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.password) errs.password = 'Password is required.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setGlobalError('');
    try {
      await login({ email: form.email, password: form.password });
      navigate(from, { replace: true });
    } catch (err) {
      setGlobalError(mapError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot(e) {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotMsg('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(forgotEmail);
      setForgotMsg('If an account with that email exists, a reset link has been sent.');
    } catch {
      setForgotMsg('Unable to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="page-enter"
      style={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: 'clamp(5rem, 10vw, 6rem) clamp(1.5rem, 5vw, 3rem) 3rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background radial glow */}
      <div aria-hidden style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Dot grid */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px', opacity: 0.4,
      }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
        {/* SAVORIA emblem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              width: '48px', height: '48px', borderRadius: '50%',
              border: '1px solid rgba(201,168,76,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-label)', fontSize: '1rem', color: 'var(--gold)',
              background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)',
            }}>S</span>
            <span style={{
              fontFamily: 'var(--font-label)', fontSize: '0.75rem',
              letterSpacing: '0.3em', color: 'var(--cream)', textTransform: 'uppercase',
            }}>Savoria</span>
          </Link>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ── Forgot password panel ──────────────────── */}
          {forgotMode ? (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="section-label" style={{ marginBottom: '1.25rem' }}>Password Recovery</div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1, marginBottom: '0.75rem',
              }}>
                Reset Your Password
              </h1>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                color: 'var(--muted)', fontWeight: 300, marginBottom: '2.5rem', lineHeight: 1.7,
              }}>
                Enter your account email and we'll send you a reset link.
              </p>

              <form onSubmit={handleForgot} noValidate>
                <div style={{ marginBottom: '2rem' }}>
                  <AuthInput
                    label="Email" type="email" value={forgotEmail}
                    onChange={e => { setForgotEmail(e.target.value); setForgotMsg(''); }}
                    autoComplete="email"
                  />
                </div>

                {forgotMsg && (
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 300,
                    color: forgotMsg.startsWith('If') ? 'rgba(100,200,120,0.8)' : 'rgba(224,92,92,0.8)',
                    marginBottom: '1.5rem',
                  }}>
                    {forgotMsg}
                  </p>
                )}

                <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginBottom: '1.5rem' }} disabled={loading}>
                  <span>{loading ? 'Sending…' : 'Send Reset Link'}</span>
                </button>

                <button type="button" onClick={() => { setForgotMode(false); setForgotMsg(''); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.8rem', padding: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  ← Back to Sign In
                </button>
              </form>
            </motion.div>
          ) : (
          /* ── Login form ───────────────────────────── */
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="section-label" style={{ marginBottom: '1.25rem' }}>Welcome Back</div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1, marginBottom: '0.75rem',
              }}>
                Return to the Table.
              </h1>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                color: 'var(--muted)', fontWeight: 300, marginBottom: '2.5rem', lineHeight: 1.7,
              }}>
                Sign in to continue your SAVORIA experience.
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              noValidate
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2rem' }}>
                <AuthInput
                  label="Email" type="email" value={form.email}
                  onChange={setField('email')} error={errors.email}
                  autoComplete="email"
                />
                <AuthInput
                  label="Password" type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={setField('password')}
                  error={errors.password} autoComplete="current-password"
                  rightElement={<EyeToggle show={showPw} onToggle={() => setShowPw(v => !v)} />}
                />
              </div>

              {/* Global error */}
              <AnimatePresence>
                {globalError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{
                      padding: '0.75rem 1rem', background: 'rgba(224,92,92,0.06)',
                      border: '1px solid rgba(224,92,92,0.2)', borderRadius: '2px',
                      marginBottom: '1.5rem',
                      fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                      color: 'rgba(224,92,92,0.8)', fontWeight: 300,
                    }}
                  >
                    {globalError}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                className="btn-gold"
                style={{ width: '100%', justifyContent: 'center', marginBottom: '1.25rem', opacity: loading ? 0.7 : 1 }}
                disabled={loading}
              >
                <span>{loading ? 'Signing in…' : 'Sign In'}</span>
              </button>

              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => setForgotMode(true)}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                    color: 'var(--muted)', textDecoration: 'underline', textDecorationColor: 'transparent',
                    transition: 'color 0.2s ease, text-decoration-color 0.2s ease',
                    padding: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.textDecorationColor = 'var(--gold)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.textDecorationColor = 'transparent'; }}
                >
                  Forgot password?
                </button>
              </div>
            </motion.form>
          </motion.div>
          )}
        </AnimatePresence>

        {/* Register link */}
        {!forgotMode && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            style={{
              textAlign: 'center', marginTop: '2.5rem',
              borderTop: '1px solid var(--border)', paddingTop: '2rem',
              fontFamily: 'var(--font-body)', fontSize: '0.82rem',
              color: 'var(--muted)', fontWeight: 300,
            }}
          >
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: 'var(--gold)', textDecoration: 'none',
                fontFamily: 'var(--font-label)', fontSize: '0.55rem',
                letterSpacing: '0.15em', textTransform: 'uppercase',
              }}
            >
              Create one
            </Link>
          </motion.p>
        )}
      </div>
    </div>
  );
}
