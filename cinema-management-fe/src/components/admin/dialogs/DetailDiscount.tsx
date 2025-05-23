import { useEffect, useState } from "react";
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
import { DiscountType } from "../../../interfaces/types";
import { toast } from "react-toastify";
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
  onSave: (newDiscount: any) => Promise<boolean>;
}
const types: String[] = ["percentage", "fixed"];

const DetailDiscount: React.FC<DetailDiscountProps> = ({
  discount,
  open,
  onClose,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [code, setCode] = useState<String>("");
  const [type, setType] = useState<String>("");
  const [expiryDate, setExpiryDate] = useState<String>("");
  const [value, setValue] = useState<Number>(0);
  const [minPurchase, setMinPurchase] = useState<Number>(0);
  const [maxUsage, setMaxUsage] = useState<Number>(0);

  useEffect(() => {
    if (discount) {
      setCode(discount.code);
      setType(discount.discount_type);
      setValue(discount.value);
      setMinPurchase(discount.min_purchase);
      setMaxUsage(discount.max_usage);
      setExpiryDate(discount.expiry_date);
    }
    if (!open) {
      setIsEditing(false);
    }
  }, [discount, open]);

  const handleModifyClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (!code || !type || !value || !minPurchase || !maxUsage) {
      toast.error("All fields are required");
      return;
    }
    const updatedDiscount = {
      ...discount,
      code,
      discount_type: type,
      min_purchase: minPurchase,
      max_usage: maxUsage,
      value,
      expiry_date: expiryDate,
    };
    onSave(updatedDiscount);
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
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
            margin="dense"
            size="small"
            value={minPurchase}
            onChange={(e) => setMinPurchase(Number(e.target.value))}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Max Usage
          </Typography>
          <TextField
            type="number"
            fullWidth
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
            margin="dense"
            size="small"
            value={expiryDate ? expiryDate.slice(0, 10) : ""}
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

export default DetailDiscount;
