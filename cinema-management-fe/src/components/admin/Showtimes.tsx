import React, { useState } from "react";
import SearchImg from "../../assets/images/search.svg";
import CalendarImg from "../../assets/images/calendar.svg";
import { exampleRooms, exampleShowtimes } from "../../data";
import { Box, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import RoomShowtimes from "./items/RoomShowtimes";
import { Mousewheel, Navigation } from "swiper/modules";
import theme from "../../main";
import { ShowtimeType } from "../../interfaces/types";

const Showtimes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedCinema, setSelectedCinema] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleCalendarClick = () => {
    const datePicker = document.getElementById(
      "date-picker"
    ) as HTMLInputElement;
    datePicker.focus();
  };

  const uniqueCinemas = Array.from(
    new Set(exampleRooms.map((room) => room.cinema_id))
  ).map((cinema_id) => ({
    cinema_id,
    name: `Cinema ${cinema_id}`,
  }));

  const handleCinemaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCinema(event.target.value);
  };

  const handleAddShowtime = (nweShowtime: ShowtimeType) => {
    // Add logic to handle adding a showtime for the specified room
  };

  const handleDeleteClick = () => {};
  const handleAddNewClick = () => {};

  const filteredShowtimes = exampleShowtimes.filter((showtime) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearchTerm =
      (showtime.showtime_id &&
        showtime.showtime_id.toString().includes(searchTermLower)) ||
      (showtime.movie_id &&
        showtime.movie_id.toString().includes(searchTermLower));

    const matchesDate =
      !selectedDate || showtime.showtime.startsWith(selectedDate);

    return matchesSearchTerm && matchesDate;
  });

  // Group filtered showtimes by room
  const roomsWithShowtimes = exampleRooms
    .filter(
      (room) => !selectedCinema || room.cinema_id.toString() === selectedCinema
    )
    .map((room) => ({
      ...room,
      showtimes: filteredShowtimes.filter(
        (showtime) => showtime.room_id === room._id
      ),
    }));
  console.log("Rooms with Showtimes:", roomsWithShowtimes);
  return (
    <div className="showtimes flex flex-col h-[673px] overflow-y-visible scrollbar-hide relative">
      <div className="text-40px font-medium text-dark-gray">Showtimes</div>
      <div className="flex flex-col 1270-break-point:flex-row">
        <div className="flex flex-row items-center">
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
          <div className="DateFilterBar relative ml-5 w-full max-w-[240px] h-8 mt-2">
            <input
              type="date"
              id="date-picker"
              className="w-full h-full pr-5 pl-10 text-sm text-red rounded-full text-gray-700 bg-white border-red border-2 focus:outline-none focus:ring-1"
              value={selectedDate}
              onChange={handleDateChange}
            />
            <img
              src={CalendarImg}
              alt="Calendar"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer"
              style={{
                filter:
                  "invert(10%) sepia(88%) saturate(6604%) hue-rotate(352deg) brightness(73%) contrast(105%)",
              }}
              onClick={handleCalendarClick}
            />
          </div>
          <div className="CinemaFilterBar relative ml-5 w-full max-w-[240px] h-8 mt-2">
            <select
              className="size-full pl-10 pr-5 text-sm text-dark-gray rounded-full text-gray-700 bg-white border-line-gray border-2 focus:outline-none focus:ring-1"
              value={selectedCinema}
              onChange={handleCinemaChange}
            >
              <option value="">All Cinemas</option>
              {uniqueCinemas.map((cinema) => (
                <option key={cinema.cinema_id} value={cinema.cinema_id}>
                  {cinema.name}
                </option>
              ))}
            </select>
            <img
              src={SearchImg}
              alt="Cinema"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4"
            />
          </div>
        </div>
        <div className="flex flex-row items-center 1270-break-point:ml-auto">
          <Button
            onClick={handleAddNewClick}
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              ml: { 1270: 2 },
              width: "114px",
              height: "32px",
            }}
          >
            Add New
          </Button>
        </div>
      </div>

      <Box
        sx={{
          position: "relative",
          mt: 4,
          width: { xs: "100%", md: "80%" },
          maxWidth: { md: "960px", lg: "1200px", xl: "2000px" },
          px: 2,
          py: 2,
          height: "100%",
          backgroundColor: "white",
          borderRadius: "12px",
          overflowY: "scroll",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "center",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Swiper
          modules={[Navigation, Mousewheel]}
          spaceBetween={0}
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
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 2,
            },
            1280: {
              slidesPerView: 3,
            },
            1536: {
              slidesPerView: 4,
            },
          }}
          style={{
            width: "100%",
            padding: 0,
            margin: 0,
          }}
        >
          <style>
            {`
      .swiper-button-next,
      .swiper-button-prev {
        color: ${theme.palette.primary.main}; /* Use MUI primary color */
        font-size: 1.2rem;
        font-weight: bold;
      }
    `}
          </style>
          {roomsWithShowtimes.map((room) => (
            <SwiperSlide key={room._id}>
              <RoomShowtimes room={room} showtimes={room.showtimes} onAddShowtime={handleAddShowtime}/>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </div>
  );
};

export default Showtimes;
