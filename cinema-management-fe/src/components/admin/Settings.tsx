import React, { useEffect, useState } from "react";
import { Box, TextField, Button, CircularProgress, Paper } from "@mui/material";
import { useSetting } from "../../providers/SettingProvider";
import { toast } from "react-toastify";

const Settings: React.FC = () => {
  const { setting, getSetting, updateSetting, loading } = useSetting();
  const [form, setForm] = useState({
    min_price: 0,
    max_price: 0,
    time_skip: 0,
    max_order_seat: 0,
    reservation_time: 0,
  });

  useEffect(() => {
    getSetting();
  }, [getSetting]);

  useEffect(() => {
    if (setting) {
      setForm({
        min_price: setting.min_price,
        max_price: setting.max_price,
        time_skip: setting.time_skip,
        max_order_seat: setting.max_order_seat,
        reservation_time: setting.reservation_time,
      });
    }
  }, [setting]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const handleSave = async () => {
    try {
      await updateSetting({
        ...setting,
        min_price: form.min_price,
        max_price: form.max_price,
        time_skip: form.time_skip,
        max_order_seat: form.max_order_seat,
        reservation_time: form.reservation_time,
      });
      toast.success("Settings updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update settings");
    }
  };

  return (
    <div className="settings flex flex-col h-full items-center">
      <div className="text-40px font-medium text-dark-gray mb-6">Settings</div>
      <Paper sx={{ p: 4, minWidth: 340, maxWidth: 400 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <TextField
            label="Min Price"
            name="min_price"
            type="number"
            value={form.min_price}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Max Price"
            name="max_price"
            type="number"
            value={form.max_price}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Time Skip (minutes)"
            name="time_skip"
            type="number"
            value={form.time_skip}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Max Order Seat"
            name="max_order_seat"
            type="number"
            value={form.max_order_seat}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Reservation Time (minutes)"
            name="reservation_time"
            type="number"
            value={form.reservation_time}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={loading}
            sx={{ mt: 2 }}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : "Save Settings"}
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default Settings;