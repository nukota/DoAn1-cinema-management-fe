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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CinemaType } from "../../../interfaces/types";
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

interface DetailCinemaProps {
  cinema: CinemaType;
  open: boolean;
  onClose: () => void;
  onSave: (newCinema: CinemaType) => void;
  onDelete: () => void;
}

const DetailCinema: React.FC<DetailCinemaProps> = ({
  cinema,
  open,
  onClose,
  onSave,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (cinema) {
      setName(cinema.name);
      setAddress(cinema.address);
    }
    if (!open) {
      setIsEditing(false);
    }
  }, [cinema, open]);

  const handleModifyClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onSave({
      ...cinema,
      name,
      address,
    });
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
        Detail Cinema
      </DialogTitle>
      <CustomDialogContent>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>ID:</Typography>
          <TextField
            placeholder="Auto generated"
            fullWidth
            value={cinema._id}
            disabled
            margin="dense"
            size="small"
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Name:
          </Typography>
          <TextField
            placeholder="Name"
            fullWidth
            margin="dense"
            size="small"
            value={name}
            disabled={!isEditing}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Address:
          </Typography>
          <TextField
            placeholder="Address"
            fullWidth
            margin="dense"
            size="small"
            value={address}
            disabled={!isEditing}
            onChange={(e) => setAddress(e.target.value)}
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
          Cancel
        </Button>
        {isEditing ? (
          <Button
            onClick={handleSaveClick}
            color="primary"
            variant="contained"
            sx={{ width: 130 }}
          >
            Save
          </Button>
        ) : (
          <>
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
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DetailCinema;
