import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import GenreFilter from './GenreFilter';
import YearRangeFilter from './YearRangeFilter';
import RatingRangeFilter from './RatingRangeFilter';

export interface FilterOptions {
  genres: number[];
  yearRange: [number, number];
  ratingRange: [number, number];
}

interface FiltersPanelProps {
  isOpen: boolean;
  onApplyFilters: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  initialFilters?: FilterOptions;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  isOpen,
  onApplyFilters,
  onClearFilters,
  initialFilters,
}) => {
  const currentYear = new Date().getFullYear();
  
  const [filters, setFilters] = useState<FilterOptions>(initialFilters || {
    genres: [],
    yearRange: [1900, currentYear],
    ratingRange: [0, 5],
  });

  const handleGenreChange = (selectedGenres: number[]) => {
    setFilters({
      ...filters,
      genres: selectedGenres,
    });
  };

  const handleYearRangeChange = (range: [number, number]) => {
    setFilters({
      ...filters,
      yearRange: range,
    });
  };

  const handleRatingRangeChange = (range: [number, number]) => {
    setFilters({
      ...filters,
      ratingRange: range,
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      genres: [],
      yearRange: [1900, currentYear],
      ratingRange: [0, 5],
    };
    
    setFilters(defaultFilters);
    onClearFilters();
  };

  return (
    <div 
      id="filters-panel"
      className={`bg-card border border-border rounded-lg shadow-lg transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0'
      }`}
    >
      {isOpen && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-text-primary font-medium mb-4 flex items-center">
                Genres
              </h3>
              <GenreFilter 
                selectedGenres={filters.genres}
                onChange={handleGenreChange}
              />
            </div>
            
            <div>
              <h3 className="text-text-primary font-medium mb-4 flex items-center">
                Release Year
              </h3>
              <YearRangeFilter 
                range={filters.yearRange}
                min={1900}
                max={currentYear}
                onChange={handleYearRangeChange}
              />
            </div>
            
            <div>
              <h3 className="text-text-primary font-medium mb-4 flex items-center">
                Rating
              </h3>
              <RatingRangeFilter 
                range={filters.ratingRange}
                onChange={handleRatingRangeChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-8 space-x-4">
            <button 
              type="button"
              onClick={handleClearFilters}
              className="btn-secondary"
            >
              Clear Filters
            </button>
            <button 
              type="button"
              onClick={handleApplyFilters}
              className="btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersPanel;