import { Box } from "@mui/system";
import { Typography } from "@mui/material";

const PrivacyPolicy: React.FC = () => {
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
          alignItems: "flex-start", // align left
          padding: "32px 24px",
          zIndex: 10,
          color: "#999",
        }}
      >
        <Typography
          variant="h4"
          color="white"
          sx={{ fontWeight: "medium", marginTop: "10px", marginBottom: "24px", alignSelf: "center" }}
        >
          PRIVACY POLICY
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <span className="text-2xl text-white">1. Introduction</span>
          <br />
          We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our cinema management system. By accessing or using our services, you agree to the terms of this policy.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <span className="text-2xl text-white">2. Information We Collect</span>
          <br />
          We may collect the following types of information:
          <ul style={{ marginLeft: 24 }}>
            <li><span>Personal Information:</span> Name, email address, phone number, date of birth, and payment details when you register, book tickets, or interact with our services.</li>
            <li><span>Account Information:</span> Login credentials, preferences, and purchase history.</li>
            <li><span>Technical Data:</span> IP address, browser type, device information, and usage data collected automatically when you use our website or app.</li>
            <li><span>Cookies & Tracking:</span> We use cookies and similar technologies to enhance your experience and analyze usage patterns.</li>
          </ul>
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <span className="text-2xl text-white">3. How We Use Your Information</span>
          <br />
          Your information is used for the following purposes:
          <ul style={{ marginLeft: 24 }}>
            <li>To process bookings and payments securely.</li>
            <li>To provide customer support and respond to your inquiries.</li>
            <li>To personalize your experience and recommend relevant movies or promotions.</li>
            <li>To improve our services, website, and app based on usage analytics.</li>
            <li>To send you updates, notifications, or promotional offers (if you opt in).</li>
            <li>To comply with legal obligations and prevent fraud or misuse.</li>
          </ul>
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <span className="text-2xl text-white">4. Data Sharing</span>
          <br />
          We do not sell or rent your personal information. We may share your data with:
          <ul style={{ marginLeft: 24 }}>
            <li>Trusted third-party service providers (such as payment processors and IT support) who help us operate our business.</li>
            <li>Authorities or law enforcement if required by law or to protect our rights and users.</li>
            <li>Other parties with your explicit consent.</li>
          </ul>
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <span className="text-2xl text-white">5. Data Security</span>
          <br />
          We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. These include encryption, secure servers, and regular security reviews. However, no method of transmission over the Internet is 100% secure, so we cannot guarantee absolute security.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <span className="text-2xl text-white">6. Data Retention</span>
          <br />
          We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy or as required by law. You may request deletion of your data at any time, subject to legal and contractual obligations.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <span className="text-2xl text-white">7. Your Rights</span>
          <br />
          You have the right to:
          <ul style={{ marginLeft: 24 }}>
            <li>Access, update, or delete your personal information.</li>
            <li>Withdraw consent for marketing communications at any time.</li>
            <li>Request a copy of the data we hold about you.</li>
            <li>Object to or restrict certain processing of your data.</li>
          </ul>
          Please contact us if you wish to exercise these rights.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <span className="text-2xl text-white">8. Children's Privacy</span>
          <br />
          Our services are not intended for children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us for removal.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <span className="text-2xl text-white">9. Changes to This Policy</span>
          <br />
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.
        </Typography>
        <Typography sx={{ mb: 2 }}>
          <span className="text-2xl text-white">10. Contact Us</span>
          <br />
          If you have any questions or concerns about our Privacy Policy or data practices, please contact our support team at <a href="mailto:support@cinema.com" style={{ color: "#90caf9" }}>support@cinema.com</a>.
        </Typography>
      </Box>
      <div className="w-full bg-black z-20"></div>
    </div>
  );
}

export default PrivacyPolicy;