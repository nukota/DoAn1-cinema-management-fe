import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
} from "@mui/material";
import {
  MovieType,
  ProductType,
  SeatType,
  ShowtimeType,
} from "../../interfaces/types";
import CalendarImg from "../../assets/images/calendar.svg";
import ShowtimeUnit from "./items/ShowtimeUnit";
import ProductItem from "./items/ProductItem";
import VisaImg from "../../assets/images/visa.png";
import MomoImg from "../../assets/images/momo.png";
import CashImg from "../../assets/images/cash.png";
import BankingImg from "../../assets/images/banking.png";
import { useSeats } from "../../providers/SeatProvider";
import { useShowtimes } from "../../providers/ShowtimesProvider";
import { useProducts } from "../../providers/ProductsProvider";
import { useCustomers } from "../../providers/CustomersProvider";
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
  //
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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
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

  const renderSeatGrid = () => {
    const rows = "ABCDEFGHIJKLMN".split("");
    const grid = [];

    for (let row = 1; row <= 14; row++) {
      for (let col = -8; col <= 8; col++) {
        const seat = seats.find(
          (s) =>
            rows.indexOf(s.seat_name[0]) + 1 === row && s.seat_column === col
        );

        grid.push(
          <Box
            key={`${row}-${col}`}
            sx={{
              width: "42px",
              height: "26px",
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
              borderRadius: "4px",
              backgroundColor: seat
                ? seat.available
                  ? selectedSeats.includes(seat)
                    ? "#b80007"
                    : "#fafafa"
                  : "#ccc"
                : "transparent",
              cursor: seat && seat.available ? "pointer" : "not-allowed",
            }}
            onClick={() => seat && seat.available && handleSeatClick(seat._id)}
          >
            <Typography
              align="center"
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                color: seat
                  ? seat.available
                    ? selectedSeats.includes(seat)
                      ? "#fff"
                      : "#000"
                    : "#666"
                  : "#ccc",
              }}
            >
              {seat ? seat.seat_name : ""}
            </Typography>
          </Box>
        );
      }
    }
    return grid;
  };

  const filteredAccounts = customers.filter(
    (account) =>
      account.full_name.toLowerCase().includes(filterName.toLowerCase()) &&
      account.phone.includes(filterPhone)
  );
  console.log("Filtered Accounts: ", filteredAccounts);

  const filteredShowtimes = currentShowtime.filter((movie: MovieType) =>
    movie.showtimes?.some(
      (showtime: any) =>
        new Date(showtime.showtime).toLocaleDateString("en-CA") === selectedDate
    )
  );

  return (
    <div className="flex flex-col h-full py-2 relative">
      <div className="z-[1] w-full h-full max-w-[1200px] m-auto flex flex-col items-start text-black">
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
          elevation={3}
          sx={{
            width: "100%",
            minHeight: 600,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            borderRadius: 3,
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
            <div className="overflow-x-scroll custom-scrollbar w-[1200px] h-full relative px-4 pt-4">
              {activeStep === 0 && (
                <div className="flex gap-4 w-full">
                  {filteredShowtimes.map((movie: MovieType) => (
                    <div
                      key={movie._id}
                      className="w-[220px] h-[480px] flex flex-col items-center border border-light-gray rounded-lg bg-white pb-2 flex-shrink-0 overflow-clip"
                    >
                      {/* Movie Image */}
                      <div
                        className="image w-full h-[240px] bg-[#dadada] object-cover"
                        style={{
                          backgroundImage: `url(${movie.poster_url})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <Typography
                        className="text-center font-bold mt-4 mb-2 px-2 py-2 h-[64px]"
                        sx={{
                          fontSize: "16px",
                          color: "#484848",
                          textAlign: "center",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {movie.title}
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 px-4 overflow-y-auto custom-scrollbar flex-1 w-full">
                        {movie.showtimes
                          ?.filter(
                            (showtime: any) =>
                              new Date(showtime.showtime).toLocaleDateString(
                                "en-CA"
                              ) === selectedDate
                          )
                          .map((showtime: any) => (
                            <ShowtimeUnit
                              key={showtime._id}
                              showtimeData={showtime}
                              selected={
                                selectedShowtime?.showtime._id === showtime._id
                              }
                              onClick={() =>
                                handleShowtimeSelect(movie, showtime)
                              }
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeStep === 1 && (
                <div className="w-full h-[480px] overflow-y-scroll custom-scrollbar flex flex-col gap-4 pb-4">
                  {/* Ticket Count Picker */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      paddingLeft: "16px",
                    }}
                  >
                    <Typography
                      style={{
                        fontWeight: 400,
                        fontSize: "18px",
                        paddingRight: "8px",
                      }}
                    >
                      Number of Tickets:
                    </Typography>
                    {/* Decrement Button */}
                    <Button
                      variant="outlined"
                      onClick={() =>
                        setTicketCount((prev) => Math.max(0, prev - 1))
                      }
                      style={{
                        minWidth: "40px",
                        height: "40px",
                        fontSize: "24px",
                      }}
                      disabled={selectedSeats.length >= ticketCount}
                    >
                      -
                    </Button>

                    {/* Ticket Count Input */}
                    <TextField
                      type="number"
                      value={ticketCount}
                      size="small"
                      onChange={(e) => {
                        const value = Math.max(0, Number(e.target.value));
                        setTicketCount(value);
                        setSelectedSeats([]); // Reset selected seats when ticket count changes
                      }}
                      inputProps={{ min: 0 }}
                      style={{ width: "60px", textAlign: "center" }}
                    />

                    {/* Increment Button */}
                    <Button
                      variant="outlined"
                      onClick={() => setTicketCount((prev) => prev + 1)}
                      style={{
                        minWidth: "40px",
                        height: "40px",
                        fontSize: "24px",
                      }}
                    >
                      +
                    </Button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "16px",
                      border: "1px solid #ccc",
                      borderRadius: "18px",
                    }}
                  >
                    {/* Screen Representation */}
                    {loading ? (
                      <Typography>Loading seats...</Typography>
                    ) : (
                      <>
                        <Typography
                          style={{ fontSize: "24px", fontWeight: 400 }}
                        >
                          SCREEN
                        </Typography>
                        <div
                          style={{
                            width: "80%",
                            minWidth: "400px",
                            height: "4px",
                            textAlign: "center",
                            backgroundColor: "#ccc",
                            borderRadius: "8px",
                            fontSize: "24px",
                            color: "#333",
                            marginBottom: "16px",
                          }}
                        />

                        {/* Seat Map */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(17, 42px)",
                            gridTemplateRows: "repeat(14, 30px)",
                            justifyContent: "center",
                            gap: "8px",
                            margin: "16px 0",
                          }}
                        >
                          {renderSeatGrid()}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              {activeStep === 2 && (
                <div className="w-full max-h-[480px] overflow-y-auto grid grid-cols-4 gap-y-4 z-10 custom-scrollbar">
                  {products.map((product) => (
                    <ProductItem
                      key={product._id}
                      product={product}
                      amount={selectedProducts[product._id] || 0}
                      setAmount={handleSetAmount}
                    />
                  ))}
                </div>
              )}
              {activeStep === 3 && (
                <Box sx={{ width: "100%" }}>
                  {/* Tabs for Existed Account and Guest */}
                  <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    aria-label="Customer Tabs"
                    sx={{ mb: 2 }}
                  >
                    <Tab label="Existed Account" />
                    <Tab label="Guest" />
                  </Tabs>

                  {/* Existed Account Tab */}
                  {selectedTab === 0 && (
                    <Box>
                      {/* Filter Fields */}
                      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <TextField
                          label="Name"
                          variant="outlined"
                          value={filterName}
                          onChange={(e) => setFilterName(e.target.value)}
                          fullWidth
                        />
                        <TextField
                          label="Phone"
                          variant="outlined"
                          value={filterPhone}
                          onChange={(e) => setFilterPhone(e.target.value)}
                          fullWidth
                        />
                      </Box>

                      {/* Customer List */}
                      {/* Customer List */}
                      <List sx={{ maxHeight: "380px", overflowY: "auto" }}>
                        {filteredAccounts.map((account) => (
                          <ListItem
                            key={account._id}
                            disablePadding
                            sx={{ mb: 0.5 }}
                          >
                            <ListItemButton
                              sx={{
                                padding: "4px 8px",
                                borderRadius: "4px",
                              }}
                              onClick={() =>
                                handleAccountSelect(
                                  `${account.full_name} (${account.phone})`
                                )
                              } // Update selected account
                            >
                              <ListItemText
                                primary={`${account.full_name} (${account.phone})`} // Display full name with phone number
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {/* Guest Tab */}
                  {selectedTab === 1 && (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <TextField
                          label="Phone"
                          variant="outlined"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          fullWidth
                        />
                        <TextField
                          label="Email"
                          variant="outlined"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          fullWidth
                        />
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
              {activeStep === 4 && (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    height: "500px",
                    gap: 4,
                  }}
                >
                  {/* Radio Group for Payment Methods */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 400, my: 3 }}>
                      Select Payment Method
                    </Typography>
                    <RadioGroup
                      value={selectedPaymentMethod}
                      onChange={handlePaymentMethodChange}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        pl: 4,
                      }}
                    >
                      <FormControlLabel
                        value="cash"
                        disabled={isPaid}
                        control={<Radio />}
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <img
                              src={CashImg}
                              alt="Cash"
                              style={{ width: "40px", height: "40px" }}
                            />
                            <Typography>Cash</Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="visa"
                        disabled={isPaid}
                        control={<Radio />}
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <img
                              src={VisaImg}
                              alt="Visa/Mastercard"
                              style={{ width: "40px", height: "40px" }}
                            />
                            <Typography>Visa/Mastercard</Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="momo"
                        disabled={isPaid}
                        control={<Radio />}
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <img
                              src={MomoImg}
                              alt="Momo"
                              style={{ width: "40px", height: "40px" }}
                            />
                            <Typography>Momo (E-Wallet)</Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="banking"
                        disabled={isPaid}
                        control={<Radio />}
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <img
                              src={BankingImg}
                              alt="Banking"
                              style={{ width: "40px", height: "40px" }}
                            />
                            <Typography>Banking</Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </Box>
                  {/* Conditional Rendering for Text Fields */}
                  <Box
                    sx={{
                      flex: 2,
                      borderLeft: "1px solid #ccc",
                      pl: 6,
                      py: 2,
                      pr: 2,
                    }}
                  >
                    {selectedPaymentMethod === "cash" && (
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#333",
                          height: "100%",
                          alignItems: "center",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        Please prepare the exact amount in cash to complete the
                        payment.
                      </Typography>
                    )}
                    {selectedPaymentMethod === "visa" && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <TextField
                          label="Card Number"
                          variant="outlined"
                          fullWidth
                        />
                        <TextField
                          label="Cardholder Name"
                          variant="outlined"
                          fullWidth
                        />
                        <TextField
                          label="Expiration Date (MM/YY)"
                          variant="outlined"
                          fullWidth
                        />
                        <TextField label="CVV" variant="outlined" fullWidth />
                      </Box>
                    )}
                    {selectedPaymentMethod === "momo" && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        {/* <img
                          src="https://via.placeholder.com/200" // Replace with actual QR code image
                          alt="Momo QR Code"
                          style={{ width: "200px", height: "200px" }}
                        /> */}
                        <div className="w-[320px] h-[320px] rounded-xl bg-[#dadada] object-cover" />
                        <Typography
                          variant="body1"
                          sx={{ color: "#333", textAlign: "center" }}
                        >
                          Scan the QR code above to complete the payment using
                          Momo.
                        </Typography>
                      </Box>
                    )}

                    {selectedPaymentMethod === "banking" && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        {/* <img
                          src="https://via.placeholder.com/200" // Replace with actual QR code image
                          alt="Momo QR Code"
                          style={{ width: "200px", height: "200px" }}
                        /> */}
                        <div className="w-[320px] h-[320px] rounded-xl bg-[#dadada] object-cover" />
                        <Typography
                          variant="body1"
                          sx={{ color: "#333", textAlign: "center" }}
                        >
                          Scan the QR code above to complete the payment using
                          Banking.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
              {activeStep === 5 && (
                <div>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 500, width: "100%", mt: 10 }}
                  >
                    Ticket has been successfully booked!
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => {}}
                  >
                    Print Ticket
                  </Button>
                </div>
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
