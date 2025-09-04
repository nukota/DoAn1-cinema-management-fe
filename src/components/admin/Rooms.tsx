import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Button,
  CircularProgress,
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
import AddIcon from "@mui/icons-material/Add";
import { confirmDeletion } from "../../utils/confirmDeletion";
import Room from "./items/Room";

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
              backgroundColor: "white",
              borderRadius: "4px",
            }}
          />
          <FormControl
            size="small"
            sx={{ width: 240, backgroundColor: "white", borderRadius: "4px" }}
          >
            <InputLabel>Cinema</InputLabel>
            <Select
              value={selectedCinema?._id || ""}
              onChange={handleCinemaChange}
              label="Cinema"
              sx={{
                borderRadius: "4px",
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
        <div className="list grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4 overflow-y-visible overflow-x-clip list-scrollbar">
          {filteredRooms.map((room) => (
            <Room
              key={room._id}
              room={room}
              handleInfoClick={() => handleInfoClick(room)}
            />
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
