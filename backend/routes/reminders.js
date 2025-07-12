const express = require('express');
const router = express.Router();
const { getAllReminders, createReminder, deleteReminder, getTodayReminders, getUpcomingReminders, snoozeReminder } = require('../controllers/remindersController');

/**
 * @swagger
 * /api/reminders:
 *   get:
 *     summary: Get all reminders
 *     description: Retrieve all reminders from the system
 *     tags: [Reminders]
 *     responses:
 *       200:
 *         description: List of all reminders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reminder'
 */
router.get('/', getAllReminders);

/**
 * @swagger
 * /api/reminders:
 *   post:
 *     summary: Create a new reminder
 *     description: Create a new reminder with title, description, date/time, and recurring pattern
 *     tags: [Reminders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - dateTime
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the reminder
 *               description:
 *                 type: string
 *                 description: Description of the reminder
 *               dateTime:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time for the reminder
 *               recurring:
 *                 type: string
 *                 enum: [none, daily, weekly, monthly]
 *                 default: none
 *                 description: Recurring pattern for the reminder
 *     responses:
 *       201:
 *         description: Reminder created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reminder'
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createReminder);

/**
 * @swagger
 * /api/reminders/{id}:
 *   delete:
 *     summary: Delete a reminder
 *     description: Delete a specific reminder by ID
 *     tags: [Reminders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reminder to delete
 *     responses:
 *       204:
 *         description: Reminder deleted successfully
 *       404:
 *         description: Reminder not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deleteReminder);

/**
 * @swagger
 * /api/reminders/today:
 *   get:
 *     summary: Get today's reminders
 *     description: Retrieve all reminders scheduled for today
 *     tags: [Reminders]
 *     responses:
 *       200:
 *         description: Today's reminders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reminder'
 */
router.get('/today', getTodayReminders);

/**
 * @swagger
 * /api/reminders/upcoming:
 *   get:
 *     summary: Get upcoming reminders
 *     description: Retrieve all reminders scheduled for the next 7 days
 *     tags: [Reminders]
 *     responses:
 *       200:
 *         description: Upcoming reminders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reminder'
 */
router.get('/upcoming', getUpcomingReminders);

/**
 * @swagger
 * /api/reminders/{id}/snooze:
 *   patch:
 *     summary: Snooze a reminder
 *     description: Snooze a reminder by a specified number of minutes
 *     tags: [Reminders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reminder to snooze
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               minutes:
 *                 type: number
 *                 description: Number of minutes to snooze
 *                 default: 10
 *     responses:
 *       200:
 *         description: Reminder snoozed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reminder'
 *       404:
 *         description: Reminder not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/snooze', snoozeReminder);

module.exports = router;
