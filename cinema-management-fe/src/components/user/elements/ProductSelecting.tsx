import React from "react";
import { Box } from "@mui/material";
import { ProductType } from "../../../interfaces/types";
import ProductItem from "../items/ProductItem";

interface ProductSelectingProps {
    products: ProductType[];
    selectedProducts: { product: ProductType; amount: number }[];
    setSelectedProducts: React.Dispatch<
      React.SetStateAction<{ product: ProductType; amount: number }[]>
    >;
  }
  const ProductSelecting: React.FC<ProductSelectingProps> = ({
    products,
    selectedProducts,
    setSelectedProducts,
  }) => {
    const setAmount = (product: ProductType, newAmount: number) => {
      setSelectedProducts((prevProducts) => {
        const existingProduct = prevProducts.find(
          (p) => p.product.name === product.name
        );
        if (existingProduct) {
          return prevProducts.map((p) =>
            p.product.name === product.name ? { ...p, amount: newAmount } : p
          );
        } else {
          return [...prevProducts, { product, amount: newAmount }];
        }
      });
    };
    return (
      <Box
        sx={{
          width: 1,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          paddingX: 4,
          paddingY: 10,
          rowGap: 6,
          zIndex: 10,
          borderTop: "2px solid #222",
        }}
      >
        {products.map((product) => {
          const existingProduct = selectedProducts.find(
            (p) => p.product.name === product.name
          );
          const amount = existingProduct ? existingProduct.amount : 0;
          return (
            <ProductItem
              key={product.product_id}
              product={product}
              amount={amount}
              setAmount={setAmount}
            />
          );
        })}
      </Box>
    );
  };

  export default ProductSelecting;
  