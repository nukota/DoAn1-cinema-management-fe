import { Route, Routes } from "react-router-dom";
import UserHome from "./Home";
import Contact from "./Contact";
import Login from "./Login";
import MovieDetail from "./MovieDetail";
import ResetPassword from "./ResetPassword";
import MovieList from "./MovieList";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import AboutUs from "./AboutUs";
import UserHeader from "./elements/Header";
import Footer from "./elements/Footer";
import UserProfile from "./Profile";
import Payment from "./Payment";
import Chatbox from "./elements/Chatbox";

const User: React.FC = () => {
  return (
    <div
      className="bg-black h-screen w-full relative user-scrollbar"
      style={{
        height: "100vh",
        overflow: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "#333 #111",
      }}
    >
      <UserHeader />
      <div className="z-[99] bg-black w-full relative custom-scrollbar overflow-hidden">
        <Routes>
          <Route path="/*" element={<UserHome />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/home" element={<UserHome />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/movie-detail/:movieId" element={<MovieDetail />} />
          <Route path="/movie-list" element={<MovieList />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </div>
      <div className="z-[100] bg-black w-full">
        <Footer />
      </div>
      <Chatbox />
    </div>
  );
};

export default User;
