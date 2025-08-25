import React from "react";
import NavSelection from "../../admin/elements/NavSelection";
import HomeImg from "./../../../assets/images/home.svg";
import CinemasImg from "./../../../assets/images/theaters.svg";
import EmployeesImg from "./../../../assets/images/employees.svg";
import CustomersImg from "./../../../assets/images/customers.svg";
import MoviesImg from "./../../../assets/images/movies.svg";
import ProductsImg from "./../../../assets/images/products.svg";
import ShowtimesImg from "./../../../assets/images/showtimes.svg";
import OrdersImg from "./../../../assets/images/orders.svg";
import PaymentsImg from "./../../../assets/images/receipts.svg";

interface NavBarProps {
  locationPath: string;
}

const NavBar: React.FC<NavBarProps> = ({ locationPath }) => {
  return (
    <div className="fixed top-[48px] left-0 z-[999] h-[calc(100vh-48px)] w-56 flex flex-col items-start bg-white">
      <div className="relative flex flex-col py-3 pl-[20px] w-full box-border overflow-hidden">
        <NavSelection
          key="home"
          icon={HomeImg}
          title="Home"
          to="/employee"
          isSelected={locationPath === "/employee"}
        />
        <NavSelection
          key="cinemas"
          icon={CinemasImg}
          title="Cinemas"
          to="/employee/cinemas"
          isSelected={locationPath === "/employee/cinemas"}
        />
        <NavSelection
          key="employees"
          icon={EmployeesImg}
          title="Employees"
          to="/employee/employees"
          isSelected={locationPath === "/employee/employees"}
        />
        <NavSelection
          key="customers"
          icon={CustomersImg}
          title="Customers"
          to="/employee/customers"
          isSelected={locationPath === "/employee/customers"}
        />
        <NavSelection
          key="movies"
          icon={MoviesImg}
          title="Movies"
          to="/employee/movies"
          isSelected={locationPath === "/employee/movies"}
        />
        <NavSelection
          key="products"
          icon={ProductsImg}
          title="Products"
          to="/employee/products"
          isSelected={locationPath === "/employee/products"}
        />
        <NavSelection
          key="showtimes"
          icon={ShowtimesImg}
          title="Showtimes"
          to="/employee/showtimes"
          isSelected={locationPath === "/employee/showtimes"}
        />
        <NavSelection
          key="orders"
          icon={OrdersImg}
          title="Orders"
          to="/employee/orders"
          isSelected={locationPath === "/employee/orders"}
        />
        <NavSelection
          key="payments"
          icon={PaymentsImg}
          title="Payments"
          to="/employee/payments"
          isSelected={locationPath === "/employee/payments"}
        />
      </div>
    </div>
  );
};

export default NavBar;