import React from 'react';
import { motion } from 'framer-motion';
import { aboutData } from '../../../data/aboutData';
import ImagePlaceholder from '../../../components/ImagePlaceholder';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function StorySection() {
  const { story } = aboutData;

  return (
    <section
      style={{
        background: 'var(--bg)',
        padding: 'clamp(5rem, 10vw, 9rem) clamp(1.5rem, 6vw, 6rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background subtle rule */}
      <div className="divider-gold" style={{ marginBottom: 'clamp(4rem, 8vw, 7rem)' }} />

      <div
        style={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))',
          gap: 'clamp(3rem, 6vw, 6rem)',
          alignItems: 'center',
        }}
      >
        {/* Text column */}
        <div>
          <motion.div {...fadeUp(0)} className="section-label" style={{ marginBottom: '1.75rem' }}>
            {story.label}
          </motion.div>

          <motion.h2
            {...fadeUp(0.1)}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
              fontWeight: 300,
              color: 'var(--cream)',
              lineHeight: 1.12,
              marginBottom: '2rem',
            }}
          >
            {story.headline}
          </motion.h2>

          {story.paragraphs.map((para, i) => (
            <motion.p
              key={i}
              {...fadeUp(0.15 + i * 0.1)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.875rem, 1.4vw, 1rem)',
                fontWeight: 300,
                color: 'var(--muted)',
                lineHeight: 1.9,
                marginBottom: i < story.paragraphs.length - 1 ? '1.25rem' : 0,
              }}
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Image column */}
        <motion.div
          {...fadeUp(0.2)}
          style={{
            position: 'relative',
            aspectRatio: '4/5',
            maxHeight: '560px',
            borderRadius: '3px',
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}
        >
          <ImagePlaceholder label={story.imagePlaceholder} />
          {/* Decorative corner accent */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              width: '40px',
              height: '40px',
              borderTop: '1px solid var(--gold)',
              borderRight: '1px solid var(--gold)',
              opacity: 0.6,
            }}
          />
          <div
            aria-hidden
            style={{
              position: 'absolute',
              bottom: '1.25rem',
              left: '1.25rem',
              width: '40px',
              height: '40px',
              borderBottom: '1px solid var(--gold)',
              borderLeft: '1px solid var(--gold)',
              opacity: 0.6,
            }}
          />
        </motion.div>
      </div>

      <div className="divider-gold" style={{ marginTop: 'clamp(4rem, 8vw, 7rem)' }} />
    </section>
  );
}
