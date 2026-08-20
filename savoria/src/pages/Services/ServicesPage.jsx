import React from 'react';
import { servicesList } from '../../data/servicesData';
import ServicesHero    from './components/ServicesHero';
import ServiceSection  from './components/ServiceSection';
import { WhySavoria, ServicesCTA, ServicesNav } from './components/ServicesExtras';

/* ══════════════════════════════════════════════════════════════
   SERVICES PAGE
   Composition only — all sections are self-contained
══════════════════════════════════════════════════════════════ */
export default function ServicesPage() {
  return (
    <main className="page-enter" aria-label="SAVORIA Services">
      {/* ── 1. Hero ─────────────────────────────────────────── */}
      <ServicesHero />

      {/* ── 2. Quick-jump sticky nav ─────────────────────────── */}
      <ServicesNav services={servicesList} />

      {/* ── 3. Service sections ──────────────────────────────── */}
      {servicesList.map((service, idx) => (
        <ServiceSection key={service.id} service={service} />
      ))}

      {/* ── 4. Why SAVORIA ───────────────────────────────────── */}
      <WhySavoria />

      {/* ── 5. Final CTA ─────────────────────────────────────── */}
      <ServicesCTA />

      {/* Responsive: collapse side-by-side grids on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .svc-side-grid { grid-template-columns: 1fr !important; }
          .svc-feature-grid { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </main>
  );
}
