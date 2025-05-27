import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { MovieType, ShowtimeType } from "../interfaces/types";

interface ShowtimesContextType {
  showtimes: ShowtimeType[];
  showtimesByMovieId: ShowtimeType[];
  currentShowtime: MovieType[];
  fetchShowtimesData: () => Promise<void>;
  fetchShowtimesByMovieId: (movieId: string) => Promise<void>;
  createShowtime: (newShowtime: ShowtimeType) => Promise<void>;
  updateShowtime: (updatedShowtime: ShowtimeType) => Promise<void>;
  deleteShowtime: (showtimeId: string) => Promise<void>;
  getCurrentShowtime: () => Promise<void>;
  loading: boolean;
}

const ShowtimesContext = createContext<ShowtimesContextType | undefined>(
  undefined
);

export const ShowtimesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [showtimes, setShowtimes] = useState<ShowtimeType[]>([]);
  const [showtimesByMovieId, setShowtimesByMovieId] = useState<ShowtimeType[]>(
    []
  );
  const [currentShowtime, setCurrentShowtime] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchShowtimesData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/showtime`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Fetching showtimes failed.");
      }
      const data = await response.json();
      setShowtimes(data);
    } catch (error) {
      console.error("Failed to fetch showtimes:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchShowtimesByMovieId = useCallback(async (movieId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/showtime/movie/${movieId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Fetching showtimes by movie ID failed.");
      }
      const data = await response.json();
      setShowtimesByMovieId(data);
    } catch (error) {
      console.error("Failed to fetch showtimes by movie ID:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createShowtime = useCallback(async (newShowtime: ShowtimeType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/showtime`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newShowtime),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Creating showtime failed.");
      }
      fetchShowtimesData();
    } catch (error) {
      console.error("Failed to create showtime:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateShowtime = useCallback(async (updatedShowtime: ShowtimeType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${baseURL}/showtime/${updatedShowtime._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedShowtime),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Updating showtime failed.");
      }
      fetchShowtimesData();
    } catch (error) {
      console.error("Failed to update showtime:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteShowtime = useCallback(async (showtimeId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/showtime/${showtimeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Deleting showtime failed.");
      }
      fetchShowtimesData();
    } catch (error) {
      console.error("Failed to delete showtime:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentShowtime = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/showtime/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Fetching current showtime failed.");
      }
      const { data } = await response.json();
      console.log("API Response:", data);
      if (Array.isArray(data)) {
        setCurrentShowtime(data);
      } else {
        console.error("Invalid data format: Expected an array in 'data'");
        setCurrentShowtime([]);
      }
    } catch (error) {
      console.error("Failed to fetch current showtimes:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ShowtimesContext.Provider
      value={{
        showtimes,
        showtimesByMovieId,
        currentShowtime,
        fetchShowtimesData,
        fetchShowtimesByMovieId,
        createShowtime,
        updateShowtime,
        deleteShowtime,
        getCurrentShowtime,
        loading,
      }}
    >
      {children}
    </ShowtimesContext.Provider>
  );
};

export const useShowtimes = () => {
  const context = useContext(ShowtimesContext);
  if (!context) {
    throw new Error("useShowtimes must be used within a ShowtimesProvider");
  }
  return context;
};
