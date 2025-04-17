import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { ProductType, SeatType } from "../../../interfaces/types";
import NumberPicker from "../../utils/NumberPicker";
import ProductItem from "../items/ProductItem";
import SeatUnit from "../items/SeatUnit";
const ticketPrice = 45000;

interface BookingInfoProps {
  seats: SeatType[];
  selectedSeats: SeatType[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<SeatType[]>>;
  ticketCount: number;
  setTicketCount: React.Dispatch<React.SetStateAction<number>>;
  products: ProductType[];
  selectedProducts: { product: ProductType, amount: number }[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<{ product: ProductType, amount: number }[]>>;
}
const BookingInfo: React.FC<BookingInfoProps> = ({
  seats,
  selectedSeats,
  setSelectedSeats,
  ticketCount,
  setTicketCount,
  products,
  selectedProducts,
  setSelectedProducts,
}) => {
  return (
    <div className="flex flex-col mt-12 z-30 bg-black my-10">
      <Accordion
        sx={{
          backgroundColor: "black",
          margin: 0,
          borderBottom: "2px solid #222",
        }}
        disableGutters
      >
        <AccordionSummary
          sx={{ paddingX: 4, backgroundColor: "black" }}
          expandIcon={
            <ExpandMoreIcon sx={{ color: "primary.main", fontSize: 40 }} />
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography
            variant="h5"
            className="tracking-widest"
            sx={{
              color: "lightgray",
              fontWeight: "bold",
              py: 2,
              letterSpacing: "0.1em",
            }}
          >
            SELECT SEATS
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: "black", padding: 0 }}>
          <SeatSelecting
            seats={seats}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            ticketCount={ticketCount}
            setTicketCount={setTicketCount}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion
        sx={{
          backgroundColor: "black",
          margin: 0,
          borderBottom: "2px solid #222",
        }}
        disableGutters
      >
        <AccordionSummary
          sx={{ paddingX: 4, backgroundColor: "black" }}
          expandIcon={
            <ExpandMoreIcon sx={{ color: "primary.main", fontSize: 40 }} />
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography
            variant="h5"
            className="tracking-widest"
            sx={{
              color: "lightgray",
              fontWeight: "bold",
              py: 2,
              letterSpacing: "0.1em",
            }}
          >
            BUY FOOD & DRINK
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: "black", padding: 0 }}>
          <ProductSelecting
            products={products}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
export default BookingInfo;

interface SeatSelectingProps {
  seats: SeatType[];
  selectedSeats: SeatType[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<SeatType[]>>;
  ticketCount: number;
  setTicketCount: React.Dispatch<React.SetStateAction<number>>;
}
const SeatSelecting: React.FC<SeatSelectingProps> = ({
  seats,
  selectedSeats,
  setSelectedSeats,
  ticketCount,
  setTicketCount,
}) => {
  const theme = useTheme();
  const rows = "ABCDEFGHIJKLMN".split("");
  const columnOffset = 9;

  const grid = [];
  for (let row = 1; row <= 14; row++) {
    for (let col = -8; col <= 8; col++) {
      const seat = seats.find(
        (s) => rows.indexOf(s.seat_name[0]) + 1 === row && s.seat_column === col
      );
      grid.push(
        <Box
          key={`${row}-${col}`}
          sx={{
            width: "40px",
            height: "24px",
            display: "inline-block",
            textAlign: "center",
            borderRadius: "6px",
          }}
        >
          {seat ? (
            <SeatUnit
              seat={seat}
              status="available"
              onSelect={() => handleSeatClick(seat)}
            />
          ) : (
            <Box
              sx={{
                width: "40px",
                height: "24px",
              }}
            />
          )}
        </Box>
      );
    }
  }

  const handleSeatClick = (seat: SeatType) => {
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.some((s) => s.seat_id === seat.seat_id)) {
        return prevSelectedSeats.filter((s) => s.seat_id !== seat.seat_id);
      } else if (prevSelectedSeats.length < ticketCount) {
        return [...prevSelectedSeats, seat];
      }
      return prevSelectedSeats;
    });
  };

