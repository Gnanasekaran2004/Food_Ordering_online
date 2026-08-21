import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminTopBar from './components/AdminTopBar';
import NotificationPanel from './components/NotificationPanel';
import { AdminDataProvider, useAdminData } from './context/AdminDataContext';

function AdminLayoutInner() {
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const { notifications } = useAdminData();

  useEffect(() => {
    const saved = localStorage.getItem('savoria_admin_sidebar');
    if (saved) setCollapsed(saved === 'true');
  }, []);

  const toggleSidebar = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('savoria_admin_sidebar', String(next));
  };

  const getTitle = () => {
    const path = location.pathname.split('/').pop();
    return path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Dashboard';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--cream)', fontFamily: 'var(--font-body)' }}>
      <AdminSidebar collapsed={collapsed} onToggle={toggleSidebar} currentPath={location.pathname} />
      <AdminTopBar title={getTitle()} onNotificationClick={() => setNotifOpen(!notifOpen)} collapsed={collapsed} />
      {notifOpen && <NotificationPanel notifications={notifications} onClose={() => setNotifOpen(false)} />}
      <div style={{
        marginLeft: collapsed ? '60px' : '220px',
        paddingTop: '60px',
        minHeight: '100vh',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column'
      }}>
        <main style={{ padding: '24px', flex: 1, overflowX: 'hidden' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AdminDataProvider>
      <AdminLayoutInner />
    </AdminDataProvider>
  );
}
