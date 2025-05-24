import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SentimentDissatisfied } from "@mui/icons-material";
import { useAuth } from "../../providers/AuthProvider";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { fetchUserProfile, userProfile } = useAuth();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        if (!userProfile) {
          const token = localStorage.getItem("accessToken");
          const email = localStorage.getItem("email");
          if (token && email) {
            await fetchUserProfile(token, email);
          }
        }
        setRole(userProfile?.role || null);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      }
    };

    fetchRole();
  }, [fetchUserProfile, userProfile]);

  const handleGoToAdmin = () => {
    navigate("/admin");
  };

  const handleGoToEmployee = () => {
    navigate("/employee");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "f2f2f2",
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
          sx={{ fontSize: "80px", ml: 2, fontWeight: 400, color: "#dadada" }}
        />
      </Box>

      <Typography variant="h5" sx={{ mb: 4 }}>
        Oops! The page you are looking for does not exist.
      </Typography>
      {/* Conditionally render buttons based on role */}
      {role === "employee" && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoToEmployee}
          sx={{ mt: 2 }}
        >
          Go to Employee Page
        </Button>
      )}
      {role === "admin" && (
        <Box display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={handleGoToAdmin}>
            Go to Admin Page
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoToEmployee}
          >
            Go to Employee Page
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default NotFound;
