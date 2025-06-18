import React from "react"
import { ProductType } from "../../../interfaces/types"
import TextureImg from "../../../assets/images/texture.png"

interface ProductProps {
  product: ProductType,
  handleInfoClick: () => void;
}

const Product: React.FC<ProductProps> = ({product, handleInfoClick}) => {
  return (
    <div className="product w-[140px] h-[240px]" onClick={handleInfoClick}>
      <div className="product-img flex w-[130px] h-[150px] border-2 border-red rounded-xl items-center justify-center bg-gradient-to-b from-white to-white p-2 relative">
        <img className="absolute size-full z-0 opacity-15" src={TextureImg} alt="texture" />
        <img className="max-h-[100px] max-w-[100px] z-10" src={product.image} alt={product.name} />
      </div>
      <div className="product-info flex flex-col mt-1">
        <p className="text-[13px] font-normal text-black tracking-wider line-clamp-2">
          {product.name}
        </p>
        <p className="text-[13px] font-light text-black tracking-wider truncate">
          {product.price} vnd
        </p>
      </div>
    </div>
  )
}

export default Product