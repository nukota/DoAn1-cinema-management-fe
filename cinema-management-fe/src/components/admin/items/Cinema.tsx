import React from "react"
import { CinemaType } from "../../../types"

const Cinema: React.FC<CinemaType> = (cinema) => {
  return (
    <div className="cinema w-[140px] h-[200px]">
      <div className="cinema-img flex w-[130px] h-[150px] border-2 border-red rounded-xl items-center justify-center bg-gradient-to-b from-white to-white p-2">
        {/* <img className="max-h-[100px] max-w-[100px]" src={cinema.image} alt={cinema.name} /> */}
      </div>
      <div className="cinema-info flex flex-col mt-1">
        {/* <p className="text-[13px] font-normal text-white tracking-wider truncate">
          {cinema.name}
        </p>
        {cinema.description && (
          <p className="text-[11px] font-normal text-white tracking-wider truncate">
            {cinema.description}
          </p>
        )}
        <p className="text-[11px] font-light text-gray tracking-wider truncate">
          ${cinema.price}
        </p> */}
      </div>
    </div>
  )
}

export default Cinema