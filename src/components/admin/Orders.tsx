import { useEffect, useState } from "react";
import Order from "./items/Order";
import { OrderType } from "../../interfaces/types";
import DetailOrder from "./dialogs/DetailOrder";
import { useOrders } from "../../providers/OrdersProvider";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { confirmDeletion } from "../../utils/confirmDeletion";
import CustomTabs from "./elements/Tabs";

const Orders: React.FC = () => {
  const { fetchOrdersData, orders, loading, deleteOrder } = useOrders();
  const [activeTab, setActiveTab] = useState<string>("All");
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

  const orderTabs = [
    { label: "All", value: "All" },
    { label: "Completed", value: "completed" },
    { label: "Pending", value: "pending" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <>
      <CustomTabs
        title="Orders"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={orderTabs}
        loading={loading}
        data={orders}
        gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        gap="gap-2"
        searchColumns={[
          "_id",
          "user_id",
          "total_price",
          "ordered_at",
          "status",
        ]}
        dateColumns={["ordered_at"]}
      >
        {(filteredOrders: OrderType[]) =>
          filteredOrders.map((order) => (
            <Order
              key={order._id}
              order={order}
              handleInfoClick={() => handleInfoClick(order)}
            />
          ))
        }
      </CustomTabs>
      {selectedOrder && (
        <DetailOrder
          order={selectedOrder}
          open={DetailDialogOpen}
          onClose={handleCloseDialog}
          onDelete={() => handleDelete(selectedOrder._id)}
        />
      )}
    </>
  );
};

export default Orders;
