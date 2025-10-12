import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Mic, CameraAlt } from "@mui/icons-material";
import SlideItem from "./items/SlideItem";
import { MovieType } from "../../interfaces/types";
import { useMovies } from "../../providers/MoviesProvider";
import wallPaperImg from "../../assets/images/wallpaper.jpg";
import { toast } from "react-toastify";

const MovieList: React.FC = () => {
  const { movies, fetchMoviesData } = useMovies();
  const [filteredMovies, setFilteredMovies] = useState<MovieType[]>([]);
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

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

  const handleVoiceSearch = () => {
    // Check if speech recognition is supported
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      toast.error("Voice search is not supported in this browser");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    setIsListening(true);
    toast.info("Listening... Speak now!", { autoClose: 2000 });

    recognition.start();

    recognition.onstart = () => {
      console.log("Voice recognition started");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchValue(transcript);

      // Filter movies in real-time
      const filtered = movies.filter((movie: MovieType) =>
        movie.title.toLowerCase().includes(transcript.toLowerCase())
      );
      setFilteredMovies(filtered);

      // Only show success on final result
      if (event.results[0].isFinal) {
        setIsListening(false);
        toast.success(`Searching for: "${transcript}"`, { autoClose: 2000 });
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);

      if (event.error === "no-speech") {
        toast.warning("No speech detected. Please try again.");
      } else if (event.error === "not-allowed") {
        toast.error(
          "Microphone access denied. Please allow microphone access."
        );
      } else {
        toast.error("Voice search failed. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log("Voice recognition ended");
    };
  };

  const handleImageSearch = async () => {
    // Create a file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event: any) => {
      const file = event.target.files[0];
      if (!file) return;

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        return;
      }

      setIsProcessingImage(true);
      toast.info("Processing image... Please wait.", { autoClose: false });

      try {
        // Create a URL for the image
        const imageUrl = URL.createObjectURL(file);

        // Import Tesseract.js dynamically
        const Tesseract = await import("tesseract.js");

        // Perform OCR on the image
        const result = await Tesseract.recognize(imageUrl, "eng", {
          logger: (m: any) => {
            if (m.status === "recognizing text") {
              console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
            }
          },
        });

        // Clean up the URL
        URL.revokeObjectURL(imageUrl);

        // Extract text from the result
        const extractedText = result.data.text.trim();

        if (!extractedText) {
          toast.dismiss();
          toast.warning(
            "No text found in the image. Please try another image."
          );
          setIsProcessingImage(false);
          return;
        }

        // Extract potential movie titles (look for capitalized words/phrases)
        const lines = extractedText
          .split("\n")
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 2);

        // Use the first meaningful line or the longest line as search query
        const searchQuery =
          lines.find((line: string) => /^[A-Z]/.test(line)) ||
          lines.reduce(
            (a: string, b: string) => (a.length > b.length ? a : b),
            ""
          );

        if (searchQuery) {
          setSearchValue(searchQuery);
          toast.dismiss();
          toast.success(`Found text: "${searchQuery}"`, { autoClose: 2000 });

          // Filter movies based on extracted text
          const filtered = movies.filter((movie: MovieType) =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredMovies(filtered);
        } else {
          toast.dismiss();
          toast.warning("Could not extract meaningful text from the image.");
        }
      } catch (error) {
        console.error("Image processing error:", error);
        toast.dismiss();
        toast.error("Failed to process image. Please try again.");
      } finally {
        setIsProcessingImage(false);
      }
    };

    input.click();
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
      <div
        className="absolute w-full h-[100vh] top-[0vh] pointer-events-none z-[-1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,1) 100%)",
        }}
      />
      <img
        className="absolute w-full h-[100vh] top-0 z-0 opacity-15"
        src={wallPaperImg}
        alt="Wallpaper"
      />
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          fontFamily: "Jost",
          color: "white",
          marginBottom: 4,
          textAlign: "center",
          marginTop: 6,
          fontSize: { xs: "2.5rem", lg: "3rem", xl: "3.5rem" },
        }}
      >
        ALL MOVIES
      </Typography>
      <TextField
        placeholder="Search movies..."
        variant="outlined"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Tooltip title={isListening ? "Listening..." : "Voice Search"}>
                  <IconButton
                    size="small"
                    onClick={handleVoiceSearch}
                    disabled={isListening}
                    sx={{
                      color: isListening ? "#f44336" : "#999",
                      p: 0.5,
                      animation: isListening ? "pulse 1.5s infinite" : "none",
                      "@keyframes pulse": {
                        "0%": { opacity: 1 },
                        "50%": { opacity: 0.5 },
                        "100%": { opacity: 1 },
                      },
                    }}
                  >
                    <Mic fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={isProcessingImage ? "Processing..." : "Image Search"}
                >
                  <IconButton
                    size="small"
                    onClick={handleImageSearch}
                    disabled={isProcessingImage}
                    sx={{
                      color: isProcessingImage ? "#2196f3" : "#999",
                      p: 0.5,
                      animation: isProcessingImage
                        ? "spin 2s linear infinite"
                        : "none",
                      "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                      },
                    }}
                  >
                    <CameraAlt fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </InputAdornment>
          ),
          sx: {
            padding: "0 6px",
            height: "100%",
            fontSize: "0.875rem",
          },
        }}
        sx={{
          backgroundColor: "white",
          borderRadius: "4px",
          height: "30px",
          marginBottom: 4,
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
