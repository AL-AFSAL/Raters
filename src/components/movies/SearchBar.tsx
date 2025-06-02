import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onToggleFilters: () => void;
  filtersActive: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onToggleFilters, filtersActive }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="sticky top-20 z-20 bg-background/95 backdrop-blur-sm py-4">
      <div className="container-custom">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-text-secondary" />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for movies..."
              value={searchTerm}
              onChange={handleChange}
              className="input pl-10 pr-10 w-full"
            />
            {searchTerm && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X className="h-5 w-5 text-text-secondary hover:text-text-primary" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onToggleFilters}
            className={`btn-secondary flex items-center gap-2 ${
              filtersActive ? 'border-primary text-primary' : ''
            }`}
            aria-expanded={filtersActive}
            aria-controls="filters-panel"
          >
            <Filter className="h-5 w-5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;