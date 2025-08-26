import React, { useEffect, useState } from "react";
import DetailEmployee from "./dialogs/DetailEmployee";
import CreateEmployee from "./dialogs/CreateEmployee";
import { InfoOutlined } from "@mui/icons-material";
import { GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { EmployeeType } from "../../interfaces/types";
import { useEmployees } from "../../providers/EmployeesProvider";
import { toast } from "react-toastify";
import { confirmDeletion } from "../../utils/confirmDeletion";
import CustomDataGrid from "./elements/DataGrid";

const Employees: React.FC = () => {
  const {
    employees,
    fetchEmployeesData,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    loading,
  } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(
    null
  );
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [DetailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [AddDialogOpen, setAddDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchEmployeesData();
  }, []);

  const handleAddNewClick = () => {
    setAddDialogOpen(true);
  };

  const handleInfoClick = (employee: EmployeeType) => {
    setSelectedEmployee(employee);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setAddDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleAddNewEmployee = async (
    newEmployee: EmployeeType
  ): Promise<boolean> => {
    try {
      await createEmployee(newEmployee);
      fetchEmployeesData();
      handleCloseDialog();
      toast.success("Employee added successfully!");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const handleOnSave = async (
    updatedEmployee: EmployeeType
  ): Promise<boolean> => {
    try {
      await updateEmployee(updatedEmployee);
      fetchEmployeesData();
      setSelectedEmployee(updatedEmployee);
      toast.success("Employee updated successfully!");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const handleDeleteSelectedEmployees = async () => {
    if (selectedRows.length === 0) return;

    const confirmed = await confirmDeletion(
      "Delete Employees",
      `Are you sure you want to delete ${selectedRows.length} employee(s)? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await Promise.all(selectedRows.map((id) => deleteEmployee(String(id))));
        fetchEmployeesData();
        setSelectedRows([]);
        toast.success(
          `${selectedRows.length} employee(s) deleted successfully!`
        );
      } catch (error) {
        toast.error(error instanceof Error ? error.message : String(error));
      }
    } else {
      toast.info("Deletion canceled.");
    }
  };

  const columns: GridColDef[] = [
    {
      field: "_id",
      headerName: "ID",
      flex: 0.6,
      minWidth: 80,
      maxWidth: 120,
      align: "center",
    },
    {
      field: "cinema_name",
      headerName: "Cinema",
      flex: 0.8,
      minWidth: 100,
      maxWidth: 140,
      align: "center",
      valueGetter: (_, row) => row.cinema?.name || "N/A",
    },
    {
      field: "full_name",
      headerName: "Name",
      flex: 1.5,
      minWidth: 150,
      align: "center",
    },
    {
      field: "dateOfBirth",
      headerName: "Birth Date",
      flex: 1,
      minWidth: 110,
      maxWidth: 140,
      align: "center",
      valueGetter: (_, row) => row.dateOfBirth.split("T")[0],
    },
    {
      field: "position",
      headerName: "Position",
      flex: 1.2,
      minWidth: 120,
      align: "center",
    },
    {
      field: "shift",
      headerName: "Shift",
      flex: 1.1,
      minWidth: 100,
      maxWidth: 150,
      align: "center",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 0.8,
      minWidth: 100,
      maxWidth: 120,
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
          label="Info"
          onClick={() => handleInfoClick(params.row)}
          showInMenu={false}
        />,
      ],
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-4">
        <span className="text-2xl text-gray mt-4">Loading employees...</span>
      </div>
    );
  }

  return (
    <>
      <CustomDataGrid
        title="Employees Management"
        loading={loading}
        loadingMessage="Loading employees..."
        rows={employees}
        columns={columns}
        onAddNew={handleAddNewClick}
        addButtonText="Add New Employee"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        onDeleteSelected={handleDeleteSelectedEmployees}
        showCheckboxSelection={true}
        getRowId={(row) => row._id}
      />

      {/* Dialogs */}
      {selectedEmployee && (
        <DetailEmployee
          open={DetailDialogOpen}
          onClose={handleCloseDialog}
          employee={selectedEmployee}
          onSave={handleOnSave}
        />
      )}
      <CreateEmployee
        open={AddDialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleAddNewEmployee}
      />
    </>
  );
};

export default Employees;
