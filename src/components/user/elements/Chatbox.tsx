import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Tooltip,
  Drawer,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useChatbot } from "../../../providers/ChatbotProvider";
import { enhanceHTML } from "../../../utils/enhanceHTML";
import { useNavigate } from "react-router-dom";

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { sendMessage, loading } = useChatbot();
  const [messages, setMessages] = useState<
    { sender: "user" | "ai"; text: string; isHtml?: boolean; mentionedMovies?: { id: string; title: string; poster_url: string }[] }[]
  >([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
      const response = await sendMessage(userInput);
      // If API returns { reply, mentionedMovies }
      let reply = response.reply ?? response;
      let mentionedMovies = response.mentionedMovies ?? [];
      const isHtml = /<[^>]+>/.test(reply);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            isHtml
              ? enhanceHTML(reply)
              : reply || "Sorry, I couldn't understand that.",
          isHtml,
          mentionedMovies,
        },
      ]);
    } catch (error) {
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
      {/* Floating Chat Button - only show when Drawer is closed */}
      {!open && (
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
              onClick={() => setOpen(true)}
              aria-label={open ? "Close chat" : "Open chat"}
            >
              <ChatIcon sx={{ fontSize: 36 }} />
            </IconButton>
          </Box>
        </Tooltip>
      )}
      {/* Chatbot Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 360,
            maxWidth: "90vw",
            height: "100vh", // Fill screen height
            maxHeight: "100vh",
            borderRadius: 0, // No rounded border
            position: "fixed",
            bottom: 0,
            right: 0,
            boxShadow: 6,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: 0, // No rounded border
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
              <React.Fragment key={idx}>
                <Box
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
                    mb:
                      msg.mentionedMovies && msg.mentionedMovies.length > 0 ? 1 : 0,
                  }}
                >
                  {msg.isHtml ? (
                    <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                  ) : (
                    msg.text
                  )}
                </Box>
                {/* Show mentioned movies as cards below the AI message, outside the message bubble */}
                {msg.sender === "ai" && msg.mentionedMovies && msg.mentionedMovies.length > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: msg.mentionedMovies.length <= 6 ? '1fr 1fr 1fr' : '1fr 1fr 1fr 1fr',
                      gap: 1,
                      mt: 1,
                      mb: 1,
                      alignSelf: 'flex-start',
                      width: '100%',
                    }}
                  >
                    {msg.mentionedMovies.map((movie) => (
                        <Paper
                        key={movie.id}
                        elevation={2}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          borderRadius: 2,
                          cursor: 'pointer',
                          height: 130,
                          justifyContent: 'flex-end',
                          '&:hover': {
                          transform: 'scale(1.04)',
                          backgroundColor: '#ffe0b2',
                          },
                          overflow: 'hidden',
                        }}
                        onClick={() => {
                          navigate(`/user/movie-detail/${movie.id}`);
                          setOpen(false);
                        }}
                        >
                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', overflow: 'hidden' }}>
                          <img
                          src={movie.poster_url}
                          alt={movie.title}
                          style={{
                            width: "100%",
                            objectFit: 'cover',
                            display: 'block',
                          }}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                          mt: 0.5,
                          fontSize: 11,
                          textAlign: 'center',
                          fontWeight: 500,
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: 72,
                          }}
                        >
                          {movie.title}
                        </Typography>
                        </Paper>
                    ))}
                  </Box>
                )}
              </React.Fragment>
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
      </Drawer>
    </>
  );
};

export default Chatbot;
