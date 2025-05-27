import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  MovieType,
  OrderType,
  ProductType,
  SeatType,
  ShowtimeType,
} from "../../../interfaces/types";
import { useNavigate } from "react-router-dom";
import { useTimer } from "../../../providers/page/TimerProvider";

interface BookingFooterProps {
  movie: MovieType;
  totalPrice: number;
  selectedProducts: {
    product: ProductType;
    amount: number;
  }[];
  selectedShowtime: ShowtimeType | null;
  selectedSeats: SeatType[];
}

const BookingFooter: React.FC<BookingFooterProps> = ({
  movie,
  totalPrice,
  selectedProducts,
  selectedShowtime,
  selectedSeats,
}) => {
  const { timeLeft } = useTimer();
  const theme = useTheme();
  const [isAboveFooter, setIsAboveFooter] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAboveFooter(entry.isIntersecting);
      },
      { root: null, threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  const handleBuyTicket = () => {
    const userId = localStorage.getItem("user_id");
    const email = localStorage.getItem("email");

    if (!userId || !email) {
      alert("User is not logged in.");
      return;
    }
    const order: any = {
      user_id: userId,
      email: email,
      total_price: totalPrice,
      showtime: selectedShowtime,
      products: selectedProducts,
      seats: selectedSeats
    };
    navigate("/user/payment", { state: { order } });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <>
      {/* Main Footer (for Intersection Observer) */}
      <div
        ref={footerRef}
        style={{ height: "1px", background: "transparent" }}
      />

      {/* Booking Footer */}
      <Box
        sx={{
          zIndex: 100,
          width: "100vw",
          height: "110px",
          background: "black",
          borderTop: "3px solid #222",
          position: isAboveFooter ? "relative" : "fixed", // Change position dynamically
          bottom: isAboveFooter ? "unset" : 0, // Fixed at bottom unless above Footer
          top: isAboveFooter ? "unset" : "auto",
          paddingY: 1,
          paddingX: "10%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "64%",
          }}
        >
          <Typography sx={{ color: "white", fontSize: 22, fontWeight: 500 }}>
            {movie.title}
          </Typography>
          {selectedShowtime && (
            <Typography
              variant="body2"
              sx={{ color: "gray", fontSize: 16, mt: 0.5 }}
            >
              {new Date(selectedShowtime.showtime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          )}
          <Typography
            variant="body1"
            sx={{
              color: "lightgray",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              mt: 1,
            }}
          >
            {selectedProducts
              .filter((product) => product.amount > 0)
              .map((product) => `${product.amount} ${product.product.name}`)
              .join(", ")}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "36%",
          }}
        >
          <Box
            sx={{
              width: "150px",
              height: "76px",
              borderRadius: "10px",
              backgroundColor: theme.palette.secondary.main,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 1,
            }}
          >
            <Typography
              sx={{
                color: "black",
                width: "100%",
                textAlign: "center",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.06em",
              }}
              variant="body1"
            >
              Ticket hold time
            </Typography>
            <Typography
              sx={{ color: "black", fontSize: 30, fontWeight: 700, pl: 1 }}
            >
              {timeLeft !== null ? formatTime(timeLeft) : "00:00"}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "150px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              ml: 4,
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: "0.06em",
              }}
              variant="body1"
            >
              Total price
            </Typography>
            <Typography
              sx={{ color: "#999", fontSize: 18, fontWeight: 500, mt: 1 }}
            >
              {totalPrice} vnd
            </Typography>
          </Box>
          {/* Buy Ticket Button */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleBuyTicket}
            sx={{
              ml: 4,
              height: "50px",
              alignSelf: "center",
              fontWeight: 600,
              fontSize: "16px",
            }}
          >
            Buy Ticket
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default BookingFooter;
