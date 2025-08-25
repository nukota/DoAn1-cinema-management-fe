import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { UserType } from "../interfaces/types";

interface CustomersContextType {
  customers: UserType[];
  fetchCustomersData: () => Promise<void>;
  createCustomer: (newCustomer: UserType) => Promise<void>;
  updateCustomer: (updatedCustomer: UserType) => Promise<void>;
  deleteCustomer: (customerId: string) => Promise<void>;
  loading: boolean;
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export const CustomersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Fetch all customers
  const fetchCustomersData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/user/role/customer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Fetching customers failed.";
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new customer
  const createCustomer = useCallback(async (newCustomer: UserType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCustomer),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Creating customer failed.";
        throw new Error(errorMsg);
      }
      const createdCustomer = await response.json();
      setCustomers((prevCustomers) => [...prevCustomers, createdCustomer]);
    } catch (error) {
      console.error("Failed to create customer:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing customer
  const updateCustomer = useCallback(async (updatedCustomer: UserType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/user/${updatedCustomer._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCustomer),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Updating customer failed.";
        throw new Error(errorMsg);
      }
      const updatedData = await response.json();
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer._id === updatedData._id ? updatedData : customer
        )
      );
    } catch (error) {
      console.error("Failed to update customer:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a customer
  const deleteCustomer = useCallback(async (customerId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/user/${customerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Deleting customer failed.";
        throw new Error(errorMsg);
      }
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer._id !== customerId)
      );
    } catch (error) {
      console.error("Failed to delete customer:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CustomersContext.Provider
      value={{
        customers,
        fetchCustomersData,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        loading,
      }}
    >
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