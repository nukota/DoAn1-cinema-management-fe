import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StyleIcon from "@mui/icons-material/Style";
import PublicIcon from "@mui/icons-material/Public";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { Button, Dialog, DialogContent, Rating } from "@mui/material";
import ShowTimes from "./elements/ShowTimes";
import BookingInfo from "./elements/BookingInfo";
import BookingFooter from "./elements/BookingFooter";
import {
  MovieType,
  SeatType,
  ProductType,
  ShowtimeType,
} from "../../interfaces/types";
import { useMovies } from "../../providers/MoviesProvider";
import { useShowtimes } from "../../providers/ShowtimesProvider";
import { useSeats } from "../../providers/SeatProvider";
import { useProducts } from "../../providers/ProductsProvider";
import { useTimer } from "../../providers/page/TimerProvider";
import { useSetting } from "../../providers/SettingProvider";

const MovieDetail: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { stopTimer } = useTimer();
  const { setting } = useSetting();
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchMovieById, loading: movieLoading } = useMovies();
  const {
    fetchShowtimesByMovieId,
    showtimesByMovieId,
    loading: showtimesLoading,
  } = useShowtimes();
  const { seats, fetchSeatsByShowtimeId } = useSeats();
  const {
    products,
    fetchProductsData,
    loading: productsLoading,
  } = useProducts();
  const [movie, setMovie] = useState<MovieType | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    { product: ProductType; amount: number }[]
  >([]);
  const [ticketCount, setTicketCount] = useState<number>(0);
  const [selectedShowtime, setSelectedShowtime] = useState<ShowtimeType | null>(
    null
  );
  const seatSectionRef = useRef<HTMLDivElement>(null);
  const totalPrice = React.useMemo(() => {
    const seatPrice = selectedSeats.length * (selectedShowtime?.price || 0);
    const productPrice = selectedProducts.reduce(
      (total, item) => total + item.product.price * item.amount,
      0
    );
    return seatPrice + productPrice;
  }, [selectedSeats, selectedShowtime, selectedProducts]);
  const showtimeIdFromState = location.state?.showtimeId || null;
  
  useEffect(() => {
    if (showtimeIdFromState && showtimesByMovieId.length > 0) {
      const matchedShowtime = showtimesByMovieId.find(
        (showtime) => showtime._id === showtimeIdFromState
      );
      if (matchedShowtime) {
        setSelectedShowtime(matchedShowtime);
        seatSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [showtimeIdFromState, showtimesByMovieId]);

  useEffect(() => {
    const fetchMovie = async () => {
      if (movieId) {
        try {
          const fetchedMovie = await fetchMovieById(movieId);
          setMovie(fetchedMovie);
        } catch (error) {
          console.error("Failed to fetch movie:", error);
        }
      }
    };

    const fetchShowtimes = async () => {
      if (movieId) {
        try {
          await fetchShowtimesByMovieId(movieId);
        } catch (error) {
          console.error("Failed to fetch showtimes:", error);
        }
      }
    };

    const fetchProducts = async () => {
      try {
        await fetchProductsData();
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchMovie();
    fetchShowtimes();
    fetchProducts();
  }, [movieId]);

  useEffect(() => {
    const fetchSeats = async () => {
      if (selectedShowtime) {
        try {
          await fetchSeatsByShowtimeId(selectedShowtime._id);
        } catch (error) {
          console.error("Failed to fetch seats:", error);
        }
      }
    };

    fetchSeats();
  }, [selectedShowtime]);

  // useEffect(() => {
  //   return () => {
  //     if (!location.pathname.startsWith("/payment")) {
  //       stopTimer();
  //     }
  //   };
  // }, [stopTimer, navigate]);

  if (movieLoading || showtimesLoading || productsLoading) {
    return (
      <div className="text-white text-center text-xl mt-10">
        Loading movie details...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-white text-center text-xl mt-10">
        Movie not found
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen w-full flex flex-col">
      <img
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src={movie.poster_url}
        style={{
          filter: "blur(10px)",
          opacity: 0.2,
        }}
        alt={`${movie.title} poster`}
      />
      <div className="flex flex-col w-full py-32 h-[100%]">
        <div className="px-[16%]">
          <MovieInfo movie={movie} />
          <div className="flex flex-col mt-24">
            <div className="text-white text-4xl font-bold self-center">
              SHOWTIMES
            </div>
            <ShowTimes
              showtimes={showtimesByMovieId}
              selectedShowtime={selectedShowtime}
              onSelectShowtime={(showtime) => setSelectedShowtime(showtime)}
            />
          </div>
          <div className="flex flex-col mt-24">
            <div className="text-white text-4xl font-bold self-center">
              BOOKING INFO
            </div>
          </div>
          <div ref={seatSectionRef}>
            <BookingInfo
              seats={seats}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              price={selectedShowtime?.price}
              ticketCount={ticketCount}
              setTicketCount={setTicketCount}
              products={products}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              reservationTime={setting?.reservation_time || 10}
            />
          </div>
        </div>
      </div>
      <div className="w-full bg-black z-20 mt-32"></div>
      <div className="overflow-hidden">
        <BookingFooter
          movie={movie}
          totalPrice={totalPrice}
          selectedProducts={selectedProducts}
          selectedShowtime={selectedShowtime}
          selectedSeats={selectedSeats}
        />
      </div>
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Formats to dd/mm/yyyy
  };

  return (
    <div className="flex flex-row z-10">
      <img
        className="w-[400px] h-[600px] z-10 object-cover border border-light-gray rounded-md"
        src={movie.poster_url}
        alt={`${movie.title} poster`}
      />
      <div>
        <div className="text-sm text-gray flex flex-col py-4 pl-6">
          <div className="text-sm text-gray pl-2 flex flex-col space-y-6">
            <div className="text-white text-4xl font-bold">{movie.title}</div>
            <div className="text-white text-lg tracking-wide space-y-2 pl-4">
              <div>
                <StyleIcon
                  sx={{
                    fontSize: 24,
                    color: "#ebd113",
                    marginRight: 1.5,
                  }}
                />
                {movie.genre.join(", ")}
              </div>
              <div>
                <AccessTimeIcon
                  sx={{
                    fontSize: 24,
                    color: "#ebd113",
                    marginRight: 1.5,
                  }}
                />
                {formatDuration(movie.duration)}
              </div>
              <div>
                <PublicIcon
                  sx={{
                    fontSize: 24,
                    color: "#ebd113",
                    marginRight: 1.5,
                  }}
                />
                {movie.country}
              </div>
              <div>
                <PersonOffIcon
                  sx={{
                    fontSize: 24,
                    color: "#ebd113",
                    marginRight: 1.5,
                  }}
                />
                T{movie.age_limit}
              </div>
            </div>
            <div className="pt-6">
              <div
                className="text-white text-xl font-semibold"
                style={{ fontFamily: "Poppins" }}
              >
                MORE INFORMATION:
              </div>
              <div className="text-sm mt-2">
                <strong>Director:</strong> {movie.director}
              </div>
              <div className="text-sm mt-2">
                <strong>Cast:</strong> {movie.actors.join(", ")}
              </div>
              <div className="text-sm mt-2">
                <strong>Release Date:</strong> {formatDate(movie.release_date)}
              </div>
              <div className="text-sm mt-2 flex items-center">
                <strong>Rating:</strong>
                <Rating
                  value={movie.rating}
                  precision={0.5}
                  readOnly
                  sx={{ ml: 1 }}
                  max={5}
                />
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
                  src={getEmbedUrl(movie.trailer_url)}
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
