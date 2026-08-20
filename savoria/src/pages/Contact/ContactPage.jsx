import React from 'react';
import { motion } from 'framer-motion';
import ContactLeftPanel  from './ContactLeftPanel';
import ContactRightPanel from './ContactRightPanel';

/* ══════════════════════════════════════════════════════════════
   CONTACT PAGE — 50/50 split-screen layout
   Desktop  → side-by-side, left fixed height = viewport
   Tablet   → stacked (logo → content)
   Mobile   → fully vertical
══════════════════════════════════════════════════════════════ */
export default function ContactPage() {
  return (
    <>
      <main
        className="page-enter"
        aria-label="Contact SAVORIA"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: '100svh',
          paddingTop: '73px',
        }}
        id="contact-layout"
      >
        {/* Left 50% — sticky brand panel */}
        <div
          id="contact-left"
          style={{
            position: 'sticky',
            top: '73px',
            height: 'calc(100svh - 73px)',
            overflow: 'hidden',
          }}
        >
          <ContactLeftPanel />
        </div>

        {/* Right 50% — scrollable content */}
        <div id="contact-right">
          <ContactRightPanel />
        </div>
      </main>

      {/* Responsive styles */}
      <style>{`
        /* Tablet: stack layout */
        @media (max-width: 900px) {
          #contact-layout {
            grid-template-columns: 1fr !important;
          }
          #contact-left {
            position: relative !important;
            top: 0 !important;
            height: 60svh !important;
            min-height: 360px;
          }
        }
        /* Mobile: reduce left panel */
        @media (max-width: 600px) {
          #contact-left {
            height: 50svh !important;
            min-height: 280px !important;
          }
        }
      `}</style>
    </>
  );
}
