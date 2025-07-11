const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

console.log('Starting Personal Productivity Dashboard Backend...');

const app = express();
const port = process.env.PORT || 4000;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Personal Productivity Dashboard API',
      version: '1.0.0',
      description: 'A comprehensive API for managing personal productivity including notes, todos, reminders, bookmarks, quotes, timers, and text utilities.',
      contact: {
        name: 'Personal Productivity Dashboard',
        url: 'http://localhost:4000'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Note: {
          type: 'object',
          required: ['id', 'title', 'content'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the note'
            },
            title: {
              type: 'string',
              description: 'Title of the note'
            },
            content: {
              type: 'string',
              description: 'Content of the note'
            },
            category: {
              type: 'string',
              description: 'Category of the note',
              default: 'general'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Tags associated with the note'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the note was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the note was last updated'
            }
          }
        },
        Todo: {
          type: 'object',
          required: ['id', 'title'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the todo'
            },
            title: {
              type: 'string',
              description: 'Title of the todo'
            },
            description: {
              type: 'string',
              description: 'Description of the todo'
            },
            completed: {
              type: 'boolean',
              description: 'Whether the todo is completed',
              default: false
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Priority level of the todo',
              default: 'medium'
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Due date for the todo'
            },
            category: {
              type: 'string',
              description: 'Category of the todo',
              default: 'general'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the todo was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the todo was last updated'
            }
          }
        },
        Reminder: {
          type: 'object',
          required: ['id', 'title', 'dateTime'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the reminder'
            },
            title: {
              type: 'string',
              description: 'Title of the reminder'
            },
            description: {
              type: 'string',
              description: 'Description of the reminder'
            },
            dateTime: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time for the reminder'
            },
            recurring: {
              type: 'string',
              enum: ['none', 'daily', 'weekly', 'monthly'],
              description: 'Recurring pattern for the reminder',
              default: 'none'
            },
            active: {
              type: 'boolean',
              description: 'Whether the reminder is active',
              default: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the reminder was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the reminder was last updated'
            }
          }
        },
        Bookmark: {
          type: 'object',
          required: ['id', 'title', 'url'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the bookmark'
            },
            title: {
              type: 'string',
              description: 'Title of the bookmark'
            },
            url: {
              type: 'string',
              format: 'uri',
              description: 'URL of the bookmark'
            },
            description: {
              type: 'string',
              description: 'Description of the bookmark'
            },
            category: {
              type: 'string',
              description: 'Category of the bookmark',
              default: 'general'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Tags associated with the bookmark'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the bookmark was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the bookmark was last updated'
            }
          }
        },
        Quote: {
          type: 'object',
          required: ['id', 'text', 'author'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the quote'
            },
            text: {
              type: 'string',
              description: 'Text content of the quote'
            },
            author: {
              type: 'string',
              description: 'Author of the quote'
            },
            category: {
              type: 'string',
              description: 'Category of the quote',
              default: 'general'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the quote was created'
            }
          }
        },
        Timer: {
          type: 'object',
          required: ['id', 'duration', 'type'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the timer'
            },
            title: {
              type: 'string',
              description: 'Title of the timer session'
            },
            duration: {
              type: 'number',
              description: 'Duration of the timer in seconds'
            },
            type: {
              type: 'string',
              enum: ['work', 'break', 'custom'],
              description: 'Type of timer session',
              default: 'work'
            },
            startTime: {
              type: 'string',
              format: 'date-time',
              description: 'Start time of the timer'
            },
            endTime: {
              type: 'string',
              format: 'date-time',
              description: 'End time of the timer'
            },
            status: {
              type: 'string',
              enum: ['running', 'stopped', 'paused'],
              description: 'Current status of the timer'
            },
            stoppedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the timer was stopped'
            }
          }
        },
        Error: {
          type: 'object',
          required: ['error'],
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    }
  },
  apis: ['./index.js']
};

const specs = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Personal Productivity Dashboard API'
}));


