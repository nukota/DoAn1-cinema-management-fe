import { useState, useEffect } from "react";
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
import { toast } from "react-toastify";
import { useMovies } from "../../../providers/MoviesProvider";

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

interface CreateDiscountProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newDiscount: any) => Promise<boolean>;
}
const types: String[] = ["percentage", "fixed"];

const CreateDiscount: React.FC<CreateDiscountProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const { movies, fetchMoviesData } = useMovies();
  const [code, setCode] = useState<String>("");
  const [type, setType] = useState<String>("");
  const [expiryDate, setExpiryDate] = useState<String>("");
  const [value, setValue] = useState<String>("");
  const [minPurchase, setMinPurchase] = useState<String>("");
  const [maxUsage, setMaxUsage] = useState<String>("");
  const [remaining, setRemaining] = useState<String>("");
  const [movieId, setMovieId] = useState<string | null>(null);
  const [credit, setCredit] = useState<string>("");

  // Fetch movies on mount
  useEffect(() => {
    fetchMoviesData();
  }, [fetchMoviesData]);

  const handleAddClick = () => {
    if (
      !code ||
      !type ||
      !expiryDate ||
      !value ||
      !minPurchase ||
      !maxUsage ||
      !remaining
    ) {
      toast.error("All fields are required");
      return;
    }
    if (
      isNaN(Number(value)) ||
      isNaN(Number(minPurchase)) ||
      isNaN(Number(maxUsage)) ||
      isNaN(Number(remaining)) ||
      (credit && isNaN(Number(credit)))
    ) {
      toast.error("Value, Min Purchase, Max Usage, and Remaining must be numbers");
      return;
    }
    const newDiscount = {
      code,
      discount_type: type,
      min_purchase: minPurchase,
      max_usage: maxUsage,
      value,
      remaining,
      expiry_date: expiryDate,
      movie_id: movieId || undefined,
      credit: credit ? Number(credit) : undefined,
    };
    onAdd(newDiscount);
    setCode("");
    setType("");
    setValue("");
    setMinPurchase("");
    setMaxUsage("");
    setExpiryDate("");
    setMovieId(null);
    setCredit("");
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
        Create Discount
      </DialogTitle>
      <CustomDialogContent>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 164 }}>
            CODE:
          </Typography>
          <TextField
            fullWidth
            placeholder="Code"
            margin="dense"
            size="small"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 164 }}>
            Type:
          </Typography>
          <Autocomplete
            options={types}
            value={type}
            fullWidth
            onChange={(_, newValue) => setType(newValue!)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="type"
                margin="dense"
                size="small"
              />
            )}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 164 }}>
            Remaining:
          </Typography>
          <TextField
            type="number"
            placeholder="Remaining"
            fullWidth
            margin="dense"
            size="small"
            value={remaining}
            onChange={(e) => setRemaining(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 164 }}>
            Min purchase:
          </Typography>
          <TextField
            type="number"
            placeholder="Min Purchase"
            fullWidth
            margin="dense"
            size="small"
            value={minPurchase}
            onChange={(e) => setMinPurchase(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 164 }}>
            Max usage:
          </Typography>
          <TextField
            type="number"
            placeholder="Max Usage" 
            fullWidth
            margin="dense"
            size="small"
            value={maxUsage}
            onChange={(e) => setMaxUsage(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 164 }}>
            Value:
          </Typography>
          <TextField
            type="number"
            placeholder="Value"
            fullWidth
            margin="dense"
            size="small"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 164 }}>
            Expiry Date:
          </Typography>
          <TextField
            type="date"
            placeholder="Expiry Date" 
            fullWidth
            margin="dense"
            size="small"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 164 }}>
            Movie:
          </Typography>
          <TextField
            select
            fullWidth
            SelectProps={{ native: true }}
            disabled={false}
            value={movieId || ""}
            onChange={(e) => setMovieId(e.target.value || null)}
            margin="dense"
            size="small"
          >
            <option value="">All</option>
            {movies.map((movie) => (
              <option key={movie._id} value={movie._id}>
                {movie.title}
              </option>
            ))}
          </TextField>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 164 }}>
            Credit:
          </Typography>
          <TextField
            type="number"
            fullWidth
            margin="dense"
            size="small"
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
          />
        </Box>
      </CustomDialogContent>
      <DialogActions sx={{ mb: 1.5, mr: 2 }}>
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

export default CreateDiscount;
