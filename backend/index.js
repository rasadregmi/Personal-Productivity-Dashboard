const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

console.log('Starting Personal Productivity Dashboard Backend...');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


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

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

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

app.get('/api/quotes', (req, res) => {
  const { random } = req.query;
  if (random === 'true' && data.quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * data.quotes.length);
    return res.json(data.quotes[randomIndex]);
  }
  res.json(data.quotes);
});

app.get('/api/notes', (req, res) => res.json(data.notes));
app.get('/api/todos', (req, res) => res.json(data.todos));
app.get('/api/reminders', (req, res) => res.json(data.reminders));
app.get('/api/bookmarks', (req, res) => res.json(data.bookmarks));
app.get('/api/timers', (req, res) => res.json(data.timers));

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

app.patch('/api/todos/:id/toggle', (req, res) => {
  const todo = data.todos.find(t => t.id === req.params.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  todo.completed = !todo.completed;
  todo.updatedAt = new Date().toISOString();
  res.json(todo);
});

app.delete('/api/notes/:id', (req, res) => {
  const index = data.notes.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Note not found' });
  data.notes.splice(index, 1);
  res.status(204).send();
});

app.delete('/api/todos/:id', (req, res) => {
  const index = data.todos.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });
  data.todos.splice(index, 1);
  res.status(204).send();
});

app.delete('/api/bookmarks/:id', (req, res) => {
  const index = data.bookmarks.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Bookmark not found' });
  data.bookmarks.splice(index, 1);
  res.status(204).send();
});

app.delete('/api/reminders/:id', (req, res) => {
  const index = data.reminders.findIndex(item => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Reminder not found' });
  data.reminders.splice(index, 1);
  res.status(204).send();
});

console.log('Routes configured');

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

app.get('/api/todos/completed', (req, res) => {
  const completed = data.todos.filter(todo => todo.completed);
  res.json(completed);
});

app.get('/api/todos/pending', (req, res) => {
  const pending = data.todos.filter(todo => !todo.completed);
  res.json(pending);
});

app.get('/api/todos/priority/:priority', (req, res) => {
  const { priority } = req.params;
  const filtered = data.todos.filter(todo => todo.priority === priority);
  res.json(filtered);
});

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

app.get('/api/reminders/today', (req, res) => {
  const today = new Date().toDateString();
  const todayReminders = data.reminders.filter(reminder => 
    new Date(reminder.dateTime).toDateString() === today
  );
  res.json(todayReminders);
});

app.get('/api/reminders/upcoming', (req, res) => {
  const now = new Date();
  const upcoming = data.reminders.filter(reminder => 
    new Date(reminder.dateTime) > now
  ).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  res.json(upcoming);
});

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

app.get('/api/quotes/category/:category', (req, res) => {
  const { category } = req.params;
  const filtered = data.quotes.filter(quote => quote.category === category);
  res.json(filtered);
});

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

app.delete('/api/quotes/:id', (req, res) => {
  const { id } = req.params;
  const quoteIndex = data.quotes.findIndex(q => q.id === id);
  
  if (quoteIndex === -1) return res.status(404).json({ error: 'Quote not found' });
  
  data.quotes.splice(quoteIndex, 1);
  res.json({ message: 'Quote deleted successfully' });
});

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

app.get('/api/timer/active', (req, res) => {
  const activeTimer = data.timers.find(timer => timer.status === 'running');
  res.json(activeTimer || null);
});

app.patch('/api/timer/:id/stop', (req, res) => {
  const { id } = req.params;
  const timerIndex = data.timers.findIndex(t => t.id === id);
  
  if (timerIndex === -1) return res.status(404).json({ error: 'Timer not found' });
  
  data.timers[timerIndex].status = 'stopped';
  data.timers[timerIndex].stoppedAt = new Date().toISOString();
  
  res.json(data.timers[timerIndex]);
});

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

app.post('/api/text-utils/sort-lines', (req, res) => {
  const { text, order = 'asc' } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  
  const lines = text.split('\n');
  const sortedLines = order === 'desc' 
    ? lines.sort().reverse() 
    : lines.sort();
  
  res.json({ result: sortedLines.join('\n') });
});

app.post('/api/text-utils/find-replace', (req, res) => {
  const { text, find, replace = '' } = req.body;
  if (!text || !find) return res.status(400).json({ error: 'Text and find string are required' });
  
  const result = text.replace(new RegExp(find, 'g'), replace);
  const replacements = (text.match(new RegExp(find, 'g')) || []).length;
  
  res.json({ result, replacements });
});

app.get('/api/system/memory', (req, res) => {
  const memUsage = process.memoryUsage();
  res.json({
    rss: Math.round(memUsage.rss / 1024 / 1024) + ' MB',
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB',
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
    external: Math.round(memUsage.external / 1024 / 1024) + ' MB'
  });
});

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

app.get('/api/data/export', (req, res) => {
  res.json({
    exportedAt: new Date().toISOString(),
    data: data
  });
});

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

app.get('/quotes/random', (req, res) => {
  if (data.quotes.length === 0) {
    return res.status(404).json({ error: 'No quotes available' });
  }
  const randomIndex = Math.floor(Math.random() * data.quotes.length);
  res.json(data.quotes[randomIndex]);
});

app.get('/quotes/category/:category', (req, res) => {
  const { category } = req.params;
  const filtered = data.quotes.filter(quote => 
    quote.category.toLowerCase() === category.toLowerCase()
  );
  res.json(filtered);
});

app.get('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todo = data.todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json(todo);
});

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

