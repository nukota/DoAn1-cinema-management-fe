import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { OrderType } from "../../../interfaces/types";
import { formatTime } from "../../../utils/formatUtils";
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
  open: boolean;
  onClose: () => void;
  onDelete?: (orderId: string) => void;
}

const DetailOrder: React.FC<DetailOrderProps> = ({
  order,
  open,
  onClose,
  onDelete,
}) => {

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        maxHeight: "90vh",
        overflow: "auto",
        placeSelf: "center",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
      }}
    >
      <DialogTitle
        sx={{
          fontSize: 20,
          fontWeight: "medium",
          fontFamily: "inherit",
          padding: "4px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #999",
        }}
      >
        <Typography color="gray" sx={{ fontWeight: "medium" }}>
          #{order._id}
        </Typography>
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: "regular",
            opacity: 0.5,
            color:
              order.status === "paid"
                ? "green"
                : order.status === "pending"
                ? "gray"
                : "red",
          }}
        >
          {order.status.toUpperCase()}
        </Typography>
      </DialogTitle>
      <CustomDialogContent
        sx={{
          fontSize: 14,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography sx={{ mr: 2, mt: 2 }} color="gray">
          User: {`(ID: ${order.user_id}) Nguyen Van A`}
        </Typography>
        <Typography sx={{ mr: 2 }} color="gray">
          Date: {formatTime(order.ordered_at)}
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "#fff",
            marginTop: 2,
            overflow: "auto",
            maxHeight: "60vh",
            minWidth: { xs: 360, md: 400, lg: 480 },
            "&::-webkit-scrollbar": {
              width: "6px", // Set the width of the scrollbar
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ccc", // Set the color of the scrollbar thumb
              borderRadius: "3px", // Add rounded corners to the scrollbar thumb
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#aaa", // Change the color on hover
            },
            scrollbarWidth: "thin",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 600,
                backgroundColor: "#eee",
                padding: 1,
                borderRadius: 1,
              }}
            >
              Tickets
            </Typography>
            {order.tickets ? (
              <Box
                sx={{
                  padding: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                <Typography sx={{ fontSize: 14 }}>
                  Movie: {order.tickets.title}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  Showtime: {formatTime(order.tickets.showtime)}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  Price: {order.tickets.price.toFixed(0)} VND
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  Seats:{" "}
                  {order.tickets.seats.map((seat) => seat.seat_name).join(", ")}
                </Typography>
              </Box>
            ) : (
              <Typography>No tickets bought.</Typography>
            )}
          </Box>
          <Table sx={{}} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{
                    fontSize: 16,
                    fontWeight: 600,
                    p: 1,
                    backgroundColor: "#eee",
                  }}
                  padding="none"
                >
                  Products
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: "8%", padding: 1 }}>ID</TableCell>
                <TableCell sx={{ width: "30%", padding: 1 }}>Name</TableCell>
                <TableCell sx={{ width: "18%", padding: 1 }}>
                  Quantity
                </TableCell>
                <TableCell sx={{ width: "22%", padding: 1 }}>Price</TableCell>
                <TableCell sx={{ width: "22%", padding: 1 }}>Total</TableCell>
              </TableRow>
            </TableHead>
            {order.products && order.products.length > 0 && (
              <TableBody>
                {order.products.map((product) => (
                  <TableRow
                    key={product.product_id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ width: "8%", padding: 1 }}>
                      {product.name}
                    </TableCell>
                    <TableCell sx={{ width: "30%", padding: 1 }}>
                      Very Long Name
                    </TableCell>
                    <TableCell sx={{ width: "18%", padding: 1 }}>
                      {product.quantity}
                    </TableCell>
                    <TableCell sx={{ width: "22%", padding: 1 }}>{}</TableCell>
                    <TableCell sx={{ width: "22%", padding: 1 }}>{}</TableCell>
                  </TableRow>
                ))}
                <TableCell
                  colSpan={5}
                  sx={{ display: "flex", p: 1 }}
                  padding="none"
                >
                  <Typography>Total:</Typography>
                  <Typography sx={{ pl: 2 }}>{order.total_price}</Typography>
                </TableCell>
              </TableBody>
            )}
          </Table>
        </TableContainer>

        <Typography sx={{ mr: 2, marginTop: 3, fontWeight: 600 }}>
          Total: {order.total_price}
        </Typography>
      </CustomDialogContent>
      <DialogActions sx={{ mb: 1.5, mr: 2 }}>
        <Button
          onClick={() => onDelete && onDelete(order._id)}
          color="primary"
          variant="outlined"
          sx={{ width: 130 }}
          disabled={order.status === "paid"}
        >
          Delete
        </Button>
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          sx={{ width: 130 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailOrder;
