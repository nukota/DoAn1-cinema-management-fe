import React from "react";
import { ProductType } from "../../../../interfaces/types";
import ProductItem from "../../items/ProductItem";

interface SelectProductsProps {
  products: ProductType[];
  selectedProducts: { [key: string]: number };
  onSetAmount: (product: ProductType, newAmount: number) => void;
}

const SelectProducts: React.FC<SelectProductsProps> = ({
  products,
  selectedProducts,
  onSetAmount,
}) => {
  return (
    <div className="w-full max-h-[480px] overflow-y-auto grid grid-cols-4 gap-y-4 z-10 custom-scrollbar">
      {products.map((product) => (
        <ProductItem
          key={product._id}
          product={product}
          amount={selectedProducts[product._id] || 0}
          setAmount={onSetAmount}
        />
      ))}
    </div>
  );
};

export default SelectProducts;
