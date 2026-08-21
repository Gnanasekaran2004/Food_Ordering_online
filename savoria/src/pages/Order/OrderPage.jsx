import React, { useState, useMemo, useCallback, useEffect, useDeferredValue } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { CATEGORIES, SORT_OPTIONS, PRICE_RANGE_LIMITS } from '../../data/menuData';
import { usePublicMenu } from './hooks/usePublicMenu';
import OrderHeader from './components/OrderHeader';
import SearchBar from './components/SearchBar';
import CategoryNav from './components/CategoryNav';
import { FilterPanel, ActiveFilterChips, FilterDrawerButton } from './components/FilterSystem';
import DishCard from './components/DishCard';
import FloatingCart from './components/FloatingCart';
import CartDrawer from './components/CartDrawer';

/* ── Sort icon ───────────────────────────────────────────────── */
const SortIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
  </svg>
);

/* ── Default filter state ────────────────────────────────────── */
const DEFAULT_FILTERS = {
  dietary:    [],
  spice:      [],
  price:      [PRICE_RANGE_LIMITS.min, PRICE_RANGE_LIMITS.max],
  chefSpecial: false,
  seasonal:    false,
  unavailable: false, // when false, hide unavailable dishes
};

/* ── Count active filters for badge ─────────────────────────── */
function countActive(f) {
  return (
    f.dietary.length +
    f.spice.length +
    (f.price[0] !== PRICE_RANGE_LIMITS.min || f.price[1] !== PRICE_RANGE_LIMITS.max ? 1 : 0) +
    (f.chefSpecial ? 1 : 0) +
    (f.seasonal ? 1 : 0)
  );
}

/* ── Filtering logic ─────────────────────────────────────────── */
function applyFilters(allDishes, { search, category, filters, sort }) {
  let result = allDishes || [];

  // Hide unavailable unless opted in
  if (!filters.unavailable) result = result.filter(d => d.available !== false);

  // Category
  if (category !== 'all') {
    result = result.filter(d => d.category?.toLowerCase() === category.toLowerCase());
  }

  // Search
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(d =>
      d.name?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q) ||
      d.dietaryTags?.some(t => t.toLowerCase().includes(q))
    );
  }

  // Dietary
  if (filters.dietary.length > 0) {
    result = result.filter(d =>
      filters.dietary.every(tag => d.dietaryTags && d.dietaryTags.includes(tag))
    );
  }

  // Spice
  if (filters.spice.length > 0) {
    result = result.filter(d => filters.spice.includes(d.spiceLevel));
  }

  // Price
  result = result.filter(d => d.price >= filters.price[0] && d.price <= filters.price[1]);

  // Booleans
  if (filters.chefSpecial) result = result.filter(d => d.chefSpecial);

  // Sorting
  switch (sort) {
    case 'popular':    result = [...result].sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0)); break;
    case 'price-asc':  result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0)); break;
    case 'price-desc': result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0)); break;
    case 'name-asc':   result = [...result].sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
    case 'rating':     result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
    case 'recommended':
    default:
      result = [...result].sort((a, b) => {
        const score = d => (d.featured ? 4 : 0) + (d.chefSpecial ? 2 : 0) + (d.popular ? 1 : 0);
        return score(b) - score(a);
      });
  }

  return result;
}

