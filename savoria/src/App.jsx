import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import { CartProvider }  from './context/CartContext';
import { AuthProvider }  from './context/AuthContext';
import { PaymentProvider } from './context/PaymentContext';
import Navbar            from './components/Navbar';
import Footer            from './components/Footer';
import ProtectedRoute    from './components/ProtectedRoute';

const AdminApp = lazy(() => import('./pages/admin/AdminApp'));

/* ── Route-level code splitting ───────────────────────────────
   Each page is its own JS chunk loaded on demand.
   Initial bundle drops from ~723 KB to ~150 KB.
──────────────────────────────────────────────────────────────── */
const HomePage           = lazy(() => import('./pages/Home/HomePage'));
const OrderPage          = lazy(() => import('./pages/Order/OrderPage'));
const PaymentPage        = lazy(() => import('./pages/Payment/PaymentPage'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccess/PaymentSuccessPage'));
const AboutPage          = lazy(() => import('./pages/About/AboutPage'));
const ContactPage        = lazy(() => import('./pages/Contact/ContactPage'));
const ServicesPage       = lazy(() => import('./pages/Services/ServicesPage'));
const LoginPage          = lazy(() => import('./pages/Login/LoginPage'));
const RegisterPage       = lazy(() => import('./pages/Register/RegisterPage'));
const ProfilePage        = lazy(() => import('./pages/Profile/ProfilePage'));

/* ── Minimal suspense fallback — no layout shift ─────────────── */
function PageLoader() {
  return (
    <div style={{
      minHeight: '100svh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
    }}>
      <span style={{
        fontFamily: 'var(--font-label)',
        fontSize: '0.55rem',
        letterSpacing: '0.3em',
        color: 'rgba(201,168,76,0.4)',
        textTransform: 'uppercase',
        animation: 'pageFadeIn 1s ease infinite alternate',
      }}>
        ·&nbsp;&nbsp;·&nbsp;&nbsp;·
      </span>
    </div>
  );
}

function AppInner() {
  useLenis();

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Public ────────────────────────────────── */}
            <Route path="/"                element={<HomePage />} />
            <Route path="/order"           element={<OrderPage />} />
            <Route path="/payment"         element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/about"           element={<AboutPage />} />
            <Route path="/services"        element={<ServicesPage />} />
            <Route path="/contact"         element={<ContactPage />} />

            {/* ── Auth ──────────────────────────────────── */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ── Protected ─────────────────────────────── */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <PaymentProvider>
            <Routes>
              <Route path="/admin/*" element={<Suspense fallback={<PageLoader />}><AdminApp /></Suspense>} />
              <Route path="/*" element={<AppInner />} />
            </Routes>
          </PaymentProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
