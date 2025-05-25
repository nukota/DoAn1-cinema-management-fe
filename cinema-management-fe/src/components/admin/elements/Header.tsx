import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.svg";
import NotificationImg from "../../../assets/images/notification.svg";
import MessageImg from "../../../assets/images/messageQuestion.svg";
import CalendarImg from "../../../assets/images/calendar.svg";
import ArrowDownImg from "../../../assets/images/arrowDown.svg";
import profileImg from "../../../assets/images/profile.png";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { useAuth } from "../../../providers/AuthProvider";

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isLoggedIn, fetchUserProfile, userProfile, handleLogout } = useAuth();
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSeeProfile = () => {
    navigate("/admin/profile");
    handleMenuClose();
  };

  const handleLoginClick = () => {
    navigate("/user/login");
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

  const handleGoToEmployeePage = () => {
    navigate("/employee");
  };

  const handleGoToAdminPage = () => {
    navigate("/admin");
  };

  const handleCalendarClick = () => {
    // alert("Calendar clicked")
  };
  const handleMessageClick = () => {
    // alert("Message clicked")
  };
  const handleNotificationClick = () => {
    // alert("Notification clicked")
  };

  return (
    <header
      className={`header fixed top-0 left-0 z-[999] bg-white w-[100vw] h-[48px] flex items-center p-4 border-b-[2px] border-light-gray`}
    >
      <Link to="/admin" className="logo pl-3 shrink-0 w-60 md:block hidden">
        <img src={logo} alt="Clinic logo" />
      </Link>
      <div className="md:block hidden border-l-[2px] border-light-gray absolute left-56 h-[48px]" />
      <div className="flex items-center ml-auto mr-3 w-[calc(100vw - 240px)] space-x-2 flex-shrink-0">
        {isAdmin && location.pathname.startsWith("/employee") && (
          <Button
            variant="outlined"
            size="small"
            color="primary"
            sx={{
              borderRadius: "20px",
              fontSize: "14px",
              textTransform: "none",
              marginRight: "16px",
            }}
            onClick={handleGoToAdminPage}
          >
            Admin Page
          </Button>
        )}
        {isAdmin && location.pathname.startsWith("/admin") && (
          <Button
            variant="outlined"
            size="small"
            color="primary"
            sx={{
              borderRadius: "20px",
              fontSize: "14px",
              textTransform: "none",
              marginRight: "16px",
            }}
            onClick={handleGoToEmployeePage}
          >
            Employee Page
          </Button>
        )}
        <div className="space-x-3">
          <button
            className="header-calendar hover:transform hover:-translate-y-1 transition-transform duration-200"
            onClick={handleCalendarClick}
          >
            <img className="size-6" src={CalendarImg} alt="Calendar" />
          </button>
          <button
            className="header-message hover:transform hover:-translate-y-1 transition-transform duration-200"
            onClick={handleMessageClick}
          >
            <img className="size-6" src={MessageImg} alt="Message" />
          </button>
          <button
            className="header-notification hover:transform hover:-translate-y-1 transition-transform duration-200"
            onClick={handleNotificationClick}
          >
            <img className="size-6" src={NotificationImg} alt="Notification" />
          </button>
        </div>
        {isLoggedIn ? (
          <div className="flex">
            <div className="profile-info flex flex-col text-right leading-snug">
              <span className="profile-name text-dark-gray text-[14px]">
                {userProfile?.full_name}
              </span>
              <span className="profile-role text-dark-gray text-[12px]">
                {userProfile?.role}
              </span>
            </div>
            <img
              className="profile-pic size-10 rounded-full"
              src={profileImg}
            />
            <IconButton onClick={handleMenuOpen}>
              <img src={ArrowDownImg} alt="Arrow Down" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  navigate("/user");
                  handleMenuClose();
                }}
              >
                User Page
              </MenuItem>
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

export default Header;
