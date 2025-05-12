import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Typography, TextField } from "@mui/material";
import SlideItem from "./items/SlideItem";
import { MovieType } from "../../interfaces/types";
import { exampleMovies } from "../../data";

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<MovieType[]>(exampleMovies);
  const [filteredMovies, setFilteredMovies] = useState<MovieType[]>(exampleMovies);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const searchValue = searchParams.get("search") || "";
    if (searchValue) {
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies);
    }
  }, [searchParams, movies]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  return (
    <Box sx={{ padding: 6, backgroundColor: "black", minHeight: "100vh", width: "100vw" }}>
      <Typography
        variant="h2"
        sx={{ color: "white", marginBottom: 4, textAlign: "center", marginTop: 6, fontFamily: "Poppins" }}
      >
        Movie List
      </Typography>
      <TextField
        placeholder="Search movies..."
        variant="outlined"
        size="small"
        fullWidth
        sx={{ marginBottom: 4, backgroundColor: "white", borderRadius: 100, maxWidth: 600 }}
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
