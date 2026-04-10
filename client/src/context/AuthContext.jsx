/**
 * context/AuthContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Global authentication state. Checks /auth/me on mount to rehydrate session
 * from the httpOnly cookie (the frontend never sees the JWT itself).
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API = import.meta.env.VITE_API_BASE_URL?.replace('/situation', '') || 'http://localhost:5000';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true while checking session

  // ── Rehydrate session on first load ───────────────────────────
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch(`${API}/auth/me`, {
        credentials: 'include', // send the httpOnly cookie
      });
      if (res.ok) {
        const json = await res.json();
        setUser(json.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ── Logout ─────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method:      'POST',
        credentials: 'include',
      });
    } finally {
      setUser(null);
    }
  }, []);

  // ── Initiate Google OAuth ──────────────────────────────────────
  const loginWithGoogle = useCallback(() => {
    window.location.href = `${API}/auth/google`;
  }, [API]);

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming auth state
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
