import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { EmployeeType } from "../interfaces/types";

interface EmployeesContextType {
  employees: EmployeeType[];
  fetchEmployeesData: () => Promise<void>;
  createEmployee: (newEmployee: EmployeeType) => Promise<void>;
  updateEmployee: (updatedEmployee: EmployeeType) => Promise<void>;
  deleteEmployee: (EmployeeId: string) => Promise<void>;
  loading: boolean;
}

const EmployeesContext = createContext<EmployeesContextType | undefined>(undefined);

export const EmployeesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Fetch all Employees
  const fetchEmployeesData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch Employees:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new Employee
  const createEmployee = useCallback(async (newEmployee: EmployeeType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEmployee),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const createdEmployee = await response.json();
      setEmployees((prevEmployees) => [...prevEmployees, createdEmployee]);
    } catch (error) {
      console.error("Failed to create Employee:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing Employee
  const updateEmployee = useCallback(async (updatedEmployee: EmployeeType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/user/${updatedEmployee._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedEmployee),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedData = await response.json();
      setEmployees((prevEmployees) =>
        prevEmployees.map((Employee) =>
          Employee._id === updatedData._id ? updatedData : Employee
        )
      );
    } catch (error) {
      console.error("Failed to update Employee:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a Employee
  const deleteEmployee = useCallback(async (EmployeeId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/user/${EmployeeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEmployees((prevEmployees) =>
        prevEmployees.filter((Employee) => Employee._id !== EmployeeId)
      );
    } catch (error) {
      console.error("Failed to delete Employee:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <EmployeesContext.Provider
      value={{
        employees,
        fetchEmployeesData,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        loading,
      }}
    >
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeesContext);
  if (!context) {
    throw new Error("useEmployees must be used within a EmployeesProvider");
  }
  return context;
};