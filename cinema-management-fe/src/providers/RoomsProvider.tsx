import React, { createContext, useState, useContext, ReactNode } from "react";
import { RoomType } from "../interfaces/types";

interface RoomsContextType {
  rooms: RoomType[];
  fetchRoomsData: () => Promise<void>;
  loading: boolean;
}

const RoomsContext = createContext<RoomsContextType | undefined>(undefined);

export const RoomsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoomsData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/rooms`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoomsContext.Provider value={{ rooms, fetchRoomsData, loading }}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRooms = () => {
  const context = useContext(RoomsContext);
  if (!context) {
    throw new Error("useRooms must be used within a RoomsProvider");
  }
  return context;
};