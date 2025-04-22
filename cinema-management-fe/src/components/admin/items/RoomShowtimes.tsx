import React, { useState } from "react";
import { RoomType, ShowtimeType } from "../../../interfaces/types";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Showtime from "./Showtime";
import CreateShowtime from "../dialogs/CreateShowtime";

interface RoomShowtimesProps {
  room: RoomType;
  showtimes: ShowtimeType[];
  onAddShowtime: (newShowtime: ShowtimeType) => void; // Callback to handle adding a new showtime
}

const RoomShowtimes: React.FC<RoomShowtimesProps> = ({
  room,
  showtimes,
  onAddShowtime,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddShowtime = (newShowtime: ShowtimeType) => {
    onAddShowtime(newShowtime); // Pass the new showtime to the parent component
    setIsDialogOpen(false); // Close the dialog
  };

  return (
    <Box className="w-[280px] h-[484px] bg-[#f2f2f2] rounded-xl flex flex-col p-4 relative">
      {/* Room Information */}
      <Box className="mb-4">
        <Typography variant="body2" className="text-dark-gray">
          Cinema: {room.cinema_id}
        </Typography>
        <Typography variant="body2" className="text-gray">
          Room: #{room.room_id} {room.name}
        </Typography>
      </Box>

      {/* Add Button */}
      <Tooltip title="Add Showtime">
        <IconButton
          color="primary"
          onClick={handleOpenDialog}
          sx={{
            marginBottom: "8px",
            position: "absolute",
            bottom: 8,
            right: 8,
          }}
        >
          <AddIcon sx={{fontSize: 36}} />
        </IconButton>
      </Tooltip>

      {/* List of Showtimes */}
      <Box className="flex flex-col gap-2 overflow-y-auto">
        {showtimes.map((showtime) => (
          <Showtime key={showtime.showtime_id} {...showtime} />
        ))}
      </Box>

      {/* Create Showtime Dialog */}
      <CreateShowtime
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleAddShowtime}
      />
    </Box>
  );
};

export default RoomShowtimes;
