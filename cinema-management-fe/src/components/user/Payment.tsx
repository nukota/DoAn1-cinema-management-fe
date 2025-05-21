import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
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
import { DiscountType, ProductType, SeatType } from "../../interfaces/types";
import { useDiscounts } from "../../providers/DiscountsProvider";
import { useLocation } from "react-router-dom";
import wallPaperImg from "../../assets/images/wallpaper.jpg";

const Payment: React.FC = () => {
  const location = useLocation();
  const { order } = location.state as { order: any };

  const [activeStep, setActiveStep] = useState(0);
  const {
    discounts,
    fetchDiscountsData,
    loading: discountsLoading,
  } = useDiscounts();
  const [availableDiscounts, setAvailableDiscounts] = useState<DiscountType[]>(
    []
  );
  const [discount, setDiscount] = useState<DiscountType | null>(null);
  const steps = ["Select Payment Method", "Scan QR Code", "Finish"];

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

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
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
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Discount</InputLabel>
              <Select
                value={discount?._id || ""}
                onChange={handleDiscountChange}
                disabled={discountsLoading || availableDiscounts.length === 0}
              >
                {availableDiscounts.map((d) => (
                  <MenuItem key={d._id} value={d._id}>
                    {d.code} -{" "}
                    {d.discount_type === "percentage"
                      ? `${d.value}%`
                      : `$${d.value}`}{" "}
                    (Min Purchase: ${d.min_purchase})
                  </MenuItem>
                ))}
                {availableDiscounts.length === 0 && (
                  <MenuItem disabled>No discounts available</MenuItem>
                )}
              </Select>
            </FormControl>
            <Button variant="outlined" sx={{ mb: 2, width: "100%" }}>
              Momo
            </Button>
            <Button variant="outlined" sx={{ mb: 2, width: "100%" }}>
              Banking
            </Button>
            <Button variant="outlined" sx={{ mb: 2, width: "100%" }}>
              Visa/Mastercard
            </Button>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Scan the QR Code
            </Typography>
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
              }}
            >
              <Typography>QR Code</Typography>
            </Box>
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
          </Box>
        );
      default:
        return null;
    }
  };

  console.log("Order:", order);
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
          padding: 4,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          marginRight: 2,
          zIndex: 10,
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
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={activeStep === steps.length - 1}
          >
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
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
        <Typography variant="h5" sx={{ mb: 2 }}>
          Order Information
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Movie: {order.showtime.movie.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Showtime: {order.showtime.showtime}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Seats: {order.seats.length} x {order.showtime.price.toFixed(0)} vnd
        </Typography>
        <Typography variant="body2" sx={{ ml: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          - {order.seats.map((seat: SeatType) => seat.seat_name).join(", ")}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, mt: 2 }}>
          Products:
        </Typography>
        {order.products.map(
          (product: { product: ProductType; amount: number }) => (
            <Typography key={product.product._id} variant="body2" sx={{ ml: 2 }}>
              - {product.product.name} x {product.amount}
            </Typography>
          )
        )}
        <Typography variant="body1" sx={{ mb: 1 }}>
          Total Price: {order.total_price.toFixed(0)} vnd
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Discount: -{" "}
          {discount ? (order.total_price - discountedPrice).toFixed(0) : "0"}{" "}
          vnd
        </Typography>
        <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
          Final Price: {discountedPrice.toFixed(0)} vnd
        </Typography>
      </Box>
    </Box>
  );
};

export default Payment;
