import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { aboutData } from '../../../data/aboutData';

/* ── Animated count-up number ────────────────────────────────── */
function CountUp({ target, duration = 1800 }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    // Extract numeric part and suffix
    const match = String(target).match(/^(\d+)(\D*)$/);
    if (!match) { setDisplay(target); return; }
    const end = parseInt(match[1], 10);
    const suffix = match[2];
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(ease * end);
      setDisplay(`${current.toLocaleString('en-IN')}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return <span ref={ref}>{display}</span>;
}

export default function MilestonesSection() {
  const { milestones } = aboutData;

  return (
    <section
      style={{
        background: 'var(--surface)',
        padding: 'clamp(5rem, 10vw, 9rem) clamp(1.5rem, 6vw, 6rem)',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Ambient gold line across top */}
      <div className="divider-gold" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(3.5rem, 7vw, 6rem)' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="section-label"
          style={{ justifyContent: 'center', marginBottom: '1.25rem' }}
        >
          By the Numbers
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
          Years of Making It Count
        </motion.h2>
      </div>

      {/* Stats grid */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
          gap: '1px',
          background: 'var(--border)',
          borderRadius: '3px',
          overflow: 'hidden',
        }}
      >
        {milestones.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'var(--surface)',
              padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              transition: 'background 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
          >
            {/* Number */}
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
                fontWeight: 300,
                lineHeight: 1,
                marginBottom: '0.5rem',
                background: 'linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 55%, var(--gold-dark) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              <CountUp target={item.value} duration={1600 + i * 200} />
            </div>

            {/* Label */}
            <span
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
              }}
            >
              {item.label}
            </span>

            {/* Sample note */}
            <span
              title="Sample demonstration value — replace with actual data"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.58rem',
                color: 'var(--muted-2)',
                marginTop: '0.4rem',
                fontStyle: 'italic',
                opacity: 0.6,
              }}
            >
              {item.note}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="divider-gold" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
    </section>
  );
}
