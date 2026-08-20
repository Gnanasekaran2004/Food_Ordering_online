import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '../data/restaurantData';
import { useAuth } from '../context/AuthContext';

/* ═══════════════════════════════════════════════════════════════
   SAVORIA NAVBAR — with authentication state
   Unchanged visual design. Auth state adds:
   - Logged-out: LOGIN link in top-right
   - Logged-in:  username pill + dropdown (Profile / Sign Out)
═══════════════════════════════════════════════════════════════ */

/* ── User account dropdown ────────────────────────────────── */
function UserMenu({ user, onClose }) {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const menuRef    = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    }
    function handleKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('mousedown', handleClick); document.removeEventListener('keydown', handleKey); };
  }, [onClose]);

  async function handleLogout() {
    onClose();
    await logout();
    navigate('/');
  }

  const initials = (user.displayName || user.username || '?')
    .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.96 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', top: 'calc(100% + 12px)', right: 0,
          minWidth: '180px',
          background: 'rgba(10,9,8,0.97)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(201,168,76,0.15)',
          borderRadius: '3px',
          overflow: 'hidden',
          zIndex: 200,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* User info */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.52rem', letterSpacing: '0.18em', color: 'var(--gold)', marginBottom: '0.2rem' }}>
            @{user.username}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 300 }}>
            {user.email}
          </p>
        </div>

        {/* Menu items */}
        {[
          { label: 'My Profile', action: () => { navigate('/profile'); onClose(); } },
        ].map(item => (
          <button
            key={item.label}
            onClick={item.action}
            style={{
              display: 'block', width: '100%', padding: '0.85rem 1.25rem',
              background: 'transparent', border: 'none', textAlign: 'left',
              fontFamily: 'var(--font-label)', fontSize: '0.52rem',
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(239,232,213,0.7)', cursor: 'pointer',
              transition: 'color 0.2s ease, background 0.2s ease',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--cream)'; e.currentTarget.style.background = 'rgba(201,168,76,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(239,232,213,0.7)'; e.currentTarget.style.background = 'transparent'; }}
          >
            {item.label}
          </button>
        ))}

        <button
          onClick={handleLogout}
          style={{
            display: 'block', width: '100%', padding: '0.85rem 1.25rem',
            background: 'transparent', border: 'none', textAlign: 'left',
            fontFamily: 'var(--font-label)', fontSize: '0.52rem',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(224,92,92,0.65)', cursor: 'pointer',
            transition: 'color 0.2s ease, background 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(224,92,92,1)'; e.currentTarget.style.background = 'rgba(224,92,92,0.04)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(224,92,92,0.65)'; e.currentTarget.style.background = 'transparent'; }}
        >
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════ */
export default function Navbar() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef(null);

  const mobileLogout = async () => { await logout(); navigate('/'); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navBg = scrolled ? 'rgba(6,6,6,0.88)' : 'transparent';

  // The nav links to show; we DON'T add Profile to navLinks array —
  // it's controlled dynamically here based on auth state.
  const visibleLinks = navLinks;

  /* ── Auth initials for the pill ─────────────────────────── */
  const initials = user
    ? (user.displayName || user.username || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '';

  return (
    <>
      <motion.header
        ref={navRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: navBg,
          backdropFilter: scrolled ? 'blur(18px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : 'none',
          transition: 'background 0.5s ease, backdrop-filter 0.5s ease, border-bottom 0.5s ease',
        }}
      >
        <nav style={{
          maxWidth: '1400px', margin: '0 auto',
          padding: '0 clamp(1.5rem, 4vw, 4rem)', height: '72px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link to="/" style={{
            fontFamily: 'var(--font-label)', fontSize: '1.05rem', letterSpacing: '0.22em',
            color: 'var(--cream)', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0,
          }}>
            <span style={{
              width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', color: 'var(--gold)',
            }}>S</span>
            Savoria
          </Link>

          {/* Desktop Links */}
          <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none', alignItems: 'center' }} className="hidden md:flex">
            {visibleLinks.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  style={({ isActive }) => ({
                    fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--gold)' : 'rgba(239,232,213,0.55)',
                    position: 'relative', paddingBottom: '3px',
                    transition: 'color 0.3s ease, letter-spacing 0.3s ease', display: 'block',
                  })}
                  className="nav-link-item"
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--cream)'; e.currentTarget.style.letterSpacing = '0.26em'; }}
                  onMouseLeave={(e) => {
                    const active = e.currentTarget.classList.contains('active');
                    e.currentTarget.style.color = active ? 'var(--gold)' : 'rgba(239,232,213,0.55)';
                    e.currentTarget.style.letterSpacing = '0.22em';
                  }}
                >
                  {link.label}
                  <span style={{
                    position: 'absolute', bottom: 0, left: 0, width: '100%', height: '1px',
                    background: 'var(--gold)', transform: 'scaleX(0)', transformOrigin: 'left',
                    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  }} className="nav-underline" />
                </NavLink>
              </li>
            ))}

            {/* Profile link (only when logged in) */}
            {isAuthenticated && (
              <li>
                <NavLink
                  to="/profile"
                  style={({ isActive }) => ({
                    fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--gold)' : 'rgba(239,232,213,0.55)',
                    position: 'relative', paddingBottom: '3px',
                    transition: 'color 0.3s ease, letter-spacing 0.3s ease', display: 'block',
                  })}
                  className="nav-link-item"
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--cream)'; e.currentTarget.style.letterSpacing = '0.26em'; }}
                  onMouseLeave={(e) => {
                    const active = e.currentTarget.classList.contains('active');
                    e.currentTarget.style.color = active ? 'var(--gold)' : 'rgba(239,232,213,0.55)';
                    e.currentTarget.style.letterSpacing = '0.22em';
                  }}
                >
                  Profile
                  <span style={{
                    position: 'absolute', bottom: 0, left: 0, width: '100%', height: '1px',
                    background: 'var(--gold)', transform: 'scaleX(0)', transformOrigin: 'left',
                    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  }} className="nav-underline" />
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right side — Reserve + auth */}
          <div className="hidden md:flex items-center gap-4" style={{ gap: '1.25rem', display: 'flex', alignItems: 'center' }}>
            {/* Auth state — no flicker during loading */}
            {!authLoading && (
              isAuthenticated ? (
                /* Logged-in: user pill */
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    aria-haspopup="true"
                    aria-expanded={userMenuOpen}
                    aria-label={`Account menu for ${user.displayName}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.55rem',
                      background: 'transparent', border: '1px solid rgba(201,168,76,0.22)',
                      borderRadius: '2px', padding: '0.4rem 0.75rem 0.4rem 0.4rem',
                      cursor: 'pointer', transition: 'border-color 0.3s ease, background 0.3s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'; e.currentTarget.style.background = 'rgba(201,168,76,0.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.22)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* Avatar */}
                    <span style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-label)', fontSize: '0.5rem', color: 'var(--gold)',
                      flexShrink: 0,
                    }}>
                      {initials}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-label)', fontSize: '0.52rem',
                      letterSpacing: '0.16em', color: 'var(--cream)', textTransform: 'uppercase',
                      maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {user.username || user.displayName}
                    </span>
                    {/* Chevron */}
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" aria-hidden>
                      <path d="M1 1l3 3 3-3" stroke="var(--muted)" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <UserMenu user={user} onClose={() => setUserMenuOpen(false)} />
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Logged-out: LOGIN link */
                <Link
                  to="/login"
                  style={{
                    fontFamily: 'var(--font-label)', fontSize: '0.6rem',
                    letterSpacing: '0.22em', textTransform: 'uppercase',
                    color: 'rgba(239,232,213,0.55)', textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    paddingBottom: '3px', position: 'relative',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(239,232,213,0.55)'}
                >
                  Login
                </Link>
              )
            )}

            <button className="btn-gold"><span>Reserve</span></button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle navigation"
            style={{
              background: 'transparent', border: 'none',
              display: 'flex', flexDirection: 'column', gap: '5px', padding: '6px', cursor: 'pointer',
            }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                display: 'block', width: '22px', height: '1px', background: 'var(--cream)',
                transition: 'all 0.4s var(--ease-expo)', transformOrigin: 'center',
                transform: mobileOpen
                  ? i === 0 ? 'rotate(45deg) translate(4px, 4px)'
                  : i === 1 ? 'scaleX(0)' : 'rotate(-45deg) translate(4px, -4px)'
                  : 'none',
                opacity: mobileOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </nav>

        {/* Thin gold line */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, var(--gold-border), transparent)`,
          opacity: scrolled ? 0 : 0.6, transition: 'opacity 0.5s ease',
        }} />
      </motion.header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 99,
              background: 'rgba(6,6,6,0.97)', backdropFilter: 'blur(30px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '6rem 2rem',
            }}
          >
            <ul style={{ listStyle: 'none', textAlign: 'center' }}>
              {[...visibleLinks, ...(isAuthenticated ? [{ label: 'Profile', to: '/profile' }] : [{ label: 'Login', to: '/login' }])].map((link, i) => (
                <motion.li key={link.label}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ marginBottom: '2rem' }}
                >
                  <NavLink
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                      fontWeight: 300, fontStyle: 'italic', color: 'var(--cream)',
                      letterSpacing: '0.02em', transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--cream)')}
                  >
                    {link.label}
                  </NavLink>
                </motion.li>
              ))}

              {/* Logout in mobile menu */}
              {isAuthenticated && (
                <motion.li initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + (visibleLinks.length + 1) * 0.08, duration: 0.6 }}
                  style={{ marginBottom: '2rem' }}
                >
                  <button
                    onClick={async () => { setMobileOpen(false); await mobileLogout(); }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                      fontWeight: 300, fontStyle: 'italic', color: 'rgba(224,92,92,0.7)', letterSpacing: '0.02em' }}>
                    Sign Out
                  </button>
                </motion.li>
              )}
            </ul>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ marginTop: '2rem' }}>
              <button className="btn-gold" onClick={() => setMobileOpen(false)}>
                <span>Reserve a Table</span>
              </button>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              style={{
                position: 'absolute', bottom: '2.5rem',
                fontFamily: 'var(--font-label)', fontSize: '0.58rem', letterSpacing: '0.2em',
                color: 'var(--muted)', textTransform: 'uppercase',
              }}>
              {isAuthenticated ? `Signed in as @${user?.username}` : 'Mumbai · Est. 2012'}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-link-item:hover .nav-underline { transform: scaleX(1) !important; }
      `}</style>
    </>
  );
}
