import React from 'react';
import { motion } from 'framer-motion';
import { contactData } from '../../data/contactData';
import ContactForm    from './ContactForm';
import ContactPlate3D from './ContactPlate3D';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
});

/* ── Small icon SVGs ─────────────────────────────────────────── */
const MapPin = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s-8-9.5-8-14a8 8 0 1 1 16 0c0 4.5-8 14-8 14z"/><circle cx="12" cy="8" r="3"/>
  </svg>
);
const Phone = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12 19.79 19.79 0 0 1 1.07 3.4 2 2 0 0 1 3.05 1.29h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const Mail = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/>
  </svg>
);
const Clock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

/* ── Single detail row ─────────────────────────────────────── */
function DetailRow({ icon, label, children }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        border: '1px solid rgba(201,168,76,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--gold)', flexShrink: 0, marginTop: '2px',
      }}>
        {icon}
      </div>
      <div>
        <span style={{
          fontFamily: 'var(--font-label)', fontSize: '0.5rem',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--muted)', display: 'block', marginBottom: '0.3rem',
        }}>
          {label}
        </span>
        {children}
      </div>
    </div>
  );
}

/* ── Thin gold divider ──────────────────────────────────────── */
function Divider() {
  return (
    <div style={{
      width: '100%', height: '1px',
      background: 'linear-gradient(90deg, var(--gold-dark) 0%, transparent 100%)',
      opacity: 0.25, margin: '0.25rem 0',
    }} />
  );
}

