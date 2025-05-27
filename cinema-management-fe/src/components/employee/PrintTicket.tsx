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
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckOrder = async () => {
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const result = await getOrderByCode(orderCode.trim());
      if (result) {
        setOrder(result);
      } else {
        setError("Order not found.");
      }
    } catch {
      setError("Failed to fetch order.");
    }
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

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
          {order && (
            <Box
              sx={{
                width: "100%",
                border: "1px solid #eee",
                borderRadius: 2,
                p: 3,
                mb: 2,
                background: "#fafafa",
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={2}>
                Ticket Information
              </Typography>
              <Typography>
                <b>Order Code:</b> {order.code}
              </Typography>
              <Typography>
                <b>Customer:</b> {order.customerName}
              </Typography>
              <Typography>
                <b>Movie:</b> {order.movieTitle}
              </Typography>
              <Typography>
                <b>Showtime:</b> {order.showtime}
              </Typography>
              <Typography>
                <b>Seats:</b> {order.seats.join(", ")}
              </Typography>
              <Typography>
                <b>Products:</b>{" "}
                {order.products && order.products.length > 0
                  ? order.products
                      .map((p: any) => `${p.name} (${p.quantity})`)
                      .join(", ")
                  : "None"}
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            disabled={!order}
            sx={{ mt: 2, width: 180 }}
          >
            Print Ticket
          </Button>
        </Paper>
      </div>
    </div>
  );
};

export default PrintTicket;