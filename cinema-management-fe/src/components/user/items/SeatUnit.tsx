import { Box, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { SeatType } from "../../../interfaces/types";

interface SeatUnitProps {
  seat: SeatType;
  status: "available" | "reserved" | "selected";
  onSelect: (seat: SeatType) => void;
}
const SeatUnit: React.FC<SeatUnitProps> = ({ seat, status, onSelect }) => {
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleClick = () => {
    if (currentStatus === "available") {
      setCurrentStatus("selected");
      onSelect(seat);
    }
  };

  const getBackgroundColor = () => {
    switch (currentStatus) {
      case "available":
        return "#fafafa"; // Green for available
      case "selected":
        return "#b80007"; // Blue for selected
      default:
        return "#999999"; // Default background
    }
  };

  const getTextColor = () => {
    switch (currentStatus) {
      case "available":
        return "#000000"; // Black for available
      case "selected":
        return "#ffffff"; // White for selected
      default:
        return "#ffffff"; // Default text color
    }
  }

  return (
    <Box
      onClick={handleClick}
      sx={{
        width: "40px",
        height: "24px",
        borderRadius: "6px",
        backgroundColor: getBackgroundColor(),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: getTextColor(),
        fontSize: "12px",
        fontWeight: "bold",
        textAlign: "center",
        cursor: currentStatus === "available" ? "pointer" : "not-allowed",
        transition: "background-color 0.3s ease",
      }}
    >
      {seat.seat_name}
    </Box>
  );
};

export default SeatUnit;
