import React, { useState, ChangeEvent } from "react";
import Room from "./items/Room";
import SearchImg from "../../assets/images/search.svg";
import { exampleRooms } from "../../data";
import { Button } from "@mui/material";

const Rooms: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteClick = () => {
    alert("Delete Btn clicked");
  };

  const handleAddNewClick = () => {
    alert("Add New Btn clicked");
  };

  const filteredRooms = exampleRooms.filter((room) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (room.room_id && room.room_id.toString().includes(searchTermLower)) ||
      (room.seat_count && room.seat_count.toString().includes(searchTermLower))
    );
  });

  return (
    <div className="Rooms flex flex-col h-[665px]">
      <div className="text-40px font-medium text-dark-gray">Rooms</div>
      <div className="flex flex-row items-center mt-4">
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
        <Button
          onClick={handleAddNewClick}
          variant="contained"
          color="primary"
          sx={{
            mt: 2,
            ml: 2,
            width: "114px",
            height: "32px",
          }}
        >
          Add New
        </Button>
      </div>

      <div className="content mt-[14px] w-full h-full bg-white border-[3px] border-light-gray rounded-xl pl-12 py-6 pr-4 overflow-auto">
        <div className="list grid grid-cols-5 gap-x-6 gap-y-8 max-h-[490px] py-3 overflow-y-auto">
          {filteredRooms.map((room, index) => (
            <Room key={index} {...room} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rooms;
