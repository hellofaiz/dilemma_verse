/**
 * config/prisma.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Singleton Prisma client — reuse one connection across the entire app.
 * In development, attaches the instance to `global` to survive HMR restarts.
 */

'use strict';

const { PrismaClient } = require('@prisma/client');

const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'warn', 'error']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
