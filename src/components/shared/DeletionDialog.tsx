import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

interface DeletionDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  onClose: (result: boolean) => void; // Callback to return true (confirm) or false (cancel)
}

const DeletionDialog: React.FC<DeletionDialogProps> = ({
  open,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  onClose,
}) => {
  const handleConfirm = () => {
    onClose(true); // Return true when user confirms
  };

  const handleCancel = () => {
    onClose(false); // Return false when user cancels
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      PaperProps={{
        style: { width: "400px" }, // Set fixed width for the dialog
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="contained" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletionDialog;