import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { OrderType } from "../interfaces/types";

interface OrdersContextType {
  orders: OrderType[];
  fetchOrdersData: () => Promise<void>;
  fetchOrderDetails: (orderId: string) => Promise<OrderType | undefined>;
  getOrderByUserId: (userId: string) => Promise<OrderType[]>;
  getOrderByCode: (code: string) => Promise<Blob>;
  createOrder: (newOrder: OrderType) => Promise<void>;
  createDetailedOrder: (newOrder: any) => Promise<Blob>;
  updateOrder: (updatedOrder: OrderType) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  loading: boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchOrdersData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${baseURL}/order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data);
    } catch (error: any) {
      console.error("Failed to fetch orders:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = useCallback(async (orderId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${baseURL}/order/details/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch order details:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderByUserId = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${baseURL}/order/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch orders by user ID:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderByCode = useCallback(async (code: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${baseURL}/order/code/${code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch order by code:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (newOrder: OrderType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(`${baseURL}/order`, newOrder, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const createdOrder = response.data;
      setOrders((prevOrders) => [...prevOrders, createdOrder]);
    } catch (error: any) {
      console.error("Failed to create order:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createDetailedOrder = useCallback(async (newOrder: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(`${baseURL}/order/orders`, newOrder, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to create detailed order:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrder = useCallback(async (updatedOrder: OrderType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `${baseURL}/order/${updatedOrder._id}`,
        updatedOrder,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedData = response.data;
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedData._id ? updatedData : order
        )
      );
    } catch (error: any) {
      console.error("Failed to update order:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (orderId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${baseURL}/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (error: any) {
      console.error("Failed to delete order:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        fetchOrdersData,
        fetchOrderDetails,
        getOrderByUserId,
        getOrderByCode,
        createOrder,
        createDetailedOrder,
        updateOrder,
        deleteOrder,
        loading,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
};
