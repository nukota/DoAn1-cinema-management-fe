import {
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
import { OrderType } from "../../../interfaces/types";
import { formatTime } from "../../../utils/formatUtils";
import Dialog from "./template/Dialog";

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
  const actions = [
    {
      label: "Delete",
      onClick: () => onDelete && onDelete(order._id),
      variant: "outlined" as const,
      color: "primary" as const,
      disabled: order.status === "completed",
    },
    {
      label: "Close",
      onClick: onClose,
      variant: "contained" as const,
      color: "primary" as const,
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Order #${order._id}`}
      actions={actions}
      maxWidth="md"
      titleSx={{
        fontSize: 20,
        fontWeight: "medium",
        fontFamily: "inherit",
        padding: "4px 24px",
        borderBottom: "1px solid #999",
      }}
      contentSx={{
        fontSize: 14,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
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
          Status: {order.status.toUpperCase()}
        </Typography>
      </Box>

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
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#aaa",
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
                Price:{" "}
                {order.tickets.seats && order.tickets.seats.length > 1
                  ? `${order.tickets.seats.length} x ${
                      order.tickets.price ? order.tickets.price.toFixed(0) : "0"
                    } = ${
                      order.tickets.price
                        ? (
                            order.tickets.seats.length * order.tickets.price
                          ).toFixed(0)
                        : "0"
                    } VND`
                  : `${order.tickets.price ? order.tickets.price.toFixed(0) : "0"} VND`}
              </Typography>
              {!order.tickets.seats ||
              order.tickets.seats.length === 0 ||
              order.tickets.seats.some(
                (seat) => !seat.seat_name || seat.seat_name.trim() === ""
              ) ? (
                <Typography sx={{ fontSize: 14, color: "#dadada" }}>
                  Seats: Not found
                </Typography>
              ) : (
                <Typography sx={{ fontSize: 14 }}>
                  Seats:{" "}
                  {order.tickets.seats.map((seat) => seat.seat_name).join(", ")}
                </Typography>
              )}
            </Box>
          ) : (
            <Typography color="#dadada" sx={{ p: 1 }}>
              No tickets bought.
            </Typography>
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
            {order.products && order.products.length > 0 && (
              <TableRow>
                <TableCell sx={{ width: "8%", padding: 1 }}>ID</TableCell>
                <TableCell sx={{ width: "30%", padding: 1 }}>Name</TableCell>
                <TableCell sx={{ width: "18%", padding: 1 }}>
                  Quantity
                </TableCell>
                <TableCell sx={{ width: "22%", padding: 1 }}>Price</TableCell>
                <TableCell sx={{ width: "22%", padding: 1 }}>Total</TableCell>
              </TableRow>
            )}
          </TableHead>
          {order.products && order.products.length > 0 ? (
            <TableBody>
              {order.products.map((product) => (
                <TableRow
                  key={product.product_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      width: "8%",
                      padding: 1,
                      maxWidth: 50,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.product_id}
                  </TableCell>
                  <TableCell sx={{ width: "30%", padding: 1 }}>
                    {product.name}
                  </TableCell>
                  <TableCell sx={{ width: "18%", padding: 1 }}>
                    {product.quantity}
                  </TableCell>
                  <TableCell sx={{ width: "22%", padding: 1 }}>
                    {product.price}
                  </TableCell>
                  <TableCell sx={{ width: "22%", padding: 1 }}>
                    {product.total}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  colSpan={4}
                  sx={{ fontWeight: 600, textAlign: "right", p: 1 }}
                >
                  Products Total:
                </TableCell>
                <TableCell sx={{ fontWeight: 600, p: 1 }}>
                  {order.products.reduce(
                    (sum, p) => sum + (p.total || p.price * p.quantity),
                    0
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{ textAlign: "center", color: "#dadada" }}
                >
                  No products bought.
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <Typography sx={{ mr: 2, marginTop: 3, fontWeight: 600 }}>
        Total: {order.total_price}
      </Typography>
    </Dialog>
  );
};

export default DetailOrder;
