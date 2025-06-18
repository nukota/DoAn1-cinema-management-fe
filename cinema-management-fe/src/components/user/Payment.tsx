import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import VisaImg from "../../assets/images/visa.png";
import MomoImg from "../../assets/images/momo.png";
import BankingImg from "../../assets/images/banking.png";
import { DiscountType, ProductType, SeatType } from "../../interfaces/types";
import { useLocation, useNavigate } from "react-router-dom";
import wallPaperImg from "../../assets/images/wallpaper.jpg";
import { useDiscounts } from "../../providers/DiscountsProvider";
import { useOrders } from "../../providers/OrdersProvider";
import { toast } from "react-toastify";
import { useTimer } from "../../providers/page/TimerProvider";
import { formatTime } from "../../utils/formatUtils";
import qrCodeImg from "../../assets/images/qrCode.jpeg";

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { timeLeft, stopTimer } = useTimer();
  const { order } = location.state as { order: any };
  const [activeStep, setActiveStep] = useState(0);
  const {
    discounts,
    fetchDiscountsData,
    loading: discountsLoading,
  } = useDiscounts();
  const { createDetailedOrder } = useOrders();
  const [availableDiscounts, setAvailableDiscounts] = useState<DiscountType[]>(
    []
  );
  const [discount, setDiscount] = useState<DiscountType | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [visaFormValid, setVisaFormValid] = useState(false);
  const [visaFormInfo, setVisaFormInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  });
  const steps = ["Payment Method", "Pay", "Finish"];

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        await fetchDiscountsData();
      } catch (error) {
        console.error("Failed to fetch discounts:", error);
      }
    };

    fetchDiscounts();
  }, []);

  useEffect(() => {
    const filteredDiscounts = discounts.filter(
      (d) => order.total_price >= d.min_purchase
    );
    setAvailableDiscounts(filteredDiscounts);
  }, [discounts, order.total_price]);

  useEffect(() => {
    if (timeLeft === 0) {
      toast.error("Reservation time expired. Redirecting to home...");
      stopTimer();
      navigate("/");
    }
  }, [timeLeft, stopTimer, navigate]);

  const handleNext = async () => {
    if (activeStep === 1) {
      const data = {
        total_price: discountedPrice,
        user_id: order.user_id,
        email: order.email,
        payment_method: paymentMethod,
        discount_id: discount ? discount._id : null,
        amount: discountedPrice,
        products: order.products.map((p: any) => ({
          product_id: p.product._id,
          quantity: p.amount,
        })),
        tickets: {
          showtime_id: order.showtime._id,
          price: order.showtime.price,
          seats: order.seats.map((seat: any) => ({
            seat_id: seat._id,
          })),
        },
      };
      try {
        setActiveStep((prevStep) => prevStep + 1);
        await createDetailedOrder(data);
        stopTimer();
      } catch (error) {
        toast.error(
          `Failed to create order: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleDiscountChange = (event: SelectChangeEvent<string>) => {
    const selectedDiscount = availableDiscounts.find(
      (d) => d._id === event.target.value
    );
    setDiscount(selectedDiscount || null);
  };

  const discountedPrice = React.useMemo(() => {
    if (!discount) return order.total_price;

    if (discount.discount_type === "percentage") {
      const discountAmount = (order.total_price * discount.value) / 100;
      return order.total_price - discountAmount;
    } else if (discount.discount_type === "fixed") {
      return order.total_price - discount.value;
    }

    return order.total_price;
  }, [order.total_price, discount]);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Select a Payment Method
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>
                  {availableDiscounts.length === 0
                    ? "No discounts available"
                    : "Discount"}
                </InputLabel>
                <Select
                  value={discount?._id || ""}
                  label={
                    availableDiscounts.length === 0
                      ? "No discounts available"
                      : "Discount"
                  }
                  onChange={handleDiscountChange}
                  disabled={discountsLoading || availableDiscounts.length === 0}
                >
                  {availableDiscounts.map((d) => (
                    <MenuItem key={d._id} value={d._id}>
                      {d.code} -{" "}
                      {d.discount_type === "percentage"
                        ? `${d.value}%`
                        : `${d.value} vnd`}{" "}
                      (Min Purchase: {d.min_purchase} vnd)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {discount && (
                <ThumbUpIcon
                  color="primary"
                  sx={{ ml: 2, mb: 2, fontSize: 36, alignSelf: "center" }}
                />
              )}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 2 }}>
              {[
                { label: "Momo", img: MomoImg, value: "momo" },
                { label: "Banking", img: BankingImg, value: "banking" },
                {
                  label: "Visa/Mastercard",
                  img: VisaImg,
                  value: "visa/mastercard",
                },
              ].map((method) => (
                <Card
                  key={method.value}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    borderRadius: 2,
                    boxShadow: 1,
                    border:
                      paymentMethod === method.value
                        ? "2px solid #1976d2"
                        : "1px solid #e0e0e0",
                    background:
                      paymentMethod === method.value ? "#e3f2fd" : "#fafafa",
                    transition: "border 0.2s, background 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 120,
                    cursor: "pointer",
                  }}
                  onClick={() => setPaymentMethod(method.value)}
                >
                  <img
                    src={method.img}
                    alt={method.label}
                    style={{ width: 40, height: 40, marginBottom: 12 }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {method.label}
                  </Typography>
                </Card>
              ))}
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {paymentMethod === "momo" && (
              <>
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    backgroundColor: "#f0f0f0",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                    mb: 2,
                  }}
                >
                  <img
                    src={qrCodeImg}
                    alt="Momo QR"
                    style={{ width: 180, height: 180 }}
                  />
                </Box>
                <Typography sx={{ fontWeight: 500 }}>
                  Receiver: MTM CINEMA
                </Typography>
                <Typography>Account Number: 0909090909</Typography>
                <Typography>E-Wallet: Momo</Typography>
                <Typography>
                  Message: CM-MOMO-TICKET-{order.ordercode || "123456"}
                </Typography>
              </>
            )}
            {paymentMethod === "banking" && (
              <>
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    backgroundColor: "#f0f0f0",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                    mb: 2,
                  }}
                >
                  <img
                    src={qrCodeImg}
                    alt="Banking QR"
                    style={{ width: 180, height: 180 }}
                  />
                </Box>
                <Typography sx={{ fontWeight: 500 }}>
                  Receiver: MTM CINEMA
                </Typography>
                <Typography>Account Number: 0909090909</Typography>
                <Typography>Bank: Vietcombank</Typography>
                <Typography>
                  Message: CM-BANKING-TICKET-{order.ordercode || "123456"}
                </Typography>
              </>
            )}
            {paymentMethod === "visa/mastercard" && (
              <VisaForm
                onValidChange={setVisaFormValid}
                onInfoChange={setVisaFormInfo}
              />
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
              Thank You!
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              Your payment was successful. Enjoy your movie!
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              Please check your email to see the order details.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#000",
        position: "relative",
      }}
    >
      <img
        className="absolute w-full h-full top-0 z-0 opacity-10"
        src={wallPaperImg}
      />
      {/* Left Section: Stepper */}
      <Box
        sx={{
          flex: 1,
          maxWidth: 600,
          height: 500,
          padding: 4,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          marginRight: 2,
          zIndex: 10,
          position: "relative",
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 4 }}>{renderStepContent(activeStep)}</Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            position: "absolute",
            bottom: 16,
            left: 16,
            right: 16,
          }}
        >
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" onClick={() => navigate("/")}>
              Go to Home
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={
                (activeStep === 0 && !paymentMethod) ||
                (activeStep === 1 &&
                  paymentMethod === "visa/mastercard" &&
                  !visaFormValid)
              }
            >
              Next
            </Button>
          )}
        </Box>
      </Box>

      {/* Right Section: Order Information */}
      <Box
        sx={{
          flex: 1,
          maxWidth: 400,
          padding: 3,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "medium" }}>
            Order Information
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#b71c1c", fontWeight: 500 }}
          >
            {timeLeft === null
              ? "Loading..."
              : timeLeft > 0
              ? `Time left: ${Math.floor(timeLeft / 60)
                  .toString()
                  .padStart(2, "0")}:${(timeLeft % 60)
                  .toString()
                  .padStart(2, "0")}`
              : "Expired"}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 0.5 }}>
          Movie:{" "}
          <span className="text-[#999]">{order.showtime.movie.title}</span>
        </Typography>
        <Typography variant="body1" sx={{ mb: 0.5 }}>
          Showtime:{" "}
          <span className="text-[#999]">
            {formatTime(order.showtime.showtime)}
          </span>
        </Typography>
        <Typography variant="body1" sx={{ mb: 0.5 }}>
          Seats:{" "}
          <span className="text-[#999]">
            {order.seats.length} x {order.showtime.price.toFixed(0)} vnd
          </span>
        </Typography>
        <Typography
          variant="body2"
          sx={{
            ml: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          - {order.seats.map((seat: SeatType) => seat.seat_name).join(", ")}
        </Typography>
        <Typography variant="body1" sx={{ mb: 0.5, mt: 2 }}>
          Products:
        </Typography>
        {order.products.map(
          (product: { product: ProductType; amount: number }) => (
            <Typography
              key={product.product._id}
              variant="body2"
              sx={{ ml: 2 }}
            >
              <span className="text-[#999]">
                - {product.product.name} x {product.amount}
              </span>
            </Typography>
          )
        )}
        <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1">Total Price:</Typography>
            <Typography variant="body1" color="#999">
              {order.total_price.toFixed(0)} vnd
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1">Discount:</Typography>
            <Typography variant="body1" color="#999">
              -{" "}
              {discount
                ? (order.total_price - discountedPrice).toFixed(0)
                : "0"}{" "}
              vnd
            </Typography>
          </Box>
          <Divider sx={{ my: 0.5 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Final Price:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {discountedPrice.toFixed(0)} vnd
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Payment;

// Add VisaForm component above Payment
const VisaForm = ({
  onValidChange,
  onInfoChange,
}: {
  onValidChange: (valid: boolean) => void;
  onInfoChange: (info: any) => void;
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [showValidation, setShowValidation] = useState(false);

  // Simple expiry validation: MM/YY and not expired
  const isExpiryValid = (exp: string) => {
    if (!/^\d{2}\/\d{2}$/.test(exp)) return false;
    const [mm, yy] = exp.split("/").map(Number);
    if (mm < 1 || mm > 12) return false;
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    return yy > currentYear || (yy === currentYear && mm >= currentMonth);
  };

  const valid =
    cardNumber.length === 16 &&
    cardName.trim().length > 0 &&
    isExpiryValid(expiry) &&
    cvc.length === 3;

  // Show validation message when all fields are filled (not required all digits)
  const allFieldsFilled =
    cardNumber.length > 0 &&
    cardName.trim().length > 0 &&
    expiry.trim().length > 0 &&
    cvc.length > 0;

  useEffect(() => {
    onValidChange(valid);
    onInfoChange({ cardNumber, cardName, expiry, cvc });
    setShowValidation(allFieldsFilled);
  }, [cardNumber, cardName, expiry, cvc, valid, onValidChange, onInfoChange, allFieldsFilled]);

  return (
    <Box
      sx={{
        width: 320,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 2,
      }}
    >
      <TextField
        label="Card Number (16 digits)"
        value={cardNumber}
        onChange={(e) =>
          setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))
        }
        inputProps={{ maxLength: 16 }}
        fullWidth
      />
      <TextField
        label="Cardholder Name"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        fullWidth
      />
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Expiry (MM/YY)"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          fullWidth
        />
        <TextField
          label="CVC"
          value={cvc}
          onChange={(e) =>
            setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))
          }
          inputProps={{ maxLength: 3 }}
          fullWidth
        />
      </Box>
      {showValidation && (
        <Typography
          variant="body2"
          sx={{ color: valid ? "green" : "red", mt: 1, textAlign: "center" }}
        >
          {valid
            ? "Card information is valid."
            : "Card information is invalid."}
        </Typography>
      )}
    </Box>
  );
};
