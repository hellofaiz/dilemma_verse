/**
 * routes/authRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Auth endpoints:
 *   GET  /auth/google          — initiates Google OAuth flow
 *   GET  /auth/google/callback — Google redirects here after consent
 *   GET  /auth/me              — returns current user (protected)
 *   POST /auth/logout          — clears session cookie
 */

'use strict';

const express    = require('express');
const router     = express.Router();
const passport   = require('../config/passport');
const authController = require('../controller/authController');
const authenticate   = require('../middleware/authenticate');

// ── Initiate Google OAuth flow ─────────────────────────────────
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

// ── Google OAuth callback ──────────────────────────────────────
router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
  }),
  authController.googleCallback
);

// ── Exchange URL token for httpOnly cookie ─────────────────────
// Called by the frontend /auth/callback page after OAuth redirect
router.post('/set-cookie', authController.setTokenCookie);

// ── Protected: get current user profile ───────────────────────
router.get('/me', authenticate, authController.getMe);

// ── Logout: clear cookie ───────────────────────────────────────
router.post('/logout', authController.logout);

module.exports = router;
