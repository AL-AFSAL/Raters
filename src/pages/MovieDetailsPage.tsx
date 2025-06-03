import React from 'react';
import { useParams } from 'react-router-dom';
import { useMovie } from '../contexts/MovieContext';
import FeaturedMovieCard from '../components/movies/FeaturedMovieCard';
import RatingSection from '../components/ratings/RatingSection';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams();
  const { topRatedMovies, loading, error, rateMovie } = useMovie();

  if (loading) {
    return (
      <div className="container-custom py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-8 text-center text-error">
        <p>{error}</p>
      </div>
    );
  }

  const movie = topRatedMovies.find(m => m.id === Number(id));

  if (!movie) {
    return (
      <div className="container-custom py-8 text-center text-error">
        <p>Movie not found</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <FeaturedMovieCard movie={movie} onRate={rateMovie} />
      <div className="mt-12">
        <RatingSection movieId={movie.id} initialRating={movie.user_rating} />
      </div>
    </div>
  );
};

export default MovieDetailsPage;