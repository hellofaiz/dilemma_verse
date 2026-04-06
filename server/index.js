/**
 * index.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Main application entrypoint. Boots up Express server and registers middleware.
 */

'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { success } = require('./utils/response');
const situationRoutes = require('./routes/situationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Built-in & 3rd-party Middleware ────────────────────────────
app.use(helmet()); // Security headers
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON payloads
app.use(morgan('dev')); // HTTP request logging

// ── Root & Health Check ────────────────────────────────────────
app.get('/health', (req, res) => {
  return success(res, { uptime: process.uptime() }, 'Server is healthy');
});

// ── API Routes ─────────────────────────────────────────────────
app.use('/situation', situationRoutes);

// ── 404 & Global Error Handling ────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// ── Start Server ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 APIs available under /situation`);
});
