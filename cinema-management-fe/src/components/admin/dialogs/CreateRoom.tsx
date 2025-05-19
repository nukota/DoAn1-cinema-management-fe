import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { RoomWithSeatsType } from "../../../interfaces/types";
import { useCinemas } from "../../../providers/CinemasProvider";

const CustomDialogContent = styled(DialogContent)({
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#999",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#666",
  },
});

interface CreateRoomsProps {
  open: boolean;
  onAdd: (newRoom: RoomWithSeatsType) => void;
  onClose: () => void;
}
const ROWS = 14;
const COLS = 17;
const getSeatName = (
  row: number,
  col: number,
  selectedSeats: { seat_column: number; seat_name: string }[]
) => {
  const rowLetter = String.fromCharCode(65 + row - 1); // A, B, C...
  const rowSeats = selectedSeats
    .filter((seat) => seat.seat_name.startsWith(rowLetter))
    .sort((a, b) => a.seat_column - b.seat_column);
  const index = rowSeats.findIndex((seat) => seat.seat_column === col);
  if (index === -1) return `${rowLetter}`;
  const seatNumber = (index + 1).toString().padStart(2, "0");
  return `${rowLetter}${seatNumber}`;
};

const CreateRoom: React.FC<CreateRoomsProps> = ({ open, onAdd, onClose }) => {
  const [name, setName] = useState<string>("");
  const [selectedSeats, setSelectedSeats] = useState<
    { seat_name: string; seat_column: number }[]
  >([]);
  const [cinemaId, setCinemaId] = useState<string>("");
  const { cinemas, fetchCinemasData } = useCinemas();

  useEffect(() => {
    fetchCinemasData();
  }, []);

  const handleSeatClick = (row: number, col: number) => {
    // Always recalculate seat names for the row after selection change
    const rowLetter = String.fromCharCode(65 + row - 1);
    const seat_column = col;
    const isAlreadySelected = selectedSeats.some(
      (seat) =>
        seat.seat_column === seat_column && seat.seat_name.startsWith(rowLetter)
    );

    let updatedSeats;
    if (isAlreadySelected) {
      updatedSeats = selectedSeats.filter(
        (seat) =>
          !(
            seat.seat_column === seat_column &&
            seat.seat_name.startsWith(rowLetter)
          )
      );
    } else {
      updatedSeats = [...selectedSeats, { seat_name: "", seat_column }];
    }

    const rowSeats = updatedSeats
      .filter(
        (seat) => seat.seat_name.startsWith(rowLetter) || seat.seat_name === ""
      )
      .filter((seat) => {
        if (isAlreadySelected) return seat.seat_name.startsWith(rowLetter);
        return (
          seat.seat_name.startsWith(rowLetter) ||
          (seat.seat_name === "" && seat.seat_column === seat_column)
        );
      })
      .sort((a, b) => a.seat_column - b.seat_column);

    rowSeats.forEach((seat, idx) => {
      seat.seat_name = `${rowLetter}${(idx + 1).toString().padStart(2, "0")}`;
    });

    const newSelectedSeats = updatedSeats
      .filter((seat) => !seat.seat_name.startsWith(rowLetter))
      .concat(rowSeats);

    setSelectedSeats(newSelectedSeats);
  };

  const renderSeatGrid = () => {
    const grid = [];
    for (let row = 1; row <= ROWS; row++) {
      for (let col = -8; col <= 8; col++) {
        const seat_name = getSeatName(row, col, selectedSeats);
        const seat_column = col;
        const isSelected = selectedSeats.some(
          (seat) =>
            seat.seat_name === seat_name && seat.seat_column === seat_column
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
              background: isSelected ? "#1976d2" : "#f5f5f5",
              color: isSelected ? "#fff" : "#000",
              cursor: "pointer",
              // border: isSelected ? "2px solid #1976d2" : "1px solid #ccc",
              fontWeight: 500,
              userSelect: "none",
            }}
            onClick={() => handleSeatClick(row, col)}
          >
            {isSelected ? seat_name : ""}
          </Box>
        );
      }
    }
    return grid;
  };

  const handleAddClick = () => {
    const newRoomData: RoomWithSeatsType = {
      name,
      cinema_id: cinemaId,
      seats: selectedSeats,
      _id: "",
    };
    onAdd(newRoomData);
    setName("");
    setCinemaId("");
    setSelectedSeats([]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      sx={{
        maxHeight: "90vh",
        overflow: "auto",
        placeSelf: "center",
      }}
    >
      <DialogTitle
        sx={{
          fontSize: 24,
          fontWeight: "bold",
          fontFamily: "inherit",
          padding: "16px 24px",
        }}
      >
        Create Room
      </DialogTitle>
      <CustomDialogContent sx={{ overflow: "auto" }}>
        <Typography
          variant="h6"
          gutterBottom
          color="primary"
          fontWeight={550}
          sx={{ mt: 1 }}
        >
          Seat Map Preview
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mb: 2,
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", alignSelf: "center" }}
          >
            SCREEN
          </Typography>
          <Box
            sx={{
              maxWidth: "400px",
              width: "80%",
              height: "6px",
              alignSelf: "center",
              backgroundColor: "#000",
              borderRadius: "3px",
              mb: "16px",
            }}
          />
        </Box>
        <Box sx={{ mt: 2, overflow: "visible" }}>
          <Grid2
            container
            spacing={0.25}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(17, 40px)",
              gridTemplateRows: "repeat(14, 24px)",
              justifyContent: "center",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {renderSeatGrid()}
          </Grid2>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45, mt: 4 }}>
          <Typography sx={{ ml: 2, marginTop: 1, width: 100 }}>
            Cinema:
          </Typography>
          <FormControl sx={{ width: 240 }} size="small">
            <InputLabel id="cinema-select-label">Cinema</InputLabel>
            <Select
              labelId="cinema-select-label"
              value={cinemaId}
              label="Cinema"
              onChange={(e) => setCinemaId(e.target.value)}
            >
              {cinemas.map((cinema) => (
                <MenuItem key={cinema._id} value={cinema._id}>
                  {cinema.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ ml: 2, marginTop: 1, width: 100 }}>
            Name:
          </Typography>
          <TextField
            placeholder="Name"
            sx={{ width: 240 }}
            margin="dense"
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Typography sx={{ ml: 4, marginTop: 1, width: 100 }}>
            Seat count:
          </Typography>
          <TextField
            placeholder="Seat count"
            type="number"
            sx={{ width: 240 }}
            margin="dense"
            size="small"
            value={selectedSeats.length}
            disabled
          />
        </Box>
      </CustomDialogContent>
      <DialogActions sx={{ mb: 1.5, mr: 2 }}>
        <Box display="flex" gap={2}>
          <Button
            onClick={onClose}
            color="primary"
            variant="outlined"
            sx={{ width: 130 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddClick}
            color="primary"
            variant="contained"
            sx={{ width: 130 }}
            disabled={!name || !cinemaId}
          >
            Add
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRoom;
