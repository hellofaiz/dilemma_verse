'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport'); // initialise strategies

const { success } = require('./utils/response');
const situationRoutes = require('./routes/situationRoutes');
const authRoutes = require('./routes/authRoutes');
const authenticate = require('./middleware/authenticate');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security ────────────────────────────────────────────────────
app.use(helmet());

// ── CORS — only allow the frontend origin to send cookies ───────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,   // Required for httpOnly cookies
}));

// ── Body & Cookie parsers ───────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ── HTTP Request Logging ────────────────────────────────────────
app.use(morgan('dev'));





// ── Passport (stateless — passports session is not used) ────────
app.use(passport.initialize());

// ── Health Check ────────────────────────────────────────────────
app.get('/health', (req, res) => {
  return success(res, {
    uptime: process.uptime(),
    env: process.env.NODE_ENV,
  }, 'Server is healthy');
});

// ── Auth Routes (public) ────────────────────────────────────────
app.use('/auth', authRoutes);

// ── Situation Routes (protected) ────────────────────────────────
// Every /situation endpoint now requires a valid JWT
app.use('/situation', authenticate, situationRoutes);

// ── 404 ─────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ─────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Global Error]', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// ── Start Server ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
