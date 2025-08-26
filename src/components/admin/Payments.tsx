import React, { useEffect } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { usePayments } from "../../providers/PaymentsProvider";
import CustomDataGrid from "./elements/DataGrid";

const Payments: React.FC = () => {
  const { payments, fetchPaymentsData, loading } = usePayments();

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const uniquePayments = payments.filter(
    (payment, index, self) =>
      index === self.findIndex((e) => e._id === payment._id)
  );

  const columns: GridColDef[] = [
    { field: "_id", headerName: "Payment ID", width: 120 },
    { field: "order_id", headerName: "Order ID", width: 120 },
    {
      field: "amount",
      headerName: "Amount",
      width: 140,
      valueFormatter: (value: any) => `$${value?.toFixed(2) || "0.00"}`,
    },
    { field: "payment_method", headerName: "Payment Method", width: 180 },
    { field: "discount_id", headerName: "Discount ID", width: 140 },
    {
      field: "paid_at",
      headerName: "Paid at",
      flex: 1,
      minWidth: 200,
      valueFormatter: (value: any) =>
        value ? new Date(value).toLocaleString() : "N/A",
    },
  ];

  if (loading) {
    return (
      <CustomDataGrid
        title="Payments Management"
        loading={true}
        loadingMessage="Loading payments..."
        rows={[]}
        columns={columns}
        showCheckboxSelection={false}
      />
    );
  }

  return (
    <CustomDataGrid
      title="Payments Management"
      loading={loading}
      loadingMessage="Loading payments..."
      rows={uniquePayments}
      columns={columns}
      showCheckboxSelection={false}
      getRowId={(row) => row._id}
    />
  );
};

export default Payments;
