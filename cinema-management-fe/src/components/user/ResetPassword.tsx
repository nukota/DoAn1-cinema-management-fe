import { useState } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
} from "@mui/material";
import wallPaperImg from "../../assets/images/wallpaper.jpg";
import LockResetIcon from "@mui/icons-material/LockReset";

const steps = ["Enter Email", "Verify Code", "Set New Password"];

const ResetPassword: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setEmail("");
    setCode("");
    setNewPassword("");
  };

  const handleSubmit = () => {
    // Handle the final submission logic
    // onClose()
  };

  return (
    <div className="bg-black min-h-screen w-full h-full flex flex-col justify-center relative">
      <img
        className="absolute w-full h-[820px] top-[60px] z-0 opacity-20"
        src={wallPaperImg}
        alt="wallpaper"
      />
      <Box
        sx={{
          width: "60%",
          backgroundColor: "white",
          marginLeft: "14%",
          marginTop: "120px",
          zIndex: 10,
          marginBottom: "60px",
          paddingY: "20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <LockResetIcon
          sx={{
            position: "absolute",
            fontSize: "450px",
            right: -90,
            bottom: -60,
            color: (theme) => theme.palette.primary.main,
            opacity: 0.1,
          }}
        />
        <Stepper activeStep={activeStep} sx={{ paddingInline: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{}}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ width: "60%", mt: 2, px: "36px", minHeight: "340px" }}>
          {activeStep === steps.length ? (
            <Box>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - your password has been reset.
              </Typography>
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                position: "relative",
              }}
            >
              {activeStep === 0 && (
                <Box
                  component="form"
                  sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                >
                  <Typography
                    alignSelf="center"
                    fontSize="18px"
                    marginTop="28px"
                    marginBottom="10px"
                    fontWeight="bold"
                  >
                    RESET YOUR PASSWORD
                  </Typography>
                  <Typography fontSize="14px" fontWeight="bold" marginTop="4px">
                    Enter your email (A verification code will be sent to you).
                  </Typography>
                  <TextField
                    placeholder="Email"
                    name="email"
                    size="small"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Box>
              )}
              {activeStep === 1 && (
                <Box
                  component="form"
                  sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                >
                  <Typography
                    alignSelf="center"
                    fontSize="18px"
                    marginTop="28px"
                    marginBottom="10px"
                    fontWeight="bold"
                  >
                    RESET YOUR PASSWORD
                  </Typography>
                  <Typography fontSize="14px" fontWeight="bold" marginTop="4px">
                    Enter the verification code sent to your email
                  </Typography>
                  <TextField
                    placeholder="Verification Code"
                    name="code"
                    size="small"
                    type="password"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </Box>
              )}
              {activeStep === 2 && (
                <Box
                  component="form"
                  sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                >
                  <Typography
                    alignSelf="center"
                    fontSize="18px"
                    marginTop="28px"
                    marginBottom="10px"
                    fontWeight="bold"
                  >
                    RESET YOUR PASSWORD
                  </Typography>
                  <Typography fontSize="14px" fontWeight="bold" marginTop="4px">
                    Enter your new password (minimum 6 characters)
                  </Typography>
                  <TextField
                    placeholder="Enter your password"
                    size="small"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Typography fontSize="14px" fontWeight="bold" marginTop="4px">
                    Confirm your new password
                  </Typography>
                  <TextField
                    placeholder="Confirm your password"
                    size="small"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  pt: 2,
                  position: "absolute",
                  width: "100%",
                  top: "290px",
                }}
              >
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                {activeStep === steps.length - 1 ? (
                  <Button onClick={handleSubmit}>Finish</Button>
                ) : (
                  <Button onClick={handleNext}>Next</Button>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <div className="w-full bg-black z-20">
      </div>
    </div>
  );
};

export default ResetPassword;
