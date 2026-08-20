import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ═══════════════════════════════════════════════════════════════
   PROTECTED ROUTE
   Redirects to /login if user is not authenticated.
   Preserves the original destination so the user returns after
   successful login.
═══════════════════════════════════════════════════════════════ */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Don't redirect while auth state is still initialising
  if (loading) {
    return (
      <div style={{
        minHeight: '100svh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg)',
      }}>
        <span style={{
          fontFamily: 'var(--font-label)', fontSize: '0.55rem',
          letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase',
        }}>
          ···
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
