import { useState, useEffect } from "react";
import Movie from "./items/Movie";
import { MovieType } from "../../interfaces/types";
import DetailMovie from "./dialogs/DetailMovie";
import CreateMovie from "./dialogs/CreateMovie";
import { useMovies } from "../../providers/MoviesProvider";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { confirmDeletion } from "../../utils/confirmDeletion";
import CustomTabs from "./elements/Tabs";

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
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);
  const [DetailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [AddDialogOpen, setAddDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchMoviesData();
  }, []);

  const handleAddNewClick = () => {
    setAddDialogOpen(true);
  };

  const handleInfoClick = (movie: MovieType) => {
    setSelectedMovie(movie);
    setDetailDialogOpen(true);
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
      setSelectedMovie(updatedMovie);
      await fetchMoviesData();
      toast.success("Movie updated successfully!");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  const handleDeleteMovie = async (movie: MovieType) => {
    const confirmed = await confirmDeletion(
      "Delete Movie",
      `Are you sure you want to delete "${movie.title}"? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await deleteMovie(movie._id);
        await fetchMoviesData();
        handleCloseDialog();
        toast.success("Movie deleted successfully!");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : String(error));
      }
    } else {
      toast.info("Deletion canceled.");
    }
  };

  const movieTabs = [
    { label: "All", value: "All" },
    { label: "Now Playing", value: "Now Playing" },
    { label: "Coming Soon", value: "Coming Soon" },
    { label: "Stopped", value: "Stopped" },
  ];

  return (
    <>
      <CustomTabs
        title="Movies"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={movieTabs}
        loading={loading}
        data={movies}
        gridCols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7"
        gap="gap-4"
        onAddNew={handleAddNewClick}
        dateColumns={["release_date"]}
        searchColumns={[
          "_id",
          "title",
          "status",
          "director",
          "actors",
          "genre",
          "country",
          "description",
        ]}
      >
        {(filteredMovies: MovieType[]) =>
          filteredMovies.map((movie) => (
            <Movie
              key={movie._id}
              movie={movie}
              handleInfoClick={() => handleInfoClick(movie)}
            />
          ))
        }
      </CustomTabs>
      {selectedMovie && (
        <DetailMovie
          open={DetailDialogOpen}
          movie={selectedMovie}
          onClose={handleCloseDialog}
          onDelete={() => handleDeleteMovie(selectedMovie)}
          onSave={handleOnSave}
        />
      )}
      <CreateMovie
        open={AddDialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleAddNewMovie}
      />
    </>
  );
};

export default Movies;
