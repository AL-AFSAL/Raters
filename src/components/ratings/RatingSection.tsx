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
  
  const {
    ratings,
    reviews,
    addRating,
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

  const handleRating = (rating: number) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to rate movies');
      return;
    }
    addRating(movieId, rating);
    toast.success('Rating saved successfully!');
  };

  const onSubmitReview = (data: ReviewFormData) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to review movies');
      return;
    }

    const currentRating = ratings.find(r => r.movieId === movieId)?.rating || 0;
    
    if (currentRating === 0) {
      toast.error('Please rate the movie before adding a review');
      return;
    }

    if (isEditing) {
      updateReview(isEditing, data.content);
      toast.success('Review updated successfully!');
    } else {
      addReview(movieId, data.content, currentRating);
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

  const movieRatings = ratings.filter(r => r.movieId === movieId);
  const movieReviews = reviews.filter(r => r.movieId === movieId);
  const averageRating = movieRatings.length
    ? movieRatings.reduce((acc, curr) => acc + curr.rating, 0) / movieRatings.length
    : 0;

  const sortedReviews = [...movieReviews].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return b.rating - a.rating;
  });

  return (
    <div className="space-y-6">
      {/* Rating Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Rate this Movie</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={!canUndo()}
              className="p-2 rounded-full hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo rating"
            >
              <Undo2 className="w-5 h-5" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo()}
              className="p-2 rounded-full hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo rating"
            >
              <Redo2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-card p-4 rounded-lg">
          <div>
            <StarRating
              initialRating={initialRating}
              onChange={handleRating}
              size="lg"
            />
            <p className="text-sm text-text-secondary mt-2">
              {movieRatings.length} {movieRatings.length === 1 ? 'rating' : 'ratings'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
            <p className="text-sm text-text-secondary">Average rating</p>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Reviews</h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
            className="bg-card border border-border rounded-md px-3 py-1"
          >
            <option value="date">Sort by Date</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>

        <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
          <div>
            <textarea
              {...register('content')}
              placeholder="Write your review here..."
              className="w-full h-32 bg-card border border-border rounded-lg p-4 resize-none"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-error">{errors.content.message}</p>
            )}
          </div>
          <button type="submit" className="btn-primary">
            {isEditing ? 'Update Review' : 'Submit Review'}
          </button>
        </form>

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
      </div>
    </div>
  );
};

export default RatingSection;