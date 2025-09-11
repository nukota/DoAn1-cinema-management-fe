import React, { useEffect, useState } from "react";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { ReviewType } from "../../interfaces/types";
import { useReviews } from "../../providers/ReviewsProvider";
import { toast } from "react-toastify";
import { confirmDeletion } from "../../utils/confirmDeletion";
import CustomDataGrid from "../admin/elements/DataGrid";
import {
  InfoOutlined,
  DeleteOutlined,
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
  const { reviews, fetchReviewsData, deleteReview, loading } = useReviews();
  const [selectedReview, setSelectedReview] = useState<ReviewType | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    fetchReviewsData();
  }, []);

  const handleInfoClick = (review: ReviewType) => {
    setSelectedReview(review);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setSelectedReview(null);
  };

  const handleDeleteReview = async (review: ReviewType) => {
    const confirmed = await confirmDeletion(
      "Delete Review",
      `Are you sure you want to delete this review by ${review.user?.full_name}? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await deleteReview(review._id!);
        fetchReviewsData();
        toast.success("Review deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete review.");
      }
    } else {
      toast.info("Deletion canceled.");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) {
      toast.info("No reviews selected for deletion.");
      return;
    }

    const confirmed = await confirmDeletion(
      "Delete Selected Reviews",
      `Are you sure you want to delete ${selectedRows.length} review(s)? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        const deletePromises = selectedRows.map((id) => deleteReview(id));
        await Promise.all(deletePromises);
        fetchReviewsData();
        setSelectedRows([]);
        toast.success(`${selectedRows.length} review(s) deleted successfully!`);
      } catch (error) {
        toast.error("Failed to delete selected reviews.");
      }
    } else {
      toast.info("Deletion canceled.");
    }
  };

  const handleApproveReview = async (review: ReviewType) => {
    // Placeholder for approve functionality
    toast.success(`Review by ${review.user?.full_name} marked as appropriate.`);
  };

  const handleReportReview = async (review: ReviewType) => {
    // Placeholder for report functionality
    toast.warning(
      `Review by ${review.user?.full_name} flagged for further review.`
    );
  };

  const getReviewSentiment = (
    comment: string
  ): "positive" | "negative" | "neutral" => {
    const positiveWords = [
      "good",
      "great",
      "excellent",
      "amazing",
      "love",
      "awesome",
      "fantastic",
      "wonderful",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "hate",
      "horrible",
      "disappointing",
      "worst",
    ];

    const lowerComment = comment.toLowerCase();
    const hasPositive = positiveWords.some((word) =>
      lowerComment.includes(word)
    );
    const hasNegative = negativeWords.some((word) =>
      lowerComment.includes(word)
    );

    if (hasPositive && !hasNegative) return "positive";
    if (hasNegative && !hasPositive) return "negative";
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
    { field: "_id", headerName: "Review ID", width: 120 },
    {
      field: "movie_title",
      headerName: "Movie",
      width: 200,
      valueGetter: (_, row) => row.movie?.title || "N/A",
    },
    {
      field: "user_name",
      headerName: "User",
      width: 180,
      valueGetter: (_, row) => row.user?.full_name || "N/A",
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 120,
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
        const sentiment = getReviewSentiment(params.value);
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
          key="report"
          icon={
            <ReportOutlined
              sx={{
                fontSize: { xs: 20, sm: 24, md: 28 },
                color: "#ff9800",
              }}
            />
          }
          label="Flag"
          onClick={() => handleReportReview(params.row)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          key="delete"
          icon={
            <DeleteOutlined
              sx={{
                fontSize: { xs: 20, sm: 24, md: 28 },
                color: "#f44336",
              }}
            />
          }
          label="Delete"
          onClick={() => handleDeleteReview(params.row)}
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
        loadingMessage="Loading reviews..."
        rows={reviews}
        columns={columns}
        showCheckboxSelection={true}
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        onDeleteSelected={handleDeleteSelected}
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
                label={getReviewSentiment(selectedReview.comment || "")}
                size="small"
                sx={{
                  backgroundColor: getSentimentColor(
                    getReviewSentiment(selectedReview.comment || "")
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
            onClick={() => selectedReview && handleReportReview(selectedReview)}
            color="warning"
            startIcon={<ReportOutlined />}
          >
            Flag
          </Button>
          <Button
            onClick={() => selectedReview && handleDeleteReview(selectedReview)}
            color="error"
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Moderator;
