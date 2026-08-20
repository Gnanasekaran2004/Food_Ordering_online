import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/* ══════════════════════════════════════════════════════════════
   SERVICE IMAGE PLACEHOLDER
   Shows an elegant branded placeholder until the real image is
   placed in public/images/services/<filename>.
   Once the image file exists, it renders normally.
══════════════════════════════════════════════════════════════ */
export function ServiceImage({ src, alt, objectPosition = 'center', style = {}, className = '' }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const showPlaceholder = errored || !src;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'var(--surface-2)',
        ...style,
      }}
      className={className}
    >
      {/* Elegant placeholder */}
      {showPlaceholder && (
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '1rem',
            background: `
              radial-gradient(ellipse 60% 50% at 50% 40%, rgba(201,168,76,0.05) 0%, transparent 65%),
              linear-gradient(160deg, var(--surface-3) 0%, var(--surface-2) 100%)
            `,
          }}
        >
          {/* Camera icon */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="rgba(201,168,76,0.3)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          {/* Service title hint */}
          {alt && (
            <span style={{
              fontFamily: 'var(--font-label)', fontSize: '0.5rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.3)', textAlign: 'center',
              maxWidth: '200px', lineHeight: 1.6,
            }}>
              {alt}
            </span>
          )}
          {/* Subtle dot-grid */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(201,168,76,0.04) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
        </div>
      )}

      {/* Actual image (hidden until loaded) */}
      {!errored && src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL — simple Framer Motion wrapper
══════════════════════════════════════════════════════════════ */
export function Reveal({ children, delay = 0, y = 32, className = '', style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   GOLD DIVIDER
══════════════════════════════════════════════════════════════ */
export function GoldRule({ width = '48px' }) {
  return (
    <div style={{
      width, height: '1px',
      background: 'linear-gradient(90deg, var(--gold), transparent)',
      opacity: 0.6,
    }} />
  );
}
