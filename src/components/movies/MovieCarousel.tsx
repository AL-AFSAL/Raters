import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarRating from '../ui/StarRating';
import { Movie } from '../../types/movie';

interface MovieCarouselProps {
  movies: Movie[];
  loading?: boolean;
  title?: string;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ 
  movies, 
  loading = false,
  title
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  const goToNext = () => {
    if (movies.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const goToPrev = () => {
    if (movies.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  };

  const resetAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (!isHovering) {
      intervalRef.current = window.setInterval(goToNext, 5000);
    }
  };

  useEffect(() => {
    resetAutoPlay();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    resetAutoPlay();
  };

  if (loading) {
    return (
      <div className="relative rounded-lg overflow-hidden h-[500px] bg-card">
        <div className="absolute inset-0 animate-pulse bg-gray-700"></div>
      </div>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  const currentMovie = movies[currentIndex];

  return (
    <div 
      className="relative rounded-lg overflow-hidden h-[500px]"
      ref={carouselRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {title && (
        <div className="absolute top-4 left-4 z-10">
          <h2 className="text-xl font-bold text-white bg-background/70 px-4 py-2 rounded-md">
            {title}
          </h2>
        </div>
      )}
      
      {/* Background image */}
      <div className="absolute inset-0 transition-opacity duration-700">
        <img 
          src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
          alt={currentMovie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="w-32 md:w-40 shrink-0 hidden md:block">
              <img 
                src={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`}
                alt={currentMovie.title}
                className="w-full h-auto rounded-md shadow-lg"
              />
            </div>
            <div className="md:flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {currentMovie.title}
              </h2>
              <div className="flex items-center gap-4 mb-3">
                <StarRating initialRating={currentMovie.vote_average / 2} readOnly size="sm" />
                <span className="text-text-secondary">
                  {currentMovie.release_date?.slice(0, 4)}
                </span>
              </div>
              <p className="text-text-primary text-base md:text-lg mb-6 line-clamp-3 md:line-clamp-none">
                {currentMovie.overview}
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                {currentMovie.genres?.map((genre) => (
                  <span 
                    key={genre.id} 
                    className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <Link to={`/movie/${currentMovie.id}`} className="btn-primary">
                  View Details
                </Link>
                <Link to={`/rate`} className="btn-secondary">
                  Rate Movies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {movies.length > 1 && (
        <>
          <button 
            onClick={goToPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/50 hover:bg-background/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous movie"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/50 hover:bg-background/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next movie"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {movies.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-primary w-6' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieCarousel;