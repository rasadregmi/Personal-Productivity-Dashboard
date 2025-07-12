const getWordCount = (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const lines = text.split('\n').length;
  const readingTime = Math.ceil(words / 200); 

  res.json({
    words,
    characters,
    charactersNoSpaces,
    lines,
    readingTime
  });
};

const convertCase = (req, res) => {
  const { text, caseType } = req.body;
  
  if (!text || !caseType) {
    return res.status(400).json({ error: 'Text and caseType are required' });
  }

  let convertedText;
  
  switch (caseType) {
    case 'uppercase':
      convertedText = text.toUpperCase();
      break;
    case 'lowercase':
      convertedText = text.toLowerCase();
      break;
    case 'title':
      convertedText = text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
      break;
    case 'sentence':
      convertedText = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      break;
    default:
      return res.status(400).json({ error: 'Invalid case type' });
  }

  res.json({ convertedText });
};

const removeDuplicates = (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const lines = text.split('\n');
  const uniqueLines = [...new Set(lines)];
  const processedText = uniqueLines.join('\n');

  res.json({
    originalLineCount: lines.length,
    uniqueLineCount: uniqueLines.length,
    processedText
  });
};

const sortLines = (req, res) => {
  const { text, order = 'asc' } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const lines = text.split('\n');
  const sortedLines = order === 'desc' 
    ? lines.sort().reverse() 
    : lines.sort();
  
  const processedText = sortedLines.join('\n');

  res.json({
    originalLineCount: lines.length,
    sortOrder: order,
    processedText
  });
};

const findReplace = (req, res) => {
  const { text, find, replace, caseSensitive = false } = req.body;
  
  if (!text || !find) {
    return res.status(400).json({ error: 'Text and find string are required' });
  }

  const flags = caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
  const processedText = text.replace(regex, replace || '');
  const matches = (text.match(regex) || []).length;

  res.json({
    originalText: text,
    processedText,
    replacements: matches,
    findString: find,
    replaceString: replace || ''
  });
};

module.exports = {
  getWordCount,
  convertCase,
  removeDuplicates,
  sortLines,
  findReplace
};
