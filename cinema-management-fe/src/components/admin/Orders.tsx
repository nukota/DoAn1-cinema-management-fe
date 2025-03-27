import { useState, ChangeEvent } from "react";
import SearchImg from "../../assets/images/search.svg";
import CalendarImg from "../../assets/images/calendar.svg";
import Order from "./items/Order";
import {
  exampleOrders,
  exampleTickets,
  exampleOrderProducts,
} from "../../data";
import { OrderProductType, OrderType, TicketType } from "../../types";
import DetailOrder from "./dialogs/DetailOrder";

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [tickets, setTickets] = useState<TicketType[] | null>(null);
  const [products, setProducts] = useState<OrderProductType[] | null>(null);

  const [DetailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
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

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleInfoClick = (order: OrderType) => {
    setSelectedOrder(order);
    setTickets(exampleTickets.filter((ticket) => ticket.order_id === selectedOrder?.order_id));
    setProducts(exampleOrderProducts.filter((product) => product.order_id === selectedOrder?.order_id));
    setDetailDialogOpen(true);
  };
  const handleCheckConfirmDelete = (order: OrderType) => {
    setShowDeleteConfirm(true);
    setSelectedOrder(order);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setSelectedOrder(null);
  };

  const handlePageChange = (pageNumber: number | string) => {
    if (pageNumber !== "...") setCurrentPage(Number(pageNumber));
  };

  const uniqueOrders = exampleOrders.filter(
    (order, index, self) =>
      index === self.findIndex((e) => e.order_id === order.order_id)
  );

  const filteredOrders = uniqueOrders.filter((order) => {
    const searchTermLower = searchTerm.toLowerCase();
    const isDateMatch = selectedDate
      ? order.created_at && order.created_at.startsWith(selectedDate)
      : true;
    const matchesTab = activeTab === "All" || activeTab === order.status;
    const matchesSearch =
      (order.order_id && order.order_id.toString().includes(searchTermLower)) ||
      (order.user_id && order.user_id.toString().includes(searchTermLower)) ||
      (order.total_price &&
        order.total_price.toString().includes(searchTermLower)) ||
      (order.created_at &&
        order.created_at.toString().includes(searchTermLower)) ||
      (order.status && order.status.toLowerCase().includes(searchTermLower));
    return isDateMatch && matchesTab && matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
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
    <div className="orders flex flex-col h-[673px] overflow-y-visible scrollbar-hide relative ">
      <div className="text-40px font-medium text-dark-gray">Orders</div>
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
      </div>
      <div className="product-tabs flex mt-4 z-20">
        <button
          className={`tab ${activeTab === "All" ? "active" : ""}`}
          onClick={() => handleTabClick("All")}
        >
          <span>All</span>
        </button>

        <button
          className={`tab ${activeTab === "Completed" ? "active" : ""}`}
          onClick={() => handleTabClick("completed")}
        >
          <span>Completed</span>
        </button>
        <button
          className={`tab ${activeTab === "Pending" ? "active" : ""}`}
          onClick={() => handleTabClick("pending")}
        >
          <span>Pending</span>
        </button>
        <button
          className={`tab ${activeTab === "Cancelled" ? "active" : ""}`}
          onClick={() => handleTabClick("cancelled")}
        >
          <span>Cancelled</span>
        </button>
      </div>
      <div className="relative -mt-[2px] min-w-[360px] sm:min-w-[640px] w-full h-full bg-white border-[2px] border-light-gray rounded-b-xl rounded-tr-xl rounded-tl-none pl-3 py-3 pr-3">
        <div className="list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 max-h-[510px] py-3 overflow-y-auto overflow-x-clip">
          {filteredOrders.map((order, index) => (
            <Order
              key={order.order_id}
              order={order}
              ticketAmount={1}
              productAmount={1}
              handleInfoClick={() => handleInfoClick(order)}
              handleDeleteClick={() => handleCheckConfirmDelete(order)}
            />
          ))}
        </div>
        {/* <button
          className="absolute bottom-6 right-9 size-11 rounded-2xl bg-red hover:bg-dark-red duration-200 z-20"
          onClick={handleAddNewClick}
        >
          <img
            className="size-11 invert brightness-0"
            src={addImg}
            alt="Add New"
          />
        </button> */}
      </div>
      {selectedOrder && (
        <DetailOrder
          order={selectedOrder}
          tickets={tickets!}
          products={products!}
          open={DetailDialogOpen}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
};

export default Orders;
