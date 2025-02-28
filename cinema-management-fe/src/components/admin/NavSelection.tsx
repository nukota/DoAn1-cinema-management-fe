import React from "react"
import { Link } from "react-router-dom"

interface NavSelectionProps {
  icon: string
  title: string
  to: string
}

const NavSelection: React.FC<NavSelectionProps> = ({ icon, title, to }) => {
  return (
    <Link to={to} className="nav-selection w-[200px] h-[40px] flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-md">
      <img src={icon} alt={title} className="w-6 h-6" style={{ filter: "brightness(0.1)" }} />
      <span className="text-dark-gray font-medium pl-2">{title}</span>
    </Link>
  )
}

export default NavSelection