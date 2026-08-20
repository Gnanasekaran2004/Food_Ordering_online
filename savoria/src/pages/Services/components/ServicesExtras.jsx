import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { whySavoria, servicesCTA } from '../../../data/servicesData';
import { Reveal, GoldRule } from './ServicesShared';

/* ══════════════════════════════════════════════════════════════
   WHY SAVORIA — 6-pillar editorial grid
══════════════════════════════════════════════════════════════ */
export function WhySavoria() {
  return (
    <section
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 5vw, 6rem)',
        background: 'var(--surface)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Subtle glow */}
      <div aria-hidden style={{
        position: 'absolute', bottom: 0, right: 0,
        width: '50%', height: '60%',
        background: 'radial-gradient(ellipse 60% 60% at 80% 80%, rgba(201,168,76,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <Reveal>
          <div className="section-label" style={{ marginBottom: '1.5rem' }}>The SAVORIA Difference</div>
        </Reveal>
        <Reveal delay={0.1} style={{ marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 300, color: 'var(--cream)', lineHeight: 1.15,
            maxWidth: '600px',
          }}>
            Why guests choose us<br />
            <span style={{ fontStyle: 'italic', color: 'rgba(201,168,76,0.8)' }}>for every occasion.</span>
          </h2>
        </Reveal>

        {/* Pillars grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0',
            borderTop: '1px solid var(--border)',
            borderLeft: '1px solid var(--border)',
          }}
          className="why-grid"
        >
          {whySavoria.map((p, i) => (
            <Reveal key={p.number} delay={i * 0.07}>
              <motion.div
                whileHover={{ background: 'rgba(201,168,76,0.03)' }}
                transition={{ duration: 0.3 }}
                style={{
                  padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                  borderRight: '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex', flexDirection: 'column', gap: '1rem',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-label)', fontSize: '0.5rem',
                  letterSpacing: '0.15em', color: 'var(--muted)',
                }}>
                  {p.number}
                </span>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1rem, 1.8vw, 1.3rem)',
                  fontWeight: 300, color: 'var(--cream)', lineHeight: 1.2,
                }}>
                  {p.title}
                </h3>
                <GoldRule width="32px" />
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                  color: 'var(--muted)', fontWeight: 300, lineHeight: 1.8,
                }}>
                  {p.body}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .why-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .why-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   SERVICES CTA — final closing section
══════════════════════════════════════════════════════════════ */
export function ServicesCTA() {
  const { headline, body, primaryCta, secondaryCta } = servicesCTA;
  return (
    <section
      style={{
        padding: 'clamp(5rem, 10vw, 9rem) clamp(1.5rem, 5vw, 6rem)',
        background: 'var(--bg)',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Glow behind the text */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: '720px', margin: '0 auto' }}>
        <Reveal>
          <div className="section-label" style={{ marginBottom: '2rem', justifyContent: 'center' }}>
            Plan Your Experience
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 300, lineHeight: 1.1, color: 'var(--cream)',
            marginBottom: '1.5rem',
          }}>
            {headline}
          </h2>
        </Reveal>

        <Reveal delay={0.2} style={{ marginBottom: '2.5rem' }}>
          <div style={{ width: '48px', height: '1px', background: 'var(--gold)', margin: '0 auto 1.5rem', opacity: 0.6 }} />
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.95rem',
            color: 'var(--muted)', fontWeight: 300, lineHeight: 1.85,
          }}>
            {body}
          </p>
        </Reveal>

        <Reveal delay={0.3} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to={primaryCta.href} className="btn-gold" style={{ textDecoration: 'none' }}>
            <span>{primaryCta.label}</span>
          </Link>
          <Link to={secondaryCta.href} className="btn-ghost" style={{ textDecoration: 'none' }}>
            <span>{secondaryCta.label}</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   SERVICES NAV — sticky quick-jump nav to each service
══════════════════════════════════════════════════════════════ */
export function ServicesNav({ services }) {
  return (
    <nav
      aria-label="Jump to service"
      style={{
        position: 'sticky',
        top: '73px',
        zIndex: 10,
        background: 'rgba(6,6,6,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 clamp(1.5rem, 5vw, 6rem)',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      <div style={{
        display: 'flex', gap: '0',
        maxWidth: '1200px', margin: '0 auto',
      }}>
        {services.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '0.48rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              padding: '1rem 1.25rem',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              borderBottom: '2px solid transparent',
              transition: 'color 0.3s ease, border-color 0.3s ease',
              display: 'block',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--gold)';
              e.currentTarget.style.borderBottomColor = 'var(--gold)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--muted)';
              e.currentTarget.style.borderBottomColor = 'transparent';
            }}
          >
            {s.number} {s.title}
          </a>
        ))}
      </div>
      <style>{`nav::-webkit-scrollbar { display: none; }`}</style>
    </nav>
  );
}
