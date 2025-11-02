import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { MovieType } from "../interfaces/types";

interface MoviesContextType {
  movies: MovieType[];
  fetchMoviesData: () => Promise<void>;
  fetchMovieById: (movieId: string) => Promise<MovieType | null>;
  fetchMovieByStatus: (status: string) => Promise<MovieType[]>;
  fetchRecommendedMovies: (userId: string) => Promise<string[]>;
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
      const response = await axios.get(`${baseURL}/movie`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setMovies(response.data);
    } catch (error: any) {
      console.error("Failed to fetch movies:", error);
      const errorMsg =
        error.response?.data?.error?.message || "Fetching movies failed.";
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMovieById = useCallback(async (movieId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/movie/${movieId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(`Failed to fetch movie with ID "${movieId}":`, error);
      const errorMsg =
        error.response?.data?.error?.message || "Fetching movie by ID failed.";
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMovieByStatus = useCallback(async (status: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/movie/status?status=${encodeURIComponent(status)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(`Failed to fetch movies with status "${status}":`, error);
      const errorMsg =
        error.response?.data?.error?.message ||
        "Fetching movies by status failed.";
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecommendedMovies = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/recommend/genre/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data.data || [];
    } catch (error: any) {
      console.error("Failed to fetch recommended movies:", error);
      const errorMsg =
        error.response?.data?.error?.message ||
        "Fetching recommended movies failed.";
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createMovie = useCallback(async (newMovie: MovieType) => {
    try {
      const response = await axios.post(`${baseURL}/movie`, newMovie, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const createdMovie = response.data;
      setMovies((prevMovies) => [...prevMovies, createdMovie]);
    } catch (error: any) {
      console.error("Failed to create movie:", error);
      const errorMsg =
        error.response?.data?.error?.message || "Creating movie failed.";
      throw new Error(errorMsg);
    }
  }, []);

  const updateMovie = useCallback(async (updatedMovie: MovieType) => {
    try {
      const response = await axios.patch(
        `${baseURL}/movie/${updatedMovie._id}`,
        updatedMovie,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const updatedData = response.data;
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie._id === updatedData._id ? updatedData : movie
        )
      );
    } catch (error: any) {
      console.error("Failed to update movie:", error);
      const errorMsg =
        error.response?.data?.error?.message || "Updating movie failed.";
      throw new Error(errorMsg);
    }
  }, []);

  const deleteMovie = useCallback(async (movieId: string) => {
    try {
      await axios.delete(`${baseURL}/movie/${movieId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie._id !== movieId)
      );
    } catch (error: any) {
      console.error("Failed to delete movie:", error);
      const errorMsg =
        error.response?.data?.error?.message || "Deleting movie failed.";
      throw new Error(errorMsg);
    }
  }, []);

  return (
    <MoviesContext.Provider
      value={{
        movies,
        fetchMoviesData,
        fetchMovieById,
        fetchMovieByStatus,
        fetchRecommendedMovies,
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
