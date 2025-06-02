import React from 'react';
import { Link } from 'react-router-dom';
import { useMovie } from '../contexts/MovieContext';
import MovieCarousel from '../components/movies/MovieCarousel';
import MovieGrid from '../components/movies/MovieGrid';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const HomePage: React.FC = () => {
  const { trendingMovies, topRatedMovies, loading, error, rateMovie } = useMovie();

  if (loading) {
    return (
      <div className="container-custom py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
      {/* Hero Section with Trending Movies */}
      <section className="mb-12">
        <MovieCarousel 
          movies={trendingMovies} 
          title="Trending This Week"
        />
      </section>

      {/* CTA Section */}
      <section className="container-custom py-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Share Your Opinion?
        </h2>
        <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
          Join our community of movie enthusiasts and help others discover great films through your ratings and reviews.
        </p>
        <Link to="/rate" className="btn-primary text-lg px-8 py-3">
          Start Rating Movies
        </Link>
      </section>

      {/* Top Rated Movies Section */}
      <section className="container-custom py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Top Rated Movies</h2>
          <Link 
            to="/rate" 
            className="text-primary hover:text-primary/80 transition-colors"
          >
            View All
          </Link>
        </div>
        <MovieGrid 
          movies={topRatedMovies.slice(0, 10)} 
          onRate={rateMovie}
        />
      </section>
    </div>
  );
};

export default HomePage;