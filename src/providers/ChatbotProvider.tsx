import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useState,
} from "react";
import axios from "axios";

type ChatbotResponse = {
  reply: string;
  mentionedMovies?: { id: string; title: string; poster_url: string }[];
};

interface ChatbotContextType {
  sendMessage: (message: string) => Promise<ChatbotResponse>;
  loading: boolean;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const sendMessage = useCallback(
    async (message: string): Promise<ChatbotResponse> => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.post(
          `${baseURL}/chatbot`,
          { message },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        return response.data;
      } catch (error: any) {
        console.error("Chatbot sendMessage error:", error);
        const errorMsg = error.response?.data || "Failed to get chatbot reply.";
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [baseURL]
  );

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
