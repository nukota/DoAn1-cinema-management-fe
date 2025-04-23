import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { PaymentType } from "../../../interfaces/types";
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

interface DetailPaymentProps {
  payment: PaymentType;
  open: boolean;
  onClose: () => void;
}

const DetailPayment: React.FC<DetailPaymentProps> = ({
  payment,
  open,
  onClose,
}) => {
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
        Detail Payment
      </DialogTitle>
      <CustomDialogContent>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Payment ID:
          </Typography>
          <TextField
            fullWidth
            value={`#${payment._id}`}
            disabled
            margin="dense"
            size="small"
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Order:
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            size="small"
            value={`#${payment.order_id}`}
            disabled
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Amount:
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            size="small"
            value={payment.amount}
            disabled
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Discount:
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            size="small"
            value={payment.discount_id}
            disabled
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
            Status:
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            size="small"
            value={payment.status}
            disabled
          />
        </Box>
        {payment.status === "completed" && (
          <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
            <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
              Method:
            </Typography>
            <TextField
              fullWidth
              margin="dense"
              size="small"
              value={payment.payment_method}
              disabled
            />
          </Box>
        )}
        {payment.status === "completed" && (
          <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
            <Typography sx={{ mr: 2, marginTop: 1, width: 156 }}>
              Paid at:
            </Typography>
            <TextField
              fullWidth
              margin="dense"
              size="small"
              value={payment.paid_at}
              disabled
            />
          </Box>
        )}
      </CustomDialogContent>
      <DialogActions sx={{ mb: 1.5, mr: 2 }}>
        {payment.status === "pending" && (
          <Button
            // onClick={{}}
            color="primary"
            variant="contained"
            sx={{ width: 160 }}
          >
            Mark as Completed
          </Button>
        )}
        {payment.status === "pending" && (
          <Button
            // onClick={{}}
            color="primary"
            variant="contained"
            sx={{ width: 160 }}
          >
            Mark as Canceled
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DetailPayment;
