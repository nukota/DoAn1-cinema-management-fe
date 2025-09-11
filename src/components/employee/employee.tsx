import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "../admin/elements/Header";
import NavBar from "../admin/elements/NavBar";
import NavSelection from "../admin/elements/NavSelection";
import OrdersImg from "../../assets/images/orders.svg";
import BuyTicketImg from "../../assets/images/buyTicket.svg";
import PrintTicketImg from "../../assets/images/printTicket.svg";
import ModeratorImg from "../../assets/images/messageQuestion.svg";
import { Button } from "@mui/material";
import Profile from "../admin/Profile";
import BuyTicket from "./BuyTicket";
import PrintTicket from "./PrintTicket";
import Moderator from "./Moderator";
import Orders from "../admin/Orders";

const Employee: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="bg-[#f2f2f2] min-h-screen w-full relative z-[1000] overflow-auto">
      <Header />
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
                key="buy-ticket"
                icon={BuyTicketImg}
                title="Buy Ticket"
                to="/employee/"
                isSelected={location.pathname === "/employee"}
              />,
              <NavSelection
                key="print-ticket"
                icon={PrintTicketImg}
                title="Print Ticket"
                to="/employee/print-ticket"
                isSelected={location.pathname === "/employee/print-ticket"}
              />,
              <NavSelection
                key="moderator"
                icon={ModeratorImg}
                title="Moderate Comments"
                to="/employee/moderator"
                isSelected={location.pathname === "/employee/moderator"}
              />,
              <NavSelection
                key="orders"
                icon={OrdersImg}
                title="Orders"
                to="/employee/orders"
                isSelected={location.pathname === "/employee/orders"}
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
            <Route path="/" element={<BuyTicket />} />
            <Route path="profile" element={<Profile />} />
            <Route path="/print-ticket" element={<PrintTicket />} />
            <Route path="/moderator" element={<Moderator />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Employee;
