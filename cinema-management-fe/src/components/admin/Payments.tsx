import { useState, ChangeEvent } from "react";
import SearchImg from "../../assets/images/search.svg";
import CalendarImg from "../../assets/images/calendar.svg";
import addImg from "../../assets/images/add.svg";
import Payment from "./items/Payment";
import { examplePayments } from "../../data";

const Payments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const pageRangeDisplayed = 5;

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

  const handleDeleteClick = () => {
    alert("Delete Btn clicked");
  };

  const handleAddNewClick = () => {
    alert("Add New Btn clicked");
  };

  const handlePageChange = (pageNumber: number | string) => {
    if (pageNumber !== "...") setCurrentPage(Number(pageNumber));
  };

  const uniquePayments = examplePayments.filter(
    (payment, index, self) =>
      index === self.findIndex((e) => e.payment_id === payment.payment_id)
  );

  const filteredPayments = uniquePayments.filter((payment) => {
    const searchTermLower = searchTerm.toLowerCase();
    const isDateMatch = selectedDate
      ? payment.paid_at && payment.paid_at.startsWith(selectedDate)
      : true;

    return (
      (isDateMatch && // Filter by selectedDate
        payment.payment_id &&
        payment.payment_id.toString().includes(searchTermLower)) ||
      (payment.order_id &&
        payment.order_id.toString().includes(searchTermLower)) ||
      (payment.payment_method &&
        payment.payment_method.toLowerCase().includes(searchTermLower)) ||
      (payment.paid_at &&
        payment.paid_at.toString().includes(searchTermLower)) ||
      (payment.amount && payment.amount.toString().includes(searchTermLower)) ||
      (payment.status && payment.status.toLowerCase().includes(searchTermLower))
    );
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayments = filteredPayments.slice(
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

  return (
    <div className="payments flex flex-col w-[calc(100vw - 336px)] min-w-[1000px] max-w-[1200px] h-[100%] relative ">
      <div className="text-40px font-medium text-dark-gray">Payments</div>
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
          <button
            className="DeleteBtn mt-2 w-[114px] h-8 border-2 border-red bg-white text-red rounded-md items-center justify-center font-medium tracking-widest hover:bg-transparent duration-200"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
          <button
            className="AddNewBtn mt-2 ml-5 w-[114px] h-8 border-2 border-red bg-red text-white rounded-md items-center justify-center font-medium tracking-widest hover:bg-dark-red hover:border-dark-red duration-200"
            onClick={handleAddNewClick}
          >
            Add New
          </button>
        </div>
      </div>
      <div className="Payments-list mt-3 h-full min-h-[568px] w-[calc(100vw - 336px)] bg-white rounded-xl overflow-auto">
        <div className="flex flex-row items-center text-dark-gray text-sm font-medium px-8 pt-3 pb-4">
          <div className="w-[12%] text-base">Payment ID</div>
          <div className="w-[12%] text-base">Order ID</div>
          <div className="w-[20%] text-base">Amount</div>
          <div className="w-[20%] text-base">Paid at</div>
          <div className="w-[16%] text-base">Status</div>
          <div className="w-[20%] text-base">Payment Action</div>
        </div>
        <div className="border-b border-light-gray border-1.5" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="-mt-[450px] text-base">
          {currentPayments.map((payment) => (
            <Payment key={payment.payment_id} {...payment} />
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
    </div>
  );
};

export default Payments;
