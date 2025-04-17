import React, { createContext, useState, useContext, ReactNode } from "react";
import { ShowtimeType } from "../interfaces/types";

interface ShowtimesContextType {
  showtimes: ShowtimeType[];
  fetchShowtimesData: () => Promise<void>;
  loading: boolean;
}

const ShowtimesContext = createContext<ShowtimesContextType | undefined>(undefined);

export const ShowtimesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showtimes, setShowtimes] = useState<ShowtimeType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchShowtimesData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/showtimes`);
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

  return (
    <ShowtimesContext.Provider value={{ showtimes, fetchShowtimesData, loading }}>
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