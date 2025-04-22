import React, { createContext, useState, useContext, ReactNode } from "react";
import { DiscountType } from "../interfaces/types";

interface DiscountsContextType {
  discounts: DiscountType[];
  fetchDiscountsData: () => Promise<void>;
  loading: boolean;
}

const DiscountsContext = createContext<DiscountsContextType | undefined>(undefined);

export const DiscountsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [discounts, setDiscounts] = useState<DiscountType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDiscountsData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/discounts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDiscounts(data);
    } catch (error) {
      console.error("Failed to fetch discounts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DiscountsContext.Provider value={{ discounts, fetchDiscountsData, loading }}>
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