const data = {
  notes: [
    {
      id: "note-1",
      title: "Welcome to Your Personal Productivity Dashboard",
      content: "This is your first note! You can create, edit, and organize your notes here.",
      category: "general",
      tags: ["welcome", "demo"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  todos: [
    {
      id: "todo-1",
      title: "Set up your productivity dashboard", 
      description: "Customize your dashboard to fit your needs",
      completed: false,
      priority: "medium",
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      category: "setup",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  reminders: [],
  bookmarks: [],
  quotes: [
    { id: "quote-1", text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "motivation" },
    { id: "quote-2", text: "Don't let yesterday take up too much of today.", author: "Will Rogers", category: "wisdom" },
    { id: "quote-3", text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi", category: "motivation" }
  ],
  timers: []
};

const generateId = () => uuidv4();

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
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

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
 *               type: object
 *               properties:
 *                 notes:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                 todos:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     completed:
 *                       type: number
 *                 reminders:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                 bookmarks:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                 quotes:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                 timers:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 */
app.get('/api/stats', (req, res) => {
  res.json({
    notes: { total: data.notes.length },
    todos: { total: data.todos.length, completed: data.todos.filter(t => t.completed).length },
    reminders: { total: data.reminders.length },
    bookmarks: { total: data.bookmarks.length },
    quotes: { total: data.quotes.length },
    timers: { total: data.timers.length }
  });
});

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
app.get('/api/quotes', (req, res) => {
  const { random } = req.query;
  if (random === 'true' && data.quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * data.quotes.length);
    return res.json(data.quotes[randomIndex]);
  }
  res.json(data.quotes);
});

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes
 *     description: Retrieve all notes from the system
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: List of all notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 */
app.get('/api/notes', (req, res) => res.json(data.notes));

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
app.get('/api/todos', (req, res) => res.json(data.todos));

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
app.get('/api/reminders', (req, res) => res.json(data.reminders));

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
app.get('/api/bookmarks', (req, res) => res.json(data.bookmarks));

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
app.get('/api/timers', (req, res) => res.json(data.timers));

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     description: Create a new note with title, content, category, and tags
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the note
 *               content:
 *                 type: string
 *                 description: Content of the note
 *               category:
 *                 type: string
 *                 description: Category of the note
 *                 default: general
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags for the note
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/notes', (req, res) => {
  const { title, content, category = 'general', tags = [] } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  const note = {
    id: generateId(),
    title, content, category, tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  data.notes.push(note);
  res.status(201).json(note);
});

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
app.post('/api/todos', (req, res) => {
  const { title, description = '', priority = 'medium', dueDate, category = 'general' } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const todo = {
    id: generateId(),
    title, description, completed: false, priority, dueDate, category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  data.todos.push(todo);
  res.status(201).json(todo);
});

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
app.post('/api/bookmarks', (req, res) => {
  const { title, url, description = '', category = 'general', tags = [] } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }
  const bookmark = {
    id: generateId(),
    title, url, description, category, tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  data.bookmarks.push(bookmark);
  res.status(201).json(bookmark);
});

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
app.post('/api/reminders', (req, res) => {
  const { title, description = '', dateTime, recurring = 'none' } = req.body;
  if (!title || !dateTime) {
    return res.status(400).json({ error: 'Title and dateTime are required' });
  }
  const reminder = {
    id: generateId(),
    title, description, dateTime, recurring, active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  data.reminders.push(reminder);
  res.status(201).json(reminder);
});

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
app.patch('/api/todos/:id/toggle', (req, res) => {
  const todo = data.todos.find(t => t.id === req.params.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  todo.completed = !todo.completed;
  todo.updatedAt = new Date().toISOString();
  res.json(todo);
});

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     description: Delete a specific note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the note to delete
 *     responses:
 *       204:
 *         description: Note deleted successfully
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete('/api/notes/:id', (req, res) => {
  const index = data.notes.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Note not found' });
  data.notes.splice(index, 1);
  res.status(204).send();
});

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
app.delete('/api/todos/:id', (req, res) => {
  const index = data.todos.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });
  data.todos.splice(index, 1);
  res.status(204).send();
});

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
app.delete('/api/bookmarks/:id', (req, res) => {
  const index = data.bookmarks.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Bookmark not found' });
  data.bookmarks.splice(index, 1);
  res.status(204).send();
});

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
app.delete('/api/reminders/:id', (req, res) => {
  const index = data.reminders.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Reminder not found' });
  data.reminders.splice(index, 1);
  res.status(204).send();
});

console.log('Routes configured');

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
app.post('/api/text-utils/word-count', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const lines = text.split('\n').length;
  
  res.json({
    words: words.length,
    characters,
    charactersNoSpaces,
    lines,
    readingTime: Math.ceil(words.length / 200)
  });
});

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
app.post('/api/text-utils/case-convert', (req, res) => {
  const { text, caseType } = req.body;
  if (!text || !caseType) return res.status(400).json({ error: 'Text and caseType are required' });
  
  let convertedText;
  switch (caseType) {
    case 'uppercase': convertedText = text.toUpperCase(); break;
    case 'lowercase': convertedText = text.toLowerCase(); break;
    case 'title': convertedText = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()); break;
    case 'sentence': convertedText = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(); break;
    default: return res.status(400).json({ error: 'Invalid case type' });
  }
  
  res.json({ convertedText });
});

app.get('/api/notes/search', (req, res) => {
  const { query } = req.query;
  if (!query) return res.json(data.notes);
  
  const results = data.notes.filter(note => 
    note.title.toLowerCase().includes(query.toLowerCase()) ||
    note.content.toLowerCase().includes(query.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );
  res.json(results);
});

app.get('/api/notes/category/:category', (req, res) => {
  const { category } = req.params;
  const filtered = data.notes.filter(note => note.category === category);
  res.json(filtered);
});

app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, category, tags } = req.body;
  const noteIndex = data.notes.findIndex(n => n.id === id);
  
  if (noteIndex === -1) return res.status(404).json({ error: 'Note not found' });
  
  data.notes[noteIndex] = {
    ...data.notes[noteIndex],
    title: title || data.notes[noteIndex].title,
    content: content || data.notes[noteIndex].content,
    category: category || data.notes[noteIndex].category,
    tags: tags || data.notes[noteIndex].tags,
    updatedAt: new Date().toISOString()
  };
  
  res.json(data.notes[noteIndex]);
});

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
app.get('/api/todos/completed', (req, res) => {
  const completed = data.todos.filter(todo => todo.completed);
  res.json(completed);
});

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
app.get('/api/todos/pending', (req, res) => {
  const pending = data.todos.filter(todo => !todo.completed);
  res.json(pending);
});

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
app.get('/api/todos/priority/:priority', (req, res) => {
  const { priority } = req.params;
  const filtered = data.todos.filter(todo => todo.priority === priority);
  res.json(filtered);
});

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
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, priority, dueDate, category } = req.body;
  const todoIndex = data.todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) return res.status(404).json({ error: 'Todo not found' });
  
  Object.assign(data.todos[todoIndex], {
    ...(title && { title }),
    ...(description !== undefined && { description }),
    ...(priority && { priority }),
    ...(dueDate && { dueDate }),
    ...(category && { category }),
    updatedAt: new Date().toISOString()
  });
  
  res.json(data.todos[todoIndex]);
});

