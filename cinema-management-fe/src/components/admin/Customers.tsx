import React, { useState } from "react";
import Customer from "./items/Customer";
import SearchImg from "../../assets/images/search.svg";
import CalendarImg from "../../assets/images/calendar.svg";
import { Button } from "@mui/material";
import { exampleCustomers } from "../../data";
import CreateCustomer from "./dialogs/CreateCustomer";
import { UserType } from "../../interfaces/types";
import DetailCustomer from "./dialogs/DetailCustomer";

const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCustomer, setSelectedCustomer] = useState<UserType | null>(
    null
  );
  const [DetailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [AddDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
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

  const handleAddNewClick = () => {
    setAddDialogOpen(true);
  };

  const handleInfoClick = (customer: UserType) => {
    setSelectedCustomer(customer);
    setDetailDialogOpen(true);
  };
  const handleCheckConfirmDelete = (customer: UserType) => {
    setShowDeleteConfirm(true);
    setSelectedCustomer(customer);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setAddDialogOpen(false);
    setSelectedCustomer(null);
  };

  const handleAddNewCustomer = async (newCustomer: UserType) => {};
  const handleOnSave = async (customer: UserType) => {};

  const handlePageChange = (pageNumber: number | string) => {
    if (pageNumber !== "...") setCurrentPage(Number(pageNumber));
  };

  const uniqueEmployees = exampleCustomers.filter(
    (user, index, self) =>
      index === self.findIndex((e) => e._id === user._id)
  );

  const filteredCustomers = uniqueEmployees.filter((user) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (user.fullname &&
        user.fullname.toLowerCase().includes(searchTermLower)) ||
      (user.cccd && user.cccd.toString().includes(searchTermLower)) ||
      (user.role && user.role.toLowerCase().includes(searchTermLower)) ||
      (user.dob && user.dob.includes(searchTermLower))
    );
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCustomers = filteredCustomers.slice(
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
    <div className="customers flex flex-col w-full min-w-[1000px] h-[100%] overflow-x-auto relative">
      <div className="text-40px font-medium text-dark-gray">Customers</div>
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
          <Button
            onClick={handleAddNewClick}
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              ml: { 1270: 2 },
              width: "114px",
              height: "32px",
            }}
          >
            Add New
          </Button>
        </div>
      </div>
      <div className="mt-3 h-full min-h-[568px] w-[calc(100vw - 336px)] bg-white rounded-xl overflow-auto">
        <div className="flex flex-row items-center text-dark-gray text-sm font-medium px-8 pt-3 pb-4">
          <div className="w-[8%] text-base">ID</div>
          <div className="w-[24%] text-base">Name</div>
          <div className="w-[14%] text-base">Role</div>
          <div className="w-[12%] text-base">CCCD</div>
          <div className="w-[22%] text-base">Dob</div>
          <div className="w-[20%] text-base">User Action</div>
        </div>
        <div className="border-b border-light-gray border-1.5" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="-mt-[450px] text-base">
          {currentCustomers.map((customer) => (
            <Customer
              key={customer._id}
              customer={customer}
              handleInfoClick={() => handleInfoClick(customer)}
              handleDeleteClick={() => handleCheckConfirmDelete(customer)}
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
      {selectedCustomer && (
        <DetailCustomer
          open={DetailDialogOpen}
          onClose={handleCloseDialog}
          customer={selectedCustomer!}
          onSave={handleOnSave}
        />
      )}

      <CreateCustomer
        open={AddDialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleAddNewCustomer}
      />
    </div>
  );
};

export default Customers;
