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
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { EmployeeType, CinemaType } from "../../../interfaces/types";
import { exampleCinemas } from "../../../data";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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

interface DetailEmployeeProps {
  employee: EmployeeType;
  open: boolean;
  onClose: () => void;
  onSave: (newEmployee: any) => void;
}
const shifts: string[] = ["Morning", "Afternoon", "Evening"];

const DetailEmployee: React.FC<DetailEmployeeProps> = ({
  employee,
  open,
  onClose,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [cccd, setCccd] = useState<string>("");
  const [role, setRole] = useState<string>("employee");
  const [cinemaId, setCinemaId] = useState<string>();
  const [shift, setShift] = useState<string | null>(null);
  const [position, setPosition] = useState<string>("");
  const [password, setPassword] = useState<String>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (employee) {
      setFullname(employee.fullname);
      setEmail(employee.email);
      setPhone(employee.phone);
      setDob(employee.dob);
      setCccd(employee.cccd);
    }
    if (!open) {
      setIsEditing(false);
    }
  }, [employee, open]);

  const handleModifyClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
        Detail Employee
      </DialogTitle>
      <CustomDialogContent>
        <Typography
          variant="h6"
          gutterBottom
          color="primary"
          fontWeight={550}
          sx={{ mt: 1 }}
        >
          Personal Info
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>ID:</Typography>
          <TextField
            placeholder="Auto generated"
            fullWidth
            value={`#${employee.employee_id} (account #${employee._id})`}
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
            Phone Num:
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
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Password:
          </Typography>
          <TextField
            placeholder="Password"
            fullWidth
            margin="dense"
            size="small"
            type={showPassword ? "text" : "password"} // Toggle between text and password
            value={password}
            disabled={!isEditing}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  disabled={!isEditing} // Disable toggle when not editing
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
        </Box>
        <Typography
          variant="h6"
          gutterBottom
          color="primary"
          fontWeight={550}
          sx={{ mt: 2 }}
        >
          Employment Info
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Cinema:
          </Typography>
          <Autocomplete
            options={exampleCinemas}
            value={exampleCinemas.find((c) => c._id === cinemaId) || null}
            disabled={!isEditing}
            fullWidth
            onChange={(event, newValue) => setCinemaId(newValue?._id)}
            getOptionLabel={(option) =>
              `(ID: ${option._id}) ${option.name}`
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Cinema"
                margin="dense"
                size="small"
              />
            )}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Position:
          </Typography>
          <TextField
            placeholder="Position"
            fullWidth
            margin="dense"
            size="small"
            value={position}
            disabled={!isEditing}
            onChange={(e) => setPosition(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Shift:
          </Typography>
          <Autocomplete
            options={shifts}
            value={shift}
            disabled={!isEditing}
            fullWidth
            onChange={(event, newValue) => setShift(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Shift"
                margin="dense"
                size="small"
              />
            )}
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

export default DetailEmployee;
