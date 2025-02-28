import React from "react"
import infoImg from "../../../assets/images/info.svg"

interface TheaterProps {
  Id: number
  status: "Ready" | "Playing" | "Repairing" | "Unknown"
  capacity: number
  playing: string
}

const Theater: React.FC<TheaterProps> = ({ Id, status, capacity, playing }) => {
  const handleInfoClick = () => {
    alert("Info Btn clicked")
  }

  const handleSeeShowTimeClick = () => {
    alert("SeeShowTime Btn clicked")
  }

  return (
    <div className="flex flex-col w-[170px] h-[210px] border-[3px] border-light-gray rounded-xl hover:border-light-gray duration-200">
      <button className="info-button w-9 h-9 z-20" onClick={handleInfoClick}>
        <img className="size-7 ml-1" src={infoImg} alt="info" />
      </button>
      <div className="theater-infoflex px-2 -mt-7 w-[170px] flex-col overflow-hidden">
        <p className="flex justify-center text-[32px] font-medium text-white truncate mb-2">
          {Id}
        </p>
        <div className="text-[14px] text-white truncate mx-2">
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
            <span className="text-white">{capacity}</span>
          </p>
          <p className="movie-playing h-[42px] w-full">
            <span>Playing: </span>
            <span className="text-gray">{playing}</span>
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
  )
}

export default Theater