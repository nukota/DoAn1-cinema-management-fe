import React, { useState, ChangeEvent, useEffect } from "react";
import Room from "./items/Room";
import SearchImg from "../../assets/images/search.svg";
import { Button, CircularProgress } from "@mui/material";
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
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
      try {
        await deleteRoom(selectedRoom._id);
        setShowDeleteConfirm(false);
        setSelectedRoom(null);
        toast.success("Room deleted successfully");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : String(error));
      }
    }
  };

  const handleAddNewClick = () => {
    setShowAddDialog(true);
  };

  const handleAddNewRoom = async (newRoom: RoomWithSeatsType): Promise<boolean> => {
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

  const handleUpdateRoom = async (updatedRoom: RoomWithSeatsType): Promise<boolean> => {
    try {
      await updateRoom(updatedRoom);
      setDetailDialogOpen(false);
      setSelectedRoom(null);
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

      <div className="relative mt-[8px] w-full h-full  min-w-[400px] sm:min-w-[680px] bg-white rounded-xl pl-4 sm:pl-12 py-6 pr-4">
        <div className="list grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-6 py-3 overflow-y-visible overflow-x-clip">
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
