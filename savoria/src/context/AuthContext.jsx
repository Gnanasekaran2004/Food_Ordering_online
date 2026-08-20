import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/auth';
import { getProfile } from '../services/firebaseAuthService'; // Internal tool for resolving full profile

/* ═══════════════════════════════════════════════════════════════
   SAVORIA — Auth Context
   Single source of truth for authentication state.
   All pages read from useAuth(). No duplication.
═══════════════════════════════════════════════════════════════ */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);   // null = logged out, otherwise Firestore profile object
  const [loading, setLoading]         = useState(true);   // true during init
  const [emailVerified, setEmailVerified] = useState(false);
  const [isAdmin, setIsAdmin]         = useState(false);

  /* ── Initialise: Firebase Auth Listener ──────────────────────── */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const [profile, tokenResult] = await Promise.all([
            getProfile(firebaseUser.uid),
            firebaseUser.getIdTokenResult()
          ]);
          setUser(profile || { uid: firebaseUser.uid, email: firebaseUser.email });
          setEmailVerified(firebaseUser.emailVerified);
          setIsAdmin(!!tokenResult.claims.admin);
        } catch (error) {
          console.error("Error resolving user session:", error);
          setUser(null);
          setEmailVerified(false);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setEmailVerified(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ── Force refresh session details ─────────────────────────── */
  const refreshUser = useCallback(async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const tokenResult = await auth.currentUser.getIdTokenResult(true);
      setEmailVerified(auth.currentUser.emailVerified);
      setIsAdmin(!!tokenResult.claims.admin);
      const profile = await getProfile(auth.currentUser.uid);
      setUser(profile);
    }
  }, []);

  /* ── Auth actions ──────────────────────────────────────────── */
  // Note: the onAuthStateChanged listener will automatically update state 
  // after register/login, but we return the profile for immediate UI use.
  const register = useCallback(async (data) => {
    return await authService.register(data);
  }, []);

  const login = useCallback(async (credentials) => {
    return await authService.login(credentials);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setIsAdmin(false);
    setEmailVerified(false);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user) throw new Error('Not authenticated');
    const u = await authService.updateProfile(user.uid, updates);
    setUser(u);
    return u;
  }, [user]);

  const sendPasswordResetEmail = useCallback(async (email) => {
    return authService.sendPasswordResetEmail(email);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    emailVerified,
    isAdmin,
    refreshUser,
    register,
    login,
    logout,
    updateProfile,
    sendPasswordResetEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ── Hook ─────────────────────────────────────────────────────── */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
