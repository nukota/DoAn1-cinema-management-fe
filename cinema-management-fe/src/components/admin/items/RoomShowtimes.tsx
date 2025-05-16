import React, { useState } from "react";
import { MovieType, RoomType, ShowtimeType } from "../../../interfaces/types";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Showtime from "./Showtime";
import CreateShowtime from "../dialogs/CreateShowtime";

interface RoomShowtimesProps {
  room: RoomType;
  showtimes: ShowtimeType[];
  movies: MovieType[];
  onAddShowtime: (roomId: ShowtimeType) => void;
  onUpdateShowtime: (showtime: ShowtimeType) => void;
  onDeleteShowtime: (showtimeId: string) => void;
}

const RoomShowtimes: React.FC<RoomShowtimesProps> = ({
  room,
  showtimes,
  movies,
  onAddShowtime,
  onUpdateShowtime,
  onDeleteShowtime,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddShowtime = (newShowtime: ShowtimeType) => {
    onAddShowtime(newShowtime);
    setIsDialogOpen(false);
  };

  return (
    <Box className="w-[280px] h-[484px] border border-light-gray rounded-xl flex flex-col p-4 relative">
      {/* Room Information */}
      <Box className="mb-4">
        <Typography
          variant="body1"
          className="truncate flex items-center text-[#ccc] font-thin"
        >
          Cinema: {room.cinema.name}
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "inline-block",
              marginLeft: 8,
              verticalAlign: "middle",
            }}
            title={room._id}
          >
            #{room._id}
          </span>
        </Typography>
        <Typography
          variant="body1"
          className="truncate flex items-center mt-2 text-black"
        >
          <span className="mr-4 text-2xl font-[400]">{room.name}</span>
        </Typography>
      </Box>

      {/* Add Button */}
      <Box
        sx={{
          position: "absolute",
          bottom: 8,
          right: 8,
          background: "#fff",
          borderRadius: "50%",
          boxShadow: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <Tooltip title="Add Showtime">
          <IconButton
            color="primary"
            onClick={handleOpenDialog}
            sx={{
              marginBottom: 0,
              position: "static",
            }}
          >
            <AddIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* List of Showtimes */}
      <Box className="flex flex-col gap-2 overflow-y-auto bg-[#f2f2f2] h-full w-full custom-scrollbar overflow-x-hidden p-2 rounded-[8px]">
        {showtimes.map((showtime) => (
          <Showtime
            key={showtime._id}
            showtime={showtime}
            onUpdateShowtime={onUpdateShowtime}
            onDeleteShowtime={onDeleteShowtime}
          />
        ))}
      </Box>

      {/* Create Showtime Dialog */}
      <CreateShowtime
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleAddShowtime}
        roomId={room._id}
        movies={movies}
      />
    </Box>
  );
};

export default RoomShowtimes;
