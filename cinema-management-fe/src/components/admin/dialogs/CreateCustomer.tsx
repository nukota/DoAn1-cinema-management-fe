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
});

interface CreateCustomerProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newCustomer: any) => void;
}

const CreateCustomer: React.FC<CreateCustomerProps> = ({ open, onClose, onAdd }) => {
  const [userId, setUserId] = useState<Number>();
  const [fullname, setFullname] = useState<String>("");
  const [email, setEmail] = useState<String>("");
  const [phone, setPhone] = useState<String>("");
  const [dob, setDob] = useState<String>("");
  const [cccd, setCccd] = useState<String>("");
  const [role, setRole] = useState<String>("Customer");

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
        Add Customer
      </DialogTitle>
      <CustomDialogContent>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>ID:</Typography>
          <TextField
            placeholder="Auto generated"
            fullWidth
            value={userId}
            disabled
            margin="dense"
            size="small"
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Full Name:
          </Typography>
          <TextField
            placeholder="Full Name"
            fullWidth
            margin="dense"
            size="small"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            CCCD:
          </Typography>
          <TextField
            placeholder="CCCD"
            fullWidth
            margin="dense"
            size="small"
            value={cccd}
            onChange={(e) => setCccd(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Date of birth:
          </Typography>
          <TextField
            type="date"
            fullWidth
            margin="dense"
            size="small"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Phone Number:
          </Typography>
          <TextField
            placeholder="Phone Number"
            fullWidth
            margin="dense"
            size="small"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Email:
          </Typography>
          <TextField
            placeholder="Email"
            fullWidth
            margin="dense"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

export default CreateCustomer;
