import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  Button,
  Fade,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useChatbot } from "../../../providers/ChatbotProvider";

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { sendMessage, loading } = useChatbot();
  const [messages, setMessages] = useState<
    { sender: "user" | "ai"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const userInput = input;
    setInput("");
    try {
      const reply = await sendMessage(userInput);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: reply || "Sorry, I couldn't understand that." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Tooltip title="Chat with AI Support" arrow>
        <Box
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1300,
          }}
        >
          <IconButton
            color="primary"
            sx={{
              bgcolor: "",
              color: "#fff",
              width: 64,
              height: 64,
              boxShadow: 4,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.2)",
                transform: "scale(1.08)",
              },
              transition: "all 0.2s",
            }}
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close chat" : "Open chat"}
          >
            <ChatIcon sx={{ fontSize: 36 }} />
          </IconButton>
        </Box>
      </Tooltip>

      {/* Chatbot Drawer/Popup */}
      <Fade in={open}>
        <Box
          sx={{
            position: "fixed",
            bottom: 104,
            right: 32,
            width: 360,
            maxWidth: "90vw",
            height: 480,
            maxHeight: "80vh",
            zIndex: 1401,
            display: open ? "flex" : "none",
            flexDirection: "column",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 1,
                background: "linear-gradient(90deg, #e53935 0%, #ff7043 100%)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography fontWeight={400} sx={{ fontSize: 18, pl: 1 }}>
                Smart assistant
              </Typography>
              <IconButton
                size="small"
                sx={{ color: "#fff" }}
                onClick={() => setOpen(false)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            {/* Messages */}
            <Box
              sx={{
                flex: 1,
                p: 2,
                bgcolor: "#f9f9f9",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
              className="chatbox-scroll"
            >
              <style>
                {`
              .chatbox-scroll::-webkit-scrollbar {
                width: 6px;
                background: #f5f5f5;
              }
              .chatbox-scroll::-webkit-scrollbar-thumb {
                background: #e0e0e0;
                border-radius: 3px;
              }
              .chatbox-scroll {
                scrollbar-width: thin;
                scrollbar-color: #e0e0e0 #f5f5f5;
              }
            `}
              </style>
              {messages.length === 0 && (
                <Typography
                  color="text.secondary"
                  align="center"
                  mt={2}
                  sx={{ fontSize: 16 }}
                >
                  Hi! How can I help you today?
                </Typography>
              )}
              {messages.map((msg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    alignSelf:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    bgcolor: msg.sender === "user" ? "#ff7043" : "#e0e0e0",
                    color: msg.sender === "user" ? "#fff" : "black",
                    px: 1,
                    py: 0.5,
                    borderRadius: 2,
                    maxWidth: "80%",
                    fontSize: 14,
                  }}
                >
                  {msg.text}
                </Box>
              ))}
              <div ref={chatEndRef} />
            </Box>
            {/* Input */}
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid #eee",
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#fff",
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) handleSend();
                }}
                disabled={loading}
              />
              <Button
                variant="contained"
                color="primary"
                endIcon={
                  loading ? <CircularProgress size={18} /> : <SendIcon />
                }
                onClick={handleSend}
                disabled={loading || !input.trim()}
                sx={{ minWidth: 48, px: 2 }}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </>
  );
};

export default Chatbot;
