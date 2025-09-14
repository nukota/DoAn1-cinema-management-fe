import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { ProductType } from "../interfaces/types";

interface ProductsContextType {
  products: ProductType[];
  fetchProductsData: () => Promise<void>;
  createProduct: (newProduct: ProductType) => Promise<void>;
  updateProduct: (updatedProduct: ProductType) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  loading: boolean;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchProductsData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/product`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setProducts(response.data);
    } catch (error: any) {
      console.error("Failed to fetch products:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (newProduct: ProductType) => {
    try {
      const response = await axios.post(`${baseURL}/product`, newProduct, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const createdProduct = response.data;
      setProducts((prevProducts) => [...prevProducts, createdProduct]);
    } catch (error: any) {
      console.error("Failed to create product:", error);
      throw error;
    }
  }, []);

  const updateProduct = useCallback(async (updatedProduct: ProductType) => {
    try {
      const response = await axios.put(
        `${baseURL}/product/${updatedProduct._id}`,
        updatedProduct,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const updatedData = response.data;
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedData._id ? updatedData : product
        )
      );
    } catch (error: any) {
      console.error("Failed to update product:", error);
      throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (productId: string) => {
    try {
      await axios.delete(`${baseURL}/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    } catch (error: any) {
      console.error("Failed to delete product:", error);
      throw error;
    }
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        fetchProductsData,
        createProduct,
        updateProduct,
        deleteProduct,
        loading,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};
