import React from "react";
import { Box, Typography } from "@mui/material";
import { ShowtimeType } from "../../../interfaces/types";

type ShowtimeUnitProps = {
  showtimeData: ShowtimeType;
  selected: boolean;
  onClick: () => void;
};

const ShowtimeUnit: React.FC<ShowtimeUnitProps> = ({
  showtimeData,
  selected,
  onClick,
}) => {
  const formattedTime = new Date(showtimeData.showtime).toLocaleTimeString(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div
      onClick={onClick}
      className={`w-[56px] h-[38px] text-md border rounded-lg px-4 py-2 inline-flex items-center justify-center cursor-pointer transition-all duration-300 ${
        selected
          ? "bg-[#b80007] text-white border-[#b80007]"
          : "bg-white text-black border-gray-300 hover:bg-gray-100"
      }`}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          color: selected ? "white" : "#333",
        }}
      >
        {formattedTime}
      </Typography>
    </div>
  );
};

export default ShowtimeUnit;
