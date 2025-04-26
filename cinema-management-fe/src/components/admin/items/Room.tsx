import React from "react";
import infoImg from "../../../assets/images/info.svg";
import { RoomType } from "../../../interfaces/types";
import { Button, Typography } from "@mui/material";

interface RoomProps {
  room: RoomType;
  handleInfoClick: () => void;
}

const Room: React.FC<RoomProps> = ({ room, handleInfoClick }) => {
  const handleSeeShowTimeClick = () => {};

  return (
    <div className="flex flex-col w-[170px] h-[180px] border-[3px] border-light-gray rounded-xl hover:border-light-gray duration-200">
      <button
        className="info-button w-9 h-9 z-20 opacity-50 hoverL"
        onClick={handleInfoClick}
      >
        <img className="size-7 ml-1" src={infoImg} alt="info" />
      </button>
      <div className="theater-infoflex px-2 w-[170px] flex-col overflow-hidden">
        <p className="flex justify-center text-[18px] font-medium text-dark-gray truncate mb-2">
          {room.name}
        </p>

        <div className="text-[16px] text-dark-gray truncate mx-2 space-y-1 flex-col flex">
          <p className="h-[21px]">
            <span>Cinema: </span>
            <span className="text-black">{room.cinema.name}</span>
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
