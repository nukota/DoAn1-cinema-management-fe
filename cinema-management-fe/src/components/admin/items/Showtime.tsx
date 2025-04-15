import React from "react";
import infoImg from "../../../assets/images/info.svg";
import { exampleShowtimes } from "../../../data";
import { RoomType, ShowtimeType } from "../../../interfaces/types";
import { Box } from "@mui/material";

const Room: React.FC<ShowtimeType> = (showtime) => {
  return (
    <Box className="w-full h-full bg-[#eee]">
        <Box className="w-full h-[160px] bg-[#ddd]">
            
        </Box>
    </Box>
  );
};

export default Room;
