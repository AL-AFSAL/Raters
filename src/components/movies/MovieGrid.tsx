import React from 'react';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';
import { Movie } from '../../types/movie';

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  onRate?: (movieId: number, rating: number) => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({ 
  movies, 
  loading = false,
  onRate
}) => {
  const skeletonCount = 12;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {loading
        ? Array.from({ length: skeletonCount }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))
        : movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onRate={onRate}
            />
          ))}
    </div>
  );
};

export default MovieGrid;