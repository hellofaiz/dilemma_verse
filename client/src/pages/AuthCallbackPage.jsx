/**
 * pages/AuthCallbackPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles the redirect from Google OAuth.
 * Extracts the token from the URL, stores it in localStorage,
 * then navigates to the home page.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tokenStorage } from '../context/AuthContext';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [status, setStatus] = useState('Processing login...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Step 1: Extract the token from the URL query parameter
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        console.log('[AuthCallback] Token found in URL:', !!token);

        if (!token) {
          console.error('[AuthCallback] No token found in URL');
          navigate('/login?error=no_token');
          return;
        }

        // Step 2: Store the token in localStorage
        tokenStorage.set(token);
        console.log('[AuthCallback] Token stored in localStorage');

        // Step 3: Rehydrate auth state using the stored token
        setStatus('Setting up your session...');
        await checkAuth();

        console.log('[AuthCallback] Auth rehydrated, navigating to home.');
        navigate('/');
      } catch (err) {
        console.error('[AuthCallback] Unexpected error:', err);
        navigate('/login?error=unexpected');
      }
    };

    handleCallback();
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
