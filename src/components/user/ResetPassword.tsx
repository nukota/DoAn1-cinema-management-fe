import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import wallPaperImg from "../../assets/images/wallpaper.jpg";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useAuth } from "../../providers/AuthProvider";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const steps = ["Enter Email", "Verify Code", "Set New Password"];

const ResetPassword: React.FC = () => {
  const { sendEmail, resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
      setActiveStep(2);
    }
  }, [searchParams]);

  // Step 1: Enter email to send reset link
  const handleSendEmail = async () => {
    setLoading(true);
    try {
      await sendEmail(email);
      toast.success("Reset email sent! Please check your inbox.");
      setActiveStep(1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send email."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Enter new password and reset
  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      toast.success("Password reset successfully!");
      setActiveStep(3);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
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
                    Enter your email (A verification email will be sent to you).
                  </Typography>
                  <TextField
                    placeholder="Email"
                    name="email"
                    size="small"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
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
                  <Typography
                    fontSize="16px"
                    fontWeight="medium"
                    marginTop="4px"
                  >
                    A verification email has been sent. Please check your inbox.
                  </Typography>
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
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Typography fontSize="14px" fontWeight="bold" marginTop="4px">
                    Confirm your new password
                  </Typography>
                  <TextField
                    placeholder="Confirm your password"
                    size="small"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              )}
              <Box
                sx={{
                  pt: 2,
                  position: "absolute",
                  width: "100%",
                  top: "290px",
                }}
              >
                <Box sx={{ flex: "1 1 auto" }} />
                {activeStep === 0 && (
                  <Button
                    onClick={handleSendEmail}
                    disabled={loading || !email}
                  >
                    Confirm
                  </Button>
                )}
                {activeStep === 2 && (
                  <Button
                    onClick={handleResetPassword}
                    disabled={loading || !newPassword}
                  >
                    Confirm
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <div className="w-full bg-black z-20"></div>
    </div>
  );
};

export default ResetPassword;
