import React, { useState, ChangeEvent } from "react"
import Receipt from "./items/Receipt"
import SearchImg from "../../assets/images/search.svg"
import CalendarImg from "../../assets/images/calendar.svg"
import { exampleReceipts } from "../../data"

const Receipts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10
  const pageRangeDisplayed = 5

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value)
    setCurrentPage(1)
  }

  const handleCalendarClick = () => {
    document.getElementById("date-picker")?.focus()
  }

  const handleDeleteClick = () => {
    alert("Delete Btn clicked")
  }

  const handleAddNewClick = () => {
    alert("Add New Btn clicked")
  }

  const handlePageChange = (pageNumber: number | string) => {
    if (pageNumber !== "...") setCurrentPage(Number(pageNumber))
  }

  const uniqueReceipts = exampleReceipts.filter(
    (receipt, index, self) =>
      index === self.findIndex((r) => r.receipt_id === receipt.receipt_id)
  )

  const filteredReceipts = uniqueReceipts.filter((receipt) => {
    const searchTermLower = searchTerm.toLowerCase()
    return (
      (receipt.movie && receipt.movie.toLowerCase().includes(searchTermLower)) ||
      (receipt.date && receipt.date.toLowerCase().includes(searchTermLower)) ||
      (receipt.items && receipt.items.toLowerCase().includes(searchTermLower)) ||
      (receipt.totalCost && receipt.totalCost.toString().includes(searchTermLower))
    )
  })

  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentReceipts = filteredReceipts.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = []
    const startPage = Math.max(
      1,
      currentPage - Math.floor(pageRangeDisplayed / 2)
    )
    const endPage = Math.min(totalPages, startPage + pageRangeDisplayed - 1)
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }
    if (pageNumbers.length < pageRangeDisplayed && pageRangeDisplayed < totalPages) {
      if (startPage > 1) pageNumbers.unshift("...")
      else if (endPage < totalPages) pageNumbers.push("...")
    }
    return pageNumbers
  }

  return (
    <div className="receipts flex flex-col w-[calc(100vw - 336px)] min-w-[1000px] max-w-[1200px] h-[100%] relative ">
      <div className="text-40px font-medium text-light-gray">Receipts</div>
      <div className="flex flex-row items-center">
        <div className="SearchBar relative w-full max-w-[240px] h-8 mt-2">
          <input
            type="text"
            className="size-full pl-10 pr-5 text-sm text-gray rounded-full text-gray-700 bg-black border-light-gray border-2 focus:outline-none focus:ring-1"
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
            className="w-full h-full pr-5 pl-10 text-sm text-red rounded-full text-gray-700 bg-black border-red border-2 focus:outline-none focus:ring-1"
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
        <button
          className="DeleteBtn mt-2 ml-auto w-[114px] h-8 border-2 border-red text-red rounded-md items-center justify-center font-medium tracking-widest hover:transform hover:-translate-y-1 transition-transform duration-200"
          onClick={handleDeleteClick}
        >
          Delete
        </button>
        <button
          className="AddNewBtn mt-2 ml-5 w-[114px] h-8 border-2 border-red bg-red text-black rounded-md items-center justify-center font-medium tracking-widest hover:transform hover:-translate-y-1 transition-transform duration-200"
          onClick={handleAddNewClick}
        >
          Add New
        </button>
      </div>
      <div className="receipts-list relative mt-3 h-full min-h-[568px] w-[calc(100vw - 336px)] bg-black rounded-xl overflow-auto">
        <div className="flex flex-row items-center text-light-gray text-sm font-medium px-8 pt-3 pb-4">
          <div className="w-[14%] text-base">ID</div>
          <div className="w-[16%] text-base">Date</div>
          <div className="w-[14%] text-base">Movie</div>
          <div className="w-[14%] text-base">Showtime</div>
          <div className="w-[14%] text-base">Items</div>
          <div className="w-[14%] text-base">Total cost</div>
          <div className="w-[14%] text-base">Use Action</div>
        </div>
        <div className="border-b border-light-gray border-1.5" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-dark-gray" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-dark-gray" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-dark-gray" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-dark-gray" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-dark-gray" />
        <div className="-mt-[450px] text-base">
          {currentReceipts.map((receipt) => (
            <Receipt key={receipt.receipt_id} {...receipt} />
          ))}
        </div>
        <div className="pagination-controls absolute bottom-5 right-36 text-white">
          {currentPage > 1 && (
            <button
              className="pagination-btn absolute right-[164px] text-gray font-semibold"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          )}
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
          {currentPage < totalPages && (
            <button
              className="pagination-btn absolute -right-14 text-gray font-semibold"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Receipts