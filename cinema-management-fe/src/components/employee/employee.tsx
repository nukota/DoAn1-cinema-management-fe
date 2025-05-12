import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "../admin/elements/Header";
import NavBar from "../admin/elements/NavBar";
import NavSelection from "../admin/elements/NavSelection";
import HomeImg from "../../assets/images/home.svg";
import ShowtimesImg from "../../assets/images/showtimes.svg";
import OrdersImg from "../../assets/images/orders.svg";
import PaymentsImg from "./../../assets/images/receipts.svg";
import SettingsImg from "../../assets/images/settings.svg";
import ProfileImg from "./../../assets/images/profile.png";
import { UserType } from "../../interfaces/types";
import EmployeeHome from "./Home";
import { Button } from "@mui/material";

const exampleEmployee: UserType = {
  _id: "1",
  full_name: "John Doe",
  email: "john.doe@example.com",
  phone: "123-456-7890",
  password_hash: "hashedpassword1",
  dateOfBirth: "1990-01-01",
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

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleProfileVisibility = () => {
    setIsProfileVisible(!isProfileVisible); // Toggle Profile visibility
  };

  return (
    <div className="bg-[#f2f2f2] min-h-screen w-full relative z-[1000] overflow-auto">
      <Header
        ProfileName={exampleEmployee.full_name}
        ProfileRole={exampleEmployee.role}
        ProfilePic={ProfileImg}
        onArrowDownClick={toggleProfileVisibility}
      />{" "}
      {/* Added header */}
      <div className="sidebar-toggle z-[1000] fixed md:hidden block">
        <Button
          sx={{
            height: "48px",
            minWidth: "48px",
            fontSize: "24px",
            color: "#B80007",
          }}
          onClick={toggleSidebar}
        >
          ☰
        </Button>
      </div>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 md:opacity-0 transition-opacity duration-300 ease-in-out z-0 ${
          isSidebarOpen ? "opacity-100 z-[998] " : "opacity-0"
        }`}
        onClick={closeSidebar}
      ></div>
      <div className="main-layout flex flex-1 mt-[0px]">
        <div
          className={`sidebar md:block ${isSidebarOpen ? "block" : "hidden"}`}
        >
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
        <div
          className={`content w-full px-12 py-4 mt-[48px] transition-all duration-300 md:ml-[224px] ${
            isSidebarOpen ? "ml-[224px]" : "ml-0"
          }`}
        >
          <Routes>
            <Route path="/" element={<EmployeeHome />} />
            <Route path="/customers" element={<div />} />
            <Route path="/showtimes" element={<div />} />s
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
