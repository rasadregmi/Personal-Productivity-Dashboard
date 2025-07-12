const express = require('express');
const router = express.Router();
const { getAllBookmarks, createBookmark, deleteBookmark, getBookmarksByCategory, searchBookmarks, updateBookmark } = require('../controllers/bookmarksController');

/**
 * @swagger
 * /api/bookmarks:
 *   get:
 *     summary: Get all bookmarks
 *     description: Retrieve all bookmarks from the system
 *     tags: [Bookmarks]
 *     responses:
 *       200:
 *         description: List of all bookmarks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bookmark'
 */
router.get('/', getAllBookmarks);

/**
 * @swagger
 * /api/bookmarks:
 *   post:
 *     summary: Create a new bookmark
 *     description: Create a new bookmark with title, URL, description, category, and tags
 *     tags: [Bookmarks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - url
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the bookmark
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: URL of the bookmark
 *               description:
 *                 type: string
 *                 description: Description of the bookmark
 *               category:
 *                 type: string
 *                 description: Category of the bookmark
 *                 default: general
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags for the bookmark
 *     responses:
 *       201:
 *         description: Bookmark created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bookmark'
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createBookmark);

/**
 * @swagger
 * /api/bookmarks/{id}:
 *   delete:
 *     summary: Delete a bookmark
 *     description: Delete a specific bookmark by ID
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the bookmark to delete
 *     responses:
 *       204:
 *         description: Bookmark deleted successfully
 *       404:
 *         description: Bookmark not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deleteBookmark);

/**
 * @swagger
 * /api/bookmarks/search:
 *   get:
 *     summary: Search bookmarks
 *     description: Search bookmarks by title, description, URL, or tags
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query to match against title, description, URL, or tags
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bookmark'
 */
router.get('/search', searchBookmarks);

/**
 * @swagger
 * /api/bookmarks/category/{category}:
 *   get:
 *     summary: Get bookmarks by category
 *     description: Retrieve all bookmarks belonging to a specific category
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name to filter by
 *     responses:
 *       200:
 *         description: Bookmarks in the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bookmark'
 */
router.get('/category/:category', getBookmarksByCategory);

/**
 * @swagger
 * /api/bookmarks/{id}:
 *   put:
 *     summary: Update a bookmark
 *     description: Update an existing bookmark with new data
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the bookmark to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: Updated URL
 *               description:
 *                 type: string
 *                 description: Updated description
 *               category:
 *                 type: string
 *                 description: Updated category
 *     responses:
 *       200:
 *         description: Bookmark updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bookmark'
 *       404:
 *         description: Bookmark not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', updateBookmark);

module.exports = router;
