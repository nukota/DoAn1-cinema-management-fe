import React from "react"
import { Box, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { ProductType } from "../../../types"

interface BookingFooterProps {
  movie: {
    name: string
  }
  selectedProducts: {
    product: ProductType
    amount: number
  }[]
}

const BookingFooter: React.FC<BookingFooterProps> = ({ movie, selectedProducts }) => {
  const theme = useTheme()
  const productText = selectedProducts
    .filter((product) => product.amount > 0)
    .map((product) => `${product.amount} ${product.product.name}`)
    .join(", ")

  return (
    <Box
      sx={{
        zIndex: 100,
        width: "100vw",
        height: "110px",
        background: "black",
        borderTop: "3px solid #222",
        bottom: 0,
        left: 0,
        position: "fixed",
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
          {movie.name}
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
            Ticket holding time
          </Typography>
          <Typography
            sx={{ color: "black", fontSize: 30, fontWeight: 700, pl: 1 }}
          >
            10:00
          </Typography>
        </Box>
        <Box
          sx={{
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
            sx={{ color: "white", fontSize: 26, fontWeight: 500, mt: 1 }}
          >
            200 dollars
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default BookingFooter