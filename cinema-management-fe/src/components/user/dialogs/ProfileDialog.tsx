import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import { useAuth } from "../../../providers/AuthProvider";
import profileImg from "../../../assets/images/profile.png";

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({ open, onClose }) => {
  const { userProfile, handleLogout } = useAuth();

  const handleLogoutClick = () => {
    handleLogout();
    onClose(); // Close the dialog after logging out
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{ "& .MuiDialog-paper": { width: "60%" } }}
    >
      <DialogTitle>Profile Details</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar
            src={profileImg}
            alt={userProfile?.name || "Profile Picture"}
            sx={{ width: 80, height: 80 }}
          />
          <Typography variant="h6">{userProfile?.name || "N/A"}</Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {userProfile?.email || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong> {userProfile?.phone || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Role:</strong> {userProfile?.role || "N/A"}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button onClick={handleLogoutClick} color="secondary" variant="contained">
          Log Out
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog;