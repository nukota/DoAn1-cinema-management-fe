import React from "react";
import { RoomType } from "../../../interfaces/types";
import { Button } from "@mui/material";

interface RoomProps {
  room: RoomType;
  handleInfoClick: () => void;
}

const Room: React.FC<RoomProps> = ({ room, handleInfoClick }) => {
  return (
    <div className="flex flex-col p-2 w-[170px] h-[180px] border-2 border-light-gray rounded-xl hover:border-light-gray duration-200">
      <div className="flex py-2 w-full flex-col overflow-hidden">
        <p className="flex justify-center text-[18px] font-medium text-dark-gray truncate mb-2">
          {room.name}
        </p>

        <div className="text-[16px] text-dark-gray truncate space-y-1 flex-col flex w-full overflow-ellipsis">
          <p className="h-[21px]">
            <span>Cinema: </span>
            <span className="text-black truncate">{room.cinema?.name}</span>
          </p>
          <p className="h-[21px]">
            <span>Capacity: </span>
            <span className="text-black truncate">{room.seat_count}</span>
          </p>
        </div>
      </div>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleInfoClick}
          sx={{
            mt: "auto",
            width: "100%",
            borderRadius: "8px",
          }}
        >
          View Info
        </Button>
    </div>
  );
};

export default Room;
