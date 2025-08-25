import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Rating,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { useReviews } from "../../../providers/ReviewsProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import { ReviewType } from "../../../interfaces/types";

interface ReviewSectionProps {
  movieId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ movieId }) => {
  const { createReview, getReviewsByMovieId, loading } = useReviews();
  const userId = localStorage.getItem("user_id");
  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [movieReviews, setMovieReviews] = useState<ReviewType[]>([]);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLocalLoading(true);
    getReviewsByMovieId(movieId)
      .then((data) => {
        if (isMounted) setMovieReviews(data);
      })
      .catch(() => {
        if (isMounted) setMovieReviews([]);
      })
      .finally(() => {
        if (isMounted) setLocalLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [getReviewsByMovieId, movieId]);

  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    if (!rating || !comment.trim()) {
      setErrorMsg("Please provide a rating and comment.");
      return;
    }
    try {
      await createReview({
        user_id: userId!,
        movie_id: movieId,
        rating,
        comment: comment.trim(),
      });
      setSuccessMsg("Thank you for your review!");
      setComment("");
      setRating(5);
      // Refetch reviews after successful submit
      setLocalLoading(true);
      const data = await getReviewsByMovieId(movieId);
      setMovieReviews(data);
      setLocalLoading(false);
    } catch (error: any) {
      setErrorMsg("Failed to submit review. Please try again.");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", mb: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: "bold", color: "#fff" }}
      >
        Reviews
      </Typography>
      {localLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 120,
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Swiper
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            900: { slidesPerView: 3.2 },
          }}
          style={{ paddingBottom: 24 }}
        >
          {movieReviews.map((review) => (
            <SwiperSlide key={review._id}>
              <Card
                sx={{
                  minWidth: 260,
                  maxWidth: 320,
                  m: 1,
                  background: "#232323",
                  color: "#fff",
                  borderRadius: 2,
                  height: 200, // Fixed height for at least 5 lines
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, mr: 1 }}>{`${review.user?.full_name}`}</Typography>
                    <Rating
                      value={review.rating}
                      readOnly
                      size="small"
                      sx={{ color: "#fbc02d" }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      color: "#bbb",
                      flex: 1,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: "vertical",
                    }}
                  >{`${review.comment}`}</Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#888" }}
                  >{`${review.created_at?.slice(0, 10)}`}</Typography>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
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
          mt: 4,
        }}
      >
        {showForm ? (
          <>
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
              placeholder="Your review"
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
                sx={{ minWidth: 120, fontWeight: "medium" }}
              >
                Submit Review
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setShowForm(false)}
                sx={{
                  minWidth: 100,
                  fontWeight: "bold",
                  color: "#fff",
                  borderColor: "#fff",
                }}
              >
                Close
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "medium" }}>
              Have you watched this movie? Rate it now!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowForm(true)}
              sx={{ minWidth: 120, fontWeight: "medium" }}
            >
              Rate
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReviewSection;
