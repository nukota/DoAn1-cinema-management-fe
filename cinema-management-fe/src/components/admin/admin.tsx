import { useState } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import AdminHeader from "./Header"
import NavBar from "./NavBar"
import AdminHome from "./Home"
import Cinemas from "./Cinemas"
import Discounts from "./Discounts"
import Orders from "./Orders"
import Customers from "./Customers"
import Employees from "./Employees"
import Payments from "./Payments"
import Products from "./Products"
import Movies from "./Movies"
import Rooms from "./Rooms"
import Settings from "./Settings"
import NavSelection from "./NavSelection"
import ProfileImg from "./../../assets/images/profile.png"
import HomeImg from "./../../assets/images/home.svg"
import EmployeesImg from "./../../assets/images/employees.svg"
import CustomersImg from "./../../assets/images/customers.svg"
import MoviesImg from "./../../assets/images/movies.svg"
import ProductsImg from "./../../assets/images/products.svg"
import RoomsImg from "./../../assets/images/theaters.svg"
import OrdersImg from "./../../assets/images/orders.svg"
import DiscountsImg from "./../../assets/images/discounts.svg"
import PaymentsImg from "./../../assets/images/receipts.svg"
import SettingsImg from "./../../assets/images/settings.svg"
import Login from "./Login"

const Admin: React.FC = () => {
  const [isPopUpVisible, setIsPopUpVisible] = useState<boolean>(false)
  const location = useLocation();

  const handleOpenPopUpClick = () => {
    setIsPopUpVisible(true)
  }

  const handleClosePopUpClick = () => {
    setIsPopUpVisible(false)
  }

  return (
    <div className="bg-[#f2f2f2] min-h-screen w-full relative">
      <AdminHeader
        ProfileName={"Nguyen Van A"}
        ProfileRole={"Admin"}
        ProfilePic={ProfileImg}
      />
      <div className="main-layout flex flex-1 mt-[48px]">
        <NavBar
          topChildren={[
            <NavSelection key="home" icon={HomeImg} title="Home" to="/admin" isSelected={location.pathname === "/admin"}/>,
            <NavSelection key="cinemas" icon={RoomsImg} title="Cinemas" to="/admin/cinemas" isSelected={location.pathname === "/admin/cinemas"}/>,
            <NavSelection key="customers" icon={CustomersImg} title="Customers" to="/admin/customers" isSelected={location.pathname === "/admin/customers"}/>,
            <NavSelection key="employees" icon={EmployeesImg} title="Employees" to="/admin/employees" isSelected={location.pathname === "/admin/employees"}/>,
            <NavSelection key="movies" icon={MoviesImg} title="Movies" to="/admin/movies" isSelected={location.pathname === "/admin/movies"}/>,
            <NavSelection key="products" icon={ProductsImg} title="Products" to="/admin/products" isSelected={location.pathname === "/admin/products"}/>,
            <NavSelection key="orders" icon={OrdersImg} title="Orders" to="/admin/orders" isSelected={location.pathname === "/admin/orders"}/>,
            <NavSelection key="payments" icon={PaymentsImg} title="Payments" to="/admin/payments" isSelected={location.pathname === "/admin/payments"}/>,
            <NavSelection key="discounts" icon={DiscountsImg} title="Discounts" to="/admin/discounts" isSelected={location.pathname === "/admin/discounts"}/>,
          ]}
          notificationChildren={<div className="text-gray">Notification Content</div>}
          botChildren={[
            <NavSelection key="settings" icon={SettingsImg} title="Settings" to="/admin/settings" isSelected={location.pathname === "/admin/settings"}/>,
          ]}
        />
         <div className="content w-[calc(100vw-240px)] ml-60 px-12 py-4 overflow-auto">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="cinemas" element={<Cinemas />} />
            <Route path="customers" element={<Customers />} />
            <Route path="employees" element={<Employees />} />
            <Route path="movies" element={<Movies />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="payments" element={<Payments />} />
            <Route path="discounts" element={<Discounts />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div> 
        <div
          className="fixed top-[3%] left-[20%] bg-gray text-white"
          onClick={handleOpenPopUpClick}
        >
          Open Login
        </div>
      </div>
      {isPopUpVisible && (
        <>
          <div className="overlay"></div>
          <Login
            handleCloseClick={handleClosePopUpClick}
            handleLoginClick={handleClosePopUpClick}
          />
        </>
      )}
    </div>
  )
}

export default Admin