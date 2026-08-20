import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { aboutData } from '../../../data/aboutData';

gsap.registerPlugin(ScrollTrigger);

export default function TimelineSection() {
  const { history } = aboutData;
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef(null);
  const progressRef = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate progress line on scroll
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: 1,
        },
      });

      // Reveal each year marker
      gsap.utils.toArray('.timeline-node').forEach((node, i) => {
        gsap.fromTo(
          node,
          { opacity: 0, y: 24, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top+=${i * 8}% 70%`,
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--surface)',
        padding: 'clamp(5rem, 10vw, 9rem) clamp(1.5rem, 6vw, 6rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
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
          Our Journey
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
            lineHeight: 1.15,
          }}
        >
          A Decade of Craft
        </motion.h2>
      </div>

      {/* ── Desktop: horizontal timeline ──────────────────────────── */}
      <div className="timeline-desktop" style={{ display: 'none' }}>
        {/* Horizontal track */}
        <div
          style={{
            position: 'relative',
            maxWidth: '1100px',
            margin: '0 auto',
            paddingBottom: '3rem',
          }}
        >
          {/* Base grey line */}
          <div
            style={{
              position: 'absolute',
              top: '11px',
              left: '5%',
              right: '5%',
              height: '1px',
              background: 'var(--surface-3)',
            }}
          />
          {/* Gold progress line */}
          <div
            ref={progressRef}
            style={{
              position: 'absolute',
              top: '11px',
              left: '5%',
              right: '5%',
              height: '1px',
              background: 'linear-gradient(to right, var(--gold-dark), var(--gold))',
              transformOrigin: 'left center',
              scaleX: 0,
            }}
          />

          {/* Nodes */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            {history.map((item, i) => (
              <button
                key={item.year}
                className="timeline-node"
                onClick={() => setActiveIdx(i)}
                aria-pressed={activeIdx === i}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0 0.5rem',
                  flex: 1,
                }}
              >
                {/* Gold dot */}
                <div
                  style={{
                    width: activeIdx === i ? '14px' : '8px',
                    height: activeIdx === i ? '14px' : '8px',
                    borderRadius: '50%',
                    background: activeIdx === i ? 'var(--gold)' : 'var(--surface-3)',
                    border: activeIdx === i ? '2px solid var(--gold-light)' : '1px solid var(--border)',
                    transition: 'all 0.35s ease',
                    boxShadow: activeIdx === i ? '0 0 12px rgba(201,168,76,0.35)' : 'none',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '0.62rem',
                    letterSpacing: '0.18em',
                    color: activeIdx === i ? 'var(--gold)' : 'var(--muted)',
                    transition: 'color 0.3s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.year}
                </span>
              </button>
            ))}
          </div>

          {/* Active content panel */}
          <div
            style={{
              marginTop: '2.5rem',
              padding: '2rem 2.5rem',
              background: 'var(--surface-2)',
              border: '1px solid var(--gold-border)',
              borderRadius: '3px',
              minHeight: '130px',
              position: 'relative',
            }}
          >
            {history.map((item, i) => (
              <div
                key={item.year}
                style={{
                  position: i === 0 ? 'relative' : 'absolute',
                  inset: 0,
                  padding: '2rem 2.5rem',
                  opacity: activeIdx === i ? 1 : 0,
                  transform: activeIdx === i ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity 0.4s ease, transform 0.4s ease',
                  pointerEvents: activeIdx === i ? 'auto' : 'none',
                }}
              >
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--gold)', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                  {item.year} — {item.title}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 300, lineHeight: 1.8, maxWidth: '680px' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile/Tablet: vertical timeline ──────────────────────── */}
      <div className="timeline-mobile" style={{ maxWidth: '680px', margin: '0 auto', position: 'relative' }}>
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '20px',
            width: '1px',
            background: 'linear-gradient(to bottom, var(--gold), transparent)',
          }}
        />

        {history.map((item, i) => (
          <motion.div
            key={item.year}
            className="timeline-node"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              gap: '1.75rem',
              marginBottom: '2.5rem',
              paddingLeft: '0',
              position: 'relative',
            }}
          >
            {/* Dot */}
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--gold)',
                border: '2px solid var(--gold-light)',
                flexShrink: 0,
                marginTop: '6px',
                position: 'relative',
                zIndex: 1,
                boxShadow: '0 0 8px rgba(201,168,76,0.3)',
              }}
            />
            <div>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--gold)', display: 'block', marginBottom: '0.3rem' }}>
                {item.year}
              </span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 400, color: 'var(--cream)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                {item.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 300, lineHeight: 1.8 }}>
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Responsive toggle */}
      <style>{`
        @media (min-width: 900px) {
          .timeline-desktop { display: block !important; }
          .timeline-mobile  { display: none !important; }
        }
      `}</style>
    </section>
  );
}
