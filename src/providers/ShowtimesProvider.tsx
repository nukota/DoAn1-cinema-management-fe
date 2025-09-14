import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
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
      const response = await axios.get(`${baseURL}/showtime`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowtimes(response.data);
    } catch (error: any) {
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
      const response = await axios.get(`${baseURL}/showtime/movie/${movieId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowtimesByMovieId(response.data);
    } catch (error: any) {
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
      await axios.post(`${baseURL}/showtime`, newShowtime, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchShowtimesData();
    } catch (error: any) {
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
      await axios.patch(
        `${baseURL}/showtime/${updatedShowtime._id}`,
        updatedShowtime,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchShowtimesData();
    } catch (error: any) {
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
      await axios.delete(`${baseURL}/showtime/${showtimeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchShowtimesData();
    } catch (error: any) {
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
      const response = await axios.get(`${baseURL}/showtime/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = response.data;
      const data = responseData.data || responseData;

      if (Array.isArray(data)) {
        setCurrentShowtime(data);
      } else {
        console.error("Invalid data format: Expected an array in 'data'");
        setCurrentShowtime([]);
      }
    } catch (error: any) {
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
