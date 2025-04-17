import React, { createContext, useState, useContext, ReactNode } from "react";
import axios from "axios";

interface UserProfile {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  userProfile: UserProfile | null;
  accessToken: string | null;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const { accessToken, refreshToken } = response.data;

      // Save tokens to localStorage or cookies
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Decode user profile from accessToken or fetch it from the server
      const userProfileResponse = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setUserProfile(userProfileResponse.data);
      setAccessToken(accessToken);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid email or password");
    }
  };

  const handleLogout = () => {
    // Clear tokens and user state
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUserProfile(null);
    setAccessToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userProfile,
        accessToken,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};