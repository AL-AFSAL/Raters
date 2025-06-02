export interface Genre {
  id: number;
  name: string;
}

export interface UserRating {
  userId: string;
  rating: number;
  timestamp: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime?: number;
  genres?: Genre[];
  user_rating?: number;
  user_ratings?: UserRating[];
  average_rating?: number;
}