import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StyleIcon from "@mui/icons-material/Style";
import PublicIcon from "@mui/icons-material/Public";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import UserHeader from "./elements/Header";
import Footer from "./elements/Footer";
import { Button, Dialog, DialogContent } from "@mui/material";
import ShowTimes from "./elements/ShowTimes";
import BookingInfo from "./elements/BookingInfo";
import BookingFooter from "./elements/BookingFooter";
import {
  exampleShowtimes,
  exampleSeats,
  exampleProducts,
  exampleMovies,
} from "../../data";
import { MovieType, SeatType, ProductType } from "../../interfaces/types";

const MovieDetail: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieType | undefined>(undefined);
  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    { product: ProductType; amount: number }[]
  >([]);
  const [ticketCount, setTicketCount] = useState<number>(0);

  useEffect(() => {
    const foundMovie = exampleMovies.find(
      (m) => m.movie_id === parseInt(movieId || "", 10)
    );
    setMovie(foundMovie);
  }, [movieId]);

  if (!movie) {
    return <div className="text-white text-center text-xl mt-10">Movie not found</div>;
  }

  return (
    <div className="bg-black min-h-screen w-full flex flex-col">
      <UserHeader />
      <img
        className="absolute top-0 w-full object-cover z-0 overflow-hidden"
        src={movie.poster}
        style={{
          filter: "blur(10px)",
          opacity: 0.2,
        }}
        alt={`${movie.name} poster`}
      />
      <div className="flex flex-col w-full py-32 h-[100%]">
        <div className="px-[16%]">
          <MovieInfo movie={movie} />
          <div className="flex flex-col mt-24">
            {/* <div className="text-white text-4xl font-bold self-center">
              SHOWTIMES
            </div>
            <ShowTimes showtimes={exampleShowtimes} /> */}
          </div>
          <div className="flex flex-col mt-24">
            <div className="text-white text-4xl font-bold self-center">
              BOOKING INFO
            </div>
          </div>
          <BookingInfo
            seats={exampleSeats}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            ticketCount={ticketCount}
            setTicketCount={setTicketCount}
            products={exampleProducts}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
          />
        </div>
      </div>
      <div className="w-full bg-black z-20 mt-32">
        <Footer />
      </div>
      //see if the footer is in the right place
      <BookingFooter movie={movie} selectedProducts={selectedProducts} />
    </div>
  );
};

export default MovieDetail;

interface MovieInfoProps {
  movie: MovieType;
  onClickOpen?: () => void;
}

const MovieInfo: React.FC<MovieInfoProps> = ({ movie }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  return (
    <div className="flex flex-row z-10">
      <img
        className="w-[400px] h-[600px] z-10 object-cover border border-light-gray rounded-md"
        src={movie.poster}
        alt={`${movie.name} poster`}
      />
      <div>
        <div className="text-sm text-gray flex flex-col py-4 pl-6">
          <div className="text-sm text-gray pl-2 flex flex-col space-y-6">
            <div className="text-white text-4xl font-bold">{movie.name}</div>
            <div className="text-white text-lg tracking-wide space-y-2 pl-4">
              <div>
                <StyleIcon
                  sx={{
                    fontSize: 24,
                    color: "#ebd113",
                    marginRight: 1.5,
                  }}
                />
                {movie.genre}
              </div>
              <div>
                <AccessTimeIcon
                  sx={{
                    fontSize: 24,
                    color: "#ebd113",
                    marginRight: 1.5,
                  }}
                />
                {movie.duration}
              </div>
              <div>
                <PublicIcon
                  sx={{
                    fontSize: 24,
                    color: "#ebd113",
                    marginRight: 1.5,
                  }}
                />
                {movie.nation}
              </div>
              <div>
                <PersonOffIcon
                  sx={{
                    fontSize: 24,
                    color: "#ebd113",
                    marginRight: 1.5,
                  }}
                />
                T{movie.ageLimit}
              </div>
            </div>
            <div className="pt-6">
              <div
                className="text-white text-xl font-semibold"
                style={{ fontFamily: "Roboto" }}
              >
                MORE INFORMATION:
              </div>
              <div className="text-sm mt-2">
                <strong>Director:</strong> {movie.director}
              </div>
              <div className="text-sm mt-2">
                <strong>Cast:</strong> {movie.cast}
              </div>
              <div className="text-sm mt-2">
                <strong>Release Date:</strong> {movie.releaseDate}
              </div>
              <div className="text-sm mt-2">
                <strong>Rating:</strong> {movie.rating}
              </div>
            </div>
            <div className="pt-6">
              <div
                className="text-white text-xl font-semibold"
                style={{ fontFamily: "Roboto" }}
              >
                MOVIE CONTENT:
              </div>
              <div className="text-sm">{movie.description}</div>
            </div>
            <Button
              variant="text"
              color="secondary"
              startIcon={<PlayCircleIcon sx={{ fontSize: 12 }} />}
              onClick={handleClickOpen}
              sx={{
                width: "200px",
                fontSize: 18,
                fontWeight: 600,
                marginLeft: -2,
              }}
              className="flex-shrink-0"
            >
              Watch Trailer
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="lg">
              <DialogContent>
                <iframe
                  width="1000"
                  height="562.5"
                  src={getEmbedUrl(movie.trailer)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Trailer"
                ></iframe>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};
