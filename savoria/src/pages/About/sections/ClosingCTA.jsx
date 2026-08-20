import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { aboutData } from '../../../data/aboutData';

export default function ClosingCTA() {
  const { closing } = aboutData;

  return (
    <section
      style={{
        background: 'var(--bg)',
        padding: 'clamp(6rem, 12vw, 10rem) clamp(1.5rem, 6vw, 6rem)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {/* Large ambient glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70vw',
          height: '70vw',
          maxWidth: '900px',
          maxHeight: '900px',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.055) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Decorative grid overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          pointerEvents: 'none',
        }}
      />

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="section-label"
        style={{ justifyContent: 'center', marginBottom: '2rem', position: 'relative' }}
      >
        {closing.label}
      </motion.div>

      {/* Main headline */}
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        {closing.headline.split('\n').map((line, i) => (
          <motion.h2
            key={i}
            initial={{ y: '110%', opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 6rem)',
              fontWeight: 300,
              color: 'var(--cream)',
              lineHeight: 1.1,
              display: 'block',
            }}
          >
            {line}
          </motion.h2>
        ))}
      </div>

      {/* Gold divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: 'clamp(60px, 8vw, 100px)',
          height: '1px',
          background: 'var(--gold)',
          margin: '2.5rem auto',
          transformOrigin: 'center',
          position: 'relative',
        }}
      />

      {/* Body text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
          fontWeight: 300,
          color: 'var(--muted)',
          lineHeight: 1.9,
          maxWidth: '480px',
          marginBottom: '3rem',
          position: 'relative',
        }}
      >
        {closing.body}
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {closing.cta.map(cta => (
          <Link key={cta.label} to={cta.href}>
            <button className={cta.variant === 'gold' ? 'btn-gold' : 'btn-ghost'}>
              <span>{cta.label}</span>
            </button>
          </Link>
        ))}
      </motion.div>

      {/* Bottom decorative rule */}
      <div className="divider-gold" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
    </section>
  );
}
