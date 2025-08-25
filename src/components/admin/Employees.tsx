import React, { useEffect, useState } from "react";
import DetailEmployee from "./dialogs/DetailEmployee";
import CreateEmployee from "./dialogs/CreateEmployee";
import InfoImg from "../../assets/images/info.svg";
import DeleteImg from "../../assets/images/delete.svg";
import { Button, CircularProgress } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { EmployeeType } from "../../interfaces/types";
import { useEmployees } from "../../providers/EmployeesProvider";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import { confirmDeletion } from "../../utils/confirmDeletion";

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
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);

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
        await Promise.all(selectedRows.map(id => deleteEmployee(String(id))));
        fetchEmployeesData();
        setSelectedRows([]);
        toast.success(`${selectedRows.length} employee(s) deleted successfully!`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : String(error));
      }
    } else {
      toast.info("Deletion canceled.");
    }
  };

  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: 'ID',
      flex: 0.6,
      minWidth: 80,
      maxWidth: 120,
      // headerAlign: 'left',
      align: 'center',
    },
    {
      field: 'cinema_name',
      headerName: 'Cinema',
      flex: 0.8,
      minWidth: 100,
      maxWidth: 140,
      // headerAlign: 'left',
      align: 'center',
      valueGetter: (_, row) => row.cinema?.name || 'N/A',
    },
    {
      field: 'full_name',
      headerName: 'Name',
      flex: 1.5,
      minWidth: 150,
      // headerAlign: 'left',
      align: 'center',
    },
    {
      field: 'dateOfBirth',
      headerName: 'Birth Date',
      flex: 1,
      minWidth: 110,
      maxWidth: 140,
      // headerAlign: 'left',
      align: 'center',
      valueGetter: (_, row) => row.dateOfBirth.split("T")[0],
    },
    {
      field: 'position',
      headerName: 'Position',
      flex: 1.2,
      minWidth: 120,
      // headerAlign: 'left',
      align: 'center',
    },
    {
      field: 'shift',
      headerName: 'Shift',
      flex: 1.1,
      minWidth: 100,
      maxWidth: 150,
      // headerAlign: 'left',
      align: 'center',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      minWidth: 100,
      maxWidth: 120,
      // headerAlign: 'left',
      getActions: (params) => [
        <GridActionsCellItem
          key="info"
          icon={
            <img
              src={InfoImg}
              alt="Info"
              style={{ filter: "brightness(1.3)" }}
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
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
        <CircularProgress />
        <span className="text-2xl text-gray mt-4">Loading employees...</span>
      </div>
    );
  }

  return (
    <div className="employees flex flex-col w-full h-fulla max-w-full overflow-hidden">
      <div className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-medium text-dark-gray">
        Employees
      </div>
      
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-2 sm:mb-2">
        <div className="flex items-center gap-4">
          {selectedRows.length > 0 && (
            <Button
              onClick={handleDeleteSelectedEmployees}
              variant="contained"
              color="error"
              startIcon={
                <img
                  src={DeleteImg}
                  alt="Delete"
                  className="w-4 h-4"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              }
              sx={{
                height: { xs: "36px", sm: "40px" },
                px: { xs: 2, sm: 3 },
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: 500,
                fontSize: { xs: "12px", sm: "14px" },
              }}
            >
              Delete Selected ({selectedRows.length})
            </Button>
          )}
        </div>

        <Button
          onClick={handleAddNewClick}
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          disableElevation
        >
          Add New Employee
        </Button>
      </div>

      {/* DataGrid Container */}
      <div className="flex-1 rounded-xl shadow-sm overflow-hidden min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
        <DataGrid
          columnHeaderHeight={48}
          rowHeight={40}
          rows={employees}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[6, 10, 20]}
          checkboxSelection={true}
          disableRowSelectionOnClick={false}
          onRowSelectionModelChange={(newSelection) => {
            // Convert to array safely
            if (Array.isArray(newSelection)) {
              setSelectedRows(newSelection);
            } else if (newSelection instanceof Set) {
              setSelectedRows(Array.from(newSelection));
            } else {
              setSelectedRows([]);
            }
          }}
          // autoHeight={false}
          density="comfortable"
          sx={{
            // border: 'none',
            height: '100%',
            '& .MuiDataGrid-columnHeaders': {
              // backgroundColor: '#f8f9fa',
              // borderBottom: '1.5px solid #dadada',
              fontSize: { xs: '14px', sm: '16px' },
              fontWeight: 600,
              color: '#101010',
              // textTransform: 'uppercase',
              // letterSpacing: '0.5px',
              // minHeight: { xs: '48px', sm: '56px' },
            },
            '& .MuiDataGrid-cell': {
                fontSize: { xs: '12px', sm: '14px' },
                color: '#666',
                padding: { xs: '4px 6px', sm: '6px 8px' },
                display: 'flex',
                alignItems: 'center',      // vertical center
                justifyContent: 'flex-start', // horizontal left
                textAlign: 'left', 
              },
              '& .MuiDataGrid-row': {
                minHeight: { xs: '48px', sm: '48px' },
                '&:nth-of-type(odd)': {
                backgroundColor: '#fff',
                },
                '&:nth-of-type(even)': {
                backgroundColor: '#f2f2f2',
                },
                '&:nth-of-type(odd):hover': {
                  backgroundColor: '#ffebee !important', 
                },
                '&:nth-of-type(even):hover': {
                  backgroundColor: '#ffe0e0 !important',
                },
                '&.Mui-selected': {
                  backgroundColor: '#fdd1d1ff !important',
                },
              },
            // },
            // '& .MuiDataGrid-virtualScroller': {
            //   backgroundColor: 'transparent',
            // },
            // '& .MuiDataGrid-overlay': {
            //   backgroundColor: 'rgba(255, 255, 255, 0.8)',
            // },
            // '& .MuiDataGrid-columnSeparator': {
            //   display: 'none',
            // },
            '& .MuiDataGrid-toolbarContainer': {
              padding: { xs: '8px', sm: '16px' },
            },
            // Mobile-specific adjustments
            '@media (max-width: 768px)': {
              '& .MuiDataGrid-columnHeaderTitle': {
                fontSize: '11px',
                fontWeight: 600,
              },
              '& .MuiDataGrid-cell': {
                fontSize: '11px',
                padding: '6px 8px',
              },
              '& .MuiDataGrid-row': {
                minHeight: '44px',
              },
            },
          }}
        />
      </div>

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
    </div>
  );
};

export default Employees;
