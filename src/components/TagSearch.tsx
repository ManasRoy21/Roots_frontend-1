import React, { useState, useEffect, useRef } from 'react';
import './TagSearch.scss';

interface SearchResult {
  id: string;
  firstName: string;
  lastName: string;
}

interface TagSearchProps {
  onSearch: (query: string) => void;
  results?: SearchResult[];
  onSelect: (resultId: string) => void;
  selectedTags?: SearchResult[];
  placeholder?: string;
}

const TagSearch: React.FC<TagSearchProps> = ({ 
  onSearch, 
  results = [], 
  onSelect, 
  selectedTags = [], 
  placeholder = 'Search family members...' 
}) => {
  const [query, setQuery] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (query.trim()) {
      const timer = setTimeout(() => {
        onSearch(query);
        setShowDropdown(true);
      }, 300);
      setDebounceTimer(timer);
    } else {
      setShowDropdown(false);
    }

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [query, onSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (result: SearchResult) => {
    onSelect(result.id);
    setQuery('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleRemove = (tagId: string) => {
    // Find the tag to remove
    const tagToRemove = selectedTags.find(tag => tag.id === tagId);
    if (tagToRemove) {
      onSelect(tagId); // Toggle off
    }
  };

  // Filter out already selected tags from results
  const filteredResults = results.filter(
    result => !selectedTags.some(tag => tag.id === result.id)
  );

  const handleKeyDown = (result: SearchResult) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(result);
    }
  };

  return (
    <div className="tag-search-wrapper">
      <div className="tag-search-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="tag-search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim() && filteredResults.length > 0) {
              setShowDropdown(true);
            }
          }}
          aria-label="Search for family members to tag"
          aria-autocomplete="list"
          aria-controls="tag-search-dropdown"
          aria-expanded={showDropdown}
          role="combobox"
        />
        {showDropdown && query.trim() && (
          <div ref={dropdownRef} id="tag-search-dropdown" className="tag-search-dropdown" role="listbox">
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <div
                  key={result.id}
                  className="tag-search-result"
                  onClick={() => handleSelect(result)}
                  onKeyDown={handleKeyDown(result)}
                  role="option"
                  tabIndex={0}
                  aria-label={`Tag ${result.firstName} ${result.lastName}`}
                >
                  <div className="tag-search-result-name">
                    {result.firstName} {result.lastName}
                  </div>
                </div>
              ))
            ) : (
              <div className="tag-search-no-results" role="status">
                No family members found
              </div>
            )}
          </div>
        )}
      </div>
      {selectedTags.length > 0 && (
        <div className="tag-search-tags" role="list" aria-label="Tagged family members">
          {selectedTags.map((tag) => (
            <div key={tag.id} className="tag-search-tag" role="listitem">
              <span>{tag.firstName} {tag.lastName}</span>
              <button
                type="button"
                className="tag-search-tag-remove"
                onClick={() => handleRemove(tag.id)}
                aria-label={`Remove ${tag.firstName} ${tag.lastName}`}
              >
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path 
                    d="M9 3L3 9M3 3L9 9" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagSearch;