import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useSetting } from "../../providers/SettingProvider";
import { toast } from "react-toastify";

const Settings: React.FC = () => {
  const { setting, getSetting, updateSetting, loading } = useSetting();
  const [form, setForm] = useState<{
    [key: string]: string;
  }>({
    min_ticket_price: "",
    max_ticket_price: "",
    min_product_price: "",
    max_product_price: "",
    close_time: "",
    open_time: "",
    time_gap: "",
    employee_min_age: "",
    employee_max_age: "",
    reservation_time: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getSetting();
  }, [getSetting]);

  useEffect(() => {
    if (setting) {
      setForm({
        min_ticket_price: setting.min_ticket_price?.toString() ?? "",
        max_ticket_price: setting.max_ticket_price?.toString() ?? "",
        min_product_price: setting.min_product_price?.toString() ?? "",
        max_product_price: setting.max_product_price?.toString() ?? "",
        close_time: setting.close_time ?? "",
        open_time: setting.open_time ?? "",
        time_gap: setting.time_gap?.toString() ?? "",
        employee_min_age: setting.employee_min_age?.toString() ?? "",
        employee_max_age: setting.employee_max_age?.toString() ?? "",
        reservation_time: setting.reservation_time?.toString() ?? "",
      });
    }
  }, [setting]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // Check if all number fields are valid numbers
    const numberFields = [
      "min_ticket_price",
      "max_ticket_price",
      "min_product_price",
      "max_product_price",
      "time_gap",
      "employee_min_age",
      "employee_max_age",
      "reservation_time",
    ];
    for (const field of numberFields) {
      if (form[field] === "" || isNaN(Number(form[field]))) {
        toast.error("All number fields must be valid numbers");
        return;
      }
    }
    try {
      await updateSetting({
        ...setting,
        ...Object.fromEntries(
          Object.entries(form).map(([k, v]) =>
            numberFields.includes(k) ? [k, Number(v)] : [k, v]
          )
        ),
      });
      toast.success("Settings updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update settings");
    }
  };

  const handleModify = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (setting) {
      setForm({
        min_ticket_price: setting.min_ticket_price?.toString() ?? "",
        max_ticket_price: setting.max_ticket_price?.toString() ?? "",
        min_product_price: setting.min_product_price?.toString() ?? "",
        max_product_price: setting.max_product_price?.toString() ?? "",
        close_time: setting.close_time ?? "",
        open_time: setting.open_time ?? "",
        time_gap: setting.time_gap?.toString() ?? "",
        employee_min_age: setting.employee_min_age?.toString() ?? "",
        employee_max_age: setting.employee_max_age?.toString() ?? "",
        reservation_time: setting.reservation_time?.toString() ?? "",
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="settings flex flex-col h-full items-center">
      <div className="text-40px font-medium text-dark-gray mb-6">Settings</div>
      <Paper sx={{ p: 4, minWidth: 800, maxWidth: 1000 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <Box display="flex" gap={6}>
            {/* Movie Price Fields */}
            <Box display="flex" gap={1}>
              <TextField
                label="Min Movie Price"
                name="min_ticket_price"
                type="number"
                value={form.min_ticket_price}
                onChange={handleChange}
                fullWidth
                disabled={!isEditing || loading}
              />
              <TextField
                label="Max Movie Price"
                name="max_ticket_price"
                type="number"
                value={form.max_ticket_price}
                onChange={handleChange}
                fullWidth
                disabled={!isEditing || loading}
              />
            </Box>

            {/* Product Price Fields */}
            <Box display="flex" gap={1}>
              <TextField
                label="Min Product Price"
                name="min_product_price"
                type="number"
                value={form.min_product_price}
                onChange={handleChange}
                fullWidth
                disabled={!isEditing || loading}
              />
              <TextField
                label="Max Product Price"
                name="max_product_price"
                type="number"
                value={form.max_product_price}
                onChange={handleChange}
                fullWidth
                disabled={!isEditing || loading}
              />
            </Box>
          </Box>
          <Box display="flex" gap={6}>
            {/* Open and Close Time Fields */}
            <Box display="flex" gap={1}>
              <TextField
                label="Open Time"
                name="open_time"
                type="time"
                value={form.open_time}
                onChange={handleChange}
                fullWidth
                disabled={!isEditing || loading}
              />
              <TextField
                label="Close Time"
                name="close_time"
                type="time"
                value={form.close_time}
                onChange={handleChange}
                fullWidth
                disabled={!isEditing || loading}
              />
            </Box>

            {/* Employee Age Fields */}
            <Box display="flex" gap={1}>
              <TextField
                label="Min Employee Age"
                name="employee_min_age"
                type="number"
                value={form.employee_min_age}
                onChange={handleChange}
                fullWidth
                disabled={!isEditing || loading}
              />
              <TextField
                label="Max Employee Age"
                name="employee_max_age"
                type="number"
                value={form.employee_max_age}
                onChange={handleChange}
                fullWidth
                disabled={!isEditing || loading}
              />
            </Box>
          </Box>

          {/* Time Gap and Reservation Time Fields */}
          <Box display="flex" gap={6}>
            <Box flex={1}>
              <TextField
                label="Time Gap"
                name="time_gap"
                type="number"
                value={form.time_gap}
                onChange={handleChange}
                fullWidth
                disabled={!isEditing || loading}
              />
              <Typography variant="caption" color="gray">
                Time gap in minutes
              </Typography>
            </Box>
            <Box flex={1}>
              <TextField
                label="Reservation Time"
                name="reservation_time"
                type="number"
                value={form.reservation_time}
                onChange={handleChange}
                fullWidth
                disabled={!isEditing || loading}
              />
              <Typography variant="caption" color="gray">
                Reservation time in seconds
              </Typography>
            </Box>
          </Box>

          {/* Save Button */}
          {!isEditing ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleModify}
              sx={{ mt: 2 }}
              fullWidth
            >
              Modify
            </Button>
          ) : (
            <Box display="flex" gap={2} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCancel}
                disabled={loading}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : "Save Settings"}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </div>
  );
};

export default Settings;
