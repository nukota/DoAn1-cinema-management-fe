import { useState } from "react";
import { toast } from "react-toastify";
import CreateDialog, { FormSection } from "./template/CreateDialog";

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

  const sections: FormSection[] = [
    {
      fields: [
        {
          name: "name",
          label: "Name",
          type: "text",
          placeholder: "Name",
          value: name,
          onChange: (e) => setName(e.target.value),
        },
        {
          name: "image",
          label: "Image",
          type: "text",
          placeholder: "Image URL",
          value: image,
          onChange: (e) => setImage(e.target.value),
        },
        {
          name: "price",
          label: "Price",
          type: "text",
          placeholder: "Price",
          value: price,
          onChange: (e) => setPrice(e.target.value),
        },
        {
          name: "type",
          label: "Type",
          type: "autocomplete",
          placeholder: "Type",
          value: type,
          onChange: (value) => setType(value),
          options: types,
        },
      ],
    },
  ];

  return (
    <CreateDialog
      open={open}
      onClose={onClose}
      title="Add Product"
      sections={sections}
      onAdd={handleSubmit}
      showImage="image"
    />
  );
};

export default CreateProduct;
