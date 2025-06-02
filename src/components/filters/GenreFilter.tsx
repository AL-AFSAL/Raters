import React from 'react';

interface GenreFilterProps {
  selectedGenres: number[];
  onChange: (genres: number[]) => void;
}

interface Genre {
  id: number;
  name: string;
}

// Common movie genres with their TMDB IDs
const genres: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

const GenreFilter: React.FC<GenreFilterProps> = ({ selectedGenres, onChange }) => {
  const handleGenreToggle = (genreId: number) => {
    const updatedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    
    onChange(updatedGenres);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {genres.map((genre) => {
        const isSelected = selectedGenres.includes(genre.id);
        
        return (
          <div key={genre.id} className="flex items-center">
            <input
              type="checkbox"
              id={`genre-${genre.id}`}
              checked={isSelected}
              onChange={() => handleGenreToggle(genre.id)}
              className="sr-only peer"
            />
            <label
              htmlFor={`genre-${genre.id}`}
              className={`
                cursor-pointer text-sm px-3 py-1.5 rounded-md w-full 
                transition-colors duration-200 flex items-center
                ${isSelected 
                  ? 'bg-primary/20 text-primary border-primary' 
                  : 'bg-card hover:bg-card/80 text-text-secondary border-transparent'
                }
                border
              `}
            >
              <span className="truncate">{genre.name}</span>
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default GenreFilter;