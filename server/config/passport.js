/**
 * config/passport.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Configures the Google OAuth 2.0 strategy for Passport.
 * On successful auth: finds or creates a User record in the DB.
 */

'use strict';

const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const prisma = require('./prisma');

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL,
    },
    // Called after Google redirects back with profile
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email   = profile.emails?.[0]?.value;
        const avatar  = profile.photos?.[0]?.value;
        const name    = profile.displayName;
        const googleId = profile.id;

        // Upsert — create user if first login, update avatar/name on subsequent logins
        const user = await prisma.user.upsert({
          where: { googleId },
          update: { name, avatar, email },
          create: { googleId, email, name, avatar },
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Passport serialize/deserialize (needed for session, though we use JWT)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
