import React, { useState } from "react";
import { Box, Typography, Button, TextField, Rating } from "@mui/material";
import { useReviews } from "../../../providers/ReviewsProvider";

interface ReviewSectionProps {
  movieId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ movieId }) => {
  const { createReview } = useReviews();
  const userId = localStorage.getItem("user_id");
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    if (!rating || !comment.trim()) {
      setErrorMsg("Please provide a rating and comment.");
      return;
    }
    setLoading(true);
    try {
      await createReview({
        user_id: userId!,
        movie_id: movieId,
        rating,
        comment: comment.trim(),
      });
      setSuccessMsg("Thank you for your review!");
      setComment("");
      setRating(0);
    } catch (error: any) {
      setErrorMsg("Failed to submit review. Please try again.");
    }
    setLoading(false);
  };

  if (!showForm) {
    return (
      <Box
        sx={{
          background: "#181818",
          borderRadius: 2,
          p: 3,
          mb: 4,
          color: "#fff",
          boxShadow: 2,
          width: "100%",
          maxWidth: 600,
          mx: "auto",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Have you watched this movie? Rate it now!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm(true)}
          sx={{ minWidth: 120, fontWeight: "bold" }}
        >
          Rate
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "#181818",
        borderRadius: 2,
        p: 3,
        mb: 4,
        color: "#fff",
        boxShadow: 2,
        width: "100%",
        maxWidth: 600,
        mx: "auto",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Rate this movie
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography sx={{ mr: 2 }}>Your rating:</Typography>
        <Rating
          value={rating}
          onChange={(_, value) => setRating(value)}
          size="large"
        />
      </Box>
      <TextField
        label="Your review"
        multiline
        minRows={3}
        fullWidth
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mb: 2, background: "#fff", borderRadius: 1 }}
        disabled={loading}
      />
      {errorMsg && (
        <Typography color="error" sx={{ mb: 1 }}>
          {errorMsg}
        </Typography>
      )}
      {successMsg && (
        <Typography color="success.main" sx={{ mb: 1 }}>
          {successMsg}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        sx={{ minWidth: 120, fontWeight: "bold" }}
      >
        Submit Review
      </Button>
    </Box>
  );
};

export default ReviewSection;
