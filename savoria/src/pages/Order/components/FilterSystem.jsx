import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DIETARY_OPTIONS, SPICE_OPTIONS, PRICE_RANGE_LIMITS, SORT_OPTIONS } from '../../../data/menuData';

const SlidersIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
    <circle cx="8"  cy="6"  r="2" fill="currentColor" stroke="none"/>
    <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/>
    <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/>
  </svg>
);
const XIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ChevronIcon = ({ up }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: up ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

/* ── Price Range Slider ───────────────────────────────────────── */
function PriceSlider({ value, onChange }) {
  const trackRef = useRef(null);
  const dragging = useRef(null); // 'min' | 'max' | null
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const onPointerDown = (which) => (e) => {
    e.preventDefault();
    dragging.current = which;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const onPointerMove = useCallback((e) => {
    if (!dragging.current || !trackRef.current) return;
    const { left, width } = trackRef.current.getBoundingClientRect();
    const pct = clamp((e.clientX - left) / width, 0, 1);
    const raw = Math.round(PRICE_RANGE_LIMITS.min + pct * (PRICE_RANGE_LIMITS.max - PRICE_RANGE_LIMITS.min));
    const currentVal = valueRef.current;
    if (dragging.current === 'min') {
      onChange([clamp(raw, PRICE_RANGE_LIMITS.min, currentVal[1] - 100), currentVal[1]]);
    } else {
      onChange([currentVal[0], clamp(raw, currentVal[0] + 100, PRICE_RANGE_LIMITS.max)]);
    }
  }, [onChange]);

  const onPointerUp = useCallback(() => {
    dragging.current = null;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }, [onPointerMove]);

  useEffect(() => () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }, [onPointerMove, onPointerUp]);

  const minPct = ((value[0] - PRICE_RANGE_LIMITS.min) / (PRICE_RANGE_LIMITS.max - PRICE_RANGE_LIMITS.min)) * 100;
  const maxPct = ((value[1] - PRICE_RANGE_LIMITS.min) / (PRICE_RANGE_LIMITS.max - PRICE_RANGE_LIMITS.min)) * 100;

  return (
    <div style={{ userSelect: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
        <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--gold)' }}>
          ₹{value[0].toLocaleString('en-IN')}
        </span>
        <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--gold)' }}>
          ₹{value[1].toLocaleString('en-IN')}
        </span>
      </div>

      <div
        ref={trackRef}
        style={{ position: 'relative', height: '2px', background: 'var(--surface-3)', borderRadius: '1px', margin: '0 8px' }}
      >
        {/* Active range fill */}
        <div
          style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: `${minPct}%`,
            width: `${maxPct - minPct}%`,
            background: 'var(--gold)',
            borderRadius: '1px',
          }}
        />
        {/* Min handle */}
        {[['min', minPct], ['max', maxPct]].map(([which, pct]) => (
          <div
            key={which}
            onPointerDown={onPointerDown(which)}
            role="slider"
            aria-label={which === 'min' ? 'Minimum price' : 'Maximum price'}
            aria-valuenow={which === 'min' ? value[0] : value[1]}
            aria-valuemin={PRICE_RANGE_LIMITS.min}
            aria-valuemax={PRICE_RANGE_LIMITS.max}
            tabIndex={0}
            style={{
              position: 'absolute',
              top: '50%',
              left: `${pct}%`,
              transform: 'translate(-50%, -50%)',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: 'var(--bg)',
              border: '2px solid var(--gold)',
              cursor: 'grab',
              touchAction: 'none',
              transition: 'box-shadow 0.2s ease',
              zIndex: 2,
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 0 4px rgba(201,168,76,0.15)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Checkbox ─────────────────────────────────────────────────── */
function FilterCheckbox({ label, checked, onChange }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        cursor: 'pointer',
        padding: '0.3rem 0',
      }}
    >
      <span
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onClick={onChange}
        onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && onChange()}
        style={{
          width: '14px',
          height: '14px',
          border: `1px solid ${checked ? 'var(--gold)' : 'var(--border)'}`,
          borderRadius: '1px',
          background: checked ? 'var(--gold)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.2s ease',
          outline: 'none',
        }}
      >
        {checked && (
          <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="var(--bg)" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="1,6 4,10 11,2"/>
          </svg>
        )}
      </span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: checked ? 'var(--cream)' : 'var(--muted)', transition: 'color 0.2s ease', fontWeight: 300 }}>
        {label}
      </span>
    </label>
  );
}

