import React from "react"
import DeleteImg from "../../../assets/images/delete.svg"
import InfoImg from "../../../assets/images/info.svg"
import { DiscountType } from "../../../interfaces/types"

interface DiscountProps {
  discount: DiscountType;
  handleInfoClick: () => void;
  handleDeleteClick: () => void;
}

const Discount: React.FC<DiscountProps> = ({discount, handleInfoClick, handleDeleteClick}) => {
  return (
    <div
      className="discount grid grid-cols-6 h-[45px] px-8 text-gray items-center hover:text-red"
      style={{ gridTemplateColumns: "0.4fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr 1fr 0.6fr" }}
    >
      <p className="text-sm font-normal truncate pr-6">{discount._id}</p>
      <p className="text-sm font-normal truncate">{discount.code}</p>
      <p className="text-sm font-normal truncate">{discount.discount_type}</p>
      <p className="text-sm font-normal truncate">{discount.value}</p>
      <p className="text-sm font-normal truncate">{discount.min_purchase}</p>
      <p className="text-sm font-normal truncate">{discount.max_usage}</p>
      <p className="text-sm font-normal truncate">{discount.expiry_date}</p>
      <div className="flex flex-row">
        <button
          className="info-btn hover:transform hover:-translate-y-1 transition-transform duration-200"
          onClick={handleInfoClick}
        >
          <img
            src={InfoImg}
            alt="Info"
            style={{ filter: "brightness(1.3)" }}
            className="w-6 h-6 hover:filter-hover"
          />
        </button>
        <button
          className="delete-btn ml-2 hover:transform hover:-translate-y-1 transition-transform duration-200"
          onClick={handleDeleteClick}
        >
          <img
            src={DeleteImg}
            alt="Delete"
            style={{ filter: "brightness(1.3)" }}
            className="w-6 h-6 hover:filter-hover"
          />
        </button>
      </div>
    </div>
  )
}

export default Discount