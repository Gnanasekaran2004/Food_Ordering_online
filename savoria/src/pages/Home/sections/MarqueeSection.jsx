import { marqueeItems } from '../../../data/restaurantData';

export default function MarqueeSection() {
  const items = [...marqueeItems, ...marqueeItems]; // duplicate for seamless loop

  return (
    <div
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '1.1rem 0',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div className="marquee-track" style={{ gap: '2rem' }}>
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '0.58rem',
              letterSpacing: item.accent ? '0.1em' : '0.22em',
              textTransform: 'uppercase',
              color: item.accent ? 'var(--gold)' : 'var(--muted)',
              flexShrink: 0,
              fontWeight: item.accent ? 400 : 400,
            }}
          >
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
