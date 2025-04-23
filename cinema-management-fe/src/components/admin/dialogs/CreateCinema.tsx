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
  const [formValues, setFormValues] = useState({ name: "", address: "" });

  const handleSubmit = () => {
    if (!formValues.name || !formValues.address) {
      console.error("Name and address are required");
      return;
    }
    const cinemaData = {
      name: formValues.name,
      address: formValues.address,
    };
    onAdd(cinemaData as CinemaType); // Pass the cleaned object to the parent
    onClose(); // Close the dialog after submission
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
            value={formValues.name}
            onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
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
            value={formValues.address}
            onChange={(e) => setFormValues({ ...formValues, address: e.target.value })}
          />
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

export default CreateCinema;
