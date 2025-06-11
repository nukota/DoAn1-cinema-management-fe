import React, { useEffect, useState } from "react";
import Employee from "./items/Employee";
import DetailEmployee from "./dialogs/DetailEmployee";
import CreateEmployee from "./dialogs/CreateEmployee";
import SearchImg from "../../assets/images/search.svg";
import CalendarImg from "../../assets/images/calendar.svg";
import { Button, CircularProgress } from "@mui/material";
import { EmployeeType } from "../../interfaces/types";
import { useEmployees } from "../../providers/EmployeesProvider";
import { toast } from "react-toastify";

const Employees: React.FC = () => {
  const {
    employees,
    fetchEmployeesData,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    loading,
  } = useEmployees();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(
    null
  );
  const [selectedCinema, setSelectedCinema] = useState<string>("");

  const [DetailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [AddDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const itemsPerPage = 10;
  const pageRangeDisplayed = 5;

  useEffect(() => {
    fetchEmployeesData();
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

  const uniqueCinemas = Array.from(
    new Set(employees.map((employee) => employee.cinema_id))
  ).map((cinema_id) => ({
    cinema_id,
    name: `Cinema ${cinema_id}`,
  }));

  const handleCinemaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCinema(event.target.value);
    setCurrentPage(1);
  };

  const handleAddNewClick = () => {
    setAddDialogOpen(true);
  };

  const handleInfoClick = (employee: EmployeeType) => {
    setSelectedEmployee(employee);
    setDetailDialogOpen(true);
  };
  const handleCheckConfirmDelete = (employee: EmployeeType) => {
    handleDeleteEmployee(employee._id);
    // setShowDeleteConfirm(true);
    // setSelectedEmployee(employee);
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
      await fetchEmployeesData();
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
      setSelectedEmployee(updatedEmployee);
      await fetchEmployeesData();
      toast.success("Employee updated successfully!");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const handleDeleteEmployee = async (EmployeeId: string) => {
    try {
      await deleteEmployee(EmployeeId);
      await fetchEmployeesData();
      handleCloseDialog();
      toast.success("Employee deleted successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
  };

  const handlePageChange = (pageNumber: number | string) => {
    if (pageNumber !== "...") setCurrentPage(Number(pageNumber));
  };
  const filteredEmployees = employees.filter((employee) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      (employee.full_name &&
        employee.full_name.toLowerCase().includes(searchTermLower)) ||
      (employee.cccd && employee.cccd.toString().includes(searchTermLower)) ||
      (employee.role &&
        employee.role.toLowerCase().includes(searchTermLower)) ||
      (employee.dateOfBirth && employee.dateOfBirth.includes(searchTermLower));

    const matchesCinema =
      !selectedCinema ||
      employee.cinema?.cinema_id.toString() === selectedCinema;

    return matchesSearch && matchesCinema;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
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
        <span className="text-2xl text-gray mt-4">Loading employees...</span>
      </div>
    );
  }

  return (
    <div className="employees flex flex-col w-full min-w-[1000px] h-[100%] relative ">
      <div className="text-40px font-medium text-dark-gray">Employees</div>
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
          <div className="CinemaFilterBar relative ml-5 w-full max-w-[240px] h-8 mt-2">
            <select
              className="size-full pl-10 pr-5 text-sm text-dark-gray rounded-full text-gray-700 bg-white border-line-gray border-2 focus:outline-none focus:ring-1"
              value={selectedCinema}
              onChange={handleCinemaChange}
            >
              <option value="">All Cinemas</option>
              {uniqueCinemas.map((cinema) => (
                <option key={cinema.cinema_id} value={cinema.cinema_id}>
                  {cinema.name}
                </option>
              ))}
            </select>
            <img
              src={SearchImg}
              alt="Cinema"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4"
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
          <div className="w-[8%] text-base">Cinema</div>
          <div className="w-[16%] text-base">Name</div>
          <div className="w-[14%] text-base">DoB</div>
          <div className="w-[12%] text-base">Position</div>
          <div className="w-[22%] text-base">Shift</div>
          <div className="w-[20%] text-base">Employee Action</div>
        </div>
        <div className="border-b border-light-gray border-1.5" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="h-[45px] mb-[45px] ml-[10px] mr-[10px] bg-[#f2f2f2]" />
        <div className="-mt-[450px] text-base">
          {currentEmployees.map((employee) => (
            <Employee
              key={employee._id}
              employee={employee}
              handleInfoClick={() => handleInfoClick(employee)}
              handleDeleteClick={() => handleCheckConfirmDelete(employee)}
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
      {selectedEmployee && (
        <DetailEmployee
          open={DetailDialogOpen}
          onClose={handleCloseDialog}
          employee={selectedEmployee!}
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
