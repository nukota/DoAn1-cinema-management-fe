import React from "react";
import { MovieType } from "../../../interfaces/types";

interface MovieProps {
  movie: MovieType;
  handleInfoClick: () => void;
}

const Movie: React.FC<MovieProps> = ({ movie, handleInfoClick }) => {
  const formattedDate = new Date(movie.release_date).toLocaleDateString("en-US", {
    month: "2-digit",
    year: "numeric",
  });
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
      <div className="flex flex-row items-center">
        <div className="font-medium text-[13px] text-gray truncate">
          {formattedDate}
        </div>
        {(movie.status === "Now Playing" && (
          <div className="ml-auto font-semibold text-[12px] text-green-800">
            {movie.status}
          </div>
        )) ||
          (movie.status === "Coming Soon" && (
            <div className="ml-auto font-semibold text-[12px] text-sky-800">
              {movie.status}
            </div>
          )) ||
          (movie.status === "Stopped" && (
            <div className="ml-auto font-semibold text-[12px] text-rose-800">
              {movie.status}
            </div>
          )) ||
          (movie.status === "Unknown" && (
            <div className="ml-auto font-semibold text-[12px] text-gray">
              {movie.status}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Movie;
