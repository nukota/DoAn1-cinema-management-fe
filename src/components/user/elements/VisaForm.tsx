import React, { useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";

interface VisaFormProps {
  onValidChange: (valid: boolean) => void;
  onInfoChange: (info: {
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvc: string;
  }) => void;
}

const VisaForm: React.FC<VisaFormProps> = ({ onValidChange, onInfoChange }) => {
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
  }, [
    cardNumber,
    cardName,
    expiry,
    cvc,
    valid,
    onValidChange,
    onInfoChange,
    allFieldsFilled,
  ]);

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

export default VisaForm;
