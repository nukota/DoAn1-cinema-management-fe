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
});

interface CreateCinemaProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newCinema: any) => void;
}

const CreateCinema: React.FC<CreateCinemaProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const handleAddClick = () => {};
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        maxHeight: "90vh",
        overflow: "hidden",
        width: { xs: "100%", sm: "80%", md: "60%" },
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
        Add Cinema
      </DialogTitle>
      <CustomDialogContent>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Full Name:
          </Typography>
          <TextField
            placeholder="Full Name"
            fullWidth
            margin="dense"
            size="small"
            value={name}
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
            onChange={(e) => setAddress(e.target.value)}
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

export default CreateCinema;
