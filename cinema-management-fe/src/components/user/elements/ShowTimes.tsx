import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import styled from "@emotion/styled";
import { ShowtimeType } from "../../../interfaces/types";

const CustomTab = styled(Tab)(({ theme }) => ({
  minWidth: 0,
  width: 96,
  height: 82,
  borderRadius: 6,
}));

interface ShowtimesProps {
  showtimes: ShowtimeType[];
}

const ShowTimes: React.FC<ShowtimesProps> = ({ showtimes }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
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
                value === index ? "none" : `1px solid ${theme.palette.secondary.main}`,
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
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {showtimesForSelectedDate.map((showtime) => (
            <Box
              key={showtime._id}
              sx={{
                border: "1px solid",
                borderColor: isPastShowtime(showtime.showtime)
                  ? "gray"
                  : (theme) => theme.palette.secondary.main,
                padding: 1,
                borderRadius: 1,
                transition: "transform 0.1s",
                cursor: isPastShowtime(showtime.showtime)
                  ? "default"
                  : "pointer",
                "&:hover": {
                  transform: isPastShowtime(showtime.showtime)
                    ? "none"
                    : "translateY(-4px)",
                },
              }}
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
                ${showtime.price.toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const CustomTabLabel: React.FC<{ displayDate: string; weekday: string }> = ({
  displayDate,
  weekday,
}) => (
  <Box>
    <Typography sx={{ fontWeight: "bold", fontSize: 18 }}>{displayDate}</Typography>
    <Typography sx={{ fontWeight: "normal", fontSize: 12, marginTop: 1 }}>
      {weekday}
    </Typography>
  </Box>
);

export default ShowTimes;
