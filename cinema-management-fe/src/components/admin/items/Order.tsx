import React from "react";
import DeleteImg from "../../../assets/images/delete.svg";
import InfoImg from "../../../assets/images/info.svg";
import { OrderType } from "../../../interfaces/types";
import orderBackgroundImg from "../../../assets/images/orderBackground.png";

interface OrderProps {
  order: OrderType;
  ticketAmount: number;
  productAmount: number;
  handleInfoClick: () => void;
  handleDeleteClick: () => void;
}

const Order: React.FC<OrderProps> = ({
  order,
  ticketAmount,
  productAmount,
  handleInfoClick,
  handleDeleteClick,
}) => {
  return (
    <div className="order w-full px-4 h-[160px] bg-[#f2f2f2] rounded-lg relative text-sm overflow-hidden text-black hover:bg-[#d4d4d4] transition-colors ease-in-out duration-200 group " onClick={handleInfoClick}>
      <img
        src={orderBackgroundImg}
        alt="orderBackground"
        className="absolute top-0 -left-4 h-[174px] object-cover rounded-lg opacity-[4%] transition-transform duration-200 ease-in-out group-hover:scale-[120%]"
      />
      <div className="order-info flex flex-col mt-1 items-start justify-between py-2 px-1">
        <div className="flex flex-row w-full items-center justify-between text-gray mb-2">
          <span># {order._id}</span>
          <span className="text-[13px]">{order.status}</span>
        </div>
        <p>Date: {order.created_at} </p>
        <p>User: {order.user_id}</p>
        <p className="my-2">
          {ticketAmount} tickets, {productAmount} products
        </p>
        <p className="text-base">Total: {order.total_price} </p>
      </div>
    </div>
  );
};

export default Order;
