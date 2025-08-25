import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { DiscountType } from "../interfaces/types";

interface DiscountsContextType {
  discounts: DiscountType[];
  fetchDiscountsData: () => void;
  getDiscountById: (id: string) => void;
  getDiscountByCode: (code: string) => void;
  createDiscount: (newDiscount: DiscountType) => void;
  updateDiscount: (newDiscount: DiscountType) => void;
  deleteDiscount: (id: string) => void;
  loading: boolean;
}

const DiscountsContext = createContext<DiscountsContextType | undefined>(undefined);

export const DiscountsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [discounts, setDiscounts] = useState<DiscountType[]>([]);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchDiscountsData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/discount`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Fetching discounts failed.";
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setDiscounts(data);
    } catch (error) {
      console.error("Failed to fetch discounts:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [baseURL]);

  const getDiscountById = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/discount/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Fetching discount by ID failed.";
        throw new Error(errorMsg);
      }
      const discount = await response.json();
      return discount;
    } catch (error) {
      console.error("Failed to get discount by id:", error);
      throw error;
    }
  }, [baseURL]);

  const getDiscountByCode = useCallback(async (code: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/discount/code/${code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Fetching discount by code failed.";
        throw new Error(errorMsg);
      }
      const discount = await response.json();
      return discount;
    } catch (error) {
      console.error("Failed to get discount by code:", error);
      throw error;
    }
  }, [baseURL]);

  const createDiscount = useCallback(async (newDiscount: DiscountType) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/discount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDiscount),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Creating discount failed.";
        throw new Error(errorMsg);
      }
      const createdDiscount = await response.json();
      setDiscounts((prev) => [...prev, createdDiscount]);
    } catch (error) {
      console.error("Failed to create discount:", error);
      throw error;
    }
  }, [baseURL]);

  const updateDiscount = useCallback(async (newDiscount: DiscountType) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/discount/${newDiscount._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDiscount),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Updating discount failed.";
        throw new Error(errorMsg);
      }
      const updatedDiscount = await response.json();
      setDiscounts((prev) =>
        prev.map((d) => (d._id === updatedDiscount._id ? updatedDiscount : d))
      );
    } catch (error) {
      console.error("Failed to update discount:", error);
      throw error;
    }
  }, [baseURL]);

  const deleteDiscount = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/discount/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Deleting discount failed.";
        throw new Error(errorMsg);
      }
      setDiscounts((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      console.error("Failed to delete discount:", error);
      throw error;
    }
  }, [baseURL]);

  return (
    <DiscountsContext.Provider
      value={{
        discounts,
        fetchDiscountsData,
        getDiscountById,
        getDiscountByCode,
        createDiscount,
        updateDiscount,
        deleteDiscount,
        loading,
      }}
    >
      {children}
    </DiscountsContext.Provider>
  );
};

export const useDiscounts = () => {
  const context = useContext(DiscountsContext);
  if (!context) {
    throw new Error("useDiscounts must be used within a DiscountsProvider");
  }
  return context;
};