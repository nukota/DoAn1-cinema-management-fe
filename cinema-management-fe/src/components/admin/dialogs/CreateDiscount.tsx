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
  const [maxUsage, setMaxUsage] = useState<Number>(0);

  const handleAddClick = () => {
    const newDiscount = {
      code,
      discount_type: type,
      min_purchase: minPurchase,
      max_usage: maxUsage,
      value,
      expiry_date: expiryDate,
    };
    onAdd(newDiscount);
    onClose();
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
        Create Discount
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
            onChange={(e) => setMinPurchase(Number(e.target.value))}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Max usage:
          </Typography>
          <TextField
            type="number"
            fullWidth
            margin="dense"
            size="small"
            value={maxUsage}
            onChange={(e) => setMaxUsage(Number(e.target.value))}
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

export default CreateDiscount;
