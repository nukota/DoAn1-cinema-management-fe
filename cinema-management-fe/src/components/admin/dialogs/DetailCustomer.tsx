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
import { UserType } from "../../../interfaces/types";
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

interface DetailCustomerProps {
  customer: UserType;
  open: boolean;
  onClose: () => void;
  onSave: (newCustomer: any) => void;
}

const DetailCustomer: React.FC<DetailCustomerProps> = ({
  customer,
  open,
  onClose,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [fullname, setFullname] = useState<String>("");
  const [email, setEmail] = useState<String>("");
  const [phone, setPhone] = useState<String>("");
  const [dob, setDob] = useState<String>("");
  const [cccd, setCccd] = useState<String>("");
  const [role, setRole] = useState<String>("Customer");

  useEffect(() => {
    if (customer) {
      setFullname(customer.fullname);
      setEmail(customer.email);
      setPhone(customer.phone);
      setDob(customer.dob);
      setCccd(customer.cccd);
    }
    if (!open) {
      setIsEditing(false);
    }
  }, [customer, open]);

  const handleModifyClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
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
        Detail Customer
      </DialogTitle>
      <CustomDialogContent>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>ID:</Typography>
          <TextField
            placeholder="Auto generated"
            fullWidth
            value={customer.user_id}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
            onChange={(e) => setEmail(e.target.value)}
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
          <Button
            onClick={handleModifyClick}
            color="primary"
            variant="contained"
            sx={{ width: 130 }}
          >
            Modify
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DetailCustomer;
