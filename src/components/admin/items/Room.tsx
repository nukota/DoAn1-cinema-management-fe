import React from "react";
import { RoomType } from "../../../interfaces/types";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";

interface RoomProps {
  room: RoomType;
  handleInfoClick: () => void;
}

const Room: React.FC<RoomProps> = ({ room, handleInfoClick }) => {
  return (
    <Card
      sx={{
        width: 180,
        height: 200,
        display: "flex",
        flexDirection: "column",
        border: "2px solid #dc2626",
        borderRadius: 2,
        boxShadow: "none",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          component="h3"
          sx={{
            fontSize: "20px",
            fontWeight: 500,
            color: "#374151",
            textAlign: "flex-start",
            mb: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {room.name}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "21px",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#333",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {room.cinema?.name}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "21px",
            }}
          >
            <Typography variant="body2" sx={{ color: "#000" }}>
              Capacity:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#000",
                ml: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {room.seat_count}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 0 }}>
        <Button
          variant="text"
          color="primary"
          onClick={handleInfoClick}
          sx={{
            backgroundColor: "rgba(184, 0, 7, 0.05)",
            width: "100%",
            borderRadius: 0,
          }}
        >
          View Info
        </Button>
      </CardActions>
    </Card>
  );
};

export default Room;
