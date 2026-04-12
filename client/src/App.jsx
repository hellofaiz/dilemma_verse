import './index.css';
import './styles/components.css';
import './styles/auth.css';

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute   from './components/auth/ProtectedRoute';
import LoginPage        from './pages/LoginPage';
import HomePage         from './pages/HomePage';
import AuthCallbackPage from './pages/AuthCallbackPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* OAuth callback — exchanges URL token for httpOnly cookie */}
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Protected route — redirects to /login if not authenticated */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
