const express = require('express');
const router = express.Router();
const { 
  getAllTodos, 
  createTodo, 
  toggleTodo, 
  deleteTodo, 
  getCompletedTodos, 
  getPendingTodos,
  getTodosByPriority,
  updateTodo,
  getTodoById,
  updateTodoStatus,
  updateTodoPriority
} = require('../controllers/todosController');

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos
 *     description: Retrieve all todos from the system
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: List of all todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
router.get('/', getAllTodos);

/**
 * @swagger
 * /api/todos/completed:
 *   get:
 *     summary: Get completed todos
 *     description: Retrieve all todos that are marked as completed
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: List of completed todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
router.get('/completed', getCompletedTodos);

/**
 * @swagger
 * /api/todos/pending:
 *   get:
 *     summary: Get pending todos
 *     description: Retrieve all todos that are not yet completed
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: List of pending todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
router.get('/pending', getPendingTodos);

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     description: Create a new todo with title, description, priority, due date, and category
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the todo
 *               description:
 *                 type: string
 *                 description: Description of the todo
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 default: medium
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: Due date for the todo
 *               category:
 *                 type: string
 *                 description: Category of the todo
 *                 default: general
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createTodo);

/**
 * @swagger
 * /api/todos/{id}/toggle:
 *   patch:
 *     summary: Toggle todo completion status
 *     description: Toggle the completed status of a specific todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the todo to toggle
 *     responses:
 *       200:
 *         description: Todo status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/toggle', toggleTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     description: Delete a specific todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the todo to delete
 *     responses:
 *       204:
 *         description: Todo deleted successfully
 *       404:
 *         description: Todo not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deleteTodo);

/**
 * @swagger
 * /api/todos/priority/{priority}:
 *   get:
 *     summary: Get todos by priority
 *     description: Retrieve all todos filtered by priority level
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: priority
 *         required: true
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Priority level to filter by
 *     responses:
 *       200:
 *         description: List of todos with specified priority
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
router.get('/priority/:priority', getTodosByPriority);

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a specific todo
 *     description: Retrieve a single todo by its ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the todo to retrieve
 *     responses:
 *       200:
 *         description: Todo details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getTodoById);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo
 *     description: Update an existing todo with new data
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the todo to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the todo
 *               description:
 *                 type: string
 *                 description: Updated description of the todo
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 description: Updated priority of the todo
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: Updated due date of the todo
 *               category:
 *                 type: string
 *                 description: Updated category of the todo
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', updateTodo);

/**
 * @swagger
 * /api/todos/{id}/status:
 *   patch:
 *     summary: Update todo completion status
 *     description: Update the completion status of a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the todo to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *                 description: New completion status
 *     responses:
 *       200:
 *         description: Todo status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/status', updateTodoStatus);

/**
 * @swagger
 * /api/todos/{id}/priority:
 *   patch:
 *     summary: Update todo priority
 *     description: Update the priority level of a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the todo to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - priority
 *             properties:
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 description: New priority level
 *     responses:
 *       200:
 *         description: Todo priority updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Invalid priority value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Todo not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/priority', updateTodoPriority);

module.exports = router;
