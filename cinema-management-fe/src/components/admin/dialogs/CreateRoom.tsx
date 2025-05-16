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
import { RoomType } from "../../../interfaces/types";
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
  onAdd: (newRoom: RoomType) => void;
  onClose: () => void;
}

const getSeatRow = (seatName: string): number | null => {
  const match = seatName.match(/^[A-Z]/);
  return match ? match[0].charCodeAt(0) - 64 : null;
};

const CreateRoom: React.FC<CreateRoomsProps> = ({ open, onAdd, onClose }) => {
  const [name, setName] = useState<string>("");
  const [seatCount, setSeatCount] = useState<number>(0);
  const [cinemaId, setCinemaId] = useState<string>("");
  const { cinemas, fetchCinemasData } = useCinemas();

  useEffect(() => {
    fetchCinemasData();
  }, []);

  const handleAddClick = () => {
    const newRoomData = {
      name,
      seat_count: seatCount,
      cinema_id: cinemaId,
    };
    onAdd(newRoomData as any);
    setName("");
    setSeatCount(0);
    setCinemaId("");
  };

  const renderSeatGrid = () => {
    const grid = [];
    for (let row = 1; row <= 14; row++) {
      for (let col = -8; col <= 8; col++) {
        // No seats yet, just render empty boxes
        grid.push(
          <Box
            key={`${row}-${col}`}
            sx={{
              width: "40px",
              height: "24px",
              display: "inline-block",
              textAlign: "center",
              borderRadius: "6px",
              background: "#f5f5f5",
            }}
          >
            {/* Optionally show seat name */}
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
            value={seatCount}
            onChange={(e) => setSeatCount(Number(e.target.value))}
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
            disabled={!name || !cinemaId || seatCount <= 0}
          >
            Add
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRoom;
