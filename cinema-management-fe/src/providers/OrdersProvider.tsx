import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { OrderType } from "../interfaces/types";

interface OrdersContextType {
  orders: OrderType[];
  fetchOrdersData: () => Promise<void>;
  fetchOrderDetails: (orderId: string) => Promise<OrderType | undefined>;
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
      const response = await fetch(`${baseURL}/order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Fetching orders failed.");
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
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
      const response = await fetch(`${baseURL}/order/details/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Fetching order details failed.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (newOrder: OrderType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newOrder),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Creating order failed.");
      }
      const createdOrder = await response.json();
      setOrders((prevOrders) => [...prevOrders, createdOrder]);
    } catch (error) {
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
      const response = await fetch(`${baseURL}/order/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newOrder),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Creating detailed order failed.");
      }
      const blob = await response.blob();
      return blob;
    } catch (error) {
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
      const response = await fetch(`${baseURL}/order/${updatedOrder._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedOrder),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Updating order failed.");
      }
      const updatedData = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedData._id ? updatedData : order
        )
      );
    } catch (error) {
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
      const response = await fetch(`${baseURL}/order/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Deleting order failed.");
      }
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (error) {
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
