import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { SeatType } from "../interfaces/types";

interface SeatsContextType {
  seats: SeatType[];
  fetchSeatsData: () => Promise<void>;
  fetchSeatsByRoomId: (roomId: string) => Promise<void>;
  fetchSeatsByShowtimeId: (showtimeId: string) => Promise<void>;
  fetchSuggestedSeats: (showtimeId: string, numPeople: number) => Promise<SeatType[]>;
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
      const response = await axios.get(`${baseURL}/seat`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSeats(response.data.data || response.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeatsByRoomId = async (roomId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${baseURL}/seat/room/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSeats(response.data.data || response.data);
    } catch (error: any) {
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
      const response = await axios.get(
        `${baseURL}/seat/showtime/${showtimeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSeats(response.data.data || response.data);
    } catch (error: any) {
      console.error("Failed to fetch seats by showtime ID:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedSeats = async (showtimeId: string, numPeople: number): Promise<SeatType[]> => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${baseURL}/seat/suggest`,
        {
          showtime_id: showtimeId,
          numPeople: numPeople,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data || response.data || [];
    } catch (error: any) {
      console.error("Failed to fetch suggested seats:", error);
      return [];
    }
  };

  const createSeat = useCallback(async (newSeat: SeatType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(`${baseURL}/seat`, newSeat, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const createdSeat = response.data;
      setSeats((prevSeats) => [...prevSeats, createdSeat]);
    } catch (error: any) {
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
      const response = await axios.patch(
        `${baseURL}/seat/${updatedSeat._id}`,
        updatedSeat,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedData = response.data;
      setSeats((prevSeats) =>
        prevSeats.map((seat) =>
          seat._id === updatedData._id ? updatedData : seat
        )
      );
    } catch (error: any) {
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
      await axios.delete(`${baseURL}/seat/${seatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSeats((prevSeats) => prevSeats.filter((seat) => seat._id !== seatId));
    } catch (error: any) {
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
        fetchSuggestedSeats,
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
