import React from "react";
import { SeatType } from "../../../interfaces/types";
import { Box } from "@mui/material";

interface SeatProps {
    seat: SeatType | null;
  }
  
  const Seat: React.FC<SeatProps> = ({ seat }) => {
  return (
    <Box
      sx={{
        width: "40px",
        height: "24px",
        borderRadius: "6px",
        backgroundColor: seat? "primary.main" : "#fafafa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "12px",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      {seat?.seat_name}
    </Box>
  );
};

export default Seat;
