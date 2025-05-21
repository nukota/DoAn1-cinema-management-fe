import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { PaymentType } from "../interfaces/types";

interface PaymentsContextType {
  payments: PaymentType[];
  fetchPaymentsData: () => Promise<void>;
  createPayment: (newPayment: PaymentType) => Promise<void>;
  updatePayment: (updatedPayment: PaymentType) => Promise<void>;
  deletePayment: (paymentId: string) => Promise<void>;
  loading: boolean;
}

const PaymentsContext = createContext<PaymentsContextType | undefined>(undefined);

export const PaymentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Fetch all payments
  const fetchPaymentsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/payment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new payment
  const createPayment = useCallback(async (newPayment: PaymentType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPayment),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const createdPayment = await response.json();
      setPayments((prevPayments) => [...prevPayments, createdPayment]);
    } catch (error) {
      console.error("Failed to create payment:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing payment
  const updatePayment = useCallback(async (updatedPayment: PaymentType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/payment/${updatedPayment._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPayment),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedData = await response.json();
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === updatedData._id ? updatedData : payment
        )
      );
    } catch (error) {
      console.error("Failed to update payment:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a payment
  const deletePayment = useCallback(async (paymentId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/payment/${paymentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setPayments((prevPayments) =>
        prevPayments.filter((payment) => payment._id !== paymentId)
      );
    } catch (error) {
      console.error("Failed to delete payment:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <PaymentsContext.Provider
      value={{
        payments,
        fetchPaymentsData,
        createPayment,
        updatePayment,
        deletePayment,
        loading,
      }}
    >
      {children}
    </PaymentsContext.Provider>
  );
};

export const usePayments = () => {
  const context = useContext(PaymentsContext);
  if (!context) {
    throw new Error("usePayments must be used within a PaymentsProvider");
  }
  return context;
};