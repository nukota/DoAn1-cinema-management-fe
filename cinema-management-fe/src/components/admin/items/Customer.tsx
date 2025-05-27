import React from "react";
import DeleteImg from "../../../assets/images/delete.svg";
import InfoImg from "../../../assets/images/info.svg";
import { UserType } from "../../../interfaces/types";

interface CustomerProps {
  customer: UserType;
  handleInfoClick: () => void;
  handleDeleteClick: () => void;
}

const Customer: React.FC<CustomerProps> = ({
  customer,
  handleInfoClick,
  handleDeleteClick,
}) => {
  const formattedDateOfBirth = customer.dateOfBirth
    ? new Date(customer.dateOfBirth).toISOString().split("T")[0]
    : "N/A";
    
  return (
    <div
      className="customer grid grid-cols-6 h-[45px] px-8 text-gray items-center hover:text-red"
      style={{ gridTemplateColumns: "0.4fr 1.2fr 0.7fr 0.6fr 1.1fr 1fr" }}
    >
      <p className="text-sm font-normal overflow-ellipsis truncate pr-6">{customer._id}</p>
      <p className="text-sm font-normal overflow-ellipsis truncate pr-6">{customer.full_name}</p>
      <p className="text-sm font-normal overflow-ellipsis truncate pr-6">{customer.phone}</p>
      <p className="text-sm font-normal overflow-ellipsis truncate pr-6">{customer.cccd}</p>
      <p className="text-sm font-normal overflow-ellipsis truncate pr-6">{formattedDateOfBirth}</p>
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
  );
};

export default Customer;
