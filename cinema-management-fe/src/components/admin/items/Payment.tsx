import React from "react"
import { PaymentType } from "../../../interfaces/types"

const Payment: React.FC<PaymentType> = (payment) => {
  return (
    <div
      className="payment grid grid-cols-6 h-[45px] px-8 text-gray items-center hover:text-red"
      style={{ gridTemplateColumns: "0.5fr 0.5fr 0.8fr 1fr 0.8fr 1.4fr" }}
    >
      <p className="text-sm font-normal truncate pr-6">{payment._id}</p>
      <p className="text-sm font-normal truncate pr-6">{payment.order_id}</p>
      <p className="text-sm font-normal truncate pr-6">{payment.amount}</p>
      <p className="text-sm font-normal truncate pr-6">{payment.payment_method}</p>
      <p className="text-sm font-normal truncate pr-6">{payment.discount_id}</p>
      <p className="text-sm font-normal truncate pr-6">{payment.paid_at}</p>
    </div>
  )
}

export default Payment