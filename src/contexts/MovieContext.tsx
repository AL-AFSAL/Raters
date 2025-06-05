import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '../types/movie';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface MovieContextType {
  trendingMovies: Movie[];
  topRatedMovies: Movie[];
  loading: boolean;
  error: string | null;
  rateMovie: (movieId: number, rating: number) => Promise<void>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

// Sample movies data with detailed information
const SAMPLE_MOVIES: Movie[] = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    release_date: "1994-09-23",
    vote_average: 8.7,
    vote_count: 24187,
    runtime: 142,
    director: "Frank Darabont",
    genres: [
      { id: 18, name: "Drama" },
      { id: 80, name: "Crime" }
    ],
    user_ratings: [
      { userId: "1", rating: 4.5, timestamp: "2024-03-15T10:30:00Z" },
      { userId: "2", rating: 5, timestamp: "2024-03-14T15:20:00Z" }
    ],
    average_rating: 4.75
  },
  {
    id: 2,
    title: "The Godfather",
    overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    release_date: "1972-03-14",
    vote_average: 8.7,
    vote_count: 18177,
    runtime: 175,
    director: "Francis Ford Coppola",
    genres: [
      { id: 18, name: "Drama" },
      { id: 80, name: "Crime" }
    ],
    user_ratings: [
      { userId: "1", rating: 5, timestamp: "2024-03-15T11:30:00Z" }
    ],
    average_rating: 5
  },
  {
    id: 3,
    title: "The Dark Knight",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
    release_date: "2008-07-16",
    vote_average: 8.5,
    vote_count: 29937,
    runtime: 152,
    director: "Christopher Nolan",
    genres: [
      { id: 18, name: "Drama" },
      { id: 28, name: "Action" },
      { id: 80, name: "Crime" }
    ],
    user_ratings: [
      { userId: "1", rating: 4, timestamp: "2024-03-14T09:15:00Z" },
      { userId: "3", rating: 4.5, timestamp: "2024-03-13T16:45:00Z" }
    ],
    average_rating: 4.25
  },
  {
    id: 4,
    title: "Inception",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster_path: "/8IB2e4r4oVhHnANbnm7O3Tj6tF1.jpg",
    backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    release_date: "2010-07-15",
    vote_average: 8.4,
    vote_count: 32186,
    runtime: 148,
    director: "Christopher Nolan",
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Science Fiction" },
      { id: 12, name: "Adventure" }
    ],
    user_ratings: [
      { userId: "2", rating: 4.5, timestamp: "2024-03-15T14:20:00Z" }
    ],
    average_rating: 4.5
  },
  {
    id: 5,
    title: "Pulp Fiction",
    overview: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    release_date: "1994-09-10",
    vote_average: 8.5,
    vote_count: 24187,
    runtime: 154,
    director: "Quentin Tarantino",
    genres: [
      { id: 80, name: "Crime" },
      { id: 53, name: "Thriller" }
    ],
    user_ratings: [
      { userId: "1", rating: 5, timestamp: "2024-03-12T08:30:00Z" },
      { userId: "2", rating: 5, timestamp: "2024-03-11T17:15:00Z" }
    ],
    average_rating: 5
  },
  {
    id: 6,
    title: "Interstellar",
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    release_date: "2014-11-05",
    vote_average: 8.6,
    vote_count: 31245,
    runtime: 169,
    director: "Christopher Nolan",
    genres: [
      { id: 878, name: "Science Fiction" },
      { id: 12, name: "Adventure" },
      { id: 18, name: "Drama" }
    ],
    user_ratings: [
      { userId: "3", rating: 4.5, timestamp: "2024-03-15T13:10:00Z" }
    ],
    average_rating: 4.5
  },
  {
    id: 7,
    title: "The Matrix",
    overview: "A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    release_date: "1999-03-31",
    vote_average: 8.7,
    vote_count: 25678,
    runtime: 136,
    director: "Lana Wachowski, Lilly Wachowski",
    genres: [
      { id: 878, name: "Science Fiction" },
      { id: 28, name: "Action" }
    ],
    user_ratings: [
      { userId: "1", rating: 5, timestamp: "2024-03-14T19:45:00Z" },
      { userId: "2", rating: 4.5, timestamp: "2024-03-13T12:30:00Z" }
    ],
    average_rating: 4.75
  },
  {
    id: 8,
    title: "Parasite",
    overview: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdrop_path: "/ApiBzeaa95TNYliSbQ8pJv4Fje7.jpg",
    release_date: "2019-05-30",
    vote_average: 8.5,
    vote_count: 15234,
    runtime: 132,
    director: "Bong Joon-ho",
    genres: [
      { id: 18, name: "Drama" },
      { id: 35, name: "Comedy" },
      { id: 53, name: "Thriller" }
    ],
    user_ratings: [
      { userId: "2", rating: 5, timestamp: "2024-03-15T16:20:00Z" }
    ],
    average_rating: 5
  },
  {
    id: 9,
    title: "Whiplash",
    overview: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    poster_path: "/6uSPcdGNA2A6vJmCagXkvnutegs.jpg",
    backdrop_path: "/fRGxZuo7jJUWQsVg9PREb98Rdz8.jpg",
    release_date: "2014-10-10",
    vote_average: 8.5,
    vote_count: 12567,
    runtime: 107,
    director: "Damien Chazelle",
    genres: [
      { id: 18, name: "Drama" },
      { id: 10402, name: "Music" }
    ],
    user_ratings: [
      { userId: "1", rating: 4.5, timestamp: "2024-03-13T20:15:00Z" }
    ],
    average_rating: 4.5
  },
  {
    id: 10,
    title: "Spirited Away",
    overview: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.",
    poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    backdrop_path: "/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg",
    release_date: "2001-07-20",
    vote_average: 8.8,
    vote_count: 14567,
    runtime: 125,
    director: "Hayao Miyazaki",
    genres: [
      { id: 16, name: "Animation" },
      { id: 14, name: "Fantasy" },
      { id: 12, name: "Adventure" }
    ],
    user_ratings: [
      { userId: "3", rating: 5, timestamp: "2024-03-14T11:40:00Z" },
      { userId: "1", rating: 5, timestamp: "2024-03-12T15:55:00Z" }
    ],
    average_rating: 5
  },
  {
    id: 11,
    title: "Everything Everywhere All at Once",
    overview: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.",
    poster_path: "/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    backdrop_path: "/nW5fUbldp1DYf2uQ3zJTUdachOu.jpg",
    release_date: "2022-03-25",
    vote_average: 8.7,
    vote_count: 12345,
    runtime: 139,
    director: "Daniel Kwan, Daniel Scheinert",
    genres: [
      { id: 28, name: "Action" },
      { id: 35, name: "Comedy" },
      { id: 878, name: "Science Fiction" }
    ],
    user_ratings: [
      { userId: "1", rating: 5, timestamp: "2024-03-15T18:30:00Z" }
    ],
    average_rating: 5
  },
  {
    id: 12,
    title: "The Grand Budapest Hotel",
    overview: "The adventures of Gustave H, a legendary concierge at a famous European hotel between the wars, and Zero Moustafa, the lobby boy who becomes his most trusted friend.",
    poster_path: "/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
    backdrop_path: "/bvJOpyHYWACDusvQvXxKEHFNjce.jpg",
    release_date: "2014-03-07",
    vote_average: 8.1,
    vote_count: 9876,
    runtime: 99,
    director: "Wes Anderson",
    genres: [
      { id: 35, name: "Comedy" },
      { id: 12, name: "Adventure" },
      { id: 80, name: "Crime" }
    ],
    user_ratings: [
      { userId: "2", rating: 4.5, timestamp: "2024-03-14T20:15:00Z" }
    ],
    average_rating: 4.5
  },
  {
    id: 13,
    title: "A Silent Voice",
    overview: "A young man is haunted by his past actions of bullying a deaf classmate. Years later, he sets out to make amends and reconnect with her.",
    poster_path: "/drlyoSKDOPnxzJFrRWGqzFsYNyh.jpg",
    backdrop_path: "/q5HZvp2gj9JrArVfQhW5jfvWNlH.jpg",
    release_date: "2016-09-17",
    vote_average: 8.6,
    vote_count: 7654,
    runtime: 130,
    director: "Naoko Yamada",
    genres: [
      { id: 16, name: "Animation" },
      { id: 18, name: "Drama" },
      { id: 10749, name: "Romance" }
    ],
    user_ratings: [
      { userId: "3", rating: 5, timestamp: "2024-03-13T14:45:00Z" }
    ],
    average_rating: 5
  },
  {
    id: 14,
    title: "Blade Runner 2049",
    overview: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
    poster_path: "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    backdrop_path: "/m4UT6yKXhXgbzxpeV35L4jLoJoP.jpg",
    release_date: "2017-10-06",
    vote_average: 8.0,
    vote_count: 15678,
    runtime: 164,
    director: "Denis Villeneuve",
    genres: [
      { id: 878, name: "Science Fiction" },
      { id: 18, name: "Drama" },
      { id: 9648, name: "Mystery" }
    ],
    user_ratings: [
      { userId: "1", rating: 4.5, timestamp: "2024-03-12T19:20:00Z" }
    ],
    average_rating: 4.5
  },
  {
    id: 15,
    title: "Portrait of a Lady on Fire",
    overview: "On an isolated island in Brittany at the end of the eighteenth century, a female painter is obliged to paint a wedding portrait of a young woman.",
    poster_path: "/3NTEMlG5mQdIAlKDl3AJG0rX29Z.jpg",
    backdrop_path: "/2OJVWa8TGH17GGDvul2wKB0c3Af.jpg",
    release_date: "2019-12-06",
    vote_average: 8.4,
    vote_count: 6543,
    runtime: 122,
    director: "Céline Sciamma",
    genres: [
      { id: 18, name: "Drama" },
      { id: 10749, name: "Romance" },
      { id: 36, name: "History" }
    ],
    user_ratings: [
      { userId: "2", rating: 5, timestamp: "2024-03-11T21:10:00Z" }
    ],
    average_rating: 5
  }
];

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>(SAMPLE_MOVIES);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>(SAMPLE_MOVIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const calculateAverageRating = (ratings: Movie['user_ratings']) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    return Number((sum / ratings.length).toFixed(1));
  };

  const rateMovie = async (movieId: number, rating: number) => {
    try {
      if (!isAuthenticated || !user) {
        toast.error('Please log in to rate movies');
        return;
      }

      const newRating = {
        userId: user.id,
        rating: rating,
        timestamp: new Date().toISOString()
      };

      const updateMovies = (movies: Movie[]) =>
        movies.map(movie => {
          if (movie.id === movieId) {
            const existingRatings = movie.user_ratings || [];
            const updatedRatings = [
              ...existingRatings.filter(r => r.userId !== user.id),
              newRating
            ];
            
            return {
              ...movie,
              user_ratings: updatedRatings,
              average_rating: calculateAverageRating(updatedRatings),
              user_rating: rating
            };
          }
          return movie;
        });
      
      setTrendingMovies(updateMovies);
      setTopRatedMovies(updateMovies);
      
      toast.success('Rating saved successfully!');
    } catch (error) {
      console.error('Error rating movie:', error);
      toast.error('Failed to save rating');
    }
  };

  useEffect(() => {
    if (user) {
      const updateMoviesWithUserRatings = (movies: Movie[]) =>
        movies.map(movie => ({
          ...movie,
          user_rating: movie.user_ratings?.find(r => r.userId === user.id)?.rating || 0
        }));

      setTrendingMovies(updateMoviesWithUserRatings);
      setTopRatedMovies(updateMoviesWithUserRatings);
    }
  }, [user]);

  return (
    <MovieContext.Provider 
      value={{ 
        trendingMovies, 
        topRatedMovies, 
        loading, 
        error,
        rateMovie 
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovie = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovie must be used within a MovieProvider');
  }
  return context;
};