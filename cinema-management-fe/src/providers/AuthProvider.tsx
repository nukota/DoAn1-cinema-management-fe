import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
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
  sendEmail: (email: string) => Promise<any>;
  resetPassword: (token: string, newPassword: string) => Promise<any>;
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
        const errorMsg =
          errorData?.error?.message || "Failed to fetch user profile.";
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

  // Send forgot password email
  const sendEmail = useCallback(
    async (email: string) => {
      try {
        const response = await fetch(`${baseURL}/auth/forgot-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          const errorMsg = errorData?.error?.message || "Failed to send email.";
          throw new Error(errorMsg);
        }
        return await response.json();
      } catch (error) {
        console.error("Failed to send forgot password email:", error);
        throw error;
      }
    },
    [baseURL]
  );

  // Reset password
  const resetPassword = useCallback(
    async (token: string, newPassword: string) => {
      try {
        const response = await fetch(`${baseURL}/auth/reset-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          const errorMsg =
            errorData?.error?.message || "Failed to reset password.";
          throw new Error(errorMsg);
        }
        return await response.json();
      } catch (error) {
        console.error("Failed to reset password:", error);
        throw error;
      }
    },
    [baseURL]
  );

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
        sendEmail,
      resetPassword,
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
