const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const swaggerSpecs = require('./config/swagger');

const authRoutes = require('./routes/auth');
const systemRoutes = require('./routes/system');
const notesRoutes = require('./routes/notes');
const todosRoutes = require('./routes/todos');
const remindersRoutes = require('./routes/reminders');
const bookmarksRoutes = require('./routes/bookmarks');
const quotesRoutes = require('./routes/quotes');
const timersRoutes = require('./routes/timers');
const textUtilsRoutes = require('./routes/textUtils');
const dataRoutes = require('./routes/data');

console.log('Starting Personal Productivity Dashboard Backend...');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.CORS_ORIGIN
}));
app.use(express.json());


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Personal Productivity Dashboard API'
}));

app.use('/api/auth', authRoutes);
app.use('/api', systemRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/todos', todosRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/timers', timersRoutes);
app.use('/api/text-utils', textUtilsRoutes);
app.use('/api/data', dataRoutes);
app.use('/quotes', quotesRoutes);

console.log('Routes configured');

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and profile management
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
