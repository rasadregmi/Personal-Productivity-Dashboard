const { data, generateId } = require('../utils/dataStore');

const getAllTodos = (req, res) => {
  res.json(data.todos);
};

const createTodo = (req, res) => {
  const { title, description, priority = 'medium', dueDate, category = 'general' } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const todo = {
    id: generateId(),
    title,
    description,
    completed: false,
    priority,
    dueDate,
    category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.todos.push(todo);
  res.status(201).json(todo);
};

const toggleTodo = (req, res) => {
  const { id } = req.params;
  const todoIndex = data.todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  data.todos[todoIndex].completed = !data.todos[todoIndex].completed;
  data.todos[todoIndex].updatedAt = new Date().toISOString();
  
  res.json(data.todos[todoIndex]);
};

const deleteTodo = (req, res) => {
  const { id } = req.params;
  const todoIndex = data.todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  data.todos.splice(todoIndex, 1);
  res.status(204).send();
};

const getCompletedTodos = (req, res) => {
  const completedTodos = data.todos.filter(todo => todo.completed);
  res.json(completedTodos);
};

const getPendingTodos = (req, res) => {
  const pendingTodos = data.todos.filter(todo => !todo.completed);
  res.json(pendingTodos);
};

const getTodosByPriority = (req, res) => {
  const { priority } = req.params;
  const filtered = data.todos.filter(todo => todo.priority === priority);
  res.json(filtered);
};

const updateTodo = (req, res) => {
  const { id } = req.params;
  const { title, description, priority, dueDate, category } = req.body;
  const todoIndex = data.todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  data.todos[todoIndex] = {
    ...data.todos[todoIndex],
    ...(title && { title }),
    ...(description && { description }),
    ...(priority && { priority }),
    ...(dueDate && { dueDate }),
    ...(category && { category }),
    updatedAt: new Date().toISOString()
  };
  
  res.json(data.todos[todoIndex]);
};

const getTodoById = (req, res) => {
  const { id } = req.params;
  const todo = data.todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json(todo);
};

const updateTodoStatus = (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const todoIndex = data.todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  data.todos[todoIndex].completed = completed !== undefined ? completed : !data.todos[todoIndex].completed;
  data.todos[todoIndex].updatedAt = new Date().toISOString();
  
  res.json(data.todos[todoIndex]);
};

const updateTodoPriority = (req, res) => {
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
};

module.exports = {
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
};