/**
 * @swagger
 * /api/reminders/today:
 *   get:
 *     summary: Get today's reminders
 *     description: Retrieve all reminders scheduled for today
 *     tags: [Reminders]
 *     responses:
 *       200:
 *         description: List of today's reminders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reminder'
 */
app.get('/api/reminders/today', (req, res) => {
  const today = new Date().toDateString();
  const todayReminders = data.reminders.filter(reminder => 
    new Date(reminder.dateTime).toDateString() === today
  );
  res.json(todayReminders);
});

/**
 * @swagger
 * /api/reminders/upcoming:
 *   get:
 *     summary: Get upcoming reminders
 *     description: Retrieve all reminders scheduled for the future, sorted by date
 *     tags: [Reminders]
 *     responses:
 *       200:
 *         description: List of upcoming reminders sorted by date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reminder'
 */
app.get('/api/reminders/upcoming', (req, res) => {
  const now = new Date();
  const upcoming = data.reminders.filter(reminder => 
    new Date(reminder.dateTime) > now
  ).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  res.json(upcoming);
});

/**
 * @swagger
 * /api/reminders/{id}/snooze:
 *   patch:
 *     summary: Snooze a reminder
 *     description: Postpone a reminder by a specified number of minutes
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
 *                 default: 10
 *                 description: Number of minutes to snooze the reminder
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
app.patch('/api/reminders/:id/snooze', (req, res) => {
  const { id } = req.params;
  const { minutes = 10 } = req.body;
  const reminderIndex = data.reminders.findIndex(r => r.id === id);
  
  if (reminderIndex === -1) return res.status(404).json({ error: 'Reminder not found' });
  
  const currentDate = new Date(data.reminders[reminderIndex].dateTime);
  currentDate.setMinutes(currentDate.getMinutes() + minutes);
  
  data.reminders[reminderIndex].dateTime = currentDate.toISOString();
  data.reminders[reminderIndex].updatedAt = new Date().toISOString();
  
  res.json(data.reminders[reminderIndex]);
});

app.get('/api/bookmarks/category/:category', (req, res) => {
  const { category } = req.params;
  const filtered = data.bookmarks.filter(bookmark => bookmark.category === category);
  res.json(filtered);
});

app.get('/api/bookmarks/search', (req, res) => {
  const { query } = req.query;
  if (!query) return res.json(data.bookmarks);
  
  const results = data.bookmarks.filter(bookmark => 
    bookmark.title.toLowerCase().includes(query.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(query.toLowerCase()) ||
    (bookmark.description && bookmark.description.toLowerCase().includes(query.toLowerCase()))
  );
  res.json(results);
});

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
 *                 description: Updated title of the bookmark
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: Updated URL of the bookmark
 *               description:
 *                 type: string
 *                 description: Updated description of the bookmark
 *               category:
 *                 type: string
 *                 description: Updated category of the bookmark
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
app.put('/api/bookmarks/:id', (req, res) => {
  const { id } = req.params;
  const { title, url, description, category } = req.body;
  const bookmarkIndex = data.bookmarks.findIndex(b => b.id === id);
  
  if (bookmarkIndex === -1) return res.status(404).json({ error: 'Bookmark not found' });
  
  data.bookmarks[bookmarkIndex] = {
    ...data.bookmarks[bookmarkIndex],
    title: title || data.bookmarks[bookmarkIndex].title,
    url: url || data.bookmarks[bookmarkIndex].url,
    description: description || data.bookmarks[bookmarkIndex].description,
    category: category || data.bookmarks[bookmarkIndex].category,
    updatedAt: new Date().toISOString()
  };
  
  res.json(data.bookmarks[bookmarkIndex]);
});

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
app.get('/api/quotes/category/:category', (req, res) => {
  const { category } = req.params;
  const filtered = data.quotes.filter(quote => quote.category === category);
  res.json(filtered);
});

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
app.post('/api/quotes', (req, res) => {
  const { text, author, category = 'general' } = req.body;
  if (!text || !author) {
    return res.status(400).json({ error: 'Text and author are required' });
  }
  
  const quote = {
    id: generateId(),
    text, author, category,
    createdAt: new Date().toISOString()
  };
  
  data.quotes.push(quote);
  res.status(201).json(quote);
});

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
 *       200:
 *         description: Quote deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quote deleted successfully
 *       404:
 *         description: Quote not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete('/api/quotes/:id', (req, res) => {
  const { id } = req.params;
  const quoteIndex = data.quotes.findIndex(q => q.id === id);
  
  if (quoteIndex === -1) return res.status(404).json({ error: 'Quote not found' });
  
  data.quotes.splice(quoteIndex, 1);
  res.json({ message: 'Quote deleted successfully' });
});

/**
 * @swagger
 * /api/timer/start:
 *   post:
 *     summary: Start a new timer
 *     description: Start a new focus timer with specified duration and type
 *     tags: [Timers]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               duration:
 *                 type: number
 *                 default: 25
 *                 description: Timer duration in minutes
 *               type:
 *                 type: string
 *                 enum: [work, break]
 *                 default: work
 *                 description: Type of timer session
 *     responses:
 *       201:
 *         description: Timer started successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Timer'
 */
