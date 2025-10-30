import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useAuth } from "../../providers/AuthProvider";
import VNPayImg from "../../assets/images/vnpay.png";

const VNPayResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    message: string;
    order_id?: string;
    code?: string;
    added_points?: number;
    amount?: number;
  } | null>(null);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchPaymentStatus = async () => {
      setLoading(true);
      try {
        // Mock API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock payment result - you can change this to test different scenarios
        const mockSuccess = true; // Change to false to test error state

        if (mockSuccess) {
          setPaymentResult({
            success: true,
            message: "Payment Successfully!",
            order_id: "507f1f77bcf86cd799439011",
            code: "00",
            added_points: 50,
            amount: 139000,
          });
        } else {
          setPaymentResult({
            success: false,
            message: "Order not found!",
          });
        }
      } catch (error) {
        setPaymentResult({
          success: false,
          message: "Failed to process payment",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [location.search]);

  const getBackButtonConfig = () => {
    const role = userProfile?.role;

    switch (role) {
      case "admin":
        return { label: "Go back to Admin Page", path: "/admin" };
      case "employee":
        return { label: "Go back to Employee Page", path: "/employee" };
      default:
        return { label: "Go back to Home Page", path: "/" };
    }
  };

  const handleGoBack = () => {
    const { path } = getBackButtonConfig();
    navigate(path);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          boxShadow: 6,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ padding: 4 }}>
          {/* VNPay Logo */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <img
              src={VNPayImg}
              alt="VNPay"
              style={{ height: 50, objectFit: "contain" }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            {paymentResult?.success ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CheckCircleOutlineIcon
                  sx={{
                    fontSize: 54,
                    color: "#1976d2",
                    mr: 1,
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    color: "#1976d2",
                  }}
                >
                  Payment Successful!
                </Typography>
              </Box>
            ) : (
              <>
                <ErrorOutlineIcon
                  sx={{
                    fontSize: 80,
                    color: "#f44336",
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "#f44336",
                    mb: 1,
                  }}
                >
                  Payment Failed
                </Typography>
              </>
            )}
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              {paymentResult?.message}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Order Details
            </Typography>

            {paymentResult?.order_id && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Order ID:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {paymentResult.order_id}
                </Typography>
              </Box>
            )}

            {paymentResult?.code && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Transaction Code:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {paymentResult.code}
                </Typography>
              </Box>
            )}

            {paymentResult?.amount && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Amount:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {paymentResult.amount.toLocaleString()} VND
                </Typography>
              </Box>
            )}

            {paymentResult?.added_points !== undefined && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Points Earned:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "medium", color: "#1976d2" }}
                >
                  +{paymentResult.added_points} points
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleGoBack}
              sx={{
                minWidth: 200,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                },
              }}
            >
              {getBackButtonConfig().label}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VNPayResult;
