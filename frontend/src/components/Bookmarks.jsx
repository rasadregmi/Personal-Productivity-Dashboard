import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newBookmark, setNewBookmark] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
    tags: ''
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookmarks`);
      const data = await response.json();
      setBookmarks(data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const handleAddBookmark = async (e) => {
    e.preventDefault();
    if (!newBookmark.title.trim() || !newBookmark.url.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/bookmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBookmark,
          createdAt: new Date().toISOString(),
          category: newBookmark.category || 'general',
          tags: newBookmark.tags ? newBookmark.tags.split(',').map(tag => tag.trim()) : []
        })
      });
      
      if (response.ok) {
        setNewBookmark({ title: '', url: '', description: '', category: '', tags: '' });
        setIsAdding(false);
        fetchBookmarks();
      }
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const handleDeleteBookmark = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/bookmarks/${id}`, { method: 'DELETE' });
      fetchBookmarks();
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  const filteredBookmarks = bookmarks.filter(bookmark => 
    filter === 'all' || bookmark.category === filter
  );

  const categories = [...new Set(bookmarks.map(bookmark => bookmark.category))];

  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch (error) {
      return null;
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'work': '💼',
      'personal': '👤',
      'entertainment': '🎬',
      'education': '📚',
      'news': '📰',
      'shopping': '🛒',
      'social': '👥',
      'tools': '🔧',
      'general': '🔖'
    };
    return icons[category] || '🔖';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">🔖 Bookmarks</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="btn-primary"
        >
          + Add Bookmark
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-md text-sm ${
            filter === 'all' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'
          }`}
        >
          All ({bookmarks.length})
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === category ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {getCategoryIcon(category)} {category} ({bookmarks.filter(b => b.category === category).length})
          </button>
        ))}
      </div>

      {isAdding && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Add New Bookmark</h2>
          <form onSubmit={handleAddBookmark} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newBookmark.title}
                onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
                className="input-field"
                placeholder="Bookmark title..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="url"
                value={newBookmark.url}
                onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
                className="input-field"
                placeholder="https://example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newBookmark.description}
                onChange={(e) => setNewBookmark({ ...newBookmark, description: e.target.value })}
                className="input-field"
                rows="3"
                placeholder="Brief description of the bookmark..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newBookmark.category}
                  onChange={(e) => setNewBookmark({ ...newBookmark, category: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select category</option>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="education">Education</option>
                  <option value="news">News</option>
                  <option value="shopping">Shopping</option>
                  <option value="social">Social</option>
                  <option value="tools">Tools</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={newBookmark.tags}
                  onChange={(e) => setNewBookmark({ ...newBookmark, tags: e.target.value })}
                  className="input-field"
                  placeholder="tag1, tag2, tag3..."
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">Save Bookmark</button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookmarks.map((bookmark) => (
          <div key={bookmark.id} className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1">
                <img
                  src={getFaviconUrl(bookmark.url)}
                  alt=""
                  className="w-6 h-6"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <h3 className="text-lg font-semibold text-gray-900 truncate">{bookmark.title}</h3>
              </div>
              <button
                onClick={() => handleDeleteBookmark(bookmark.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                🗑️
              </button>
            </div>
            
            {bookmark.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{bookmark.description}</p>
            )}
            
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-800 text-sm truncate block mb-3"
            >
              {bookmark.url}
            </a>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                  {getCategoryIcon(bookmark.category)} {bookmark.category}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(bookmark.createdAt).toLocaleDateString()}
                </span>
              </div>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs py-1 px-2"
              >
                Visit
              </a>
            </div>
            
            {bookmark.tags && bookmark.tags.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex flex-wrap gap-1">
                  {bookmark.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredBookmarks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔖</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No bookmarks yet' : `No bookmarks in ${filter}`}
          </h3>
          <p className="text-gray-500 mb-4">
            {filter === 'all' ? 'Save your favorite websites for quick access' : 'Try a different category'}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setIsAdding(true)}
              className="btn-primary"
            >
              Add Bookmark
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