app.post('/api/timer/start', (req, res) => {
  const { duration = 25, type = 'work' } = req.body;
  const timer = {
    id: generateId(),
    duration: duration * 60, 
    type,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + duration * 60 * 1000).toISOString(),
    status: 'running'
  };
  
  data.timers.push(timer);
  res.status(201).json(timer);
});

/**
 * @swagger
 * /api/timer/active:
 *   get:
 *     summary: Get active timer
 *     description: Retrieve the currently running timer if any
 *     tags: [Timers]
 *     responses:
 *       200:
 *         description: Active timer information or null if no timer is running
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Timer'
 *                 - type: "null"
 */
app.get('/api/timer/active', (req, res) => {
  const activeTimer = data.timers.find(timer => timer.status === 'running');
  res.json(activeTimer || null);
});

/**
 * @swagger
 * /api/timer/{id}/stop:
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
app.patch('/api/timer/:id/stop', (req, res) => {
  const { id } = req.params;
  const timerIndex = data.timers.findIndex(t => t.id === id);
  
  if (timerIndex === -1) return res.status(404).json({ error: 'Timer not found' });
  
  data.timers[timerIndex].status = 'stopped';
  data.timers[timerIndex].stoppedAt = new Date().toISOString();
  
  res.json(data.timers[timerIndex]);
});

/**
 * @swagger
 * /api/text-utils/remove-duplicates:
 *   post:
 *     summary: Remove duplicate lines
 *     description: Remove duplicate lines from text while preserving order
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
 *                 originalLines:
 *                   type: number
 *                   description: Number of original lines
 *                 uniqueLines:
 *                   type: number
 *                   description: Number of unique lines
 *                 result:
 *                   type: string
 *                   description: Text with duplicates removed
 *       400:
 *         description: Bad request - text is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/text-utils/remove-duplicates', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  
  const lines = text.split('\n');
  const uniqueLines = [...new Set(lines)];
  
  res.json({ 
    originalLines: lines.length,
    uniqueLines: uniqueLines.length,
    result: uniqueLines.join('\n')
  });
});

/**
 * @swagger
 * /api/text-utils/sort-lines:
 *   post:
 *     summary: Sort text lines
 *     description: Sort lines of text in ascending or descending order
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
 *                 result:
 *                   type: string
 *                   description: Sorted text
 *       400:
 *         description: Bad request - text is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/text-utils/sort-lines', (req, res) => {
  const { text, order = 'asc' } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  
  const lines = text.split('\n');
  const sortedLines = order === 'desc' 
    ? lines.sort().reverse() 
    : lines.sort();
  
  res.json({ result: sortedLines.join('\n') });
});

/**
 * @swagger
 * /api/text-utils/find-replace:
 *   post:
 *     summary: Find and replace text
 *     description: Find and replace all occurrences of a string in text
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
 *                 description: String to find
 *               replace:
 *                 type: string
 *                 default: ""
 *                 description: String to replace with
 *     responses:
 *       200:
 *         description: Text processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: Text with replacements made
 *                 replacements:
 *                   type: number
 *                   description: Number of replacements made
 *       400:
 *         description: Bad request - text and find string are required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/api/text-utils/find-replace', (req, res) => {
  const { text, find, replace = '' } = req.body;
  if (!text || !find) return res.status(400).json({ error: 'Text and find string are required' });
  
  const result = text.replace(new RegExp(find, 'g'), replace);
  const replacements = (text.match(new RegExp(find, 'g')) || []).length;
  
  res.json({ result, replacements });
});

/**
 * @swagger
 * /api/system/memory:
 *   get:
 *     summary: Get system memory usage
 *     description: Retrieve current memory usage statistics of the server
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Memory usage statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rss:
 *                   type: string
 *                   description: Resident Set Size in MB
 *                 heapTotal:
 *                   type: string
 *                   description: Total heap size in MB
 *                 heapUsed:
 *                   type: string
 *                   description: Used heap size in MB
 *                 external:
 *                   type: string
 *                   description: External memory usage in MB
 */
