const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

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

const users = [];

const createDemoUser = async () => {
  const hashedPassword = await bcrypt.hash('password123', 12);
  const demoUser = {
    id: 'demo-user-1',
    email: 'demo@example.com',
    password: hashedPassword,
    firstName: 'Demo',
    lastName: 'User',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: null
  };
  users.push(demoUser);
};

createDemoUser().catch(console.error);

const generateId = () => uuidv4();

module.exports = {
  data,
  users,
  generateId
};
