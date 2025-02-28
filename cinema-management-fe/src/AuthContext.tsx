import React, { createContext, useState, useContext, ReactNode } from "react"

interface UserProfile {
  name: string
  picture: string
}

export interface AuthContextType {
  isLoggedIn: boolean
  userProfile: UserProfile | null
  handleLogin: (user: UserProfile) => void
  handleLogout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  const handleLogin = (user: UserProfile) => {
    setIsLoggedIn(true)
    setUserProfile(user)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserProfile(null)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userProfile, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthContext }