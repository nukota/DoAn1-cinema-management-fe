import React, { useState, ChangeEvent } from "react";
import SearchImg from "../../assets/images/search.svg";
import { exampleRooms, exampleShowtimes } from "../../data";
import { Button } from "@mui/material";
import { MovieType, ShowtimeType } from "../../interfaces/types";
import { Swiper, SwiperSlide } from "swiper/react";
import RoomShowtimes from "./items/RoomShowtimes";
import { Mousewheel, Navigation } from "swiper/modules";

const Showtimes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteClick = () => {};

  const handleAddNewClick = () => {};

  const filteredShowtimes = exampleShowtimes.filter((showtime) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (showtime.showtime_id &&
        showtime.showtime_id.toString().includes(searchTermLower)) ||
      (showtime.movie_id &&
        showtime.movie_id.toString().includes(searchTermLower))
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

      <div className="content mt-3 h-full min-h-[568px] w-[calc(100vw - 336px)] bg-white rounded-xl overflow-visible">
      <Swiper
        modules={[Navigation, Mousewheel]}
        spaceBetween={0}
        slidesPerView={5}
        loop={true}
        navigation
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1280: {
            slidesPerView: 5,
          },
        }}
        className="w-full movie-slide"
      >
        {exampleRooms.map((item, index) => (
          <SwiperSlide key={index}>
            <RoomShowtimes  />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-gradient-left"></div>
      <div className="swiper-gradient-right"></div>
      </div>
    </div>
  );
};

export default Showtimes;
