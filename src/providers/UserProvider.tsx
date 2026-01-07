import React, { createContext, useContext, ReactNode } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  getUserById: (id: string) => User | undefined;
  getCreditByUserId: (id: string) => Promise<number>;
  getUserByIdFromAPI: (id: string) => Promise<any>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const users: User[] = [
    { id: "1", name: "John Doe", email: "john.doe@example.com" },
    { id: "2", name: "Jane Smith", email: "jane.smith@example.com" },
  ];

  const getUserById = (id: string): User | undefined => {
    return users.find((user) => user.id === id);
  };

  const getCreditByUserId = async (id: string): Promise<number> => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${baseURL}/user/credit/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.credit_points;
    } catch (error: any) {
      console.error("Error fetching user credit:", error);
      return 0;
    }
  };

  const getUserByIdFromAPI = async (id: string): Promise<any> => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${baseURL}/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  return (
    <UserContext.Provider
      value={{ getUserById, getCreditByUserId, getUserByIdFromAPI }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};

export default UsersProvider;
