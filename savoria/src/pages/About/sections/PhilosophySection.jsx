import React from 'react';
import { motion } from 'framer-motion';
import { aboutData } from '../../../data/aboutData';

export default function PhilosophySection() {
  const { philosophy } = aboutData;

  return (
    <section
      style={{
        background: 'var(--surface)',
        padding: 'clamp(5rem, 10vw, 9rem) clamp(1.5rem, 6vw, 6rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative ghost text */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(8rem, 18vw, 18rem)',
          fontWeight: 300,
          color: 'rgba(201,168,76,0.025)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          letterSpacing: '-0.04em',
        }}
      >
        CRAFT
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(3.5rem, 7vw, 6rem)', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="section-label"
          style={{ justifyContent: 'center', marginBottom: '1.25rem' }}
        >
          What We Believe
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 300,
            color: 'var(--cream)',
          }}
        >
          The SAVORIA Philosophy
        </motion.h2>
      </div>

      {/* Philosophy grid */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
          gap: '1px',
          background: 'var(--border)',
          border: '1px solid var(--border)',
          borderRadius: '3px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {philosophy.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'var(--surface)',
              padding: 'clamp(2rem, 4vw, 3rem)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'background 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
          >
            {/* Gold corner accent */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '32px',
                height: '32px',
                borderTop: '1px solid rgba(201,168,76,0.2)',
                borderLeft: '1px solid rgba(201,168,76,0.2)',
              }}
            />

            {/* Icon */}
            <div
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '1.2rem',
                color: 'rgba(201,168,76,0.4)',
                marginBottom: '1.25rem',
                lineHeight: 1,
              }}
            >
              {item.icon}
            </div>

            {/* Title */}
            <h3
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: '0.9rem',
              }}
            >
              {item.title}
            </h3>

            {/* Thin gold rule */}
            <div
              style={{
                width: '24px',
                height: '1px',
                background: 'var(--gold)',
                marginBottom: '1rem',
                opacity: 0.5,
              }}
            />

            {/* Description */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'var(--muted)',
                fontWeight: 300,
                lineHeight: 1.85,
              }}
            >
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
