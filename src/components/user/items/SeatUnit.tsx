import { Box } from "@mui/material";
import React from "react";
import { SeatType } from "../../../interfaces/types";

interface SeatUnitProps {
  seat: SeatType;
  available: boolean;
  isSelected: boolean;
  onSelect: (seat: SeatType) => void;
}
const SeatUnit: React.FC<SeatUnitProps> = ({ seat, available, isSelected, onSelect }) => {
  const handleClick = () => {
    if (available) {
      onSelect(seat); // Notify parent component of the selection
    }
  };

  const getBackgroundColor = () => {
    if (isSelected) {
      return "#c9a512"; // Red for selected
    }
    if (available) {
      return "#fafafa"; // Light gray for available
    }
    return "#999999"; // Gray for unavailable
  };

  const getTextColor = () => {
    if (isSelected) {
      return "#ffffff";
    }
    if (available) {
      return "#000000";
    }
    return "#ffffff";
  };

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
        cursor: available ? "pointer" : "not-allowed",
        transition: "background-color 0.3s ease",
      }}
    >
      {seat.seat_name}
    </Box>
  );
};

export default SeatUnit;