/* ── Dynamic Schedule Hook ───────────────────────────────────── */
function useRestaurantStatus(schedule) {
  const [status, setStatus] = React.useState({ state: 'CLOSED', text: 'CLOSED', subtext: '' });

  React.useEffect(() => {
    function checkStatus() {
      const now = new Date();
      // Shift date object to the target timezone
      const tzString = now.toLocaleString("en-US", {timeZone: schedule.timezone});
      const tzDate = new Date(tzString);
      
      const day = tzDate.getDay();
      const hours = tzDate.getHours();
      const minutes = tzDate.getMinutes();
      const currentTotalMins = hours * 60 + minutes;

      const todaySchedule = schedule.hours[day] || [];
      
      let newStatus = null;

      // 1. Check if currently open
      for (const slot of todaySchedule) {
        const [openH, openM] = slot.open.split(':').map(Number);
        const [closeH, closeM] = slot.close.split(':').map(Number);
        const openMins = openH * 60 + openM;
        const closeMins = closeH * 60 + closeM;
        
        if (currentTotalMins >= openMins && currentTotalMins < closeMins) {
          newStatus = { state: 'OPEN', text: 'OPEN NOW', subtext: `${slot.name} service` };
          break;
        }
        
        // 2. Check if opening soon (within 60 mins)
        if (currentTotalMins < openMins && currentTotalMins >= openMins - 60) {
          const open12 = new Date(tzDate);
          open12.setHours(openH, openM, 0);
          const timeString = open12.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          newStatus = { state: 'SOON', text: 'OPENING SOON', subtext: `${slot.name} begins at ${timeString}` };
          break;
        }
      }

      // 3. Find next opening if closed
      if (!newStatus) {
        // Later today
        for (const slot of todaySchedule) {
          const [openH, openM] = slot.open.split(':').map(Number);
          const openMins = openH * 60 + openM;
          if (currentTotalMins < openMins - 60) {
            const open12 = new Date(tzDate);
            open12.setHours(openH, openM, 0);
            const timeString = open12.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            newStatus = { state: 'CLOSED', text: 'CLOSED', subtext: `Next opening: Today at ${timeString}` };
            break;
          }
        }
      }

      if (!newStatus) {
        // Check next days
        const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        for (let offset = 1; offset <= 7; offset++) {
          const nextDay = (day + offset) % 7;
          const nextSchedule = schedule.hours[nextDay] || [];
          if (nextSchedule.length > 0) {
            const slot = nextSchedule[0];
            const [openH, openM] = slot.open.split(':').map(Number);
            const open12 = new Date(tzDate);
            open12.setHours(openH, openM, 0);
            const timeString = open12.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            const dayName = offset === 1 ? 'Tomorrow' : daysMap[nextDay];
            newStatus = { state: 'CLOSED', text: 'CLOSED', subtext: `Next opening: ${dayName} at ${timeString}` };
            break;
          }
        }
      }

      if (newStatus) {
        setStatus(newStatus);
      } else {
        setStatus({ state: 'CLOSED', text: 'CLOSED', subtext: '' });
      }
    }

    checkStatus();
    // Update every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [schedule]);

  return status;
}

/* ══════════════════════════════════════════════════════════════
   CONTACT RIGHT PANEL
══════════════════════════════════════════════════════════════ */
export default function ContactRightPanel() {
  const { tagline, intro, address, phone, email, restaurantSchedule, reservationNote, social } = contactData;
  const liveStatus = useRestaurantStatus(restaurantSchedule);

  return (
    <div
      style={{
        background: 'var(--surface)',
        overflowY: 'auto',
        padding: 'clamp(5rem, 8vw, 7rem) clamp(2rem, 5vw, 4.5rem) clamp(3rem, 6vw, 5rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.75rem',
      }}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <div>
        <motion.div {...fadeUp(0.1)} className="section-label" style={{ marginBottom: '1.25rem' }}>
          Contact
        </motion.div>
        <motion.h1 {...fadeUp(0.2)} style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
          fontWeight: 300,
          color: 'var(--cream)',
          lineHeight: 1.1,
          marginBottom: '1rem',
        }}>
          {tagline}
        </motion.h1>
        <motion.p {...fadeUp(0.3)} style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          color: 'var(--muted)',
          fontWeight: 300,
          lineHeight: 1.85,
          maxWidth: '480px',
        }}>
          {intro}
        </motion.p>
      </div>

      {/* ── Contact details ──────────────────────────────────── */}
      <motion.div {...fadeUp(0.4)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Divider />

        {/* Address */}
        <DetailRow icon={<MapPin />} label="Visit">
          <address style={{ fontStyle: 'normal', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--cream)', fontWeight: 300, lineHeight: 1.8 }}>
            {address.line1}<br />
            {address.area}, {address.city}<br />
            {address.state} {address.postalCode}<br />
            {address.country}
          </address>
        </DetailRow>

        <Divider />

        {/* Phone */}
        <DetailRow icon={<Phone />} label="Call">
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--cream)', fontWeight: 300, display: 'block', lineHeight: 1.6, transition: 'color 0.3s ease' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--cream)'}
          >
            {phone}
          </a>
        </DetailRow>

        <Divider />

        {/* Email */}
        <DetailRow icon={<Mail />} label="Write">
          <a
            href={`mailto:${email}`}
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--cream)', fontWeight: 300, display: 'block', lineHeight: 1.6, transition: 'color 0.3s ease' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--cream)'}
          >
            {email}
          </a>
        </DetailRow>

        <Divider />

        {/* Hours */}
        <DetailRow icon={<Clock />} label="Hours">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Live Status indicator */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.6rem',
                background: liveStatus.state === 'OPEN' ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${liveStatus.state === 'OPEN' ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '3px',
                marginBottom: '0.3rem'
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: liveStatus.state === 'OPEN' ? 'var(--gold)' : (liveStatus.state === 'SOON' ? '#e2bf6a' : 'var(--muted)'),
                  boxShadow: liveStatus.state === 'OPEN' ? '0 0 8px rgba(201,168,76,0.6)' : 'none',
                  display: 'block'
                }} />
                <span style={{
                  fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.15em',
                  color: liveStatus.state === 'OPEN' ? 'var(--gold)' : 'var(--cream)', textTransform: 'uppercase',
                }}>
                  {liveStatus.text}
                </span>
              </div>
              {liveStatus.subtext && (
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 300, fontStyle: 'italic', paddingLeft: '2px' }}>
                  {liveStatus.subtext}
                </div>
              )}
            </div>

            {/* Weekly Schedule */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {restaurantSchedule.display.map((h, i) => (
                <div key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 300, lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--muted)', marginRight: '0.4rem' }}>{h.days}:</span>
                  {h.closed ? (
                    <span style={{ color: 'rgba(224,92,92,0.7)' }}>Closed</span>
                  ) : (
                    <span style={{ color: 'var(--cream)' }}>{h.lunch} · {h.dinner}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DetailRow>

        <Divider />

        {/* Reservation note */}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 300, lineHeight: 1.75, fontStyle: 'italic', paddingLeft: 'calc(32px + 1rem)' }}>
          {reservationNote}
        </p>
      </motion.div>

      {/* ── Contact form ─────────────────────────────────────── */}
      <motion.div {...fadeUp(0.5)}>
        <div style={{
          fontFamily: 'var(--font-label)', fontSize: '0.55rem',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: '1.25rem',
          display: 'flex', alignItems: 'center', gap: '0.7rem',
        }}>
          <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
          Send a Message
        </div>
        <ContactForm />
      </motion.div>

      {/* ── 3D plate accent + social ─────────────────────────── */}
      <motion.div {...fadeUp(0.6)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Divider />
        <ContactPlate3D />

        {/* Social links */}
        {social.length > 0 && (
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {social.map(s => (
              <a
                key={s.label}
                href={s.href}
                aria-label={`SAVORIA on ${s.label}`}
                style={{
                  display: 'flex', flexDirection: 'column', gap: '0.2rem',
                  textDecoration: 'none', transition: 'opacity 0.3s ease',
                  opacity: 0.6,
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
              >
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  {s.label}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 300 }}>
                  {s.handle}
                </span>
              </a>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
