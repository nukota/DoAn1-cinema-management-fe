import { Route, Routes } from "react-router-dom";
import UserHome from "./Home";
import Contact from "./Contact";
import Login from "./Login";
import MovieDetail from "./MovieDetail";
import ResetPassword from "./ResetPassword";
import SearchResult from "./SearchResult";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import AboutUs from "./AboutUs";

const User: React.FC = () => {
  return (
    <div className="bg-black min-h-screen w-full h-auto">
      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route path="/home" element={<UserHome />} />
        <Route path="/contact" element={<Contact />} />   
        <Route path="/login" element={<Login />} />
        <Route path="/movie-detail/:movieId" element={<MovieDetail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/movie-search" element={<SearchResult />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </div>
  );
}

export default User;
