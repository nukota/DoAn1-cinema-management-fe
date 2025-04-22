import React, { createContext, useState, useContext, ReactNode } from "react";
import { TicketType } from "../interfaces/types";

interface TicketsContextType {
  tickets: TicketType[];
  fetchTicketsData: () => Promise<void>;
  loading: boolean;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export const TicketsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTicketsData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/tickets`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TicketsContext.Provider value={{ tickets, fetchTicketsData, loading }}>
      {children}
    </TicketsContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketsContext);
  if (!context) {
    throw new Error("useTickets must be used within a TicketsProvider");
  }
  return context;
};