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
 * Redirects to the frontend with the token in the URL.
 * The frontend then exchanges it for a proper httpOnly cookie.
 *
 * WHY: Browsers (Chrome/Safari) silently reject SameSite=None cookies
 * that are set during a redirect chain from a 3rd party (Google).
 * Passing the token via URL param bypasses this restriction.
 */
exports.googleCallback = (req, res) => {
  try {
    const user = req.user; // Attached by Passport
    console.log('[googleCallback] User authenticated:', user?.email);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    console.log('[googleCallback] JWT signed, redirecting to frontend with token...');
    // Pass token as a URL param — client will exchange it for a cookie
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  } catch (err) {
    console.error('[googleCallback] Error:', err);
    res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
  }
};

/**
 * POST /auth/set-cookie
 * Frontend calls this with the token received from the OAuth redirect.
 * Sets a proper httpOnly cookie in a direct (non-redirect) response.
 */
exports.setTokenCookie = (req, res) => {
  try {
    const { token } = req.body;
    console.log('[set-cookie] Received token exchange request');

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    // Verify it's a valid token before storing it
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    console.log('[set-cookie] Token valid for:', decoded.email);

    res.cookie('token', token, COOKIE_OPTIONS);
    console.log('[set-cookie] Cookie set successfully. NODE_ENV:', process.env.NODE_ENV);
    console.log('[set-cookie] Cookie options:', COOKIE_OPTIONS);

    return res.status(200).json({ success: true, message: 'Cookie set' });
  } catch (err) {
    console.error('[set-cookie] Error:', err);
    return res.status(401).json({ success: false, message: 'Invalid token' });
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
