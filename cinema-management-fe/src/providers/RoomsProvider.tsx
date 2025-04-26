import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { RoomType } from "../interfaces/types";

interface RoomsContextType {
  rooms: RoomType[];
  fetchRoomsData: () => Promise<void>;
  createRoom: (room: RoomType) => Promise<void>;
  updateRoom: (room: RoomType) => Promise<void>;
  deleteRoom: (roomId: string) => Promise<void>;
  loading: boolean;
}

const RoomsContext = createContext<RoomsContextType | undefined>(undefined);

export const RoomsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchRoomsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken"); // Retrieve the token from localStorage
      const response = await fetch(`${baseURL}/room`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the Authorization header
        },
      });
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

  const createRoom = useCallback(async (newRoom: RoomType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRoom),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const createdRoom = await response.json();
      setRooms((prevRooms) => [...prevRooms, createdRoom]);
    } catch (error) {
      console.error("Failed to create room:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRoom = useCallback(async (updatedRoom: RoomType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/room/${updatedRoom._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedRoom),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedData = await response.json();
      setRooms((prevRooms) =>
        prevRooms.map((room) => (room._id === updatedData._id ? updatedData : room))
      );
    } catch (error) {
      console.error("Failed to update room:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRoom = useCallback(async (roomId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/room/${roomId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
    } catch (error) {
      console.error("Failed to delete room:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <RoomsContext.Provider value={{ rooms, fetchRoomsData, createRoom, updateRoom, deleteRoom, loading }}>
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