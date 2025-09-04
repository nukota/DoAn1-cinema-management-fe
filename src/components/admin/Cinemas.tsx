import React, { useState, useEffect } from "react";
import { CinemaType } from "../../interfaces/types";
import DetailCinema from "./dialogs/DetailCinema";
import CreateCinema from "./dialogs/CreateCinema";
import {
  Button,
  CircularProgress,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useCinemas } from "../../providers/CinemasProvider";
import { toast } from "react-toastify";
import { confirmDeletion } from "../../utils/confirmDeletion";
import Cinema from "./items/Cinema";

const Cinemas: React.FC = () => {
  const fetchedIds = React.useRef<Set<string>>(new Set());
  const {
    cinemas,
    fetchCinemasData,
    fetchCinemaDetails,
    createCinema,
    updateCinema,
    deleteCinema,
    loading,
  } = useCinemas();
  const [selectedCinema, setSelectedCinema] = useState<CinemaType | null>(null);
  const [DetailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [AddDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [cinemaDetails, setCinemaDetails] = useState<{
    [key: string]: { employeeCount: number; roomCount: number };
  }>({});

  useEffect(() => {
    fetchCinemasData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const fetchDetails = async (cinemaId: string) => {
    if (cinemaDetails[cinemaId] || fetchedIds.current.has(cinemaId)) return;
    fetchedIds.current.add(cinemaId);
    try {
      const details = await fetchCinemaDetails(cinemaId);
      setCinemaDetails((prevDetails) => ({
        ...prevDetails,
        [cinemaId]: details,
      }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
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

  const handleAddNewCinema = async (
    newCinema: CinemaType
  ): Promise<boolean> => {
    try {
      const cinemaData = {
        name: newCinema.name,
        address: newCinema.address,
      };
      await createCinema(cinemaData as CinemaType);
      handleCloseDialog();
      toast.success("Cinema added successfully!");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const handleOnSave = async (updatedCinema: CinemaType): Promise<boolean> => {
    try {
      await updateCinema(updatedCinema);
      setSelectedCinema(updatedCinema);
      toast.success("Cinema updated successfully!");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const handleDeleteCinema = async (cinemaId: string, cinemaName?: string) => {
    const confirmed = await confirmDeletion(
      "Delete Cinema",
      `Are you sure you want to delete ${
        cinemaName ?? "this cinema"
      }? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await deleteCinema(cinemaId);
        fetchCinemasData();
        handleCloseDialog();
        toast.success("Cinema deleted successfully!");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : String(error));
      }
    } else {
      toast.info("Deletion canceled.");
    }
  };

  useEffect(() => {
    cinemas.forEach((cinema) => {
      if (!cinemaDetails[cinema._id] && !fetchedIds.current.has(cinema._id)) {
        fetchDetails(cinema._id);
      }
    });
  }, [cinemas]);

  const filteredCinemas = cinemas.filter((cinema) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      cinema.name.toLowerCase().includes(searchTermLower) ||
      cinema.address.toLowerCase().includes(searchTermLower)
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-4">
        <CircularProgress />
        <span className="text-2xl text-gray mt-4">Loading cinemas...</span>
      </div>
    );
  }

  return (
    <div className="cinemas flex flex-col h-[673px] overflow-y-visible scrollbar-hide relative">
      <div className="text-40px font-medium text-dark-gray">Cinemas</div>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mt: 2,
          mb: 1,
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { xs: "flex-start", md: "space-between" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <TextField
            placeholder="Search cinemas..."
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 240,
              backgroundColor: "white",
              borderRadius: "4px",
            }}
          />
        </Box>
        <Button
          onClick={handleAddNewClick}
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          disableElevation
        >
          Add New
        </Button>
      </Box>

      <div className="relative min-w-[360px] sm:min-w-[680px] w-full flex-1 bg-white border-[1px] border-light-gray rounded-md p-8 flex flex-col">
        <div className="list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 overflow-y-visible overflow-x-clip list-scrollbar">
          {filteredCinemas.map((cinema) => (
            <Cinema
              key={cinema._id}
              cinema={cinema}
              cinemaDetails={cinemaDetails[cinema._id]}
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
