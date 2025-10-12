import React, { useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { MovieType, ShowtimeType } from "../../../../interfaces/types";
import ShowtimeUnit from "../../items/ShowtimeUnit";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface SelectTicketsProps {
  filteredShowtimes: MovieType[];
  selectedDate: string;
  selectedShowtime: { movie: MovieType; showtime: ShowtimeType } | null;
  onShowtimeSelect: (movie: MovieType, showtime: ShowtimeType) => void;
}

const SelectTickets: React.FC<SelectTicketsProps> = ({
  filteredShowtimes,
  selectedDate,
  selectedShowtime,
  onShowtimeSelect,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full">
      {filteredShowtimes.length === 0 ? (
        <Box
          sx={{
            width: "100%",
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontSize: "24px" }} color="#dadada" align="center">
            There&apos;s no showtime on this date
          </Typography>
        </Box>
      ) : (
        <>
          <IconButton
            onClick={scrollLeft}
            sx={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              backgroundColor: "rgba(255,255,255,0.8)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto custom-scrollbar px-8"
            style={{ scrollBehavior: "smooth" }}
          >
            {filteredShowtimes.map((movie: MovieType) => (
              <div
                key={movie._id}
                className="w-[220px] h-[480px] flex flex-col items-center border border-light-gray rounded-lg bg-white pb-2 flex-shrink-0 overflow-clip"
              >
                {/* Movie Image */}
                <div
                  className="image w-full h-[240px] bg-[#dadada] object-cover"
                  style={{
                    backgroundImage: `url(${movie.poster_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <Typography
                  className="text-center font-bold mt-4 mb-2 px-2 py-2 h-[64px]"
                  sx={{
                    fontSize: "16px",
                    color: "#484848",
                    textAlign: "center",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {movie.title}
                </Typography>
                <div className="grid grid-cols-3 gap-2 px-4 overflow-y-auto custom-scrollbar flex-1 w-full">
                  {movie.showtimes
                    ?.filter(
                      (showtime: any) =>
                        new Date(showtime.showtime).toLocaleDateString("en-CA") ===
                        selectedDate
                    )
                    .map((showtime: any) => (
                      <ShowtimeUnit
                        key={showtime._id}
                        showtimeData={showtime}
                        selected={selectedShowtime?.showtime._id === showtime._id}
                        onClick={() => onShowtimeSelect(movie, showtime)}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
          <IconButton
            onClick={scrollRight}
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              backgroundColor: "rgba(255,255,255,0.8)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </>
      )}
    </div>
  );
};

export default SelectTickets;
