import React, { useState, ChangeEvent } from "react";
import Room from "./items/Room";
import SearchImg from "../../assets/images/search.svg";
import { exampleRooms } from "../../data";
import { Button } from "@mui/material";
import { RoomType } from "../../interfaces/types";
import DetailRoom from "./dialogs/DetailRoom";

const Rooms: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [DetailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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

  const handleCheckConfirmDelete = (room: RoomType) => {
      setShowDeleteConfirm(true);
      setSelectedRoom(room);
    };

  const handleDeleteClick = () => {};

  const handleAddNewClick = () => {};

  const filteredRooms = exampleRooms.filter((room) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (room.room_id && room.room_id.toString().includes(searchTermLower)) ||
      (room.seat_count && room.seat_count.toString().includes(searchTermLower))
    );
  });

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

      <div className="relative mt-[8px] w-full h-full  min-w-[400px] sm:min-w-[680px] bg-white border-[3px] border-light-gray rounded-xl pl-4 sm:pl-12 py-6 pr-4 overflow-scroll">
        <div className="list grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-6 py-3 overflow-y-visible overflow-x-clip">
          {filteredRooms.map((room, index) => (
            <Room
              key={room.room_id}
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
        />
      )}
    </div>
  );
};

export default Rooms;
