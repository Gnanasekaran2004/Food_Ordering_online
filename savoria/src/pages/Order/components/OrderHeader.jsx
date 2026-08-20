import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function OrderHeader() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.order-header-line', {
        clipPath: 'inset(0 0 100% 0)',
        y: 16,
        stagger: 0.1,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.2,
      });
      gsap.from('.order-header-sub', {
        opacity: 0,
        y: 12,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.55,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={ref}
      style={{
        paddingTop: 'clamp(6rem, 14vh, 9rem)',
        paddingBottom: 'clamp(2.5rem, 5vh, 4rem)',
        paddingLeft:  'clamp(1.5rem, 4vw, 4rem)',
        paddingRight: 'clamp(1.5rem, 4vw, 4rem)',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Decorative ghost text */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          right: '-1%',
          transform: 'translateY(-50%)',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(6rem, 14vw, 18rem)',
          fontWeight: 600,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.018)',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        MENU
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <span className="section-label" style={{ marginBottom: '1.5rem', display: 'flex' }}>
          Our Offerings
        </span>

        <div style={{ overflow: 'hidden', marginBottom: '0.15em' }}>
          <div className="order-header-line" style={{ overflow: 'hidden' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 5.5vw, 7rem)',
                fontWeight: 300,
                color: 'var(--cream)',
                lineHeight: 1.0,
                letterSpacing: '-0.02em',
              }}
            >
              Explore the
            </h1>
          </div>
          <div className="order-header-line" style={{ overflow: 'hidden' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 5.5vw, 7rem)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'var(--gold)',
                lineHeight: 1.0,
                letterSpacing: '-0.02em',
              }}
            >
              Menu.
            </h1>
          </div>
        </div>

        <p
          className="order-header-sub"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.82rem, 1.2vw, 0.95rem)',
            color: 'var(--muted)',
            lineHeight: 1.8,
            maxWidth: '480px',
            marginTop: '1.5rem',
            fontWeight: 300,
          }}
        >
          Seasonally composed dishes from Chef Arjun Malhotra's kitchen. Search, filter, and discover — then place your order directly from the table.
        </p>
      </div>
    </header>
  );
}