/* ── Accordion section ────────────────────────────────────────── */
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.9rem 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--cream)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>
          {title}
        </span>
        <ChevronIcon up={open} />
      </button>
      {open && <div style={{ paddingBottom: '1rem' }}>{children}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN FILTER PANEL (shared by sidebar + mobile drawer)
══════════════════════════════════════════════════════════════ */
export function FilterPanel({ filters, onChange, onReset, resultCount }) {
  const toggle = (field, value) => {
    const current = filters[field];
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onChange({ ...filters, [field]: next });
  };

  const hasAny =
    filters.dietary.length > 0 ||
    filters.spice.length > 0 ||
    filters.price[0] !== PRICE_RANGE_LIMITS.min ||
    filters.price[1] !== PRICE_RANGE_LIMITS.max ||
    filters.chefSpecial ||
    filters.seasonal ||
    filters.unavailable;

  return (
    <div style={{ padding: '0.5rem 0' }}>
      {/* Result count + clear */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 300 }}>
          {resultCount} {resultCount === 1 ? 'dish' : 'dishes'}
        </span>
        {hasAny && (
          <button
            onClick={onReset}
            style={{ background: 'none', border: 'none', color: 'var(--gold)', fontFamily: 'var(--font-label)', fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Dietary */}
      <FilterSection title="Dietary">
        {DIETARY_OPTIONS.map(opt => (
          <FilterCheckbox
            key={opt.value}
            label={opt.label}
            checked={filters.dietary.includes(opt.value)}
            onChange={() => toggle('dietary', opt.value)}
          />
        ))}
      </FilterSection>

      {/* Spice Level */}
      <FilterSection title="Spice Level">
        {SPICE_OPTIONS.map(opt => (
          <FilterCheckbox
            key={opt.value}
            label={opt.label}
            checked={filters.spice.includes(opt.value)}
            onChange={() => toggle('spice', opt.value)}
          />
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <PriceSlider
          value={filters.price}
          onChange={price => onChange({ ...filters, price })}
        />
      </FilterSection>

      {/* Features */}
      <FilterSection title="Features">
        <FilterCheckbox
          label="Chef's Special"
          checked={filters.chefSpecial}
          onChange={() => onChange({ ...filters, chefSpecial: !filters.chefSpecial })}
        />
        <FilterCheckbox
          label="Seasonal Items"
          checked={filters.seasonal}
          onChange={() => onChange({ ...filters, seasonal: !filters.seasonal })}
        />
        <FilterCheckbox
          label="Include Unavailable"
          checked={filters.unavailable}
          onChange={() => onChange({ ...filters, unavailable: !filters.unavailable })}
        />
      </FilterSection>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ACTIVE FILTER CHIPS (shown above the grid)
══════════════════════════════════════════════════════════════ */
export function ActiveFilterChips({ filters, onChange, onReset }) {
  const chips = [];

  filters.dietary.forEach(v => {
    const opt = DIETARY_OPTIONS.find(o => o.value === v);
    if (opt) chips.push({ key: `diet-${v}`, label: opt.label, remove: () => onChange({ ...filters, dietary: filters.dietary.filter(x => x !== v) }) });
  });
  filters.spice.forEach(v => {
    const opt = SPICE_OPTIONS.find(o => o.value === v);
    if (opt) chips.push({ key: `spice-${v}`, label: opt.label, remove: () => onChange({ ...filters, spice: filters.spice.filter(x => x !== v) }) });
  });
  if (filters.price[0] !== PRICE_RANGE_LIMITS.min || filters.price[1] !== PRICE_RANGE_LIMITS.max) {
    chips.push({ key: 'price', label: `₹${filters.price[0].toLocaleString('en-IN')}–₹${filters.price[1].toLocaleString('en-IN')}`, remove: () => onChange({ ...filters, price: [PRICE_RANGE_LIMITS.min, PRICE_RANGE_LIMITS.max] }) });
  }
  if (filters.chefSpecial) chips.push({ key: 'chef', label: "Chef's Special", remove: () => onChange({ ...filters, chefSpecial: false }) });
  if (filters.seasonal)    chips.push({ key: 'seasonal', label: 'Seasonal', remove: () => onChange({ ...filters, seasonal: false }) });

  if (chips.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
      {chips.map(chip => (
        <span
          key={chip.key}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.7rem',
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '1px',
            fontFamily: 'var(--font-label)',
            fontSize: '0.55rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
          }}
        >
          {chip.label}
          <button
            onClick={chip.remove}
            aria-label={`Remove ${chip.label} filter`}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', display: 'flex', padding: 0 }}
          >
            <XIcon />
          </button>
        </span>
      ))}
      <button
        onClick={onReset}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-label)', fontSize: '0.53rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginLeft: '0.25rem' }}
      >
        Clear all
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MOBILE FILTER DRAWER BUTTON
══════════════════════════════════════════════════════════════ */
export function FilterDrawerButton({ activeCount, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open filters"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.6rem 1rem',
        background: activeCount > 0 ? 'rgba(201,168,76,0.08)' : 'var(--surface)',
        border: `1px solid ${activeCount > 0 ? 'rgba(201,168,76,0.3)' : 'var(--border)'}`,
        borderRadius: '2px',
        color: activeCount > 0 ? 'var(--gold)' : 'var(--muted)',
        fontFamily: 'var(--font-label)',
        fontSize: '0.58rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        whiteSpace: 'nowrap',
      }}
    >
      <SlidersIcon />
      Filters
      {activeCount > 0 && (
        <span style={{
          background: 'var(--gold)',
          color: 'var(--bg)',
          borderRadius: '50%',
          width: '16px',
          height: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.55rem',
          fontWeight: 700,
          letterSpacing: 0,
        }}>
          {activeCount}
        </span>
      )}
    </button>
  );
}
