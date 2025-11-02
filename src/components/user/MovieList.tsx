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
import { useAuth } from "../../providers/AuthProvider";

const MovieList: React.FC = () => {
  const { movies, fetchMoviesData, fetchRecommendedMovies } = useMovies();
  const { userProfile, isLoggedIn } = useAuth();
  const [filteredMovies, setFilteredMovies] = useState<MovieType[]>([]);
  const [recommendedMovieIds, setRecommendedMovieIds] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchMoviesData();
      
      // Fetch recommended movies if user is logged in
      if (isLoggedIn && userProfile?._id) {
        try {
          const recommended = await fetchRecommendedMovies(userProfile._id);
          setRecommendedMovieIds(recommended);
        } catch (error) {
          console.error("Failed to fetch recommendations:", error);
          // Don't show error to user, just continue without recommendations
        }
      }
    };
    fetchData();
  }, [isLoggedIn, userProfile]);

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
      toast.info("Processing image with AI... Please wait.", { autoClose: false });

      try {
        // Convert image to base64
        const base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Remove data:image/xxx;base64, prefix
            const base64 = result.split(",")[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Get Google API key from environment
        const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
        
        if (!GOOGLE_API_KEY) {
          throw new Error("Google API key not configured");
        }

        // Call Gemini 2.0 API
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GOOGLE_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: "Extract any movie titles, actor names, or text related to movies from this image. Return only the most relevant text that could be used as a search query for movies. If you find multiple items, return the most prominent one. Keep the response short and concise - just the search term.",
                    },
                    {
                      inline_data: {
                        mime_type: file.type,
                        data: base64Image,
                      },
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Extract text from Gemini response
        const extractedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!extractedText) {
          toast.dismiss();
          toast.warning(
            "No relevant text found in the image. Please try another image."
          );
          setIsProcessingImage(false);
          return;
        }

        // Clean up the extracted text (remove quotes, extra spaces, etc.)
        const searchQuery = extractedText
          .replace(/["']/g, "")
          .trim()
          .split("\n")[0]; // Take only the first line if multiple

        if (searchQuery && searchQuery.length > 2) {
          setSearchValue(searchQuery);
          toast.dismiss();
          toast.success(`Found: "${searchQuery}"`, { autoClose: 2000 });

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
        toast.error(
          error instanceof Error 
            ? `Failed: ${error.message}` 
            : "Failed to process image. Please try again."
        );
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
          <SlideItem 
            key={movie._id} 
            movie={movie} 
            isRecommended={recommendedMovieIds.includes(movie._id)}
          />
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
