import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { useCustomers } from "../../providers/CustomersProvider";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const { userProfile } = useAuth();
  const { updateCustomer } = useCustomers();
  const [isEditing, setIsEditing] = useState(false);
  
  const formatDateForInput = (date: string | undefined): string => {
    if (!date) return "";
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    _id: userProfile?._id || "",
    full_name: userProfile?.full_name || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
    password_hash: userProfile?.password_hash || "",
    dateOfBirth: formatDateForInput(userProfile?.dateOfBirth) || "",
    cccd: userProfile?.cccd || "",
    role: userProfile?.role || "employee",
    created_at: userProfile?.created_at || "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await updateCustomer(formData);
      toast.success("User profile updated successfully.");
      setIsEditing(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        Admin Profile
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Full Name"
          name="full_name"
          value={formData.full_name}
          onChange={handleInputChange}
          disabled={!isEditing}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={!isEditing}
          fullWidth
        />
        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          disabled={!isEditing}
          fullWidth
        />
        <TextField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          disabled={!isEditing}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="CCCD"
          name="cccd"
          value={formData.cccd}
          onChange={handleInputChange}
          disabled={!isEditing}
          fullWidth
        />
        <TextField
          label="Role"
          name="role"
          value={formData.role}
          disabled
          fullWidth
        />
      </Box>
      <Box sx={{ marginTop: 4, display: "flex", gap: 2 }}>
        {isEditing ? (
          <>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => setIsEditing(false)}>
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
          color="secondary"
          onClick={() => navigate("/admin")}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
