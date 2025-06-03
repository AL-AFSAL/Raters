import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface Rating {
  movieId: number;
  rating: number;
  timestamp: string;
}

interface Review {
  id: string;
  movieId: number;
  content: string;
  rating: number;
  timestamp: string;
}

interface RatingState {
  ratings: Rating[];
  reviews: Review[];
  history: {
    past: Rating[][],
    future: Rating[][],
  };
  addRating: (movieId: number, rating: number) => void;
  addReview: (movieId: number, content: string, rating: number) => void;
  updateReview: (id: string, content: string) => void;
  deleteReview: (id: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useRatingStore = create<RatingState>()(
  persist(
    (set, get) => ({
      ratings: [],
      reviews: [],
      history: {
        past: [],
        future: [],
      },
      addRating: (movieId: number, rating: number) => {
        const { ratings, history } = get();
        const newRating = {
          movieId,
          rating,
          timestamp: new Date().toISOString(),
        };

        set({
          ratings: [...ratings.filter(r => r.movieId !== movieId), newRating],
          history: {
            past: [...history.past, ratings],
            future: [],
          },
        });
      },
      addReview: (movieId: number, content: string, rating: number) => {
        const { reviews } = get();
        const newReview = {
          id: crypto.randomUUID(),
          movieId,
          content,
          rating,
          timestamp: new Date().toISOString(),
        };

        set({ reviews: [...reviews, newReview] });
      },
      updateReview: (id: string, content: string) => {
        const { reviews } = get();
        set({
          reviews: reviews.map(review =>
            review.id === id
              ? { ...review, content, timestamp: new Date().toISOString() }
              : review
          ),
        });
      },
      deleteReview: (id: string) => {
        const { reviews } = get();
        set({
          reviews: reviews.filter(review => review.id !== id),
        });
      },
      undo: () => {
        const { history } = get();
        if (history.past.length === 0) return;

        const newPast = [...history.past];
        const previous = newPast.pop();
        const current = get().ratings;

        set({
          ratings: previous!,
          history: {
            past: newPast,
            future: [current, ...history.future],
          },
        });
      },
      redo: () => {
        const { history } = get();
        if (history.future.length === 0) return;

        const newFuture = [...history.future];
        const next = newFuture.shift();
        const current = get().ratings;

        set({
          ratings: next!,
          history: {
            past: [...history.past, current],
            future: newFuture,
          },
        });
      },
      canUndo: () => get().history.past.length > 0,
      canRedo: () => get().history.future.length > 0,
    }),
    {
      name: 'rating-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);