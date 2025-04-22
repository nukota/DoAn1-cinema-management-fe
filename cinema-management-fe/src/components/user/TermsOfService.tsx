import { Box } from "@mui/system";
import { Typography } from "@mui/material";

const TermsOfService: React.FC = () => {
  return (
    <div className="bg-[#090909] w-full h-full flex flex-col justify-center relative">
      <Box
        sx={{
          width: "84%",
          marginLeft: "8%",
          minWidth: "200px",
          typography: "body1",
          backgroundColor: "black",
          marginTop: "100px",
          marginBottom: "60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "14px",
          height: "520px",
          overflow: "auto",
          zIndex: 10,
          color: "white",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "medium", marginTop: "20px" }}
        >
          TERMS OF SERVICE
        </Typography>
      </Box>
      <div className="w-full bg-black z-20">
      </div>
    </div>
  );
}

export default TermsOfService;
