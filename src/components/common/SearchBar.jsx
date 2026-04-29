import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const loadRecentSearches = () => {
  try {
    const saved = localStorage.getItem('cm_recent_searches');
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    localStorage.removeItem('cm_recent_searches');
    return [];
  }
};

const SearchBar = ({ placeholder = 'Search products...', onSearch }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState(loadRecentSearches);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (searchQuery) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    let recent = [...recentSearches];
    recent = recent.filter(s => s !== trimmed);
    recent.unshift(trimmed);
    recent = recent.slice(0, 5); 

    setRecentSearches(recent);
    localStorage.setItem('cm_recent_searches', JSON.stringify(recent));
  };

  const handleSearch = (searchQuery) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    saveRecentSearch(trimmed);
    setShowSuggestions(false);
    setQuery('');

    if (onSearch) {
      onSearch(trimmed);
    } else {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion);
  };

  return (
    <div className="search-bar-container" ref={containerRef}>
      <input
        type="text"
        className="search-bar"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
      />
      <button className="search-submit-btn" onClick={() => handleSearch(query)} aria-label="Search">
        <i className="fas fa-search"></i>
      </button>

      {showSuggestions && recentSearches.length > 0 && (
        <div className="search-suggestions">
          <div className="suggestion-section">Recent Searches</div>
          {recentSearches.map((search, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(search)}
            >
              <i className="fas fa-history"></i>
              {search}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
