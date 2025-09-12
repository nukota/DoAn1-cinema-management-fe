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
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchPhrase(transcript);
      navigate(`/user/movie-list?query=${encodeURIComponent(transcript)}`);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      toast.error("Voice search failed. Please try again.");
    };
  };

  const handleImageSearch = () => {
    // Create a file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        // For now, show toast. In a real app, you'd upload to an image recognition service
        toast.info(
          `Image search feature coming soon! Selected file: ${file.name}`
        );

        // Here you would typically:
        // 1. Upload the image to an AI service (Google Vision API, AWS Rekognition, etc.)
        // 2. Extract text/objects from the image
        // 3. Use the extracted information to search movies
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
                    <Tooltip title="Voice Search">
                      <IconButton
                        size="small"
                        onClick={handleVoiceSearch}
                        sx={{ color: "#999", p: 0.5 }}
                      >
                        <Mic fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Image Search">
                      <IconButton
                        size="small"
                        onClick={handleImageSearch}
                        sx={{ color: "#999", p: 0.5 }}
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
