import React, { createContext, useState, useContext, ReactNode } from "react";
import { MovieType } from "../interfaces/types";

interface MoviesContextType {
  movies: MovieType[];
  fetchMoviesData: () => Promise<void>;
  loading: boolean;
}

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

export const MoviesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMoviesData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/movies`);
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
  };

  return (
    <MoviesContext.Provider value={{ movies, fetchMoviesData, loading }}>
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
