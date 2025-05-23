import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { RoomType, RoomWithSeatsType } from "../interfaces/types";

interface RoomsContextType {
  rooms: RoomType[];
  fetchRoomsData: () => Promise<void>;
  createRoom: (room: RoomType) => Promise<void>;
  createRoomWithSeats: (room: RoomWithSeatsType) => Promise<void>;
  updateRoom: (room: RoomWithSeatsType) => Promise<void>;
  deleteRoom: (roomId: string) => Promise<void>;
  loading: boolean;
}

const RoomsContext = createContext<RoomsContextType | undefined>(undefined);

export const RoomsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchRoomsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/room`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Fetching rooms failed.");
      }
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      throw error;
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
        const errorText = await response.text();
        throw new Error(errorText || "Creating room failed.");
      }
      const createdRoom = await response.json();
      setRooms((prevRooms) => [...prevRooms, createdRoom]);
    } catch (error) {
      console.error("Failed to create room:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRoomWithSeats = useCallback(async (room: RoomWithSeatsType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/room/seats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(room),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Creating room with seats failed.");
      }
      await fetchRoomsData();
    } catch (error) {
      console.error("Failed to create room with seats:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRoom = useCallback(async (updatedRoom: RoomWithSeatsType) => {
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
        const errorText = await response.text();
        throw new Error(errorText || "Updating room failed.");
      }
      await fetchRoomsData();
    } catch (error) {
      console.error("Failed to update room:", error);
      throw error;
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
        const errorText = await response.text();
        throw new Error(errorText || "Deleting room failed.");
      }
      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
    } catch (error) {
      console.error("Failed to delete room:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <RoomsContext.Provider
      value={{
        rooms,
        fetchRoomsData,
        createRoom,
        createRoomWithSeats,
        updateRoom,
        deleteRoom,
        loading,
      }}
    >
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
