import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
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

  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/product`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Fetching products failed.");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createProduct = useCallback(async (newProduct: ProductType) => {
    try {
      const response = await fetch(`${baseURL}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Creating product failed.");
      }
      const createdProduct = await response.json();
      setProducts((prevProducts) => [...prevProducts, createdProduct]);
    } catch (error) {
      console.error("Failed to create product:", error);
      throw error;
    }
  }, []);

  const updateProduct = useCallback(async (updatedProduct: ProductType) => {
    try {
      const response = await fetch(`${baseURL}/product/${updatedProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Updating product failed.");
      }
      const updatedData = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedData._id ? updatedData : product
        )
      );
    } catch (error) {
      console.error("Failed to update product:", error);
      throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (productId: string) => {
    try {
      const response = await fetch(`${baseURL}/product/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Deleting product failed.");
      }
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    } catch (error) {
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
