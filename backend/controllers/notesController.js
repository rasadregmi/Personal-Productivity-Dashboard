const { data, generateId } = require('../utils/dataStore');

const getAllNotes = (req, res) => {
  res.json(data.notes);
};

const createNote = (req, res) => {
  const { title, content, category = 'general', tags = [] } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const note = {
    id: generateId(),
    title,
    content,
    category,
    tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.notes.push(note);
  res.status(201).json(note);
};

const updateNote = (req, res) => {
  const { id } = req.params;
  const { title, content, category, tags } = req.body;
  
  const noteIndex = data.notes.findIndex(note => note.id === id);
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  const updatedNote = {
    ...data.notes[noteIndex],
    ...(title && { title }),
    ...(content && { content }),
    ...(category && { category }),
    ...(tags && { tags }),
    updatedAt: new Date().toISOString()
  };

  data.notes[noteIndex] = updatedNote;
  res.json(updatedNote);
};

const deleteNote = (req, res) => {
  const { id } = req.params;
  const noteIndex = data.notes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  data.notes.splice(noteIndex, 1);
  res.status(204).send();
};

const searchNotes = (req, res) => {
  const { q, category, tag } = req.query;
  let filteredNotes = data.notes;

  if (q) {
    filteredNotes = filteredNotes.filter(note => 
      note.title.toLowerCase().includes(q.toLowerCase()) ||
      note.content.toLowerCase().includes(q.toLowerCase())
    );
  }

  if (category) {
    filteredNotes = filteredNotes.filter(note => note.category === category);
  }

  if (tag) {
    filteredNotes = filteredNotes.filter(note => note.tags.includes(tag));
  }

  res.json(filteredNotes);
};

const getNotesByCategory = (req, res) => {
  const { category } = req.params;
  const filteredNotes = data.notes.filter(note => note.category === category);
  res.json(filteredNotes);
};

const getNoteById = (req, res) => {
  const { id } = req.params;
  const note = data.notes.find(n => n.id === id);
  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }
  res.json(note);
};

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  getNotesByCategory,
  getNoteById
};
