import React, { useState, ChangeEvent } from "react"
import Theater from "./items/Theater"
import SearchImg from "../../assets/images/search.svg";
import addImg from "../../assets/images/add.svg";
import { exampleRooms } from "../../data";

const Theaters: React.FC = () => {
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

  const filteredTheaters = exampleRooms.filter((theater) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (theater.room_id && theater.room_id.toString().includes(searchTermLower)) ||
      (theater.playing && theater.playing.toLowerCase().includes(searchTermLower)) ||
      (theater.seat_count && theater.seat_count.toString().includes(searchTermLower))
    );
  });

  return (
    <div className="Theaters flex flex-col h-[665px]">
      <div className="text-40px font-medium text-light-gray">Theaters</div>
      <div className="flex flex-row items-center mt-4">
        <div className="SearchBar relative w-full max-w-[240px] h-8">
          <input
            type="text"
            className="size-full pl-10 pr-5 text-sm text-gray rounded-full text-gray-700 bg-black border-light-gray border-2 focus:outline-none focus:ring-1"
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
        <button
          className="DeleteBtn ml-auto w-[114px] h-8 border-2 border-red text-red rounded-md items-center justify-center font-medium tracking-widest hover:bg-[#380005] duration-200"
          onClick={handleDeleteClick}
        >
          Delete
        </button>
        <button
          className="AddNewBtn ml-5 w-[114px] h-8 border-2 border-red bg-red text-black rounded-md items-center justify-center font-medium tracking-widest hover:bg-dark-red hover:border-dark-red duration-200"
          onClick={handleAddNewClick}
        >
          Add New
        </button>
      </div>

      <div className="content mt-[14px] w-full h-full bg-black border-[3px] border-light-gray rounded-xl pl-12 py-6 pr-4 overflow-auto">
        <div className="list grid grid-cols-5 gap-x-6 gap-y-8 max-h-[490px] py-3 overflow-y-auto">
          {filteredTheaters.map((theater, index) => (
            <Theater key={index} {...theater} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Theaters;