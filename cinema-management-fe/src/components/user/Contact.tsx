import wallPaperImg from "../../assets/images/wallpaper.jpg";
import { Box } from "@mui/system";
import { TextField, Typography, Button } from "@mui/material";

const Contact: React.FC = () => {
  return (
    <div className="bg-black w-full h-full flex flex-col justify-center relative">
      <img
        className="absolute w-full h-[820px] top-[60px] z-0 opacity-20"
        src={wallPaperImg}
      />
      <Box
        sx={{
          width: "72%",
          marginLeft: "14%",
          minWidth: "200px",
          typography: "body1",
          backgroundColor: "white",
          marginTop: "120px",
          marginBottom: "60px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingInline: "14px",
          height: "520px",
          overflow: "auto",
          zIndex: 10,
        }}
      >
        <div className="w-[50%] px-[24px]">
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <h2 className="text-4xl font-semibold mb-4">Contact Us</h2>

            <Typography
              variant="body1"
              marginTop="4px"
              fontSize="14px"
              fontWeight="bold"
            >
              Name
            </Typography>
            <TextField
              placeholder="Your Name"
              name="name"
              size="small"
              // value={signUpData.name}
              // onChange={handleSignUpChange}
              fullWidth
            />
            <Typography
              variant="body1"
              marginTop="4px"
              fontSize="14px"
              fontWeight="bold"
            >
              Email
            </Typography>
            <TextField
              placeholder="Your Email"
              name="email"
              size="small"
              // value={signUpData.name}
              // onChange={handleSignUpChange}
              fullWidth
            />
            <Typography
              variant="body1"
              marginTop="4px"
              fontSize="14px"
              fontWeight="bold"
            >
              Subject
            </Typography>
            <TextField
              placeholder="Subject"
              name="subject"
              size="small"
              // value={signUpData.name}
              // onChange={handleSignUpChange}
              fullWidth
            />
            <Typography
              variant="body1"
              marginTop="4px"
              fontSize="14px"
              fontWeight="bold"
            >
              Messge
            </Typography>
            <TextField
              placeholder="Message"
              name="messge"
              size="small"
              // value={signUpData.name}
              // onChange={handleSignUpChange}
              fullWidth
            />
            <Button
              variant="contained"
              sx={{ marginTop: "20px" }}
              onClick={() =>
                alert(
                  "The message hasn't been sent besause the function hasn't been implemented yet"
                )
              }
            >
              Sign Up
            </Button>
          </Box>
        </div>
        <div className="w-[50%]">
          <div className="p-6 -mt-10">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Contact Information
            </h2>
            <p className="mb-2">
              <strong>Address:</strong> Long Thanh My, TP.Thu Duc, Ho Chi Minh, VietNam
            </p>
            <p className="mb-2">
              <strong>Phone:</strong> IDK
            </p>
            <p className="mb-4">
              <strong>Email:</strong> 22521351@gm.uit.edu.vn
            </p>
          </div>
        </div>
      </Box>
      <div className="w-full bg-black z-20">
      </div>
    </div>
  );
};

export default Contact;
