import React, { useEffect, useState } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  Box,
  Typography,
  Button,
  SelectChangeEvent,
  Paper,
} from "@mui/material";
import {
  KeyboardArrowDown,
  MovieOutlined,
  LocationOnOutlined,
  CalendarTodayOutlined,
  AccessTimeOutlined,
  LocalMoviesOutlined,
} from "@mui/icons-material";
import { keyframes, styled } from "@mui/material/styles";
import { useShowtimes } from "../../../providers/ShowtimesProvider";
import { useRooms } from "../../../providers/RoomsProvider";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../providers/AuthProvider";

// Styled components for elegant design
const StyledPaper = styled(Paper)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: theme.spacing(3),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
  },
}));

const StyledSelect = styled(Select)(({ value }) => ({
  height: "56px",
  borderRadius: "12px",
  backgroundColor: value
    ? "rgba(220, 38, 38, 0.1)"
    : "rgba(255, 255, 255, 0.05)",
  border: `2px solid ${value ? "#dc2626" : "rgba(255, 255, 255, 0.1)"}`,
  transition: "all 0.3s ease",
  "& .MuiSelect-select": {
    color: value ? "#dc2626" : "#999",
    fontWeight: 600,
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&:hover": {
    backgroundColor: value
      ? "rgba(220, 38, 38, 0.15)"
      : "rgba(255, 255, 255, 0.08)",
    borderColor: value ? "#b91c1c" : "rgba(255, 255, 255, 0.2)",
  },
  "&.Mui-focused": {
    backgroundColor: value
      ? "rgba(220, 38, 38, 0.15)"
      : "rgba(255, 255, 255, 0.08)",
    borderColor: "#dc2626",
  },
}));

const StyledButton = styled(Button)(({ disabled }) => ({
  height: "56px",
  borderRadius: "12px",
  fontSize: "18px",
  fontWeight: 700,
  textTransform: "none",
  background: disabled
    ? "linear-gradient(135deg, #666 0%, #555 100%)"
    : "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
  boxShadow: disabled ? "none" : "0 4px 15px rgba(220, 38, 38, 0.4)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: disabled
      ? "linear-gradient(135deg, #666 0%, #555 100%)"
      : "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
    transform: disabled ? "none" : "translateY(-2px)",
    boxShadow: disabled ? "none" : "0 6px 20px rgba(220, 38, 38, 0.6)",
  },
}));

