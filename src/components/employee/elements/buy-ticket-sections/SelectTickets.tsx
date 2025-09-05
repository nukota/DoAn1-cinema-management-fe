import React from "react";
import { Box, Typography } from "@mui/material";
import { MovieType, ShowtimeType } from "../../../../interfaces/types";
import ShowtimeUnit from "../../items/ShowtimeUnit";

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
  return (
    <div className="flex gap-4 w-full">
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
        filteredShowtimes.map((movie: MovieType) => (
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
        ))
      )}
    </div>
  );
};

export default SelectTickets;
