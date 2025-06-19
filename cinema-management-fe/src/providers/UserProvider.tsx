import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  getUserById: (id: string) => User | undefined;
  getCreditByUserId: (id: string) => Promise<number>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "John Doe", email: "john.doe@example.com" },
    { id: "2", name: "Jane Smith", email: "jane.smith@example.com" },
  ]);

  const getUserById = (id: string): User | undefined => {
    return users.find((user) => user.id === id);
  };

  const getCreditByUserId = async (id: string): Promise<number> => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/user/credit/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user credit");
      }
      const data = await response.json();
      return data.credit_points;
    } catch (error) {
      console.error("Error fetching user credit:", error);
      return 0;
    }
  };

  return (
    <UserContext.Provider value={{ getUserById, getCreditByUserId }}>
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
