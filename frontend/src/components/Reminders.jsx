import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [todaysReminders, setTodaysReminders] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'personal'
  });

  useEffect(() => {
    fetchReminders();
    fetchTodaysReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders`);
      const data = await response.json();
      setReminders(data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const fetchTodaysReminders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reminders?active=true`);
      const data = await response.json();
      setTodaysReminders(data);
    } catch (error) {
      console.error('Error fetching today\'s reminders:', error);
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!newReminder.title.trim() || !newReminder.date) return;

    try {
      const response = await fetch(`${API_BASE_URL}/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newReminder.title,
          description: newReminder.description,
          dateTime: newReminder.time 
            ? `${newReminder.date}T${newReminder.time}:00.000Z`
            : `${newReminder.date}T09:00:00.000Z`,
          recurring: 'none'
        })
      });
      
      if (response.ok) {
        setNewReminder({ title: '', description: '', date: '', time: '', type: 'personal' });
        setIsAdding(false);
        fetchReminders();
        fetchTodaysReminders();
      }
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/reminders/${id}`, { method: 'DELETE' });
      fetchReminders();
      fetchTodaysReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'work': return 'text-blue-600 bg-blue-100';
      case 'personal': return 'text-green-600 bg-green-100';
      case 'health': return 'text-red-600 bg-red-100';
      case 'finance': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const isUpcoming = (date) => {
    const reminderDate = new Date(date);
    const now = new Date();
    return reminderDate > now;
  };

  const isPast = (date) => {
    const reminderDate = new Date(date);
    const now = new Date();
    return reminderDate < now;
  };

  const upcomingReminders = reminders.filter(r => isUpcoming(r.datetime));
  const pastReminders = reminders.filter(r => isPast(r.datetime));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">⏰ Reminders</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="btn-primary"
        >
          + Add Reminder
        </button>
      </div>

      {todaysReminders.length > 0 && (
        <div className="card border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📅 Today's Reminders</h2>
          <div className="space-y-3">
            {todaysReminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                  {reminder.description && (
                    <p className="text-sm text-gray-600">{reminder.description}</p>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-block px-2 py-1 text-xs rounded ${getTypeColor(reminder.type)}`}>
                      {reminder.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(reminder.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteReminder(reminder.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isAdding && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Add New Reminder</h2>
          <form onSubmit={handleAddReminder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                className="input-field"
                placeholder="Reminder title..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newReminder.description}
                onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                className="input-field"
                rows="3"
                placeholder="Additional details..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newReminder.date}
                  onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newReminder.type}
                  onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
                  className="input-field"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="health">Health</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">Save Reminder</button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {upcomingReminders.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Upcoming Reminders</h2>
          <div className="space-y-3">
            {upcomingReminders.map((reminder) => (
              <div key={reminder.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                    {reminder.description && (
                      <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${getTypeColor(reminder.type)}`}>
                        {reminder.type}
                      </span>
                      <span className="text-sm text-gray-600">
                        {new Date(reminder.datetime).toLocaleDateString()} at{' '}
                        {new Date(reminder.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pastReminders.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📜 Past Reminders</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {pastReminders.map((reminder) => (
              <div key={reminder.id} className="border border-gray-200 rounded-lg p-4 opacity-60">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                    {reminder.description && (
                      <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${getTypeColor(reminder.type)}`}>
                        {reminder.type}
                      </span>
                      <span className="text-sm text-gray-600">
                        {new Date(reminder.datetime).toLocaleDateString()} at{' '}
                        {new Date(reminder.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reminders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏰</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No reminders yet</h3>
          <p className="text-gray-500 mb-4">Set your first reminder to stay organized</p>
          <button
            onClick={() => setIsAdding(true)}
            className="btn-primary"
          >
            Add Reminder
          </button>
        </div>
      )}
    </div>
  );
};

export default Reminders;
