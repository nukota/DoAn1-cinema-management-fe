import { useState, ChangeEvent, useEffect } from "react";
import SearchImg from "../../assets/images/search.svg";
import CalendarImg from "../../assets/images/calendar.svg";
import { Button, CircularProgress } from "@mui/material";
import Discount from "./items/Discount";
import { DiscountType } from "../../interfaces/types";
import CreateDiscount from "./dialogs/CreateDiscount";
import { useDiscounts } from "../../providers/DiscountsProvider";
import DetailDiscount from "./dialogs/DetailDiscount";
import { toast } from "react-toastify";

const Discounts: React.FC = () => {
  const {
    discounts,
    fetchDiscountsData,
    updateDiscount,
    deleteDiscount,
    createDiscount,
    loading,
  } = useDiscounts();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountType | null>(
    null
  );

  const [AddDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [DetailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const itemsPerPage = 10;
  const pageRangeDisplayed = 5;

  useEffect(() => {
    fetchDiscountsData();
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

  const handleAddNewClick = () => {
    setAddDialogOpen(true);
  };

  const handleInfoClick = (discount: DiscountType) => {
    setSelectedDiscount(discount);
    setDetailDialogOpen(true);
  };

  const handleDeleteDiscount = async (discountId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this discount?"
    );
    if (!confirmed) return;
    try {
      await deleteDiscount(discountId);
      await fetchDiscountsData();
      handleCloseDialog();
      toast.success("Discount deleted successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
  };

  const handleOnSave = async (newDiscount: DiscountType): Promise<boolean> => {
    try {
      await updateDiscount(newDiscount);
      await fetchDiscountsData();
      handleCloseDialog();
      toast.success("Discount updated successfully!");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const handleCloseDialog = () => {
    setAddDialogOpen(false);
    setSelectedDiscount(null);
  };

  const handleAddNewDiscount = async (newDiscount: DiscountType): Promise<boolean> => {
    try {
      await createDiscount(newDiscount);
      await fetchDiscountsData();
      handleCloseDialog();
      toast.success("Discount added successfully!");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const handlePageChange = (pageNumber: number | string) => {
    if (pageNumber !== "...") setCurrentPage(Number(pageNumber));
  };

  const uniqueDiscounts = discounts.filter(
    (discount, index, self) =>
      index === self.findIndex((e) => e._id === discount._id)
  );

  const filteredDiscounts = uniqueDiscounts.filter((discount) => {
    const searchTermLower = searchTerm.toLowerCase();
    const isDateMatch = selectedDate
      ? discount.expiry_date && discount.expiry_date.startsWith(selectedDate)
      : true;

    return (
      (isDateMatch && // Filter by selectedDate
        discount._id &&
        discount._id.toString().includes(searchTermLower)) ||
      (discount.code &&
        discount.code.toLowerCase().includes(searchTermLower)) ||
      (discount.discount_type &&
        discount.discount_type.toLowerCase().includes(searchTermLower)) ||
      (discount.value && discount.value.toString().includes(searchTermLower)) ||
      (discount.min_purchase &&
        discount.min_purchase.toString().includes(searchTermLower)) ||
      (discount.expiry_date &&
        discount.expiry_date.toString().includes(searchTermLower))
    );
  });

  const totalPages = Math.ceil(filteredDiscounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDiscounts = filteredDiscounts.slice(
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
          <span className="text-2xl text-gray mt-4">Loading discounts...</span>
        </div>
      );
    }
  
  return (
    <div className="discounts flex flex-col w-full min-w-[1000px] h-[100%] relative ">
      <div className="text-40px font-medium text-dark-gray">Discounts</div>
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
      <div className="discounts-list mt-3 h-full min-h-[568px] w-[calc(100vw - 336px)] bg-white rounded-xl overflow-auto">
        <div className="flex flex-row items-center text-dark-gray text-sm font-medium px-8 pt-3 pb-4">
          <div className="w-[8%] text-base">ID</div>
          <div className="w-[12%] text-base">CODE</div>
          <div className="w-[12%] text-base">Type</div>
          <div className="w-[12%] text-base">Value</div>
          <div className="w-[12%] text-base">Min Purchase</div>
          <div className="w-[12%] text-base">Max Usage</div>
          <div className="w-[20%] text-base">Expiry Date</div>
          <div className="w-[12%] text-base">Action</div>
        </div>
        <div className="border-b border-light-gray border-1.5" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="-mt-[450px] text-base">
          {currentDiscounts.map((discount) => (
            <Discount
              discount={discount}
              handleInfoClick={() => handleInfoClick(discount)}
              handleDeleteClick={() => handleDeleteDiscount(discount._id)}
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
      {selectedDiscount && (
        <DetailDiscount
          discount={selectedDiscount}
          open={DetailDialogOpen}
          onSave={handleOnSave}
          onClose={handleCloseDialog}
        />
      )}
      <CreateDiscount
        open={AddDialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleAddNewDiscount}
      />
    </div>
  );
};

export default Discounts;
