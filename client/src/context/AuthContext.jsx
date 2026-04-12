/**
 * context/AuthContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Global authentication state using localStorage + Bearer token.
 *
 * WHY localStorage instead of httpOnly cookies:
 * The frontend (azurestaticapps.net) and backend (azurewebsites.net) are on
 * DIFFERENT domains. Modern browsers (Chrome Incognito, Safari ITP) block
 * cross-origin (third-party) cookies regardless of SameSite=None settings.
 * localStorage + Bearer token is the reliable cross-domain solution.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API = import.meta.env.VITE_API_BASE_URL?.replace('/situation', '') || 'http://localhost:5000';
console.log('API====', API);

// ── Token helpers ────────────────────────────────────────────────
const TOKEN_KEY = 'auth_token';

export const tokenStorage = {
  get:    ()        => localStorage.getItem(TOKEN_KEY),
  set:    (token)   => localStorage.setItem(TOKEN_KEY, token),
  remove: ()        => localStorage.removeItem(TOKEN_KEY),
};

/**
 * Makes an authenticated fetch request with Authorization Bearer header.
 * Use this helper for all API calls that require authentication.
 */
export function authFetch(url, options = {}) {
  const token = tokenStorage.get();
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Rehydrate session on first load ───────────────────────────
  const checkAuth = useCallback(async () => {
    const token = tokenStorage.get();
    console.log('[checkAuth] Token in localStorage:', !!token);

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[checkAuth] /auth/me status:', res.status);
      if (res.ok) {
        const json = await res.json();
        setUser(json.data);
      } else {
        // Token expired or invalid — clear it
        tokenStorage.remove();
        setUser(null);
      }
    } catch (err) {
      console.error('[checkAuth] Error:', err);
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
      const token = tokenStorage.get();
      if (token) {
        await fetch(`${API}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } finally {
      tokenStorage.remove();
      setUser(null);
    }
  }, []);

  // ── Initiate Google OAuth ──────────────────────────────────────
  const loginWithGoogle = useCallback(() => {
    window.location.href = `${API}/auth/google`;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
