import React from 'react';
import { motion } from 'framer-motion';
import { aboutData } from '../../../data/aboutData';

export default function KitchenCultureSection() {
  const { kitchen } = aboutData;

  return (
    <section
      style={{
        background: 'var(--bg)',
        padding: 'clamp(5rem, 10vw, 9rem) clamp(1.5rem, 6vw, 6rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        {/* ── Top: culture text ───────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
            gap: 'clamp(3rem, 6vw, 6rem)',
            marginBottom: 'clamp(5rem, 10vw, 8rem)',
            alignItems: 'center',
          }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="section-label"
              style={{ marginBottom: '1.75rem' }}
            >
              {kitchen.label}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
                fontWeight: 300,
                color: 'var(--cream)',
                lineHeight: 1.12,
              }}
            >
              {kitchen.headline.split('\n').map((line, i) => (
                <span key={i} style={{ display: 'block' }}>{line}</span>
              ))}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.875rem, 1.4vw, 1rem)',
              fontWeight: 300,
              color: 'var(--muted)',
              lineHeight: 1.9,
            }}
          >
            {kitchen.body}
          </motion.p>
        </div>

        {/* ── Process flow ────────────────────────────────────── */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="section-label"
            style={{ marginBottom: '2rem' }}
          >
            The Process
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))',
              position: 'relative',
            }}
          >
            {/* Connecting line — desktop only */}
            <div
              aria-hidden
              className="process-line"
              style={{
                position: 'absolute',
                top: '24px',
                left: '8%',
                right: '8%',
                height: '1px',
                background: 'linear-gradient(to right, transparent, var(--gold-dark) 20%, var(--gold) 50%, var(--gold-dark) 80%, transparent)',
                opacity: 0.25,
              }}
            />

            {kitchen.process.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 2vw, 1.5rem)',
                  position: 'relative',
                }}
              >
                {/* Step number */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '1px solid var(--gold-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--surface)',
                    marginBottom: '1rem',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-label)',
                      fontSize: '0.55rem',
                      letterSpacing: '0.05em',
                      color: 'var(--gold)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Step label */}
                <span
                  style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '0.6rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    marginBottom: '0.6rem',
                  }}
                >
                  {step.step}
                </span>

                {/* Arrow — not on last */}
                {i < kitchen.process.length - 1 && (
                  <span
                    aria-hidden
                    className="process-arrow"
                    style={{
                      position: 'absolute',
                      right: '-4px',
                      top: 'calc(24px)',
                      color: 'rgba(201,168,76,0.3)',
                      fontSize: '0.7rem',
                      lineHeight: 1,
                    }}
                  >
                    ›
                  </span>
                )}

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.78rem',
                    color: 'var(--muted-2)',
                    fontWeight: 300,
                    lineHeight: 1.7,
                    maxWidth: '150px',
                  }}
                >
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .process-line, .process-arrow { display: none !important; }
        }
      `}</style>
    </section>
  );
}
