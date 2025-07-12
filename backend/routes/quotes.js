const express = require('express');
const router = express.Router();
const { getAllQuotes, getQuotesByCategory, createQuote, deleteQuote, getRandomQuote } = require('../controllers/quotesController');

/**
 * @swagger
 * /api/quotes:
 *   get:
 *     summary: Get all quotes or a random quote
 *     description: Retrieve all quotes or get a random quote if random=true query parameter is provided
 *     tags: [Quotes]
 *     parameters:
 *       - in: query
 *         name: random
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: If set to 'true', returns a random quote instead of all quotes
 *     responses:
 *       200:
 *         description: List of quotes or a single random quote
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Quote'
 *                 - $ref: '#/components/schemas/Quote'
 */
router.get('/', getAllQuotes);

/**
 * @swagger
 * /api/quotes/random:
 *   get:
 *     summary: Get a random quote
 *     description: Retrieve a random quote from the collection
 *     tags: [Quotes]
 *     responses:
 *       200:
 *         description: A random quote
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 *       404:
 *         description: No quotes available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/random', getRandomQuote);

/**
 * @swagger
 * /api/quotes/category/{category}:
 *   get:
 *     summary: Get quotes by category
 *     description: Retrieve all quotes belonging to a specific category
 *     tags: [Quotes]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name to filter by
 *     responses:
 *       200:
 *         description: Quotes in the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quote'
 */
router.get('/category/:category', getQuotesByCategory);

/**
 * @swagger
 * /api/quotes:
 *   post:
 *     summary: Create a new quote
 *     description: Add a new quote to the collection
 *     tags: [Quotes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - author
 *             properties:
 *               text:
 *                 type: string
 *                 description: The quote text
 *               author:
 *                 type: string
 *                 description: The quote author
 *               category:
 *                 type: string
 *                 default: general
 *                 description: Category of the quote
 *     responses:
 *       201:
 *         description: Quote created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createQuote);

/**
 * @swagger
 * /api/quotes/{id}:
 *   delete:
 *     summary: Delete a quote
 *     description: Delete a specific quote by ID
 *     tags: [Quotes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the quote to delete
 *     responses:
 *       204:
 *         description: Quote deleted successfully
 *       404:
 *         description: Quote not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deleteQuote);

module.exports = router;
