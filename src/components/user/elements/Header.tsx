import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Tooltip,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import { Mic, CameraAlt } from "@mui/icons-material";
import logo from "../../../assets/images/logo.svg";
import NotificationImg from "../../../assets/images/notification.svg";
import ArrowDownImg from "../../../assets/images/arrowDown.svg";
import profileImg from "../../../assets/images/profile.png";
import { useAuth } from "../../../providers/AuthProvider";
import { toast } from "react-toastify";

const UserHeader: React.FC = () => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const { isLoggedIn, fetchUserProfile, userProfile, handleLogout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        if (isLoggedIn) {
          if (!userProfile) {
            const token = localStorage.getItem("accessToken");
            const email = localStorage.getItem("email");
            if (token && email) {
              await fetchUserProfile(token, email);
            }
          }
          setIsAdmin(userProfile?.role === "admin");
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        toast.error(error instanceof Error ? error.message : String(error));
      }
    };

    checkAdminRole();
  }, [isLoggedIn, fetchUserProfile, userProfile]);

  const handleSearchClick = () => {
    if (searchPhrase.trim()) {
      navigate(`/user/movie-list?query=${encodeURIComponent(searchPhrase)}`);
    }
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
      setSearchPhrase(transcript);

      // Only navigate on final result
      if (event.results[0].isFinal) {
        setIsListening(false);
        toast.success(`Searching for: "${transcript}"`, { autoClose: 2000 });
        navigate(`/user/movie-list?query=${encodeURIComponent(transcript)}`);
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
      toast.info("Processing image with AI... Please wait.", {
        autoClose: false,
      });

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
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
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
                      text: "Extract any movie titles or text related to movies from this image. Return only the most relevant text that could be used as a search query for movies. If you find multiple items, return the most prominent one. Keep the response short and concise - just the search term.",
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
        const extractedText =
          data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

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
          setSearchPhrase(searchQuery);
          toast.dismiss();
          toast.success(`Found: "${searchQuery}"`, { autoClose: 2000 });
          navigate(`/user/movie-list?query=${encodeURIComponent(searchQuery)}`);
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

  const handleNotificationClick = () => {
    // alert("Notification clicked");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    navigate("/user/login");
  };

  const handleBuyTicketClicked = () => {
    navigate("/user/movie-list");
  };

  const handleSeeProfile = () => {
    navigate("/user/profile");
    handleMenuClose();
  };

  const handleLogOut = async () => {
    try {
      await handleLogout();
      navigate("/user/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    } finally {
      handleMenuClose();
    }
  };

  return (
    <header
      className={`header fixed top-0 left-0 z-[1000] w-[100vw] h-[60px] flex items-center p-4`}
      style={{
        background:
          "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.85))",
      }}
    >
      <Link to="/" className="logo pl-3 shrink-0 w-56">
        <img
          src={logo}
          alt="Clinic logo"
          style={{ filter: "brightness(1.2)" }}
        />
      </Link>
      <Button
        variant="contained"
        size="small"
        color="primary"
        className="flex-shrink-0"
        onClick={handleBuyTicketClicked}
      >
        <p className="text-black"></p>Book Ticket Now
      </Button>

      <div className="flex items-center ml-auto mr-6 w-[calc(100vw - 240px)] space-x-4 flex-shrink-0">
        {location.pathname !== "/user/movie-list" && (
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            value={searchPhrase}
            onChange={(e) => setSearchPhrase(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearchClick();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Tooltip
                      title={isListening ? "Listening..." : "Voice Search"}
                    >
                      <IconButton
                        size="small"
                        onClick={handleVoiceSearch}
                        disabled={isListening}
                        sx={{
                          color: isListening ? "#f44336" : "#999",
                          p: 0.5,
                          animation: isListening
                            ? "pulse 1.5s infinite"
                            : "none",
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
                      title={
                        isProcessingImage ? "Processing..." : "Image Search"
                      }
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
            // color="primary"
            sx={{
              backgroundColor: "white",
              borderRadius: "4px",
              height: "30px",
              width: "240px",
            }}
          />
        )}
        <button
          className="header-notification hover:transform hover:-translate-y-1 transition-transform duration-200"
          onClick={handleNotificationClick}
        >
          <img
            className="size-6"
            src={NotificationImg}
            alt="Notification"
            style={{ filter: "invert(100%) brightness(200%)" }}
          />
        </button>
        {isLoggedIn ? (
          <div className="flex flex-row items-center space-x-2">
            <span className="profile-name text-light-gray text-sm">
              {userProfile!.full_name}
            </span>
            <img
              className="profile-pic size-8 rounded-[6px]"
              src={profileImg}
              alt="Profile"
            />
            <IconButton onClick={handleMenuOpen}>
              <img src={ArrowDownImg} alt="Arrow Down" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {isAdmin && (
                <MenuItem
                  onClick={() => {
                    navigate("/admin");
                    handleMenuClose();
                  }}
                >
                  Admin Page
                </MenuItem>
              )}
              <MenuItem onClick={handleSeeProfile}>See Profile</MenuItem>
              <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
            </Menu>
          </div>
        ) : (
          <>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={handleLoginClick}
            >
              SignIn or SignUp
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default UserHeader;
