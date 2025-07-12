const express = require('express');
const router = express.Router();
const { getWordCount, convertCase, removeDuplicates, sortLines, findReplace } = require('../controllers/textUtilsController');

/**
 * @swagger
 * /api/text-utils/word-count:
 *   post:
 *     summary: Analyze text word count and statistics
 *     description: Get detailed statistics about a text including word count, character count, lines, and reading time
 *     tags: [Text Utilities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: Text to analyze
 *     responses:
 *       200:
 *         description: Text analysis results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 words:
 *                   type: number
 *                   description: Number of words
 *                 characters:
 *                   type: number
 *                   description: Total number of characters
 *                 charactersNoSpaces:
 *                   type: number
 *                   description: Number of characters excluding spaces
 *                 lines:
 *                   type: number
 *                   description: Number of lines
 *                 readingTime:
 *                   type: number
 *                   description: Estimated reading time in minutes
 *       400:
 *         description: Bad request - text is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/word-count', getWordCount);

/**
 * @swagger
 * /api/text-utils/case-convert:
 *   post:
 *     summary: Convert text case
 *     description: Convert text to different case formats (uppercase, lowercase, title case, sentence case)
 *     tags: [Text Utilities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - caseType
 *             properties:
 *               text:
 *                 type: string
 *                 description: Text to convert
 *               caseType:
 *                 type: string
 *                 enum: [uppercase, lowercase, title, sentence]
 *                 description: Type of case conversion
 *     responses:
 *       200:
 *         description: Text converted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 convertedText:
 *                   type: string
 *                   description: Text converted to the specified case
 *       400:
 *         description: Bad request - text and caseType are required or invalid case type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/case-convert', convertCase);

/**
 * @swagger
 * /api/text-utils/remove-duplicates:
 *   post:
 *     summary: Remove duplicate lines from text
 *     description: Remove duplicate lines from the provided text
 *     tags: [Text Utilities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: Text to process
 *     responses:
 *       200:
 *         description: Text processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 originalLineCount:
 *                   type: number
 *                   description: Number of lines in original text
 *                 uniqueLineCount:
 *                   type: number
 *                   description: Number of unique lines
 *                 processedText:
 *                   type: string
 *                   description: Text with duplicates removed
 *       400:
 *         description: Bad request - text is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/remove-duplicates', removeDuplicates);

/**
 * @swagger
 * /api/text-utils/sort-lines:
 *   post:
 *     summary: Sort lines in text
 *     description: Sort lines in the provided text in ascending or descending order
 *     tags: [Text Utilities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: Text to sort
 *               order:
 *                 type: string
 *                 enum: [asc, desc]
 *                 default: asc
 *                 description: Sort order
 *     responses:
 *       200:
 *         description: Text sorted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 originalLineCount:
 *                   type: number
 *                   description: Number of lines processed
 *                 sortOrder:
 *                   type: string
 *                   description: Sort order used
 *                 processedText:
 *                   type: string
 *                   description: Sorted text
 *       400:
 *         description: Bad request - text is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/sort-lines', sortLines);

/**
 * @swagger
 * /api/text-utils/find-replace:
 *   post:
 *     summary: Find and replace text
 *     description: Find and replace text with optional case sensitivity
 *     tags: [Text Utilities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - find
 *             properties:
 *               text:
 *                 type: string
 *                 description: Text to process
 *               find:
 *                 type: string
 *                 description: Text to find
 *               replace:
 *                 type: string
 *                 description: Replacement text (optional)
 *               caseSensitive:
 *                 type: boolean
 *                 default: false
 *                 description: Whether search should be case sensitive
 *     responses:
 *       200:
 *         description: Find and replace completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 originalText:
 *                   type: string
 *                   description: Original text
 *                 processedText:
 *                   type: string
 *                   description: Text after replacements
 *                 replacements:
 *                   type: number
 *                   description: Number of replacements made
 *                 findString:
 *                   type: string
 *                   description: Search string used
 *                 replaceString:
 *                   type: string
 *                   description: Replacement string used
 *       400:
 *         description: Bad request - text and find are required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/find-replace', findReplace);

module.exports = router;
