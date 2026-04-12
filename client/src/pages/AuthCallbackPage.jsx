/**
 * pages/AuthCallbackPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles the redirect from Google OAuth.
 *
 * WHY THIS PAGE EXISTS:
 * Modern browsers (Chrome 80+, Safari ITP) silently DROP cross-site cookies
 * that are set during a redirect chain originating from a 3rd party (Google).
 * So if the backend sets a cookie inside a 302 redirect response, the browser
 * will ignore it entirely.
 *
 * SOLUTION (Two-Step Token Exchange):
 * 1. Backend redirects here with the JWT in the URL: /auth/callback?token=...
 * 2. This page reads the token from the URL and makes a direct POST request
 *    to /auth/set-cookie to exchange it for a proper httpOnly cookie.
 * 3. Because this POST is a direct (non-redirect) cross-origin request,
 *    the browser honours the Set-Cookie header with SameSite=None correctly.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_BASE_URL?.replace('/situation', '') || 'http://localhost:5000';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [status, setStatus] = useState('Processing login...');

  useEffect(() => {
    const exchangeToken = async () => {
      try {
        // Step 1: Extract the token from the URL query parameter
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        console.log('[AuthCallback] Token found in URL:', !!token);

        if (!token) {
          console.error('[AuthCallback] No token found in URL, redirecting to login');
          setStatus('Authentication failed. Redirecting...');
          navigate('/login?error=no_token');
          return;
        }

        // Step 2: Send the token directly to the backend to set the httpOnly cookie
        // This is a DIRECT request (not a redirect), so the browser will accept the cookie
        setStatus('Setting up your session...');
        const res = await fetch(`${API}/auth/set-cookie`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Required for cross-origin cookie to be accepted
          body: JSON.stringify({ token }),
        });

        console.log('[AuthCallback] Set-cookie response status:', res.status);

        if (!res.ok) {
          const data = await res.json();
          console.error('[AuthCallback] Failed to set cookie:', data);
          setStatus('Session setup failed. Redirecting...');
          navigate('/login?error=session_failed');
          return;
        }

        // Step 3: Now that the cookie is set, re-check auth to populate the user context
        console.log('[AuthCallback] Cookie set successfully! Rehydrating auth state...');
        setStatus('Almost ready...');
        await checkAuth();

        // Step 4: Redirect to the home page
        console.log('[AuthCallback] Auth state rehydrated, navigating to home.');
        navigate('/');
      } catch (err) {
        console.error('[AuthCallback] Unexpected error:', err);
        setStatus('An unexpected error occurred. Redirecting...');
        navigate('/login?error=unexpected');
      }
    };

    exchangeToken();
  }, [navigate, checkAuth]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#0f0f23',
      color: '#fff',
      fontFamily: 'Inter, sans-serif',
      gap: '16px',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(139, 92, 246, 0.3)',
        borderTop: '3px solid #8b5cf6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: '#a0a0c0', fontSize: '14px' }}>{status}</p>
    </div>
  );
}
