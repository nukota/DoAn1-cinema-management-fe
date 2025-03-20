import React from "react"
import DeleteImg from "../../../assets/images/delete.svg"
import InfoImg from "../../../assets/images/info.svg"
import { ReviewType } from "../../../types"

const Review: React.FC<ReviewType> = (review) => {
  const handleDeleteClick = () => {
    alert("Delete Btn clicked")
  }
  const handleInfoClick = () => {
    alert("Info Btn clicked")
  }
  return (
    <div
      className="review grid grid-cols-6 h-[45px] px-8 text-gray items-center hover:text-red"
      style={{ gridTemplateColumns: "0.4fr 0.4fr 0.8fr 0.7fr 0.6fr 1.1fr 1fr" }}
    >
      <p className="text-sm font-normal">{review.review_id}</p>
      <p className="text-sm font-normal">{review.showtime_id}</p>
      <p className="text-sm font-normal">{review.user_id}</p>
      <p className="text-sm font-normal">{review.rating}</p>
      <p className="text-sm font-normal">{review.comment}</p>
      <p className="text-sm font-normal">{review.comment}</p>
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

export default Review