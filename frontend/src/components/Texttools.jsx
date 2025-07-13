import React, { useState } from 'react';

const TextTools = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    lines: 0,
    paragraphs: 0
  });

  const updateStats = (text) => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const lines = text === '' ? 0 : text.split('\n').length;
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim()).length;

    setStats({
      characters,
      charactersNoSpaces,
      words,
      lines,
      paragraphs
    });
  };

  const handleInputChange = (text) => {
    setInputText(text);
    updateStats(text);
  };

  const handleOutputChange = (text) => {
    setOutputText(text);
    setInputText(text);
    updateStats(text);
  };

  const transformText = (operation) => {
    let result = inputText;

    switch (operation) {
      case 'uppercase':
        result = inputText.toUpperCase();
        break;
      case 'lowercase':
        result = inputText.toLowerCase();
        break;
      case 'capitalize':
        result = inputText.replace(/\b\w/g, l => l.toUpperCase());
        break;
      case 'sentence':
        result = inputText.toLowerCase().replace(/(^\w|\.\s+\w)/g, l => l.toUpperCase());
        break;
      case 'reverse':
        result = inputText.split('').reverse().join('');
        break;
      case 'removeSpaces':
        result = inputText.replace(/\s/g, '');
        break;
      case 'removeExtraSpaces':
        result = inputText.replace(/\s+/g, ' ').trim();
        break;
      case 'removeDuplicateLines':
        const lines = inputText.split('\n');
        const uniqueLines = [...new Set(lines)];
        result = uniqueLines.join('\n');
        break;
      case 'sortLines':
        result = inputText.split('\n').sort().join('\n');
        break;
      case 'reverseLines':
        result = inputText.split('\n').reverse().join('\n');
        break;
      case 'addLineNumbers':
        result = inputText.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n');
        break;
      case 'extractEmails':
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const emails = inputText.match(emailRegex) || [];
        result = emails.join('\n');
        break;
      case 'extractUrls':
        const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
        const urls = inputText.match(urlRegex) || [];
        result = urls.join('\n');
        break;
      case 'base64Encode':
        try {
          result = btoa(inputText);
        } catch (error) {
          result = 'Error: Unable to encode to Base64';
        }
        break;
      case 'base64Decode':
        try {
          result = atob(inputText);
        } catch (error) {
          result = 'Error: Invalid Base64 string';
        }
        break;
      case 'urlEncode':
        result = encodeURIComponent(inputText);
        break;
      case 'urlDecode':
        try {
          result = decodeURIComponent(inputText);
        } catch (error) {
          result = 'Error: Invalid URL-encoded string';
        }
        break;
      case 'htmlEncode':
        result = inputText
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
        break;
      case 'htmlDecode':
        result = inputText
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
        break;
      case 'slugify':
        result = inputText
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        break;
      default:
        result = inputText;
    }

    setOutputText(result);
    return result;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    updateStats('');
  };

  const swapTexts = () => {
    const temp = inputText;
    handleInputChange(outputText);
    setOutputText(temp);
  };

  const toolCategories = [
    {
      name: 'Case Conversion',
      tools: [
        { id: 'uppercase', name: 'UPPERCASE', icon: '🔤' },
        { id: 'lowercase', name: 'lowercase', icon: '🔡' },
        { id: 'capitalize', name: 'Capitalize Words', icon: '🅰️' },
        { id: 'sentence', name: 'Sentence case', icon: '📝' }
      ]
    },
    {
      name: 'Text Manipulation',
      tools: [
        { id: 'reverse', name: 'Reverse Text', icon: '🔄' },
        { id: 'removeSpaces', name: 'Remove All Spaces', icon: '🚫' },
        { id: 'removeExtraSpaces', name: 'Remove Extra Spaces', icon: '✂️' },
        { id: 'slugify', name: 'Create URL Slug', icon: '🔗' }
      ]
    },
    {
      name: 'Line Operations',
      tools: [
        { id: 'removeDuplicateLines', name: 'Remove Duplicate Lines', icon: '🗑️' },
        { id: 'sortLines', name: 'Sort Lines A-Z', icon: '📊' },
        { id: 'reverseLines', name: 'Reverse Line Order', icon: '🔃' },
        { id: 'addLineNumbers', name: 'Add Line Numbers', icon: '🔢' }
      ]
    },
    {
      name: 'Extract Data',
      tools: [
        { id: 'extractEmails', name: 'Extract Email Addresses', icon: '📧' },
        { id: 'extractUrls', name: 'Extract URLs', icon: '🌐' }
      ]
    },
    {
      name: 'Encoding/Decoding',
      tools: [
        { id: 'base64Encode', name: 'Base64 Encode', icon: '🔐' },
        { id: 'base64Decode', name: 'Base64 Decode', icon: '🔓' },
        { id: 'urlEncode', name: 'URL Encode', icon: '🌍' },
        { id: 'urlDecode', name: 'URL Decode', icon: '🗺️' },
        { id: 'htmlEncode', name: 'HTML Encode', icon: '🏷️' },
        { id: 'htmlDecode', name: 'HTML Decode', icon: '📄' }
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">🛠️ Text Tools</h1>
        <div className="flex space-x-2">
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
          >
            🗑️ Clear All
          </button>
          <button
            onClick={swapTexts}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium"
          >
            🔄 Swap
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">📊 Text Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.characters}</div>
            <div className="text-sm text-blue-700">Characters</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.charactersNoSpaces}</div>
            <div className="text-sm text-green-700">No Spaces</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.words}</div>
            <div className="text-sm text-purple-700">Words</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.lines}</div>
            <div className="text-sm text-orange-700">Lines</div>
          </div>
          <div className="text-center p-3 bg-pink-50 rounded-lg">
            <div className="text-2xl font-bold text-pink-600">{stats.paragraphs}</div>
            <div className="text-sm text-pink-700">Paragraphs</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">📝 Input Text</h2>
            <button
              onClick={() => copyToClipboard(inputText)}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded"
              disabled={!inputText}
            >
              📋 Copy
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter your text here to transform it..."
            className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">✨ Output Text</h2>
            <button
              onClick={() => copyToClipboard(outputText)}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded"
              disabled={!outputText}
            >
              📋 Copy
            </button>
          </div>
          <textarea
            value={outputText}
            onChange={(e) => handleOutputChange(e.target.value)}
            placeholder="Transformed text will appear here..."
            className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-6">
        {toolCategories.map((category) => (
          <div key={category.name} className="card">
            <h3 className="text-lg font-semibold mb-4">{category.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {category.tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => transformText(tool.id)}
                  disabled={!inputText}
                  className="p-3 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-left transition-colors"
                >
                  <div className="text-lg mb-1">{tool.icon}</div>
                  <div className="text-sm font-medium">{tool.name}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">💡 Quick Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="font-medium text-blue-800 mb-1">🚀 Productivity Tip</div>
            <div className="text-blue-700">Use the "Swap" button to quickly move output back to input for further processing.</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="font-medium text-green-800 mb-1">📋 Copy & Paste</div>
            <div className="text-green-700">Click the copy buttons to quickly copy text to your clipboard.</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="font-medium text-purple-800 mb-1">🔗 URL Slugs</div>
            <div className="text-purple-700">Convert titles to URL-friendly slugs for websites and blogs.</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <div className="font-medium text-orange-800 mb-1">📧 Data Extraction</div>
            <div className="text-orange-700">Extract emails and URLs from large text blocks automatically.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextTools;
