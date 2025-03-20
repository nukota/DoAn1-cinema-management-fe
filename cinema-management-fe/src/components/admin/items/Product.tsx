import React from "react"
import { ProductType } from "../../../types"
import TextureImg from "../../../assets/images/texture.png"

const Product: React.FC<ProductType> = (product) => {
  return (
    <div className="product w-[140px] h-[240px]">
      <div className="product-img flex w-[130px] h-[150px] border-2 border-red rounded-xl items-center justify-center bg-gradient-to-b from-white to-white p-2 relative">
        <img className="absolute size-full z-0 opacity-15" src={TextureImg} alt="texture" />
        <img className="max-h-[100px] max-w-[100px] z-10" src={product.image} alt={product.name} />
      </div>
      <div className="product-info flex flex-col mt-1">
        <span className="text-[13px] font-normal text-red">
          ID: {product.product_id}
        </span>
        <p className="text-[13px] font-normal text-black tracking-wider truncate">
          {product.name}
        </p>
        {product.description && (
          <p className="text-[13px] font-normal text-black tracking-wider truncate">
            {product.description}
          </p>
        )}
        <p className="text-[13px] font-light text-black tracking-wider truncate">
          ${product.price}
        </p>
      </div>
    </div>
  )
}

export default Product