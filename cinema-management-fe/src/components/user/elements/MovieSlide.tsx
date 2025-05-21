import SlideItem from "../items/SlideItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation } from "swiper/modules";
import { MovieType } from "../../../interfaces/types";
import "swiper/swiper-bundle.css";

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
