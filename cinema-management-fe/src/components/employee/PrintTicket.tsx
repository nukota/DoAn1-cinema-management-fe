import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Paper,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CheckIcon from "@mui/icons-material/Check";
import { useOrders } from "../../providers/OrdersProvider";

const PrintTicket: React.FC = () => {
  const { getOrderByCode } = useOrders();
  const [orderCode, setOrderCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCheckOrder = async () => {
    setLoading(true);
    setError("");
    setPdfUrl(null);
    setSuccess(false);
    try {
      const result = await getOrderByCode(orderCode.trim());
      if (result) {
        const url = URL.createObjectURL(result);
        setPdfUrl(url);
        setSuccess(true);
      } else {
        setError("Order not found.");
      }
    } catch {
      setError("Failed to fetch order.");
    }
    setLoading(false);
  };

  React.useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  return (
    <div className="flex flex-col h-full py-2 relative">
      <div className="z-[1] w-full h-full max-w-[600px] m-auto flex flex-col items-start text-black">
        <Typography
          variant="h4"
          color="black"
          sx={{ mb: 4, fontWeight: "bold", alignSelf: "center" }}
        >
          Print Ticket
        </Typography>
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            minHeight: 560,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3,
            background: "#fff",
          }}
        >
          <Box display="flex" gap={2} alignItems="center" mb={3} width="100%">
            <TextField
              label="Order Code"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              size="small"
              sx={{ flex: 1 }}
              disabled={loading}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              onClick={handleCheckOrder}
              disabled={loading || !orderCode.trim()}
            >
              {loading ? <CircularProgress size={20} /> : "Check"}
            </Button>
          </Box>
          {error && (
            <Typography color="error" mb={2}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="gray" mb={2}>
              Order found! PDF loaded successfully.
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={() => {
              if (pdfUrl) {
                window.open(pdfUrl, "_blank", "noopener,noreferrer");
              }
            }}
            disabled={!pdfUrl || loading}
            sx={{ mt: 2, width: 180 }}
          >
            See Order
          </Button>
        </Paper>
      </div>
    </div>
  );
};

export default PrintTicket;
