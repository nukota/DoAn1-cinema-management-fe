import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo.svg";
import NotificationImg from "../../../assets/images/notification.svg";
import MessageImg from "../../../assets/images/messageQuestion.svg";
import CalendarImg from "../../../assets/images/calendar.svg";
import ArrowDownImg from "../../../assets/images/arrowDown.svg";

interface HeaderProps {
  ProfileName: string;
  ProfileRole: string;
  ProfilePic: string;
  className?: string;
  onArrowDownClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  ProfileName,
  ProfileRole,
  ProfilePic,
  className,
  onArrowDownClick,
}) => {
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
      className={`header fixed top-0 left-0 z-[999] bg-white w-[100vw] h-[48px] flex items-center p-4 border-b-[2px] border-light-gray ${className}`}
    >
      <Link to="/" className="logo pl-3 shrink-0 w-60 md:block hidden">
        <img src={logo} alt="Clinic logo" />
      </Link>
      <div className="md:block hidden border-l-[2px] border-light-gray absolute left-56 h-[48px]" />
      <div className="flex items-center ml-auto mr-3 w-[calc(100vw - 240px)] space-x-2 flex-shrink-0">
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
        <div className="flex">
          <div className="profile-info flex flex-col text-right leading-snug">
            <span className="profile-name text-dark-gray text-[14px]">
              {ProfileName}
            </span>
            <span className="profile-role text-dark-gray text-[12px]">
              {ProfileRole}
            </span>
          </div>
        </div>
        <img className="profile-pic size-10 rounded-full" src={ProfilePic} />
        <button
          className="arrow-down hover:transform hover:-translate-y-1 transition-transform duration-200"
          onClick={onArrowDownClick}
        >
          <img src={ArrowDownImg} alt="Arrow Down" />
        </button>
      </div>
    </header>
  );
};

export default Header;
