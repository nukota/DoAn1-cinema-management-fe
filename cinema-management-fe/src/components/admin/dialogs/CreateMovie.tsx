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
  overflowX: "hidden",
});

const statusOptions: string[] = [
  "Coming Soon",
  "Now Playing",
  "Stopped",
  "Unknown",
];

interface CreateMovieProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newMovie: any) => void;
}

const CreateMovie: React.FC<CreateMovieProps> = ({ open, onClose, onAdd }) => {
  const [title, setTitle] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [posterURL, setPosterURL] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [ageLimit, setAgeLimit] = useState<number>(0);
  const [releaseDate, setReleaseDate] = useState<string>("");
  const [director, setDirector] = useState<string>("");
  const [actors, setActors] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [trailerURL, setTrailerURL] = useState<string>("");

  const handleSubmit = () => {
    if (!title || !posterURL || !status || !genre || !duration || !country) {
      console.error("All fields are required");
      return;
    }
    const movieData = {
      title,
      status,
      posterURL,
      genre,
      duration,
      country,
      ageLimit,
      releaseDate,
      director: director.split(",").map((name) => name.trim()),
      actors: actors.split(",").map((name) => name.trim()),
      description,
      rating,
      trailerURL,
    };
    onAdd(movieData);
    onClose();
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
        Add Movie
      </DialogTitle>
      <CustomDialogContent>
        <Box display={"flex"} flexDirection={"row"} gap={2}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
                Title:
              </Typography>
              <TextField
                placeholder="Title"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
                Poster:
              </Typography>
              <TextField
                placeholder="Poster URL"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={posterURL}
                onChange={(e) => setPosterURL(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
                Status:
              </Typography>
              <Autocomplete
                options={statusOptions}
                value={status}
                sx={{ width: 280 }}
                onChange={(event, newValue) => setStatus(newValue!)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Type"
                    margin="dense"
                    size="small"
                  />
                )}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
                Genre:
              </Typography>
              <TextField
                placeholder="Genre"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
                Duration:
              </Typography>
              <TextField
                placeholder="Duration"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
                Nation:
              </Typography>
              <TextField
                placeholder="Nation"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
                Age Limit:
              </Typography>
              <TextField
                placeholder="Age Limit"
                type="number"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={ageLimit}
                onChange={(e) => setAgeLimit(Number(e.target.value))}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
                Release Date:
              </Typography>
              <TextField
                type="date"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 70 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
                Director:
              </Typography>
              <Box
                sx={{ width: 280 }}
                display={"flex"}
                flexDirection={"column"}
                gap={1}
              >
                <TextField
                  placeholder="Director"
                  margin="dense"
                  size="small"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                />
                <Typography
                  color="#999999"
                  fontSize={12}
                  fontStyle={"italic"}
                  sx={{ mt: -1, mb: 1 }}
                >
                  Fill in each name seperated by a comma (,)
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 70 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
                Cast:
              </Typography>
              <Box
                sx={{ width: 280 }}
                display={"flex"}
                flexDirection={"column"}
                gap={1}
              >
                <TextField
                  placeholder="Cast"
                  sx={{ width: 280 }}
                  margin="dense"
                  size="small"
                  value={actors}
                  onChange={(e) => setActors(e.target.value)}
                />
                <Typography
                  color="#999999"
                  fontSize={12}
                  fontStyle={"italic"}
                  sx={{ mt: -1, mb: 1 }}
                >
                  Fill in each name seperated by a comma (,)
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
                Rating:
              </Typography>
              <TextField
                placeholder="Rating"
                type="number"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
                Trailer:
              </Typography>
              <TextField
                placeholder="Trailer URL"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={trailerURL}
                onChange={(e) => setTrailerURL(e.target.value)}
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              src={posterURL}
              alt="Movie Poster"
              style={{
                width: 160,
                height: 200,
                objectFit: "cover",
                borderRadius: 8,
              }}
              className="bg-[#eee] mt-4"
            />
            <Typography>Poster</Typography>
          </Box>
        </Box>
      </CustomDialogContent>
      <DialogActions sx={{ mb: 1.5, mr: 2 }}>
        <Button
          onClick={handleSubmit}
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

export default CreateMovie;
