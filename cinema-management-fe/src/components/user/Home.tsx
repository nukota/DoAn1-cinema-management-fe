import React, { useEffect, useRef, useState } from "react";
import wallPaperImg from "../../assets/images/wallpaper.jpg";
import MovieSlide from "./elements/MovieSlide";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { Typography, Box } from "@mui/material";
import QuickBook from "./elements/QuickBook";
import { useMovies } from "../../providers/MoviesProvider";
import { MovieType } from "../../interfaces/types";

const UserHome: React.FC = () => {
  const { fetchMovieByStatus, loading } = useMovies();

  const [nowShowingMovies, setNowShowingMovies] = useState<MovieType[]>([]);
  const [upComingMovies, setUpComingMovies] = useState<MovieType[]>([]);
  const nextSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const nowShowing = await fetchMovieByStatus("Now Playing");
        const upComing = await fetchMovieByStatus("Coming Soon");

        setNowShowingMovies(nowShowing);
        setUpComingMovies(upComing);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="bg-black min-h-screen w-full h-full flex flex-col relative">
      <img
        className="absolute w-full h-[100vh] top-0 z-0 opacity-20"
        src={wallPaperImg}
        alt="Wallpaper"
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
          onClick={() => {
            nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
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
      </Box>

      <div ref={nextSectionRef} className="w-full mt-10 px-5 z-30">
        <div className="mt-6 mb-20">
          <QuickBook />
        </div>

        {loading ? (
          <Typography
            variant="h6"
            sx={{ color: "white", textAlign: "center", mt: 4 }}
          >
            Loading movies...
          </Typography>
        ) : (
          <div className="mb-4 flex flex-col gap-10">
            <MovieSlide title="Now Showing" movies={nowShowingMovies} />
            <MovieSlide title="Up Coming" movies={upComingMovies} />
          </div>
        )}
      </div>
      <div className="w-full bg-black z-20"></div>
    </div>
  );
};

export default UserHome;