  return (
    <Box
      sx={{
        width: 1,
        display: "flex",
        flexDirection: "column",
        justifyItems: "center",
        alignItems: "center",
        paddingTop: 8,
        zIndex: 10,
        borderTop: "2px solid #222",
      }}
    >
      <Box
        sx={{
          width: 0.8,
          height: "100px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            width: "320px",
            height: "140px",
            border: `2px solid ${theme.palette.primary.main}`,
            borderRadius: 2,
            display: "flex",
            position: "relative",
            flexDirection: "column",
            alignItems: "flex-start",
            paddingX: 2,
            paddingY: 1,
            justifyItems: "flex-start",
            // backgroundColor: 'blue'
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "white", fontWeight: "medium" }}
          >
            Ticket
          </Typography>
          <Typography variant="h6" sx={{ color: "gray", fontWeight: "normal" }}>
            {ticketPrice}
          </Typography>
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: 12,
            }}
          >
            <NumberPicker
              value={ticketCount}
              onChange={(value) => {
                setSelectedSeats([]);
                setTicketCount(value);
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            width: "240px",
            height: "140px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "lightgray", fontWeight: "bold", mt: -2, ml: -2 }}
          >
            Note:
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Box
              sx={{
                width: 38,
                height: 23,
                backgroundColor: "white",
                border: "1px solid black",
                borderRadius: 1,
                marginRight: 1,
              }}
            />
            <Typography variant="body1" sx={{ color: "gray" }}>
              Available Seat
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Box
              sx={{
                width: 38,
                height: 23,
                backgroundColor: "gray",
                border: "1px solid black",
                borderRadius: 1,
                marginRight: 1,
              }}
            />
            <Typography variant="body1" sx={{ color: "gray" }}>
              Resersed Seat
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Box
              sx={{
                width: 38,
                height: 23,
                backgroundColor: theme.palette.secondary.main,
                border: "1px solid black",
                borderRadius: 1,
                marginRight: 1,
              }}
            />
            <Typography variant="body1" sx={{ color: "gray" }}>
              Selected Seat
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          mb: 4,
          mt: 10,
          py: 10,
          border: "2px solid gray",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "white",
            fontWeight: "bold",
            letterSpacing: "0.1em",
            mb: 1,
          }}
        >
          SCREEN
        </Typography>
        <div className="h-3 w-[600px] bg-white rounded-full self-center items-center mb-2" />
        <Box
          sx={{
            height: 360,
            display: "grid",
            gridTemplateColumns: `repeat(19, 42px)`,
            gridTemplateRows: `repeat(13, 30px)`,
            justifyContent: "center",
            gap: 1,
            marginTop: 6,
          }}
        >
          {grid}
        </Box>
      </Box>
    </Box>
  );
};

interface ProductSelectingProps {
  products: ProductType[];
  selectedProducts: { product: ProductType; amount: number }[];
  setSelectedProducts: React.Dispatch<
    React.SetStateAction<{ product: ProductType; amount: number }[]>
  >;
}
const ProductSelecting: React.FC<ProductSelectingProps> = ({
  products,
  selectedProducts,
  setSelectedProducts,
}) => {
  const setAmount = (product: ProductType, newAmount: number) => {
    setSelectedProducts((prevProducts) => {
      const existingProduct = prevProducts.find(
        (p) => p.product.name === product.name
      );
      if (existingProduct) {
        return prevProducts.map((p) =>
          p.product.name === product.name ? { ...p, amount: newAmount } : p
        );
      } else {
        return [...prevProducts, { product, amount: newAmount }];
      }
    });
  };
  return (
    <Box
      sx={{
        width: 1,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        paddingX: 4,
        paddingY: 10,
        rowGap: 6,
        zIndex: 10,
        borderTop: "2px solid #222",
      }}
    >
      {products.map((product) => {
        const existingProduct = selectedProducts.find(
          (p) => p.product.name === product.name
        );
        const amount = existingProduct ? existingProduct.amount : 0;
        return (
          <ProductItem
            key={product.product_id}
            product={product}
            amount={amount}
            setAmount={setAmount}
          />
        );
      })}
    </Box>
  );
};
