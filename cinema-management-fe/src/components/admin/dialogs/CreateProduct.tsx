import { useState } from "react";
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

interface CreateProductProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newProduct: any) => void;
}
const types: string[] = ["Food", "Drink", "Souvenir", "Combo", "Other"];

const CreateProduct: React.FC<CreateProductProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [image, setImage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [type, setType] = useState<string>("");

  const handleSubmit = () => {
    if (!name || !image || !price || !type) {
      console.error("All fields are required");
      return;
    }
    const productData = {
      name,
      image,
      price,
      type,
    };
    onAdd(productData);
    onClose();
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
        Add Product
      </DialogTitle>
      <CustomDialogContent>
        <Box display={"flex"} flexDirection={"row"} gap={4}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 100 }}>
                Name:
              </Typography>
              <TextField
                placeholder="Name"
                sx={{ width: 240 }}
                margin="dense"
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 100 }}>
                Image:
              </Typography>
              <TextField
                placeholder="Image"
                type="number"
                sx={{ width: 240 }}
                margin="dense"
                size="small"
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
                sx={{ width: 240 }}
                margin="dense"
                size="small"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", height: 45 }}>
              <Typography sx={{ mr: 2, marginTop: 1, width: 100 }}>
                Type:
              </Typography>
              <Autocomplete
                options={types}
                value={type}
                sx={{ width: 240 }}
                onChange={(event, newValue) => setType(newValue!)}
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
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          sx={{ width: 130 }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProduct;
