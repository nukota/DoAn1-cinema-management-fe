import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "../admin/elements/Header";
import NavBar from "../admin/elements/NavBar";
import NavSelection from "../admin/elements/NavSelection";
import HomeImg from "../../assets/images/home.svg";
import CustomersImg from "../../assets/images/customers.svg";
import RoomsImg from "../../assets/images/rooms.svg";
import ShowtimesImg from "../../assets/images/showtimes.svg";
import OrdersImg from "../../assets/images/orders.svg";
import PaymentsImg from "./../../assets/images/receipts.svg";
import SettingsImg from "../../assets/images/settings.svg";
import ProfileImg from "./../../assets/images/profile.png";
import { UserType } from "../../interfaces/types";

const exampleEmployee: UserType = {
  user_id: 1,
  fullname: "John Doe",
  email: "john.doe@example.com",
  phone: "123-456-7890",
  password_hash: "hashedpassword1",
  dob: "1990-01-01",
  cccd: "123456789",
  role: "employee",
  created_at: "2023-01-01T10:00:00",
};

const Employee: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState<boolean>(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileVisibility = () => {
    setIsProfileVisible(!isProfileVisible); // Toggle Profile visibility
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {" "}
      {/* Added background color */}
      <div className={`sidebar md:block ${isSidebarOpen ? "block" : "hidden"}`}>
        <NavBar
          topChildren={[
            <NavSelection
              key="home"
              icon={HomeImg}
              title="Home"
              to="/employee"
              isSelected={location.pathname === "/employee"}
            />,
            <NavSelection
              key="rooms"
              icon={RoomsImg}
              title="Rooms"
              to="/employee/rooms"
              isSelected={location.pathname === "/employee/rooms"}
            />,
            <NavSelection
              key="customers"
              icon={CustomersImg}
              title="Customers"
              to="/employee/customers"
              isSelected={location.pathname === "/employee/customers"}
            />,
            <NavSelection
              key="showtimes"
              icon={ShowtimesImg}
              title="Showtimes"
              to="/employee/showtimes"
              isSelected={location.pathname === "/employee/showtimes"}
            />,
            <NavSelection
              key="orders"
              icon={OrdersImg}
              title="Orders"
              to="/employee/orders"
              isSelected={location.pathname === "/employee/orders"}
            />,
            <NavSelection
              key="payments"
              icon={PaymentsImg}
              title="Payments"
              to="/employee/payments"
              isSelected={location.pathname === "/employee/payments"}
            />,
            <NavSelection
              key="settings"
              icon={SettingsImg}
              title="Settings"
              to="/employee/settings"
              isSelected={location.pathname === "/employee/settings"}
            />,
          ]}
          botChildren={[]}
          notificationChildren={[]}
        />
      </div>
      <div className="flex flex-col w-full">
        <Header
          ProfileName={exampleEmployee.fullname}
          ProfileRole={exampleEmployee.role}
          ProfilePic={ProfileImg}
          onArrowDownClick={toggleProfileVisibility}
        />{" "}
        {/* Added header */}
        <div
          className={`content w-full overflow-visible px-12 py-4 mt-[48px] transition-all duration-300 md:ml-[224px] ${
            isSidebarOpen ? "ml-[224px]" : "ml-0"
          }`}
        >
          <Routes>
            <Route path="/" element={<div />} />
            <Route path="/rooms" element={<div />} />
            <Route path="/customers" element={<div />} />
            <Route path="/showtimes" element={<div />} />
            <Route path="/orders" element={<div />} />
            <Route path="/payments" element={<div />} />
            <Route path="/settings" element={<div />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Employee;
