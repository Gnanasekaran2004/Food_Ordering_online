import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { aboutData } from '../../../data/aboutData';

export default function AboutHero() {
  const { intro } = aboutData;
  const lineRef = useRef(null);

  return (
    <section
      style={{
        minHeight: '85svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg)',
        padding: 'clamp(6rem, 12vw, 10rem) clamp(1.5rem, 6vw, 6rem) clamp(4rem, 8vw, 6rem)',
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60vw',
          height: '60vw',
          maxWidth: '800px',
          maxHeight: '800px',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.045) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="section-label"
        style={{ marginBottom: '2.5rem' }}
      >
        {intro.label}
      </motion.div>

      {/* Main headline */}
      <div style={{ overflow: 'hidden', textAlign: 'center' }}>
        {intro.headline.split('\n').map((line, i) => (
          <motion.h1
            key={i}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.5rem, 8vw, 8rem)',
              fontWeight: 300,
              color: 'var(--cream)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              display: 'block',
            }}
          >
            {line}
          </motion.h1>
        ))}
      </div>

      {/* Gold divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: 'clamp(60px, 8vw, 100px)',
          height: '1px',
          background: 'var(--gold)',
          margin: '2.5rem auto',
          transformOrigin: 'left center',
        }}
      />

      {/* Sub-headline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
          fontWeight: 300,
          color: 'var(--gold)',
          fontStyle: 'italic',
          marginBottom: '1.75rem',
          textAlign: 'center',
        }}
      >
        {intro.subheadline}
      </motion.p>

      {/* Body */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
          fontWeight: 300,
          color: 'var(--muted)',
          lineHeight: 1.9,
          maxWidth: '560px',
          textAlign: 'center',
        }}
      >
        {intro.body}
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        style={{
          position: 'absolute',
          bottom: 'clamp(1.5rem, 4vh, 3rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.5rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted-2)' }}>
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '48px',
            background: 'linear-gradient(to bottom, var(--gold-dark), transparent)',
            animation: 'about-scroll-pulse 2s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes about-scroll-pulse {
            0%, 100% { opacity: 0.3; transform: scaleY(1); }
            50% { opacity: 1; transform: scaleY(1.1); }
          }
        `}</style>
      </motion.div>
    </section>
  );
}
