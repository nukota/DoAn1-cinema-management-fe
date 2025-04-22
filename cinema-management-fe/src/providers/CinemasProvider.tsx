import React, { createContext, useState, useContext, ReactNode } from "react";
import { CinemaType } from "../interfaces/types";

interface CinemasContextType {
  cinemas: CinemaType[];
  fetchCinemasData: () => Promise<void>;
  loading: boolean;
}

const CinemasContext = createContext<CinemasContextType | undefined>(undefined);

export const CinemasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cinemas, setCinemas] = useState<CinemaType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCinemasData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/cinemas`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCinemas(data);
    } catch (error) {
      console.error("Failed to fetch cinemas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CinemasContext.Provider value={{ cinemas, fetchCinemasData, loading }}>
      {children}
    </CinemasContext.Provider>
  );
};

export const useCinemas = () => {
  const context = useContext(CinemasContext);
  if (!context) {
    throw new Error("useCinemas must be used within a CinemasProvider");
  }
  return context;
};