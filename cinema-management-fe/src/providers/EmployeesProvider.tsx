import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { EmployeeType } from "../interfaces/types";

interface EmployeesContextType {
  employees: EmployeeType[];
  fetchEmployeesData: () => Promise<void>;
  createEmployee: (newEmployee: EmployeeType) => Promise<void>;
  updateEmployee: (updatedEmployee: EmployeeType) => Promise<void>;
  deleteEmployee: (employeeId: string) => Promise<void>;
  loading: boolean;
}

const EmployeesContext = createContext<EmployeesContextType | undefined>(undefined);

export const EmployeesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchEmployeesData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/employees`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = useCallback(async (newEmployee: EmployeeType) => {
    try {
      const response = await fetch(`${baseURL}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const createdEmployee = await response.json();
      setEmployees((prevEmployees) => [...prevEmployees, createdEmployee]);
    } catch (error) {
      console.error("Failed to create employee:", error);
    }
  }, []);

  const updateEmployee = useCallback(async (updatedEmployee: EmployeeType) => {
    try {
      const response = await fetch(`${baseURL}/employees/${updatedEmployee._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEmployee),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedData = await response.json();
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee._id === updatedData._id ? updatedData : employee
        )
      );
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  }, []);

  const deleteEmployee = useCallback(async (employeeId: string) => {
    try {
      const response = await fetch(`${baseURL}/employees/${employeeId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== employeeId)
      );
    } catch (error) {
      console.error("Failed to delete employee:", error);
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
    throw new Error("useEmployees must be used within an EmployeesProvider");
  }
  return context;
};