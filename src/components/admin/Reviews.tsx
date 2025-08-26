import React, { useEffect, useState } from "react";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { ReviewType } from "../../interfaces/types";
import DetailReview from "./dialogs/DetailReview";
import { useReviews } from "../../providers/ReviewsProvider";
import { toast } from "react-toastify";
import { confirmDeletion } from "../../utils/confirmDeletion";
import CustomDataGrid from "./elements/DataGrid";
import { InfoOutlined } from "@mui/icons-material";

const Reviews: React.FC = () => {
  const { reviews, fetchReviewsData, deleteReview, loading } = useReviews();
  const [selectedReview, setSelectedReview] = useState<ReviewType | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [DetailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);

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
      width: 100,
      valueFormatter: (value: any) => `${value}/5`,
    },
    {
      field: "comment",
      headerName: "Comment",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
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
          label="Details"
          onClick={() => handleInfoClick(params.row)}
          showInMenu={false}
        />,
      ],
    },
  ];

  if (loading) {
    return (
      <CustomDataGrid
        title="Reviews Management"
        loading={true}
        loadingMessage="Loading reviews..."
        rows={[]}
        columns={columns}
        showCheckboxSelection={false}
      />
    );
  }

  return (
    <>
      <CustomDataGrid
        title="Reviews Management"
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
      {selectedReview && (
        <DetailReview
          review={selectedReview}
          open={DetailDialogOpen}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
};

export default Reviews;
