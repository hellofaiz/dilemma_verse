/**
 * routes/situationRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Defines the endpoints and their validation logic.
 */

'use strict';

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const situationController = require('../controller/situationController');

// ── Validation Rules ───────────────────────────────────────────
const validateCreate = [
  body('title').notEmpty().withMessage('Title is required').isString().isLength({ max: 500 }),
  body('description').notEmpty().withMessage('Description is required').isString(),
  body('category').notEmpty().withMessage('Category is required').isString().isLength({ max: 100 }),
  body('difficulty').notEmpty().withMessage('Difficulty is required').isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('source').optional().isString().isLength({ max: 255 }),
  body('tags').optional(), // Array or Comma-separated string logic is handled in controller
  body('metadata').optional().isObject(),
];

const validateUpdate = [
  body('title').optional().isString().notEmpty().withMessage('Title cannot be empty').isLength({ max: 500 }),
  body('description').optional().isString().notEmpty(),
  body('category').optional().isString().notEmpty().isLength({ max: 100 }),
  body('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']),
  body('source').optional().isString().isLength({ max: 255 }),
  body('tags').optional(),
  body('metadata').optional().isObject(),
];

// ── Routes ──────────────────────────────────────────────────────
router.get('/', situationController.getAll);
router.get('/:id', situationController.getById);
router.post('/bulk', situationController.bulkCreate);
router.post('/', validateCreate, situationController.create);
router.put('/:id', validateUpdate, situationController.update);
router.delete('/:id', situationController.delete);

module.exports = router;
