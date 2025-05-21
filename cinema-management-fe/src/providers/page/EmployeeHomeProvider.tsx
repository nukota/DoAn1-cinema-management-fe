import React, { createContext, useContext, useState } from "react";
import { MovieType, ProductType, UserType } from "../../interfaces/types";

interface EmployeeHomeContextType {
  selectedMovie: MovieType | null;
  setSelectedMovie: React.Dispatch<React.SetStateAction<MovieType | null>>;
  selectedProducts: ProductType[] | null;
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductType[] | null>>;
  customer: UserType | null;
  setCustomer: React.Dispatch<React.SetStateAction<UserType | null>>;
  email: string | null;
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
  phone: string | null;
  setPhone: React.Dispatch<React.SetStateAction<string | null>>;
}

const EmployeeHomeContext = createContext<EmployeeHomeContextType | undefined>(undefined);

export const useEmployeeHomeContext = () => {
  const context = useContext(EmployeeHomeContext);
  if (!context) {
    throw new Error("useEmployeeHomeContext must be used within a EmployeeHomeProvider");
  }
  return context;
};

export const EmployeeHomeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<ProductType[] | null>(null);
  const [customer, setCustomer] = useState<UserType | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);

  return (
    <EmployeeHomeContext.Provider
      value={{ selectedMovie, setSelectedMovie, selectedProducts, setSelectedProducts, customer, setCustomer, email, setEmail, phone, setPhone }}
    >
      {children}
    </EmployeeHomeContext.Provider>
  );
};