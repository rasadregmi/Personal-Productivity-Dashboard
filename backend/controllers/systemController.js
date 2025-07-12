const { data } = require('../utils/dataStore');

const getHealth = (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};

const getStats = (req, res) => {
  const stats = {
    notes: {
      total: data.notes.length
    },
    todos: {
      total: data.todos.length,
      completed: data.todos.filter(todo => todo.completed).length
    },
    reminders: {
      total: data.reminders.length
    },
    bookmarks: {
      total: data.bookmarks.length
    },
    quotes: {
      total: data.quotes.length
    },
    timers: {
      total: data.timers.length
    }
  };
  res.json(stats);
};

const getMemoryUsage = (req, res) => {
  const memUsage = process.memoryUsage();
  res.json({
    rss: `${Math.round(memUsage.rss / 1024 / 1024 * 100) / 100} MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024 * 100) / 100} MB`,
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`,
    external: `${Math.round(memUsage.external / 1024 / 1024 * 100) / 100} MB`
  });
};

const getUptime = (req, res) => {
  const uptime = process.uptime();
  res.json({
    uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
    uptimeSeconds: uptime
  });
};

module.exports = {
  getHealth,
  getStats,
  getMemoryUsage,
  getUptime
};
