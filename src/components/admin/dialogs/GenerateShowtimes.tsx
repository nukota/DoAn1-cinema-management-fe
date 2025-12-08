import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { toast } from "react-toastify";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import MovieIcon from "@mui/icons-material/Movie";
import EventIcon from "@mui/icons-material/Event";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

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

interface TopMovie {
  _id: string;
  title: string;
}

interface ShowtimeSuggestion {
  movie_id: string;
  movie_title: string;
  room_id: string;
  room_name: string;
  showtime: string;
}

interface SuggestShowtimesResponse {
  success: boolean;
  data: {
    topMovies: TopMovie[];
    suggestions: ShowtimeSuggestion[];
  };
}

interface GenerateShowtimesProps {
  open: boolean;
  onClose: () => void;
  onGenerated?: () => void;
}

const GenerateShowtimes: React.FC<GenerateShowtimesProps> = ({
  open,
  onClose,
  onGenerated,
}) => {
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ShowtimeSuggestion[]>([]);
  const [topMovies, setTopMovies] = useState<TopMovie[]>([]);
  const [error, setError] = useState<string>("");
  const [hasGenerated, setHasGenerated] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const handleGenerate = async () => {
    if (!date) {
      setError("Please select a date");
      return;
    }

    setError("");
    setLoading(true);
    setHasGenerated(false);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post<SuggestShowtimesResponse>(
        `${baseURL}/recommend/suggest-showtimes`,
        { date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuggestions(response.data.data.suggestions);
        setTopMovies(response.data.data.topMovies);
        setHasGenerated(true);
        toast.success(
          `Generated ${response.data.data.suggestions.length} showtime suggestions!`
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to generate showtimes";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShowtimes = async () => {
    if (suggestions.length === 0) {
      toast.error("No suggestions to create");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      // Create all suggested showtimes
      const createPromises = suggestions.map((suggestion) =>
        axios.post(
          `${baseURL}/showtime`,
          {
            room_id: suggestion.room_id,
            movie_id: suggestion.movie_id,
            showtime: suggestion.showtime,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
      );

      const results = await Promise.allSettled(createPromises);

      const successCount = results.filter(
        (r) => r.status === "fulfilled"
      ).length;
      const failCount = results.filter((r) => r.status === "rejected").length;

      if (successCount > 0) {
        toast.success(
          `Successfully created ${successCount} showtime(s)${
            failCount > 0 ? `, ${failCount} failed` : ""
          }`
        );
      }

      if (failCount === results.length) {
        toast.error("Failed to create showtimes");
      }

      if (onGenerated) {
        onGenerated();
      }

      handleClose();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create showtimes";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDate("");
    setSuggestions([]);
    setTopMovies([]);
    setError("");
    setHasGenerated(false);
    onClose();
  };

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRemoveSuggestion = (index: number) => {
    setSuggestions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: 24,
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <AutoFixHighIcon sx={{ fontSize: 28 }} />
        Generate Showtimes
      </DialogTitle>

      <CustomDialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select a date to generate AI-powered showtime suggestions based on
            popular movies and historical data.
          </Typography>

          <TextField
            label="Select Date"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: new Date().toISOString().split("T")[0],
            }}
            disabled={loading}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
              gap: 2,
            }}
          >
            <CircularProgress size={30} />
            <Typography color="text.secondary">
              {hasGenerated
                ? "Creating showtimes..."
                : "Generating suggestions..."}
            </Typography>
          </Box>
        )}

        {!loading && hasGenerated && topMovies.length > 0 && (
          <Box sx={{ display: "flex", mb: 2 }}>
            <Typography
              variant="body1"
              sx={{
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: 500,
              }}
            >
              <MovieIcon /> Top Movies:{" "}
            </Typography>
            {topMovies.map((movie) => (
              <Typography
                key={movie._id}
                variant="body1"
                color="text.secondary"
              >
                {movie.title}
              </Typography>
            ))}
          </Box>
        )}

        {!loading && suggestions.length > 0 && (
          <Box>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: 500,
              }}
            >
              <EventIcon /> Suggested Showtimes ({suggestions.length})
            </Typography>
            {suggestions.map((suggestion, index) => (
              <React.Fragment key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 1.5,
                    px: 1,
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      flex: 1,
                      minWidth: 0, // Allow flex items to shrink below their minimum content size
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{
                        minWidth: "120px",
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {suggestion.movie_title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        flexShrink: 0,
                      }}
                    >
                      <MeetingRoomIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          minWidth: "60px",
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {suggestion.room_name}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        ml: 1,
                        flexShrink: 0,
                        minWidth: "120px",
                      }}
                    >
                      {formatDateTime(suggestion.showtime)}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => handleRemoveSuggestion(index)}
                    size="small"
                    sx={{ color: "error.main", flexShrink: 0 }}
                  >
                    <DeleteOutline />
                  </IconButton>
                </Box>
                {index < suggestions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Box>
        )}

        {!loading && hasGenerated && suggestions.length === 0 && (
          <Alert severity="info">
            No showtime suggestions available for the selected date.
          </Alert>
        )}
      </CustomDialogContent>

      <DialogActions sx={{ mb: 1.5, mr: 2 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ width: 130 }}>
          Cancel
        </Button>
        {!hasGenerated ? (
          <Button
            onClick={handleGenerate}
            variant="contained"
            color="primary"
            disabled={loading || !date}
            sx={{ width: 130 }}
            disableElevation
          >
            Generate
          </Button>
        ) : (
          <Button
            onClick={handleCreateShowtimes}
            variant="contained"
            color="primary"
            disabled={loading || suggestions.length === 0}
            sx={{ width: 130 }}
            disableElevation
          >
            Create All
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default GenerateShowtimes;
