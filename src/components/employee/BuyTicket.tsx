import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
} from "@mui/material";
import {
  MovieType,
  ProductType,
  SeatType,
  ShowtimeType,
} from "../../interfaces/types";
import CalendarImg from "../../assets/images/calendar.svg";
import { useSeats } from "../../providers/SeatProvider";
import { useShowtimes } from "../../providers/ShowtimesProvider";
import { useProducts } from "../../providers/ProductsProvider";
import { useCustomers } from "../../providers/CustomersProvider";
import { useOrders } from "../../providers/OrdersProvider";

// Import section components
import SelectTickets from "./elements/buy-ticket-sections/SelectTickets";
import SelectSeats from "./elements/buy-ticket-sections/SelectSeats";
import SelectProducts from "./elements/buy-ticket-sections/SelectProducts";
import CustomerInformation from "./elements/buy-ticket-sections/CustomerInformation";
import Payment from "./elements/buy-ticket-sections/Payment";
import PrintTicket from "./elements/buy-ticket-sections/PrintTicket";
const steps = [
  "Select Ticket",
  "Select Seats",
  "Select Products",
  "Customer Information",
  "Payment",
  "Print Ticket",
];

const BuyTicket: React.FC = () => {
  const { currentShowtime, getCurrentShowtime } = useShowtimes();
  const { seats, fetchSeatsByShowtimeId, loading } = useSeats();
  const { products, fetchProductsData } = useProducts();
  const { customers, fetchCustomersData } = useCustomers();
  const { createDetailedOrder } = useOrders();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedTab, setSelectedTab] = useState<number>(0);
  //
  const [selectedShowtime, setSelectedShowtime] = useState<{
    movie: MovieType;
    showtime: ShowtimeType;
  } | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: string]: number;
  }>({});
  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([]);
  const [ticketCount, setTicketCount] = useState<number>(0);
  const [filterName, setFilterName] = useState<string>("");
  const [filterPhone, setFilterPhone] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<string | null>(
    "Guest"
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("cash");
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    getCurrentShowtime();
    fetchProductsData();
    fetchCustomersData();
  }, []);

  useEffect(() => {
    if (activeStep === 1 && selectedShowtime) {
      fetchSeatsByShowtimeId(selectedShowtime.showtime._id);
    }
  }, [activeStep, selectedShowtime]);

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleShowtimeSelect = (movie: MovieType, showtime: ShowtimeType) => {
    setSelectedShowtime({ movie, showtime });
  };

  const handleNext = async () => {
    if (activeStep === 4) {
      // Build payload
      const ticketTotal =
        selectedShowtime && selectedSeats.length > 0
          ? selectedSeats.length * selectedShowtime.showtime.price
          : 0;
      // Calculate products total
      const productsTotal = Object.entries(selectedProducts).reduce(
        (sum, [productId, quantity]) => {
          const product = products.find((p) => p._id === productId);
          return sum + (product ? product.price * quantity : 0);
        },
        0
      );
      // Final total price and amount
      const total_price = ticketTotal + productsTotal;
      const data = {
        total_price: total_price,
        user_id:
          selectedTab === 0
            ? customers.find(
                (c) => `${c.full_name} (${c.phone})` === selectedAccount
              )?._id
            : undefined,
        email: selectedTab === 1 ? guestEmail : undefined,
        payment_method: selectedPaymentMethod,
        discount_id: null,
        amount: total_price,
        products: Object.entries(selectedProducts).map(
          ([productId, quantity]) => ({
            product_id: productId,
            quantity,
          })
        ),
        tickets: {
          showtime_id: selectedShowtime?.showtime._id,
          price: selectedShowtime?.showtime.price,
          seats: selectedSeats.map((seat) => ({
            seat_id: seat._id,
          })),
        },
      };

      try {
        const pdfBlob = await createDetailedOrder(data);
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, "_blank");
        setPdfUrl(url);
        setActiveStep((prev) => prev + 1);
      } catch (error) {
        console.error("Failed to create order:", error);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const handlePrint = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.focus();
      iframeRef.current.contentWindow?.print();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedPaymentMethod("cash");
    setIsPaid(false);
    setSelectedProducts({});
    setSelectedSeats([]);
    setSelectedShowtime(null);
  };

  const handleMarkAsPaid = () => {
    setIsPaid(true);
  };

  const handleSetAmount = (product: ProductType, newAmount: number) => {
    setSelectedProducts((prev) => {
      const updatedProducts = { ...prev };
      if (newAmount > 0) {
        updatedProducts[product._id] = newAmount;
      } else {
        delete updatedProducts[product._id];
      }
      return updatedProducts;
    });
  };

  const handleAccountSelect = (accountName: string) => {
    setSelectedAccount(accountName);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats((prevSelectedSeats) => {
      const seat = seats.find((s) => s._id === seatId);
      if (!seat) return prevSelectedSeats;

      if (prevSelectedSeats.includes(seat)) {
        return prevSelectedSeats.filter((s) => s._id !== seatId);
      } else if (prevSelectedSeats.length < ticketCount) {
        return [...prevSelectedSeats, seat];
      }
      return prevSelectedSeats;
    });
  };

  const filteredShowtimes = currentShowtime.filter((movie: MovieType) =>
    movie.showtimes?.some(
      (showtime: any) =>
        new Date(showtime.showtime).toLocaleDateString("en-CA") === selectedDate
    )
  );

  return (
    <div className="flex flex-col h-full w-full py-2 pr-2 relative">
      <div className="z-[1] w-full min-w-[1200px] h-full m-auto flex flex-col items-start text-black">
        <Typography
          variant="h4"
          color="black"
          sx={{ mb: 4, fontWeight: "bold", alignSelf: "center" }}
        >
          Buy Ticket Workflow
        </Typography>
        <Stepper activeStep={activeStep} sx={{ width: "100%", mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            minWidth: "1200px",
            minHeight: { xs: "600px", xl: "800px" },
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            borderRadius: 2,
            border: "1px solid #dadada",
            background: "#fff",
            position: "relative",
          }}
        >
          {activeStep === steps.length ? (
            <div>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed.
              </Typography>
            </div>
          ) : (
            <div className="overflow-x-scroll custom-scrollbar h-full relative px-4 pt-4">
              {activeStep === 0 && (
                <SelectTickets
                  filteredShowtimes={filteredShowtimes}
                  selectedDate={selectedDate}
                  selectedShowtime={selectedShowtime}
                  onShowtimeSelect={handleShowtimeSelect}
                />
              )}
              {activeStep === 1 && (
                <SelectSeats
                  seats={seats}
                  selectedSeats={selectedSeats}
                  ticketCount={ticketCount}
                  loading={loading}
                  onSeatClick={handleSeatClick}
                  onTicketCountChange={(count) => {
                    setTicketCount(count);
                    setSelectedSeats([]); // Reset selected seats when ticket count changes
                  }}
                />
              )}
              {activeStep === 2 && (
                <SelectProducts
                  products={products}
                  selectedProducts={selectedProducts}
                  onSetAmount={handleSetAmount}
                />
              )}
              {activeStep === 3 && (
                <CustomerInformation
                  selectedTab={selectedTab}
                  filterName={filterName}
                  filterPhone={filterPhone}
                  guestPhone={guestPhone}
                  guestEmail={guestEmail}
                  customers={customers}
                  onTabChange={handleTabChange}
                  onFilterNameChange={setFilterName}
                  onFilterPhoneChange={setFilterPhone}
                  onGuestPhoneChange={setGuestPhone}
                  onGuestEmailChange={setGuestEmail}
                  onAccountSelect={handleAccountSelect}
                />
              )}
              {activeStep === 4 && (
                <Payment
                  selectedPaymentMethod={selectedPaymentMethod}
                  isPaid={isPaid}
                  onPaymentMethodChange={handlePaymentMethodChange}
                />
              )}
              {activeStep === 5 && (
                <PrintTicket
                  pdfUrl={pdfUrl}
                  iframeRef={iframeRef}
                  onPrint={handlePrint}
                />
              )}
            </div>
          )}
          <div className="absolute bottom-0 w-full flex gap-2 px-4 border-t py-4 border-light-gray rounded-b-lg bg-white">
            {activeStep === 0 && (
              <div className=" mr-auto flex flex-row gap-2 items-center">
                <div className="DateFilterBar relative w-full max-w-[240px] h-9 mr-2 self-end">
                  <input
                    type="date"
                    id="date-picker"
                    className="w-full h-full pr-5 pl-10 text-sm text-gray rounded-md text-gray-700 bg-white border-light-gray border focus:outline-none focus:ring-1"
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                  <img
                    src={CalendarImg}
                    alt="Calendar"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer"
                    style={{
                      filter:
                        "invert(10%) sepia(88%) saturate(6604%) hue-rotate(352deg) brightness(73%) contrast(0%)",
                    }}
                    // onClick={handleCalendarClick}
                  />
                </div>
                <Typography
                  variant="body1"
                  sx={{
                    width: "400px",
                    textAlign: "left",
                    color: "#999999",
                  }}
                >
                  Selected:{" "}
                  {selectedShowtime
                    ? `${selectedShowtime.movie.title} - ${new Date(
                        selectedShowtime.showtime.showtime
                      ).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : "None"}
                </Typography>
              </div>
            )}
            {activeStep === 1 && (
              <div className="mr-auto flex flex-row items-center justify-items-start gap-2">
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 400, height: "auto" }}
                >
                  Selected Seats:{" "}
                  {selectedSeats.length > 0
                    ? selectedSeats.map((seat) => seat.seat_name).join(", ")
                    : "None"}
                </Typography>
              </div>
            )}
            {activeStep === 2 && (
              <div className="mr-auto flex flex-row items-center justify-items-start gap-2">
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 400, width: "154px", height: "auto" }}
                  textAlign="left"
                >
                  Selected Products:{" "}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    maxWidth: "800px",
                    color: "#333",
                    height: "auto",
                    textAlign: "left",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {Object.entries(selectedProducts)
                    .map(([productId, quantity]) => {
                      const product = products.find((p) => p._id === productId);
                      return product ? `${product.name} (${quantity})` : null;
                    })
                    .filter(Boolean) // Remove null values
                    .join(", ")}
                </Typography>
              </div>
            )}
            {activeStep === 3 && (
              <div className="mr-auto flex flex-row items-center justify-items-start  gap-2">
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 400, width: "154px", height: "auto" }}
                  textAlign="left"
                >
                  Selected Account:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    maxWidth: "800px",
                    color: "#333",
                    height: "auto",
                    textAlign: "left",
                  }}
                >
                  {selectedTab === 0
                    ? selectedAccount && selectedAccount !== "Guest"
                      ? selectedAccount
                      : "No account selected"
                    : "Guest"}
                </Typography>
              </div>
            )}
            {activeStep === 4 && (
              <div className="mr-auto flex flex-row items-center gap-2">
                <Button
                  onClick={handleMarkAsPaid}
                  color="primary"
                  variant="contained"
                  sx={{ mr: 1, height: "34px", alignSelf: "end" }}
                  disabled={isPaid}
                >
                  Mark as Paid
                </Button>
              </div>
            )}
            <Button
              onClick={handleReset}
              color="secondary"
              variant="outlined"
              sx={{ mr: 1, height: "34px", alignSelf: "end" }}
            >
              Reset
            </Button>
            <Button
              disabled={activeStep === 0}
              color="primary"
              onClick={handleBack}
              sx={{ mr: 1, height: "34px", alignSelf: "end" }}
              variant="outlined"
            >
              Back
            </Button>
            {activeStep < steps.length - 1 && (
              <Button
                onClick={handleNext}
                variant="contained"
                color="primary"
                sx={{ height: "34px", alignSelf: "end" }}
                disabled={
                  (activeStep === 0 && !selectedShowtime) ||
                  (activeStep === 1 && selectedSeats.length < ticketCount) ||
                  (activeStep === 4 && !isPaid)
                }
              >
                Next
              </Button>
            )}
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default BuyTicket;
