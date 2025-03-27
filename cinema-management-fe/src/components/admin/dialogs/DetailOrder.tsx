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
  Rating,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { OrderProductType, OrderType, TicketType } from "../../../types";
import orderBackgroundImg from "../../../assets/images/orderBackground.png";
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

interface DetailOrderProps {
  order: OrderType;
  tickets: TicketType[];
  products: OrderProductType[];
  open: boolean;
  onClose: () => void;
}

const DetailOrder: React.FC<DetailOrderProps> = ({
  order,
  tickets,
  products,
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
      <img
        src={orderBackgroundImg}
        alt="orderBackground"
        className="absolute top-0 -left-4 h-[174px] object-cover rounded-lg opacity-[4%]"
      />
      <DialogTitle
        sx={{
          fontSize: 20,
          fontWeight: "medium",
          fontFamily: "inherit",
          padding: "16px 24px",
          backgroundColor: "#f2f2f2",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography color="gray" sx={{ fontWeight: "medium" }}>
          #{order.order_id}
        </Typography>
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: "regular",
            opacity: 0.5,
            color:
              order.status === "completed"
                ? "green"
                : order.status === "pending"
                ? "gray"
                : "red",
          }}
        >
          {order.status.toUpperCase()}
        </Typography>
      </DialogTitle>
      <CustomDialogContent sx={{ backgroundColor: "#f2f2f2", fontSize: 14 }}>
        <Typography sx={{ mr: 2, marginTop: 1 }}>
          User: {`(ID: ${order.user_id}) Nguyen Van A`}
        </Typography>
        <Typography sx={{ mr: 2, marginTop: 1 }}>
          Date: {order.created_at}
        </Typography>

        <Typography sx={{ mt: 2, fontWeight: "bold" }}>Tickets:</Typography>
        {tickets.length > 0 ? (
          <Box sx={{ mt: 1 }}>
            {tickets.map((ticket, index) => (
              <Typography key={index} sx={{ ml: 2 }}>
                - Seat ID: {ticket.seat_id}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography sx={{ ml: 2, mt: 1 }}>No tickets available.</Typography>
        )}

        <Typography sx={{ mt: 2, fontWeight: "bold" }}>Products:</Typography>
        {products.length > 0 ? (
          <Box sx={{ mt: 1 }}>
            {products.map((product, index) => (
              <Typography key={index} sx={{ ml: 2 }}>
                - Product ID: {product.product_id}, Quantity: {product.quantity}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography sx={{ ml: 2, mt: 1 }}>No products available.</Typography>
        )}
        <Typography sx={{ mr: 2, marginTop: 3 }}>
          Total: {order.total_price}
        </Typography>
      </CustomDialogContent>
      <DialogActions sx={{ backgroundColor: "#f2f2f2" }}>
        <Button
          onClick={onClose}
          color="primary"
          variant="text"
          sx={{ width: 130 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailOrder;
