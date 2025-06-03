import React, { useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StyleIcon from "@mui/icons-material/Style";
import PublicIcon from "@mui/icons-material/Public";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@mui/material";
import { MovieType } from "../../../interfaces/types";

interface SlideItemProps {
  movie: MovieType;
}

const SlideItem: React.FC<SlideItemProps> = ({ movie }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handlePlayTrailerClicked = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBuyTicketClicked = () => {
    const isLoggedIn = !!localStorage.getItem("accessToken");
    if (!isLoggedIn) {
      navigate("/user/login");
    } else {
      navigate(`/user/movie-detail/${movie._id}`);
    }
  };

  const getEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  if (!movie) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="slide-item relative flex-shrink-0 w-[240px] h-[490px] rounded-md overflow-hidden">
      <img
        className="absolute slide-item-poster w-[240px] h-[360px] object-cover rounded-md z-[9]"
        src={movie.poster_url}
        alt={`${movie.title} poster`}
      />
      <div className="text-xl font-medium text-white absolute top-[376px] w-full flex justify-center">
        <span className="truncate">{movie.title}</span>
      </div>
      <div className="absolute top-[426px] w-full items-center flex flex-row justify-between">
        <Button
          variant="text"
          size="small"
          color="secondary"
          startIcon={<PlayCircleIcon sx={{ fontSize: 10 }} />}
          sx={{ fontSize: 12, fontWeight: 600 }}
          onClick={handlePlayTrailerClicked}
        >
          Play Trailer
        </Button>
        <Button
          variant="contained"
          size="small"
          color="secondary"
          sx={{ fontSize: 12, fontWeight: 500, color: "#000", px: 2 }}
          onClick={handleBuyTicketClicked}
        >
          Buy Ticket
        </Button>
      </div>
      <div className="absolute slide-item-filter w-[240px] h-[360px] bg-black z-10" />
      <div className="absolute slide-item-info w-full h-[170px] z-[11]">
        <div className="text-white flex flex-col py-4 pl-6">
          <div className="text-[18px] my-2">{movie.title}</div>
          <div className="text-sm pl-2 flex flex-col space-y-2">
            <div>
              <StyleIcon sx={{ fontSize: 16, color: "#ebd113" }} />{" "}
              {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
            </div>
            <div>
              <AccessTimeIcon sx={{ fontSize: 16, color: "#ebd113" }} />{" "}
              {(() => {
              const hours = Math.floor(movie.duration / 60);
              const minutes = movie.duration % 60;
              return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
              })()}
            </div>
            <div>
              <PersonOffIcon sx={{ fontSize: 16, color: "#ebd113" }} />{" "}
              {movie.age_limit ? `T${movie.age_limit}` : "None"}
            </div>
            <div>
              <PublicIcon sx={{ fontSize: 16, color: "#ebd113" }} /> {movie.country}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={open} onClose={handleClose} maxWidth="lg">
        <DialogContent>
          <iframe
            width="1000"
            height="562.5"
            src={getEmbedUrl(movie.trailer_url)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Trailer"
          ></iframe>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SlideItem;