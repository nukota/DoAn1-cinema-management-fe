import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
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
      const response = await fetch(`${baseURL}/employee`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Fetching Employees failed.";
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
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
      const response = await fetch(`${baseURL}/employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEmployee),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Creating Employee failed.";
        throw new Error(errorMsg);
      }
      const createdEmployee = await response.json();
      setEmployees((prevEmployees) => [...prevEmployees, createdEmployee]);
    } catch (error) {
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
      const response = await fetch(
        `${baseURL}/employee/${updatedEmployee._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedEmployee),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Updating Employee failed.";
        throw new Error(errorMsg);
      }
      const updatedData = await response.json();
      setEmployees((prevEmployees) =>
        prevEmployees.map((Employee) =>
          Employee._id === updatedData._id ? updatedData : Employee
        )
      );
    } catch (error) {
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
      const response = await fetch(`${baseURL}/employee/${EmployeeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Deleting Employee failed.";
        throw new Error(errorMsg);
      }
      setEmployees((prevEmployees) =>
        prevEmployees.filter((Employee) => Employee._id !== EmployeeId)
      );
    } catch (error) {
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
