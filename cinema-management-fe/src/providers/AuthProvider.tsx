import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { UserType } from "../interfaces/types";

export interface AuthContextType {
  isLoggedIn: boolean;
  userProfile: UserType | null;
  accessToken: string | null;
  loading: boolean;
  fetchUserProfile: (token: string, email: string) => Promise<void>;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleLogout: () => void;
  handleSignUp: (data: SignUpData) => Promise<void>;
}

interface SignUpData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  dateOfBirth: string;
  cccd: string;
  role: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserType | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchUserProfile = async (token: string, email: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/user/email?email=${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Failed to fetch user profile.";
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setUserProfile(data);
      setAccessToken(token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.error?.message || "Sign In failed";
        throw new Error(message);
      }
      const data = await response.json();
      const { accessToken, refreshToken, user_id } = data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("email", email);
      localStorage.setItem("user_id", user_id);
      await fetchUserProfile(accessToken, email);
    } catch (error: any) {
      console.error("Sign In failed:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpData) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.error?.message || "Sign Up failed";
        throw new Error(message);
      }
    } catch (error: any) {
      console.error("Sign Up failed:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    localStorage.removeItem("user_id");
    setUserProfile(null);
    setAccessToken(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const email = localStorage.getItem("email");
    if (token && email) {
      fetchUserProfile(token, email);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userProfile,
        accessToken,
        loading,
        fetchUserProfile,
        handleLogin,
        handleLogout,
        handleSignUp,
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
