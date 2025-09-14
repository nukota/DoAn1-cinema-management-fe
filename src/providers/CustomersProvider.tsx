import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { UserType } from "../interfaces/types";

interface CustomersContextType {
  customers: UserType[];
  fetchCustomersData: () => Promise<void>;
  createCustomer: (newCustomer: UserType) => Promise<void>;
  updateCustomer: (updatedCustomer: UserType) => Promise<void>;
  deleteCustomer: (customerId: string) => Promise<void>;
  loading: boolean;
}

const CustomersContext = createContext<CustomersContextType | undefined>(
  undefined
);

export const CustomersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [customers, setCustomers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Fetch all customers
  const fetchCustomersData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${baseURL}/user/role/customer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(response.data);
    } catch (error: any) {
      console.error("Failed to fetch customers:", error);
      const errorMsg =
        error.response?.data?.error?.message || "Fetching customers failed.";
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new customer
  const createCustomer = useCallback(async (newCustomer: UserType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(`${baseURL}/user`, newCustomer, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const createdCustomer = response.data;
      setCustomers((prevCustomers) => [...prevCustomers, createdCustomer]);
    } catch (error: any) {
      console.error("Failed to create customer:", error);
      const errorMsg =
        error.response?.data?.error?.message || "Creating customer failed.";
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing customer
  const updateCustomer = useCallback(async (updatedCustomer: UserType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `${baseURL}/user/${updatedCustomer._id}`,
        updatedCustomer,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedData = response.data;
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer._id === updatedData._id ? updatedData : customer
        )
      );
    } catch (error: any) {
      console.error("Failed to update customer:", error);
      const errorMsg =
        error.response?.data?.error?.message || "Updating customer failed.";
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a customer
  const deleteCustomer = useCallback(async (customerId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${baseURL}/user/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer._id !== customerId)
      );
    } catch (error: any) {
      console.error("Failed to delete customer:", error);
      const errorMsg =
        error.response?.data?.error?.message || "Deleting customer failed.";
      throw new Error(errorMsg);
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
