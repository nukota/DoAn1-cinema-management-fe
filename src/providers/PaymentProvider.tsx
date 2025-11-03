import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

interface VNPayCreateRequest {
  order_id: string;
  amount: number;
  bankCode: string;
}

interface VNPayCreateResponse {
  vnpUrl: string;
}

interface VNPayReturnResponse {
  message: string;
  order_id: string;
  code: string;
  added_points: number;
}

interface PaymentContextType {
  createVNPayPayment: (data: VNPayCreateRequest) => Promise<VNPayCreateResponse>;
  handleVNPayReturn: (queryParams: string) => Promise<VNPayReturnResponse>;
  loading: boolean;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);

  const createVNPayPayment = useCallback(
    async (data: VNPayCreateRequest): Promise<VNPayCreateResponse> => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        console.log("createVNPayPayment called with data:", data);
        const response = await axios.post(
          `${baseURL}/payment/vnpay/create`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("createVNPayPayment response:", response.data);

        return response.data;
      } catch (error: any) {
        console.error("Failed to create VNPay payment:", error);
        const errorMsg =
          error.response?.data?.error?.message ||
          "Failed to create VNPay payment.";
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleVNPayReturn = useCallback(
    async (queryParams: string): Promise<VNPayReturnResponse> => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${baseURL}/payment/vnpay_return${queryParams}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response.data;
      } catch (error: any) {
        console.error("Failed to handle VNPay return:", error);
        const errorMsg =
          error.response?.data?.error?.message ||
          "Failed to process VNPay return.";
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <PaymentContext.Provider
      value={{
        createVNPayPayment,
        handleVNPayReturn,
        loading,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};
