import React, { useState, useEffect } from "react";
import Cinema from "./items/Cinema";
import SearchImg from "../../assets/images/search.svg";
import { CinemaType } from "../../interfaces/types";
import DetailCinema from "./dialogs/DetailCinema";
import CreateCinema from "./dialogs/CreateCinema";
import { Button } from "@mui/material";
import { useCinemas } from "../../providers/CinemasProvider";

const Cinemas: React.FC = () => {
  const { cinemas, fetchCinemasData, fetchCinemaDetails, createCinema, updateCinema, deleteCinema, loading } = useCinemas();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCinema, setSelectedCinema] = useState<CinemaType | null>(null);
  const [DetailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [AddDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [cinemaDetails, setCinemaDetails] = useState<{
    [key: string]: { employeeCount: number; roomCount: number };
  }>({});
  
  useEffect(() => {
    fetchCinemasData();
  }, []);

  const fetchDetails = async (cinemaId: string) => {
    try {
      const details = await fetchCinemaDetails(cinemaId);
      setCinemaDetails((prevDetails) => ({
        ...prevDetails,
        [cinemaId]: details,
      }));
    } catch (error) {
      console.error("Failed to fetch cinema details:", error);
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddNewClick = () => {
    setAddDialogOpen(true);
  };

  const handleInfoClick = (cinema: CinemaType) => {
    setSelectedCinema(cinema);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setAddDialogOpen(false);
    setSelectedCinema(null);
  };

  const handleAddNewCinema = async (newCinema: CinemaType) => {
    try {
      const cinemaData = {
        name: newCinema.name,
        address: newCinema.address,
      };
      await createCinema(cinemaData as CinemaType);
      await fetchCinemasData();
    } catch (error) {
      console.error("Failed to add new cinema:", error);
      alert("An error occurred while adding the cinema. Please try again.");
    }
  };
  
  const handleOnSave = async (updatedCinema: CinemaType) => {
    try {
      await updateCinema(updatedCinema);
      await fetchCinemasData();
      handleCloseDialog(); 
    } catch (error) {
      console.error("Failed to save cinema:", error);
      alert("An error occurred while saving the cinema. Please try again.");
    }
  };
  
  const handleDeleteCinema = async (cinemaId: string) => {
    try {
      await deleteCinema(cinemaId);
      await fetchCinemasData();
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to delete cinema:", error);
      alert("An error occurred while deleting the cinema. Please try again.");
    }
  };

  const filteredCinemas = cinemas.filter((cinema) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (cinema._id &&
        cinema._id.toString().includes(searchTermLower)) ||
      (cinema.address &&
        cinema.address.toLowerCase().includes(searchTermLower)) ||
      (cinema.name && cinema.name.toLowerCase().includes(searchTermLower))
    );
  });

  if (loading) {
    return <div className="text-center text-gray-500">Loading cinemas...</div>;
  }

  return (
    <div className="cinemas flex flex-col h-[673px] relative overflow-y-visible">
      <div className="text-40px font-medium text-dark-gray">Cinemas</div>
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
      <div className="content mt-[14px] w-full h-full">
        <div className="gap-y-8 py-3 overflow-y-auto flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3">
          {filteredCinemas.map((cinema) => (
            <Cinema
              key={cinema._id}
              cinema={cinema}
              details={cinemaDetails[cinema._id]}
              fetchDetails={() => fetchDetails(cinema._id)}
              handleInfoClick={() => handleInfoClick(cinema)}
            />
          ))}
        </div>
      </div>
      {selectedCinema && (
        <DetailCinema
          open={DetailDialogOpen}
          onClose={handleCloseDialog}
          cinema={selectedCinema!}
          onSave={handleOnSave}
          onDelete={() => handleDeleteCinema(selectedCinema!._id)}
        />
      )}
      <CreateCinema
        open={AddDialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleAddNewCinema}
      />
    </div>
  );
};

export default Cinemas;