app.get('/api/system/memory', (req, res) => {
  const memUsage = process.memoryUsage();
  res.json({
    rss: Math.round(memUsage.rss / 1024 / 1024) + ' MB',
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB',
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
    external: Math.round(memUsage.external / 1024 / 1024) + ' MB'
  });
});

/**
 * @swagger
 * /api/system/uptime:
 *   get:
 *     summary: Get system uptime
 *     description: Retrieve server uptime information
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server uptime information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uptime:
 *                   type: string
 *                   description: Formatted uptime string
 *                 uptimeSeconds:
 *                   type: number
 *                   description: Uptime in seconds
 */
app.get('/api/system/uptime', (req, res) => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  res.json({
    uptime: `${hours}h ${minutes}m ${seconds}s`,
    uptimeSeconds: uptime
  });
});

/**
 * @swagger
 * /api/data/export:
 *   get:
 *     summary: Export all data
 *     description: Export all application data for backup purposes
 *     tags: [Data Management]
 *     responses:
 *       200:
 *         description: All application data exported
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
app.get('/api/data/export', (req, res) => {
  res.json({
    exportedAt: new Date().toISOString(),
    data: data
  });
});

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
app.post('/api/data/clear', (req, res) => {
  const { module } = req.body;
  
  if (!module || module === 'all') {
    data.notes = [];
    data.todos = [];
    data.reminders = [];
    data.bookmarks = [];
    data.timers = [];
  } else if (data[module]) {
    data[module] = [];
  } else {
    return res.status(400).json({ error: 'Invalid module' });
  }
  
  res.json({ message: 'Data cleared successfully', clearedModule: module || 'all' });
});

console.log('All API endpoints configured');

app.get('/ping', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString() 
  });
});

/**
 * @swagger
 * /uptime:
 *   get:
 *     summary: Get server uptime
 *     description: Get detailed server uptime information
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server uptime details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uptime:
 *                   type: string
 *                   description: Formatted uptime string
 *                 uptimeSeconds:
 *                   type: number
 *                   description: Uptime in seconds
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                   description: Server start timestamp
 */
