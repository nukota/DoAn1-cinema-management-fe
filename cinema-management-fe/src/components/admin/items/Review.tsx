import React from "react";
import DeleteImg from "../../../assets/images/delete.svg";
import InfoImg from "../../../assets/images/info.svg";
import { ReviewType } from "../../../interfaces/types";
import { Rating } from "@mui/material";

interface ReviewProps {
  review: ReviewType;
  handleInfoClick: () => void;
  handleDeleteClick: () => void;
}

const Review: React.FC<ReviewProps> = ({
  review,
  handleInfoClick,
  handleDeleteClick,
}) => {
  return (
    <div
      className="review grid grid-cols-6 h-[45px] px-8 text-gray items-center hover:text-red"
      style={{ gridTemplateColumns: "0.5fr 0.8fr 0.8fr 0.7fr 1.4fr 0.8fr" }}
    >
      <p className="text-sm font-normal truncate pr-4">{review._id}</p>
      <div className="flex flex-col items-start">
        {review.movie ? (
          <>
            <p className="text-sm font-normal truncate pr-4 text-[#dadada]">
              {review.movie.movie_id}
            </p>
            <p className="text-sm font-normal truncate pr-4">
              {review.movie.title}
            </p>
          </>
        ) : (
          <p className="text-sm font-normal truncate pr-4">None</p>
        )}
      </div>
      <>
        {review.user ? (
          <div className="flex flex-col items-start">
            <p className="text-sm font-normal truncate pr-4 text-[#dadada]">
              {review.user.email}
            </p>
            <p className="text-sm font-normal truncate pr-4">
              {review.user.full_name}
            </p>
          </div>
        ) : (
          <p className="text-sm font-normal truncate pr-4">None</p>
        )}
      </>
      <Rating value={review.rating} readOnly />
      <p className="text-sm font-normal truncate pr-4">{review.comment}</p>
      <div className="flex flex-row">
        <button
          className="info-btn hover:transform hover:-translate-y-1 transition-transform duration-200"
          onClick={handleInfoClick}
        >
          <img
            src={InfoImg}
            alt="Info"
            style={{ filter: "brightness(1.3)" }}
            className="w-6 h-6 hover:filter-hover"
          />
        </button>
        <button
          className="delete-btn ml-2 hover:transform hover:-translate-y-1 transition-transform duration-200"
          onClick={handleDeleteClick}
        >
          <img
            src={DeleteImg}
            alt="Delete"
            style={{ filter: "brightness(1.3)" }}
            className="w-6 h-6 hover:filter-hover"
          />
        </button>
      </div>
    </div>
  );
};

export default Review;
