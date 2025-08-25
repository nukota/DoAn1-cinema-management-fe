import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import wallPaperImg from "../../assets/images/wallpaper.jpg";

const AboutUs: React.FC = () => {
  return (
    <div className="bg-[#090909] w-full h-full flex flex-col justify-center relative">
      <img
        className="absolute w-full h-full top-0 z-0 opacity-10"
        src={wallPaperImg}
        alt="Cinema wallpaper"
      />
      <Box
        sx={{
          width: "84%",
          marginLeft: "8%",
          marginTop: "100px",
          marginBottom: "60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "32px 24px",
          minWidth: "200px",
          zIndex: 10,
          color: "#999",
        }}
      >
        <Typography
          variant="h4"
          color="white"
          sx={{ fontWeight: "medium", marginTop: "10px", marginBottom: "24px", alignSelf: "center" }}
        >
          ABOUT US
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Welcome to <b>UIT Cinema</b>! We are dedicated to providing the best movie experience for our community. Our cinema features state-of-the-art sound and projection technology, comfortable seating, and a wide selection of the latest blockbusters and beloved classics.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <b>Our Mission:</b> To create a welcoming and enjoyable environment where movie lovers of all ages can come together to enjoy the magic of cinema.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <b>What We Offer:</b>
          <ul style={{ marginLeft: 24 }}>
            <li>Modern, comfortable theaters with high-quality audio and visuals</li>
            <li>Online ticket booking and seat selection</li>
            <li>A variety of snacks and beverages at our concession stands</li>
            <li>Special screenings, events, and promotions for our loyal customers</li>
            <li>Friendly and helpful staff ready to assist you</li>
            <li>Accessible facilities for all guests</li>
            <li>Membership and loyalty programs with exclusive benefits</li>
          </ul>
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <b>Our Values:</b>
          <ul style={{ marginLeft: 24 }}>
            <li>Customer satisfaction and comfort</li>
            <li>Innovation in entertainment technology</li>
            <li>Community engagement and support</li>
            <li>Cleanliness and safety at all times</li>
          </ul>
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <b>Contact Us:</b> <br />
          Have questions or feedback? Reach out to us at{" "}
          <a href="mailto:support@cinema.com" style={{ color: "#90caf9" }}>
            support@cinema.com
          </a>
          . We look forward to seeing you at the movies!
        </Typography>
        <Typography sx={{ mt: 2, fontStyle: "italic" }}>
          Thank you for choosing UIT Cinema – where every seat is the best seat in the house!
        </Typography>
      </Box>
      <div className="w-full bg-black z-20"></div>
    </div>
  );
};

export default AboutUs;