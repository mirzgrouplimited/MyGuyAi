import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Minimize2, Maximize2, RefreshCw, FileImage, Combine, Crop, User } from 'lucide-react';

const TOOLS = [
  { id: 'compress-image', name: 'Compress Image', keywords: ['compress', 'reduce', 'smaller', 'size', 'kb', 'mb', 'shrink'], icon: Minimize2 },
  { id: 'resize-image', name: 'Resize Image', keywords: ['resize', 'dimension', 'width', 'height', 'scale'], icon: Maximize2 },
  { id: 'crop-image', name: 'Crop Image', keywords: ['crop', 'cut', 'trim', 'slice'], icon: Crop },
  { id: 'passport-photo', name: 'Passport Photo Maker', keywords: ['passport', 'visa', 'photo', 'id', '2x2', '35x45', 'headshot', 'identity'], icon: User },
  { id: 'jpg-to-png', name: 'JPG to PNG', keywords: ['jpg', 'jpeg', 'png', 'convert', 'transparent'], icon: RefreshCw },
  { id: 'png-to-jpg', name: 'PNG to JPG', keywords: ['png', 'jpg', 'jpeg', 'convert'], icon: RefreshCw },
  { id: 'image-to-pdf', name: 'Image to PDF', keywords: ['image', 'pdf', 'convert', 'photo', 'document'], icon: FileImage },
  { id: 'compress-pdf', name: 'Compress PDF', keywords: ['compress', 'pdf', 'reduce', 'smaller', 'size'], icon: Minimize2 },
  { id: 'merge-pdf', name: 'Merge PDF', keywords: ['merge', 'combine', 'join', 'pdf', 'multiple'], icon: Combine },
];

export const ToolFinder = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (value) => {
    setQuery(value);
    
    if (value.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const searchTerms = value.toLowerCase().split(' ');
    const matched = TOOLS.filter(tool => {
      const nameMatch = tool.name.toLowerCase().includes(value.toLowerCase());
      const keywordMatch = searchTerms.some(term => 
        tool.keywords.some(kw => kw.includes(term))
      );
      return nameMatch || keywordMatch;
    }).slice(0, 5);

    setResults(matched);
    setShowResults(matched.length > 0);
  };

  return (
    <div className="relative max-w-xl mx-auto" data-testid="tool-finder">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder="What do you want to do? (e.g., compress image, merge pdf)"
          className="w-full pl-12 pr-4 py-4 text-lg border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          data-testid="tool-finder-input"
        />
      </div>

      {/* Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden" data-testid="tool-finder-results">
          {results.map((tool) => (
            <Link
              key={tool.id}
              to={`/${tool.id}`}
              className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors"
              data-testid={`tool-result-${tool.id}`}
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <tool.icon className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-900">{tool.name}</p>
                <p className="text-sm text-slate-500">Click to use this tool</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {['Compress Image', 'JPG to PNG', 'Merge PDF', 'Passport Photo'].map((label) => (
          <Link
            key={label}
            to={`/${label.toLowerCase().replace(/ /g, '-')}`}
            className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-full hover:bg-slate-200 transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};
