import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { ShowtimeType, MovieType } from "../../../interfaces/types";
import { toast } from "react-toastify";

interface DetailShowtimeProps {
  open: boolean;
  onClose: () => void;
  onSave: (updatedShowtime: ShowtimeType) => Promise<boolean>;
  showtime: ShowtimeType;
  movies: MovieType[];
}

const DetailShowtime: React.FC<DetailShowtimeProps> = ({
  open,
  onClose,
  onSave,
  showtime,
  movies,
}) => {
  const [movieId, setMovieId] = useState<string>(showtime.movie.movie_id);
  const [showtimeDate, setShowtimeDate] = useState<string>(
    new Date(showtime.showtime).toISOString().slice(0, 16)
  );
  const [price, setPrice] = useState<number>(showtime.price);

  useEffect(() => {
    if (showtime) {
      setMovieId(showtime.movie.movie_id);
      setShowtimeDate(new Date(showtime.showtime).toISOString().slice(0, 16));
      setPrice(showtime.price);
    }
  }, [showtime]);

  const handleSaveClick = () => {
    if (!movieId || !showtimeDate || price <= 0) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const updatedShowtime: ShowtimeType = {
      ...showtime,
      movie: { ...showtime.movie, movie_id: movieId },
      showtime: new Date(showtimeDate).toISOString(),
      price,
    };

    onSave(updatedShowtime);
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
        Edit Showtime
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
            Room ID:
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            size="small"
            value={showtime.room.room_id} // Display the room ID
            disabled // Make the field read-only
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
            Movie:
          </Typography>
          <TextField
            select
            fullWidth
            margin="dense"
            size="small"
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            SelectProps={{
              native: true,
            }}
          >
            {movies.map((movie) => (
              <option key={movie._id} value={movie._id}>
                {movie.title}
              </option>
            ))}
          </TextField>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
            Showtime:
          </Typography>
          <TextField
            type="datetime-local"
            fullWidth
            margin="dense"
            size="small"
            value={showtimeDate}
            onChange={(e) => setShowtimeDate(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
            Price:
          </Typography>
          <TextField
            type="number"
            fullWidth
            margin="dense"
            size="small"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ mb: 1.5, mr: 2 }}>
        <Button
          onClick={onClose}
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
      </DialogActions>
    </Dialog>
  );
};

export default DetailShowtime;
