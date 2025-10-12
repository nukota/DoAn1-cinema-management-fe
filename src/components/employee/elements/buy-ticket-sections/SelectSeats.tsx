import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { SeatType } from "../../../../interfaces/types";

interface SelectSeatsProps {
  seats: SeatType[];
  selectedSeats: SeatType[];
  ticketCount: number;
  loading: boolean;
  onSeatClick: (seatId: string) => void;
  onTicketCountChange: (count: number) => void;
}

const SelectSeats: React.FC<SelectSeatsProps> = ({
  seats,
  selectedSeats,
  ticketCount,
  loading,
  onSeatClick,
  onTicketCountChange,
}) => {
  const renderSeatGrid = () => {
    const rows = "ABCDEFGHIJKLMN".split("");
    const grid = [];

    for (let row = 1; row <= 14; row++) {
      for (let col = -8; col <= 8; col++) {
        const seat = seats.find(
          (s) =>
            rows.indexOf(s.seat_name[0]) + 1 === row && s.seat_column === col
        );

        grid.push(
          <Box
            key={`${row}-${col}`}
            sx={{
              width: "42px",
              height: "26px",
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
              borderRadius: "4px",
              backgroundColor: seat
                ? seat.available
                  ? selectedSeats.includes(seat)
                    ? "#b80007"
                    : "#fafafa"
                  : "#ccc"
                : "transparent",
              cursor: seat && seat.available ? "pointer" : "not-allowed",
            }}
            onClick={() => seat && seat.available && onSeatClick(seat._id)}
          >
            <Typography
              align="center"
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                color: seat
                  ? seat.available
                    ? selectedSeats.includes(seat)
                      ? "#fff"
                      : "#000"
                    : "#666"
                  : "#ccc",
              }}
            >
              {seat ? seat.seat_name : ""}
            </Typography>
          </Box>
        );
      }
    }
    return grid;
  };

  return (
    <div className="w-full h-full overflow-y-scroll custom-scrollbar flex flex-col gap-4 pb-4">
      {/* Ticket Count Picker */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingLeft: "16px",
        }}
      >
        <Typography
          style={{
            fontWeight: 400,
            fontSize: "18px",
            paddingRight: "8px",
          }}
        >
          Number of Tickets:
        </Typography>
        {/* Decrement Button */}
        <Button
          variant="outlined"
          onClick={() => onTicketCountChange(Math.max(0, ticketCount - 1))}
          style={{
            minWidth: "40px",
            height: "40px",
            fontSize: "24px",
          }}
          disabled={selectedSeats.length >= ticketCount}
        >
          -
        </Button>

        {/* Ticket Count Input */}
        <TextField
          type="number"
          value={ticketCount}
          size="small"
          onChange={(e) => {
            const value = Math.max(0, Number(e.target.value));
            onTicketCountChange(value);
          }}
          inputProps={{ min: 0 }}
          style={{ width: "60px", textAlign: "center" }}
        />

        {/* Increment Button */}
        <Button
          variant="outlined"
          onClick={() => onTicketCountChange(ticketCount + 1)}
          style={{
            minWidth: "40px",
            height: "40px",
            fontSize: "24px",
          }}
        >
          +
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px",
          border: "1px solid #ccc",
          borderRadius: "18px",
        }}
      >
        {/* Screen Representation */}
        {loading ? (
          <Typography>Loading seats...</Typography>
        ) : (
          <>
            <Typography style={{ fontSize: "24px", fontWeight: 400 }}>
              SCREEN
            </Typography>
            <div
              style={{
                width: "80%",
                minWidth: "400px",
                height: "4px",
                textAlign: "center",
                backgroundColor: "#ccc",
                borderRadius: "8px",
                fontSize: "24px",
                color: "#333",
                marginBottom: "16px",
              }}
            />

            {/* Seat Map */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(17, 42px)",
                gridTemplateRows: "repeat(14, 30px)",
                justifyContent: "center",
                gap: "8px",
                margin: "16px 0",
              }}
            >
              {renderSeatGrid()}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SelectSeats;
