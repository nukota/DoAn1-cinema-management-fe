import React from "react"
import DeleteImg from "../../../assets/images/delete.svg"
import InfoImg from "../../../assets/images/info.svg"

interface ReceiptProps {
  Id: number
  date: string
  movie: string
  showtime: string
  items: string
  totalCost: number
}

const Receipt: React.FC<ReceiptProps> = ({ Id, date, movie, showtime, items, totalCost }) => {
  const handleDeleteClick = () => {
    alert("Delete Btn clicked")
  }
  const handleInfoClick = () => {
    alert("Info Btn clicked")
  }
  return (
    <div
      className="employee grid grid-cols-6 h-[45px] px-8 text-gray items-center hover:text-red"
      style={{ gridTemplateColumns: "1.4fr 1.6fr 1.4fr 1.4fr 1.4fr 1.4fr 1.4fr" }}
    >
      <p className="text-sm font-normal">{Id}</p>
      <p className="text-sm font-normal">{date}</p>
      <p className="text-sm font-normal">{movie}</p>
      <p className="text-sm font-normal">{showtime}</p>
      <p className="text-sm font-normal">{items}</p>
      <p className="text-sm font-normal">{totalCost}</p>
      <div className="flex flex-row">
        <button className="info-btn hover:transform hover:-translate-y-1 transition-transform duration-200" onClick={handleInfoClick}>
        <img
          src={InfoImg}
          alt="Info"
          style={{ filter: "brightness(1.3)" }}
          className="w-6 h-6 hover:filter-hover"
        />
        </button>
        <button className="delete-btn ml-2 hover:transform hover:-translate-y-1 transition-transform duration-200" onClick={handleDeleteClick}>
        <img
          src={DeleteImg}
          alt="Delete"
          style={{ filter: "brightness(1.3)" }}
          className="w-6 h-6 hover:filter-hover"
        />
      </button>
      </div>
      
    </div>
  )
}

export default Receipt
