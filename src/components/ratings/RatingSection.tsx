import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Undo2, Redo2, Edit2, Trash2 } from 'lucide-react';
import { useRatingStore } from '../../stores/ratingStore';
import { useAuth } from '../../contexts/AuthContext';
import StarRating from '../ui/StarRating';
import toast from 'react-hot-toast';

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

  const movieRatings = ratings.filter(r => r.movieId === movieId);
  const movieReviews = reviews.filter(r => r.movieId === movieId);
  const averageRating = movieRatings.length
    ? movieRatings.reduce((acc, curr) => acc + curr.rating, 0) / movieRatings.length
    : 0;

  const onSubmitReview = (data: ReviewFormData) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to review movies');
      return;
    }

    if (isEditing) {
      updateReview(isEditing, data.content);
      toast.success('Review updated successfully!');
    } else {
      addReview(movieId, data.content, averageRating);
      toast.success('Review added successfully!');
    }

    reset();
    setIsEditing(null);
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(id);
      toast.success('Review deleted successfully!');
    }
  };

  const sortedReviews = [...movieReviews].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return b.rating - a.rating;
  });

  return (
    <div className="space-y-8">
      {/* Average Rating Display */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Movie Rating</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <StarRating initialRating={averageRating} readOnly size="lg" />
              <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-text-secondary mt-2">
              Based on {movieRatings.length} {movieRatings.length === 1 ? 'rating' : 'ratings'}
            </p>
          </div>
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
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  type="button"
                  onClick={undo}
                  disabled={!canUndo()}
                  className="p-1.5 rounded-full hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Undo"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={redo}
                  disabled={!canRedo()}
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
          <button type="submit" className="btn-primary">
            {isEditing ? 'Update Review' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RatingSection;