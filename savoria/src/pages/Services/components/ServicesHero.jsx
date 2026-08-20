import React from 'react';
import { motion } from 'framer-motion';
import { servicesHero, servicesIntro } from '../../../data/servicesData';
import { GoldRule } from './ServicesShared';

/* ══════════════════════════════════════════════════════════════
   SERVICES HERO
   Controlled, editorial. No giant 3D. The services follow fast.
══════════════════════════════════════════════════════════════ */
export default function ServicesHero() {
  const { eyebrow, headline, subheadline, body } = servicesHero;
  const { quote, body: introBod } = servicesIntro;

  return (
    <section
      style={{
        padding: 'clamp(6rem, 12vw, 10rem) clamp(1.5rem, 5vw, 6rem) clamp(3rem, 6vw, 5rem)',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background radial glow */}
      <div aria-hidden style={{
        position: 'absolute', top: 0, left: 0, width: '60%', height: '80%',
        background: 'radial-gradient(ellipse 60% 60% at 20% 30%, rgba(201,168,76,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Dot grid */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.045) 1px, transparent 1px)',
        backgroundSize: '40px 40px', opacity: 0.35,
      }} />

      <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="section-label"
          style={{ marginBottom: '2rem' }}
        >
          {eyebrow}
        </motion.div>

        {/* Main headline */}
        <div style={{ marginBottom: '1.5rem', overflow: 'hidden' }}>
          {headline.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.5rem, 9vw, 8rem)',
                fontWeight: 300,
                lineHeight: 1.0,
                color: i === 0 ? 'var(--cream)' : 'transparent',
                WebkitTextStroke: i === 0 ? undefined : '1px rgba(239,232,213,0.3)',
                letterSpacing: '-0.01em',
              }}>
                {line}
              </h1>
            </motion.div>
          ))}
        </div>

        {/* Subheadline + rule */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '560px' }}
        >
          <GoldRule width="48px" />
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
            fontStyle: 'italic',
            color: 'var(--cream)',
            fontWeight: 300,
            lineHeight: 1.4,
          }}>
            {subheadline}
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--muted)',
            fontWeight: 300,
            lineHeight: 1.85,
          }}>
            {body}
          </p>
        </motion.div>

        {/* Intro quote */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginTop: 'clamp(3rem, 6vw, 5rem)',
            paddingTop: 'clamp(2rem, 4vw, 3rem)',
            borderTop: '1px solid var(--border)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            alignItems: 'center',
          }}
          className="services-hero-intro"
        >
          <blockquote style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.3rem, 2.5vw, 2rem)',
            fontStyle: 'italic',
            color: 'var(--cream)',
            fontWeight: 300,
            lineHeight: 1.35,
            borderLeft: '2px solid var(--gold)',
            paddingLeft: '1.5rem',
          }}>
            "{quote}"
          </blockquote>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--muted)',
            fontWeight: 300,
            lineHeight: 1.85,
          }}>
            {introBod}
          </p>
        </motion.div>
      </div>

      {/* Responsive: stack intro quote on mobile */}
      <style>{`
        @media (max-width: 640px) {
          .services-hero-intro { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