const QuickBook: React.FC = () => {
  const { getCurrentShowtime, currentShowtime } = useShowtimes();
  const { rooms, fetchRoomsData } = useRooms();
  const { isLoggedIn } = useAuth();

  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [filteredCinemas, setFilteredCinemas] = useState<string[]>([]);
  const [filteredDates, setFilteredDates] = useState<string[]>([]);
  const [filteredTimes, setFilteredTimes] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleBook = () => {
    if (allSelected) {
      const movie = currentShowtime.find(
        (movie) => movie._id === selectedMovie
      );

      if (movie && movie.showtimes) {
        const selectedShowtime = movie.showtimes.find((showtime) => {
          const room = rooms.find((room) => room._id === showtime.room_id);
          return (
            room?.cinema.name === selectedCinema &&
            new Date(showtime.showtime).toISOString().split("T")[0] ===
              selectedDate &&
            new Date(showtime.showtime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }) === selectedTime
          );
        });
        if (selectedShowtime) {
          navigate(`/user/movie-detail/${selectedMovie}`, {
            state: { showtimeId: selectedShowtime._id },
          });
        } else {
          alert("Selected showtime not found.");
        }
      } else {
        alert("Movie or showtimes not found.");
      }
    } else {
      alert("Please select all options before booking.");
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    console.log("User ID:", userId);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        await getCurrentShowtime();
        console.log("Current Showtimes:", currentShowtime);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
    const fetchRooms = async () => {
      try {
        await fetchRoomsData();
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    fetchRooms();
    fetchMovies();
  }, []);

  useEffect(() => {
    if (selectedMovie) {
      const movie = currentShowtime.find(
        (movie) => movie._id === selectedMovie
      );
      if (movie) {
        const cinemas = Array.from(
          new Set(
            movie.showtimes?.map((showtime) => {
              const room = rooms.find((room) => room._id === showtime.room_id);
              return room?.cinema.name;
            })
          )
        ).filter((cinema) => cinema); // Filter out undefined values
        setFilteredCinemas(cinemas as string[]);
      }
    } else {
      setFilteredCinemas([]);
    }
    setSelectedCinema("");
    setSelectedDate("");
    setSelectedTime("");
  }, [selectedMovie, currentShowtime, rooms]);

  useEffect(() => {
    if (selectedCinema) {
      const movie = currentShowtime.find(
        (movie) => movie._id === selectedMovie
      );
      if (movie) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastDay = new Date(today);
        lastDay.setDate(today.getDate() + 6);

        const dates = Array.from(
          new Set(
            movie
              .showtimes!.filter((showtime) => {
                const room = rooms.find(
                  (room) => room._id === showtime.room_id
                );
                if (room?.cinema.name !== selectedCinema) return false;
                const showDate = new Date(showtime.showtime);
                showDate.setHours(0, 0, 0, 0);
                return showDate >= today && showDate <= lastDay;
              })
              .map(
                (showtime) =>
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
  }, [selectedCinema, selectedMovie, currentShowtime, rooms]);

  useEffect(() => {
    if (selectedDate) {
      const movie = currentShowtime.find(
        (movie) => movie._id === selectedMovie
      );
      if (movie) {
        const times = Array.from(
          new Set(
            movie
              .showtimes!.filter((showtime) => {
                const room = rooms.find(
                  (room) => room._id === showtime.room_id
                );
                return (
                  room?.cinema.name === selectedCinema &&
                  new Date(showtime.showtime).toISOString().split("T")[0] ===
                    selectedDate
                );
              })
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
  }, [selectedDate, selectedCinema, selectedMovie, currentShowtime, rooms]);

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
    return <KeyboardArrowDown sx={{ color: "#999999", mr: 1 }} />;
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

  if (!isLoggedIn) {
    return (
      <Box
        sx={{
          width: "100%",
          px: { xs: 2, sm: 4, md: "8%" },
          py: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <StyledPaper
          sx={{
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(40, 40, 40, 0.9) 0%, rgba(60, 60, 60, 0.9) 100%)",
          }}
        >
          <LocalMoviesOutlined sx={{ fontSize: 48, color: "#999", mb: 2 }} />
          <Typography
            variant="h5"
            sx={{
              color: "#999",
              fontWeight: 500,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Please sign in to use quick booking feature
          </Typography>
        </StyledPaper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 2, sm: 4, md: "8%" },
        py: 3,
      }}
    >
      <StyledPaper
        sx={{
          animation: allSelected ? `${shake} 0.5s ease-in-out` : "none",
          borderColor: allSelected ? "#dc2626" : "rgba(255, 255, 255, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", "1536px": "row" },
            alignItems: "center",
            gap: 3,
          }}
        >
          {/* Title Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <LocalMoviesOutlined sx={{ fontSize: 32, color: "white" }} />
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: 700,
                fontSize: { xs: "1.5rem", sm: "2rem" },
                background: "linear-gradient(135deg, #ffffff 0%, #dc2626 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              QUICK BOOK
            </Typography>
          </Box>

          {/* Selection Controls */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr", // 1 column on extra small screens
                sm: "1fr 1fr", // 2 columns on small screens
                md: "1fr 1fr", // 2 columns on medium screens
                lg: "1fr 1fr 1fr 1fr", // 4 columns on large screens
              },
              gap: 2,
            }}
          >
            {/* Movie Selection */}
            <FormControl variant="outlined" sx={{ minWidth: 180 }}>
              <StyledSelect
                value={selectedMovie}
                onChange={handleMovieChange as any}
                displayEmpty
                IconComponent={renderArrow}
                MenuProps={menuProps}
              >
                <MenuItem value="">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <MovieOutlined sx={{ fontSize: 20, color: "#999" }} />
                    <em>Select Movie</em>
                  </Box>
                </MenuItem>
                {currentShowtime.map((movie) => (
                  <MenuItem key={movie._id} value={movie._id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MovieOutlined sx={{ fontSize: 20, color: "#dc2626" }} />
                      {movie.title}
                    </Box>
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>

            {/* Cinema Selection */}
            <FormControl
              variant="outlined"
              sx={{ minWidth: 180 }}
              disabled={!selectedMovie}
            >
              <StyledSelect
                value={selectedCinema}
                onChange={handleCinemaChange as any}
                displayEmpty
                IconComponent={renderArrow}
                MenuProps={menuProps}
              >
                <MenuItem value="">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOnOutlined sx={{ fontSize: 20, color: "#999" }} />
                    <em>Select Cinema</em>
                  </Box>
                </MenuItem>
                {filteredCinemas.map((cinema) => (
                  <MenuItem key={cinema} value={cinema}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationOnOutlined
                        sx={{ fontSize: 20, color: "#dc2626" }}
                      />
                      {cinema}
                    </Box>
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>

            {/* Date Selection */}
            <FormControl
              variant="outlined"
              sx={{ minWidth: 180 }}
              disabled={!selectedCinema}
            >
              <StyledSelect
                value={selectedDate}
                onChange={handleDateChange as any}
                displayEmpty
                IconComponent={renderArrow}
                MenuProps={menuProps}
              >
                <MenuItem value="">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarTodayOutlined
                      sx={{ fontSize: 20, color: "#999" }}
                    />
                    <em>Select Date</em>
                  </Box>
                </MenuItem>
                {filteredDates.map((date) => (
                  <MenuItem key={date} value={date}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarTodayOutlined
                        sx={{ fontSize: 20, color: "#dc2626" }}
                      />
                      {new Date(date).toLocaleDateString()}
                    </Box>
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>

            {/* Time Selection */}
            <FormControl
              variant="outlined"
              sx={{ minWidth: 180 }}
              disabled={!selectedDate}
            >
              <StyledSelect
                value={selectedTime}
                onChange={handleTimeChange as any}
                displayEmpty
                IconComponent={renderArrow}
                MenuProps={menuProps}
              >
                <MenuItem value="">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeOutlined sx={{ fontSize: 20, color: "#999" }} />
                    <em>Select Time</em>
                  </Box>
                </MenuItem>
                {filteredTimes.map((time) => (
                  <MenuItem key={time} value={time}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeOutlined
                        sx={{ fontSize: 20, color: "#dc2626" }}
                      />
                      {time}
                    </Box>
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>
          </Box>

          {/* Book Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: { xs: 1, xl: 0 },
            }}
          >
            <StyledButton
              variant="contained"
              onClick={handleBook}
              disabled={!allSelected}
              sx={{
                minWidth: 200,
                width: { xs: "100%", sm: "300px" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocalMoviesOutlined />
                BOOK NOW
              </Box>
            </StyledButton>
          </Box>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default QuickBook;
