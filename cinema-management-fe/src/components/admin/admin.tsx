import { useState } from "react"
import { Route, Routes } from "react-router-dom"
import AdminHeader from "./Header"
import NavBar from "./NavBar"
import AdminHome from "./Home"
import Users from "./Users"
import Receipts from "./Receipts"
import Products from "./Products"
import Movies from "./Movies"
import Theaters from "./Theaters"
import Settings from "./Settings"
import NavSelection from "./NavSelection"
import ProfileImg from "./../../assets/images/profile.png"
import HomeImg from "./../../assets/images/home.svg"
import EmployeesImg from "./../../assets/images/employees.svg"
import MoviesImg from "./../../assets/images/movies.svg"
import ProductsImg from "./../../assets/images/products.svg"
import TheatersImg from "./../../assets/images/theaters.svg"
import ReceiptsImg from "./../../assets/images/receipts.svg"
import SettingsImg from "./../../assets/images/settings.svg"
import Login from "./Login"

const Admin: React.FC = () => {
  const [isPopUpVisible, setIsPopUpVisible] = useState<boolean>(false)

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
      <div className="main-layout flex flex-1 mt-[60px]">
        <NavBar
          topChildren={[
            <NavSelection key="home" icon={HomeImg} title="Home" to="/admin" />,
            <NavSelection key="users" icon={EmployeesImg} title="Users" to="/admin/users" />,
            <NavSelection key="movies" icon={MoviesImg} title="Movies" to="/admin/movies" />,
            <NavSelection key="products" icon={ProductsImg} title="Products" to="/admin/products" />,
            <NavSelection key="theaters" icon={TheatersImg} title="Theaters" to="/admin/theaters" />,
            <NavSelection key="receipts" icon={ReceiptsImg} title="Receipts" to="/admin/receipts" />,
          ]}
          notificationChildren={<div className="text-gray">Notification Content</div>}
          botChildren={[
            <NavSelection key="settings" icon={SettingsImg} title="Settings" to="settings" />,
          ]}
        />
         <div className="content w-[calc(100vw-240px)] ml-60 px-12 py-4 overflow-auto">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="users" element={<Users />} />
            <Route path="movies" element={<Movies />} />
            <Route path="products" element={<Products />} />
            <Route path="theaters" element={<Theaters />} />
            <Route path="receipts" element={<Receipts />} />
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