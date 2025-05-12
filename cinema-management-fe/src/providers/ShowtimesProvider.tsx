import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { ShowtimeType } from "../interfaces/types";

interface ShowtimesContextType {
  showtimes: ShowtimeType[];
  fetchShowtimesData: () => Promise<void>;
  createShowtime: (newShowtime: ShowtimeType) => Promise<void>;
  updateShowtime: (updatedShowtime: ShowtimeType) => Promise<void>;
  deleteShowtime: (showtimeId: string) => Promise<void>;
  getCurrentShowtime: () => Promise<void>; // Added getCurrentShowtime
  loading: boolean;
}

const ShowtimesContext = createContext<ShowtimesContextType | undefined>(undefined);

export const ShowtimesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showtimes, setShowtimes] = useState<ShowtimeType[]>([]);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Fetch all showtimes
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setShowtimes(data);
    } catch (error) {
      console.error("Failed to fetch showtimes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new showtime
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const createdShowtime = await response.json();
      setShowtimes((prevShowtimes) => [...prevShowtimes, createdShowtime]);
    } catch (error) {
      console.error("Failed to create showtime:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing showtime
  const updateShowtime = useCallback(async (updatedShowtime: ShowtimeType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/showtime/${updatedShowtime._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedShowtime),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedData = await response.json();
      setShowtimes((prevShowtimes) =>
        prevShowtimes.map((showtime) =>
          showtime._id === updatedData._id ? updatedData : showtime
        )
      );
    } catch (error) {
      console.error("Failed to update showtime:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a showtime
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setShowtimes((prevShowtimes) =>
        prevShowtimes.filter((showtime) => showtime._id !== showtimeId)
      );
    } catch (error) {
      console.error("Failed to delete showtime:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch current showtimes
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Current Showtimes:", data); // Log the current showtimes
    } catch (error) {
      console.error("Failed to fetch current showtimes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ShowtimesContext.Provider
      value={{
        showtimes,
        fetchShowtimesData,
        createShowtime,
        updateShowtime,
        deleteShowtime,
        getCurrentShowtime, // Added to context
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