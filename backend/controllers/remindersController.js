const { data, generateId } = require('../utils/dataStore');

const getAllReminders = (req, res) => {
  res.json(data.reminders);
};

const createReminder = (req, res) => {
  const { title, description, dateTime, recurring = 'none' } = req.body;
  
  if (!title || !dateTime) {
    return res.status(400).json({ error: 'Title and dateTime are required' });
  }

  const reminder = {
    id: generateId(),
    title,
    description,
    dateTime,
    recurring,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.reminders.push(reminder);
  res.status(201).json(reminder);
};

const deleteReminder = (req, res) => {
  const { id } = req.params;
  const reminderIndex = data.reminders.findIndex(reminder => reminder.id === id);
  
  if (reminderIndex === -1) {
    return res.status(404).json({ error: 'Reminder not found' });
  }

  data.reminders.splice(reminderIndex, 1);
  res.status(204).send();
};

const getTodayReminders = (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
  const todayReminders = data.reminders.filter(reminder => {
    const reminderDate = new Date(reminder.dateTime);
    return reminderDate >= startOfDay && reminderDate < endOfDay;
  });
  
  res.json(todayReminders);
};

const getUpcomingReminders = (req, res) => {
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const upcomingReminders = data.reminders.filter(reminder => {
    const reminderDate = new Date(reminder.dateTime);
    return reminderDate >= now && reminderDate <= sevenDaysLater;
  });
  
  res.json(upcomingReminders.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)));
};

const snoozeReminder = (req, res) => {
  const { id } = req.params;
  const { minutes = 10 } = req.body;
  const reminderIndex = data.reminders.findIndex(r => r.id === id);
  
  if (reminderIndex === -1) {
    return res.status(404).json({ error: 'Reminder not found' });
  }
  
  const currentDate = new Date(data.reminders[reminderIndex].dateTime);
  currentDate.setMinutes(currentDate.getMinutes() + minutes);
  
  data.reminders[reminderIndex].dateTime = currentDate.toISOString();
  data.reminders[reminderIndex].updatedAt = new Date().toISOString();
  
  res.json(data.reminders[reminderIndex]);
};

module.exports = {
  getAllReminders,
  createReminder,
  deleteReminder,
  getTodayReminders,
  getUpcomingReminders,
  snoozeReminder
};
