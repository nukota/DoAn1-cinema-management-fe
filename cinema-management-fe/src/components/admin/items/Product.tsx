import React from "react"
import { ProductType } from "../../../types"

const Product: React.FC<ProductType> = (product) => {
  return (
    <div className="product w-[140px] h-[200px]">
      <div className="product-img flex w-[130px] h-[150px] border-2 border-red rounded-xl items-center justify-center bg-gradient-to-b from-white to-white p-2">
        <img className="max-h-[100px] max-w-[100px]" src={product.image} alt={product.name} />
      </div>
      <div className="product-info flex flex-col mt-1">
        <p className="text-[13px] font-normal text-white tracking-wider truncate">
          {product.name}
        </p>
        {product.description && (
          <p className="text-[11px] font-normal text-white tracking-wider truncate">
            {product.description}
          </p>
        )}
        <p className="text-[11px] font-light text-gray tracking-wider truncate">
          ${product.price}
        </p>
      </div>
    </div>
  )
}

export default Product