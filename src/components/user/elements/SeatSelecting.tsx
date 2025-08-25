import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { SeatType } from "../../../interfaces/types";
import SeatUnit from "../items/SeatUnit";
import NumberPicker from "../../shared/NumberPicker";
import { useSeats } from "../../../providers/SeatProvider";
import { useTimer } from "../../../providers/page/TimerProvider";

interface SeatSelectingProps {
  seats: SeatType[];
  selectedSeats: SeatType[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<SeatType[]>>;
  price?: number;
  ticketCount: number;
  setTicketCount: React.Dispatch<React.SetStateAction<number>>;
  reservationTime: number;
}
const SeatSelecting: React.FC<SeatSelectingProps> = ({
  seats,
  selectedSeats,
  setSelectedSeats,
  price,
  ticketCount,
  setTicketCount,
  reservationTime,
}) => {
  const theme = useTheme();
  const { startTimer } = useTimer();
  const { loading } = useSeats();
  const rows = "ABCDEFGHIJKLMN".split("");

  if (loading) {
    return (
      <Box
        sx={{
          textAlign: "center",
          color: "white",
          fontSize: "18px",
          marginTop: "20px",
        }}
      >
        Loading available seats...
      </Box>
    );
  }
  
  const grid = [];
  for (let row = 1; row <= 14; row++) {
    for (let col = -8; col <= 8; col++) {
      const seat = seats.find(
        (s) => rows.indexOf(s.seat_name[0]) + 1 === row && s.seat_column === col
      );
      grid.push(
        <Box
          key={`${row}-${col}`}
          sx={{
            width: "40px",
            height: "24px",
            display: "inline-block",
            textAlign: "center",
            borderRadius: "6px",
          }}
        >
          {seat ? (
            <SeatUnit
              seat={seat}
              available={seat.available!}
              isSelected={selectedSeats.some((s) => s._id === seat._id)}
              onSelect={() => handleSeatClick(seat)}
            />
          ) : (
            <Box
              sx={{
                width: "40px",
                height: "24px",
              }}
            />
          )}
        </Box>
      );
    }
  }

  const handleSeatClick = (seat: SeatType) => {
    setSelectedSeats((prevSelectedSeats: SeatType[]) => {
      if (prevSelectedSeats.some((s) => s._id === seat._id)) {
        return prevSelectedSeats.filter((s) => s._id !== seat._id);
      } else if (prevSelectedSeats.length < ticketCount) {
        if (prevSelectedSeats.length === 0) {
          startTimer(reservationTime);
        }
        return [...prevSelectedSeats, seat];
      }
      return prevSelectedSeats;
    });
  };

  return (
    <Box
      sx={{
        width: 1,
        display: "flex",
        flexDirection: "column",
        justifyItems: "center",
        alignItems: "center",
        paddingTop: 8,
        zIndex: 10,
        borderTop: "2px solid #222",
      }}
    >
      <Box
        sx={{
          width: 0.8,
          height: "100px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            width: "320px",
            height: "140px",
            border: `2px solid ${theme.palette.primary.main}`,
            borderRadius: 2,
            display: "flex",
            position: "relative",
            flexDirection: "column",
            alignItems: "flex-start",
            paddingX: 2,
            paddingY: 1,
            justifyItems: "flex-start",
            // backgroundColor: 'blue'
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "white", fontWeight: "medium" }}
          >
            Ticket
          </Typography>
          <Typography variant="h6" sx={{ color: "gray", fontWeight: "normal" }}>
            {price}
          </Typography>
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: 12,
            }}
          >
            <NumberPicker
              value={ticketCount}
              onChange={(value) => {
                if (value < selectedSeats.length) {
                  setSelectedSeats((prevSelectedSeats: SeatType[]) =>
                    prevSelectedSeats.slice(0, value)
                  );
                }
                setTicketCount(value);
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            width: "240px",
            height: "140px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "lightgray", fontWeight: "bold", mt: -2, ml: -2 }}
          >
            Note:
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Box
              sx={{
                width: 38,
                height: 23,
                backgroundColor: "white",
                border: "1px solid black",
                borderRadius: 1,
                marginRight: 1,
              }}
            />
            <Typography variant="body1" sx={{ color: "gray" }}>
              Available Seat
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Box
              sx={{
                width: 38,
                height: 23,
                backgroundColor: "gray",
                border: "1px solid black",
                borderRadius: 1,
                marginRight: 1,
              }}
            />
            <Typography variant="body1" sx={{ color: "gray" }}>
              Resersed Seat
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Box
              sx={{
                width: 38,
                height: 23,
                backgroundColor: theme.palette.secondary.main,
                border: "1px solid black",
                borderRadius: 1,
                marginRight: 1,
              }}
            />
            <Typography variant="body1" sx={{ color: "gray" }}>
              Selected Seat
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          mb: 10,
          mt: 10,
          pt: 6,
          pb: 16,
          border: "2px solid gray",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "white",
            fontWeight: "bold",
            letterSpacing: "0.1em",
            mb: 1,
          }}
        >
          SCREEN
        </Typography>
        <div className="h-3 w-[600px] bg-white rounded-full self-center items-center mb-2" />
        <Box
          sx={{
            height: 360,
            display: "grid",
            gridTemplateColumns: `repeat(17, 42px)`,
            gridTemplateRows: `repeat(14, 30px)`,
            justifyContent: "center",
            gap: 1,
            marginY: 6,
          }}
        >
          {grid}
        </Box>
      </Box>
    </Box>
  );
};

export default SeatSelecting;
