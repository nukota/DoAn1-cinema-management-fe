import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { ShowtimeType } from "../../../interfaces/types";
import { useRooms } from "../../../providers/RoomsProvider";

const CustomTab = styled(Tab)(() => ({
  minWidth: 0,
  width: 96,
  height: 82,
  borderRadius: 6,
}));

interface ShowtimesProps {
  showtimes: ShowtimeType[];
  selectedShowtime: ShowtimeType | null;
  onSelectShowtime: (showtime: ShowtimeType) => void;
}

const ShowTimes: React.FC<ShowtimesProps> = ({
  showtimes,
  selectedShowtime,
  onSelectShowtime,
}) => {
  const [value, setValue] = useState(0);
  const { rooms, fetchRoomsData } = useRooms();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        await fetchRoomsData();
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedShowtime) {
      const showtimeDate = new Date(selectedShowtime.showtime).toLocaleDateString(
        "en-GB"
      );
      const index = Array.from({ length: 7 }).findIndex((_, i) => {
        const tabDate = getFormattedDate(i).fullDate;
        return tabDate === showtimeDate;
      });
      if (index !== -1) {
        setValue(index);
      }
    }
  }, [selectedShowtime]);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getFormattedDate = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const fullDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const displayDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    });
    const weekday = date.toLocaleDateString("en-GB", { weekday: "long" });
    return { fullDate, displayDate, weekday };
  };

  const selectedDate = getFormattedDate(value).fullDate;

  const sortedShowtimes = [...showtimes].sort((a, b) => {
    const dateA = new Date(a.showtime);
    const dateB = new Date(b.showtime);
    return Number(dateA) - Number(dateB);
  });

  const showtimesForSelectedDate = sortedShowtimes.filter((showtime) => {
    const showtimeDate = new Date(showtime.showtime).toLocaleDateString(
      "en-GB"
    );
    return showtimeDate === selectedDate;
  });

  const isPastShowtime = (showtime: string) => {
    const showtimeDate = new Date(showtime);
    return showtimeDate < new Date();
  };

  const groupedShowtimes = rooms.reduce((acc, room) => {
    const cinemaName = room.cinema.name;
    const roomShowtimes = showtimesForSelectedDate.filter(
      (showtime) => showtime.room.room_id === room._id
    );

    if (roomShowtimes.length > 0) {
      if (!acc[cinemaName]) {
        acc[cinemaName] = [];
      }
      acc[cinemaName].push(...roomShowtimes);
    }

    return acc;
  }, {} as Record<string, ShowtimeType[]>);

  return (
    <Box
      sx={{
        width: 1,
        paddingInline: 36,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 5,
        zIndex: 10,
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        TabIndicatorProps={{ style: { display: "none" } }}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        {Array.from({ length: 7 }).map((_, index) => (
          <CustomTab
            key={index}
            label={<CustomTabLabel {...getFormattedDate(index)} />}
            sx={{
              marginRight: 2,
              backgroundColor: (theme) =>
                value === index ? theme.palette.secondary.main : "transparent",
              color: (theme) =>
                value === index
                  ? theme.palette.common.black
                  : theme.palette.secondary.main,
              border: (theme) =>
                value === index
                  ? "none"
                  : `1px solid ${theme.palette.secondary.main}`,
              "&.Mui-selected": {
                backgroundColor: (theme) => theme.palette.secondary.main,
                color: (theme) => theme.palette.common.black,
              },
              "&:not(.Mui-selected)": {
                color: (theme) => theme.palette.secondary.main,
                border: (theme) => `1px solid ${theme.palette.secondary.main}`,
              },
            }}
          />
        ))}
      </Tabs>
      <Box
        sx={{
          paddingX: 4,
          paddingTop: 2,
          paddingBottom: 6,
          backgroundColor: "black",
          width: 800,
          marginTop: 6,
          borderRadius: 4,
        }}
      >
        <Typography
          sx={{
            fontWeight: "medium",
            marginY: 2,
            fontSize: 26,
            color: "lightgray",
            letterSpacing: "0.1em",
          }}
        >
          Showtimes
        </Typography>
        {Object.entries(groupedShowtimes).map(
          ([cinemaName, cinemaShowtimes]) => (
            <Box key={cinemaName} sx={{ marginBottom: 4 }}>
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "gold",
                  marginBottom: 2,
                }}
              >
                {cinemaName}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {cinemaShowtimes.map((showtime) => (
                  <Box
                    key={showtime._id}
                    sx={{
                      border: "2px solid",
                      borderColor:
                        selectedShowtime?._id === showtime._id
                          ? "gold"
                          : isPastShowtime(showtime.showtime)
                          ? "gray"
                          : (theme) => theme.palette.secondary.main,
                      padding: 1,
                      borderRadius: 1,
                      transition: "transform 0.1s",
                      cursor: isPastShowtime(showtime.showtime)
                        ? "default"
                        : "pointer",
                      backgroundColor:
                        selectedShowtime?._id === showtime._id
                          ? "rgba(255, 215, 0, 0.2)"
                          : "transparent",
                      "&:hover": {
                        transform: isPastShowtime(showtime.showtime)
                          ? "none"
                          : "translateY(-4px)",
                      },
                    }}
                    onClick={() =>
                      !isPastShowtime(showtime.showtime) &&
                      onSelectShowtime(showtime)
                    }
                  >
                    <Typography
                      sx={{
                        fontSize: 14,
                        color: isPastShowtime(showtime.showtime)
                          ? "gray"
                          : (theme) => theme.palette.secondary.main,
                      }}
                    >
                      {new Date(showtime.showtime).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "lightgray",
                      }}
                    >
                      {showtime.price.toFixed(0)} vnd
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

const CustomTabLabel: React.FC<{ displayDate: string; weekday: string }> = ({
  displayDate,
  weekday,
}) => (
  <Box>
    <Typography sx={{ fontWeight: "bold", fontSize: 18 }}>
      {displayDate}
    </Typography>
    <Typography sx={{ fontWeight: "normal", fontSize: 12, marginTop: 1 }}>
      {weekday}
    </Typography>
  </Box>
);

export default ShowTimes;
