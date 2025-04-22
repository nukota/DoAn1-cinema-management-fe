import React, { useState, useRef } from "react";
import wallPaperImg from "../../assets/images/wallpaper.jpg";
import MovieSlide from "./elements/MovieSlide";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import {
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import QuickBook from "./elements/QuickBook";
import { exampleMovies } from "../../data";
import { MovieType } from "../../interfaces/types";

const UserHome: React.FC = () => {
  const navigate = useNavigate();
  const handleBuyTicketClicked = () => {
    navigate("/user/movie-detail");
  };
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const demoMovie: MovieType = exampleMovies[0];
  return (
    <div className="bg-black min-h-screen w-full h-full flex flex-col relative">
      <img
        className="absolute w-full h-[100vh] top-0 z-0 opacity-20"
        src={wallPaperImg}
      />
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          alignContent: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyItems: "center",
          zIndex: 10,
          position: "relative",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            fontFamily: "Poppins",
            color: "white",
            mb: 2,
          }}
        >
          MTM CINEMA
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontFamily: "Poppins",
            color: "gray",
          }}
        >
          Book Tickets for available movies now
        </Typography>
      </Box>
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          top: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.5,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "normal",
            fontFamily: "Poppins",
            color: "white",
            mr: 1,
          }}
        >
          Slide down for more
        </Typography>
        <KeyboardDoubleArrowDownIcon sx={{ color: "white" }} />
      </Box>
      <div className="space-y-32 w-full mt-10 px-5 z-30">
        <MovieSlide title="Now Showing" movies={exampleMovies} />
        <MovieSlide title="Up Coming" movies={exampleMovies} />
        <MovieSlide title="All" movies={exampleMovies} />
      </div>
      <QuickBook />
      <div className="w-full bg-black z-20">
      </div>
    </div>
  );
};
export default UserHome;
