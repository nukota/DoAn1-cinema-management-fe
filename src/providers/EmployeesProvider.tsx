import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { EmployeeType } from "../interfaces/types";

interface EmployeesContextType {
  employees: EmployeeType[];
  fetchEmployeesData: () => Promise<void>;
  createEmployee: (newEmployee: EmployeeType) => Promise<void>;
  updateEmployee: (updatedEmployee: EmployeeType) => Promise<void>;
  deleteEmployee: (EmployeeId: string) => Promise<void>;
  loading: boolean;
}

const EmployeesContext = createContext<EmployeesContextType | undefined>(
  undefined
);

export const EmployeesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchEmployeesData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${baseURL}/employee`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(response.data);
    } catch (error: any) {
      console.error("Failed to fetch Employees:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = useCallback(async (newEmployee: EmployeeType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(`${baseURL}/employee`, newEmployee, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const createdEmployee = response.data;
      setEmployees((prevEmployees) => [...prevEmployees, createdEmployee]);
    } catch (error: any) {
      console.error("Failed to create Employee:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEmployee = useCallback(async (updatedEmployee: EmployeeType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `${baseURL}/employee/${updatedEmployee._id}`,
        updatedEmployee,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedData = response.data;
      setEmployees((prevEmployees) =>
        prevEmployees.map((Employee) =>
          Employee._id === updatedData._id ? updatedData : Employee
        )
      );
    } catch (error: any) {
      console.error("Failed to update Employee:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEmployee = useCallback(async (EmployeeId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${baseURL}/employee/${EmployeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees((prevEmployees) =>
        prevEmployees.filter((Employee) => Employee._id !== EmployeeId)
      );
    } catch (error: any) {
      console.error("Failed to delete Employee:", error);
      throw error;
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
