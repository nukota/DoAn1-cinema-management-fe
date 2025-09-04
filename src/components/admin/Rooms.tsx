import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  CardActions,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  CinemaType,
  RoomType,
  RoomWithSeatsType,
} from "../../interfaces/types";
import DetailRoom from "./dialogs/DetailRoom";
import { useRooms } from "../../providers/RoomsProvider";
import { useCinemas } from "../../providers/CinemasProvider";
import CreateRoom from "./dialogs/CreateRoom";
import { toast } from "react-toastify";
import { confirmDeletion } from "../../utils/confirmDeletion";

const Rooms: React.FC = () => {
  const {
    rooms,
    fetchRoomsData,
    createRoomWithSeats,
    updateRoom,
    deleteRoom,
    loading,
  } = useRooms();
  const { cinemas, fetchCinemasData } = useCinemas();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [DetailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [selectedCinema, setSelectedCinema] = useState<CinemaType | null>(null);

  useEffect(() => {
    fetchRoomsData();
    fetchCinemasData();
  }, []);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCinemaChange = (event: any) => {
    const cinemaId = event.target.value;
    if (!cinemaId) {
      setSelectedCinema(null);
    } else {
      const found = cinemas.find((cinema) => cinema._id === cinemaId);
      setSelectedCinema(found || null);
    }
  };

  const handleInfoClick = (room: RoomType) => {
    setSelectedRoom(room);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setDetailDialogOpen(false);
    setSelectedRoom(null);
  };

  // const handleCheckConfirmDelete = (room: RoomType) => {
  //   setShowDeleteConfirm(true);
  //   setSelectedRoom(room);
  // };

  const handleDeleteClick = async () => {
    if (selectedRoom) {
      const confirmed = await confirmDeletion(
        "Delete Room",
        `Are you sure you want to delete ${selectedRoom.name}? This action cannot be undone.`
      );

      if (confirmed) {
        try {
          await deleteRoom(selectedRoom._id);
          fetchRoomsData();
          handleCloseDialog();
          toast.success("Room deleted successfully!");
        } catch (error) {
          toast.error(error instanceof Error ? error.message : String(error));
        }
      } else {
        toast.info("Deletion canceled.");
      }
    }
  };

  const handleAddNewClick = () => {
    setShowAddDialog(true);
  };

  const handleAddNewRoom = async (
    newRoom: RoomWithSeatsType
  ): Promise<boolean> => {
    try {
      await createRoomWithSeats(newRoom);
      setShowAddDialog(false);
      toast.success("Room added successfully");
      fetchRoomsData();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      setShowAddDialog(false);
      return false;
    }
  };

  const handleUpdateRoom = async (
    updatedRoom: RoomWithSeatsType
  ): Promise<boolean> => {
    try {
      await updateRoom(updatedRoom);
      setSelectedRoom(updatedRoom);
      fetchRoomsData();
      toast.success("Room updated successfully");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      room.name.toLowerCase().includes(searchTermLower) ||
      room.cinema?.cinema_id.toString().includes(searchTermLower);
    const matchesCinema = selectedCinema
      ? room.cinema?.cinema_id.toString() === selectedCinema._id
      : true;
    return matchesSearch && matchesCinema;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-4">
        <CircularProgress />
        <span className="text-2xl text-gray mt-4">Loading rooms...</span>
      </div>
    );
  }

  return (
    <div className="rooms flex flex-col h-[673px] overflow-y-visible scrollbar-hide relative">
      <div className="text-40px font-medium text-dark-gray">Rooms</div>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mt: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          placeholder="Search"
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
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
              "& fieldset": {
                borderColor: "#dadada",
                borderWidth: 2,
              },
              "&:hover fieldset": {
                borderColor: "#dadada",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#dadada",
              },
            },
          }}
        />
        <FormControl size="small" sx={{ width: 240 }}>
          <InputLabel>Cinema</InputLabel>
          <Select
            value={selectedCinema?._id || ""}
            onChange={handleCinemaChange}
            label="Cinema"
            sx={{
              borderRadius: "50px",
              "& fieldset": {
                borderColor: "#dadada",
                borderWidth: 2,
              },
              "&:hover fieldset": {
                borderColor: "#dadada",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#dadada",
              },
            }}
          >
            <MenuItem value="">All Cinemas</MenuItem>
            {cinemas.map((cinema) => (
              <MenuItem key={cinema._id} value={cinema._id}>
                {cinema.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          onClick={handleAddNewClick}
          variant="contained"
          color="primary"
          sx={{
            width: "114px",
            height: "40px",
            ml: "auto",
          }}
        >
          Add New
        </Button>
      </Box>

      <div className="relative min-w-[360px] sm:min-w-[680px] w-full flex-1 bg-white border border-light-gray rounded-b-xl rounded-md pl-12 py-6 pr-4 flex flex-col">
        <div className="list grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4 py-3 overflow-y-visible overflow-x-clip list-scrollbar">
          {filteredRooms.map((room) => (
            <Card
              key={room._id}
              sx={{
                width: 180,
                height: 200,
                display: "flex",
                flexDirection: "column",
                border: "2px solid #dc2626",
                borderRadius: 2,
                boxShadow: "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography
                  component="h3"
                  sx={{
                    fontSize: "20px",
                    fontWeight: 500,
                    color: "#374151",
                    textAlign: "flex-start",
                    mb: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {room.name}
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "21px",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#333",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                      }}
                    >
                      {room.cinema?.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "21px",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#000" }}>
                      Capacity:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#000",
                        ml: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {room.seat_count}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ p: 0 }}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => handleInfoClick(room)}
                  sx={{
                    backgroundColor: "rgba(184, 0, 7, 0.05)",
                    width: "100%",
                    borderRadius: 0,
                  }}
                >
                  View Info
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>
      {selectedRoom && (
        <DetailRoom
          open={DetailDialogOpen}
          onDelete={handleDeleteClick}
          onClose={handleCloseDialog}
          room={selectedRoom!}
          onSave={handleUpdateRoom}
        />
      )}
      <CreateRoom
        open={showAddDialog}
        onAdd={handleAddNewRoom}
        onClose={() => setShowAddDialog(false)}
      />
    </div>
  );
};

export default Rooms;
