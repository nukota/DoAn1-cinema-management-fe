import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { ProductType, SeatType } from "../../../interfaces/types";
import ProductSelecting from "./ProductSelecting";
import SeatSelecting from "./SeatSelecting";

interface BookingInfoProps {
  seats: SeatType[];
  selectedSeats: SeatType[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<SeatType[]>>;
  price?: number;
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
  price,
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
            price={price}
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