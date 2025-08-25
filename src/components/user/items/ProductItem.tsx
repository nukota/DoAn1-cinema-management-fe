import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { ProductType } from "../../../interfaces/types";
import NumberPicker from "../../shared/NumberPicker";

interface ProductItemProps {
  product: ProductType;
  amount: number;
  setAmount: (product: ProductType, newAmount: number) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, amount, setAmount }) => {
  const theme = useTheme();
  const [currentAmount, setCurrentAmount] = useState<number>(amount);

  useEffect(() => {
    setCurrentAmount(amount);
  }, [amount]);

  const handleAmountChange = (newAmount: number) => {
    setCurrentAmount(newAmount);
    setAmount(product, newAmount);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "260px",
        height: "140px",
      }}
    >
      <Box
        sx={{
          width: "120px",
          height: "100%",
          borderRadius: 3,
          border: `2px solid ${theme.palette.primary.main}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={product.image}
          alt={product.name}
          sx={{ maxWidth: "100px", maxHeight: "100px" }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          ml: 1.5,
          position: "relative",
        }}
      >
        <Typography
          sx={{
            fontWeight: "medium",
            fontSize: 17,
            color: "white",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.name}
        </Typography>
        <Typography variant="body1" sx={{ color: "gray" }}>
          {product.price}
        </Typography>
        <Box sx={{ position: "absolute", bottom: 11, width: "100%" }}>
          <NumberPicker
            value={currentAmount}
            onChange={(value) => {
              const newAmount = Math.max(value, 0);
              handleAmountChange(newAmount);
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProductItem;