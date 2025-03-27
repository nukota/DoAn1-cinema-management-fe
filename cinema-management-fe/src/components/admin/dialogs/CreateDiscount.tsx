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

interface CreateDiscountProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newDiscount: any) => void;
}
const types: String[] = ["percentage", "fixed"];

const CreateDiscount: React.FC<CreateDiscountProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [code, setCode] = useState<String>("");
  const [type, setType] = useState<String>("");
  const [expiryDate, setExpiryDate] = useState<String>("");
  const [value, setValue] = useState<Number>(0);
  const [minPurchase, setMinPurchase] = useState<Number>(0);

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
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            CODE:
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            size="small"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Type:
          </Typography>
          <Autocomplete
            options={types}
            value={type}
            fullWidth
            onChange={(event, newValue) => setType(newValue!)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="type"
                margin="dense"
                size="small"
              />
            )}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Minium purchase:
          </Typography>
          <TextField
            type="number"
            fullWidth
            margin="dense"
            size="small"
            value={minPurchase}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Value:
          </Typography>
          <TextField
            type="number"
            fullWidth
            margin="dense"
            size="small"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
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
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
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

export default CreateDiscount;
