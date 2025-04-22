import React from "react"
import { Link } from "react-router-dom"

interface NavSelectionProps {
  icon: string
  title: string
  to: string
  isSelected: boolean;
}

const NavSelection: React.FC<NavSelectionProps> = ({ icon, title, to, isSelected }) => {
  return (
    <Link to={to} className={`nav-selection  ${isSelected ? 'selected' : ''} w-[200px] h-[40px] flex items-center space-x-2 p-[2px] rounded-md`}>
      <img src={icon} alt={title} className="w-6 h-6" />
      <span className="text-dark-gray font-medium pl-2">{title}</span>
    </Link>
  )
}

export default NavSelection