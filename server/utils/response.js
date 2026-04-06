/**
 * utils/response.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Standardised JSON response helpers — keeps controller code clean.
 */

'use strict';

/**
 * 200 / 201 success envelope
 * @param {import('express').Response} res
 * @param {*} data      – payload to return
 * @param {string} msg  – human-readable message
 * @param {number} code – HTTP status (default 200)
 */
const success = (res, data, msg = 'OK', code = 200) => {
  return res.status(code).json({
    success: true,
    message: msg,
    data,
  });
};

/**
 * 4xx / 5xx error envelope
 * @param {import('express').Response} res
 * @param {string} msg    – human-readable error
 * @param {number} code   – HTTP status (default 400)
 * @param {*}      errors – optional validation error array
 */
const error = (res, msg = 'Bad Request', code = 400, errors = null) => {
  const body = { success: false, message: msg };
  if (errors) body.errors = errors;
  return res.status(code).json(body);
};

module.exports = { success, error };
