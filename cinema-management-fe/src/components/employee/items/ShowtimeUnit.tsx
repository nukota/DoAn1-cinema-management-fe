import React from "react";
import { Box, Typography } from "@mui/material";
import { ShowtimeType } from "../../../interfaces/types";

type ShowtimeUnitProps = {
  showtimeData: ShowtimeType;
};

const ShowtimeUnit: React.FC<ShowtimeUnitProps> = ({ showtimeData }) => {
  const formattedTime = showtimeData.showtime;
  return (
    <div className="w-[56px] h-[38px] text-md border border-gray-300 rounded-lg px-4 py-2 inline-flex items-center justify-center bg-white cursor-pointer transition-all duration-300 hover:bg-gray-100">
      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          color: "#333",
        }}
      >
        {formattedTime}
      </Typography>
    </div>
  );
};

export default ShowtimeUnit;
