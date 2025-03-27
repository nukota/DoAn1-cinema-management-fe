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
import { DiscountType } from "../../../types";
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

interface DetailDiscountProps {
  discount: DiscountType;
  open: boolean;
  onClose: () => void;
}

const DetailDiscount: React.FC<DetailDiscountProps> = ({
  discount,
  open,
  onClose,
}) => {
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
        Detail Discount
      </DialogTitle>
      <CustomDialogContent>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>ID:</Typography>
          <TextField
            fullWidth
            value={discount.discount_id}
            disabled
            margin="dense"
            size="small"
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            CODE:
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            size="small"
            disabled
            value={discount.code}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Type:
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            size="small"
            disabled
            value={discount.discount_type}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Minium purchase:
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            size="small"
            value={discount.min_purchase}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Value:
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            size="small"
            value={discount.value}
            disabled
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Expiry Date:
          </Typography>
          <TextField
            type="date"
            fullWidth
            margin="dense"
            size="small"
            disabled
            value={discount.expiry_date}
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
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailDiscount;
