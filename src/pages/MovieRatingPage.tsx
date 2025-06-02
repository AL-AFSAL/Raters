import React, { useState } from 'react';
import { useMovie } from '../contexts/MovieContext';
import MovieGrid from '../components/movies/MovieGrid';
import SearchBar from '../components/filters/SearchBar';
import FiltersPanel from '../components/filters/FiltersPanel';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FilterOptions } from '../components/filters/FiltersPanel';

const MovieRatingPage: React.FC = () => {
  const { topRatedMovies, loading, error, rateMovie } = useMovie();
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    genres: [],
    yearRange: [1900, new Date().getFullYear()],
    ratingRange: [0, 5],
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
    setIsFiltersPanelOpen(false);
  };

  const handleClearFilters = () => {
    setActiveFilters({
      genres: [],
      yearRange: [1900, new Date().getFullYear()],
      ratingRange: [0, 5],
    });
  };

  const filteredMovies = topRatedMovies.filter(movie => {
    // Search filter
    if (searchQuery && !movie.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Genre filter
    if (activeFilters.genres.length > 0 && !movie.genres?.some(genre => 
      activeFilters.genres.includes(genre.id)
    )) {
      return false;
    }

    // Year filter
    const movieYear = new Date(movie.release_date).getFullYear();
    if (movieYear < activeFilters.yearRange[0] || movieYear > activeFilters.yearRange[1]) {
      return false;
    }

    // Rating filter
    const movieRating = movie.vote_average / 2; // Convert to 5-star scale
    if (movieRating < activeFilters.ratingRange[0] || movieRating > activeFilters.ratingRange[1]) {
      return false;
    }

    return true;
  });

  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="text-center text-error">
          <p className="text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-background py-8">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-8">Rate Movies</h1>
          <p className="text-text-secondary mb-8">
            Discover and rate your favorite movies. Your ratings help others find great films to watch!
          </p>
          
          <SearchBar 
            onSearch={handleSearch}
            onToggleFilters={() => setIsFiltersPanelOpen(!isFiltersPanelOpen)}
            filtersActive={isFiltersPanelOpen}
          />
          
          <FiltersPanel
            isOpen={isFiltersPanelOpen}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            initialFilters={activeFilters}
          />
        </div>
      </div>

      <div className="container-custom py-8">
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {filteredMovies.length} Movies Found
              </h2>
            </div>
            <MovieGrid 
              movies={filteredMovies}
              onRate={rateMovie}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MovieRatingPage;