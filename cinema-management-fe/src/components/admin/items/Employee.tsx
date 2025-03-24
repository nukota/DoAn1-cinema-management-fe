import React from "react";
import DeleteImg from "../../../assets/images/delete.svg";
import InfoImg from "../../../assets/images/info.svg";
import { EmployeeType } from "../../../types";
interface EmployeeProps {
  employee: EmployeeType;
  handleInfoClick: () => void;
  handleDeleteClick: () => void;
}

const Employee: React.FC<EmployeeProps> = ({
  employee,
  handleInfoClick,
  handleDeleteClick,
}) => {
  return (
    <div
      className="employee grid grid-cols-6 h-[45px] px-8 text-gray items-center hover:text-red"
      style={{ gridTemplateColumns: "0.4fr 0.4fr 0.8fr 0.7fr 0.6fr 1.1fr 1fr" }}
    >
      <p className="text-sm font-normal">{employee.employee_id}</p>
      <p className="text-sm font-normal">{employee.cinema_id}</p>
      <p className="text-sm font-normal">{employee.fullname}</p>
      <p className="text-sm font-normal">{employee.dob}</p>
      <p className="text-sm font-normal">{employee.position}</p>
      <p className="text-sm font-normal">{employee.shift}</p>
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

export default Employee;
