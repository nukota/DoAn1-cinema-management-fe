import React, { createContext, useState, useContext, ReactNode } from "react";
import { PaymentType } from "../interfaces/types";

interface PaymentsContextType {
  payments: PaymentType[];
  fetchPaymentsData: () => Promise<void>;
  loading: boolean;
}

const PaymentsContext = createContext<PaymentsContextType | undefined>(undefined);

export const PaymentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPaymentsData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/payments`);
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

  return (
    <PaymentsContext.Provider value={{ payments, fetchPaymentsData, loading }}>
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