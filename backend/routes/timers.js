const express = require('express');
const router = express.Router();
const { getAllTimers, startTimer, getActiveTimer, stopTimer } = require('../controllers/timersController');

/**
 * @swagger
 * /api/timers:
 *   get:
 *     summary: Get all timers
 *     description: Retrieve all timers from the system
 *     tags: [Timers]
 *     responses:
 *       200:
 *         description: List of all timers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Timer'
 */
router.get('/', getAllTimers);

/**
 * @swagger
 * /api/timers/start:
 *   post:
 *     summary: Start a new timer
 *     description: Start a new timer session with specified duration and type
 *     tags: [Timers]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               duration:
 *                 type: number
 *                 description: Timer duration in seconds
 *                 default: 1500
 *               type:
 *                 type: string
 *                 enum: [work, break, custom]
 *                 description: Type of timer session
 *                 default: work
 *     responses:
 *       201:
 *         description: Timer started successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Timer'
 */
router.post('/start', startTimer);

/**
 * @swagger
 * /api/timers/active:
 *   get:
 *     summary: Get active timer
 *     description: Retrieve the currently running timer
 *     tags: [Timers]
 *     responses:
 *       200:
 *         description: Active timer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Timer'
 *       404:
 *         description: No active timer found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/active', getActiveTimer);

/**
 * @swagger
 * /api/timers/{id}/stop:
 *   patch:
 *     summary: Stop a timer
 *     description: Stop a running timer by ID
 *     tags: [Timers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the timer to stop
 *     responses:
 *       200:
 *         description: Timer stopped successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Timer'
 *       404:
 *         description: Timer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/stop', stopTimer);

module.exports = router;
