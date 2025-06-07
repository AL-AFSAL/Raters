import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Undo2, Redo2, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { useRatingStore } from '../../stores/ratingStore';
import { useAuth } from '../../contexts/AuthContext';
import StarRating from '../ui/StarRating';
import toast from 'react-hot-toast';

interface RatingSectionProps {
  movieId: number;
  initialRating?: number;
}

const reviewSchema = z.object({
  content: z.string()
    .min(10, 'Review must be at least 10 characters long')
    .max(1000, 'Review cannot exceed 1000 characters'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const RatingSection: React.FC<RatingSectionProps> = ({ movieId, initialRating = 0 }) => {
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const {
    ratings,
    reviews,
    addReview,
    updateReview,
    deleteReview,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useRatingStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  // Remove the problematic system status check
  useEffect(() => {
    // Simple initialization without external system checks
    setHasError(false);
  }, [movieId]);

  const movieRatings = ratings.filter(r => r.movieId === movieId);
  const movieReviews = reviews.filter(r => r.movieId === movieId);
  const averageRating = movieRatings.length
    ? movieRatings.reduce((acc, curr) => acc + curr.rating, 0) / movieRatings.length
    : initialRating || 0;

  const onSubmitReview = async (data: ReviewFormData) => {
    try {
      setIsLoading(true);

      if (!isAuthenticated) {
        toast.error('Please sign in to review movies');
        return;
      }

      if (data.content.length < 10) {
        toast.error('Review must be at least 10 characters long');
        return;
      }

      if (isEditing) {
        await updateReview(isEditing, data.content);
        toast.success('Review updated successfully!');
      } else {
        await addReview(movieId, data.content, averageRating);
        toast.success('Review added successfully!');
      }

      reset();
      setIsEditing(null);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      if (window.confirm('Are you sure you want to delete this review?')) {
        await deleteReview(id);
        toast.success('Review deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review. Please try again.');
    }
  };

  const handleRetry = () => {
    setHasError(false);
    window.location.reload();
  };

  const sortedReviews = [...movieReviews].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return b.rating - a.rating;
  });

  // Show error state only if there's a critical error
  if (hasError) {
    return (
      <div className="bg-error/10 border border-error rounded-lg p-6 text-error">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-lg font-semibold">System Error</h2>
        </div>
        <p>Unable to load the rating system. Please try again later.</p>
        <button
          onClick={handleRetry}
          className="mt-4 px-4 py-2 bg-error text-white rounded-md hover:bg-error/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Average Rating Display */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Movie Rating</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <StarRating initialRating={averageRating} readOnly size="lg" />
            <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-text-secondary">
            ({movieRatings.length} {movieRatings.length === 1 ? 'rating' : 'ratings'})
          </span>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Reviews</h2>
          {sortedReviews.length > 0 && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
              className="bg-card border border-border rounded-md px-3 py-1 text-text-primary"
            >
              <option value="date">Sort by Date</option>
              <option value="rating">Sort by Rating</option>
            </select>
          )}
        </div>

        {/* Existing Reviews */}
        <div className="space-y-4">
          {sortedReviews.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <p>No reviews yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            sortedReviews.map((review) => (
              <div key={review.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <StarRating initialRating={review.rating} readOnly size="sm" />
                    <p className="text-sm text-text-secondary mt-1">
                      {format(new Date(review.timestamp), 'PPP')}
                    </p>
                  </div>
                  {isAuthenticated && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsEditing(review.id);
                          reset({ content: review.content });
                        }}
                        className="p-2 rounded-full hover:bg-background transition-colors"
                        title="Edit review"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-2 rounded-full hover:bg-background text-error transition-colors"
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-text-primary leading-relaxed">{review.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Write Review Form */}
        {isAuthenticated ? (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              {isEditing ? 'Edit Review' : 'Write a Review'}
            </h3>
            <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Share your thoughts about this movie
                </label>
                <div className="relative">
                  <textarea
                    {...register('content')}
                    placeholder="What did you think of this movie? Share your thoughts, favorite scenes, or what made it special..."
                    className="w-full h-32 bg-background border border-border rounded-lg p-4 resize-none text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    disabled={isLoading}
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      type="button"
                      onClick={undo}
                      disabled={!canUndo() || isLoading}
                      className="p-1.5 rounded-full hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Undo"
                    >
                      <Undo2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={redo}
                      disabled={!canRedo() || isLoading}
                      className="p-1.5 rounded-full hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Redo"
                    >
                      <Redo2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {errors.content && (
                  <p className="mt-1 text-sm text-error">{errors.content.message}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : isEditing ? 'Update Review' : 'Submit Review'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(null);
                      reset();
                    }}
                    className="btn-secondary"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <p className="text-text-secondary mb-4">Sign in to write a review and share your thoughts about this movie.</p>
            <button className="btn-primary">
              Sign In to Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingSection;