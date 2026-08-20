import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ServiceImage, Reveal, GoldRule } from './ServicesShared';

/* ══════════════════════════════════════════════════════════════
   FEATURE ROW — detail block used in every service section
══════════════════════════════════════════════════════════════ */
function ServiceDetails({ service }) {
  const { features, idealFor, cta } = service;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Features */}
      <div>
        <p style={{
          fontFamily: 'var(--font-label)', fontSize: '0.5rem',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: '0.9rem',
        }}>Includes</p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {features.map((f, i) => (
            <li key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
              fontFamily: 'var(--font-body)', fontSize: '0.85rem',
              color: 'var(--muted)', fontWeight: 300, lineHeight: 1.5,
            }}>
              <span style={{ color: 'var(--gold)', marginTop: '0.15rem', flexShrink: 0, opacity: 0.7 }}>—</span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Ideal for */}
      <div>
        <p style={{
          fontFamily: 'var(--font-label)', fontSize: '0.5rem',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: '0.9rem',
        }}>Ideal For</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {idealFor.map((tag, i) => (
            <span key={i} style={{
              padding: '0.3rem 0.75rem',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '2px',
              fontFamily: 'var(--font-body)', fontSize: '0.75rem',
              color: 'var(--cream)', fontWeight: 300,
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Link
        to={cta.href}
        className="btn-ghost"
        style={{ alignSelf: 'flex-start', textDecoration: 'none' }}
        aria-label={cta.label}
      >
        <span>{cta.label}</span>
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TEXT BLOCK
══════════════════════════════════════════════════════════════ */
function ServiceText({ service }) {
  const { number, eyebrow, title, headline, description } = service;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
        <span style={{
          fontFamily: 'var(--font-label)', fontSize: '0.55rem',
          letterSpacing: '0.12em', color: 'var(--muted)',
        }}>{number}</span>
        <span style={{
          fontFamily: 'var(--font-label)', fontSize: '0.5rem',
          letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)',
        }}>{eyebrow}</span>
      </div>

      <div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
          fontWeight: 300, lineHeight: 1.1, color: 'var(--cream)',
          marginBottom: '0.5rem',
        }}>
          {title}
        </h2>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1rem, 1.8vw, 1.3rem)',
          fontStyle: 'italic', color: 'rgba(201,168,76,0.7)',
          fontWeight: 300, lineHeight: 1.4,
        }}>
          {headline}
        </p>
      </div>

      <GoldRule />

      <p style={{
        fontFamily: 'var(--font-body)', fontSize: '0.9rem',
        color: 'var(--muted)', fontWeight: 300, lineHeight: 1.85,
        maxWidth: '480px',
      }}>
        {description}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LAYOUT A — image-right  (text left, image right)
   LAYOUT B — image-left   (image left, text right)
══════════════════════════════════════════════════════════════ */
function SideBySideSection({ service }) {
  const imageRight = service.layout !== 'image-left';

  const textCol = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', justifyContent: 'center' }}>
      <ServiceText service={service} />
      <ServiceDetails service={service} />
    </div>
  );

  const imageCol = (
    <Reveal y={40} delay={0.1} style={{ height: '100%' }}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: '100%', minHeight: '420px', borderRadius: '3px', overflow: 'hidden' }}
      >
        <ServiceImage src={service.image} alt={service.imageAlt} objectPosition={service.imagePosition} style={{ height: '100%' }} />
      </motion.div>
    </Reveal>
  );

  return (
    <section
      id={service.id}
      style={{
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 6rem)',
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(2rem, 5vw, 5rem)',
          alignItems: 'center',
        }}
        className="svc-side-grid"
      >
        <Reveal delay={0}>
          {imageRight ? textCol : imageCol}
        </Reveal>
        {imageRight ? imageCol : (
          <Reveal delay={0.1} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', justifyContent: 'center' }}>
            <ServiceText service={service} />
            <ServiceDetails service={service} />
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   LAYOUT FEATURE — full-width, image on top, content overlapping
   Used for Wedding Catering (the flagship service)
══════════════════════════════════════════════════════════════ */
function FeatureSection({ service }) {
  return (
    <section
      id={service.id}
      style={{
        padding: 'clamp(4rem, 8vw, 7rem) 0',
        background: 'var(--surface)',
      }}
    >
      {/* Wide image strip */}
      <Reveal y={30} delay={0}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            aspectRatio: '21 / 9',
            minHeight: '280px',
            maxHeight: '520px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <ServiceImage src={service.image} alt={service.imageAlt} objectPosition={service.imagePosition} style={{ height: '100%' }} />

          {/* Overlay gradient */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(6,6,6,0.7) 0%, transparent 50%, rgba(6,6,6,0.4) 100%)',
          }} />

          {/* Number badge on image */}
          <div aria-hidden style={{
            position: 'absolute', top: '1.5rem', left: 'clamp(1.5rem, 5vw, 6rem)',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(4rem, 8vw, 8rem)',
            fontWeight: 300, color: 'rgba(201,168,76,0.15)',
            lineHeight: 1, userSelect: 'none',
            letterSpacing: '-0.02em',
          }}>
            {service.number}
          </div>
        </motion.div>
      </Reveal>

      {/* Content panel */}
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 5vw, 6rem) 0',
      }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(2rem, 5vw, 5rem)',
          }}
          className="svc-feature-grid"
        >
          <Reveal delay={0.1}>
            <ServiceText service={service} />
          </Reveal>
          <Reveal delay={0.2}>
            <ServiceDetails service={service} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN EXPORT — routes each service to the right layout
══════════════════════════════════════════════════════════════ */
export default function ServiceSection({ service }) {
  if (service.layout === 'feature') return <FeatureSection service={service} />;
  return <SideBySideSection service={service} />;
}
