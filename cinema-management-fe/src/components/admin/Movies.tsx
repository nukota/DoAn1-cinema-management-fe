import { useState, ChangeEvent, useEffect } from "react";
import Movie from "./items/Movie";
import SearchImg from "../../assets/images/search.svg";
import CalendarImg from "../../assets/images/calendar.svg";
import addImg from "../../assets/images/add.svg";
import { MovieType } from "../../interfaces/types";
import DetailMovie from "./dialogs/DetailMovie";
import CreateMovie from "./dialogs/CreateMovie";
import { useMovies } from "../../providers/MoviesProvider";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

const Movies: React.FC = () => {
  const {
    movies,
    fetchMoviesData,
    createMovie,
    updateMovie,
    deleteMovie,
    loading,
  } = useMovies();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);
  const [DetailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [AddDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  useEffect(() => {
    fetchMoviesData();
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleCalendarClick = () => {
    document.getElementById("date-picker")?.focus();
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddNewClick = () => {
    setAddDialogOpen(true);
  };

  const handleInfoClick = (movie: MovieType) => {
    setSelectedMovie(movie);
    setDetailDialogOpen(true);
  };
  const handleCheckConfirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setAddDialogOpen(false);
    setSelectedMovie(null);
  };

  const handleAddNewMovie = async (newMovie: MovieType): Promise<boolean> => {
    try {
      await createMovie(newMovie);
      await fetchMoviesData();
      handleCloseDialog();
      toast.success("Movie added successfully!");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const handleOnSave = async (updatedMovie: MovieType): Promise<boolean> => {
    try {
      await updateMovie(updatedMovie);
      await fetchMoviesData();
      handleCloseDialog();
      toast.success("Movie updated successfully!");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const handleDeleteMovie = async (movieId: string): Promise<boolean> => {
    try {
      await deleteMovie(movieId);
      await fetchMoviesData();
      handleCloseDialog();
      toast.success("Movie deleted successfully!");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesTab = activeTab === "All" || movie.status === activeTab;
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      (movie.title && movie.title.toLowerCase().includes(searchTermLower)) ||
      (movie.status && movie.status.toLowerCase().includes(searchTermLower)) ||
      (movie.release_date && movie.release_date.includes(searchTermLower)) ||
      (movie.director && movie.director.includes(searchTermLower)) ||
      (movie.actors &&
        movie.actors.some((actor) =>
          actor.toLowerCase().includes(searchTermLower)
        )) ||
      (movie.genre &&
        movie.genre.some((genre) =>
          genre.toLowerCase().includes(searchTermLower)
        )) ||
      (movie.country &&
        movie.country.toLowerCase().includes(searchTermLower)) ||
      (movie.description &&
        movie.description.toLowerCase().includes(searchTermLower));
    return matchesTab && matchesSearch;
  });

  if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full pt-4">
          <CircularProgress />
          <span className="text-2xl text-gray mt-4">Loading movies...</span>
        </div>
      );
    }

  return (
    <div className="movies flex flex-col h-[673px]">
      <div className="text-40px font-medium text-dark-gray">Movies</div>
      <div className="flex items-center mt-4">
        <div className="DateFilterBar relative w-full max-w-[240px] h-8 -mt-2">
          <input
            type="date"
            id="date-picker"
            className="w-full h-full pr-5 pl-10 text-sm text-red rounded-full text-gray-700 bg-white border-red border-2 focus:outline-none focus:ring-1"
            value={selectedDate}
            onChange={handleDateChange}
          />
          <img
            src={CalendarImg}
            alt="Calendar"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer"
            style={{
              filter:
                "invert(10%) sepia(88%) saturate(6604%) hue-rotate(352deg) brightness(73%) contrast(105%)",
            }}
            onClick={handleCalendarClick}
          />
        </div>
        <div className="SearchBar relative ml-5 w-full max-w-[240px] h-8 -mt-2">
          <input
            type="text"
            className="size-full pl-10 pr-5 text-sm text-dark-gray rounded-full text-gray-700 bg-white border-line-gray border-2 focus:outline-none focus:ring-1"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <img
            src={SearchImg}
            alt="Search"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4"
          />
        </div>
      </div>
      <div className="movie-tabs flex mt-4 z-20">
        <button
          className={`tab ${activeTab === "All" ? "active" : ""}`}
          onClick={() => handleTabClick("All")}
        >
          <span>All</span>
        </button>
        <button
          className={`tab ${activeTab === "Now Playing" ? "active" : ""}`}
          onClick={() => handleTabClick("Now Playing")}
        >
          <span>Now Playing</span>
        </button>
        <button
          className={`tab ${activeTab === "Coming Soon" ? "active" : ""}`}
          onClick={() => handleTabClick("Coming Soon")}
        >
          <span>Coming Soon</span>
        </button>
        <button
          className={`tab ${activeTab === "Stopped" ? "active" : ""}`}
          onClick={() => handleTabClick("Stopped")}
        >
          <span>Stopped</span>
        </button>
      </div>
      <div className="content relative -mt-[2px]  min-w-[360px] sm:min-w-[680px] w-full h-full bg-white border-[2px] border-light-gray rounded-b-xl rounded-tr-xl rounded-tl-none pl-12 py-6 pr-4">
        <div className="list flex-1 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6  2xl:grid-cols-8 gap-y-8 max-h-[510px] py-3 overflow-y-auto">
          {filteredMovies.map((movie) => (
            <Movie
              key={movie._id}
              movie={movie}
              handleInfoClick={() => handleInfoClick(movie)}
            />
          ))}
        </div>
        <button
          className="absolute bottom-6 right-9 size-11 rounded-2xl bg-red hover:bg-dark-red duration-200"
          onClick={handleAddNewClick}
        >
          <img
            className="size-11 invert brightness-0"
            src={addImg}
            alt="Add New"
          />
        </button>
      </div>
      {selectedMovie && (
        <DetailMovie
          open={DetailDialogOpen}
          movie={selectedMovie!}
          onClose={handleCloseDialog}
          onDelete={() => handleDeleteMovie(selectedMovie!._id)}
          onSave={handleOnSave}
        />
      )}
      <CreateMovie
        open={AddDialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleAddNewMovie}
      />
    </div>
  );
};

export default Movies;
