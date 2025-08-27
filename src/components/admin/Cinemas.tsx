import React, { useState, useEffect } from "react";
import SearchImg from "../../assets/images/search.svg";
import { CinemaType } from "../../interfaces/types";
import DetailCinema from "./dialogs/DetailCinema";
import CreateCinema from "./dialogs/CreateCinema";
import {
  Button,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useCinemas } from "../../providers/CinemasProvider";
import { toast } from "react-toastify";
import { confirmDeletion } from "../../utils/confirmDeletion";

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

  const filteredCinemas = cinemas.filter((cinema) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (cinema._id && cinema._id.toString().includes(searchTermLower)) ||
      (cinema.address &&
        cinema.address.toLowerCase().includes(searchTermLower)) ||
      (cinema.name && cinema.name.toLowerCase().includes(searchTermLower))
    );
  });

  useEffect(() => {
    filteredCinemas.forEach((cinema) => {
      if (!cinemaDetails[cinema._id] && !fetchedIds.current.has(cinema._id)) {
        fetchDetails(cinema._id);
      }
    });
  }, [filteredCinemas]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-4">
        <CircularProgress />
        <span className="text-2xl text-gray mt-4">Loading cinemas...</span>
      </div>
    );
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
        <div className="gap-y-8 py-3 overflow-y-auto flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3 list-scrollbar">
          {filteredCinemas.map((cinema) => (
            <Card
              key={cinema._id}
              sx={{
                minWidth: 300,
                height: 200,
                position: "relative",
                borderRadius: 3,
                border: "2px solid #dc2626",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                },
                overflow: "visible",
              }}
            >
              <CardContent
                sx={{ height: "100%", position: "relative", zIndex: 2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 600,
                      fontSize: "1.5rem",
                      color: "#1a1a1a",
                      maxWidth: "70%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cinema.name}
                  </Typography>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleInfoClick(cinema)}
                    sx={{
                      backgroundColor: "#f3f4f6",
                      "&:hover": { backgroundColor: "#e5e7eb" },
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Address: {cinema.address}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography variant="body1" sx={{ color: "#1a1a1a" }}>
                    <span>Rooms: </span>
                    <span style={{ fontWeight: 500 }}>
                      {cinemaDetails[cinema._id]
                        ? cinemaDetails[cinema._id].roomCount
                        : "Loading..."}
                    </span>
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#1a1a1a" }}>
                    <span>Employees: </span>
                    <span style={{ fontWeight: 500 }}>
                      {cinemaDetails[cinema._id]
                        ? cinemaDetails[cinema._id].employeeCount
                        : "Loading..."}
                    </span>
                  </Typography>
                </Box>
              </CardContent>
              <Typography
                sx={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  fontSize: "84px",
                  color: "#fef5f5",
                  zIndex: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {cinema.name}
              </Typography>
            </Card>
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
