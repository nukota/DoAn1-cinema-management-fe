import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import styled from "@emotion/styled";

const CustomTab = styled(Tab)(({ theme }) => ({
  minWidth: 0,
  width: 96,
  height: 82,
  borderRadius: 6,
  "&.Mui-selected": {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.black,
  },
  "&:not(.Mui-selected)": {
    color: theme.palette.secondary.main,
    border: `1px solid ${theme.palette.secondary.main}`,
  },
}));

const ShowTimes = ({ showtimes }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getFormattedDate = (offset) => {
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
    const dateA = new Date(
      a.date.split("/").reverse().join("-") + "T" + a.time
    );
    const dateB = new Date(
      b.date.split("/").reverse().join("-") + "T" + b.time
    );
    return dateA - dateB;
  });

  const showtimes2D = sortedShowtimes.filter(
    (showtime) => showtime.date === selectedDate && showtime.type === "2D"
  );
  const showtimes3D = sortedShowtimes.filter(
    (showtime) => showtime.date === selectedDate && showtime.type === "3D"
  );

  const isPastShowtime = (date, time) => {
    const showtimeDate = new Date(
      `${date.split("/").reverse().join("-")}T${time}`
    );
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
        <CustomTab
          label={<CustomTabLabel {...getFormattedDate(0)} />}
          sx={{ marginRight: 2 }}
        />
        <CustomTab
          label={<CustomTabLabel {...getFormattedDate(1)} />}
          sx={{ marginRight: 2 }}
        />
        <CustomTab label={<CustomTabLabel {...getFormattedDate(2)} />} />
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
          Standard 2D
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {showtimes2D.map((showtime) => (
            <Box
              key={showtime.id}
              sx={{
                border: "1px solid",
                borderColor: isPastShowtime(showtime.date, showtime.time)
                  ? "gray"
                  : (theme) => theme.palette.secondary.main,
                padding: 1,
                borderRadius: 1,
                transition: "transform 0.1s",
                cursor: isPastShowtime(showtime.date, showtime.time)
                  ? "default"
                  : "pointer",
                "&:hover": {
                  transform: isPastShowtime(showtime.date, showtime.time)
                    ? "none"
                    : "translateY(-4px)",
                },
              }}
            >
              <Typography
                sx={{
                  color: "gray",
                  fontSize: 14,
                  color: isPastShowtime(showtime.date, showtime.time)
                    ? "gray"
                    : (theme) => theme.palette.secondary.main,
                }}
              >
                {showtime.time}
              </Typography>
            </Box>
          ))}
        </Box>
        <Typography
          sx={{
            fontWeight: "medium",
            marginY: 2,
            fontSize: 26,
            color: "lightgray",
            letterSpacing: "0.1em",
          }}
        >
          Standard 3D
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {showtimes3D.map((showtime) => (
            <Box
              key={showtime.id}
              sx={{
                border: "1px solid",
                borderColor: isPastShowtime(showtime.date, showtime.time)
                  ? "gray"
                  : (theme) => theme.palette.secondary.main,
                padding: 1,
                borderRadius: 1,
                transition: "transform 0.1s",
                cursor: isPastShowtime(showtime.date, showtime.time)
                  ? "default"
                  : "pointer",
                "&:hover": {
                  transform: isPastShowtime(showtime.date, showtime.time)
                    ? "none"
                    : "translateY(-4px)",
                },
              }}
            >
              <Typography
                sx={{
                  color: "gray",
                  fontSize: 14,
                  color: isPastShowtime(showtime.date, showtime.time)
                    ? "gray"
                    : (theme) => theme.palette.secondary.main,
                }}
              >
                {showtime.time}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const CustomTabLabel = ({ displayDate, weekday }) => (
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