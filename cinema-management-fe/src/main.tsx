// filepath: /d:/UIT/DoAn1/DoAn1-cinema-management-fe/cinema-management-fe/src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // This is where Tailwind CSS is included
import App from "./App.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./AuthContext.tsx";

const theme = createTheme({
  palette: {
    primary: {
      main: "#b80007",
    },
    secondary: {
      main: "#c9a512",
    },
  },
});

export default theme;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
