import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LAYERS = [
  {
    id: 'top-bun',
    name: 'Brioche Top Bun',
    desc: 'House-baked',
    w: 260, h: 76,
    initialY: 0,
    deltaY: -200,   
    deltaRotateZ: -4,
    style: {
      borderRadius: '130px 130px 14px 14px / 72px 72px 14px 14px',
      background: `
        radial-gradient(ellipse 50% 45% at 50% 28%, rgba(218,168,100,0.35) 0%, transparent 60%),
        radial-gradient(ellipse 8px 5px at 42% 32%, rgba(200,170,110,0.7) 0%, transparent 100%),
        radial-gradient(ellipse 7px 4px at 58% 26%, rgba(200,170,110,0.65) 0%, transparent 100%),
        radial-gradient(ellipse 6px 4px at 33% 22%, rgba(200,170,110,0.55) 0%, transparent 100%),
        radial-gradient(ellipse 6px 4px at 68% 38%, rgba(200,170,110,0.5) 0%, transparent 100%),
        radial-gradient(ellipse 5px 3px at 76% 24%, rgba(200,170,110,0.45) 0%, transparent 100%),
        linear-gradient(180deg, #5E3318 0%, #7A4A24 25%, #9E6535 55%, #B8844A 80%, #C49050 100%)
      `,
      boxShadow: '0 12px 40px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.5), inset 0 -6px 16px rgba(0,0,0,0.35), inset 0 3px 10px rgba(218,168,100,0.15)',
    },
  },
  {
    id: 'patty',
    name: 'A5 Wagyu Patty',
    desc: '220g, charcoal grilled',
    w: 244, h: 28,
    initialY: 78,   // 76 + 2
    deltaY: -88,
    deltaRotateZ: -1,
    style: {
      borderRadius: '8px',
      background: `
        repeating-linear-gradient(
          90deg,
          rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 2px,
          transparent 2px, transparent 14px
        ),
        linear-gradient(180deg, #1E1008 0%, #2A1A0C 35%, #341E0E 60%, #2A1A0C 100%)
      `,
      boxShadow: '0 6px 24px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.5), inset 0 2px 6px rgba(255,255,255,0.04), inset 0 -3px 8px rgba(0,0,0,0.6)',
    },
  },
  {
    id: 'cheese',
    name: 'Aged Cheddar',
    desc: '24-month reserve',
    w: 268, h: 10,   // slightly wider — cheese drapes over patty
    initialY: 108,  // 78+28+2
    deltaY: -36,
    deltaRotateZ: 0,
    style: {
      borderRadius: '3px 3px 8px 8px',
      background: 'linear-gradient(180deg, #C07C10 0%, #D99320 30%, #E8A820 60%, #C88210 100%)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.4), inset 0 1px 4px rgba(255,220,100,0.3)',
    },
  },
  {
    id: 'lettuce',
    name: 'Iceberg Lettuce',
    desc: 'Farm-fresh',
    w: 272, h: 16,  // widest — hangs over the sides
    initialY: 120,  // 108+10+2
    deltaY: 36,
    deltaRotateZ: 1,
    style: {
      borderRadius: '50% 50% 50% 50% / 20% 20% 80% 80%',
      background: `
        radial-gradient(ellipse 80% 60% at 50% 10%, rgba(100,160,80,0.4) 0%, transparent 70%),
        linear-gradient(180deg, #1E4A1A 0%, #2D6525 40%, #3A7232 70%, #1E4A1A 100%)
      `,
      boxShadow: '0 4px 14px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.4), inset 0 2px 6px rgba(100,200,80,0.1)',
      opacity: 0.9,
    },
  },
  {
    id: 'tomato',
    name: 'Heritage Tomato',
    desc: 'Hand-picked',
    w: 240, h: 12,
    initialY: 138,  // 120+16+2
    deltaY: 90,
    deltaRotateZ: 2,
    style: {
      borderRadius: '50%',
      background: `
        radial-gradient(ellipse 35% 80% at 50% 50%, rgba(255,120,120,0.15) 0%, transparent 50%),
        linear-gradient(180deg, #6B1616 0%, #942020 40%, #AE2828 60%, #6B1616 100%)
      `,
      boxShadow: '0 3px 12px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.4), inset 0 1px 4px rgba(255,100,100,0.2)',
    },
  },
  {
    id: 'sauce',
    name: 'Truffle Aioli',
    desc: 'House recipe',
    w: 224, h: 7,
    initialY: 152,  // 138+12+2
    deltaY: 138,
    deltaRotateZ: 2,
    style: {
      borderRadius: '16px',
      background: 'linear-gradient(90deg, #C8A870 0%, #DEC090 50%, #C8A870 100%)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,240,200,0.3)',
      opacity: 0.85,
    },
  },
  {
    id: 'bottom-bun',
    name: 'Brioche Bottom',
    desc: 'Toasted & buttered',
    w: 260, h: 42,
    initialY: 161,  // 152+7+2
    deltaY: 200,
    deltaRotateZ: 4,
    style: {
      borderRadius: '10px 10px 130px 130px / 10px 10px 60px 60px',
      background: `
        radial-gradient(ellipse 50% 30% at 50% 85%, rgba(218,168,100,0.2) 0%, transparent 60%),
        linear-gradient(180deg, #C49050 0%, #A07040 35%, #7A4A24 70%, #5E3318 100%)
      `,
      boxShadow: '0 12px 30px rgba(0,0,0,0.7), 0 4px 10px rgba(0,0,0,0.5), inset 0 4px 10px rgba(218,168,100,0.12), inset 0 -8px 16px rgba(0,0,0,0.4)',
    },
  },
];


