import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/* ══════════════════════════════════════════════════════════════
   3D PLATE ACCENT — CSS 3D table-setting silhouette
   Performance optimisations:
   • IntersectionObserver pauses animation when scrolled off
   • Page Visibility API pauses animation when tab is hidden
   • prefers-reduced-motion respected
   • mousemove listener is passive and only active when visible
══════════════════════════════════════════════════════════════ */

export default function ContactPlate3D() {
  const wrapRef      = useRef(null);
  const containerRef = useRef(null);
  const tweenRef     = useRef(null);
  const isVisibleRef = useRef(false);
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* ── Create ambient tween once (paused initially) ───────────── */
  useEffect(() => {
    if (prefersReduced || !wrapRef.current) return;

    tweenRef.current = gsap.to(wrapRef.current, {
      y: -10, rotateY: 10, rotateX: -3,
      duration: 4, ease: 'sine.inOut',
      yoyo: true, repeat: -1, paused: true,
    });

    return () => { tweenRef.current?.kill(); };
  }, []);

  /* ── IntersectionObserver — pause/resume on scroll ──────────── */
  useEffect(() => {
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          tweenRef.current?.resume();
        } else {
          tweenRef.current?.pause();
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  /* ── Page Visibility API — pause when tab hidden ────────────── */
  useEffect(() => {
    if (prefersReduced) return;

    const handleVisibility = () => {
      if (document.hidden) {
        tweenRef.current?.pause();
      } else if (isVisibleRef.current) {
        tweenRef.current?.resume();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  /* ── Mouse parallax — passive, only fires when visible ──────── */
  useEffect(() => {
    if (prefersReduced) return;

    const handleMove = (e) => {
      if (!isVisibleRef.current || !wrapRef.current) return;
      const dx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const dy = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(wrapRef.current, {
        x: dx * 8, rotateZ: dx * 2,
        duration: 1.4, ease: 'power2.out', overwrite: 'auto',
      });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem 0', perspective: '700px',
      }}
    >
      <div
        ref={wrapRef}
        style={{ position: 'relative', transformStyle: 'preserve-3d' }}
      >
        {/* ── Outer plate ring ─────────────────────────────── */}
        <div style={{
          width: '160px', height: '160px', borderRadius: '50%',
          border: '1.5px solid rgba(201,168,76,0.35)',
          boxShadow: `
            0 0 0 8px rgba(201,168,76,0.04),
            0 12px 40px rgba(0,0,0,0.6),
            0 4px 12px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(226,191,106,0.18),
            inset 0 -1px 0 rgba(138,106,40,0.2)
          `,
          background: `
            radial-gradient(ellipse 50% 40% at 50% 32%, rgba(226,191,106,0.05) 0%, transparent 55%),
            radial-gradient(ellipse at center, rgba(16,14,12,0.97) 0%, rgba(8,7,6,1) 100%)
          `,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          {/* Inner rim */}
          <div style={{
            width: '130px', height: '130px', borderRadius: '50%',
            border: '0.5px solid rgba(201,168,76,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Plate centre well */}
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(24,22,18,0.9) 0%, rgba(10,9,7,1) 100%)',
              border: '0.5px solid rgba(201,168,76,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: 'var(--gold)', opacity: 0.4,
                boxShadow: '0 0 8px rgba(201,168,76,0.4)',
              }} />
            </div>
          </div>
        </div>

        {/* ── Fork ─────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', left: '-28px', top: '50%',
          transform: 'translateY(-50%)', display: 'flex', gap: '5px',
        }}>
          <div style={{
            width: '2px', height: '72px',
            background: 'linear-gradient(180deg, rgba(201,168,76,0.5) 0%, rgba(138,106,40,0.2) 100%)',
            borderRadius: '1px', position: 'relative',
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                position: 'absolute', top: 0, left: `${(i - 1) * 3}px`,
                width: '1.5px', height: '18px',
                background: 'rgba(201,168,76,0.35)', borderRadius: '1px',
              }} />
            ))}
          </div>
        </div>

        {/* ── Knife ────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', right: '-22px', top: '50%',
          transform: 'translateY(-50%)',
        }}>
          <div style={{
            width: '2.5px', height: '72px',
            background: 'linear-gradient(180deg, rgba(180,190,200,0.4) 0%, rgba(100,110,120,0.15) 100%)',
            borderRadius: '1px 2px 1px 1px', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: '0', right: '-1px',
              width: '4px', height: '28px',
              background: 'linear-gradient(180deg, rgba(200,210,220,0.3) 0%, transparent 100%)',
              borderRadius: '0 2px 0 0',
            }} />
          </div>
        </div>

        {/* ── Ground shadow ─────────────────────────────────── */}
        <div style={{
          position: 'absolute', bottom: '-18px', left: '50%',
          transform: 'translateX(-50%) rotateX(90deg)',
          width: '130px', height: '18px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
        }} />
      </div>
    </div>
  );
}
