import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Rating,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReviewType } from "../../../interfaces/types";
const CustomDialogContent = styled(DialogContent)({
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#999",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#666",
  },
});

interface DetailReviewProps {
  review: ReviewType;
  open: boolean;
  onClose: () => void;
}

const DetailReview: React.FC<DetailReviewProps> = ({
  review,
  open,
  onClose,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        maxHeight: "90vh",
        overflow: "auto",
        placeSelf: "center",
      }}
    >
      <DialogTitle
        sx={{
          fontSize: 24,
          fontWeight: "bold",
          fontFamily: "inherit",
          padding: "16px 24px",
        }}
      >
        Detail Review
      </DialogTitle>
      <CustomDialogContent>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 100 }}>ID:</Typography>
          <TextField
            fullWidth
            value={review._id}
            disabled
            margin="dense"
            size="small"
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 100 }}>
            User:
          </Typography>
          <TextField
            fullWidth
            value={`(ID: ${review.user_id}) Nguyen Van A`}
            disabled
            margin="dense"
            size="small"
          />
        </Box>
        <Box sx={{ display: "flex" }}>
          <Typography sx={{ mr: 2, marginTop: 1, width: 100 }}>
            Showtime:
          </Typography>
          <TextField
            placeholder="Feedback"
            fullWidth
            margin="normal"
            size="small"
            multiline
            disabled
            rows={2}
            maxRows={3}
            value={`(ID: ${review.showtime_id}) 24/03/2025 19:00 - Venom: The Last Dance`}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: 45,
          }}
        >
          <Typography sx={{ mr: 2, marginTop: 1, width: 100 }}>
            Rating:
          </Typography>
          <Rating name="read-only" value={review.rating} readOnly />
        </Box>
        <Box sx={{ display: "flex" }}>
          <Typography sx={{ mr: 2, marginTop: 4, width: 100 }}>
            Feedback:
          </Typography>
          <TextField
            placeholder="Feedback"
            fullWidth
            margin="normal"
            size="small"
            disabled
            multiline
            rows={4}
            maxRows={6}
            value={review.comment}
          />
        </Box>
      </CustomDialogContent>
      <DialogActions sx={{ mb: 1.5, mr: 2 }}>
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          sx={{ width: 130 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailReview;
