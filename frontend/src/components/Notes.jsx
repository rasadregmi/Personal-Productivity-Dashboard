import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', category: '' });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes`);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newNote,
          createdAt: new Date().toISOString(),
          category: newNote.category || 'general'
        })
      });
      
      if (response.ok) {
        setNewNote({ title: '', content: '', category: '' });
        setIsAdding(false);
        fetchNotes();
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await fetch(`${API_BASE_URL}/notes/${id}`, { method: 'DELETE' });
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesFilter = filter === 'all' || note.category === filter;
    const matchesSearch = searchTerm === '' || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = [...new Set(notes.map(note => note.category))];

  const getCategoryIcon = (category) => {
    const icons = {
      'work': '💼',
      'personal': '👤',
      'ideas': '💡',
      'general': '📄',
      'study': '📚',
      'project': '🚀',
      'meeting': '👥'
    };
    return icons[category.toLowerCase()] || '📝';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'work': 'from-blue-500 to-blue-600',
      'personal': 'from-green-500 to-green-600',
      'ideas': 'from-yellow-500 to-yellow-600',
      'general': 'from-gray-500 to-gray-600',
      'study': 'from-purple-500 to-purple-600',
      'project': 'from-red-500 to-red-600',
      'meeting': 'from-indigo-500 to-indigo-600'
    };
    return colors[category.toLowerCase()] || 'from-neutral-500 to-neutral-600';
  };

  return (
    <div className="space-y-6">
      <div className="card-premium">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-soft">
              <span className="text-xl text-white">📝</span>
            </div>
            <div>
              <h1 className="heading-2">Notes</h1>
              <p className="text-subtitle">Capture and organize your thoughts</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <span>+</span>
            <span>Create Note</span>
          </button>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-neutral-700 mb-2">Search Notes</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
                placeholder="Search by title or content..."
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">Filter by Category</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`badge ${filter === 'all' ? 'badge-primary' : 'badge-neutral'} transition-all duration-200 hover:scale-105`}
              >
                All ({notes.length})
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`badge ${filter === category ? 'badge-primary' : 'badge-neutral'} transition-all duration-200 hover:scale-105 flex items-center space-x-1`}
                >
                  <span>{getCategoryIcon(category)}</span>
                  <span>{category} ({notes.filter(n => n.category === category).length})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="card slide-in">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white">+</span>
            </div>
            <h2 className="heading-4">Create New Note</h2>
          </div>
          <form onSubmit={handleAddNote} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="input-field"
                  placeholder="Enter a descriptive title..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
                <input
                  type="text"
                  value={newNote.category}
                  onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                  className="input-field"
                  placeholder="e.g., work, personal, ideas..."
                  list="categories"
                />
                <datalist id="categories">
                  {categories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                  <option value="work" />
                  <option value="personal" />
                  <option value="ideas" />
                  <option value="study" />
                  <option value="project" />
                  <option value="meeting" />
                </datalist>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Content *</label>
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="textarea-field"
                rows="6"
                placeholder="Write your note content here..."
                required
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                <span className="mr-2">💾</span>
                Save Note
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewNote({ title: '', content: '', category: '' });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note, index) => (
            <div 
              key={note.id} 
              className="card-interactive group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 bg-gradient-to-br ${getCategoryColor(note.category)} rounded-lg flex items-center justify-center flex-shrink-0 shadow-soft group-hover:shadow-medium transition-all duration-300`}>
                    <span className="text-sm text-white">{getCategoryIcon(note.category)}</span>
                  </div>
                  <h3 className="font-semibold text-neutral-800 truncate group-hover:text-primary-600 transition-colors">
                    {note.title}
                  </h3>
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-neutral-400 hover:text-error-500 transition-colors p-1 rounded opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center space-x-3 mb-4">
                <span className="badge badge-neutral text-xs">
                  {note.category}
                </span>
                <span className="text-xs text-neutral-500 flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </span>
              </div>
              
              <p className="text-neutral-600 text-sm leading-relaxed line-clamp-4 mb-4">
                {note.content}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <span className="text-xs text-neutral-400">
                  {note.content.length} characters
                </span>
                <div className="flex items-center text-xs text-neutral-400">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Click to view</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-neutral-400">📝</span>
          </div>
          <h3 className="heading-4 text-neutral-600 mb-2">
            {searchTerm || filter !== 'all' ? 'No matching notes found' : 'No notes yet'}
          </h3>
          <p className="text-neutral-500 mb-6 max-w-md mx-auto">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start building your knowledge base by creating your first note'
            }
          </p>
          {(!searchTerm && filter === 'all') && (
            <button
              onClick={() => setIsAdding(true)}
              className="btn-primary"
            >
              <span className="mr-2">✨</span>
              Create Your First Note
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Notes;
