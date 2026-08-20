import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { aboutData } from '../../../data/aboutData';

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════════════
   SAVORIA LOGO — 3D LAYER DECOMPOSITION

   The SAVORIA logo consists of:
     • A circular ring (gold outer ring)
     • An inner disc (slightly inset, dark)
     • The "S" letterform (gold, inside the ring)
     • The wordmark "SAVORIA" (gold Cinzel text)
     • A thin decorative rule under the wordmark
     • Two decorative bracket elements flanking the ring

   Each element is an independently animated CSS div.
   Assembled state = exact logo as used in Navbar.
   Scroll drives separation in Y + Z + subtle rotation.
   GSAP scrub ensures perfect bi-directional reversal.
══════════════════════════════════════════════════════════════ */

const LOGO_LAYERS = [
  /* ── 0: Outer glow ring (largest, behind everything) ─────── */
  {
    id: 'glow-ring',
    label: 'Identity',
    initialY:   0,
    deltaY:   -260,
    deltaZ:    60,
    deltaRotX:  -6,
    deltaOpacity: 0,
    render: () => (
      <div style={{
        width:  '164px',
        height: '164px',
        borderRadius: '50%',
        border: '1px solid rgba(201,168,76,0.12)',
        boxShadow: `
          0 0 48px rgba(201,168,76,0.08),
          0 0 100px rgba(201,168,76,0.04),
          inset 0 0 32px rgba(201,168,76,0.04)
        `,
        background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.025) 0%, transparent 70%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }} />
    ),
  },

  /* ── 1: Outer ring (the main circle border) ──────────────── */
  {
    id: 'outer-ring',
    label: 'Precision',
    initialY:   0,
    deltaY:   -180,
    deltaZ:    50,
    deltaRotX:  -4,
    deltaOpacity: 0,
    render: () => (
      <div style={{
        width:  '128px',
        height: '128px',
        borderRadius: '50%',
        border: '1.5px solid var(--gold)',
        boxShadow: `
          0 0 0 1px rgba(201,168,76,0.08),
          0 8px 32px rgba(0,0,0,0.6),
          0 2px 8px rgba(0,0,0,0.4),
          inset 0 1px 0 rgba(226,191,106,0.3),
          inset 0 -1px 0 rgba(138,106,40,0.4)
        `,
        background: `
          radial-gradient(ellipse 60% 50% at 50% 30%,
            rgba(226,191,106,0.07) 0%, transparent 60%),
          radial-gradient(ellipse at center,
            rgba(14,14,14,0.98) 0%, rgba(6,6,6,0.98) 100%)
        `,
      }} />
    ),
  },

  /* ── 2: Inner ring (thin inner accent) ───────────────────── */
  {
    id: 'inner-ring',
    label: 'Form',
    initialY:   0,
    deltaY:   -100,
    deltaZ:    35,
    deltaRotX:  -2,
    deltaOpacity: 0,
    render: () => (
      <div style={{
        width:  '108px',
        height: '108px',
        borderRadius: '50%',
        border: '0.5px solid rgba(201,168,76,0.25)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        background: 'transparent',
      }} />
    ),
  },

  /* ── 3: The "S" letterform ────────────────────────────────── */
  {
    id: 's-mark',
    label: 'Character',
    initialY:   0,
    deltaY:    0,
    deltaZ:    20,
    deltaRotX:  0,
    deltaOpacity: 0,
    render: () => (
      <div style={{
        fontFamily: 'var(--font-label)',
        fontSize: '3.5rem',
        fontWeight: 400,
        letterSpacing: '0.05em',
        color: 'transparent',
        background: `linear-gradient(160deg,
          rgba(226,191,106,1) 0%,
          rgba(201,168,76,1) 40%,
          rgba(138,106,40,0.9) 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textShadow: 'none',
        filter: 'drop-shadow(0 2px 8px rgba(201,168,76,0.35))',
        lineHeight: 1,
        userSelect: 'none',
      }}>
        S
      </div>
    ),
  },

  /* ── 4: Thin gold rule below ring ────────────────────────── */
  {
    id: 'divider',
    label: 'Refinement',
    initialY:  78,
    deltaY:    80,
    deltaZ:     8,
    deltaRotX:  2,
    deltaOpacity: 0,
    render: () => (
      <div style={{
        width:  '72px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
        boxShadow: '0 0 8px rgba(201,168,76,0.25)',
        opacity: 0.7,
      }} />
    ),
  },

  /* ── 5: Wordmark "SAVORIA" ───────────────────────────────── */
  {
    id: 'wordmark',
    label: 'Identity',
    initialY:  100,
    deltaY:    180,
    deltaZ:     0,
    deltaRotX:  4,
    deltaOpacity: 0,
    render: () => (
      <div style={{
        fontFamily: 'var(--font-label)',
        fontSize: '1.05rem',
        letterSpacing: '0.5em',
        textTransform: 'uppercase',
        fontWeight: 400,
        color: 'var(--cream)',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        textShadow: '0 1px 12px rgba(0,0,0,0.6)',
      }}>
        SAVORIA
      </div>
    ),
  },

  /* ── 6: Left bracket ornament ────────────────────────────── */
  {
    id: 'bracket-left',
    label: 'Craft',
    initialY:   0,
    deltaY:   -60,
    deltaZ:    15,
    deltaRotX: -3,
    deltaOpacity: 0,
    render: () => (
      <div style={{
        width:  '18px',
        height: '60px',
        borderTop:    '1px solid rgba(201,168,76,0.4)',
        borderLeft:   '1px solid rgba(201,168,76,0.4)',
        borderBottom: '1px solid rgba(201,168,76,0.4)',
        borderRadius: '2px 0 0 2px',
        opacity: 0.6,
      }} />
    ),
  },

  /* ── 7: Right bracket ornament ───────────────────────────── */
  {
    id: 'bracket-right',
    label: 'Intention',
    initialY:   0,
    deltaY:    60,
    deltaZ:    15,
    deltaRotX:  3,
    deltaOpacity: 0,
    render: () => (
      <div style={{
        width:  '18px',
        height: '60px',
        borderTop:    '1px solid rgba(201,168,76,0.4)',
        borderRight:  '1px solid rgba(201,168,76,0.4)',
        borderBottom: '1px solid rgba(201,168,76,0.4)',
        borderRadius: '0 2px 2px 0',
        opacity: 0.6,
      }} />
    ),
  },

  /* ── 8: Est. text ────────────────────────────────────────── */
  {
    id: 'est-text',
    label: 'Heritage',
    initialY:  124,
    deltaY:    260,
    deltaZ:    -8,
    deltaRotX:  6,
    deltaOpacity: 0,
    render: () => (
      <div style={{
        fontFamily: 'var(--font-label)',
        fontSize: '0.48rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: 'var(--muted)',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}>
        Mumbai · Est. 2012
      </div>
    ),
  },
];

/* ── Initial assembled layout — each layer absolutely positioned ─ */
// These positions place each element to form the complete logo
const ASSEMBLED_POSITIONS = [
  /* glow-ring   */ { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  /* outer-ring  */ { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  /* inner-ring  */ { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  /* s-mark      */ { top: '50%', left: '50%', transform: 'translate(-50%, -52%)' },
  /* divider     */ { top: 'calc(50% + 78px)', left: '50%', transform: 'translateX(-50%)' },
  /* wordmark    */ { top: 'calc(50% + 100px)', left: '50%', transform: 'translateX(-50%)' },
  /* bracket-L   */ { top: '50%', left: 'calc(50% - 82px)', transform: 'translateY(-50%)' },
  /* bracket-R   */ { top: '50%', left: 'calc(50% + 64px)', transform: 'translateY(-50%)' },
  /* est-text    */ { top: 'calc(50% + 124px)', left: '50%', transform: 'translateX(-50%)' },
];

/* ── Story phases ─────────────────────────────────────────── */
const STORY_PHASES = [
  {
    label: 'Identity',
    headline: 'Every great experience\nbegins with an identity.',
    body: 'The SAVORIA mark is not merely a logo. It is a promise — a distillation of everything the restaurant believes about food, craft, and hospitality.',
  },
  {
    label: 'Composition',
    headline: 'Behind every detail\nis a collection of choices.',
    body: 'Each element of the mark was designed with intention. The ring. The letterform. The proportions. Every decision made in service of clarity.',
  },
  {
    label: 'Craft',
    headline: 'Individually, each\nelement matters.',
    body: 'Separated, you see the components. Together, they become something unified — an identity that speaks before a single word is said.',
  },
  {
    label: 'Purpose',
    headline: 'Crafted with intention.\nServed with purpose.',
    body: 'The story returns to where it began. Assembled. Complete. Ready to be experienced.',
  },
];

export default function KitchenScene3D() {
  const { kitchenStory } = aboutData;
  const sectionRef = useRef(null);
  const wrapRef    = useRef(null);
  const [phase, setPhase] = useState(0);

  /* ── Mouse parallax — only active when section is in viewport ─ */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let inViewport = false;
    const observer = new IntersectionObserver(
      ([e]) => { inViewport = e.isIntersecting; },
      { threshold: 0 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    const handleMove = (e) => {
      if (!wrapRef.current || !inViewport || document.hidden) return;
      const dx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const dy = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(wrapRef.current, {
        rotateY: dx * 8, rotateX: -dy * 5,
        duration: 0.9, ease: 'power2.out', overwrite: 'auto',
      });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      observer.disconnect();
    };
  }, []);

  /* ── Scroll-driven logo decomposition ─────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=280%',
          scrub: 2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if      (p < 0.25) setPhase(0);
            else if (p < 0.55) setPhase(1);
            else if (p < 0.78) setPhase(2);
            else               setPhase(3);
          },
        },
      });

      // Phase 1 (0 → 0.55): disassemble — layers separate
      LOGO_LAYERS.forEach((layer, i) => {
        tl.to(`.logo-layer-${i}`, {
          y: layer.deltaY,
          z: layer.deltaZ,
          rotateX: layer.deltaRotX,
          duration: 1,
          ease: 'power1.inOut',
        }, 0);
      });

      // Labels appear at midpoint
      tl.to('.logo-label', {
        opacity: 1,
        x: 0,
        stagger: 0.04,
        duration: 0.4,
        ease: 'none',
      }, 0.38);

      // Phase 3 (0.68 → 1): reassemble — layers return
      LOGO_LAYERS.forEach((layer, i) => {
        tl.to(`.logo-layer-${i}`, {
          y: 0,
          z: 0,
          rotateX: 0,
          duration: 0.85,
          ease: 'power1.inOut',
        }, 0.68);
      });

      // Labels fade out on reassembly
      tl.to('.logo-label', {
        opacity: 0,
        x: -10,
        duration: 0.25,
        ease: 'none',
      }, 0.65);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const currentPhase = STORY_PHASES[Math.min(phase, STORY_PHASES.length - 1)];

  return (
    <section
      ref={sectionRef}
      style={{
        height: '100svh',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Ambient radial glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 50% 60% at 65% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Section label */}
      <div
        className="section-label"
        style={{
          position: 'absolute',
          top: 'clamp(5rem, 9vh, 7rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
        }}
      >
        {kitchenStory.label}
      </div>

      {/* ── Main content grid ─────────────────────────── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          gap: '4rem',
          padding: '0 clamp(1.5rem, 5vw, 5rem)',
        }}
        className="logo-scene-inner"
      >
        {/* Left: story text ───────────────────────────── */}
        <div style={{ position: 'relative', minHeight: '260px' }}>
          {/* Headline — always visible, top of column */}
          <div style={{ marginBottom: 'clamp(8rem, 14vw, 11rem)' }}>
            {kitchenStory.headline.split('\n').map((line, i) => (
              <div
                key={i}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 3.8vw, 3.4rem)',
                  fontWeight: 300,
                  color: 'var(--cream)',
                  lineHeight: 1.1,
                  display: 'block',
                  marginBottom: i === 0 ? '0.05em' : 0,
                }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Phase text — switches on phase change */}
          <div
            key={phase}
            style={{ animation: 'about-phase-in 0.55s var(--ease-expo) forwards' }}
          >
            <span style={{
              fontFamily: 'var(--font-label)',
              fontSize: '0.55rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              display: 'block',
              marginBottom: '0.75rem',
            }}>
              {currentPhase.label}
            </span>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.2rem, 2vw, 1.75rem)',
              fontWeight: 300,
              color: 'var(--cream)',
              fontStyle: 'italic',
              marginBottom: '0.9rem',
              lineHeight: 1.3,
            }}>
              {currentPhase.headline.split('\n').map((l, i) => (
                <span key={i} style={{ display: 'block' }}>{l}</span>
              ))}
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--muted)',
              fontWeight: 300,
              lineHeight: 1.85,
              maxWidth: '340px',
            }}>
              {currentPhase.body}
            </p>
          </div>

          {phase === 0 && (
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.45 }}>
              <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.48rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                Scroll to explore
              </span>
            </div>
          )}
        </div>

        {/* Right: 3D logo scene ────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '900px',
          }}
        >
          <div
            ref={wrapRef}
            style={{
              position: 'relative',
              width: '320px',
              height: '320px',
              transformStyle: 'preserve-3d',
            }}
          >
            {LOGO_LAYERS.map((layer, i) => (
              <div
                key={layer.id}
                className={`logo-layer-${i}`}
                style={{
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  willChange: 'transform',
                  transformStyle: 'preserve-3d',
                  ...ASSEMBLED_POSITIONS[i],
                }}
              >
                {layer.render()}

                {/* Layer label — fades in during separation */}
                <span
                  className="logo-label"
                  style={{
                    position: 'absolute',
                    left: 'calc(100% + 14px)',
                    top: '50%',
                    transform: 'translateY(-50%) translateX(-10px)',
                    fontFamily: 'var(--font-label)',
                    fontSize: '0.44rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    whiteSpace: 'nowrap',
                    opacity: 0,
                    pointerEvents: 'none',
                  }}
                >
                  {layer.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phase progress indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(1.5rem, 4vh, 3rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
        }}
      >
        {STORY_PHASES.map((_, i) => (
          <div
            key={i}
            style={{
              width: phase === i ? '22px' : '6px',
              height: '2px',
              borderRadius: '1px',
              background: phase === i ? 'var(--gold)' : 'rgba(201,168,76,0.2)',
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>

      {/* Styles */}
      <style>{`
        @keyframes about-phase-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .logo-scene-inner {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .logo-label { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-layer-0, .logo-layer-1, .logo-layer-2,
          .logo-layer-3, .logo-layer-4, .logo-layer-5,
          .logo-layer-6, .logo-layer-7, .logo-layer-8 {
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
