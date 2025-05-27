import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./elements/Header";
import NavBar from "./elements/NavBar";
import AdminHome from "./Home";
import Cinemas from "./Cinemas";
import Discounts from "./Discounts";
import Orders from "./Orders";
import Customers from "./Customers";
import Employees from "./Employees";
import Payments from "./Payments";
import Products from "./Products";
import Movies from "./Movies";
// import Rooms from "./Rooms";
import Reviews from "./Reviews";
import Settings from "./Settings";
import NavSelection from "./elements/NavSelection";
import HomeImg from "./../../assets/images/home.svg";
import EmployeesImg from "./../../assets/images/employees.svg";
import CustomersImg from "./../../assets/images/customers.svg";
import MoviesImg from "./../../assets/images/movies.svg";
import ProductsImg from "./../../assets/images/products.svg";
import CinemasImg from "./../../assets/images/theaters.svg";
import ShowtimesImg from "./../../assets/images/showtimes.svg";
import RoomsImg from "./../../assets/images/rooms.svg";
import OrdersImg from "./../../assets/images/orders.svg";
import DiscountsImg from "./../../assets/images/discounts.svg";
import PaymentsImg from "./../../assets/images/receipts.svg";
import SettingsImg from "./../../assets/images/settings.svg";
import ReviewsImg from "./../../assets/images/customerRatings.svg";
import { Button } from "@mui/material";
import Rooms from "./Rooms";
import Showtimes from "./Showtimes";
import Profile from "./Profile";

const Admin: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
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
                to="/admin"
                isSelected={location.pathname === "/admin"}
              />,
              <NavSelection
                key="cinemas"
                icon={CinemasImg}
                title="Cinemas"
                to="/admin/cinemas"
                isSelected={location.pathname === "/admin/cinemas"}
              />,
              <NavSelection
                key="rooms"
                icon={RoomsImg}
                title="Rooms"
                to="/admin/rooms"
                isSelected={location.pathname === "/admin/rooms"}
              />,
              <NavSelection
                key="customers"
                icon={CustomersImg}
                title="Customers"
                to="/admin/customers"
                isSelected={location.pathname === "/admin/customers"}
              />,
              <NavSelection
                key="employees"
                icon={EmployeesImg}
                title="Employees"
                to="/admin/employees"
                isSelected={location.pathname === "/admin/employees"}
              />,
              <NavSelection
                key="movies"
                icon={MoviesImg}
                title="Movies"
                to="/admin/movies"
                isSelected={location.pathname === "/admin/movies"}
              />,
              <NavSelection
                key="products"
                icon={ProductsImg}
                title="Products"
                to="/admin/products"
                isSelected={location.pathname === "/admin/products"}
              />,
              <NavSelection
                key="Showtimes"
                icon={ShowtimesImg}
                title="Showtimes"
                to="/admin/showtimes"
                isSelected={location.pathname === "/admin/showtimes"}
              />,
              <NavSelection
                key="orders"
                icon={OrdersImg}
                title="Orders"
                to="/admin/orders"
                isSelected={location.pathname === "/admin/orders"}
              />,
              <NavSelection
                key="payments"
                icon={PaymentsImg}
                title="Payments"
                to="/admin/payments"
                isSelected={location.pathname === "/admin/payments"}
              />,
              <NavSelection
                key="discounts"
                icon={DiscountsImg}
                title="Discounts"
                to="/admin/discounts"
                isSelected={location.pathname === "/admin/discounts"}
              />,
              <NavSelection
                key="reviews"
                icon={ReviewsImg}
                title="Reviews"
                to="/admin/reviews"
                isSelected={location.pathname === "/admin/reviews"}
              />,
            ]}
            notificationChildren={
              <div className="text-gray">Notification Content</div>
            }
            botChildren={[
              <NavSelection
                key="settings"
                icon={SettingsImg}
                title="Settings"
                to="/admin/settings"
                isSelected={location.pathname === "/admin/settings"}
              />,
            ]}
          />
        </div>
        <div
          className={`content w-full overflow-visible px-12 py-4 mt-[48px] transition-all duration-300 md:ml-[224px] ${
            isSidebarOpen ? "ml-[224px]" : "ml-0"
          }`}
        >
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="cinemas" element={<Cinemas />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="customers" element={<Customers />} />
            <Route path="employees" element={<Employees />} />
            <Route path="movies" element={<Movies />} />
            <Route path="products" element={<Products />} />
            <Route path="showtimes" element={<Showtimes />} />
            <Route path="orders" element={<Orders />} />
            <Route path="payments" element={<Payments />} />
            <Route path="discounts" element={<Discounts />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
