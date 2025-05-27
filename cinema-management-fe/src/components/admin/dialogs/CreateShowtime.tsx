import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { MovieType, ShowtimeType } from "../../../interfaces/types";
import { toast } from "react-toastify";

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
  roomId: string;
  movies: MovieType[];
  onClose: () => void;
  onAdd: (newShowtime: any) => Promise<boolean>;
}

const CreateShowtime: React.FC<CreateShowtimeProps> = ({
  open,
  onClose,
  onAdd,
  roomId,
  movies,
}) => {
  const [movieId, setMovieId] = useState<string | null>(null);
  const [showtime, setShowtime] = useState<string>("");
  const [price, setPrice] = useState<number | null>(null);

  const handleAddClick = async () => {
    if (!movieId || !showtime || !price) {
      toast.error("Please fill in all fields");
      return;
    }
    const newShowtime = {
      room_id: roomId,
      movie_id: movieId,
      showtime,
      price: Number(price),
    };
    onAdd(newShowtime);
  };

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
            fullWidth
            margin="dense"
            size="small"
            value={roomId || ""}
            disabled
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Movie:
          </Typography>
          <FormControl fullWidth margin="dense" size="small">
            <InputLabel id="movie-select-label">Movie</InputLabel>
            <Select
              labelId="movie-select-label"
              value={movieId}
              label="Movie"
              onChange={(e) => setMovieId(e.target.value)}
            >
              {movies.map((movie) => (
                <MenuItem key={movie._id} value={movie._id}>
                  {movie.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            onChange={(e) => {
              const selectedDateTime = e.target.value;
              setShowtime(selectedDateTime); // Update the state with the selected value
            }}
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
