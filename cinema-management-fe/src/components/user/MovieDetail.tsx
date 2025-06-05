import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
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
import { useSetting } from "../../providers/SettingProvider";
import MovieInfo from "./elements/MovieInfo";
import ReviewSection from "./elements/ReviewSection";

const MovieDetail: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { setting, getSetting } = useSetting();
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
    getSetting();
  }, []);

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
    console.log("Setting: ", setting);

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
      <div className="w-full bg-black z-20 mt-16"></div>
      <ReviewSection
        movieId={movie._id}
      />
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


