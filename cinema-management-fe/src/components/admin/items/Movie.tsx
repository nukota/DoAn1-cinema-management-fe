import React from "react";
import { MovieType } from "../../../interfaces/types";

interface MovieProps {
  movie: MovieType;
  handleInfoClick: () => void;
}

const Movie: React.FC<MovieProps> = ({ movie, handleInfoClick }) => {
  return (
    <div className="movie h-[216px] w-[140px] flex flex-col bg-[#eee]" onClick={handleInfoClick}>
      <img
        className="h-[160px] w-full rounded-xl object-cover"
        src={movie.poster_url}
        alt="movie poster"
      />
      <div className="font-medium text-[13px] text-black tracking-wide truncate mt-3">
        {movie.title}
      </div>
      <div className="flex flex-row items-center space-x-[6px]">
        <div className="font-bold text-[13px] text-gray">
          {movie.release_date}
        </div>
        {(movie.status === "Now Playing" && (
          <div className="font-medium text-[11px] text-green-800">
            {movie.status}
          </div>
        )) ||
          (movie.status === "Coming Soon" && (
            <div className="font-medium text-[11px] text-sky-800">
              {movie.status}
            </div>
          )) ||
          (movie.status === "Stopped" && (
            <div className="font-medium text-[11px] text-rose-800">
              {movie.status}
            </div>
          )) ||
          (movie.status === "Unknown" && (
            <div className="font-medium text-[11px] text-gray">
              {movie.status}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Movie;
