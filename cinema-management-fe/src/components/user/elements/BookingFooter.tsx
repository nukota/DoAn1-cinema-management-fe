import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { MovieType, ProductType } from "../../../interfaces/types";

interface BookingFooterProps {
  movie: MovieType;
  selectedProducts: {
    product: ProductType;
    amount: number;
  }[];
}

const BookingFooter: React.FC<BookingFooterProps> = ({
  movie,
  selectedProducts,
}) => {
  const theme = useTheme();
  const [isAboveFooter, setIsAboveFooter] = React.useState(false);
  const productText = selectedProducts
    .filter((product) => product.amount > 0)
    .map((product) => `${product.amount} ${product.product.name}`)
    .join(", ");

  const handleBuyTicketClick = () => {
    console.log("Navigating to payment...");
  };

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer"); // Select the Footer element
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if the footer is visible in the viewport
        if (footerRect.top <= windowHeight) {
          setIsAboveFooter(true); // Move BookingFooter above the Footer
        } else {
          setIsAboveFooter(false); // Keep BookingFooter fixed at the bottom
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      sx={{
        zIndex: 100,
        width: "100vw",
        height: "110px",
        background: "black",
        borderTop: "3px solid #222",
        position: isAboveFooter ? "" : "fixed", // Change position dynamically
        bottom: isAboveFooter ? "" : 0, // Fixed at bottom unless above Footer
        top: isAboveFooter ? "" : "unset", // Adjust top when above Footer
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
        <Typography
          variant="body1"
          sx={{
            color: "lightgray",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {productText}
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
            5:00
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
            200 dollars
          </Typography>
        </Box>
        {/* Buy Ticket Button */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleBuyTicketClick}
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
  );
};

export default BookingFooter;
