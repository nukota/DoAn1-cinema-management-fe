import React, { useState, ChangeEvent } from "react";
import SearchImg from "../../assets/images/search.svg";
import { exampleShowtimes } from "../../data";
import { Button } from "@mui/material";

const Showtimes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteClick = () => {
  };

  const handleAddNewClick = () => {
  };

  const filteredShowtimes = exampleShowtimes.filter((showtime) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (showtime.showtime_id && showtime.showtime_id.toString().includes(searchTermLower)) ||
      (showtime.movie_id && showtime.movie_id.toString().includes(searchTermLower))
    );
  });

  return (
    <div className="Showtimes flex flex-col h-[665px]">
      <div className="text-40px font-medium text-dark-gray">Showtimes</div>
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
          {/* {filteredShowtimes.map((showtime, index) => (
            <Showtime key={index} {...showtime} />
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default Showtimes;
