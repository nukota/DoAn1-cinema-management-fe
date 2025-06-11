import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
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
      const response = await fetch(`${baseURL}/cinema`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg =
          errorData?.error?.message || "Fetching cinemas failed.";
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setCinemas(data);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCinemaDetails = useCallback(async (cinemaId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${baseURL}/cinema/employeeandroom/${cinemaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg =
          errorData?.error?.message || "Fetching cinema details failed.";
        throw new Error(errorMsg);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCinema = useCallback(async (newCinema: CinemaType) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/cinema`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCinema),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Creating cinema failed.";
        throw new Error(errorMsg);
      }
      const createdCinema = await response.json();
      setCinemas((prevCinemas) => [...prevCinemas, createdCinema]);
    } catch (error) {
      console.error("Failed to create cinema:", error);
      throw error;
    }
  }, []);

  const updateCinema = useCallback(async (updatedCinema: CinemaType) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/cinema/${updatedCinema._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCinema),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Updating cinema failed.";
        throw new Error(errorMsg);
      }
      const updatedData = await response.json();
      setCinemas((prevCinemas) =>
        prevCinemas.map((cinema) =>
          cinema._id === updatedData._id ? updatedData : cinema
        )
      );
    } catch (error) {
      console.error("Failed to update cinema:", error);
      throw error;
    }
  }, []);

  const deleteCinema = useCallback(async (_id: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/cinema/${_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Deleting cinema failed.";
        throw new Error(errorMsg);
      }
      setCinemas((prevCinemas) =>
        prevCinemas.filter((cinema) => cinema._id !== _id)
      );
    } catch (error) {
      console.error("Failed to delete cinema:", error);
      throw error;
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
