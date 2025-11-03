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
  Typography,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import VisaImg from "../../assets/images/visa.png";
import MomoImg from "../../assets/images/momo.png";
import BankingImg from "../../assets/images/banking.png";
import VNPayImg from "../../assets/images/vnpay.png";
import { DiscountType, ProductType, SeatType } from "../../interfaces/types";
import { useLocation, useNavigate } from "react-router-dom";
import wallPaperImg from "../../assets/images/wallpaper.jpg";
import { useDiscounts } from "../../providers/DiscountsProvider";
import { useOrders } from "../../providers/OrdersProvider";
import { toast } from "react-toastify";
import { useTimer } from "../../providers/page/TimerProvider";
import { formatTime } from "../../utils/formatUtils";
import qrCodeImg from "../../assets/images/qrCode.jpeg";
import { useMovies } from "../../providers/MoviesProvider";
import { useUsers } from "../../providers/UserProvider";
import VisaForm from "./elements/VisaForm";
import { usePayment } from "../../providers/PaymentProvider";

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
  const { movies } = useMovies();
  const { getCreditByUserId, getLoyaltyPointsByUserId } = useUsers();
  const { createVNPayPayment } = usePayment();
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
  const [userCredit, setUserCredit] = useState<number | null>(null);
  const [userLoyaltyPoints, setUserLoyaltyPoints] = useState<number | null>(null);
  const [isProcessingVNPay, setIsProcessingVNPay] = useState(false);
  const steps = ["Payment Method", "Pay", "Finish"];

  // Movie id for this order
  const selectedMovieId = order?.showtime?.movie_id || null;

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
    const now = new Date();
    const filteredDiscounts = discounts.filter(
      (d) => {
        const isNotExpired = !d.expiry_date || new Date(d.expiry_date) > now;
        const meetsMinPurchase = order.total_price >= d.min_purchase;
        return isNotExpired && meetsMinPurchase;
      }
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

  useEffect(() => {
    const fetchUserData = async () => {
      if (order?.user_id) {
        const credit = await getCreditByUserId(order.user_id);
        const loyaltyPoints = await getLoyaltyPointsByUserId(order.user_id);
        console.log("User credit fetched:", credit);
        console.log("User loyalty points fetched:", loyaltyPoints);
        setUserCredit(credit);
        setUserLoyaltyPoints(loyaltyPoints);
      } else {
        setUserCredit(null);
        setUserLoyaltyPoints(null);
      }
    };
    fetchUserData();
  }, [order?.user_id, getCreditByUserId, getLoyaltyPointsByUserId]);

  useEffect(() => {
    const processVNPayPayment = async () => {
      if (activeStep === 1 && paymentMethod === "vnpay" && !isProcessingVNPay) {
        setIsProcessingVNPay(true);
        
        const data = {
          total_price: discountedPrice,
          user_id: order.user_id,
          email: order.email,
          payment_method: "banking",
          discount_id: discount ? discount._id : null,
          amount: discountedPrice,
          status: "pending",
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
          // Create order first and get the real order ID from response headers
          const { orderId } = await createDetailedOrder(data);

          // Store order ID in sessionStorage before redirecting to VNPay
          sessionStorage.setItem('vnpay_order_id', orderId);

          // Create VNPay payment with the real order ID
          const vnpayResponse = await createVNPayPayment({
            order_id: orderId,
            amount: Math.round(discountedPrice),
            bankCode: "VNPAY",
          });

          stopTimer();

          // Redirect to VNPay payment page
          if (vnpayResponse.vnpUrl) {
            window.location.href = vnpayResponse.vnpUrl;
          } else {
            throw new Error("VNPay URL not found in response");
          }
        } catch (error) {
          setIsProcessingVNPay(false);
          toast.error(
            `Failed to process VNPay payment: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
          // Go back to previous step on error
          setActiveStep(0);
        }
      }
    };

    processVNPayPayment();
  }, [activeStep, paymentMethod, isProcessingVNPay]);

  const handleNext = async () => {
    if (activeStep === 1) {
      const data = {
        total_price: discountedPrice,
        user_id: order.user_id,
        email: order.email,
        payment_method: paymentMethod === "vnpay" ? "banking" : paymentMethod,
        discount_id: discount ? discount._id : null,
        amount: discountedPrice,
        status: "pending",
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Select a Payment Method
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  color: userCredit === null ? "text.disabled" : "text.primary",
                }}
              >
                Credit: {userCredit !== null ? userCredit : "-"}
              </Typography>
            </Box>
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
                  {availableDiscounts.map((d) => {
                    const movie = movies.find((m) => m._id === d.movie_id);
                    
                    // Check if user can use this discount based on rank requirement
                    const canUseRankDiscount = () => {
                      if (!d.rank) return true; // No rank requirement
                      if (userLoyaltyPoints === null) return false; // User has no loyalty points
                      
                      // Define loyalty point thresholds for each rank
                      const rankThresholds = {
                        Bronze: 0,
                        Silver: 100,
                        Gold: 500,
                      };
                      
                      return userLoyaltyPoints >= rankThresholds[d.rank];
                    };
                    
                    // Ensure disabled is always boolean
                    const disabled = Boolean(
                      (d.movie_id && d.movie_id !== selectedMovieId) ||
                      !canUseRankDiscount()
                    );
                    
                    return (
                      <MenuItem key={d._id} value={d._id} disabled={disabled}>
                        <Box display="flex" flexDirection="column">
                          <Typography variant="body1">{d.code}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {movie ? movie.title : ""}
                            {d.rank ? ` | Rank: ${d.rank} ${!canUseRankDiscount() ? "(Insufficient loyalty points)" : ""}` : ""}
                            {d.discount_type === "percentage"
                              ? ` | Value: ${d.value}% off`
                              : ` | Value: -${d.value.toLocaleString()} vnd`}
                            {(() => {
                              let reduced = 0;
                              if (d.discount_type === "percentage") {
                                reduced = (order.total_price * d.value) / 100;
                              } else if (d.discount_type === "fixed") {
                                reduced = d.value;
                              }
                              // Don't show negative reduction
                              reduced = Math.min(reduced, order.total_price);
                              return ` | Save: -${reduced.toLocaleString()} vnd`;
                            })()}
                          </Typography>
                        </Box>
                      </MenuItem>
                    );
                  })}
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
                { label: "VNPAY", img: VNPayImg, value: "vnpay" },
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
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 500,
                      textAlign: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      px: 1,
                      maxWidth: "100%"
                    }}
                  >
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
            {paymentMethod === "vnpay" && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  You will be redirected to VNPAY payment page, please finish
                  the rest of the payment process there...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please wait while we prepare your payment...
                </Typography>
              </Box>
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
        className="absolute w-full h-full top-0 z-0 opacity-15"
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
            disabled={activeStep === 0 || (activeStep === 1 && paymentMethod === "vnpay")}
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
                (activeStep === 1 && paymentMethod === "vnpay") ||
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
