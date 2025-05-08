import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ProductType } from "../../../interfaces/types";
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
  overflowX: "hidden",
});

const statusOptions: string[] = [
  "Coming Soon",
  "Now Playing",
  "Stopped",
  "Unknown",
];

interface DetailProductProps {
  product: ProductType;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  onSave: (newProduct: any) => void;
}

const categories: string[] = ["Food", "Drink", "Souvenir", "Combo", "Other"];

const DetailProduct: React.FC<DetailProductProps> = ({
  product,
  open,
  onClose,
  onDelete,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    console.log("Product: ", product);
    if (product) {
      setName(product.name);
      setImage(product.image);
      setPrice(product.price);
      setCategory(product.category);
    }
    if (!open) {
      setIsEditing(false);
    }
  }, [product, open]);

  const handleModifyClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onSave({
      ...product,
      name,
      image,
      price,
      category,
    });
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };
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
        Detail Product
      </DialogTitle>
      <CustomDialogContent>
        <Box display={"flex"} flexDirection={"row"} gap={4}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 100 }}>
                Product ID:
              </Typography>
              <TextField
                margin="dense"
                sx={{ width: 240 }}
                size="small"
                value={product._id}
                disabled
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 100 }}>
                Category:
              </Typography>
              <Autocomplete
                options={categories}
                value={category}
                sx={{ width: 240 }}
                disabled={!isEditing}
                onChange={(event, newValue) => setCategory(newValue!)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Type"
                    margin="dense"
                    size="small"
                  />
                )}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 100 }}>
                Image:
              </Typography>
              <TextField
                placeholder="Image"
                sx={{ width: 240 }}
                margin="dense"
                size="small"
                disabled={!isEditing}
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 100 }}>
                Price:
              </Typography>
              <TextField
                placeholder="Price"
                type="number"
                margin="dense"
                sx={{ width: 240 }}
                size="small"
                value={price}
                disabled={!isEditing}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              src={image}
              alt="Product image"
              style={{
                width: 140,
                height: 160,
                objectFit: "fill",
                borderRadius: 8,
              }}
              className="bg-[#eee] mt-4"
            />
            <Typography fontWeight={500} color="#999">
              Image
            </Typography>
          </Box>
        </Box>
      </CustomDialogContent>
      <DialogActions sx={{ mb: 1.5, mr: 2 }}>
        {isEditing ? (
          <Box display="flex" gap={2}>
            <Button
              onClick={handleCancelClick}
              color="primary"
              variant="outlined"
              sx={{ width: 130 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveClick}
              color="primary"
              variant="contained"
              sx={{ width: 130 }}
            >
              Save
            </Button>
          </Box>
        ) : (
          <Box display="flex" gap={2}>
            <Button
              onClick={onClose}
              color="primary"
              variant="outlined"
              sx={{ width: 130 }}
            >
              Close
            </Button>
            <Button
              onClick={onDelete}
              color="primary"
              variant="outlined"
              sx={{ width: 130 }}
            >
              Delete
            </Button>
            <Button
              onClick={handleModifyClick}
              color="primary"
              variant="contained"
              sx={{ width: 130 }}
            >
              Modify
            </Button>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DetailProduct;
