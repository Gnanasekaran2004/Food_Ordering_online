import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services } from '../../../data/restaurantData';
import ImagePlaceholder from '../../../components/ImagePlaceholder';

gsap.registerPlugin(ScrollTrigger);

/* ── 3D tilt effect on mouse move ─────────────────────── */
function addTilt(cardEl) {
  const onMove = (e) => {
    const rect = cardEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(cardEl, {
      rotateY: x * 16,
      rotateX: -y * 12,
      scale: 1.02,
      duration: 0.45,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };
  const onLeave = () => {
    gsap.to(cardEl, {
      rotateY: 0, rotateX: 0, scale: 1,
      duration: 0.7, ease: 'power3.out', overwrite: 'auto',
    });
  };
  cardEl.addEventListener('mousemove', onMove);
  cardEl.addEventListener('mouseleave', onLeave);
  return () => {
    cardEl.removeEventListener('mousemove', onMove);
    cardEl.removeEventListener('mouseleave', onLeave);
  };
}

function ServiceCard({ service, style = {}, className = '' }) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const cleanup = addTilt(cardRef.current);
    return cleanup;
  }, []);

  return (
    <div
      ref={cardRef}
      className={`service-card ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '3px',
        cursor: 'pointer',
        border: '1px solid var(--border)',
        ...style,
      }}
      onMouseEnter={(e) => {
        const overlay = e.currentTarget.querySelector('.service-overlay');
        if (overlay) gsap.to(overlay, { opacity: 1, duration: 0.4 });
        const label = e.currentTarget.querySelector('.service-info');
        if (label) gsap.to(label, { y: -8, duration: 0.4, ease: 'power2.out' });
      }}
      onMouseLeave={(e) => {
        const overlay = e.currentTarget.querySelector('.service-overlay');
        if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.4 });
        const label = e.currentTarget.querySelector('.service-info');
        if (label) gsap.to(label, { y: 0, duration: 0.5, ease: 'power2.out' });
      }}
    >
      {/* ── Image or placeholder ──────────────────────── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {service.imageSrc ? (
          /* Replace ImagePlaceholder with real img when you have photos: */
          /* <img src={service.imageSrc} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */
          <img
            src={service.imageSrc}
            alt={service.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <ImagePlaceholder label={service.imagePlaceholderLabel} />
        )}
      </div>

      {/* ── Dark gradient overlay (always present, bottom) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '65%',
          background: 'linear-gradient(to top, rgba(6,6,6,0.95) 0%, rgba(6,6,6,0.6) 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Hover overlay (secondary dark) ─────────────── */}
      <div
        className="service-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(6,6,6,0.55)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ── Service info ─────────────────────────────── */}
      <div
        className="service-info"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 'clamp(1rem, 2.5vw, 1.75rem)',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '0.52rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
            }}
          >
            {service.category}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.95rem',
              color: 'rgba(201,168,76,0.3)',
              fontWeight: 300,
            }}
          >
            {service.number}
          </span>
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            fontWeight: 400,
            color: 'var(--cream)',
            marginBottom: '0.5rem',
            lineHeight: 1.2,
          }}
        >
          {service.title}
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.78rem',
            color: 'rgba(239,232,213,0.6)',
            lineHeight: 1.65,
            fontWeight: 300,
            maxWidth: '280px',
          }}
        >
          {service.description}
        </p>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef(null);

  /* ── Scroll-triggered staggered card reveals ────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Header */
      gsap.fromTo(
        '.services-label',
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.services-label', start: 'top 85%' },
        }
      );

      gsap.utils.toArray('.services-headline-line').forEach((el, i) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(0 0 100% 0)', y: 18 },
          {
            clipPath: 'inset(0 0 0% 0)', y: 0,
            duration: 0.95, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: '.services-headline', start: 'top 80%' },
          }
        );
      });

      /* Cards stagger */
      gsap.fromTo(
        '.service-card',
        { opacity: 0, y: 50, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.9,
          stagger: {
            each: 0.12,
            from: 'start',
          },
          ease: 'power3.out',
          scrollTrigger: { trigger: '.services-grid', start: 'top 78%' },
        }
      );

      /* Parallax on large card image */
      gsap.to('.service-parallax-img', {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const [large, tall, ...rest] = services; // row 1: large + tall, row 2: rest

  return (
    <section
      ref={sectionRef}
      id="services"
      style={{
        background: 'var(--bg)',
        padding: 'clamp(5rem, 10vh, 10rem) clamp(1.5rem, 4vw, 4rem)',
        position: 'relative',
      }}
    >
      {/* ── Section header ─────────────────────────────── */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          marginBottom: 'clamp(3rem, 5vh, 4rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '2rem',
        }}
      >
        <div>
          <div className="services-label">
            <span className="section-label" style={{ marginBottom: '1.2rem', display: 'flex' }}>
              Our Craft
            </span>
          </div>
          <div className="services-headline" style={{ overflow: 'hidden' }}>
            {['What We Offer,', 'How We Serve.'].map((line, i) => (
              <div key={i} className="services-headline-line" style={{ overflow: 'hidden' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 4.5vw, 5.5rem)',
                    fontWeight: i === 1 ? 400 : 300,
                    fontStyle: i === 1 ? 'italic' : 'normal',
                    color: i === 1 ? 'var(--gold)' : 'var(--cream)',
                    lineHeight: 1.05,
                    display: 'block',
                  }}
                >
                  {line}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: 'var(--muted)',
            lineHeight: 1.8,
            maxWidth: '320px',
            fontWeight: 300,
          }}
        >
          Every facet of Savoria is designed with the same attention we bring to each plate — considered, purposeful, and crafted for your experience.
        </p>
      </div>

      {/* ── Services Grid ─────────────────────────────── */}
      <div
        className="services-grid"
        style={{ maxWidth: '1400px', margin: '0 auto' }}
      >
        {/* Row 1: Large (60%) + Tall (40%) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr',
            gap: '6px',
            marginBottom: '6px',
          }}
        >
          {/* Large card */}
          <ServiceCard
            service={large}
            style={{ height: 'clamp(320px, 40vw, 520px)' }}
          />
          {/* Tall card */}
          <ServiceCard
            service={tall}
            style={{ height: 'clamp(320px, 40vw, 520px)' }}
          />
        </div>

        {/* Row 2: Three equal cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px',
          }}
        >
          {rest.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              style={{ height: 'clamp(240px, 25vw, 360px)' }}
            />
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ─────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1400px',
          margin: 'clamp(2.5rem, 4vh, 3.5rem) auto 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          paddingTop: 'clamp(2rem, 3vh, 2.5rem)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1rem, 1.8vw, 1.3rem)',
            fontStyle: 'italic',
            color: 'var(--muted)',
          }}
        >
          Interested in a bespoke experience?
        </p>
        <button className="btn-gold"><span>Enquire Now</span></button>
      </div>

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 768px) {
          .services-grid > div:first-child { grid-template-columns: 1fr !important; }
          .services-grid > div:last-child  { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
