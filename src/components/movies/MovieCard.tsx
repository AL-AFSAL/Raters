import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users } from 'lucide-react';
import StarRating from '../ui/StarRating';
import { Movie } from '../../types/movie';
import { useAuth } from '../../contexts/AuthContext';

interface MovieCardProps {
  movie: Movie;
  onRate?: (movieId: number, rating: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onRate }) => {
  const { isAuthenticated } = useAuth();

  const handleRating = (rating: number) => {
    if (onRate && isAuthenticated) {
      onRate(movie.id, rating);
    }
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = 'https://via.placeholder.com/500x750?text=No+Image';
  };

  return (
    <div className="card group h-full flex flex-col animate-fadeIn">
      <div className="relative overflow-hidden aspect-[2/3]">
        <Link to={`/movie/${movie.id}`}>
          <img
            src={movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
              : 'https://via.placeholder.com/500x750?text=No+Image'
            }
            alt={`${movie.title} Poster`}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 w-full">
              <p className="text-text-primary font-medium line-clamp-2">{movie.overview}</p>
            </div>
          </div>
        </Link>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <Link to={`/movie/${movie.id}`}>
          <h3 className="text-lg font-semibold text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
        </Link>
        <div className="flex items-center text-text-secondary text-sm mt-2 space-x-3">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{movie.release_date?.slice(0, 4) || 'N/A'}</span>
          </div>
          {movie.runtime && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatRuntime(movie.runtime)}</span>
            </div>
          )}
          {movie.user_ratings && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{movie.user_ratings.length}</span>
            </div>
          )}
        </div>
        <div className="mt-2">
          <p className="text-sm text-text-secondary">
            Directed by {movie.director}
          </p>
        </div>
        <div className="mt-auto pt-4 space-y-2">
          {typeof movie.average_rating !== 'undefined' && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Average Rating:</span>
              <StarRating 
                initialRating={movie.average_rating} 
                readOnly
                size="sm"
                showPercentage
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              {isAuthenticated ? 'Your Rating:' : 'Login to Rate'}
            </span>
            <StarRating 
              initialRating={movie.user_rating || 0} 
              onChange={handleRating}
              readOnly={!isAuthenticated}
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;