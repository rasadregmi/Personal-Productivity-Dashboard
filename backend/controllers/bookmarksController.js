const { data, generateId } = require('../utils/dataStore');

const getAllBookmarks = (req, res) => {
  res.json(data.bookmarks);
};

const createBookmark = (req, res) => {
  const { title, url, description, category = 'general', tags = [] } = req.body;
  
  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }

  const bookmark = {
    id: generateId(),
    title,
    url,
    description,
    category,
    tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.bookmarks.push(bookmark);
  res.status(201).json(bookmark);
};

const deleteBookmark = (req, res) => {
  const { id } = req.params;
  const bookmarkIndex = data.bookmarks.findIndex(bookmark => bookmark.id === id);
  
  if (bookmarkIndex === -1) {
    return res.status(404).json({ error: 'Bookmark not found' });
  }

  data.bookmarks.splice(bookmarkIndex, 1);
  res.status(204).send();
};

const getBookmarksByCategory = (req, res) => {
  const { category } = req.params;
  const filtered = data.bookmarks.filter(bookmark => bookmark.category === category);
  res.json(filtered);
};

const searchBookmarks = (req, res) => {
  const { query } = req.query;
  if (!query) return res.json(data.bookmarks);
  
  const results = data.bookmarks.filter(bookmark => 
    bookmark.title.toLowerCase().includes(query.toLowerCase()) ||
    bookmark.description.toLowerCase().includes(query.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(query.toLowerCase()) ||
    bookmark.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );
  res.json(results);
};

const updateBookmark = (req, res) => {
  const { id } = req.params;
  const { title, url, description, category } = req.body;
  const bookmarkIndex = data.bookmarks.findIndex(b => b.id === id);
  
  if (bookmarkIndex === -1) {
    return res.status(404).json({ error: 'Bookmark not found' });
  }
  
  data.bookmarks[bookmarkIndex] = {
    ...data.bookmarks[bookmarkIndex],
    title: title || data.bookmarks[bookmarkIndex].title,
    url: url || data.bookmarks[bookmarkIndex].url,
    description: description || data.bookmarks[bookmarkIndex].description,
    category: category || data.bookmarks[bookmarkIndex].category,
    updatedAt: new Date().toISOString()
  };
  
  res.json(data.bookmarks[bookmarkIndex]);
};

module.exports = {
  getAllBookmarks,
  createBookmark,
  deleteBookmark,
  getBookmarksByCategory,
  searchBookmarks,
  updateBookmark
};
