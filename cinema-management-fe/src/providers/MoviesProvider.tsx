import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { MovieType } from "../interfaces/types";

interface MoviesContextType {
  movies: MovieType[];
  fetchMoviesData: () => Promise<void>;
  fetchMovieById: (movieId: string) => Promise<MovieType | null>;
  fetchMovieByStatus: (status: string) => Promise<MovieType[]>;
  createMovie: (newMovie: MovieType) => Promise<void>;
  updateMovie: (updatedMovie: MovieType) => Promise<void>;
  deleteMovie: (movieId: string) => Promise<void>;
  loading: boolean;
}

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

export const MoviesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchMoviesData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/movie`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMovieById = useCallback(async (movieId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/movie/${movieId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data; // Return the fetched movie
    } catch (error) {
      console.error(`Failed to fetch movie with ID "${movieId}":`, error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch movies by status
  const fetchMovieByStatus = useCallback(async (status: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/movie/status?status=${encodeURIComponent(status)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data; // Return the fetched movies
    } catch (error) {
      console.error(`Failed to fetch movies with status "${status}":`, error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createMovie = useCallback(async (newMovie: MovieType) => {
    try {
      const response = await fetch(`${baseURL}/movie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(newMovie),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const createdMovie = await response.json();
      setMovies((prevMovies) => [...prevMovies, createdMovie]);
    } catch (error) {
      console.error("Failed to create movie:", error);
    }
  }, []);

  const updateMovie = useCallback(async (updatedMovie: MovieType) => {
    try {
      const response = await fetch(`${baseURL}/movie/${updatedMovie._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(updatedMovie),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedData = await response.json();
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie._id === updatedData._id ? updatedData : movie
        )
      );
    } catch (error) {
      console.error("Failed to update movie:", error);
    }
  }, []);

  const deleteMovie = useCallback(async (movieId: string) => {
    try {
      const response = await fetch(`${baseURL}/movie/${movieId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie._id !== movieId)
      );
    } catch (error) {
      console.error("Failed to delete movie:", error);
    }
  }, []);

  return (
    <MoviesContext.Provider
      value={{
        movies,
        fetchMoviesData,
        fetchMovieById,
        fetchMovieByStatus,
        createMovie,
        updateMovie,
        deleteMovie,
        loading,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MoviesContext);
  if (!context) {
    throw new Error("useMovies must be used within a MoviesProvider");
  }
  return context;
};
