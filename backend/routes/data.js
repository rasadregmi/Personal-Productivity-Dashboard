const express = require('express');
const router = express.Router();
const { exportData, clearData } = require('../controllers/dataController');

/**
 * @swagger
 * /api/data/export:
 *   get:
 *     summary: Export all application data
 *     description: Export all data from the application in JSON format
 *     tags: [Data Management]
 *     responses:
 *       200:
 *         description: Data exported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exportedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of export
 *                 data:
 *                   type: object
 *                   description: All application data
 */
router.get('/export', exportData);

/**
 * @swagger
 * /api/data/clear:
 *   post:
 *     summary: Clear application data
 *     description: Clear all or specific module data
 *     tags: [Data Management]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               module:
 *                 type: string
 *                 enum: [notes, todos, reminders, bookmarks, quotes, timers, all]
 *                 description: Module to clear data for, or 'all' for everything
 *     responses:
 *       200:
 *         description: Data cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 clearedModule:
 *                   type: string
 *                   description: Module that was cleared
 *       400:
 *         description: Invalid module specified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/clear', clearData);

module.exports = router;
