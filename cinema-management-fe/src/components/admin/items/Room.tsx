import React from "react";
import infoImg from "../../../assets/images/info.svg";
import { exampleMovies } from "../../../data";
import { MovieType, RoomType } from "../../../interfaces/types";
import { Button, Typography } from "@mui/material";

interface RoomProps {
  room: RoomType;
  handleInfoClick: () => void;
}

//get room status, playing movie using API here
const statuses = ["Ready", "Playing", "Repairing", "Unknown"];
const status: string = statuses[Math.floor(Math.random() * statuses.length)];
const movies = exampleMovies.map((movie) => movie);
const movie: MovieType = movies[Math.floor(Math.random() * statuses.length)];

const Room: React.FC<RoomProps> = ({ room, handleInfoClick }) => {
  const handleSeeShowTimeClick = () => {};

  return (
    <div className="flex flex-col w-[170px] h-[160px] border-[3px] border-light-gray rounded-xl hover:border-light-gray duration-200">
      <button
        className="info-button w-9 h-9 z-20 opacity-50 hoverL"
        onClick={handleInfoClick}
      >
        <img className="size-7 ml-1" src={infoImg} alt="info" />
      </button>
      <div className="theater-infoflex px-2 -mt-7 w-[170px] flex-col overflow-hidden">
        <p className="flex justify-center text-[32px] font-medium text-dark-gray truncate mb-2">
          {room.room_id}
        </p>
        <div className="text-[14px] text-dark-gray truncate mx-2">
          <p className="h-[21px]">
            <span>Status: </span>
            {(status === "Ready" && (
              <span className="text-yellow-400">{status}</span>
            )) ||
              (status === "Playing" && (
                <span className="text-green-600">{status}</span>
              )) ||
              (status === "Repairing" && (
                <span className="text-rose-700">{status}</span>
              )) ||
              (status === "Unknown" && (
                <span className="text-gray">{status}</span>
              ))}
          </p>
          <p className="h-[21px]">
            <span>Capacity: </span>
            <span className="text-black">{room.seat_count}</span>
          </p>
        </div>
      </div>
      <div className="mt-auto mb-2 mx-2">
        <Button
          variant="contained"
          size="small"
          color="primary"
          fullWidth
          onClick={handleSeeShowTimeClick}
        >
          <Typography fontSize="14px">See Show Time</Typography>
        </Button>
      </div>
    </div>
  );
};

export default Room;
