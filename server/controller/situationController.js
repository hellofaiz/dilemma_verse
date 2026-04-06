/**
 * controller/situationController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * All business logic for the Situation entity.
 */

'use strict';

const prisma = require('../config/prisma');
const { success, error } = require('../utils/response');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  try {
    const situations = await prisma.situation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return success(res, situations, 'Situations retrieved successfully');
  } catch (err) {
    console.error('[getAll] Error:', err);
    return error(res, 'Internal Server Error', 500);
  }
};

exports.getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const situation = await prisma.situation.findUnique({
      where: { id },
    });

    if (!situation) {
      return error(res, 'Situation not found', 404);
    }

    return success(res, situation, 'Situation retrieved successfully');
  } catch (err) {
    console.error('[getById] Error:', err);
    return error(res, 'Internal Server Error', 500);
  }
};

exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, 'Validation failed', 400, errors.array());
    }

    const payload = req.body;
    
    // Ensure tags is an array
    const tagsArray = Array.isArray(payload.tags) 
      ? payload.tags 
      : (typeof payload.tags === 'string' ? payload.tags.split(',').map(s => s.trim()).filter(Boolean) : []);

    const newSituation = await prisma.situation.create({
      data: {
        title: payload.title,
        description: payload.description,
        category: payload.category,
        difficulty: payload.difficulty,
        source: payload.source || null,
        tags: tagsArray,
        metadata: payload.metadata || {},
      },
    });

    return success(res, newSituation, 'Situation created successfully', 201);
  } catch (err) {
    console.error('[create] Error:', err);
    return error(res, 'Internal Server Error', 500);
  }
};

exports.bulkCreate = async (req, res) => {
  try {
    const payloadArray = req.body;
    if (!Array.isArray(payloadArray)) {
      return error(res, 'Payload must be an array of situations', 400);
    }

    const dataToInsert = payloadArray.map(item => {
      let tagsArray = [];
      if (item.tags) {
         tagsArray = Array.isArray(item.tags) ? item.tags : (typeof item.tags === 'string' ? item.tags.split(',').map(s => s.trim()).filter(Boolean) : []);
      }
      return {
        title: item.title || item.situation || 'Untitled',
        description: item.description || '',
        category: item.category || 'Other',
        difficulty: item.difficulty || 'Medium',
        source: item.source || null,
        tags: tagsArray,
        metadata: item.metadata || {},
      };
    });

    const result = await prisma.situation.createMany({
      data: dataToInsert,
      skipDuplicates: true,
    });

    return success(res, result, `${result.count} situations imported successfully!`, 201);
  } catch (err) {
    console.error('[bulkCreate] Error:', err);
    return error(res, 'Internal Server Error', 500);
  }
};

exports.update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, 'Validation failed', 400, errors.array());
    }

    const id = parseInt(req.params.id, 10);
    const payload = req.body;

    const existing = await prisma.situation.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Situation not found', 404);
    }

    // Process tags if provided
    let tagsArray = existing.tags;
    if (payload.tags !== undefined) {
      tagsArray = Array.isArray(payload.tags)
        ? payload.tags
        : (typeof payload.tags === 'string' ? payload.tags.split(',').map(s => s.trim()).filter(Boolean) : []);
    }

    const updatedSituation = await prisma.situation.update({
      where: { id },
      data: {
        title: payload.title !== undefined ? payload.title : existing.title,
        description: payload.description !== undefined ? payload.description : existing.description,
        category: payload.category !== undefined ? payload.category : existing.category,
        difficulty: payload.difficulty !== undefined ? payload.difficulty : existing.difficulty,
        source: payload.source !== undefined ? payload.source : existing.source,
        tags: tagsArray,
        metadata: payload.metadata !== undefined ? payload.metadata : existing.metadata,
      },
    });

    return success(res, updatedSituation, 'Situation updated successfully');
  } catch (err) {
    console.error('[update] Error:', err);
    return error(res, 'Internal Server Error', 500);
  }
};

exports.delete = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const existing = await prisma.situation.findUnique({ where: { id } });
    if (!existing) {
      return error(res, 'Situation not found', 404);
    }

    await prisma.situation.delete({
      where: { id },
    });

    return success(res, null, 'Situation deleted successfully');
  } catch (err) {
    console.error('[delete] Error:', err);
    return error(res, 'Internal Server Error', 500);
  }
};
