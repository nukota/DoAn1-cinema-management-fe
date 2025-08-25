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
      const response = await fetch(`${baseURL}/order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Fetching orders failed.";
        throw new Error(errorMsg);
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
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Fetching order details failed.";
        throw new Error(errorMsg);
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

  const getOrderByUserId = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/order/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Fetching orders by user ID failed.";
        throw new Error(errorMsg);
      }
      const data = await response.json();
      return data;
    } catch (error) {
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
      const response = await fetch(`${baseURL}/order/code/${code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        let errorMsg = "Fetching order by code failed.";
        try {
          const errorData = await response.json();
          errorMsg = errorData?.error?.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }
      const blob = await response.blob();
      return blob;
    } catch (error) {
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
      const response = await fetch(`${baseURL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newOrder),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Creating order failed.";
        throw new Error(errorMsg);
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
        let errorMsg = "Creating detailed order failed.";
        try {
          const errorData = await response.json();
          errorMsg = errorData?.error?.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
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
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Updating order failed.";
        throw new Error(errorMsg);
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
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Deleting order failed.";
        throw new Error(errorMsg);
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
