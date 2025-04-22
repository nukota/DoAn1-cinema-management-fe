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
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CinemaType } from "../../../interfaces/types";
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

interface CreateEmployeeProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newEmployee: any) => void;
}
const shifts: string[] = ["Morning", "Afternoon", "Evening"];

const CreateEmployee: React.FC<CreateEmployeeProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [fullname, setFullname] = useState<String>("");
  const [email, setEmail] = useState<String>("");
  const [phone, setPhone] = useState<String>("");
  const [dob, setDob] = useState<String>("");
  const [cccd, setCccd] = useState<String>("");
  const [role, setRole] = useState<String>("Employee");
  const [cinemaId, setCinemaId] = useState<number>();
  const [shift, setShift] = useState<string | null>(null);
  const [position, setPosition] = useState<string>("");
  const [password, setPassword] = useState<String>("");
  const [confirmPassword, setConfirmPassword] = useState<String>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  }


  const handleAddClick = () => {};
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
        Add Employee
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
            Phone Num:
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
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Confirm Password:
          </Typography>
          <TextField
            placeholder="Confirm Password"
            fullWidth
            margin="dense"
            size="small"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={toggleConfirmPasswordVisibility}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
            value={exampleCinemas.find((c) => c.cinema_id === cinemaId) || null}
            fullWidth
            onChange={(event, newValue) => setCinemaId(newValue?.cinema_id)}
            getOptionLabel={(option) =>
              `(ID: ${option.cinema_id}) ${option.name}`
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

export default CreateEmployee;
