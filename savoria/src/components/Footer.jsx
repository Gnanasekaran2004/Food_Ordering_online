import React from 'react';
import { Link } from 'react-router-dom';
import { restaurant, navLinks, footerNav } from '../data/restaurantData';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
      }}
    >
      {/* ── Reserve CTA Banner ─────────────────────────── */}
      <div
        style={{
          borderBottom: '1px solid var(--border)',
          padding: 'clamp(3rem, 5vh, 4.5rem) clamp(1.5rem, 4vw, 4rem)',
          background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 70%)',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '0.6rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: '0.75rem',
              }}
            >
              Reserve Your Table
            </p>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
                fontWeight: 300,
                color: 'var(--cream)',
                lineHeight: 1.15,
              }}
            >
              An evening unlike any other
              <br />
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>awaits you.</em>
            </h3>
          </div>
          <Link to="/contact">
            <button className="btn-gold" style={{ whiteSpace: 'nowrap' }}>
              <span>Book Now</span>
            </button>
          </Link>
        </div>
      </div>

      {/* ── Main Footer Body ───────────────────────────── */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: 'clamp(3rem, 6vh, 5rem) clamp(1.5rem, 4vw, 4rem)',
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
          gap: 'clamp(2rem, 4vw, 4rem)',
        }}
        className="footer-grid"
      >
        {/* Column 1 — Brand */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '1.05rem',
              letterSpacing: '0.22em',
              color: 'var(--cream)',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1.5rem',
            }}
          >
            <span
              style={{
                width: '26px',
                height: '26px',
                border: '1px solid var(--gold)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                color: 'var(--gold)',
              }}
            >
              S
            </span>
            Savoria
          </div>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              color: 'var(--muted)',
              lineHeight: 1.8,
              fontWeight: 300,
              maxWidth: '220px',
              marginBottom: '2rem',
            }}
          >
            Fine dining elevated to an art form. Mumbai's most considered culinary destination since 2012.
          </p>

          {/* Social links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {restaurant.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  transition: 'color 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
              >
                <span style={{ width: '16px', height: '1px', background: 'currentColor', flexShrink: 0 }} />
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2 & 3 — Navigation */}
        {Object.entries(footerNav).map(([title, links]) => (
          <div key={title}>
            <h4
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '0.58rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: '1.5rem',
              }}
            >
              {title}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.82rem',
                      color: 'var(--muted)',
                      fontWeight: 300,
                      transition: 'color 0.25s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cream)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Column 4 — Contact & Hours */}
        <div>
          <h4
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '0.58rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '1.5rem',
            }}
          >
            Contact
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {/* Address */}
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.52rem',
                  letterSpacing: '0.15em',
                  color: 'rgba(201,168,76,0.5)',
                  textTransform: 'uppercase',
                  marginBottom: '0.3rem',
                }}
              >
                Address
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>
                {restaurant.location}
              </p>
            </div>

            {/* Phone */}
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.52rem',
                  letterSpacing: '0.15em',
                  color: 'rgba(201,168,76,0.5)',
                  textTransform: 'uppercase',
                  marginBottom: '0.3rem',
                }}
              >
                Reservations
              </p>
              <a
                href={`tel:${restaurant.phone}`}
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--muted)',
                  transition: 'color 0.25s ease',
                  fontWeight: 300,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cream)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
              >
                {restaurant.phone}
              </a>
            </div>

            {/* Hours */}
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.52rem',
                  letterSpacing: '0.15em',
                  color: 'rgba(201,168,76,0.5)',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                Hours
              </p>
              {[
                { days: restaurant.hours.weekdays, time: restaurant.hours.weekdayTime },
                { days: restaurant.hours.weekend, time: restaurant.hours.weekendTime },
              ].map((h) => (
                <div key={h.days} style={{ marginBottom: '0.4rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 300 }}>{h.days}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--cream)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>{h.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Thin gold separator ────────────────────────── */}
      <div className="divider-gold" style={{ marginLeft: 'clamp(1.5rem, 4vw, 4rem)', marginRight: 'clamp(1.5rem, 4vw, 4rem)' }} />

      {/* ── Bottom bar ─────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: 'clamp(1.25rem, 2.5vh, 1.75rem) clamp(1.5rem, 4vw, 4rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.52rem', letterSpacing: '0.15em', color: 'var(--muted-2)', textTransform: 'uppercase' }}>
          © {year} Savoria. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Privacy Policy', 'Terms', 'Accessibility'].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '0.52rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--muted-2)',
                transition: 'color 0.25s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--muted)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-2)')}
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
