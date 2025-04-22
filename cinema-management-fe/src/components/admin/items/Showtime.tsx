import React from "react";
import { ShowtimeType } from "../../../interfaces/types";
import { Box, Typography } from "@mui/material";

const Showtime: React.FC<ShowtimeType> = (showtime) => {
  return (
    <Box className="w-full h-[160px] bg-[#eee] rounded-xl flex flex-col justify-between p-4">
      <Typography variant="h6" className="text-dark-gray">
        Showtime ID: {showtime.showtime_id}
      </Typography>

      {/* Movie ID */}
      <Typography variant="body1" className="text-gray">
        Movie ID: {showtime.movie_id}
      </Typography>

      {/* Cinema ID */}
      <Typography variant="body1" className="text-gray">
        Room ID: {showtime.room_id}
      </Typography>

      {/* Showtime */}
      <Typography variant="body1" className="text-gray">
        Showtime: {new Date(showtime.showtime).toLocaleString()}
      </Typography>
    </Box>
  );
};

export default Showtime;
