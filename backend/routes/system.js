const express = require('express');
const router = express.Router();
const { getHealth, getStats, getMemoryUsage, getUptime } = require('../controllers/systemController');

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API server
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 */
router.get('/health', getHealth);

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Returns statistics for all modules (notes, todos, reminders, etc.)
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stats'
 */
router.get('/stats', getStats);

/**
 * @swagger
 * /api/memory:
 *   get:
 *     summary: Get memory usage
 *     description: Returns current memory usage statistics
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Memory usage statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MemoryUsage'
 */
router.get('/memory', getMemoryUsage);

/**
 * @swagger
 * /api/uptime:
 *   get:
 *     summary: Get server uptime
 *     description: Returns server uptime information
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server uptime
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Uptime'
 */
router.get('/uptime', getUptime);

module.exports = router;
