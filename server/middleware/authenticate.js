/**
 * middleware/authenticate.js
 * ─────────────────────────────────────────────────────────────────────────────
 * JWT authentication middleware for protecting Express routes.
 * Reads the token from an httpOnly cookie (secure) or Authorization header.
 */

'use strict';

const jwt    = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { error } = require('../utils/response');

const authenticate = async (req, res, next) => {
  try {
    // 1. Read token — prefer httpOnly cookie, fall back to Bearer header
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return error(res, 'Authentication required. Please sign in.', 401);
    }

    // 2. Verify JWT signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Confirm user still exists in DB (protects against deleted accounts)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, avatar: true },
    });

    if (!user) {
      return error(res, 'User no longer exists.', 401);
    }

    // 4. Attach user to request for downstream handlers
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Session expired. Please sign in again.', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return error(res, 'Invalid token. Please sign in again.', 401);
    }
    console.error('[authenticate] Error:', err);
    return error(res, 'Authentication failed.', 401);
  }
};

module.exports = authenticate;
