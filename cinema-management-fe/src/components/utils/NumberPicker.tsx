import React from "react";
import { Box, Button, Typography } from "@mui/material";

interface NumberPickerProps {
  value: number;
  onChange: (value: number) => void;
  theme?: "light" | "dark";
}
const NumberPicker: React.FC<NumberPickerProps> = ({
  value,
  onChange,
  theme = "dark",
}) => {
  const isDarkMode = theme === "dark";
  const handleIncrement = () => {
    onChange(value + 1);
  };
  const handleDecrement = () => {
    onChange(value - 1);
  };
  return (
    <Box
      sx={{
        width: "104px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        backgroundColor: isDarkMode ? "#222" : "#f0f0f0",
        borderRadius: 2,
      }}
    >
      <Button
        onClick={handleDecrement}
        sx={{
          minWidth: 32,
          height: 32,
          borderRadius: "2px 0 0 2px",
          fontSize: 30,
          pt: 0.25,
          fontWeight: "medium",
          borderRight: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
          color: isDarkMode ? "gray" : "#333",
        }}
      >
        -
      </Button>
      <Typography
        sx={{
          width: 40,
          height: 32,
          textAlign: "center",
          fontWeight: "medium",
          fontSize: 18,
          pt: 0.25,
          color: isDarkMode ? "white" : "#000",
          zIndex: 30,
        }}
      >
        {value}
      </Typography>
      <Button
        onClick={handleIncrement}
        sx={{
          minWidth: 32,
          height: 32,
          borderRadius: "0 2px 2px 0",
          backgroundColor: "transparent",
          fontSize: 24,
          pt: 0.25,
          fontWeight: "medium",
          borderLeft: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
          color: isDarkMode ? "gray" : "#333",
        }}
      >
        +
      </Button>
    </Box>
  );
};

export default NumberPicker;
