import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Typography, TextField } from "@mui/material";
import SlideItem from "./items/SlideItem";
import { MovieType } from "../../interfaces/types";
import { useMovies } from "../../providers/MoviesProvider";

const MovieList: React.FC = () => {
  const { movies, fetchMoviesData } = useMovies();
  const [filteredMovies, setFilteredMovies] = useState<MovieType[]>([]);
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      await fetchMoviesData();
    };
    fetchData();
  }, []);

   useEffect(() => {
    const query = searchParams.get("query") || "";
    setSearchValue(query); 
    if (query) {
      const filtered = movies.filter((movie: MovieType) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies);
    }
  }, [searchParams, movies]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    const filtered = movies.filter((movie: MovieType) =>
      movie.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  return (
    <Box
      sx={{
        padding: 6,
        backgroundColor: "black",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          color: "#484848",
          marginBottom: 4,
          textAlign: "center",
          marginTop: 6,
          fontFamily: "Poppins",
        }}
      >
        ALL MOVIES
      </Typography>
      <TextField
        placeholder="Search movies..."
        variant="outlined"
        size="small"
        fullWidth
        sx={{
          marginBottom: 4,
          backgroundColor: "white",
          borderRadius: 100,
          maxWidth: 600,
        }}
        value={searchValue}
        onChange={handleSearchChange}
      />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
        }}
      >
        {filteredMovies.map((movie) => (
          <SlideItem key={movie._id} movie={movie} />
        ))}
      </Box>
      {filteredMovies.length === 0 && (
        <Typography
          variant="h6"
          sx={{ color: "white", textAlign: "center", marginTop: 4 }}
        >
          No movies found.
        </Typography>
      )}
    </Box>
  );
};
export default MovieList;
