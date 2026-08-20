import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

/* ═══════════════════════════════════════════════════════════════
   Admin Auth Context
   ─────────────────────────────────────────────────────────────
   This context now just re-exports the main Auth context's admin state.
   This avoids breaking all the admin pages that currently import this.
═══════════════════════════════════════════════════════════════ */

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const { user, isAdmin, loading, login, logout } = useAuth();

  return (
    <AdminAuthContext.Provider value={{ 
      adminUser: isAdmin ? user : null, 
      isAdmin, 
      loading, 
      adminLogin: login, 
      adminLogout: logout 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
