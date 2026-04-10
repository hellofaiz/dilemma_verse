/**
 * components/auth/ProtectedRoute.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Wraps any route that requires authentication.
 * Shows a spinner during session check, redirects to /login if unauthenticated.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Brain } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: 'var(--bg-primary)',
      }}>
        <div style={{
          width: 52,
          height: 52,
          background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)',
          animation: 'spin 1.4s linear infinite',
        }}>
          <Brain size={26} color="white" />
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Checking session…
        </p>
      </div>
    );
  }

  if (!user) {
    // Not authenticated — redirect to login, preserving intended destination
    return <Navigate to="/login" replace />;
  }

  return children;
}
