import React, { useEffect, useState } from "react";
import Review from "./items/Review";
import SearchImg from "../../assets/images/search.svg";
import CalendarImg from "../../assets/images/calendar.svg";
import { ReviewType } from "../../interfaces/types";
import DetailReview from "./dialogs/DetailReview";
import { useReviews } from "../../providers/ReviewsProvider";
import { CircularProgress } from "@mui/material";

const Reviews: React.FC = () => {
  const { reviews, fetchReviewsData, loading } = useReviews();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedReview, setSelectedReview] = useState<ReviewType | null>(null);
  const [DetailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const itemsPerPage = 10;
  const pageRangeDisplayed = 5;

  useEffect(() => {
    fetchReviewsData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    setCurrentPage(1);
  };

  const handleCalendarClick = () => {
    const datePicker = document.getElementById(
      "date-picker"
    ) as HTMLInputElement;
    datePicker.focus();
  };

  const handlePageChange = (pageNumber: number | string) => {
    if (pageNumber !== "...") setCurrentPage(Number(pageNumber));
  };

  const handleInfoClick = (review: ReviewType) => {
    setSelectedReview(review);
    setDetailDialogOpen(true);
  };
  const handleCheckConfirmDelete = (review: ReviewType) => {
    setShowDeleteConfirm(true);
    setSelectedReview(review);
  };
  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setSelectedReview(null);
  };

  const filteredReviews = reviews.filter((review) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (review._id && review._id.toString().includes(searchTermLower)) ||
      (review.movie_id &&
        review.movie_id.toString().includes(searchTermLower)) ||
      (review.user_id && review.user_id.toString().includes(searchTermLower)) ||
      (review.comment && review.comment.toLowerCase().includes(searchTermLower))
    );
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReviews = filteredReviews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const startPage = Math.max(
      1,
      currentPage - Math.floor(pageRangeDisplayed / 2)
    );
    const endPage = Math.min(totalPages, startPage + pageRangeDisplayed - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    if (
      pageNumbers.length < pageRangeDisplayed &&
      pageRangeDisplayed < totalPages
    ) {
      if (startPage > 1) pageNumbers.unshift("...");
      else if (endPage < totalPages) pageNumbers.push("...");
    }
    return pageNumbers;
  };

  if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full pt-4">
          <CircularProgress />
          <span className="text-2xl text-gray mt-4">Loading reviews...</span>
        </div>
      );
    }

  return (
    <div className="reviews flex flex-col w-full min-w-[1000px] h-[100%] relative ">
      <div className="text-40px font-medium text-dark-gray">Reviews</div>
      <div className="flex flex-col 1270-break-point:flex-row">
        <div className="flex flex-row items-center">
          <div className="SearchBar relative w-full max-w-[240px] h-8 mt-2">
            <input
              type="text"
              className="size-full pl-10 pr-5 text-sm text-dark-gray rounded-full text-gray-700 bg-white border-line-gray border-2 focus:outline-none focus:ring-1"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <img
              src={SearchImg}
              alt="Search"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4"
            />
          </div>
          <div className="DateFilterBar relative ml-5 w-full max-w-[240px] h-8 mt-2">
            <input
              type="date"
              id="date-picker"
              className="w-full h-full pr-5 pl-10 text-sm text-red rounded-full text-gray-700 bg-white border-red border-2 focus:outline-none focus:ring-1"
              value={selectedDate}
              onChange={handleDateChange}
            />
            <img
              src={CalendarImg}
              alt="Calendar"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer"
              style={{
                filter:
                  "invert(10%) sepia(88%) saturate(6604%) hue-rotate(352deg) brightness(73%) contrast(105%)",
              }}
              onClick={handleCalendarClick}
            />
          </div>
        </div>
        <div className="flex flex-row items-center 1270-break-point:ml-auto">
          {/* <Button
            onClick={handleAddNewClick}
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              ml: {1270: 2},
              width: "114px",
              height: "32px",
            }}
          >
            Add New
          </Button> */}
        </div>
      </div>
      <div className="Reviews-list mt-3 h-full min-h-[568px] w-[calc(100vw - 336px)] bg-white rounded-xl overflow-auto">
        <div className="flex flex-row items-center text-dark-gray text-sm font-medium px-8 pt-3 pb-4">
          <div className="w-[14%] text-base">Review ID</div>
          <div className="w-[14%] text-base">Movie ID</div>
          <div className="w-[14%] text-base">User ID</div>
          <div className="w-[14%] text-base">Rating</div>
          <div className="w-[28%] text-base">Comment</div>
          <div className="w-[16%] text-base">Review Action</div>
        </div>
        <div className="border-b border-light-gray border-1.5" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="-mt-[450px] text-base">
          {currentReviews.map((review) => (
            <Review
              key={review.user_id}
              review={review}
              handleInfoClick={() => handleInfoClick(review)}
              handleDeleteClick={() => handleCheckConfirmDelete(review)}
            />
          ))}
        </div>
        <div className="pagination-controls text-white absolute bottom-8 right-24 items-center justify-center">
          {currentPage > 1 && (
            <button
              className="pagination-btn right-56"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          )}
          <div className="absolute right-14 flex">
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`page-number-btn ${
                  currentPage === pageNumber ? "active" : ""
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          {currentPage < totalPages && (
            <button
              className="pagination-btn right-0"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          )}
        </div>
      </div>
      {selectedReview && (
        <DetailReview
          review={selectedReview}
          open={DetailDialogOpen}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
};

export default Reviews;
