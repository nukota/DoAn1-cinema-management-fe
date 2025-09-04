import { useState } from "react";
import { Box, TextField, Typography, Autocomplete } from "@mui/material";
import { toast } from "react-toastify";
import Dialog from "./template/CreateDialog";

interface CreateProductProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newProduct: any) => Promise<boolean>;
}
const types: string[] = ["Food", "Drink", "Souvenir", "Combo", "Other"];

const CreateProduct: React.FC<CreateProductProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [image, setImage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [type, setType] = useState<string>("");

  const handleSubmit = async () => {
    if (!name || !image || !price || !type) {
      toast.error("All fields are required");
      return;
    }
    const productData = {
      name,
      image,
      price,
      category: type,
    };
    onAdd(productData);
  };

  const actions = [
    {
      label: "Cancel",
      onClick: onClose,
      variant: "outlined" as const,
      color: "secondary" as const,
    },
    {
      label: "Add",
      onClick: handleSubmit,
      variant: "contained" as const,
      color: "primary" as const,
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Add Product"
      actions={actions}
      maxWidth="md"
      titleSx={{
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "inherit",
        padding: "16px 24px",
      }}
    >
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
              sx={{ width: 240 }}
              margin="dense"
              size="small"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
              onChange={(_, newValue) => setType(newValue!)}
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
    </Dialog>
  );
};

export default CreateProduct;
