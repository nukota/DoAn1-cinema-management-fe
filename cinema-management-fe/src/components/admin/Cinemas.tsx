import React, { useState, ChangeEvent } from "react";
import Cinema from "./items/Cinema";
import SearchImg from "../../assets/images/search.svg";
import { CinemaType, RoomType } from "../../types";
import { exampleCinemas } from "../../data";
import { exampleRooms } from "../../data";
import DetailRooms from "./dialogs/DetailRooms";
import DetailCinema from "./dialogs/DetailCinema";
import CreateCinema from "./dialogs/CreateCinema";

const Cinemas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCinema, setSelectedCinema] = useState<CinemaType | null>(null);
  const [DetailRoomsDialogOpen, setDetailRoomsDialogOpen] =
    useState<boolean>(false);
  const [DetailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [AddDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

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
    setDetailRoomsDialogOpen(false);
    setDetailDialogOpen(false);
    setAddDialogOpen(false);
    setSelectedCinema(null);
  };

  const handleSeeAllRooms = (cinema: CinemaType) => {
    setSelectedCinema(cinema);
    setDetailRoomsDialogOpen(true);
  };

  const handleAddCinema = async (newCinema: CinemaType) => {};
  const handleUpdateCinema = async (updatedCinema: CinemaType) => {};
  const handleDeleteCinema = async (Cinema: CinemaType) => {};

  const handleAddRoom = async (newRoom: RoomType) => {};
  const handleUpdateRoom = async (updatedRoom: RoomType) => {};
  const handleDeleteRoom = async (room: RoomType) => {};

  const handleAddNewCinema = async (newCinema: CinemaType) => {};
  const handleOnSave = async (cinema: CinemaType) => {};

  const filteredCinemas = exampleCinemas.filter((cinema) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (cinema.cinema_id &&
        cinema.cinema_id.toString().includes(searchTermLower)) ||
      (cinema.address &&
        cinema.address.toLowerCase().includes(searchTermLower)) ||
      (cinema.name && cinema.name.toLowerCase().includes(searchTermLower))
    );
  });

  return (
    <div className="cinemas flex flex-col h-[673px] relative overflow-y-visible">
      <div className="text-40px font-medium text-dark-gray">Cinemas</div>
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

      <div className="content mt-[14px] w-full h-full">
        <div className="gap-y-8 py-3 overflow-y-auto flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3">
          {filteredCinemas.map((cinema, index) => {
            const cinemaRooms: RoomType[] = exampleRooms.filter(
              (room) => room.cinema_id === cinema.cinema_id
            );
            return (
              <Cinema
                key={cinema.cinema_id}
                cinema={cinema}
                handleSeeAllRooms={() => handleSeeAllRooms(cinema)}
                handleInfoClick={() => handleInfoClick(cinema)}
              />
            );
          })}
        </div>
      </div>
      {selectedCinema && (
        <DetailRooms
          cinema={selectedCinema!}
          onClose={handleCloseDialog}
          open={DetailRoomsDialogOpen}
          onAddRoom={handleAddRoom}
          onUpdateRoom={handleUpdateRoom}
          onDeleteRoom={handleDeleteRoom}
        />
      )}
      {selectedCinema && (
        <DetailCinema
          open={DetailDialogOpen}
          onClose={handleCloseDialog}
          cinema={selectedCinema!}
          onSave={handleOnSave}
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
