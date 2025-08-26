import React, { useEffect, useState } from "react";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useCustomers } from "../../providers/CustomersProvider";
import CreateCustomer from "./dialogs/CreateCustomer";
import { UserType } from "../../interfaces/types";
import DetailCustomer from "./dialogs/DetailCustomer";
import { toast } from "react-toastify";
import { confirmDeletion } from "../../utils/confirmDeletion";
import CustomDataGrid from "./elements/DataGrid";
import { InfoOutlined } from "@mui/icons-material";

const Customers: React.FC = () => {
  const {
    customers,
    fetchCustomersData,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    loading,
  } = useCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState<UserType | null>(
    null
  );
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [DetailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [AddDialogOpen, setAddDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchCustomersData();
  }, []);

  const handleAddNewClick = () => {
    setAddDialogOpen(true);
  };

  const handleInfoClick = (customer: UserType) => {
    setSelectedCustomer(customer);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setAddDialogOpen(false);
    setSelectedCustomer(null);
  };

  const handleAddNewCustomer = async (
    newCustomer: UserType
  ): Promise<boolean> => {
    try {
      await createCustomer(newCustomer);
      fetchCustomersData();
      toast.success("Customer added successfully!");
      handleCloseDialog();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const handleOnSave = async (updatedCustomer: UserType): Promise<boolean> => {
    try {
      await updateCustomer(updatedCustomer);
      fetchCustomersData();
      setSelectedCustomer(updatedCustomer);
      toast.success("Customer updated successfully!");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) {
      toast.info("No customers selected for deletion.");
      return;
    }

    const confirmed = await confirmDeletion(
      "Delete Selected Customers",
      `Are you sure you want to delete ${selectedRows.length} customer(s)? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        const deletePromises = selectedRows.map((id) => deleteCustomer(id));
        await Promise.all(deletePromises);
        fetchCustomersData();
        setSelectedRows([]);
        toast.success(
          `${selectedRows.length} customer(s) deleted successfully!`
        );
      } catch (error) {
        toast.error(error instanceof Error ? error.message : String(error));
      }
    } else {
      toast.info("Deletion canceled.");
    }
  };

  const uniqueEmployees = customers.filter(
    (user, index, self) => index === self.findIndex((e) => e._id === user._id)
  );

  // DataGrid columns
  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 120 },
    { field: "full_name", headerName: "Name", flex: 1, minWidth: 160 },
    { field: "phone", headerName: "Phone Number", width: 140 },
    { field: "cccd", headerName: "CCCD", width: 120 },
    { field: "dateOfBirth", headerName: "Dob", width: 130 },
    {
      field: "actions",
      type: "actions",
      headerName: "User Action",
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
        title="Customers Management"
        loading={loading}
        loadingMessage="Loading customers..."
        rows={uniqueEmployees}
        columns={columns}
        onAddNew={handleAddNewClick}
        addButtonText="Add New Customer"
        showCheckboxSelection={true}
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        onDeleteSelected={handleDeleteSelected}
        getRowId={(row) => row._id}
      />

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
    </>
  );
};

export default Customers;
