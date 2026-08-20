import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from '../../context/AdminAuthContext';
import AdminLayout from './AdminLayout';
import AdminLoginPage from './auth/AdminLoginPage';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const CustomersPage = lazy(() => import('./pages/CustomersPage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const ReservationsPage = lazy(() => import('./pages/ReservationsPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const ActivityPage = lazy(() => import('./pages/ActivityPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function ProtectedAdminRoute({ children }) {
  const { isAdmin, loading } = useAdminAuth();
  if (loading) return <div style={{ height: '100vh', background: 'var(--bg)' }} />;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Suspense fallback={<div style={{ height: '100vh', background: 'var(--bg)' }} />}>
        <Routes>
          <Route path="login" element={<AdminLoginPage />} />
          
          <Route path="/" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="activity" element={<ActivityPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<div style={{ padding: 40, color: 'white' }}>404 Admin Page Not Found</div>} />
          </Route>
        </Routes>
      </Suspense>
    </AdminAuthProvider>
  );
}
