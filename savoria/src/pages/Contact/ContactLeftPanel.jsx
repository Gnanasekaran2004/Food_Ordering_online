import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

/* ══════════════════════════════════════════════════════════════
   LEFT PANEL — SAVORIA logo brand identity area
══════════════════════════════════════════════════════════════ */
export default function ContactLeftPanel() {
  const glowRef  = useRef(null);
  const logoRef  = useRef(null);

  /* ── Subtle mouse-driven light shift ─────────────────────── */
  useEffect(() => {
    const handleMove = (e) => {
      if (!glowRef.current) return;
      const { innerWidth: W, innerHeight: H } = window;
      const x = (e.clientX / W) * 100;
      const y = (e.clientY / H) * 100;
      gsap.to(glowRef.current, {
        background: `radial-gradient(ellipse 55% 55% at ${x}% ${y}%, rgba(201,168,76,0.07) 0%, transparent 70%)`,
        duration: 1.4,
        ease: 'power2.out',
      });
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        background: '#030303',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        overflow: 'hidden',
        padding: 'clamp(4rem, 8vw, 6rem) clamp(2rem, 4vw, 4rem)',
      }}
    >
      {/* Ambient light that follows mouse */}
      <div
        ref={glowRef}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          transition: 'background 0s',
        }}
      />

      {/* Subtle dot-grid texture */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, rgba(201,168,76,0.06) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          opacity: 0.35,
          pointerEvents: 'none',
        }}
      />

      {/* Corner accent — top-left */}
      <div aria-hidden style={{
        position: 'absolute', top: '2.5rem', left: '2.5rem',
        width: '36px', height: '36px',
        borderTop: '1px solid rgba(201,168,76,0.25)',
        borderLeft: '1px solid rgba(201,168,76,0.25)',
      }} />
      {/* Corner accent — top-right */}
      <div aria-hidden style={{
        position: 'absolute', top: '2.5rem', right: '2.5rem',
        width: '36px', height: '36px',
        borderTop: '1px solid rgba(201,168,76,0.25)',
        borderRight: '1px solid rgba(201,168,76,0.25)',
      }} />
      {/* Corner accent — bottom-left */}
      <div aria-hidden style={{
        position: 'absolute', bottom: '2.5rem', left: '2.5rem',
        width: '36px', height: '36px',
        borderBottom: '1px solid rgba(201,168,76,0.25)',
        borderLeft: '1px solid rgba(201,168,76,0.25)',
      }} />
      {/* Corner accent — bottom-right */}
      <div aria-hidden style={{
        position: 'absolute', bottom: '2.5rem', right: '2.5rem',
        width: '36px', height: '36px',
        borderBottom: '1px solid rgba(201,168,76,0.25)',
        borderRight: '1px solid rgba(201,168,76,0.25)',
      }} />

      {/* ── The logo ────────────────────────────────────────── */}
      <motion.div
        ref={logoRef}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          position: 'relative',
          animation: 'contact-logo-breathe 6s ease-in-out infinite',
        }}
      >
        {/* Outer glow ring */}
        <div style={{
          position: 'absolute',
          width: '260px', height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo mark — circle with S */}
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '1.5px solid var(--gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `
            radial-gradient(ellipse 60% 50% at 50% 30%, rgba(226,191,106,0.06) 0%, transparent 60%),
            radial-gradient(ellipse at center, rgba(14,14,14,0.98) 0%, rgba(3,3,3,1) 100%)
          `,
          boxShadow: `
            0 0 0 1px rgba(201,168,76,0.06),
            0 0 40px rgba(201,168,76,0.07),
            0 16px 48px rgba(0,0,0,0.8),
            inset 0 1px 0 rgba(226,191,106,0.22),
            inset 0 -1px 0 rgba(138,106,40,0.3)
          `,
          position: 'relative',
        }}>
          {/* Inner thin ring */}
          <div style={{
            position: 'absolute',
            inset: '8px',
            borderRadius: '50%',
            border: '0.5px solid rgba(201,168,76,0.2)',
          }} />
          {/* S mark */}
          <span style={{
            fontFamily: 'var(--font-label)',
            fontSize: '2.8rem',
            fontWeight: 400,
            background: 'linear-gradient(160deg, rgba(226,191,106,1) 0%, rgba(201,168,76,1) 50%, rgba(138,106,40,0.9) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 6px rgba(201,168,76,0.3))',
            lineHeight: 1,
            userSelect: 'none',
          }}>
            S
          </span>
        </div>

        {/* Thin horizontal rule */}
        <div style={{
          width: '64px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          opacity: 0.6,
        }} />

        {/* Wordmark */}
        <span style={{
          fontFamily: 'var(--font-label)',
          fontSize: '1.1rem',
          letterSpacing: '0.55em',
          textTransform: 'uppercase',
          color: 'var(--cream)',
          userSelect: 'none',
          textShadow: '0 1px 16px rgba(0,0,0,0.6)',
        }}>
          SAVORIA
        </span>

        {/* Tagline */}
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.8rem',
          fontStyle: 'italic',
          color: 'rgba(201,168,76,0.6)',
          letterSpacing: '0.08em',
          userSelect: 'none',
        }}>
          Fine Dining
        </span>

        {/* Bracket ornaments */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', opacity: 0.4 }}>
          <div style={{ width: '14px', height: '40px', borderTop: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)', borderBottom: '1px solid var(--gold)', borderRadius: '2px 0 0 2px' }} />
          <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.45rem', letterSpacing: '0.28em', color: 'var(--muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Mumbai · Est. 2012
          </span>
          <div style={{ width: '14px', height: '40px', borderTop: '1px solid var(--gold)', borderRight: '1px solid var(--gold)', borderBottom: '1px solid var(--gold)', borderRadius: '0 2px 2px 0' }} />
        </div>
      </motion.div>

      {/* Subtle breathing animation */}
      <style>{`
        @keyframes contact-logo-breathe {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
