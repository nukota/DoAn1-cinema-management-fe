import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { CinemaType } from "../interfaces/types";

interface CinemasContextType {
  cinemas: CinemaType[];
  fetchCinemasData: () => Promise<void>;
  fetchCinemaDetails: (cinemaId: string) => Promise<any>;
  createCinema: (cinema: CinemaType) => Promise<void>;
  updateCinema: (cinema: CinemaType) => Promise<void>;
  deleteCinema: (_id: string) => Promise<void>;
  loading: boolean;
}

const CinemasContext = createContext<CinemasContextType | undefined>(undefined);

export const CinemasProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cinemas, setCinemas] = useState<CinemaType[]>([]);
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchCinemasData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${baseURL}/cinema`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCinemas(response.data);
    } catch (error: any) {
      console.error(error);
      const errorMsg =
        error.response?.data?.error?.message || "Fetching cinemas failed.";
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCinemaDetails = useCallback(async (cinemaId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${baseURL}/cinema/employeeandroom/${cinemaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(error);
      const errorMsg =
        error.response?.data?.error?.message ||
        "Fetching cinema details failed.";
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCinema = useCallback(async (newCinema: CinemaType) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(`${baseURL}/cinema`, newCinema, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const createdCinema = response.data;
      setCinemas((prevCinemas) => [...prevCinemas, createdCinema]);
    } catch (error: any) {
      console.error("Failed to create cinema:", error);
      const errorMsg =
        error.response?.data?.error?.message || "Creating cinema failed.";
      throw new Error(errorMsg);
    }
  }, []);

  const updateCinema = useCallback(async (updatedCinema: CinemaType) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `${baseURL}/cinema/${updatedCinema._id}`,
        updatedCinema,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedData = response.data;
      setCinemas((prevCinemas) =>
        prevCinemas.map((cinema) =>
          cinema._id === updatedData._id ? updatedData : cinema
        )
      );
    } catch (error: any) {
      console.error("Failed to update cinema:", error);
      const errorMsg =
        error.response?.data?.error?.message || "Updating cinema failed.";
      throw new Error(errorMsg);
    }
  }, []);

  const deleteCinema = useCallback(async (_id: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${baseURL}/cinema/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCinemas((prevCinemas) =>
        prevCinemas.filter((cinema) => cinema._id !== _id)
      );
    } catch (error: any) {
      console.error("Failed to delete cinema:", error);
      const errorMsg =
        error.response?.data?.error?.message || "Deleting cinema failed.";
      throw new Error(errorMsg);
    }
  }, []);

  return (
    <CinemasContext.Provider
      value={{
        cinemas,
        fetchCinemasData,
        fetchCinemaDetails,
        loading,
        createCinema,
        updateCinema,
        deleteCinema,
      }}
    >
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
