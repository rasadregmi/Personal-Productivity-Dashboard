const { data, generateId } = require('../utils/dataStore');

const getAllQuotes = (req, res) => {
  if (req.query.random === 'true') {
    const randomIndex = Math.floor(Math.random() * data.quotes.length);
    res.json(data.quotes[randomIndex]);
  } else {
    res.json(data.quotes);
  }
};

const getQuotesByCategory = (req, res) => {
  const { category } = req.params;
  const filtered = data.quotes.filter(quote => quote.category === category);
  res.json(filtered);
};

const createQuote = (req, res) => {
  const { text, author, category = 'general' } = req.body;
  
  if (!text || !author) {
    return res.status(400).json({ error: 'Text and author are required' });
  }

  const quote = {
    id: generateId(),
    text,
    author,
    category,
    createdAt: new Date().toISOString()
  };

  data.quotes.push(quote);
  res.status(201).json(quote);
};

const deleteQuote = (req, res) => {
  const { id } = req.params;
  const quoteIndex = data.quotes.findIndex(quote => quote.id === id);
  
  if (quoteIndex === -1) {
    return res.status(404).json({ error: 'Quote not found' });
  }

  data.quotes.splice(quoteIndex, 1);
  res.status(204).send();
};

const getRandomQuote = (req, res) => {
  if (data.quotes.length === 0) {
    return res.status(404).json({ error: 'No quotes available' });
  }
  const randomIndex = Math.floor(Math.random() * data.quotes.length);
  res.json(data.quotes[randomIndex]);
};

module.exports = {
  getAllQuotes,
  getQuotesByCategory,
  createQuote,
  deleteQuote,
  getRandomQuote
};
