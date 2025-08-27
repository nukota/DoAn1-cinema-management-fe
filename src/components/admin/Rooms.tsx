import React, { useState, ChangeEvent, useEffect } from "react";
import SearchImg from "../../assets/images/search.svg";
import {
  Button,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  CardActions,
  Box,
} from "@mui/material";
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

  const handleCinemaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
      <div className="flex flex-col 1270-break-point:flex-row mt-4">
        <div className="SearchBar relative w-full max-w-[240px] h-8">
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
        <div className="SearchBar relative w-full max-w-[240px] h-8 ml-4">
          <select
            className="size-full pl-10 pr-5 text-sm text-dark-gray rounded-full text-gray-700 bg-white border-line-gray border-2 focus:outline-none focus:ring-1"
            value={selectedCinema?._id || ""}
            onChange={handleCinemaChange}
          >
            <option value="">All Cinemas</option>
            {cinemas.map((cinema) => (
              <option key={cinema._id} value={cinema._id}>
                {cinema.name}
              </option>
            ))}
          </select>
          <img
            src={SearchImg}
            alt="Cinema"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4"
          />
          <img
            src={SearchImg}
            alt="Cinema"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4"
          />
        </div>
        <div className="1270-break-point:ml-auto 1270-break-point:mt-0 mt-2">
          <Button
            onClick={handleAddNewClick}
            variant="contained"
            color="primary"
            sx={{
              width: "114px",
              height: "32px",
            }}
          >
            Add New
          </Button>
        </div>
      </div>

      <div className="relative mt-[8px] w-full h-full min-w-[400px] sm:min-w-[680px] bg-white rounded-xl pl-4 sm:pl-12 py-6 pr-4">
        <div className="list grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-6 py-3 overflow-y-visible overflow-x-clip list-scrollbar">
          {filteredRooms.map((room) => (
            <Card
              key={room._id}
              sx={{
                width: 170,
                height: 180,
                display: "flex",
                flexDirection: "column",
                border: "2px solid #dadada",
                borderRadius: 3,
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#dc2626",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontSize: "18px",
                    fontWeight: 500,
                    color: "#374151",
                    textAlign: "center",
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
                      sx={{ color: "#374151", fontSize: "16px" }}
                    >
                      Cinema:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#000",
                        ml: 0.5,
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
                    <Typography
                      variant="body2"
                      sx={{ color: "#374151", fontSize: "16px" }}
                    >
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

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleInfoClick(room)}
                  sx={{
                    width: "100%",
                    borderRadius: 2,
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
