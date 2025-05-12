import React, { useState, ChangeEvent } from "react";
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

const QuickBook: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleMovieChange = (event: SelectChangeEvent<string>) => {
    setSelectedMovie(event.target.value);
  };

  const handleCinemaChange = (event: SelectChangeEvent<string>) => {
    setSelectedCinema(event.target.value);
  };

  const handleDateChange = (event: SelectChangeEvent<string>) => {
    setSelectedDate(event.target.value);
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

  const allSelected = selectedMovie && selectedCinema && selectedDate && selectedTime;

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
              fontWeight: "bold",
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
            <MenuItem value="Movie1">Movie 1</MenuItem>
            <MenuItem value="Movie2">Movie 2</MenuItem>
            <MenuItem value="Movie3">Movie 3</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ width: 180 }}>
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
              fontWeight: "bold",
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
            <MenuItem value="Cinema1">Cinema 1</MenuItem>
            <MenuItem value="Cinema2">Cinema 2</MenuItem>
            <MenuItem value="Cinema3">Cinema 3</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ width: 180 }}>
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
              fontWeight: "bold",
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
            <MenuItem value="2024-12-14">14/12/2024</MenuItem>
            <MenuItem value="2024-12-15">15/12/2024</MenuItem>
            <MenuItem value="2024-12-16">16/12/2024</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ width: 180 }}>
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
              fontWeight: "bold",
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
            <MenuItem value="10:00">10:00</MenuItem>
            <MenuItem value="13:00">13:00</MenuItem>
            <MenuItem value="16:20">16:20</MenuItem>
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