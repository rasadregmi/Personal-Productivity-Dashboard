import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:4000/api';

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchRandomQuote();
    fetchCategoryQuotes('motivation');
  }, []);

  const fetchRandomQuote = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/quotes?random=true`);
      const quote = await response.json();
      setCurrentQuote(quote);
    } catch (error) {
      console.error('Error fetching random quote:', error);
    }
  };

  const fetchCategoryQuotes = async (category) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quotes/category/${category}`);
      const categoryQuotes = await response.json();
      setQuotes(categoryQuotes);
      
      const uniqueCategories = [...new Set(categoryQuotes.map(q => q.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching category quotes:', error);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      fetchCategoryQuotes('motivation'); 
    } else {
      fetchCategoryQuotes(category);
    }
  };

  const toggleFavorite = (quote) => {
    const isFavorite = favorites.some(fav => fav.id === quote.id);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== quote.id));
    } else {
      setFavorites([...favorites, quote]);
    }
  };

  const isFavorite = (quote) => {
    return favorites.some(fav => fav.id === quote.id);
  };

  const shareQuote = (quote) => {
    if (navigator.share) {
      navigator.share({
        title: 'Inspirational Quote',
        text: `"${quote.text}" - ${quote.author}`,
      });
    } else {
      navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'motivation': '🚀',
      'success': '🏆',
      'life': '🌟',
      'wisdom': '🧠',
      'love': '❤️',
      'friendship': '👫',
      'business': '💼',
      'sports': '⚽',
      'education': '📚',
      'happiness': '😊'
    };
    return icons[category] || '💭';
  };

  const predefinedCategories = ['motivation', 'success', 'life', 'wisdom', 'love', 'friendship', 'business', 'sports'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">💭 Inspirational Quotes</h1>
        <button
          onClick={fetchRandomQuote}
          className="btn-primary"
        >
          🎲 Random Quote
        </button>
      </div>

      {currentQuote && (
        <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-l-4 border-primary-500">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">✨ Quote of the Moment</h2>
            <blockquote className="text-2xl font-medium text-gray-800 italic mb-4 leading-relaxed">
              "{currentQuote.text}"
            </blockquote>
            <p className="text-lg text-gray-600 mb-4">— {currentQuote.author}</p>
            <div className="flex items-center justify-center space-x-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800`}>
                {getCategoryIcon(currentQuote.category)} {currentQuote.category}
              </span>
              <button
                onClick={() => toggleFavorite(currentQuote)}
                className={`text-2xl ${isFavorite(currentQuote) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              >
                {isFavorite(currentQuote) ? '❤️' : '🤍'}
              </button>
              <button
                onClick={() => shareQuote(currentQuote)}
                className="text-2xl text-gray-400 hover:text-blue-500"
              >
                📤
              </button>
              <button
                onClick={fetchRandomQuote}
                className="btn-secondary text-sm"
              >
                🔄 New Quote
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            selectedCategory === 'all'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Categories
        </button>
        {predefinedCategories.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
              selectedCategory === category
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {getCategoryIcon(category)} {category}
          </button>
        ))}
      </div>

      {favorites.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">❤️ Your Favorites</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.map((quote) => (
              <div key={`fav-${quote.id}`} className="p-4 bg-red-50 rounded-lg border border-red-200">
                <blockquote className="text-gray-800 italic mb-2">
                  "{quote.text}"
                </blockquote>
                <p className="text-gray-600 text-sm mb-2">— {quote.author}</p>
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                    {getCategoryIcon(quote.category)} {quote.category}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => shareQuote(quote)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      📤
                    </button>
                    <button
                      onClick={() => toggleFavorite(quote)}
                      className="text-red-500 hover:text-red-700"
                    >
                      💔
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quotes.map((quote) => (
          <div key={quote.id} className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
              <span className="inline-block px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                {getCategoryIcon(quote.category)} {quote.category}
              </span>
              <button
                onClick={() => toggleFavorite(quote)}
                className={`text-xl ${isFavorite(quote) ? 'text-red-500' : 'text-gray-300 hover:text-red-500'}`}
              >
                {isFavorite(quote) ? '❤️' : '🤍'}
              </button>
            </div>
            
            <blockquote className="text-gray-800 font-medium leading-relaxed mb-3 italic">
              "{quote.text}"
            </blockquote>
            
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">— {quote.author}</p>
              <button
                onClick={() => shareQuote(quote)}
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                📤
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Your Quote Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{favorites.length}</div>
            <div className="text-sm text-blue-800">Favorite Quotes</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{quotes.length}</div>
            <div className="text-sm text-green-800">Quotes Viewed</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
            <div className="text-sm text-purple-800">Categories Explored</div>
          </div>
        </div>
      </div>

      {quotes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💭</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No quotes in this category</h3>
          <p className="text-gray-500 mb-4">Try a different category or get a random quote</p>
          <button
            onClick={fetchRandomQuote}
            className="btn-primary"
          >
            Get Random Quote
          </button>
        </div>
      )}
    </div>
  );
};

export default Quotes;