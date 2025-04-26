import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { OrderType } from "../interfaces/types";

interface OrdersContextType {
  orders: OrderType[];
  fetchOrdersData: () => Promise<void>;
  createOrder: (newOrder: OrderType) => Promise<void>;
  updateOrder: (updatedOrder: OrderType) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  loading: boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Fetch all orders
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new order
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const createdOrder = await response.json();
      setOrders((prevOrders) => [...prevOrders, createdOrder]);
    } catch (error) {
      console.error("Failed to create order:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing order
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedData = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedData._id ? updatedData : order
        )
      );
    } catch (error) {
      console.error("Failed to update order:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete an order
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (error) {
      console.error("Failed to delete order:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        fetchOrdersData,
        createOrder,
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