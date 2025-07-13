import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTodo, setNewTodo] = useState({ text: '', description: '', priority: 'medium', category: '' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.text.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTodo.text,
          description: newTodo.description || '',
          priority: newTodo.priority || 'medium',
          category: newTodo.category || 'general'
        })
      });
      
      if (response.ok) {
        setNewTodo({ text: '', description: '', priority: 'medium', category: '' });
        setIsAdding(false);
        fetchTodos();
      } else {
        console.error('Failed to add todo:', await response.text());
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchTodos();
      } else {
        console.error('Failed to update todo:', await response.text());
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await fetch(`${API_BASE_URL}/todos/${id}`, { method: 'DELETE' });
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'completed') return todo.status === 'completed';
    if (filter === 'pending') return todo.status === 'pending';
    return todo.priority === filter;
  });

  const getPriorityIcon = (priority) => {
    const icons = {
      'high': '🔴',
      'medium': '🟡',
      'low': '🟢'
    };
    return icons[priority] || '⚪';
  };

  const getPriorityBadgeColor = (priority) => {
    const colors = {
      'high': 'badge-error',
      'medium': 'badge-warning',
      'low': 'badge-success'
    };
    return colors[priority] || 'badge-neutral';
  };

  const completedCount = todos.filter(t => t.status === 'completed').length;
  const pendingCount = todos.filter(t => t.status === 'pending').length;
  const completionPercentage = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="card-premium">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-soft">
              <span className="text-xl text-white">✅</span>
            </div>
            <div>
              <h1 className="heading-2">Tasks</h1>
              <p className="text-subtitle">Stay organized and get things done</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{todos.length}</div>
              <div className="text-sm text-neutral-600">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">{completedCount}</div>
              <div className="text-sm text-neutral-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600">{pendingCount}</div>
              <div className="text-sm text-neutral-600">Pending</div>
            </div>
          </div>
        </div>
        
        {todos.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-600">Overall Progress</span>
              <span className="text-sm font-bold text-purple-600">{Math.round(completionPercentage)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Tasks', count: todos.length },
              { id: 'pending', label: 'Pending', count: pendingCount },
              { id: 'completed', label: 'Completed', count: completedCount },
              { id: 'high', label: 'High Priority', count: todos.filter(t => t.priority === 'high').length },
              { id: 'medium', label: 'Medium Priority', count: todos.filter(t => t.priority === 'medium').length },
              { id: 'low', label: 'Low Priority', count: todos.filter(t => t.priority === 'low').length }
            ].map(filterOption => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={`badge ${filter === filterOption.id ? 'badge-primary' : 'badge-neutral'} transition-all duration-200 hover:scale-105`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setIsAdding(true)}
            className="btn-primary flex items-center space-x-2 flex-shrink-0"
          >
            <span>+</span>
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="card slide-in">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white">+</span>
            </div>
            <h2 className="heading-4">Create New Task</h2>
          </div>
          
          <form onSubmit={handleAddTodo} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Task Title *</label>
                <input
                  type="text"
                  value={newTodo.text}
                  onChange={(e) => setNewTodo({ ...newTodo, text: e.target.value })}
                  className="input-field"
                  placeholder="What needs to be done?"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Priority</label>
                <select
                  value={newTodo.priority}
                  onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
                  className="select-field"
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
                <input
                  type="text"
                  value={newTodo.category}
                  onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value })}
                  className="input-field"
                  placeholder="e.g., work, personal, project..."
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                <textarea
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  className="textarea-field"
                  rows="3"
                  placeholder="Add more details about this task..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                <span className="mr-2">✨</span>
                Create Task
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewTodo({ text: '', description: '', priority: 'medium', category: '' });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredTodos.length > 0 ? (
        <div className="space-y-4">
          {filteredTodos.map((todo, index) => (
            <div 
              key={todo.id}
              className={`card-interactive group ${todo.status === 'completed' ? 'opacity-75' : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start space-x-4">
                <button
                  onClick={() => handleToggleStatus(todo.id, todo.status)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 mt-1 ${
                    todo.status === 'completed'
                      ? 'bg-success-500 border-success-500 text-white'
                      : 'border-neutral-300 hover:border-success-400 hover:bg-success-50'
                  }`}
                >
                  {todo.status === 'completed' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-semibold text-neutral-800 ${todo.status === 'completed' ? 'line-through text-neutral-500' : 'group-hover:text-primary-600'} transition-colors`}>
                      {todo.title}
                    </h3>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="text-neutral-400 hover:text-error-500 transition-colors p-1 rounded opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  {todo.description && (
                    <p className={`text-sm text-neutral-600 mb-3 ${todo.status === 'completed' ? 'line-through' : ''}`}>
                      {todo.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <span className={`badge ${getPriorityBadgeColor(todo.priority)} flex items-center space-x-1`}>
                      <span>{getPriorityIcon(todo.priority)}</span>
                      <span className="capitalize">{todo.priority}</span>
                    </span>
                    
                    {todo.category && (
                      <span className="badge badge-neutral">
                        {todo.category}
                      </span>
                    )}
                    
                    <span className="text-xs text-neutral-400 flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(todo.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-neutral-400">✅</span>
          </div>
          <h3 className="heading-4 text-neutral-600 mb-2">
            {filter !== 'all' ? `No ${filter} tasks found` : 'No tasks yet'}
          </h3>
          <p className="text-neutral-500 mb-6 max-w-md mx-auto">
            {filter !== 'all' 
              ? 'Try adjusting your filter or create a new task'
              : 'Start organizing your work by creating your first task'
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setIsAdding(true)}
              className="btn-primary"
            >
              <span className="mr-2">🚀</span>
              Create Your First Task
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Todos;
