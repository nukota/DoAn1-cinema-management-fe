import React from "react";
import {
  Box,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
} from "@mui/material";
import VisaImg from "../../../../assets/images/visa.png";
import MomoImg from "../../../../assets/images/momo.png";
import CashImg from "../../../../assets/images/cash.png";
import BankingImg from "../../../../assets/images/banking.png";
import qrCodeImg from "../../../../assets/images/qrCode.jpeg";

interface PaymentProps {
  selectedPaymentMethod: string;
  isPaid: boolean;
  onPaymentMethodChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Payment: React.FC<PaymentProps> = ({
  selectedPaymentMethod,
  isPaid,
  onPaymentMethodChange,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        height: "500px",
        gap: 4,
      }}
    >
      {/* Radio Group for Payment Methods */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 400, my: 3 }}>
          Select Payment Method
        </Typography>
        <RadioGroup
          value={selectedPaymentMethod}
          onChange={onPaymentMethodChange}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pl: 4,
          }}
        >
          <FormControlLabel
            value="cash"
            disabled={isPaid}
            control={<Radio />}
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <img
                  src={CashImg}
                  alt="Cash"
                  style={{ width: "40px", height: "40px" }}
                />
                <Typography>Cash</Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="visa/mastercard"
            disabled={isPaid}
            control={<Radio />}
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <img
                  src={VisaImg}
                  alt="Visa/Mastercard"
                  style={{ width: "40px", height: "40px" }}
                />
                <Typography>Visa/Mastercard</Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="momo"
            disabled={isPaid}
            control={<Radio />}
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <img
                  src={MomoImg}
                  alt="Momo"
                  style={{ width: "40px", height: "40px" }}
                />
                <Typography>Momo (E-Wallet)</Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="banking"
            disabled={isPaid}
            control={<Radio />}
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <img
                  src={BankingImg}
                  alt="Banking"
                  style={{ width: "40px", height: "40px" }}
                />
                <Typography>Banking</Typography>
              </Box>
            }
          />
        </RadioGroup>
      </Box>
      {/* Conditional Rendering for Text Fields */}
      <Box
        sx={{
          flex: 2,
          borderLeft: "1px solid #ccc",
          pl: 6,
          py: 2,
          pr: 2,
        }}
      >
        {selectedPaymentMethod === "cash" && (
          <Typography
            variant="body1"
            sx={{
              color: "#333",
              height: "100%",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Please prepare the exact amount in cash to complete the payment.
          </Typography>
        )}
        {selectedPaymentMethod === "visa/mastercard" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField label="Card Number" variant="outlined" fullWidth />
            <TextField label="Cardholder Name" variant="outlined" fullWidth />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="CVV"
                variant="outlined"
                fullWidth
                sx={{ flex: 1 }}
                inputProps={{
                  maxLength: 4,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
              <TextField
                label="Expiry Date (MM/YY)"
                variant="outlined"
                sx={{ width: 120 }}
                inputProps={{
                  maxLength: 5,
                  inputMode: "numeric",
                  pattern: "(0[1-9]|1[0-2])\\/([0-9]{2})",
                  placeholder: "MM/YY",
                }}
              />
            </Box>
          </Box>
        )}
        {selectedPaymentMethod === "momo" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <div className="w-[320px] h-[320px] rounded-xl bg-[#dadada] object-cover flex items-center justify-center">
              <img
                src={qrCodeImg}
                alt="Momo QR Code"
                style={{
                  width: "260px",
                  height: "260px",
                  objectFit: "contain",
                  borderRadius: "12px",
                }}
              />
            </div>

            {/* Mock payment details */}
            <Box sx={{ mt: 1, width: "100%", maxWidth: 320 }}>
              <Typography variant="body1" sx={{ color: "#333" }}>
                Receiver: <b>MTM CINEMA</b>
              </Typography>
              <Typography variant="body1" sx={{ color: "#333" }}>
                Account Number: <b>0909090909</b>
              </Typography>
              <Typography variant="body1" sx={{ color: "#333" }}>
                E-Wallet: <b>Momo</b>
              </Typography>
              <Typography variant="body1" sx={{ color: "#333" }}>
                Message: <b>CM-MOMO-TICKET-123456</b>
              </Typography>
              <Typography variant="body1" sx={{ color: "#333" }}>
                Amount: <b>200,000 VND</b>
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ color: "#999", textAlign: "center" }}
            >
              Scan the QR code above to complete the payment using Momo.
            </Typography>
          </Box>
        )}

        {selectedPaymentMethod === "banking" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <div className="w-[320px] h-[320px] rounded-xl bg-[#dadada] object-cover flex items-center justify-center">
              <img
                src={qrCodeImg}
                alt="Banking QR Code"
                style={{
                  width: "260px",
                  height: "260px",
                  objectFit: "contain",
                  borderRadius: "12px",
                }}
              />
            </div>

            {/* Mock payment details */}
            <Box sx={{ mt: 1, width: "100%", maxWidth: 320 }}>
              <Typography variant="body1" sx={{ color: "#333" }}>
                Receiver: <b>MTM CINEMA</b>
              </Typography>
              <Typography variant="body1" sx={{ color: "#333" }}>
                Account Number: <b>222233334444</b>
              </Typography>
              <Typography variant="body1" sx={{ color: "#333" }}>
                Bank: <b>Vietcombank</b>
              </Typography>
              <Typography variant="body1" sx={{ color: "#333" }}>
                Message: <b>CM-BANK-TICKET-654321</b>
              </Typography>
              <Typography variant="body1" sx={{ color: "#333" }}>
                Amount: <b>200,000 VND</b>
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ color: "#999", textAlign: "center" }}
            >
              Scan the QR code above to complete the payment using Internet
              Banking.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Payment;
