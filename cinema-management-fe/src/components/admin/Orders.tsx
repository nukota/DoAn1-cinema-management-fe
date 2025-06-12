import { useEffect, useState } from "react";
import SearchImg from "../../assets/images/search.svg";
import CalendarImg from "../../assets/images/calendar.svg";
import Order from "./items/Order";
import { OrderType } from "../../interfaces/types";
import DetailOrder from "./dialogs/DetailOrder";
import { useOrders } from "../../providers/OrdersProvider";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { confirmDeletion } from "../../utils/confirmDeletion";

const Orders: React.FC = () => {
  const { fetchOrdersData, orders, loading, deleteOrder } = useOrders();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

  const [DetailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await fetchOrdersData();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : String(error));
      }
    };

    fetchOrders();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
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
    setDetailDialogOpen(true);
  };

  const handleDelete = async (orderId: string) => {
    const confirmed = await confirmDeletion(
      "Delete Order",
      "Are you sure you want to delete this order? This action cannot be undone."
    );

    if (confirmed) {
      try {
        await deleteOrder(orderId);
        await fetchOrdersData();
        setDetailDialogOpen(false);
        setSelectedOrder(null);
        toast.success("Order deleted successfully!");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : String(error));
      }
    } else {
      toast.info("Deletion canceled.");
    }
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter((order) => {
    const searchTermLower = searchTerm.toLowerCase();
    const isDateMatch = selectedDate
      ? order.ordered_at && order.ordered_at.startsWith(selectedDate)
      : true;
    const matchesTab = activeTab === "All" || activeTab === order.status;
    const matchesSearch =
      (order._id && order._id.toString().includes(searchTermLower)) ||
      (order.user_id && order.user_id.toString().includes(searchTermLower)) ||
      (order.total_price &&
        order.total_price.toString().includes(searchTermLower)) ||
      (order.ordered_at &&
        order.ordered_at.toString().includes(searchTermLower)) ||
      (order.status && order.status.toLowerCase().includes(searchTermLower));
    return isDateMatch && matchesTab && matchesSearch;
  });

  if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full pt-4">
          <CircularProgress />
          <span className="text-2xl text-gray mt-4">Loading orders...</span>
        </div>
      );
    }

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
          {filteredOrders.map((order) => (
            <Order
              key={order._id}
              order={order}
              handleInfoClick={() => handleInfoClick(order)}
            />
          ))}
        </div>
      </div>
      {selectedOrder && (
        <DetailOrder
          order={selectedOrder}
          open={DetailDialogOpen}
          onClose={handleCloseDialog}
          onDelete={() => handleDelete(selectedOrder._id)}
        />
      )}
    </div>
  );
};

export default Orders;
