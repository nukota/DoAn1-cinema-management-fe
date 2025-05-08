import React, { useState } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@mui/material";
// import wallPaperImg from "../../assets/wallpaper.jpg"; // Replace with the actual path to your wallpaper image

const steps = [
  "Select Ticket",
  "Select Products",
  "Customer Information",
  "Payment",
  "Print Ticket",
];

const EmployeeHome: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <Typography variant="h5">Step 1: Select Ticket</Typography>;
      case 1:
        return <Typography variant="h5">Step 2: Select Products</Typography>;
      case 2:
        return <Typography variant="h5">Step 3: Customer Information</Typography>;
      case 3:
        return <Typography variant="h5">Step 4: Payment</Typography>;
      case 4:
        return <Typography variant="h5">Step 5: Print Ticket</Typography>;
      default:
        return <Typography variant="h5">Unknown Step</Typography>;
    }
  };

  return (
    <div className="bg-black min-h-screen w-full h-full flex flex-col relative">
      {/* <img
        className="absolute w-full h-[100vh] top-0 z-0 opacity-20"
        src={wallPaperImg}
        alt="Background"
      /> */}
      <Box
        sx={{
          zIndex: 1,
          width: "80%",
          margin: "auto",
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "white",
        }}
      >
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
          Employee Workflow
        </Typography>
        <Stepper activeStep={activeStep} sx={{ width: "100%", mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box
          sx={{
            width: "100%",
            minHeight: "calc(100vh - 200px)",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "8px",
          }}
        >
          {activeStep === steps.length ? (
            <Box>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you can now print the ticket.
              </Typography>
              <Button onClick={handleReset} variant="contained" color="primary">
                Reset
              </Button>
            </Box>
          ) : (
            <Box>
              {renderStepContent(activeStep)}
              <Box sx={{ mt: 2 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                  variant="outlined"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  variant="contained"
                  color="primary"
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default EmployeeHome;