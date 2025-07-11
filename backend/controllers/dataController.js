const { data } = require('../utils/dataStore');

const exportData = (req, res) => {
  res.json({
    exportedAt: new Date().toISOString(),
    data: data
  });
};

const clearData = (req, res) => {
  const { module } = req.body;
  
  if (!module || module === 'all') {
    data.notes = [];
    data.todos = [];
    data.reminders = [];
    data.bookmarks = [];
    data.timers = [];
    data.quotes = [];
  } else if (data[module]) {
    data[module] = [];
  } else {
    return res.status(400).json({ error: 'Invalid module' });
  }
  
  res.json({ message: 'Data cleared successfully', clearedModule: module || 'all' });
};

module.exports = {
  exportData,
  clearData
};
