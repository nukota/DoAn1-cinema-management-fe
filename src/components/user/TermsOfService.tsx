import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import wallPaperImg from "../../assets/images/wallpaper.jpg";

const TermsOfService: React.FC = () => {
  return (
    <div className="bg-black w-full h-full flex flex-col justify-center relative">
      <div
        className="absolute w-full h-[100vh] top-[0vh] pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)",
        }}
      />
      <img
        className="absolute w-full h-[100vh] top-0 z-0 opacity-15"
        src={wallPaperImg}
        alt="Wallpaper"
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
          variant="h3"
          color="white"
          sx={{
            fontWeight: "medium",
            fontFamily: "Jost",
            marginTop: "10px",
            marginBottom: "24px",
            alignSelf: "center",
          }}
        >
          TERMS OF SERVICE
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <b>1. Acceptance of Terms</b>
          <br />
          By accessing or using our cinema management system, you agree to be
          bound by these Terms of Service and all applicable laws and
          regulations. If you do not agree with any part of these terms, you may
          not use our services.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <b>2. Use of Service</b>
          <br />
          You agree to use our services only for lawful purposes and in
          accordance with these terms. You are responsible for maintaining the
          confidentiality of your account and password and for all activities
          that occur under your account.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <b>3. Ticket Purchases & Payments</b>
          <br />
          All ticket purchases are subject to availability and our refund
          policy. You agree to provide accurate payment information and
          authorize us to charge your selected payment method for any purchases
          made.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <b>4. User Conduct</b>
          <br />
          You agree not to:
          <ul style={{ marginLeft: 24 }}>
            <li>Violate any applicable laws or regulations.</li>
            <li>Use the service for any fraudulent or harmful purpose.</li>
            <li>Interfere with or disrupt the operation of the service.</li>
            <li>
              Attempt to gain unauthorized access to any part of the system.
            </li>
          </ul>
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <b>5. Intellectual Property</b>
          <br />
          All content, trademarks, and data on this site, including but not
          limited to software, text, graphics, and logos, are the property of
          the cinema or its licensors and are protected by intellectual property
          laws. You may not use, reproduce, or distribute any content without
          our written permission.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <b>6. Termination</b>
          <br />
          We reserve the right to suspend or terminate your access to our
          services at any time, without notice, for conduct that we believe
          violates these Terms or is harmful to other users or our business
          interests.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <b>7. Limitation of Liability</b>
          <br />
          To the fullest extent permitted by law, we are not liable for any
          indirect, incidental, special, or consequential damages arising out of
          or in connection with your use of our services.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <b>8. Changes to Terms</b>
          <br />
          We may update these Terms of Service from time to time. Any changes
          will be posted on this page with an updated effective date. Your
          continued use of the service after changes are posted constitutes your
          acceptance of the new terms.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <b>9. Governing Law</b>
          <br />
          These Terms are governed by the laws of the jurisdiction in which the
          cinema operates. Any disputes will be resolved in the local courts.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <b>10. Contact Us</b>
          <br />
          If you have any questions about these Terms of Service, please contact
          our support team at{" "}
          <a href="mailto:support@cinema.com" style={{ color: "#90caf9" }}>
            support@cinema.com
          </a>
          .
        </Typography>
      </Box>
      <div className="w-full bg-black z-20"></div>
    </div>
  );
};

export default TermsOfService;
