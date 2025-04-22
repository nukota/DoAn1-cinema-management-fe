import React from "react";
import { RoomType, ShowtimeType } from "../../../interfaces/types";
import { Box, Typography } from "@mui/material";
import Showtime from "./Showtime";

interface RoomShowtimesProps {
  room: RoomType;
  showtimes: ShowtimeType[];
}

const RoomShowtimes: React.FC<RoomShowtimesProps> = ({ room, showtimes }) => {
  console.log("RoomShowtimes", room, showtimes);
  return (
    <Box className="w-[280px] h-[484px] bg-[#f2f2f2] rounded-xl flex flex-col p-4">
      {/* Room Information */}
      <Box className="mb-4">
        <Typography variant="body2" className="text-dark-gray">
          Cinema: {room.cinema_id}
        </Typography>
        <Typography variant="body2" className="text-gray">
          Room: #{room.room_id} {room.name}
        </Typography>
      </Box>

      {/* List of Showtimes */}
      <Box className="flex flex-col gap-2 overflow-y-auto">
        {showtimes.map((showtime) => (
          <Showtime key={showtime.showtime_id} {...showtime} />
        ))}
      </Box>
    </Box>
  );
};

export default RoomShowtimes;
