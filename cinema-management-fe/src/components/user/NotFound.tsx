import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SentimentDissatisfied } from "@mui/icons-material";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/user"); // Redirect to the home page
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "black",
        color: "#999",
        textAlign: "center",
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography
          variant="h1"
          sx={{ fontSize: "80px", fontWeight: "medium" }}
        >
          404 not found
        </Typography>
        <SentimentDissatisfied
          sx={{ fontSize: "80px", ml: 2, fontWeight: 400, color: "#484848" }}
        />
      </Box>

      <Typography variant="h5" sx={{ mb: 4 }}>
        Oops! The page you are looking for does not exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoHome}
        sx={{ mt: 2 }}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;
