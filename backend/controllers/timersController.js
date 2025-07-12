const { data, generateId } = require('../utils/dataStore');

const getAllTimers = (req, res) => {
  res.json(data.timers);
};

const startTimer = (req, res) => {
  const { duration = 1500, type = 'work' } = req.body; 
  
  const timer = {
    id: generateId(),
    duration,
    type,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + duration * 1000).toISOString(),
    status: 'running'
  };

  data.timers.push(timer);
  res.status(201).json(timer);
};

const getActiveTimer = (req, res) => {
  const activeTimer = data.timers.find(timer => timer.status === 'running');
  if (!activeTimer) {
    return res.status(404).json({ error: 'No active timer found' });
  }
  res.json(activeTimer);
};

const stopTimer = (req, res) => {
  const { id } = req.params;
  const timerIndex = data.timers.findIndex(timer => timer.id === id);
  
  if (timerIndex === -1) {
    return res.status(404).json({ error: 'Timer not found' });
  }
  
  data.timers[timerIndex].status = 'stopped';
  data.timers[timerIndex].stoppedAt = new Date().toISOString();
  
  res.json(data.timers[timerIndex]);
};

module.exports = {
  getAllTimers,
  startTimer,
  getActiveTimer,
  stopTimer
};