export default function HeroSection() {
  const sectionRef   = useRef(null);
  const burgerRef    = useRef(null);
  const burgerWrapRef = useRef(null);

  /* ── Mouse parallax on burger ──────────────────────────── */
  useEffect(() => {
    const handleMove = (e) => {
      if (!burgerWrapRef.current || !burgerRef.current || document.hidden) return;
      const rect = burgerRef.current.getBoundingClientRect();
      // Only process if burger is within viewport bounds
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      gsap.to(burgerWrapRef.current, {
        rotateY: dx * 14, rotateX: -dy * 10,
        duration: 0.7, ease: 'power2.out', overwrite: 'auto',
      });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',        
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      LAYERS.forEach((layer, i) => {
        tl.to(
          `.hero-layer-${i}`,
          {
            y: layer.deltaY,
            rotateZ: layer.deltaRotateZ,
            duration: 1,
            ease: 'none',
          },
          0 
        );
      });

      tl.to(
        '.burger-label',
        { opacity: 1, x: 0, stagger: 0.05, duration: 0.6, ease: 'none' },
        0.25 
      );

      tl.to('.hero-headline', {
        y: -80, opacity: 0, duration: 0.5, ease: 'none',
      }, 0.3);

      tl.to('.hero-reveal-text', {
        opacity: 1, y: 0, duration: 0.5, ease: 'none',
      }, 0.5);

      tl.to('.hero-bg-glow', {
        opacity: 0.12, scale: 1.4, duration: 1, ease: 'none',
      }, 0);

      tl.to('.scroll-indicator', {
        opacity: 0, duration: 0.2, ease: 'none',
      }, 0);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        height: '100svh',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      
      <div
        className="hero-bg-glow"
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 60% 55% at 65% 45%, rgba(201,168,76,0.06) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 20% 70%, rgba(140,60,20,0.04) 0%, transparent 60%)
          `,
          pointerEvents: 'none',
        }}
      />

      
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '100px 100px',
      }} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          height: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 4vw, 4rem)',
          alignItems: 'center',
          paddingTop: '72px', // navbar height
        }}
      >
        <div style={{ position: 'relative', paddingRight: 'clamp(1rem, 4vw, 4rem)' }}>

         
          <div className="hero-headline">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            >
              <span className="section-label" style={{ marginBottom: '2rem' }}>
                Mumbai · Est. 2012
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(4.5rem, 7.5vw, 9.5rem)',
                fontWeight: 300,
                lineHeight: 0.9,
                color: 'var(--cream)',
                letterSpacing: '-0.02em',
                marginBottom: '2.5rem',
              }}
            >
              TASTE
              <br />
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'transparent',
                  WebkitTextStroke: '1px var(--gold)',
                }}
              >
                the Art
              </em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 1.1 }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                color: 'var(--muted)',
                lineHeight: 1.8,
                maxWidth: '340px',
                marginBottom: '2.75rem',
                fontWeight: 300,
              }}
            >
              Fine dining elevated beyond expectation.
              Every plate: a considered composition of craft, season, and story.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.3 }}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
            >
              <Link to="/contact">
                <button className="btn-gold"><span>Reserve a Table</span></button>
              </Link>
              <Link to="/order">
                <button className="btn-ghost"><span>View Menu</span></button>
              </Link>
            </motion.div>
          </div>

          
          <div
            className="hero-reveal-text"
            style={{
              opacity: 0,
              transform: 'translateY(20px)',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(0.95rem, 1.5vw, 1.2rem)',
                fontStyle: 'italic',
                color: 'var(--muted)',
                lineHeight: 1.7,
                maxWidth: '360px',
                marginBottom: '1.5rem',
              }}
            >
              "Every ingredient is chosen with the same care a sculptor
              brings to choosing stone."
            </p>
            <span className="section-label">↑ Scroll up to reassemble</span>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            RIGHT COLUMN — 3D Burger
        ════════════════════════════════════════════════ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          {/* 3D perspective container */}
          <div
            ref={burgerRef}
            style={{
              perspective: '900px',
              perspectiveOrigin: '50% 40%',
            }}
          >
            {/* Inner burger group — receives mouse rotateX/Y */}
            <div
              ref={burgerWrapRef}
              style={{
                transformStyle: 'preserve-3d',
                position: 'relative',
                width: '340px',   // wide enough for labels on right
                height: '210px',  // assembled burger height
                willChange: 'transform',
              }}
            >
              {/* ── Burger layers ──────────────────────── */}
              {LAYERS.map((layer, i) => (
                <motion.div
                  key={layer.id}
                  className={`burger-layer hero-layer-${i}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.9 + i * 0.07,
                  }}
                  style={{
                    top: `${layer.initialY}px`,
                    width: `${layer.w}px`,
                    height: `${layer.h}px`,
                    ...layer.style,
                  }}
                >
                  {/* ── Ingredient label (appears on scroll) ── */}
                  <div
                    className="burger-label"
                    style={{
                      position: 'absolute',
                      left: `${layer.w + 16}px`,
                      top: '50%',
                      transform: 'translateY(-50%) translateX(14px)',
                      opacity: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                    }}
                  >
                    {/* Thin gold connector line */}
                    <div
                      style={{
                        width: '28px',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5))',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-label)',
                          fontSize: '0.58rem',
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          color: 'var(--gold)',
                          lineHeight: 1.2,
                        }}
                      >
                        {layer.name}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.62rem',
                          color: 'var(--muted)',
                          fontStyle: 'italic',
                          marginTop: '1px',
                        }}
                      >
                        {layer.desc}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* ── Drop shadow on the assembled burger ── */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '220px',
                  height: '16px',
                  background: 'radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)',
                  filter: 'blur(8px)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom-Left: Scroll Indicator ─────────────────── */}
      <div
        className="scroll-indicator"
        style={{
          position: 'absolute',
          bottom: 'clamp(1.5rem, 4vh, 3rem)',
          left: 'clamp(1.5rem, 4vw, 4rem)',
          zIndex: 10,
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0.6rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '0.55rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            Scroll to explore
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '1px',
                height: '48px',
                background: 'linear-gradient(to bottom, var(--gold), transparent)',
                animation: 'scrollPulse 2s ease-in-out infinite',
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* ── Corner info badges ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{
          position: 'absolute',
          bottom: 'clamp(1.5rem, 4vh, 3rem)',
          right: 'clamp(1.5rem, 4vw, 4rem)',
          display: 'flex',
          gap: '2.5rem',
        }}
      >
        {[
          { value: '150+', label: 'Menu Items' },
          { value: '12',   label: 'Years' },
          { value: '4.9★', label: 'Rating' },
        ].map((item) => (
          <div key={item.label} style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 400,
                color: 'var(--gold)',
                lineHeight: 1,
              }}
            >
              {item.value}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '0.52rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginTop: '3px',
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </motion.div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { transform: scaleY(1); opacity: 0.6; }
          50% { transform: scaleY(1.2); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
