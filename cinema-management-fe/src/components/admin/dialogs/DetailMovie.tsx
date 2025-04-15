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
  onSave: (newMovie: any) => void;
}

const DetailMovie: React.FC<DetailMovieProps> = ({
  movie,
  open,
  onClose,
  onDelete,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [poster, setPoster] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [nation, setNation] = useState<string>("");
  const [ageLimit, setAgeLimit] = useState<number>(0);
  const [releaseDate, setReleaseDate] = useState<string>("");
  const [director, setDirector] = useState<string>("");
  const [cast, setCast] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [trailer, setTrailer] = useState<string>("");

  useEffect(() => {
    if (movie) {
      setName(movie.name);
      setStatus(movie.status);
      setPoster(movie.poster);
      setGenre(movie.genre);
      setDuration(movie.duration);
      setNation(movie.nation);
      setAgeLimit(movie.ageLimit);
      setReleaseDate(movie.releaseDate);
      setDirector(movie.director);
      setCast(movie.cast);
      setDescription(movie.description);
      setRating(movie.rating);
      setTrailer(movie.trailer);
    }
    if (!open) {
      setIsEditing(false);
    }
  }, [movie, open]);

  const handleModifyClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
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
                sx={{ width: 250 }}
                margin="dense"
                size="small"
                value={movie.movie_id}
                disabled
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
                Name:
              </Typography>
              <TextField
                placeholder="Name"
                sx={{ width: 250 }}
                margin="dense"
                size="small"
                value={name}
                disabled={!isEditing}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
                Poster:
              </Typography>
              <TextField
                placeholder="Poster"
                sx={{ width: 250 }}
                margin="dense"
                size="small"
                value={poster}
                onChange={(e) => setPoster(e.target.value)}
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
                sx={{ width: 250 }}
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
                sx={{ width: 250 }}
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
                sx={{ width: 250 }}
                margin="dense"
                size="small"
                value={duration}
                disabled={!isEditing}
                onChange={(e) => setDuration(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
                Nation:
              </Typography>
              <TextField
                placeholder="Nation"
                sx={{ width: 250 }}
                margin="dense"
                size="small"
                value={nation}
                disabled={!isEditing}
                onChange={(e) => setNation(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 120 }}>
                Age Limit:
              </Typography>
              <TextField
                placeholder="Age Limit"
                type="number"
                sx={{ width: 250 }}
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
                sx={{ width: 250 }}
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
                sx={{ width: 250 }}
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
                sx={{ width: 250 }}
                display={"flex"}
                flexDirection={"column"}
                gap={1}
              >
                <TextField
                  placeholder="Cast"
                  sx={{ width: 250 }}
                  margin="dense"
                  size="small"
                  value={cast}
                  onChange={(e) => setCast(e.target.value)}
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
                sx={{ width: 250 }}
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
                sx={{ width: 250 }}
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
                placeholder="Trailer"
                sx={{ width: 250 }}
                margin="dense"
                size="small"
                value={trailer}
                disabled={!isEditing}
                onChange={(e) => setTrailer(e.target.value)}
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              src={poster}
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

export default DetailMovie;
