import React from "react"
import { Box, Button, Typography } from "@mui/material"

interface NumberPickerProps {
  value: number
  onChange: (value: number) => void
}
const NumberPicker: React.FC<NumberPickerProps> = ({ value, onChange }) => {
  const handleIncrement = () => {
    onChange(value + 1)
  }
  const handleDecrement = () => {
    onChange(value - 1)
  }
  return (
    <Box
      sx={{
        width: "104px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#222",
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
          borderRight: "1px solid #444",
          color: "gray",
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
          color: "white",
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
          borderLeft: "1px solid #444",
          color: "gray",
        }}
      >
        +
      </Button>
    </Box>
  )
}

export default NumberPicker