/* ══════════════════════════════════════════════════════════════
   ORDER PAGE
══════════════════════════════════════════════════════════════ */
export default function OrderPage() {
  const { dishes, loading: dishesLoading, error: dishesError } = usePublicMenu();
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('all');
  const [filters,  setFilters]  = useState(DEFAULT_FILTERS);
  const [sort,     setSort]     = useState('recommended');
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  // Use deferred values for text search and sliders to keep UI responsive
  const deferredSearch = useDeferredValue(search);
  const deferredFilters = useDeferredValue(filters);

  const filtered = useMemo(
    () => applyFilters(dishes, { search: deferredSearch, category, filters: deferredFilters, sort }),
    [dishes, deferredSearch, category, deferredFilters, sort]
  );

  const activeFilterCount = countActive(filters);

  /* ── Close sort dropdown on outside click ─────────────────── */
  useEffect(() => {
    if (!sortOpen) return;
    const handler = () => setSortOpen(false);
    setTimeout(() => window.addEventListener('click', handler), 0);
    return () => window.removeEventListener('click', handler);
  }, [sortOpen]);

  /* ── Close mobile filter drawer on Escape ─────────────────── */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setMobileFiltersOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label ?? 'Sort';

  return (
    <>
      <div
        style={{
          minHeight: '100svh',
          background: 'var(--bg)',
          paddingBottom: '6rem',
        }}
        className="page-enter"
      >
        <OrderHeader />

        {/* ── Toolbar: search + filters + sort ──────────────── */}
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 4vw, 4rem)',
          }}
        >
          {/* Row 1: search + filter button + sort */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <SearchBar value={search} onChange={setSearch} />

            {/* Mobile filter button (hidden on desktop via media) */}
            <div className="mobile-filter-btn">
              <FilterDrawerButton activeCount={activeFilterCount} onClick={() => setMobileFiltersOpen(true)} />
            </div>

            {/* Sort dropdown */}
            <div style={{ position: 'relative', marginLeft: 'auto' }}>
              <button
                onClick={e => { e.stopPropagation(); setSortOpen(o => !o); }}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1rem',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '2px',
                  color: 'var(--muted)',
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <SortIcon />
                {currentSortLabel}
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.ul
                    role="listbox"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0,  scale: 1 }}
                    exit={{   opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    onClick={e => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 4px)',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '2px',
                      listStyle: 'none',
                      minWidth: '200px',
                      zIndex: 50,
                      padding: '0.25rem 0',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}
                  >
                    {SORT_OPTIONS.map(opt => (
                      <li
                        key={opt.value}
                        role="option"
                        aria-selected={sort === opt.value}
                        onClick={() => { setSort(opt.value); setSortOpen(false); }}
                        style={{
                          padding: '0.65rem 1rem',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8rem',
                          color: sort === opt.value ? 'var(--gold)' : 'var(--muted)',
                          background: sort === opt.value ? 'rgba(201,168,76,0.06)' : 'transparent',
                          fontWeight: sort === opt.value ? 400 : 300,
                          transition: 'color 0.15s ease, background 0.15s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; if (sort !== opt.value) e.currentTarget.style.color = 'var(--cream)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = sort === opt.value ? 'rgba(201,168,76,0.06)' : 'transparent'; if (sort !== opt.value) e.currentTarget.style.color = 'var(--muted)'; }}
                      >
                        {opt.label}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Row 2: Category nav */}
          <div style={{ marginBottom: '1.5rem', overflowX: 'auto' }}>
            <CategoryNav activeCategory={category} onSelect={setCategory} />
          </div>

          {/* Active filter chips */}
          <div style={{ marginBottom: activeFilterCount > 0 ? '1rem' : 0 }}>
            <ActiveFilterChips filters={filters} onChange={setFilters} onReset={resetFilters} />
          </div>
        </div>

        {/* ── Main layout: sidebar + grid ───────────────────── */}
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 4vw, 4rem)',
            display: 'grid',
            gridTemplateColumns: '240px 1fr',
            gap: 'clamp(2rem, 3vw, 3rem)',
            alignItems: 'start',
          }}
          className="order-layout"
        >
          {/* ── Desktop filter sidebar ────────────────────── */}
          <aside
            className="desktop-filter-sidebar"
            style={{
              position: 'sticky',
              top: '6rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '3px',
              padding: '1rem 1.25rem',
            }}
          >
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.25rem' }}>
              Refine
            </p>
            <FilterPanel filters={filters} onChange={setFilters} onReset={resetFilters} resultCount={filtered.length} />
          </aside>

          {/* ── Dish grid ─────────────────────────────────── */}
          <div>
            {/* Result count */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 300 }}>
                Showing <span style={{ color: 'var(--cream)' }}>{filtered.length}</span> {filtered.length === 1 ? 'dish' : 'dishes'}
                {search && <> for <em style={{ color: 'var(--gold)' }}>"{search}"</em></>}
              </p>
            </div>

            {dishesLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'clamp(4rem, 10vh, 7rem) 2rem', gap: '1.25rem' }}>
                <div style={{ color: 'var(--gold)', fontSize: '2rem' }}>...</div>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Loading menu from the kitchen...</p>
              </div>
            ) : filtered.length === 0 ? (
              /* Empty state */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'clamp(4rem, 10vh, 7rem) 2rem', gap: '1.25rem', border: '1px solid var(--border)', borderRadius: '3px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--surface-3)', userSelect: 'none' }}>◈</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 300, color: 'var(--cream)', fontStyle: 'italic' }}>
                  No dishes match your selection.
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 300, maxWidth: '320px' }}>
                  Try adjusting your filters or search term.
                </p>
                <button onClick={() => { resetFilters(); setSearch(''); setCategory('all'); }} className="btn-ghost" style={{ marginTop: '0.5rem' }}>
                  <span>Clear All Filters</span>
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1px',
                  background: 'var(--border)',
                  border: '1px solid var(--border)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                {filtered.map((dish, i) => (
                  <div key={dish.id} style={{ background: 'var(--bg)', height: '100%' }}>
                    <DishCard dish={dish} index={i} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ───────────────────────────────── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              key="filter-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              aria-hidden
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              key="filter-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Filter options"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed',
                top: 0, left: 0, bottom: 0,
                width: 'min(320px, 90vw)',
                background: 'var(--surface)',
                borderRight: '1px solid var(--border)',
                zIndex: 201,
                overflowY: 'auto',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)' }}>Refine</span>
                <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters" style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--muted)' }}>
                  ✕
                </button>
              </div>
              <FilterPanel filters={filters} onChange={setFilters} onReset={resetFilters} resultCount={filtered.length} />
              <button onClick={() => setMobileFiltersOpen(false)} className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}>
                <span>Apply Filters</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Floating cart button ───────────────────────────────── */}
      <FloatingCart onClick={() => setCartOpen(true)} />

      {/* ── Cart drawer ────────────────────────────────────────── */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ── Responsive styles ─────────────────────────────────── */}
      <style>{`
        /* Desktop: hide mobile filter button, show sidebar */
        @media (min-width: 900px) {
          .mobile-filter-btn { display: none !important; }
          .desktop-filter-sidebar { display: block !important; }
          .order-layout { grid-template-columns: 240px 1fr !important; }
        }
        /* Tablet / Mobile: hide sidebar, show filter button */
        @media (max-width: 899px) {
          .desktop-filter-sidebar { display: none !important; }
          .mobile-filter-btn { display: block !important; }
          .order-layout { grid-template-columns: 1fr !important; }
        }
        /* Mobile: tighter grid */
        @media (max-width: 540px) {
          .order-layout > div > div[style*="auto-fill"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
