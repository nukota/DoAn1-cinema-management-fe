import React, { createContext, useState, useContext, ReactNode } from "react";
import { UserType } from "../interfaces/types";

interface CustomersContextType {
  customers: UserType[];
  fetchCustomersData: () => Promise<void>;
  loading: boolean;
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export const CustomersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomersData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/customers`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomersContext.Provider value={{ customers, fetchCustomersData, loading }}>
      {children}
    </CustomersContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomersContext);
  if (!context) {
    throw new Error("useCustomers must be used within a CustomersProvider");
  }
  return context;
};