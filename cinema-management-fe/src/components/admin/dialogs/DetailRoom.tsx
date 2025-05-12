import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { RoomType } from "../../../interfaces/types";
import { exampleSeats } from "../../../data";
import Seat from "../items/Seat";

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

interface DetailRoomsProps {
  room: RoomType;
  open: boolean;
  onSave: (updatedRoom: RoomType) => void;
  onDelete: () => void;
  onClose: () => void;
}

const getSeatRow = (seatName: string): number | null => {
  const match = seatName.match(/^[A-Z]/);
  return match ? match[0].charCodeAt(0) - 64 : null;
};

const DetailRoom: React.FC<DetailRoomsProps> = ({ room, open, onSave, onDelete, onClose }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [seatCount, setSeatCount] = useState<number>(0);
  const [cinemaName, setCinemaName] = useState<string>("");

  useEffect(() => {
    if (room) {
      setName(room.name);
      setSeatCount(room.seat_count);
      setCinemaName(room.cinema.name);
    }
    if (!open) {
      setIsEditing(false);
    }
  }, [room, open]);

  const handleModifyClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const updatedRoom: RoomType = {
      ...room,
      name,
      seat_count: seatCount,
    };
    onSave(updatedRoom); // Call onSave to update the room
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const renderSeatGrid = (roomId: string) => {
    const seats = exampleSeats.filter((seat) => seat.room_id === roomId);

    const grid = [];
    for (let row = 1; row <= 14; row++) {
      for (let col = -8; col <= 8; col++) {
        const seat = seats.find(
          (s) => getSeatRow(s.seat_name) === row && s.seat_column === col
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
            <Seat seat={seat || null} />
          </Box>
        );
      }
    }
    return grid;
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
        Detail Room
      </DialogTitle>
      <CustomDialogContent sx={{ overflow: "auto" }}>
        <Typography
          variant="h6"
          gutterBottom
          color="primary"
          fontWeight={550}
          sx={{ mt: 1 }}
        >
          Seat Map
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
            {renderSeatGrid(room._id)}
          </Grid2>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45, mt: 4 }}>
          <Typography sx={{ ml: 2, marginTop: 1, width: 100 }}>
            Cinema:
          </Typography>
          <TextField
            sx={{ width: 240 }}
            margin="dense"
            size="small"
            value={cinemaName}
            disabled
          />
          <Typography sx={{ ml: 4, marginTop: 1, width: 100 }}>
            Room ID:
          </Typography>
          <TextField
            sx={{ width: 240 }}
            margin="dense"
            size="small"
            value={room._id}
            disabled
          />
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
            disabled={!isEditing}
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
            value={seatCount}
            disabled={!isEditing}
            onChange={(e) => setSeatCount(Number(e.target.value))}
          />
        </Box>
      </CustomDialogContent>
      <DialogActions sx={{ mb: 1.5, mr: 2 }}>
        {isEditing ? (
          <Box display="flex" gap={2}>
            <Button
              onClick={handleCancelClick}
              color="primary"
              variant="outlined"
              sx={{ width: 130 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveClick}
              color="primary"
              variant="contained"
              sx={{ width: 130 }}
            >
              Save
            </Button>
          </Box>
        ) : (
          <Box display="flex" gap={2}>
            <Button
              onClick={onDelete}
              color="primary"
              variant="outlined"
              sx={{ width: 130 }}
            >
              Delete
            </Button>
            <Button
              onClick={onClose}
              color="primary"
              variant="outlined"
              sx={{ width: 130 }}
            >
              Close
            </Button>
            <Button
              onClick={handleModifyClick}
              color="primary"
              variant="contained"
              sx={{ width: 130 }}
            >
              Modify
            </Button>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DetailRoom;
