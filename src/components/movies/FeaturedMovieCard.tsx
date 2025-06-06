import React from 'react';
import { Star, Clock, Calendar, Award } from 'lucide-react';
import { Movie } from '../../types/movie';
import StarRating from '../ui/StarRating';
import { useAuth } from '../../contexts/AuthContext';

interface FeaturedMovieCardProps {
  movie: Movie;
  onRate?: (movieId: number, rating: number) => void;
}

const FeaturedMovieCard: React.FC<FeaturedMovieCardProps> = ({ movie, onRate }) => {
  const { isAuthenticated } = useAuth();

  const handleRating = (rating: number) => {
    if (onRate && isAuthenticated) {
      onRate(movie.id, rating);
    }
  };

  return (
    <div className="relative w-full max-w-[800px] mx-auto overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
      <div className="absolute inset-0 opacity-30">
        <img
          src={movie.backdrop_path 
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : 'https://via.placeholder.com/1920x1080?text=No+Backdrop+Available'
          }
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/1920x1080?text=No+Backdrop+Available';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
      </div>

      <div className="relative p-8 md:p-12">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 mb-4">
            {movie.title}
          </h1>
          <p className="text-xl italic text-gray-400">
            {movie.overview}
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
              <img
                src={movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : 'https://via.placeholder.com/500x750?text=No+Poster+Available'
                }
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/500x750?text=No+Poster+Available';
                }}
              />
            </div>
          </div>

          <div className="md:col-span-8 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {movie.release_date.split('-')[0]}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  PG-13
                </div>
              </div>

              <p className="text-lg text-gray-300 leading-relaxed">
                {movie.overview}
              </p>

              <div className="space-y-2">
                <p className="text-gray-400">Directed by {movie.director}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 rounded-full bg-gray-700/50 text-gray-300 text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Average Rating</span>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm">
                    ({movie.user_ratings?.length || 0} ratings)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <StarRating
                  initialRating={movie.user_rating || 0}
                  onChange={handleRating}
                  readOnly={!isAuthenticated}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMovieCard;