import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { restaurant, milestones } from '../../../data/restaurantData';

gsap.registerPlugin(ScrollTrigger);

export default function IntroSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Large year number: clip-path sweep up ─────────── */
      gsap.fromTo(
        '.intro-year',
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.intro-year',
            start: 'top 80%',
          },
        }
      );

      /* ── Section label ─────────────────────────────────── */
      gsap.fromTo(
        '.intro-label',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.intro-label', start: 'top 85%' },
        }
      );

      /* ── Heading lines: staggered clip-path reveals ─────── */
      gsap.utils.toArray('.intro-line').forEach((el, i) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(0 0 100% 0)', y: 20 },
          {
            clipPath: 'inset(0 0 0% 0)',
            y: 0,
            duration: 1,
            delay: i * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.intro-lines-group',
              start: 'top 75%',
            },
          }
        );
      });

      /* ── Body text fade in ─────────────────────────────── */
      gsap.fromTo(
        '.intro-body-text',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.intro-body-text', start: 'top 80%' },
        }
      );

      /* ── Philosophy line ───────────────────────────────── */
      gsap.fromTo(
        '.intro-philosophy',
        { opacity: 0, scaleX: 0, transformOrigin: 'left center' },
        {
          opacity: 1, scaleX: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.intro-philosophy', start: 'top 85%' },
        }
      );

      /* ── Milestone cards stagger ───────────────────────── */
      gsap.fromTo(
        '.milestone-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.milestones-grid', start: 'top 80%' },
        }
      );

      /* ── Thin gold divider scaleX reveal ───────────────── */
      gsap.fromTo(
        '.intro-divider',
        { scaleX: 0, transformOrigin: 'left' },
        {
          scaleX: 1,
          duration: 1.4,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: '.intro-divider', start: 'top 90%' },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        background: 'var(--bg)',
        padding: 'clamp(5rem, 10vh, 10rem) clamp(1.5rem, 4vw, 4rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Huge ghost "SINCE" text ─────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          right: '-2%',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(8rem, 18vw, 22rem)',
          fontWeight: 600,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.025)',
          lineHeight: 1,
          letterSpacing: '-0.05em',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        SINCE
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Top row: year + label ───────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 'clamp(3rem, 6vh, 6rem)',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          {/* Large ghost year */}
          <div
            className="intro-year"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(5rem, 12vw, 14rem)',
              fontWeight: 300,
              lineHeight: 0.85,
              color: 'transparent',
              WebkitTextStroke: '1px rgba(201,168,76,0.25)',
              letterSpacing: '-0.04em',
              userSelect: 'none',
            }}
          >
            2012
          </div>

          {/* Section label top right */}
          <div className="intro-label" style={{ textAlign: 'right' }}>
            <span className="section-label" style={{ justifyContent: 'flex-end' }}>
              Our Story
            </span>
            <p
              style={{
                marginTop: '1.2rem',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
                fontStyle: 'italic',
                color: 'var(--muted)',
                maxWidth: '260px',
                lineHeight: 1.7,
                textAlign: 'right',
              }}
            >
              From a 40-seat room in Bandra<br />to one of Asia's finest tables.
            </p>
          </div>
        </div>

        {/* ── Thin horizontal gold divider ────────────── */}
        <div
          className="intro-divider divider-gold"
          style={{ marginBottom: 'clamp(3rem, 6vh, 5rem)' }}
        />

        {/* ── Main content: headline + body ───────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(3rem, 6vw, 8rem)',
            alignItems: 'start',
            marginBottom: 'clamp(4rem, 8vh, 7rem)',
          }}
          className="intro-grid"
        >
          {/* Left: Large headline lines */}
          <div className="intro-lines-group" style={{ overflow: 'hidden' }}>
            {[
              { text: 'A Decade', style: { fontStyle: 'normal', fontWeight: 300 } },
              { text: 'of Culinary', style: { fontStyle: 'italic', fontWeight: 400 } },
              { text: 'Mastery.', style: { fontStyle: 'normal', fontWeight: 300 } },
            ].map(({ text, style }, i) => (
              <div
                key={i}
                className="intro-line"
                style={{ overflow: 'hidden', lineHeight: 1.05, marginBottom: '0.1em' }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 4.5vw, 5.5rem)',
                    color: i === 1 ? 'var(--gold)' : 'var(--cream)',
                    display: 'block',
                    lineHeight: 1.1,
                    ...style,
                  }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Right: Body copy */}
          <div>
            <p
              className="intro-body-text"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.88rem, 1.2vw, 1rem)',
                color: 'var(--muted)',
                lineHeight: 1.9,
                marginBottom: '2rem',
                fontWeight: 300,
              }}
            >
              {restaurant.philosophy}
            </p>
            <p
              className="intro-body-text intro-philosophy"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                fontStyle: 'italic',
                color: 'var(--cream)',
                lineHeight: 1.6,
                paddingLeft: '1.5rem',
                borderLeft: '1px solid var(--gold-border)',
              }}
            >
              "{restaurant.philosophyShort}"
            </p>
          </div>
        </div>

        {/* ── Milestones timeline ──────────────────────── */}
        <div
          className="milestones-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5px',
            borderTop: '1px solid var(--border)',
          }}
        >
          {milestones.map((m, i) => (
            <div
              key={m.year}
              className="milestone-card"
              style={{
                padding: 'clamp(1.5rem, 3vh, 2.5rem) clamp(1rem, 2vw, 1.75rem)',
                borderRight: i < milestones.length - 1 ? '1px solid var(--border)' : 'none',
                position: 'relative',
              }}
            >
              {/* Year */}
              <div
                style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  color: 'var(--gold)',
                  marginBottom: '0.75rem',
                }}
              >
                {m.year}
              </div>
              {/* Title */}
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.05rem',
                  fontWeight: 400,
                  color: 'var(--cream)',
                  marginBottom: '0.6rem',
                  lineHeight: 1.3,
                }}
              >
                {m.title}
              </div>
              {/* Text */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  color: 'var(--muted)',
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}
              >
                {m.text}
              </p>

              {/* Index number (decorative) */}
              <div
                style={{
                  position: 'absolute',
                  top: 'clamp(1.5rem, 3vh, 2.5rem)',
                  right: 'clamp(1rem, 2vw, 1.75rem)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '3.5rem',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.03)',
                  lineHeight: 1,
                  userSelect: 'none',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Responsive grid override */}
      <style>{`
        @media (max-width: 900px) {
          .intro-grid { grid-template-columns: 1fr !important; }
          .milestones-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .milestones-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
