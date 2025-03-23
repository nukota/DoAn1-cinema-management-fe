import React from "react";
import { CinemaType, RoomType } from "../../../types";
import { IconButton, Button } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

interface CinemaProps {
  cinema: CinemaType;
  handleSeeAllRooms: (cinema: CinemaType) => void;
}
const Cinema: React.FC<CinemaProps> = ({ cinema, handleSeeAllRooms }) => {
  return (
    <div className="cinema w-full min-w-[300px] h-[240px] lg:w-[340px] xl:w-[320px] lg:h-[240px] flex-shrink-0 flex-grow-0 rounded-xl bg-white border-red border-2 flex flex-col items-start justify-start relative overflow-clip">
      <div className="w-full flex items-start justify-between p-3 mt-3 z-10 relative">
        <>
          <span className="font-medium text-2xl ml-1">ID: </span>
          <span className="font-medium text-2xl ml-1">{cinema.cinema_id}</span>
        </>
        <span className="mr-auto text-2xl font-medium ml-3 self-center z-10">
          {cinema.name}
        </span>
        <IconButton className="absolute -right-1 -top-4 z-10" color="primary" size="small">
          <InfoIcon />
        </IconButton>
      </div>
      <div className="w-full flex flex-col items-start justify-between p-3 -mt-2 z-10">
        <p className="text-light-gray mt-0">Address: {cinema.address}</p>
        <div className="textx-black text-lg mt-2">
          <span>Rooms: </span>
          <span className="font-medium">10</span>
        </div>
        <div className="textx-black text-lg mt-2">
          <span>Employee: </span>
          <span className="font-medium">100</span>
        </div>
      </div>
      <div className="w-full text-[#fef5f5] text-[84px] absolute -top-10 -right-10 z-0 whitespace-nowrap text-overflow-clip">
        {cinema.name}
      </div>
      <Button
        color="primary"
        variant="contained"
        sx={{ width: "90%", placeSelf: "center", bottom: "10px", mt: 1 }}
        onClick={() => handleSeeAllRooms(cinema)}
      >
        See All Rooms
      </Button>
    </div>
  );
};

export default Cinema;
