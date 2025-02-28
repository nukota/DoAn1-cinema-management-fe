import React from "react"

interface MovieProps {
  poster: string
  name: string
  releaseDate: string
  status: string
}

const Movie: React.FC<MovieProps> = ({ poster, name, releaseDate, status }) => {
  return (
    <div className="movie h-[200px] w-[140px] flex flex-col">
      <img
        className="h-[160px] w-full rounded-xl"
        src={poster}
        alt="movie poster"
      />
      <div className="font-medium text-[13px] text-white tracking-wide truncate">
        {name}
      </div>
      <div className="flex flex-row items-center space-x-[6px]">
        <div className="font-bold text-[13px] text-gray">{releaseDate}</div>
        {(status === "Now Playing" && (
          <div className="font-light text-[11px] text-green-800">{status}</div>
        )) ||
          (status === "Coming Soon" && (
            <div className="font-light text-[11px] text-sky-800">{status}</div>
          )) ||
          (status === "Stopped" && (
            <div className="font-light text-[11px] text-rose-800">{status}</div>
          )) ||
          (status === "Unknown" && (
            <div className="font-light text-[11px] text-gray">{status}</div>
          ))}
      </div>
    </div>
  )
}

export default Movie