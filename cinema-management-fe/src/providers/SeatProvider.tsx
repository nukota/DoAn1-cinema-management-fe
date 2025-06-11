import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { SeatType } from "../interfaces/types";

interface SeatsContextType {
  seats: SeatType[];
  fetchSeatsData: () => Promise<void>;
  fetchSeatsByRoomId: (roomId: string) => Promise<void>;
  fetchSeatsByShowtimeId: (showtimeId: string) => Promise<void>;
  createSeat: (newSeat: SeatType) => Promise<void>;
  updateSeat: (updatedSeat: SeatType) => Promise<void>;
  deleteSeat: (seatId: string) => Promise<void>;
  loading: boolean;
}

const SeatsContext = createContext<SeatsContextType | undefined>(undefined);

export const SeatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [seats, setSeats] = useState<SeatType[]>([]);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchSeatsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/seat`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Fetching seats failed.";
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setSeats(data);
    } catch (error) {
      console.error("Failed to fetch seats:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchSeatsByRoomId = async (roomId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/seat/room/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Fetching seats by room ID failed.";
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setSeats(data);
    } catch (error) {
      console.error("Failed to fetch seats by room ID:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchSeatsByShowtimeId = async (showtimeId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/seat/showtime/${showtimeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Fetching seats by showtime ID failed.";
        throw new Error(errorMsg);
      }
      const { data } = await response.json();
      setSeats(data);
    } catch (error) {
      console.error("Failed to fetch seats by showtime ID:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createSeat = useCallback(async (newSeat: SeatType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/seat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSeat),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Creating seat failed.";
        throw new Error(errorMsg);
      }
      const createdSeat = await response.json();
      setSeats((prevSeats) => [...prevSeats, createdSeat]);
    } catch (error) {
      console.error("Failed to create seat:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSeat = useCallback(async (updatedSeat: SeatType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/seat/${updatedSeat._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedSeat),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Updating seat failed.";
        throw new Error(errorMsg);
      }
      const updatedData = await response.json();
      setSeats((prevSeats) =>
        prevSeats.map((seat) =>
          seat._id === updatedData._id ? updatedData : seat
        )
      );
    } catch (error) {
      console.error("Failed to update seat:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSeat = useCallback(async (seatId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/seat/${seatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Deleting seat failed.";
        throw new Error(errorMsg);
      }
      setSeats((prevSeats) => prevSeats.filter((seat) => seat._id !== seatId));
    } catch (error) {
      console.error("Failed to delete seat:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SeatsContext.Provider
      value={{
        seats,
        fetchSeatsData,
        fetchSeatsByRoomId,
        fetchSeatsByShowtimeId,
        createSeat,
        updateSeat,
        deleteSeat,
        loading,
      }}
    >
      {children}
    </SeatsContext.Provider>
  );
};

export const useSeats = () => {
  const context = useContext(SeatsContext);
  if (!context) {
    throw new Error("useSeats must be used within a SeatProvider");
  }
  return context;
};
