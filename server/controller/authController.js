/**
 * controller/authController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles post-OAuth callback (JWT issuance) and session management.
 */

'use strict';

const jwt      = require('jsonwebtoken');
const { success, error } = require('../utils/response');

// ── Cookie options ─────────────────────────────────────────────
const COOKIE_OPTIONS = {
  httpOnly: true,                              
  secure:   process.env.NODE_ENV === 'production', 
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
  maxAge:   7 * 24 * 60 * 60 * 1000,          
};

/**
 * Called after passport.authenticate('google') succeeds.
 * Signs a JWT, sets it as an httpOnly cookie, then redirects to the frontend.
 */
exports.googleCallback = (req, res) => {
  try {
    const user = req.user; // Attached by Passport

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Secure httpOnly cookie — cannot be read by client-side JS
    res.cookie('token', token, COOKIE_OPTIONS);

    // Redirect to the frontend dashboard
    res.redirect(`${process.env.CLIENT_URL}/`);
  } catch (err) {
    console.error('[googleCallback] Error:', err);
    res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
  }
};

/**
 * GET /auth/me
 * Returns the currently authenticated user's profile.
 */
exports.getMe = (req, res) => {
  return success(res, req.user, 'User profile retrieved');
};

/**
 * POST /auth/logout
 * Clears the JWT cookie, effectively logging the user out.
 */
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  return success(res, null, 'Logged out successfully');
};
