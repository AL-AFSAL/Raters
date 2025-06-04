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
import { checkSystemStatus, logError, validateReview } from '../../utils/troubleshoot';

interface RatingSectionProps {
  movieId: number;
}

const reviewSchema = z.object({
  content: z.string()
    .min(10, 'Review must be at least 10 characters long')
    .max(1000, 'Review cannot exceed 1000 characters'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const RatingSection: React.FC<RatingSectionProps> = ({ movieId }) => {
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [systemStatus, setSystemStatus] = useState({ database: true, auth: true, api: true });
  const [isLoading, setIsLoading] = useState(false);
  
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

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkSystemStatus();
        setSystemStatus(status);
      } catch (error) {
        logError('RatingSection', error as Error, { movieId });
      }
    };

    checkStatus();
  }, [movieId]);

  const movieRatings = ratings.filter(r => r.movieId === movieId);
  const movieReviews = reviews.filter(r => r.movieId === movieId);
  const averageRating = movieRatings.length
    ? movieRatings.reduce((acc, curr) => acc + curr.rating, 0) / movieRatings.length
    : 0;

  const onSubmitReview = async (data: ReviewFormData) => {
    try {
      setIsLoading(true);

      if (!isAuthenticated) {
        toast.error('Please sign in to review movies');
        return;
      }

      if (!validateReview(data.content)) {
        toast.error('Invalid review content');
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
      logError('RatingSection.onSubmitReview', error as Error, {
        movieId,
        isEditing,
        content: data.content
      });
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
      logError('RatingSection.handleDeleteReview', error as Error, { reviewId: id });
    }
  };

  const sortedReviews = [...movieReviews].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return b.rating - a.rating;
  });

  if (!systemStatus.database || !systemStatus.auth) {
    return (
      <div className="bg-error/10 border border-error rounded-lg p-6 text-error">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-lg font-semibold">System Error</h2>
        </div>
        <p>Unable to load the rating system. Please try again later.</p>
        <button
          onClick={() => window.location.reload()}
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
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
            className="bg-card border border-border rounded-md px-3 py-1"
          >
            <option value="date">Sort by Date</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>

        {/* Existing Reviews */}
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <div key={review.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <StarRating initialRating={review.rating} readOnly size="sm" />
                  <p className="text-sm text-text-secondary mt-1">
                    {format(new Date(review.timestamp), 'PPP')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(review.id)}
                    className="p-2 rounded-full hover:bg-background"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="p-2 rounded-full hover:bg-background text-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="mt-4 text-text-primary">{review.content}</p>
            </div>
          ))}
        </div>

        {/* Write Review Form */}
        <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Write a Review
            </label>
            <div className="relative">
              <textarea
                {...register('content')}
                placeholder="Share your thoughts about the movie..."
                className="w-full h-32 bg-card border border-border rounded-lg p-4 resize-none"
                disabled={isLoading}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  type="button"
                  onClick={undo}
                  disabled={!canUndo() || isLoading}
                  className="p-1.5 rounded-full hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Undo"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={redo}
                  disabled={!canRedo() || isLoading}
                  className="p-1.5 rounded-full hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed"
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
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : isEditing ? 'Update Review' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RatingSection;