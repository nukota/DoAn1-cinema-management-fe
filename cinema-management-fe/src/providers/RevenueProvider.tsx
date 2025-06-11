import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { MovieRevenueType, PrductRevenueType } from "../interfaces/types";

interface RevenueContextType {
  getAllRevenue: (payload: {
    startDate: string;
    endDate: string;
  }) => Promise<any>;
  getMovieRevenueByDate: (payload: {
    startDate: string;
    endDate: string;
    movie_id: string;
  }) => Promise<MovieRevenueType[]>;
  getProductRevenueByDate: (payload: {
    startDate: string;
    endDate: string;
    product_id: string;
  }) => Promise<PrductRevenueType[]>;
  loading: boolean;
}

const RevenueContext = createContext<RevenueContextType | undefined>(undefined);

export const RevenueProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const getAllRevenue = useCallback(
    async (payload: { startDate: string; endDate: string }) => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${baseURL}/revenue/all`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json();
          const errorMsg = errorData?.error?.message || "Fetching all revenue failed.";
          throw new Error(errorMsg);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Failed to fetch all revenue:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [baseURL]
  );

  const getMovieRevenueByDate = useCallback(
    async (payload: {
      startDate: string;
      endDate: string;
      movie_id: string;
    }) => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${baseURL}/revenue/date/movie`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json();
          const errorMsg = errorData?.error?.message || "Fetching movie revenue by date failed.";
          throw new Error(errorMsg);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Failed to fetch movie revenue by date:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [baseURL]
  );

  const getProductRevenueByDate = useCallback(
    async (payload: {
      startDate: string;
      endDate: string;
      product_id: string;
    }) => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${baseURL}/revenue/date/product`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json();
          const errorMsg = errorData?.error?.message || "Fetching product revenue by date failed.";
          throw new Error(errorMsg);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Failed to fetch product revenue by date:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [baseURL]
  );

  return (
    <RevenueContext.Provider
      value={{
        getAllRevenue,
        getMovieRevenueByDate,
        getProductRevenueByDate,
        loading,
      }}
    >
      {children}
    </RevenueContext.Provider>
  );
};

export const useRevenue = () => {
  const context = useContext(RevenueContext);
  if (!context) {
    throw new Error("useRevenue must be used within a RevenueProvider");
  }
  return context;
};
