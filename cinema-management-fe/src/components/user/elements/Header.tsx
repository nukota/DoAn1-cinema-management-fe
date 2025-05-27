import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TextField, InputAdornment, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../../assets/images/logo.svg";
import NotificationImg from "../../../assets/images/notification.svg";
import ArrowDownImg from "../../../assets/images/arrowDown.svg";
import profileImg from "../../../assets/images/profile.png";
import { useAuth } from "../../../providers/AuthProvider";
import { IconButton, Menu, MenuItem } from "@mui/material";

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
        if (!userProfile) {
          const token = localStorage.getItem("accessToken");
          const email = localStorage.getItem("email");
          if (token && email) {
            await fetchUserProfile(token, email);
          }
        }
        setIsAdmin(userProfile?.role === "admin");
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      }
    };

    checkAdminRole();
  }, [fetchUserProfile, userProfile]);

  const handleSearchClick = () => {
    if (searchPhrase.trim()) {
      navigate(`/user/movie-list?query=${encodeURIComponent(searchPhrase)}`);
    }
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
        sx={{ borderRadius: "20px" }}
        className="flex-shrink-0"
        onClick={handleBuyTicketClicked}
      >
        <p className="text-black text-sm font-semibold">Book Ticket Now</p>
      </Button>

      <div className="flex items-center ml-auto mr-6 w-[calc(100vw - 240px)] space-x-4 flex-shrink-0">
        {location.pathname !== "/user/movie-list" && (
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            value={searchPhrase}
            onChange={(e) => setSearchPhrase(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={handleSearchClick}
                    sx={{ minWidth: 0, padding: 0 }}
                  >
                    <SearchIcon />
                  </Button>
                </InputAdornment>
              ),
              sx: {
                padding: "0 8px",
                height: "100%",
                fontSize: "0.875rem",
              },
            }}
            sx={{
              backgroundColor: "white",
              borderRadius: "99px",
              height: "30px",
              width: "200px",
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
              sx={{ borderRadius: "20px", fontSize: "14px", color: "black" }}
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
