import React from "react"
import DeleteImg from "../../../assets/images/delete.svg"
import { DiscountType } from "../../../interfaces/types"

const Discount: React.FC<DiscountType> = (discount) => {
  return (
    <div
      className="discount grid grid-cols-6 h-[45px] px-8 text-gray items-center hover:text-red"
      style={{ gridTemplateColumns: "0.4fr 0.5fr 0.7fr 0.6fr 0.8fr 1fr 1fr" }}
    >
      <p className="text-sm font-normal">{discount.discount_id}</p>
      <p className="text-sm font-normal">{discount.code}</p>
      <p className="text-sm font-normal">{discount.discount_type}</p>
      <p className="text-sm font-normal">{discount.value}</p>
      <p className="text-sm font-normal">{discount.min_purchase}</p>
      <p className="text-sm font-normal">{discount.expiry_date}</p>
      <div className="flex flex-row">
        <button className="delete-btn ml-2 hover:transform hover:-translate-y-1 transition-transform duration-200"/* onClick={{handleDeleteClick}}*/>
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