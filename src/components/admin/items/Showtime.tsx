import React, { useState } from "react";
import { MovieType, ShowtimeType } from "../../../interfaces/types";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DetailShowtime from "../dialogs/DetailShowtime";

interface ShowtimeProps {
  showtime: ShowtimeType;
  movies: MovieType[];
  onUpdateShowtime: (showtime: ShowtimeType) => Promise<boolean>;
  onDeleteShowtime: (showtimeId: ShowtimeType) => void;
}
const Showtime: React.FC<ShowtimeProps> = ({
  showtime,
  movies,
  onUpdateShowtime,
  onDeleteShowtime,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSaveShowtime = async (updatedShowtime: ShowtimeType) => {
    const result = await onUpdateShowtime(updatedShowtime);
    setIsDialogOpen(false);
    return result;
  };
  return (
    <Box className="w-full h-[160px] bg-white rounded-xl flex flex-col justify-between p-2 relative overflow-hiden">
      <Box
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          display: "flex",
          gap: 0.5,
          zIndex: 1,
        }}
      >
        <Tooltip title="Edit Showtime">
          <IconButton
            size="small"
            color="default"
            sx={{ p: "2px" }}
            onClick={handleEditClick}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Showtime">
          <IconButton
            size="small"
            color="default"
            sx={{ p: "2px" }}
            onClick={() => onDeleteShowtime(showtime)}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography
        className="text-[#ccc] truncate"
        sx={{
          fontSize: 12,
          fontWeight: 400,
          width: "160px",
        }}
      >
        # {showtime._id}
      </Typography>

      {/* Movie ID */}
      <Typography variant="body2" className="text-gray truncate">
        Movie: {showtime.movie.title}
      </Typography>

      {/* Showtime */}
      <Typography variant="body2" className="text-gray" sx={{ mt: 0.5 }}>
        Showtime:
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="body2" className="text-gray">
          {new Date(showtime.showtime).toLocaleDateString("vi-VN")}
        </Typography>
        <Typography variant="body2" className="text-gray ml-auto">
          {new Date(showtime.showtime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </Typography>
      </Box>
      <DetailShowtime
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveShowtime}
        showtime={showtime}
        movies={movies}
      />
    </Box>
  );
};

export default Showtime;
