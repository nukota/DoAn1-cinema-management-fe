import React, { useEffect, useState } from "react";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { useCustomers } from "../../providers/CustomersProvider";
import { useUsers } from "../../providers/UserProvider";
import { useOrders } from "../../providers/OrdersProvider";
import wallPaperImg from "../../assets/images/wallpaper.jpg";
import { formatToDateInput } from "../../utils/formatUtils";

const UserProfile: React.FC = () => {
  const { userProfile } = useAuth();
  const { updateCustomer } = useCustomers();
  const { getLoyaltyPointsByUserId } = useUsers();
  const { getOrderByUserId } = useOrders();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    _id: userProfile?._id || "",
    full_name: userProfile?.full_name || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
    password_hash: userProfile?.password_hash || "",
    dateOfBirth: userProfile?.dateOfBirth || "",
    cccd: userProfile?.cccd || "",
    role: userProfile?.role || "employee",
    created_at: userProfile?.created_at || "",
  });
  const [loyaltyPoints, setLoyaltyPoints] = useState<number | null>(null);
  const [bookingHistory, setBookingHistory] = useState<any[]>([]);
  const navigate = useNavigate();

  // Calculate user rank based on loyalty points
  const getUserRank = (): { 
    rank: string; 
    color: string; 
    bgColor: string; 
    pointsToNext: number | null;
    nextRank: string | null;
  } => {
    if (loyaltyPoints === null) {
      return { 
        rank: "No Rank", 
        color: "#9e9e9e", 
        bgColor: "rgba(158, 158, 158, 0.1)",
        pointsToNext: null,
        nextRank: null,
      };
    }
    if (loyaltyPoints >= 500) {
      return { 
        rank: "Gold", 
        color: "#ffd700", 
        bgColor: "rgba(255, 215, 0, 0.15)",
        pointsToNext: null, // Max rank
        nextRank: null,
      };
    }
    if (loyaltyPoints >= 100) {
      return { 
        rank: "Silver", 
        color: "#c0c0c0", 
        bgColor: "rgba(192, 192, 192, 0.15)",
        pointsToNext: 500 - loyaltyPoints,
        nextRank: "Gold",
      };
    }
    return { 
      rank: "Bronze", 
      color: "#cd7f32", 
      bgColor: "rgba(205, 127, 50, 0.15)",
      pointsToNext: 100 - loyaltyPoints,
      nextRank: "Silver",
    };
  };

  const rankInfo = getUserRank();

  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      if (userProfile?._id) {
        const points = await getLoyaltyPointsByUserId(userProfile._id);
        setLoyaltyPoints(points);
      } else {
        setLoyaltyPoints(null);
      }
    };
    fetchLoyaltyPoints();
  }, [userProfile?._id, getLoyaltyPointsByUserId]);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      if (userProfile?._id) {
        try {
          const orders = await getOrderByUserId(userProfile._id);
          setBookingHistory(orders || []);
        } catch (error) {
          setBookingHistory([]);
        }
      }
    };
    fetchBookingHistory();
  }, [userProfile, getOrderByUserId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    try {
      updateCustomer(formData);
      console.log("User profile updated successfully.");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user profile:", error);
    }
  };

  return (
    <div className="bg-black w-full min-h-screen flex flex-col justify-center relative">
      <div
        className="absolute w-full h-[100vh] top-[0vh] pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)",
        }}
      />
      <img
        className="absolute w-full h-[100vh] top-0 z-0 opacity-15"
        src={wallPaperImg}
        alt="Wallpaper"
      />
      <div className="w-[72%] ml-[14%] min-w-[1100px] bg-white mt-[120px] mb-[60px] flex flex-row items-start px-[14px] h-[520px] xl:h-[700px] overflow-auto z-10">
        <div className="w-[50%] px-[24px] h-full">
          <Box
            component="form"
            sx={{
              display: "flex",
              position: "relative",
              flexDirection: "column",
              gap: 1,
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                mb: 2,
                mt: 3,
              }}
            >
              <h2 className="text-4xl font-semibold mb-1">Profile</h2>
              {/* Rank Banner */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRadius: 2,
                  border: `3px solid ${rankInfo.color}`,
                  padding: 1.5,
                  backgroundColor: rankInfo.bgColor,
                  textAlign: "center",
                  gap: 0.5,
                  flexShrink: 0,
                  minWidth: "200px",
                  boxShadow: `0 4px 12px ${rankInfo.color}40`,
                  transition: "all 0.3s ease",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ 
                    fontWeight: "medium", 
                    fontSize: "14px", 
                    color: "text.secondary",
                  }}
                >
                  Your Rank
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ 
                    fontWeight: "bold", 
                    color: rankInfo.color,
                    textShadow: `0 2px 4px ${rankInfo.color}40`,
                  }}
                >
                  {rankInfo.rank}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ 
                    fontSize: "12px", 
                    color: "text.secondary",
                  }}
                >
                  {loyaltyPoints !== null 
                    ? `${loyaltyPoints} Loyalty Points` 
                    : "No loyalty points"}
                </Typography>
                {rankInfo.pointsToNext !== null && rankInfo.nextRank && (
                  <Typography
                    variant="caption"
                    sx={{ 
                      fontSize: "11px", 
                      color: rankInfo.color,
                      fontWeight: "medium",
                      mt: 0.5,
                    }}
                  >
                    {rankInfo.pointsToNext} points to {rankInfo.nextRank}
                  </Typography>
                )}
                {rankInfo.rank === "Gold" && (
                  <Typography
                    variant="caption"
                    sx={{ 
                      fontSize: "11px", 
                      color: rankInfo.color,
                      fontWeight: "medium",
                      mt: 0.5,
                    }}
                  >
                    ⭐ Maximum Rank Achieved!
                  </Typography>
                )}
              </Box>
            </Box>

            <Typography
              variant="body1"
              marginTop="4px"
              fontSize="14px"
              fontWeight="bold"
            >
              Full Name
            </Typography>
            <TextField
              placeholder="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              disabled={!isEditing}
              fullWidth
              size="small"
            />
            <Typography
              variant="body1"
              marginTop="4px"
              fontSize="14px"
              fontWeight="bold"
            >
              Email
            </Typography>
            <TextField
              placeholder="Email"
              name="email"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              fullWidth
              size="small"
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body1"
                  marginTop="4px"
                  fontSize="14px"
                  fontWeight="bold"
                >
                  Phone
                </Typography>
                <TextField
                  placeholder="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  fullWidth
                  size="small"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body1"
                  marginTop="4px"
                  fontSize="14px"
                  fontWeight="bold"
                >
                  Date of Birth
                </Typography>
                <TextField
                  placeholder="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formatToDateInput(formData.dateOfBirth)}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  fullWidth
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body1"
                  marginTop="4px"
                  fontSize="14px"
                  fontWeight="bold"
                >
                  CCCD
                </Typography>
                <TextField
                  placeholder="CCCD"
                  name="cccd"
                  value={formData.cccd}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  fullWidth
                  size="small"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body1"
                  marginTop="4px"
                  fontSize="14px"
                  fontWeight="bold"
                >
                  Role
                </Typography>
                <TextField
                  placeholder="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled
                  fullWidth
                  size="small"
                />
              </Box>
            </Box>
            <Box
              sx={{
                position: "absolute",
                display: "flex",
                right: 0,
                bottom: 20,
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate("/user")}
              >
                Back
              </Button>
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </Box>
          </Box>
        </div>
        <div className="w-[50%] h-[520px] px-[48px] py-[24px]">
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", mb: 2, color: "black" }}
          >
            Booking History
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <div
            className="flex flex-col gap-2 h-[420px] overflow-y-scroll"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#e0e0e0 #f5f5f5",
            }}
          >
            <style>
              {`
                .booking-history-scroll::-webkit-scrollbar {
                  width: 6px;
                  background: #f5f5f5;
                }
                .booking-history-scroll::-webkit-scrollbar-thumb {
                  background: #e0e0e0;
                  border-radius: 3px;
                }
              `}
            </style>
            <div className="booking-history-scroll">
              {bookingHistory.length === 0 && (
                <Typography color="gray">No booking history found.</Typography>
              )}
              {bookingHistory.map((order) =>
                order.tickets?.map((ticket: any, idx: number) => (
                  <div
                    key={order._id + "-" + idx}
                    className="p-2 bg-gray-100 rounded-md border border-solid border-[#dadada] flex flex-col gap-1 m-1"
                  >
                    <Typography sx={{ fontWeight: "medium", fontSize: "16px" }}>
                      {ticket.title}
                    </Typography>
                    <Typography sx={{ color: "gray", fontSize: "14px" }}>
                      {new Date(ticket.showtime).toLocaleString()}
                    </Typography>
                    <Typography sx={{ color: "gray", fontSize: "14px" }}>
                      Seats:{" "}
                      {ticket.seats.map((s: any) => s.seat_name).join(", ")} (
                      {ticket.seats.length}{" "}
                      {ticket.seats.length > 1 ? "seats" : "seat"})
                    </Typography>
                    <Typography sx={{ color: "gray", fontSize: "14px" }}>
                      Order Code: {order.ordercode}
                    </Typography>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
