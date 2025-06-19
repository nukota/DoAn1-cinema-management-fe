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
  const { getCreditByUserId } = useUsers();
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
  const [userCredit, setUserCredit] = useState<number | null>(null);
  const [bookingHistory, setBookingHistory] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCredit = async () => {
      if (userProfile?._id) {
        const credit = await getCreditByUserId(userProfile._id);
        setUserCredit(credit);
      } else {
        setUserCredit(null);
      }
    };
    fetchCredit();
  }, [userProfile?._id, getCreditByUserId]);

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
    <div className="bg-black w-full flex flex-col justify-center relative">
      <img
        className="absolute w-full h-full top-0 z-0 opacity-20"
        src={wallPaperImg}
        alt="Wallpaper"
      />
      <div className="w-[72%] ml-[14%] min-w-[840px] bg-white mt-[120px] mb-[60px] flex flex-row items-center px-[14px] h-[520px] overflow-auto z-10">
        <div className="w-[50%] px-[24px]">
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <h2 className="text-4xl font-semibold mb-1">Profile</h2>
            <Typography variant="body1" sx={{ mb: 0, color: userCredit === null ? 'text.disabled' : 'text.primary', float: 'right' }}>
              Credit: {userCredit !== null ? userCredit : "-"}
            </Typography>
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
            <Box sx={{ marginTop: 4, display: "flex", gap: 2 }}>
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
              <Button
                variant="outlined"
                sx={{
                  color: "gray",
                  borderColor: "gray",
                }}
                onClick={() => navigate("/user")}
              >
                Back
              </Button>
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
