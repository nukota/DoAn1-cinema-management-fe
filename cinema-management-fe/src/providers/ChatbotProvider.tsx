import React, { createContext, useContext, ReactNode, useCallback, useState } from "react";

interface ChatbotContextType {
  sendMessage: (message: string) => Promise<string>;
  loading: boolean;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const sendMessage = useCallback(async (message: string): Promise<string> => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to get chatbot reply.");
      }
      const data = await response.json();
      return data.reply || "";
    } catch (error) {
      console.error("Chatbot sendMessage error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [baseURL]);

  return (
    <ChatbotContext.Provider value={{ sendMessage, loading }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};