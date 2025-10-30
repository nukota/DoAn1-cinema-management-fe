import React, { useEffect, useState } from "react";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { ReviewType } from "../../interfaces/types";
import { useReviews } from "../../providers/ReviewsProvider";
import { toast } from "react-toastify";
import CustomDataGrid from "../admin/elements/DataGrid";
import {
  InfoOutlined,
  CheckCircleOutlined,
  ReportOutlined,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Rating,
} from "@mui/material";

const Moderator: React.FC = () => {
  const { reviews, getUnverifiedReviews, updateReview, deleteReview, loading } =
    useReviews();
  const [selectedReview, setSelectedReview] = useState<ReviewType | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    getUnverifiedReviews();
  }, []);

  const handleInfoClick = (review: ReviewType) => {
    setSelectedReview(review);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setSelectedReview(null);
  };

  const handleApproveReview = async (review: ReviewType) => {
    try {
      // Update the review with isVerified set to true
      await updateReview(review._id!, { isVerify: true });

      toast.success(`Review by ${review.user?.full_name} has been approved.`);

      // Close dialog if open
      if (detailDialogOpen) {
        handleCloseDialog();
      }

      // Refresh the reviews list to remove the approved review
      await getUnverifiedReviews();
    } catch (error) {
      console.error("Failed to approve review:", error);
      toast.error("Failed to approve review. Please try again.");
    }
  };

  const handleRejectReview = async (review: ReviewType) => {
    try {
      // Delete the review from the database
      if (!review._id) {
        toast.error("Invalid review ID");
        return;
      }

      await deleteReview(review._id);

      toast.success(
        `Review by ${review.user?.full_name} has been rejected and deleted.`
      );

      // Close dialog if open
      if (detailDialogOpen) {
        handleCloseDialog();
      }

      // Refresh is automatic as deleteReview updates the state
    } catch (error) {
      console.error("Failed to reject review:", error);
      toast.error("Failed to reject review. Please try again.");
    }
  };

  const getReviewSentiment = (
    rating: number
  ): "positive" | "negative" | "neutral" => {
    if (rating >= 4) return "positive";
    if (rating <= 2) return "negative";
    return "neutral";
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "#4caf50";
      case "negative":
        return "#f44336";
      default:
        return "#ff9800";
    }
  };

  const columns: GridColDef[] = [
    { field: "_id", headerName: "Review ID", width: 60 },
    {
      field: "movie_title",
      headerName: "Movie",
      width: 200,
      flex: 0.35,
      valueGetter: (_, row) => row.movie?.title || "N/A",
    },
    {
      field: "user_name",
      headerName: "User",
      width: 180,
      flex: 0.35,
      valueGetter: (_, row) => row.user?.full_name || "N/A",
    },
    {
      field: "rating",
      headerName: "Rating",
      minWidth: 140,
      flex: 0.25,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Rating value={params.value} readOnly size="small" />
          <Typography variant="body2">({params.value})</Typography>
        </Box>
      ),
    },
    {
      field: "comment",
      headerName: "Comment Preview",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        const sentiment = getReviewSentiment(params.row.rating);
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: "100%",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {params.value}
            </Typography>
            <Chip
              label={sentiment}
              size="small"
              sx={{
                backgroundColor: getSentimentColor(sentiment),
                color: "white",
                fontSize: "0.7rem",
                height: "20px",
                mr: 1,
              }}
            />
          </Box>
        );
      },
    },
    {
      field: "created_at",
      headerName: "Date",
      width: 130,
      flex: 0.25,
      valueFormatter: (value: any) =>
        value ? new Date(value).toLocaleDateString() : "N/A",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 180,
      getActions: (params) => [
        <GridActionsCellItem
          key="info"
          icon={
            <InfoOutlined
              sx={{
                fontSize: { xs: 20, sm: 24, md: 28 },
              }}
            />
          }
          label="View Details"
          onClick={() => handleInfoClick(params.row)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key="approve"
          icon={
            <CheckCircleOutlined
              sx={{
                fontSize: { xs: 20, sm: 24, md: 28 },
                color: "#4caf50",
              }}
            />
          }
          label="Approve"
          onClick={() => handleApproveReview(params.row)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key="reject"
          icon={
            <ReportOutlined
              sx={{
                fontSize: { xs: 20, sm: 24, md: 28 },
                color: "#f44336",
              }}
            />
          }
          label="Reject"
          onClick={() => handleRejectReview(params.row)}
          showInMenu={false}
        />,
      ],
    },
  ];

  return (
    <>
      <CustomDataGrid
        title="Comment Moderation"
        loading={loading}
        rows={reviews}
        columns={columns}
        showCheckboxSelection={false}
        getRowId={(row) => row._id}
      />

      {/* Review Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6">Review Details</Typography>
            {selectedReview && (
              <Chip
                label={getReviewSentiment(selectedReview.rating)}
                size="small"
                sx={{
                  backgroundColor: getSentimentColor(
                    getReviewSentiment(selectedReview.rating)
                  ),
                  color: "white",
                }}
              />
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Movie
                </Typography>
                <Typography variant="h6">
                  {selectedReview.movie?.title || "N/A"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  User
                </Typography>
                <Typography variant="body1">
                  {selectedReview.user?.full_name || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedReview.user?.email || "N/A"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Rating
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Rating value={selectedReview.rating} readOnly />
                  <Typography>({selectedReview.rating}/5)</Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Comment
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    backgroundColor: "#f5f5f5",
                    padding: 2,
                    borderRadius: 1,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedReview.comment}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Date Submitted
                </Typography>
                <Typography variant="body2">
                  {selectedReview.created_at
                    ? new Date(selectedReview.created_at).toLocaleString()
                    : "N/A"}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              selectedReview && handleApproveReview(selectedReview)
            }
            color="success"
            startIcon={<CheckCircleOutlined />}
          >
            Approve
          </Button>
          <Button
            onClick={() => selectedReview && handleRejectReview(selectedReview)}
            color="error"
            startIcon={<ReportOutlined />}
          >
            Reject
          </Button>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Moderator;