app.get('/uptime', (req, res) => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  res.json({
    uptime: `${hours}h ${minutes}m ${seconds}s`,
    uptimeSeconds: uptime,
    startTime: new Date(Date.now() - uptime * 1000).toISOString()
  });
});

/**
 * @swagger
 * /memory-usage:
 *   get:
 *     summary: Get memory usage
 *     description: Get detailed memory usage information
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Memory usage details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rss:
 *                   type: string
 *                   description: Resident Set Size in MB
 *                 heapTotal:
 *                   type: string
 *                   description: Total heap size in MB
 *                 heapUsed:
 *                   type: string
 *                   description: Used heap size in MB
 *                 external:
 *                   type: string
 *                   description: External memory usage in MB
 *                 arrayBuffers:
 *                   type: string
 *                   description: Array buffers size in MB
 */
app.get('/memory-usage', (req, res) => {
  const memUsage = process.memoryUsage();
  res.json({
    rss: Math.round(memUsage.rss / 1024 / 1024) + ' MB',
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB',
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
    external: Math.round(memUsage.external / 1024 / 1024) + ' MB',
    arrayBuffers: Math.round(memUsage.arrayBuffers / 1024 / 1024) + ' MB'
  });
});

/**
 * @swagger
 * /tools/uppercase:
 *   post:
 *     summary: Convert text to uppercase
 *     description: Convert input text to uppercase letters
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
 *                 description: Text to convert
 *     responses:
 *       200:
 *         description: Text converted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 original:
 *                   type: string
 *                   description: Original text
 *                 result:
 *                   type: string
 *                   description: Uppercase text
 *       400:
 *         description: Text is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/tools/uppercase', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  res.json({ 
    original: text,
    result: text.toUpperCase() 
  });
});

/**
 * @swagger
 * /tools/lowercase:
 *   post:
 *     summary: Convert text to lowercase
 *     description: Convert input text to lowercase letters
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
 *                 description: Text to convert
 *     responses:
 *       200:
 *         description: Text converted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 original:
 *                   type: string
 *                   description: Original text
 *                 result:
 *                   type: string
 *                   description: Lowercase text
 *       400:
 *         description: Text is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/tools/lowercase', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  res.json({ 
    original: text,
    result: text.toLowerCase() 
  });
});

/**
 * @swagger
 * /tools/reverse:
 *   post:
 *     summary: Reverse text
 *     description: Reverse the order of characters in text
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
 *                 description: Text to reverse
 *     responses:
 *       200:
 *         description: Text reversed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 original:
 *                   type: string
 *                   description: Original text
 *                 result:
 *                   type: string
 *                   description: Reversed text
 *       400:
 *         description: Text is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/tools/reverse', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  res.json({ 
    original: text,
    result: text.split('').reverse().join('') 
  });
});

/**
 * @swagger
 * /tools/word-count:
 *   post:
 *     summary: Count words in text
 *     description: Get detailed word count and text statistics
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
 *         description: Text analysis completed
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
 *                   description: Total characters
 *                 charactersNoSpaces:
 *                   type: number
 *                   description: Characters without spaces
 *                 lines:
 *                   type: number
 *                   description: Number of lines
 *                 sentences:
 *                   type: number
 *                   description: Number of sentences
 *                 readingTime:
 *                   type: number
 *                   description: Estimated reading time in minutes
 *       400:
 *         description: Text is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/tools/word-count', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const lines = text.split('\n').length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  
  res.json({
    words: words.length,
    characters,
    charactersNoSpaces,
    lines,
    sentences,
    readingTime: Math.ceil(words.length / 200) 
  });
});

/**
 * @swagger
 * /quotes/random:
 *   get:
 *     summary: Get a random quote
 *     description: Retrieve a random quote from the collection
 *     tags: [Quotes]
 *     responses:
 *       200:
 *         description: Random quote
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
app.get('/quotes/random', (req, res) => {
  if (data.quotes.length === 0) {
    return res.status(404).json({ error: 'No quotes available' });
  }
  const randomIndex = Math.floor(Math.random() * data.quotes.length);
  res.json(data.quotes[randomIndex]);
});

/**
 * @swagger
 * /quotes/category/{category}:
 *   get:
 *     summary: Get quotes by category (alternative endpoint)
 *     description: Retrieve quotes filtered by category using alternative endpoint
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
app.get('/quotes/category/:category', (req, res) => {
  const { category } = req.params;
  const filtered = data.quotes.filter(quote => quote.category === category);
  res.json(filtered);
});

/**
 * @swagger
 * /todos/{id}:
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
app.get('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todo = data.todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json(todo);
});

/**
 * @swagger
 * /todos/{id}/status:
 *   patch:
 *     summary: Update todo status
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
app.patch('/todos/:id/status', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const todoIndex = data.todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  data.todos[todoIndex].completed = completed !== undefined ? completed : !data.todos[todoIndex].completed;
  data.todos[todoIndex].updatedAt = new Date().toISOString();
  
  res.json(data.todos[todoIndex]);
});

/**
 * @swagger
 * /todos/{id}/priority:
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
app.patch('/todos/:id/priority', (req, res) => {
  const { id } = req.params;
  const { priority } = req.body;
  const todoIndex = data.todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) return res.status(404).json({ error: 'Todo not found' });
  
  if (!['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ error: 'Priority must be low, medium, or high' });
  }
  
  data.todos[todoIndex].priority = priority;
  data.todos[todoIndex].updatedAt = new Date().toISOString();
  
  res.json(data.todos[todoIndex]);
});

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Get a specific note
 *     description: Retrieve a single note by its ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the note to retrieve
 *     responses:
 *       200:
 *         description: Note details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/notes/:id', (req, res) => {
  const { id } = req.params;
  const note = data.notes.find(n => n.id === id);
  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }
  res.json(note);
});

/**
 * @swagger
 * /api/notes/search:
 *   get:
 *     summary: Search notes
 *     description: Search notes by title, content, or tags
 *     tags: [Notes]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query to match against title, content, or tags
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 */


/**
 * @swagger
 * tags:
 *   - name: System
 *     description: System health and statistics endpoints
 *   - name: Notes
 *     description: Note management operations
 *   - name: Todos
 *     description: Todo management operations
 *   - name: Reminders
 *     description: Reminder management operations
 *   - name: Bookmarks
 *     description: Bookmark management operations
 *   - name: Quotes
 *     description: Quote management operations
 *   - name: Timers
 *     description: Timer management operations
 *   - name: Text Utilities
 *     description: Text processing and utility operations
 *   - name: Data Management
 *     description: Data export and management operations
 */

app.listen(port, () => {
  console.log(`- Personal Productivity Dashboard Backend running on http://localhost:${port}`);
  console.log('- Available modules: Notes, Todos, Reminders, Bookmarks, Text Tools, Quotes, Timer');
  console.log('- API Base URL: http://localhost:' + port + '/api');
  console.log('- Health Check: http://localhost:' + port + '/api/health');
  console.log('- API Documentation: http://localhost:' + port + '/api-docs');
});
