import React from "react";
import infoImg from "../../../assets/images/info.svg";
import { exampleMovies } from "../../../data";
import { MovieType } from "../../../types";

interface RoomProps {
  room_id: number;
  cinema_id: number;
  name: string;
  seat_count: number;
  repairing: boolean;
}

//get room status, playing movie using API here
const statuses = ["Ready", "Playing", "Repairing", "Unknown"];
const status : string = statuses[Math.floor(Math.random() * statuses.length)];
const movies = exampleMovies.map((movie) => movie);
const movie : MovieType = movies[Math.floor(Math.random() * statuses.length)];

const Room: React.FC<RoomProps> = (room) => {
  const handleInfoClick = () => {
    alert("Info Btn clicked");
  };

  const handleSeeShowTimeClick = () => {
    alert("SeeShowTime Btn clicked");
  };

  return (
    <div className="flex flex-col w-[170px] h-[210px] border-[3px] border-light-gray rounded-xl hover:border-light-gray duration-200">
      <button className="info-button w-9 h-9 z-20" onClick={handleInfoClick}>
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
            <span className="text-white">{room.seat_count}</span>
          </p>
          <p className="movie-playing h-[42px] w-full">
            <span>Playing: </span>
            <span className="text-gray">{movie.name}</span>
          </p>
        </div>
      </div>
      <button
        className="bg-red w-[136px] h-[32px] items-center self-center mt-[10px] rounded-md hover:bg-dark-red duration-200"
        onClick={handleSeeShowTimeClick}
      >
        <span className="text-[14px] font-medium">See Show Time</span>
      </button>
    </div>
  );
};

export default Room;
