import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useCartActions, useCartState } from '../../../context/CartContext';
import ImagePlaceholder from '../../../components/ImagePlaceholder';

/* ── Diet tag icons ────────────────────────────────────────────── */
const DIET_ICONS = {
  vegetarian: { symbol: 'V', color: '#2E7D32', bg: 'rgba(46,125,50,0.12)', title: 'Vegetarian' },
  vegan:      { symbol: 'VG', color: '#2E7D32', bg: 'rgba(46,125,50,0.12)', title: 'Vegan' },
  glutenFree: { symbol: 'GF', color: '#B8860B', bg: 'rgba(184,134,11,0.12)', title: 'Gluten Free' },
  dairyFree:  { symbol: 'DF', color: '#1565C0', bg: 'rgba(21,101,192,0.12)', title: 'Dairy Free' },
  eggFree:    { symbol: 'EF', color: '#6A1B9A', bg: 'rgba(106,27,154,0.12)', title: 'Egg Free' },
};

const SPICE_LEVELS = {
  mild:   { dots: 1, color: '#E8A820', label: 'Mild' },
  medium: { dots: 2, color: '#E85D20', label: 'Medium' },
  spicy:  { dots: 3, color: '#C62828', label: 'Spicy' },
};

function SpiceDots({ level }) {
  if (!level) return null;
  const { dots, color } = SPICE_LEVELS[level];
  return (
    <span title={SPICE_LEVELS[level].label} aria-label={`Spice level: ${SPICE_LEVELS[level].label}`} style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {[1, 2, 3].map(i => (
        <span key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', background: i <= dots ? color : 'var(--surface-3)' }} />
      ))}
    </span>
  );
}

/* ── Add to Cart button / Qty controls ─────────────────────────── */
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CartControl({ dish }) {
  const { addItem, increaseQty, decreaseQty } = useCartActions();
  const { itemCount } = useCartState();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qty = itemCount(dish.id);

  if (!dish.available) {
    return (
      <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted-2)' }}>
        Unavailable
      </span>
    );
  }

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    addItem(dish);
  };

  if (qty === 0) {
    return (
      <button
        onClick={handleAddToCart}
        aria-label={`Add ${dish.name} to cart`}
        style={{
          padding: '0.5rem 1.1rem',
          border: '1px solid var(--gold-border)',
          borderRadius: '2px',
          background: 'transparent',
          color: 'var(--gold)',
          fontFamily: 'var(--font-label)',
          fontSize: '0.55rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--gold)';
          e.currentTarget.style.color = 'var(--bg)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--gold)';
        }}
      >
        Add to Cart
      </button>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        border: '1px solid var(--gold-border)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={e => { e.stopPropagation(); decreaseQty(dish.id); }}
        aria-label="Decrease quantity"
        style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
      >
        −
      </button>
      <span
        style={{ minWidth: '24px', textAlign: 'center', fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--cream)', lineHeight: '30px' }}
      >
        {qty}
      </span>
      <button
        onClick={e => { e.stopPropagation(); increaseQty(dish.id); }}
        aria-label="Increase quantity"
        style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
      >
        +
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DISH CARD
══════════════════════════════════════════════════════════════ */
const DishCard = React.memo(function DishCard({ dish, index }) {
  const cardRef = useRef(null);

  /* ── 3D perspective tilt ─────────────────────────────────────── */
  const onMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width  / 2) / (width  / 2);
    const y = (e.clientY - top  - height / 2) / (height / 2);
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 4}deg) scale(1.015)`;
  };
  const onMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      aria-label={dish.name}
      style={{
        height: '100%',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '3px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
        e.currentTarget.style.boxShadow   = '0 16px 48px rgba(0,0,0,0.5)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow   = 'none';
        /* Also reset 3D tilt on card leave */
        if (cardRef.current) {
          cardRef.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
        }
      }}
    >
      {/* ── Badges ──────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}
      >
        {dish.chefSpecial && (
          <span style={{ background: 'var(--gold)', color: 'var(--bg)', fontFamily: 'var(--font-label)', fontSize: '0.48rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.2rem 0.5rem', borderRadius: '1px' }}>
            Chef's Special
          </span>
        )}
        {dish.signature && !dish.chefSpecial && (
          <span style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)', fontFamily: 'var(--font-label)', fontSize: '0.48rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.2rem 0.5rem', borderRadius: '1px' }}>
            Signature
          </span>
        )}
        {dish.seasonal && (
          <span style={{ background: 'rgba(120,180,80,0.12)', color: '#7ab450', border: '1px solid rgba(120,180,80,0.25)', fontFamily: 'var(--font-label)', fontSize: '0.48rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.2rem 0.5rem', borderRadius: '1px' }}>
            Seasonal
          </span>
        )}
      </div>

      
      <div
        style={{
          height: '180px',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
          background: 'var(--surface-2)',
        }}
      >
        {dish.image ? (
          <img
            src={dish.image}
            alt={dish.name}
            width={400}
            height={180}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <ImagePlaceholder label={dish.name} />
        )}

        {/* Gradient overlay on image bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0, right: 0,
            height: '50%',
            background: 'linear-gradient(to top, var(--surface) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Unavailable overlay */}
        {!dish.available && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,6,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>Currently Unavailable</span>
          </div>
        )}
      </div>

      {/* ── Card body ───────────────────────────────────────────── */}
      <div style={{ padding: '1rem 1.1rem 1.1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>

        {/* Category */}
        <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          {dish.category.replace('mains', 'Main Course').replace('specials', "Chef's Specials")}
        </span>

        {/* Name */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 400, color: 'var(--cream)', lineHeight: 1.25 }}>
          {dish.name}
        </h3>

        {/* Short description */}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>
          {dish.shortDesc}
        </p>

        {/* Meta row: dietary tags + spice */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center', marginTop: 'auto' }}>
          {dish.dietaryTags.slice(0, 3).map(tag => {
            const icon = DIET_ICONS[tag];
            if (!icon) return null;
            return (
              <span
                key={tag}
                title={icon.title}
                aria-label={icon.title}
                style={{
                  padding: '0.15rem 0.4rem',
                  background: icon.bg,
                  border: `1px solid ${icon.color}22`,
                  borderRadius: '1px',
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.45rem',
                  letterSpacing: '0.1em',
                  color: icon.color,
                }}
              >
                {icon.symbol}
              </span>
            );
          })}
          <SpiceDots level={dish.spiceLevel} />
          {dish.rating && (
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 400 }}>
              ★ {dish.rating}
              <span style={{ color: 'var(--muted)', fontWeight: 300, marginLeft: '2px' }}>({dish.reviews})</span>
            </span>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border)', margin: '0.3rem 0' }} />

        {/* Price + Add to Cart */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.52rem', letterSpacing: '0.1em', color: 'var(--muted)', marginRight: '3px' }}>₹</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 400, color: 'var(--cream)' }}>
              {dish.price.toLocaleString('en-IN')}
            </span>
            {dish.calories && (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--muted-2)', marginLeft: '0.4rem', fontWeight: 300 }}>
                {dish.calories} kcal
              </span>
            )}
          </div>
          <CartControl dish={dish} />
        </div>
      </div>
    </motion.article>
  );
});

export default DishCard;
