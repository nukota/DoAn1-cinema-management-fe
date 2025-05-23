import { useEffect, useState } from "react";
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
import { MovieType } from "../../../interfaces/types";
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
  overflowX: "hidden",
});

const statusOptions: string[] = [
  "Coming Soon",
  "Now Playing",
  "Stopped",
  "Unknown",
];

interface DetailMovieProps {
  movie: MovieType;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  onSave: (newMovie: any) => Promise<boolean>;
}

const DetailMovie: React.FC<DetailMovieProps> = ({
  movie,
  open,
  onClose,
  onDelete,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [posterURL, setPosterURL] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);
  const [country, setCountry] = useState<string>("");
  const [ageLimit, setAgeLimit] = useState<number>(0);
  const [releaseDate, setReleaseDate] = useState<string>("");
  const [director, setDirector] = useState<string>("");
  const [actors, setActors] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [trailerURL, setTrailerURL] = useState<string>("");

  useEffect(() => {
    console.log("Movie: ", movie);
    if (movie) {
      setTitle(movie.title);
      setStatus(movie.status);
      setPosterURL(movie.poster_url);
      setGenre(movie.genre.join(", "));
      setDuration(movie.duration);
      setCountry(movie.country);
      setAgeLimit(movie.age_limit);
      setReleaseDate(new Date(movie.release_date).toISOString().slice(0, 10));
      setDirector(movie.director);
      setActors(movie.actors.join(", "));
      setDescription(movie.description);
      setRating(movie.rating);
      setTrailerURL(movie.trailer_url);
    }
    if (!open) {
      setIsEditing(false);
    }
  }, [movie, open]);

  const handleModifyClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (
      !title ||
      !status ||
      !posterURL ||
      !genre ||
      !duration ||
      !country ||
      !ageLimit ||
      !releaseDate ||
      !director ||
      !actors ||
      !description ||
      rating === 0 ||
      !trailerURL
    ) {
      toast.error("All fields are required");
      return;
    }
    onSave({
      ...movie,
      title,
      status,
      poster_url: posterURL,
      genre,
      duration,
      nation: country,
      age_limit: ageLimit,
      release_date: releaseDate,
      director,
      actors: actors.split(",").map((actor) => actor.trim()),
      description,
      rating,
      trailer_url: trailerURL,
    });
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
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
        Detail Movie
      </DialogTitle>
      <CustomDialogContent>
        <Box display={"flex"} flexDirection={"row"} gap={4}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
                Movie ID:
              </Typography>
              <TextField
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={movie._id}
                disabled
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
                Title:
              </Typography>
              <TextField
                placeholder="Title"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={title}
                disabled={!isEditing}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
                Poster:
              </Typography>
              <TextField
                placeholder="Poster URL"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                disabled={!isEditing}
                value={posterURL}
                onChange={(e) => setPosterURL(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
                Status:
              </Typography>
              <Autocomplete
                options={statusOptions}
                value={status}
                disabled={!isEditing}
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
              <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
                Genre:
              </Typography>
              <TextField
                placeholder="Genre"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={genre}
                disabled={!isEditing}
                onChange={(e) => setGenre(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
                Duration:
              </Typography>
              <TextField
                placeholder="Duration"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={duration}
                disabled={!isEditing}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
                Nation:
              </Typography>
              <TextField
                placeholder="Nation"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={country}
                disabled={!isEditing}
                onChange={(e) => setCountry(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
                Age Limit:
              </Typography>
              <TextField
                placeholder="Age Limit"
                type="number"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={ageLimit}
                disabled={!isEditing}
                onChange={(e) => setAgeLimit(Number(e.target.value))}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
                Release Date:
              </Typography>
              <TextField
                type="date"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={releaseDate}
                disabled={!isEditing}
                onChange={(e) => setReleaseDate(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 70 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
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
                  disabled={!isEditing}
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
              <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
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
                  disabled={!isEditing}
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
              <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
                Description:
              </Typography>
              <TextField
                placeholder="Description"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={description}
                disabled={!isEditing}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
                Rating:
              </Typography>
              <TextField
                placeholder="Rating"
                type="number"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={rating}
                disabled={!isEditing}
                onChange={(e) => setRating(Number(e.target.value))}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
                Trailer:
              </Typography>
              <TextField
                placeholder="Trailer URL"
                sx={{ width: 280 }}
                margin="dense"
                size="small"
                value={trailerURL}
                disabled={!isEditing}
                onChange={(e) => setTrailerURL(e.target.value)}
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              src={posterURL}
              alt="Movie Poster"
              style={{
                width: 140,
                height: 160,
                objectFit: "cover",
                borderRadius: 8,
              }}
              className="bg-[#eee] mt-4"
            />
            <Typography fontWeight={500} color="#999">
              Poster
            </Typography>
          </Box>
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
              onClick={onClose}
              color="primary"
              variant="outlined"
              sx={{ width: 130 }}
            >
              Close
            </Button>
            <Button
              onClick={onDelete}
              color="primary"
              variant="outlined"
              sx={{ width: 130 }}
            >
              Delete
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

export default DetailMovie;
