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
import { useOrders } from "../../providers/OrdersProvider";
import VNPayImg from "../../assets/images/vnpay.png";
import { formatCurrency } from "../../utils/formatUtils";
import { toast } from "react-toastify";

const VNPayResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile } = useAuth();
  const { updateOrder } = useOrders();
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    message: string;
    order_id?: string;
    code?: string;
    amount?: number;
  } | null>(null);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      setLoading(true);
      try {
        // Parse URL parameters from VNPay redirect
        const searchParams = new URLSearchParams(location.search);

        const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
        const vnp_TransactionStatus = searchParams.get("vnp_TransactionStatus");
        const vnp_Amount = searchParams.get("vnp_Amount");
        const vnp_TxnRef = searchParams.get("vnp_TxnRef");
        const vnp_TransactionNo = searchParams.get("vnp_TransactionNo");

        // Check if payment was successful (response code 00 means success)
        const isSuccess =
          vnp_ResponseCode === "00" && vnp_TransactionStatus === "00";

        if (isSuccess && vnp_TxnRef) {
          // Get the real order ID from sessionStorage (stored before redirecting to VNPay)
          const orderId = sessionStorage.getItem("vnpay_order_id");

          if (!orderId) {
            throw new Error("Order ID not found in session storage");
          }

          // Clear the stored order ID
          sessionStorage.removeItem("vnpay_order_id");

          try {
            await updateOrder({ _id: orderId, status: "completed" } as any);
            toast.success("Order completed successfully!");
          } catch (error) {
            console.error("Failed to update order status:", error);
            toast.error("Payment successful but failed to update order status");
          }

          setPaymentResult({
            success: true,
            message: "Payment Successfully!",
            order_id: orderId,
            code: vnp_TransactionNo || "N/A",
            amount: vnp_Amount ? parseInt(vnp_Amount) / 100 : 0, // VNPay returns amount in cents
          });
        } else {
          // Clear the stored order ID on failure
          sessionStorage.removeItem("vnpay_order_id");

          setPaymentResult({
            success: false,
            message:
              vnp_ResponseCode === "24"
                ? "Payment cancelled by user"
                : "Payment failed. Please try again.",
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
                  {formatCurrency(paymentResult.amount)}
                </Typography>
              </Box>
            )}

            {paymentResult?.amount &&
              Math.floor(paymentResult.amount / 1000) > 0 && (
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
                    +{Math.floor(paymentResult.amount / 1000)} points
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
