import React, { useEffect, useState } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  Box,
  Typography,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { keyframes } from "@emotion/react";
import { useShowtimes } from "../../../providers/ShowtimesProvider";
import { MovieType } from "../../../interfaces/types";

const QuickBook: React.FC = () => {
  const { getCurrentShowtime, currentShowtime } = useShowtimes();
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [filteredCinemas, setFilteredCinemas] = useState<string[]>([]);
  const [filteredDates, setFilteredDates] = useState<string[]>([]);
  const [filteredTimes, setFilteredTimes] = useState<string[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        await getCurrentShowtime();
        setMovies(currentShowtime);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
  
    fetchMovies();
  }, [])

  useEffect(() => {
    if (selectedMovie) {
      const movie = movies.find((movie) => movie._id === selectedMovie);
      if (movie) {
        const cinemas = Array.from(
          new Set(
            movie.showtimes?.map((showtime) => showtime.room_id)
          )
        );
        setFilteredCinemas(cinemas);
      }
    } else {
      setFilteredCinemas([]);
    }
    setSelectedCinema("");
    setSelectedDate("");
    setSelectedTime("");
  }, [selectedMovie, movies]);

  useEffect(() => {
    if (selectedCinema) {
      const movie = movies.find((movie) => movie._id === selectedMovie);
      if (movie) {
        const dates = Array.from(
          new Set(
            movie.showtimes!
              .filter((showtime) => showtime.room_id === selectedCinema)
              .map((showtime) =>
                new Date(showtime.showtime).toISOString().split("T")[0]
              )
          )
        );
        setFilteredDates(dates);
      }
    } else {
      setFilteredDates([]);
    }
    setSelectedDate("");
    setSelectedTime("");
  }, [selectedCinema, selectedMovie, movies]);

  useEffect(() => {
    if (selectedDate) {
      const movie = movies.find((movie) => movie._id === selectedMovie);
      if (movie) {
        const times = Array.from(
          new Set(
            movie.showtimes!
              .filter(
                (showtime) =>
                  showtime.room_id === selectedCinema &&
                  new Date(showtime.showtime).toISOString().split("T")[0] ===
                    selectedDate
              )
              .map((showtime) =>
                new Date(showtime.showtime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              )
          )
        );
        setFilteredTimes(times);
      }
    } else {
      setFilteredTimes([]);
    }
    setSelectedTime("");
  }, [selectedDate, selectedCinema, selectedMovie, movies]);


  const handleMovieChange = (event: SelectChangeEvent<string>) => {
    setSelectedMovie(event.target.value);
    setSelectedCinema("");
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleCinemaChange = (event: SelectChangeEvent<string>) => {
    setSelectedCinema(event.target.value);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleDateChange = (event: SelectChangeEvent<string>) => {
    setSelectedDate(event.target.value);
    setSelectedTime("");
  };

  const handleTimeChange = (event: SelectChangeEvent<string>) => {
    setSelectedTime(event.target.value);
  };

  const renderArrow = () => {
    return <KeyboardArrowDownIcon sx={{ color: "#999999", mr: 1 }} />;
  };

  const menuProps = {
    PaperProps: {
      sx: {
        backgroundColor: "black",
        color: "white",
        "& .MuiMenuItem-root": { opacity: 0.5 },
      },
    },
  };

  const allSelected =
    selectedMovie && selectedCinema && selectedDate && selectedTime;

  const shake = keyframes`
    0%, 100% { transform: translateY(0); }
    25% { transform: translateY(-10px); }
    50% { transform: translateY(10px); }
    75% { transform: translateY(-10px); }
  `;

  return (
    <div className="w-full px-[8%] h-[100px] z-30">
      <Box
        sx={{
          animation: allSelected ? `${shake} 0.5s ease-in-out` : "none",
          borderColor: allSelected ? "secondary.main" : "#111",
          borderWidth: "2px",
          borderStyle: "solid",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          backgroundColor: "#111",
          transition: "all 0.5s ease-in-out",
        }}
      >
        <div className="text-white text-3xl ml-2 mr-4 font-semibold font-['Poppins']">
          QUICK BOOK
        </div>
        <FormControl variant="outlined" sx={{ width: 180 }}>
          <Select
            value={selectedMovie}
            onChange={handleMovieChange}
            displayEmpty
            IconComponent={renderArrow}
            MenuProps={menuProps}
            sx={{
              height: "45px",
              color: selectedMovie ? "black" : "#999999",
              fontSize: "18px",
              fontWeight: "semibold",
              backgroundColor: selectedMovie ? "secondary.main" : "#111",
              border: selectedMovie ? "" : "2px solid #999999",
              "& .MuiSelect-select": {
                color: selectedMovie ? "black" : "#999999",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            <MenuItem value="">
              <em>Movie</em>
            </MenuItem>
            {movies.map((movie) => (
              <MenuItem key={movie._id} value={movie._id}>
                {movie.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          variant="outlined"
          sx={{ width: 180 }}
          disabled={!selectedMovie}
        >
          <Select
            value={selectedCinema}
            onChange={handleCinemaChange}
            displayEmpty
            IconComponent={renderArrow}
            MenuProps={menuProps}
            sx={{
              height: "45px",
              color: selectedCinema ? "black" : "#999999",
              fontSize: "18px",
              fontWeight: "semibold",
              backgroundColor: selectedCinema ? "secondary.main" : "#111",
              border: selectedCinema ? "" : "2px solid #999999",
              "& .MuiSelect-select": {
                color: selectedCinema ? "black" : "#999999",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            <MenuItem value="">
              <em>Cinema</em>
            </MenuItem>
            {filteredCinemas.map((cinema) => (
              <MenuItem key={cinema} value={cinema}>
                {cinema}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          variant="outlined"
          sx={{ width: 180 }}
          disabled={!selectedCinema}
        >
          <Select
            value={selectedDate}
            onChange={handleDateChange}
            displayEmpty
            IconComponent={renderArrow}
            MenuProps={menuProps}
            sx={{
              height: "45px",
              color: selectedDate ? "black" : "#999999",
              fontSize: "18px",
              fontWeight: "semibold",
              backgroundColor: selectedDate ? "secondary.main" : "#111",
              border: selectedDate ? "" : "2px solid #999999",
              "& .MuiSelect-select": {
                color: selectedDate ? "black" : "#999999",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            <MenuItem value="">
              <em>Date</em>
            </MenuItem>
            {filteredDates.map((date) => (
              <MenuItem key={date} value={date}>
                {new Date(date).toLocaleDateString()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          variant="outlined"
          sx={{ width: 180 }}
          disabled={!selectedDate}
        >
          <Select
            value={selectedTime}
            onChange={handleTimeChange}
            displayEmpty
            IconComponent={renderArrow}
            MenuProps={menuProps}
            sx={{
              height: "45px",
              color: selectedTime ? "black" : "#999999",
              fontSize: "18px",
              fontWeight: "semibold",
              backgroundColor: selectedTime ? "secondary.main" : "#111",
              border: selectedTime ? "" : "2px solid #999999",
              "& .MuiSelect-select": {
                color: selectedTime ? "black" : "#999999",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            <MenuItem value="">
              <em>Time</em>
            </MenuItem>
            {filteredTimes.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          sx={{
            height: "50px",
            width: "180px",
            marginRight: 1,
            backgroundColor: allSelected ? "secondary.main" : "gray",
            transition: "background-color 0.5s ease-in-out",
          }}
          variant="contained"
        >
          <Typography sx={{ fontSize: 24, fontWeight: "medium" }}>
            BOOK
          </Typography>
        </Button>
      </Box>
    </div>
  );
};

export default QuickBook;
