import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ShowtimeType } from "../../../interfaces/types";

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

interface CreateShowtimeProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newShowtime: ShowtimeType) => void;
}

const CreateShowtime: React.FC<CreateShowtimeProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [roomId, setRoomId] = useState<number | null>(null);
  const [movieId, setMovieId] = useState<number | null>(null);
  const [showtime, setShowtime] = useState<string>("");
  const [price, setPrice] = useState<number | null>(null);

  const handleAddClick = () => {};

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        Create Showtime
      </DialogTitle>
      <CustomDialogContent>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Room ID:
          </Typography>
          <TextField
            type="number"
            fullWidth
            margin="dense"
            size="small"
            value={roomId || ""}
            onChange={(e) => setRoomId(Number(e.target.value))}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Movie ID:
          </Typography>
          <TextField
            type="number"
            fullWidth
            margin="dense"
            size="small"
            value={movieId || ""}
            onChange={(e) => setMovieId(Number(e.target.value))}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Showtime:
          </Typography>
          <TextField
            type="datetime-local"
            fullWidth
            margin="dense"
            size="small"
            value={showtime}
            onChange={(e) => setShowtime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Price:
          </Typography>
          <TextField
            type="number"
            fullWidth
            margin="dense"
            size="small"
            value={price || ""}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </Box>
      </CustomDialogContent>
      <DialogActions sx={{ mb: 1.5, mr: 2 }}>
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          sx={{ width: 130 }}
        >
          Close
        </Button>
        <Button
          onClick={handleAddClick}
          color="primary"
          variant="contained"
          sx={{ width: 130 }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateShowtime;