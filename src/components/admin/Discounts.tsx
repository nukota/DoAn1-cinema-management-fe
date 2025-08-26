import React, { useState, useEffect } from "react";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { DiscountType } from "../../interfaces/types";
import CreateDiscount from "./dialogs/CreateDiscount";
import { useDiscounts } from "../../providers/DiscountsProvider";
import DetailDiscount from "./dialogs/DetailDiscount";
import { toast } from "react-toastify";
import { confirmDeletion } from "../../utils/confirmDeletion";
import CustomDataGrid from "./elements/DataGrid";
import { InfoOutlined } from "@mui/icons-material";

const Discounts: React.FC = () => {
  const {
    discounts,
    fetchDiscountsData,
    updateDiscount,
    deleteDiscount,
    createDiscount,
    loading,
  } = useDiscounts();
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountType | null>(
    null
  );
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [AddDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [DetailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchDiscountsData();
  }, []);

  const handleAddNewClick = () => {
    setAddDialogOpen(true);
  };

  const handleInfoClick = (discount: DiscountType) => {
    setSelectedDiscount(discount);
    setDetailDialogOpen(true);
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) {
      toast.info("No discounts selected for deletion.");
      return;
    }

    const confirmed = await confirmDeletion(
      "Delete Selected Discounts",
      `Are you sure you want to delete ${selectedRows.length} discount(s)? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        const deletePromises = selectedRows.map((id) => deleteDiscount(id));
        await Promise.all(deletePromises);
        await fetchDiscountsData();
        setSelectedRows([]);
        toast.success(
          `${selectedRows.length} discount(s) deleted successfully!`
        );
      } catch (error) {
        toast.error(error instanceof Error ? error.message : String(error));
      }
    } else {
      toast.info("Deletion canceled.");
    }
  };

  const handleOnSave = async (newDiscount: DiscountType): Promise<boolean> => {
    try {
      await updateDiscount(newDiscount);
      setSelectedDiscount(newDiscount);
      await fetchDiscountsData();
      toast.success("Discount updated successfully!");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const handleCloseDialog = () => {
    setAddDialogOpen(false);
    setDetailDialogOpen(false);
    setSelectedDiscount(null);
  };

  const handleAddNewDiscount = async (
    newDiscount: DiscountType
  ): Promise<boolean> => {
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

  const uniqueDiscounts = discounts.filter(
    (discount, index, self) =>
      index === self.findIndex((e) => e._id === discount._id)
  );

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 100 },
    { field: "code", headerName: "CODE", width: 120 },
    { field: "discount_type", headerName: "Type", width: 100 },
    {
      field: "value",
      headerName: "Value",
      width: 100,
      valueFormatter: (value: any) =>
        value
          ? `${value}${typeof value === "number" && value <= 1 ? "%" : ""}`
          : "N/A",
    },
    {
      field: "min_purchase",
      headerName: "Min Purchase",
      width: 140,
      valueFormatter: (value: any) => (value ? `$${value}` : "N/A"),
    },
    { field: "max_usage", headerName: "Max Usage", width: 120 },
    {
      field: "expiry_date",
      headerName: "Expiry Date",
      width: 140,
      valueFormatter: (value: any) =>
        value ? new Date(value).toLocaleDateString() : "N/A",
    },
    {
      field: "movie_title",
      headerName: "Movie",
      width: 180,
      valueGetter: (_, row) => row.movie?.title || "All Movies",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key="info"
          icon={
            <InfoOutlined
              sx={{
                fontSize: { xs: 20, sm: 24, md: 28 },
              }}
            />
          }
          label="Details"
          onClick={() => handleInfoClick(params.row)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <>
      <CustomDataGrid
        title="Discounts Management"
        loading={loading}
        loadingMessage="Loading discounts..."
        rows={uniqueDiscounts}
        columns={columns}
        onAddNew={handleAddNewClick}
        addButtonText="Add New Discount"
        showCheckboxSelection={true}
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        onDeleteSelected={handleDeleteSelected}
        getRowId={(row) => row._id}
      />
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
    </>
  );
};

export default Discounts;
