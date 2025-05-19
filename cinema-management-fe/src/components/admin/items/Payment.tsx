import React from "react"
import InfoImg from "../../../assets/images/info.svg"
import { PaymentType } from "../../../interfaces/types"

interface PaymentProps {
  payment: PaymentType
  handleInfoClick: () => void
}

const Payment: React.FC<PaymentProps> = ({payment, handleInfoClick}) => {
  return (
    <div
      className="payment grid grid-cols-6 h-[45px] px-8 text-gray items-center hover:text-red"
      style={{ gridTemplateColumns: "0.7fr 0.7fr 0.8fr 1fr 0.8fr 1fr" }}
    >
      <p className="text-sm font-normal truncate pr-8">{payment._id}</p>
      <p className="text-sm font-normal truncate pr-8">{payment.order_id}</p>
      <p className="text-sm font-normal truncate">{payment.amount}</p>
      <p className="text-sm font-normal truncate">{payment.paid_at}</p>
      <p className="text-sm font-normal truncate">{payment.status}</p>
      <div className="flex flex-row">
        <button className="info-btn hover:transform hover:-translate-y-1 transition-transform duration-200" onClick={handleInfoClick}>
          <img
            src={InfoImg}
            alt="Info"
            style={{ filter: "brightness(1.3)" }}
            className="w-6 h-6 hover:filter-hover"
          />
        </button>
      </div>
    </div>
  )
}

export default Payment