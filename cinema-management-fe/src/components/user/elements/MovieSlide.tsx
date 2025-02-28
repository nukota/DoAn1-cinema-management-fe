import SlideItem from "../items/SlideItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation } from "swiper/modules";
import { MovieType } from "../../../types";
import "swiper/swiper-bundle.css";

// const exampleSlideItems = [
//  {
//     poster: venomMovieImg,
//     name: "Venom: The Last Dance",
//     duration: "1h 52m",
//     genre: "Action",
//     nation: "US",
//     ageLimit: "16",
//     trailer: "https://youtu.be/o-3XPcvInmE?si=ljJ6N2AnQleV0YYU"
//   },

//   superLargeDesktop: {
//     breakpoint: { max: 4000, min: 3000 },
//     items: 7,
//   },
//   desktop: {
//     breakpoint: { max: 3000, min: 1024 },
//     items: 6,
//   },
//   tablet: {
//     breakpoint: { max: 1024, min: 464 },
//     items: 4.5,
//   },
//   mobile: {
//     breakpoint: { max: 464, min: 0 },
//     items: 3,
//   },
// };
interface MovieSlideProps {
  title: string;
  movies: MovieType[];
}
const MovieSlide: React.FC<MovieSlideProps> = ({ title, movies }) => {
  return (
    <div
      className={`movie-slide-container w-full flex flex-col overflow-visible px-4`}
    >
      <div className="text-white text-4xl font-bold tracking-wide pb-5 overflow-visible ml-12">
        {title}
      </div>
      <Swiper
        modules={[Navigation, Mousewheel]}
        spaceBetween={0}
        slidesPerView={5}
        loop={true}
        navigation
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1280: {
            slidesPerView: 5,
          },
        }}
        className="w-full movie-slide"
      >
        {movies.map((item, index) => (
          <SwiperSlide key={index}>
            <SlideItem movie={item} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-gradient-left"></div>
      <div className="swiper-gradient-right"></div>
    </div>
  );
};

export default MovieSlide;