app.patch('/todos/:id/priority', (req, res) => {
  const { id } = req.params;
  const { priority } = req.body;
  const todoIndex = data.todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  if (!['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ error: 'Priority must be low, medium, or high' });
  }
  
  data.todos[todoIndex].priority = priority;
  data.todos[todoIndex].updatedAt = new Date().toISOString();
  
  res.json(data.todos[todoIndex]);
});

app.get('/notes/:id', (req, res) => {
  const { id } = req.params;
  const note = data.notes.find(n => n.id === id);
  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }
  res.json(note);
});

app.get('/notes/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Search term (q) is required' });
  }
  
  const results = data.notes.filter(note => 
    note.title.toLowerCase().includes(q.toLowerCase()) ||
    note.content.toLowerCase().includes(q.toLowerCase()) ||
    (note.tags && note.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase())))
  );
  res.json(results);
});

app.get('/bookmarks/:id', (req, res) => {
  const { id } = req.params;
  const bookmark = data.bookmarks.find(b => b.id === id);
  if (!bookmark) {
    return res.status(404).json({ error: 'Bookmark not found' });
  }
  res.json(bookmark);
});

app.post('/timer/start', (req, res) => {
  const { duration = 25, type = 'work', title = 'Focus Session' } = req.body;
  
  data.timers.forEach(timer => {
    if (timer.status === 'running') {
      timer.status = 'stopped';
      timer.stoppedAt = new Date().toISOString();
    }
  });
  
  const timer = {
    id: generateId(),
    title,
    duration: duration * 60, 
    type,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + duration * 60 * 1000).toISOString(),
    status: 'running'
  };
  
  data.timers.push(timer);
  res.status(201).json(timer);
});

app.post('/timer/stop', (req, res) => {
  const activeTimer = data.timers.find(timer => timer.status === 'running');
  
  if (!activeTimer) {
    return res.status(404).json({ error: 'No active timer found' });
  }
  
  activeTimer.status = 'stopped';
  activeTimer.stoppedAt = new Date().toISOString();
  
  res.json(activeTimer);
});

app.get('/timer/status', (req, res) => {
  const activeTimer = data.timers.find(timer => timer.status === 'running');
  
  if (!activeTimer) {
    return res.json({ 
      status: 'stopped',
      message: 'No active timer',
      activeTimer: null 
    });
  }
  
  const now = new Date();
  const endTime = new Date(activeTimer.endTime);
  const timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));
  
  res.json({
    status: 'running',
    activeTimer: {
      ...activeTimer,
      timeRemaining,
      isFinished: timeRemaining === 0
    }
  });
});

console.log('All required API endpoints configured (30+ endpoints)');

app.listen(port, () => {
  console.log(`🎯 Personal Productivity Dashboard Backend running on http://localhost:${port}`);
  console.log('📋 Available modules: Notes, Todos, Reminders, Bookmarks, Text Tools, Quotes, Timer');
  console.log('🔗 API Base URL: http://localhost:' + port + '/api');
  console.log('💡 Health Check: http://localhost:' + port + '/api/health');
});
