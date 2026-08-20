import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { restaurant } from '../../../data/restaurantData';

gsap.registerPlugin(ScrollTrigger);

export default function QuoteSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Quote clip-path reveal ─────────────────────── */
      gsap.fromTo(
        '.quote-text',
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.quote-text', start: 'top 75%' },
        }
      );

      /* ── Attribution fade ─────────────────────────── */
      gsap.fromTo(
        '.quote-attribution',
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: '.quote-attribution', start: 'top 80%' },
        }
      );

      /* ── Gold marks scale in ────────────────────────── */
      gsap.fromTo(
        '.quote-mark',
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1, scale: 1,
          duration: 1, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: '.quote-text', start: 'top 75%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: 'clamp(5rem, 10vh, 8rem) clamp(1.5rem, 4vw, 4rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Opening gold quotation mark */}
        <div
          className="quote-mark"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(5rem, 10vw, 8rem)',
            color: 'var(--gold)',
            lineHeight: 1,
            opacity: 0.4,
            marginBottom: '-1rem',
            display: 'block',
          }}
        >
          "
        </div>

        {/* The quote */}
        <blockquote
          className="quote-text"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 3vw, 2.4rem)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'var(--cream)',
            lineHeight: 1.5,
            letterSpacing: '0.01em',
            marginBottom: '2.5rem',
            maxWidth: '820px',
            margin: '0 auto 2.5rem',
          }}
        >
          {restaurant.chef.quote}
        </blockquote>

        {/* Attribution */}
        <div className="quote-attribution">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '0.5rem',
            }}
          >
            <div style={{ height: '1px', width: '40px', background: 'var(--gold-border)' }} />
            <span
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '0.62rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
              }}
            >
              {restaurant.chef.name}
            </span>
            <div style={{ height: '1px', width: '40px', background: 'var(--gold-border)' }} />
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.78rem',
              color: 'var(--muted)',
              letterSpacing: '0.05em',
            }}
          >
            {restaurant.chef.title}
          </p>
        </div>
      </div>
    </section>
  );
}
